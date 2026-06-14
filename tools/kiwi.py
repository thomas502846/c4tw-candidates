#!/usr/bin/env python3
"""最小 Kiwi（evanw/kiwi）解碼器 — Figma .fig canvas 用。
block0 = 編譯後 schema；block1 = 依 schema 編碼的訊息樹。"""
import struct

class BB:
    def __init__(self, data): self.d=data; self.i=0
    def byte(self):
        b=self.d[self.i]; self.i+=1; return b
    def bool(self): return self.byte()!=0
    def varuint(self):
        v=0; s=0
        while True:
            b=self.d[self.i]; self.i+=1
            v |= (b & 0x7f) << s
            if not (b & 0x80): break
            s+=7
        return v & 0xffffffff
    def varint(self):
        v=self.varuint()
        return (v>>1) ^ -(v&1)   # zigzag
    def varuint64(self):
        v=0; s=0
        while True:
            b=self.d[self.i]; self.i+=1
            v |= (b & 0x7f) << s
            if not (b & 0x80): break
            s+=7
        return v
    def varint64(self):
        v=self.varuint64(); return (v>>1)^-(v&1)
    def float(self):
        first=self.byte()
        if first==0: return 0.0
        bits = first | (self.byte()<<8) | (self.byte()<<16) | (self.byte()<<24)
        bits = ((bits<<23) | (bits>>9)) & 0xffffffff   # undo rotate-left-9
        return struct.unpack('<f', struct.pack('<I', bits))[0]
    def string(self):
        start=self.i
        while self.d[self.i]!=0: self.i+=1
        s=self.d[start:self.i].decode('utf-8','replace'); self.i+=1
        return s
    def eof(self): return self.i>=len(self.d)

BUILTIN={-1:'bool',-2:'byte',-3:'int',-4:'uint',-5:'float',-6:'string',-7:'int64',-8:'uint64'}
KIND={0:'ENUM',1:'STRUCT',2:'MESSAGE'}

def decode_schema(data):
    bb=BB(data); n=bb.varuint(); defs=[]
    for _ in range(n):
        name=bb.string(); kind=bb.byte(); fc=bb.varuint(); fields=[]
        for _ in range(fc):
            fn=bb.string(); ft=bb.varint(); arr=bb.byte(); val=bb.varuint()
            fields.append({'name':fn,'type':ft,'array':bool(arr),'value':val})
        defs.append({'name':name,'kind':KIND.get(kind,kind),'fields':fields})
    return defs

if __name__=='__main__':
    import zipfile,struct as st,zstandard,sys
    z=zipfile.ZipFile(sys.argv[1]); d=z.read('canvas.fig')
    pos=12; b0=st.unpack('<I',d[pos:pos+4])[0]; pos+=4
    import zlib; schema_raw=zlib.decompress(d[pos:pos+b0],-15); pos+=b0
    defs=decode_schema(schema_raw)
    print('定義數:',len(defs))
    from collections import Counter
    print('kind 分布:', Counter(x['kind'] for x in defs))
    # 印出幾個關鍵型別
    for d2 in defs:
        if d2['name'] in ('Message','NodeChange','Color','GUID','Paint'):
            print(f"\n=== {d2['name']} ({d2['kind']}) {len(d2['fields'])} fields ===")
            for f in d2['fields'][:18]:
                t=BUILTIN.get(f['type'], defs[f['type']]['name'] if 0<=f['type']<len(defs) else f['type'])
                print(f"  [{f['value']}] {f['name']}: {t}{'[]' if f['array'] else ''}")

# ---- message decoder ----
def build_enum_maps(defs):
    em={}
    for i,d in enumerate(defs):
        if d['kind']=='ENUM':
            em[i]={f['value']:f['name'] for f in d['fields']}
    return em

def decode_message_tree(data, defs, root_name='Message'):
    bb=BB(data)
    enum_maps=build_enum_maps(defs)
    by_name={d['name']:i for i,d in enumerate(defs)}
    import sys; sys.setrecursionlimit(100000)
    def read_builtin(t):
        if t==-1: return bb.bool()
        if t==-2: return bb.byte()
        if t==-3: return bb.varint()
        if t==-4: return bb.varuint()
        if t==-5: return bb.float()
        if t==-6: return bb.string()
        if t==-7: return bb.varint64()
        if t==-8: return bb.varuint64()
        raise ValueError(f'builtin {t}')
    def read_value(t):
        if t<0: return read_builtin(t)
        d=defs[t]
        if d['kind']=='ENUM':
            v=bb.varuint(); return enum_maps[t].get(v,v)
        if d['kind']=='STRUCT':
            return {f['name']: read_field(f) for f in d['fields']}
        # MESSAGE
        res={}; fmap={f['value']:f for f in d['fields']}
        while True:
            fid=bb.varuint()
            if fid==0: break
            f=fmap.get(fid)
            if f is None: raise ValueError(f"unknown field id {fid} in {d['name']}")
            res[f['name']]=read_field(f)
        return res
    def read_field(f):
        if f['array']:
            n=bb.varuint(); return [read_value(f['type']) for _ in range(n)]
        return read_value(f['type'])
    return read_value(by_name[root_name])
