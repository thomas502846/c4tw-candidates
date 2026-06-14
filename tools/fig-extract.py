#!/usr/bin/env python3
"""讀 Figma 本地 .fig 檔（Save local copy 匯出的），離線抽出：文字、嵌入圖、縮圖。
.fig = ZIP（canvas.fig + images/ + thumbnail.png + meta.json）。
canvas.fig = 'fig-kiwi' magic + uint32 version + block0(deflate=kiwi schema) + block1(zstd=資料樹)。
block1 解壓後可直接撈 UTF-8 文字；完整結構（顏色/座標/字級）需再用 block0 的 kiwi schema 解析。
用法：python3 tools/fig-extract.py <path.fig> <out_dir>
需要：pip install --user --break-system-packages zstandard
"""
import sys, os, zipfile, struct, zlib, re, zstandard
fig, out = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(out,'images'), exist_ok=True)
z=zipfile.ZipFile(fig)
# 圖 + 縮圖
for n in z.namelist():
    if n=='thumbnail.png': open(os.path.join(out,'thumbnail.png'),'wb').write(z.read(n))
    if n.startswith('images/') and z.getinfo(n).file_size>0:
        data=z.read(n); ext='jpg' if data[:3]==b'\xff\xd8\xff' else 'png'
        open(os.path.join(out,'images',n.split('/')[-1][:12]+'.'+ext),'wb').write(data)
# canvas.fig 文字
d=z.read('canvas.fig'); assert d[:8]==b'fig-kiwi'
pos=12
blen0=struct.unpack('<I',d[pos:pos+4])[0]; pos+=4+blen0
blen1=struct.unpack('<I',d[pos:pos+4])[0]; pos+=4
data=zstandard.ZstdDecompressor().decompress(d[pos:pos+blen1], max_output_size=500_000_000)
text=data.decode('utf-8','ignore')
frags=re.findall(r'[一-鿿，。：；（）、！？．・0-9A-Za-z／：\-]{4,}', text)
uniq=list(dict.fromkeys(f for f in frags if re.search(r'[一-鿿A-Za-z]', f)))
open(os.path.join(out,'design-text.txt'),'w').write('\n'.join(uniq))
print(f'抽出 {len(uniq)} 文字片段、圖 + 縮圖 → {out}')
