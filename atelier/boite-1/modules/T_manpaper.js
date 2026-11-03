/* ---------- les décors des manipulations, refaits en papier découpé (avec profondeur et ombres) ---------- */
function compose(canvas,pieces){const x=canvas.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,canvas.width,canvas.height);x.globalAlpha=1;x.filter='none';
  pieces.forEach(([p,d])=>{if(d>0){x.save();x.globalAlpha=.33+d*.05;x.filter=`blur(${3+d*1.5}px)`;x.drawImage(p.sh,5+d*3.5,7+d*4);x.restore()}x.drawImage(p.c,0,0)})}
const inplace=(cv,src)=>{cv.width=src.width;cv.height=src.height;cv.getContext('2d').drawImage(src,0,0)};
inplace(panSpr,bordered(panSpr,4));inplace(beamSpr,bordered(beamSpr,4));
const nightCard=(top='#1a1a5a',bot='#4a3488')=>cut(x=>{const g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,MS,MS);for(let i=0;i<90;i++)fp(x,'#fff6d8',c=>c.arc(rnd(0,MS),rnd(0,MS*.6),rnd(1,2.6),0,7))},{border:0,outline:0,crayon:.4});
/* théâtre */
{const sky=nightCard(),hills=cut(x=>fp(x,'#3a2c6a',c=>wave(c,560,24,3,1,-10,MS+10,MS+10)));
 const tiers=cut(x=>{[[330,92,'#b8a8d8'],[270,74,'#a898c8'],[210,56,'#9888b8']].forEach(([r,h,col])=>fp(x,col,c=>{c.ellipse(384,700,r,h+40,0,Math.PI,0);c.closePath()}));x.strokeStyle='rgba(60,40,80,.35)';x.lineWidth=2;[300,240].forEach(r=>{x.beginPath();x.ellipse(384,700,r,r*.3,0,Math.PI,0);x.stroke()})});
 const stage=cut(x=>{fp(x,'#d8c8a8',c=>c.ellipse(384,700,160,30,0,0,7));parent(x,{kind:'man',x:384,y:700,h:130,view:'front',armL:[-30,-30],armR:[40,-50]});x.save();x.translate(426,622);x.strokeStyle='#ffcf5a';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(-10,14);x.quadraticCurveTo(-18,-6,-12,-20);x.moveTo(10,14);x.quadraticCurveTo(18,-6,12,-20);x.moveTo(-14,-16);x.lineTo(14,-16);x.stroke();x.restore()});
 const cols=cut(x=>{[60,708].forEach(cx=>{fp(x,'#f0e6d2',c=>rrect(c,cx-26,330,52,440,6));fp(x,'#e0d4bc',c=>rrect(c,cx-36,314,72,22,5))})});
 compose(iliadeBG,[[sky,0],[hills,1]]);compose(theatreNight,[[sky,0],[hills,1],[tiers,2],[stage,3],[cols,4.5]])}
/* palais de Thamus */
{const wall=cut(x=>{x.fillStyle='#e8b878';x.fillRect(0,0,MS,MS);x.strokeStyle='rgba(150,90,40,.4)';x.lineWidth=3;x.lineCap='round';for(let r=0;r<8;r++)for(let k=0;k<9;k++){const px=40+k*80+(r%2)*40,py=50+r*92,s=(r*3+k)%4;x.beginPath();
   if(s===0){x.ellipse(px,py,16,8,0,0,7);x.moveTo(px+3,py);x.arc(px,py,3,0,7)}else if(s===1){x.arc(px,py-10,8,0,7);x.moveTo(px,py-2);x.lineTo(px,py+20);x.moveTo(px-10,py+4);x.lineTo(px+10,py+4)}else if(s===2){x.moveTo(px-14,py+10);x.quadraticCurveTo(px-4,py-14,px+10,py-4);x.lineTo(px+16,py-8);x.moveTo(px-2,py+2);x.lineTo(px-4,py+14)}else{for(let w=0;w<3;w++){x.moveTo(px-16,py-8+w*8);for(let u=-16;u<=16;u+=8)x.lineTo(px+u,py-8+w*8+((u/8)%2?-3:3))}}x.stroke()}},{border:0,outline:0,crayon:.4});
 const cols=cut(x=>{[150,618].forEach(cx=>{fp(x,'#d89a58',c=>rrect(c,cx-34,120,68,560,6));fp(x,'#2bb5b0',c=>rrect(c,cx-46,100,92,28,6));fp(x,'#4fae5a',c=>{c.moveTo(cx-46,104);c.quadraticCurveTo(cx,40,cx+46,104);c.closePath()});x.strokeStyle='rgba(120,60,20,.4)';x.lineWidth=3;for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(cx+k*16,130);x.lineTo(cx+k*16,670);x.stroke()}})});
 const floor=cut(x=>fp(x,'#c88a4a',c=>c.rect(-10,660,MS+20,120)));
 const pillar=cut(x=>{fp(x,'#f0c050',c=>rrect(c,374,296,20,196,6));fp(x,'#f0c050',c=>{c.moveTo(366,300);c.quadraticCurveTo(384,272,402,300);c.closePath()});fp(x,'#e0a838',c=>{c.moveTo(330,512);c.lineTo(438,512);c.lineTo(420,488);c.lineTo(348,488);c.closePath()});fp(x,'#2bb5b0',c=>c.rect(352,494,64,6));fp(x,'#2bb5b0',c=>c.arc(384,290,12,0,7))});
 compose(palaceBG,[[wall,0],[cols,1.4],[floor,2]])}
