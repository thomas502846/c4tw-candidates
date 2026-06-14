#!/usr/bin/env python3
"""從 .fig 抽出文字節點的精確排版規格（離線、不限額）。
用法: python3 tools/fig-text-styles.py <path.fig> <out.md>"""
import sys, zipfile, struct, zlib, zstandard
sys.path.insert(0, 'tools'); sys.setrecursionlimit(200000)
from kiwi import decode_schema, BB, build_enum_maps
fig, out = sys.argv[1], sys.argv[2]
z=zipfile.ZipFile(fig); d=z.read('canvas.fig')
pos=12; b0=struct.unpack('<I',d[pos:pos+4])[0]; pos+=4
schema=zlib.decompress(d[pos:pos+b0],-15); pos+=b0
b1=struct.unpack('<I',d[pos:pos+4])[0]; pos+=4
data=zstandard.ZstdDecompressor().decompress(d[pos:pos+b1], max_output_size=500_000_000)
defs=decode_schema(schema); by_name={x['name']:i for i,x in enumerate(defs)}; em=build_enum_maps(defs)
bb=BB(data); nodes=[]
B={-1:bb.bool,-2:bb.byte,-3:bb.varint,-4:bb.varuint,-5:bb.float,-6:bb.string,-7:bb.varint64,-8:bb.varuint64}
def rv(t):
    if t<0: return B[t]()
    D=defs[t]
    if D['kind']=='ENUM': v=bb.varuint(); return em[t].get(v,v)
    if D['kind']=='STRUCT': return {f['name']:rf(f) for f in D['fields']}
    res={}; fmap={f['value']:f for f in D['fields']}
    while True:
        fid=bb.varuint()
        if fid==0: break
        f=fmap.get(fid)
        if f is None: raise StopIteration
        res[f['name']]=rf(f)
    if D['name']=='NodeChange': nodes.append(res)
    return res
def rf(f):
    if f['array']: n=bb.varuint(); return [rv(f['type']) for _ in range(n)]
    return rv(f['type'])
try: rv(by_name['Message'])
except (StopIteration, IndexError, KeyError): pass
texts=[n for n in nodes if n.get('type')=='TEXT' and n.get('fontSize')]
lines=[f'# Figma 文字節點排版規格（離線抽取自 .fig；共 {len(nodes)} 節點解出、{len(texts)} 文字節點）','']
def fmt_unit(u):
    if not isinstance(u,dict): return u
    return f"{u.get('value')}{'%' if u.get('units')=='PERCENT' else 'px' if u.get('units')=='PIXELS' else ''}"
for n in texts:
    fn=n.get('fontName',{}); fam=fn.get('family','?') if isinstance(fn,dict) else fn
    style=fn.get('style','') if isinstance(fn,dict) else ''
    td=n.get('textData',{}); txt=td.get('characters','') if isinstance(td,dict) else ''
    name=n.get('name','')
    lines.append(f"- **{name[:30]}** | {fam} {style} {n['fontSize']}px | lh {fmt_unit(n.get('lineHeight'))} | ls {fmt_unit(n.get('letterSpacing'))}" + (f" | 文字「{txt[:40]}」" if txt else ''))
open(out,'w').write('\n'.join(lines))
print(f'{len(texts)} 文字節點 → {out}')
