#!/usr/bin/env python3
"""從 .fig 抽出每個文字節點的精確排版規格（離線、不限額）。
含 resync：遇到無法反解的 VECTOR 幾何節點時，往前掃描下一個節點起點續解，
所以幾乎所有節點（含後段/mobile 頁）都能抓到，只略過極少數壞掉的 vector glyph。
用法: python3 fig-text-styles.py <path.fig> <out.md>
需要: pip install --user --break-system-packages zstandard
"""
import sys, os, zipfile, struct, zlib, zstandard
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.setrecursionlimit(300000)
from kiwi import decode_schema, BB, build_enum_maps

fig, out = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(fig); d = z.read('canvas.fig')
pos = 12; b0 = struct.unpack('<I', d[pos:pos+4])[0]; pos += 4
schema = zlib.decompress(d[pos:pos+b0], -15); pos += b0
b1 = struct.unpack('<I', d[pos:pos+4])[0]; pos += 4
data = zstandard.ZstdDecompressor().decompress(d[pos:pos+b1], max_output_size=500_000_000)
defs = decode_schema(schema); by_name = {x['name']: i for i, x in enumerate(defs)}; em = build_enum_maps(defs)
NC = by_name['NodeChange']

def make_reader(bb):
    B = {-1: bb.bool, -2: bb.byte, -3: bb.varint, -4: bb.varuint, -5: bb.float, -6: bb.string, -7: bb.varint64, -8: bb.varuint64}
    def rv(t):
        if t < 0: return B[t]()
        D = defs[t]
        if D['kind'] == 'ENUM': v = bb.varuint(); return em[t].get(v, v)
        if D['kind'] == 'STRUCT': return {f['name']: rf(f) for f in D['fields']}
        res = {}; fm = {f['value']: f for f in D['fields']}
        while True:
            fid = bb.varuint()
            if fid == 0: break
            f = fm.get(fid)
            if f is None: raise ValueError('badfid')
            res[f['name']] = rf(f)
        return res
    def rf(f):
        if f['array']: n = bb.varuint(); return [rv(f['type']) for _ in range(n)]
        return rv(f['type'])
    return rv, rf

# 定位 nodeChanges 陣列起點
bb = BB(data); rv, rf = make_reader(bb)
fmap = {f['value']: f for f in defs[by_name['Message']]['fields']}
total = None; nc_start = None
while True:
    fid = bb.varuint()
    if fid == 0: break
    f = fmap.get(fid)
    if f['name'] == 'nodeChanges': total = bb.varuint(); nc_start = bb.i; break
    if f['array']:
        n = bb.varuint()
        for _ in range(n): rv(f['type'])
    else: rv(f['type'])

def try_node_at(i):
    b = BB(data); b.i = i; rv2, _ = make_reader(b)
    try:
        n = rv2(NC)
        if isinstance(n, dict) and n.get('type') and 'guid' in n: return n, b.i
    except Exception: pass
    return None, None

nodes = []; i = nc_start; skipped = 0
while len(nodes) < total and i < len(data):
    n, end = try_node_at(i)
    if n is not None: nodes.append(n); i = end
    else:
        j = i + 1; found = False
        while j < len(data) and j < i + 300000:
            if data[j] == 0x01:
                n2, end2 = try_node_at(j)
                if n2 is not None: skipped += 1; nodes.append(n2); i = end2; found = True; break
            j += 1
        if not found: break

texts = [n for n in nodes if n.get('type') == 'TEXT' and n.get('fontSize')]
def unit(u): return (f"{u.get('value')}{'%' if u.get('units')=='PERCENT' else 'px' if u.get('units')=='PIXELS' else ''}") if isinstance(u, dict) else u
def color(n):
    fl = n.get('fills') or []
    if fl and isinstance(fl, list) and isinstance(fl[0], dict) and fl[0].get('color'):
        c = fl[0]['color']; return '#%02x%02x%02x' % (round(c['r']*255), round(c['g']*255), round(c['b']*255))
    return ''
lines = [f"# Figma 文字節點排版規格（離線；{len(nodes)}/{total} 節點，{len(texts)} 文字節點，resync 跳過 {skipped}）", '']
for n in texts:
    fn = n.get('fontName', {}); fam = fn.get('family', '?') if isinstance(fn, dict) else fn
    style = fn.get('style', '') if isinstance(fn, dict) else ''
    td = n.get('textData', {}); txt = (td.get('characters', '') if isinstance(td, dict) else '').replace('\n', ' ')
    col = color(n)
    lines.append(f"- **{n.get('name','')[:28]}** | {fam} {style} {n['fontSize']}px | lh {unit(n.get('lineHeight'))} | ls {unit(n.get('letterSpacing'))}" + (f" | {col}" if col else '') + (f" | 「{txt[:46]}」" if txt else ''))
open(out, 'w').write('\n'.join(lines))
print(f"{len(nodes)}/{total} 節點、{len(texts)} 文字節點 → {out}")