/* pierres → temple */
{const ground=cut(x=>{fp(x,'#7aa058',c=>wave(c,552,6,3,0,-10,MS+10,MS+10));fp(x,'#c8b48a',c=>rrect(c,150,538,468,20,6))});
 const stones=cut(x=>{for(let i=0;i<5;i++){const cx=200+i*92,h=110+(i%2)*24;fp(x,'#9a98b8',c=>{c.moveTo(cx-24,546);c.quadraticCurveTo(cx-28,546-h*.6,cx-16,546-h);c.quadraticCurveTo(cx,546-h-10,cx+18,546-h+4);c.quadraticCurveTo(cx+28,546-h*.5,cx+24,546);c.closePath()})}});
 const temple=cut(x=>{for(let i=0;i<5;i++){const cx=200+i*92;fp(x,'#f6eedc',c=>rrect(c,cx-17,360,34,180,4));fp(x,'#ece2cc',c=>rrect(c,cx-24,346,48,16,4))}fp(x,'#f2e8d4',c=>rrect(c,172,318,424,30,4));fp(x,'#f6eedc',c=>{c.moveTo(160,318);c.lineTo(384,236);c.lineTo(608,318);c.closePath()})});
 const pack=(pieces)=>{const o=mkC();compose(o,pieces);return o};
 inplace(SOL.ground,pack([[ground,1]]));inplace(SOL.stones,pack([[stones,2.5]]));inplace(SOL.temple,pack([[temple,2.5]]))}
/* port d'Alexandrie */
{const sky=nightCard('#141250','#2a3a7a'),sea=cut(x=>fp(x,'#2a3e8a',c=>wave(c,470,6,6,0,-10,MS+10,MS+10)));
 const lib=cut(x=>{fp(x,'#e6d4ae',c=>rrect(c,140,380,190,196,6));fp(x,'#c8463a',c=>{c.moveTo(124,384);c.lineTo(235,318);c.lineTo(346,384);c.closePath()});
   for(let r=0;r<3;r++)for(let k=0;k<4;k++){const px=160+k*42,py=400+r*52;fp(x,'#5a3418',c=>rrect(c,px,py,36,42,4));if(!(r===1&&k===2)){fp(x,'#f0e0b8',c=>c.arc(px+18,py+21,13,0,7));x.strokeStyle='rgba(120,80,40,.6)';x.lineWidth=1.5;x.beginPath();x.arc(px+18,py+21,6,0,7);x.stroke()}}});
 const tower=cut(x=>{fp(x,'#f2ece0',c=>{c.moveTo(500,540);c.lineTo(520,330);c.lineTo(590,330);c.lineTo(610,540);c.closePath()});fp(x,'#f4eee4',c=>rrect(c,532,250,46,82,4));fp(x,'#f6f0e6',c=>rrect(c,541,206,28,46,4));[[514,322,82],[528,244,54]].forEach(([a,b,w])=>fp(x,'#e8bc50',c=>rrect(c,a,b,w,9,3)));fp(x,'#3a3a5a',c=>c.ellipse(555,548,96,20,0,0,7))});
 compose(harborBG,[[sky,0],[sea,1],[lib,2.4],[tower,2.4]])}
/* les rouleaux de la prédiction : dessinés par Alice, découpés, empilés en pyramide sur un petit socle de papier */
const kidScroll=(()=>{const W=110,H=50,o=document.createElement('canvas');o.width=W;o.height=H;const x=o.getContext('2d');x.lineJoin='round';
  x.fillStyle='#f6e2a8';x.strokeStyle='#3a2414';x.lineWidth=3;x.beginPath();x.moveTo(18,10);x.lineTo(92,10);x.lineTo(92,40);x.lineTo(18,40);x.closePath();x.fill();x.stroke();
  [[18,25],[92,25]].forEach(([cx,cy])=>{x.fillStyle='#e8c87a';x.beginPath();x.ellipse(cx,cy,10,17,0,0,7);x.fill();x.stroke();x.beginPath();x.arc(cx,cy,4,0,7);x.stroke()});
  x.fillStyle='#e0445a';x.fillRect(50,9,8,32);x.strokeRect(50,9,8,32);x.strokeStyle='rgba(58,36,20,.45)';x.lineWidth=2;[22,30].forEach(y=>{x.beginPath();x.moveTo(32,y);x.lineTo(44,y);x.moveTo(64,y);x.lineTo(80,y);x.stroke()});return bordered(o,5)})();
const pileSpots=n=>{const rows=n<=1?[1]:n<=4?[2,2]:[4,3,3,2];const out=[];rows.forEach((k,r)=>{for(let i=0;i<k&&out.length<n;i++)out.push([(i-(k-1)/2)*38,-r*20])});return out};
pile=(c,x,y,n,sel)=>{const s=.6,w=kidScroll.width*s,h=kidScroll.height*s;c.save();c.globalAlpha=.35;c.filter='blur(5px)';c.fillStyle='#000';c.beginPath();c.ellipse(x+6,y+14,72,12,0,0,7);c.fill();c.restore();
  c.fillStyle='#8a5a34';c.strokeStyle='#3a2414';c.lineWidth=3;c.beginPath();c.moveTo(x-74,y+4);c.lineTo(x+74,y+4);c.lineTo(x+66,y+18);c.lineTo(x-66,y+18);c.closePath();c.fill();c.stroke();
  pileSpots(n).forEach(([dx,dy])=>c.drawImage(kidScroll,x+dx-w/2,y+dy-h+6,w,h));
  if(sel){c.save();c.strokeStyle='#ffd27a';c.lineWidth=5;c.setLineDash([12,8]);c.beginPath();c.ellipse(x,y-60,84,120,0,0,7);c.stroke();c.restore()}};
