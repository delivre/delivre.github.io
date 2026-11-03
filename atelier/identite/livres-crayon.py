from PIL import Image,ImageDraw,ImageFilter
import numpy as np,random
def book(W,H,col,band='#f1dc9a',seed=0):
    r=random.Random(seed);im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rounded_rectangle([0,0,W-1,H-1],radius=3,fill=col)
    a=np.array(im).astype(float)
    x=np.linspace(0,1,W)[None,:,None];sh=0.82+0.3*np.sin(x*np.pi)**.6
    a[...,:3]*=sh;a=np.clip(a,0,255).astype(np.uint8);im=Image.fromarray(a);d=ImageDraw.Draw(im)
    for y in [int(H*.07),int(H*.11),int(H*.86),int(H*.9)]:d.rectangle([3,y,W-4,y+max(3,H//90)],fill=band)
    ty=int(H*.22)
    for k in range(r.randint(2,3)):
        w=int(W*r.uniform(.35,.6));d.rectangle([(W-w)//2,ty,(W+w)//2,ty+max(3,H//110)],fill=band);ty+=int(H*.035)
    d.line([1,2,1,H-3],fill=(255,255,255,60),width=2)
    return im
def pencil(L,h):
    im=Image.new('RGBA',(L,h+6),(0,0,0,0));d=ImageDraw.Draw(im)
    tip=int(h*2.2);er=int(h*1.4);fe=int(h*.9)
    d.rectangle([er+fe,0,L-tip,h],fill='#e8b03c');d.rectangle([er+fe,int(h*.62),L-tip,h],fill='#c98f22');d.rectangle([er+fe,int(h*.3),L-tip,int(h*.38)],fill='#f3cc66')
    d.polygon([(L-tip,0),(L-int(h*.6),int(h*.38)),(L-int(h*.6),int(h*.62)),(L-tip,h)],fill='#e9c99a')
    d.polygon([(L-int(h*.6),int(h*.38)),(L,int(h*.5)),(L-int(h*.6),int(h*.62))],fill='#3a3438')
    d.rectangle([er,0,er+fe,h],fill='#b9b6ae');d.line([er+fe//2,0,er+fe//2,h],fill='#8f8c86',width=1)
    d.rounded_rectangle([0,0,er+2,h],radius=h//3,fill='#c0624a')
    sh=Image.new('RGBA',im.size,(0,0,0,0));ImageDraw.Draw(sh).rectangle([4,h-1,L-6,h+4],fill=(0,0,0,110))
    sh=sh.filter(ImageFilter.GaussianBlur(3));sh.alpha_composite(im);return sh
def shadow(im,blur=10,off=(8,6),op=120):
    s=Image.new('RGBA',(im.width+60,im.height+60),(0,0,0,0));a=im.split()[3].point(lambda v:op if v>0 else 0)
    blk=Image.new('RGBA',im.size,(0,0,0,255));blk.putalpha(a);s.paste(blk,(30+off[0],30+off[1]),blk);return s.filter(ImageFilter.GaussianBlur(blur))
