"""Rasterize the app's simple line icons without external assets/dependencies."""
from pathlib import Path
import math, struct, zlib
SIZE, SCALE = 64, 3

def circle(x, y, r):
    return [(x+math.cos(t*math.pi/32)*r,y+math.sin(t*math.pi/32)*r) for t in range(65)]
paths = {
 'home': [[(10,28),(32,9),(54,28)],[(16,25),(16,54),(27,54),(27,38),(38,38),(38,54),(49,54),(49,25)]],
 'members':[circle(25,20,8),[(9,54),(10,42),(16,34),(33,34),(40,42),(41,54)],circle(46,23,6),[(45,36),(53,39),(57,48)]],
 'activities':[[(13,16),(51,16),(54,19),(54,52),(51,55),(13,55),(10,52),(10,19),(13,16)],[(21,8),(21,23)],[(43,8),(43,23)],[(11,29),(53,29)],[(20,39),(26,39)],[(37,39),(44,39)],[(20,47),(26,47)]],
 'mine':[circle(32,20,10),[(13,55),(14,44),(22,35),(42,35),(50,44),(51,55)]]
}
def distance(x,y,a,b):
    dx,dy=b[0]-a[0],b[1]-a[1]
    t=max(0,min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy or 1)))
    return math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)
def chunk(tag,data):
    return struct.pack('!I',len(data))+tag+data+struct.pack('!I',zlib.crc32(tag+data)&0xffffffff)
root=Path('src/assets/tabs');root.mkdir(exist_ok=True)
for name,lines in paths.items():
    segments=[(line[i],line[i+1]) for line in lines for i in range(len(line)-1)]
    for active,color in [(False,(80,76,67)),(True,(54,82,78))]:
        raw=bytearray()
        for y in range(SIZE):
            raw.append(0)
            for x in range(SIZE):
                covered=sum(min(distance(x+(sx+.5)/SCALE,y+(sy+.5)/SCALE,a,b) for a,b in segments)<1.6 for sy in range(SCALE) for sx in range(SCALE))
                raw.extend((*color,round(255*covered/(SCALE*SCALE))))
        png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',SIZE,SIZE,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(raw))+chunk(b'IEND',b'')
        (root/(name+('-active' if active else '')+'.png')).write_bytes(png)
