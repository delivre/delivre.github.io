/* ---------- le journal d'Alice : ses souvenirs sont des dessins découpés qui se dressent sur la page, façon Paper Mario ---------- */
const PAPERG=(()=>{const o=mkC(),x=o.getContext('2d');for(let i=0;i<16000;i++){x.fillStyle=Math.random()<.5?`rgba(255,255,255,${rnd(.04,.1)})`:`rgba(60,40,20,${rnd(.03,.07)})`;x.fillRect(rnd(0,MS),rnd(0,MS),rnd(1,2.2),rnd(1,2.2))}return o})();
// une pièce découpée : formes à plat, coups de crayon, un liseré blanc de papier tout autour, et son ombre
function cut(draw,{border=7,crayon=.5,shade=true,outline=2.2}={}){const o=mkC(),x=o.getContext('2d');draw(x);
  if(crayon){x.globalCompositeOperation='source-atop';x.lineCap='round';for(let i=0;i<1400*crayon;i++){const a=rnd(0,MS),b=rnd(0,MS),l=rnd(6,16),an=-.9+rnd(-.15,.15);x.strokeStyle=Math.random()<.55?`rgba(255,255,255,${rnd(.08,.18)})`:`rgba(0,0,0,${rnd(.06,.14)})`;x.lineWidth=rnd(1,2);x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*l,b+Math.sin(an)*l);x.stroke()}
    x.drawImage(PAPERG,0,0);if(shade){const g=x.createLinearGradient(0,0,MS*.4,MS);g.addColorStop(0,'rgba(255,245,225,.18)');g.addColorStop(1,'rgba(20,10,30,.16)');x.fillStyle=g;x.fillRect(0,0,MS,MS)}x.globalCompositeOperation='source-over'}
  const w=mkC(),wx=w.getContext('2d');wx.drawImage(o,0,0);wx.globalCompositeOperation='source-in';wx.fillStyle='#fffaf0';wx.fillRect(0,0,MS,MS);
  const ink=mkC(),ix=ink.getContext('2d');ix.drawImage(o,0,0);ix.globalCompositeOperation='source-in';ix.fillStyle='#2a1a22';ix.fillRect(0,0,MS,MS);
  const b=mkC(),bx=b.getContext('2d');if(border){for(let k=0;k<16;k++){const a=k/16*Math.PI*2;bx.drawImage(w,Math.cos(a)*border,Math.sin(a)*border)}bx.globalCompositeOperation='source-atop';bx.drawImage(PAPERG,0,0);bx.globalCompositeOperation='source-over'}if(outline)for(let k=0;k<12;k++){const a=k/12*Math.PI*2;bx.drawImage(ink,Math.cos(a)*outline,Math.sin(a)*outline)}bx.drawImage(o,0,0);
  const sh=mkC(),sx=sh.getContext('2d');sx.drawImage(b,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='#000';sx.fillRect(0,0,MS,MS);return{c:b,sh}}
const fp=(x,col,fn)=>{x.fillStyle=col;x.beginPath();fn(x);x.fill()};
const rrect=(c,x,y,w,h,r)=>{c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath()};
const wave=(x,y,amp,fr,ph,x0=0,x1=MS,bottom=MS)=>{x.moveTo(x0,bottom);x.lineTo(x0,y);for(let u=x0;u<=x1;u+=8)x.lineTo(u,y+Math.sin(u/MS*Math.PI*fr+ph)*amp);x.lineTo(x1,bottom);x.closePath()};
const BLACK={body:'#000',skin:'#000',hair:'#000',legs:'#000',shoes:'#000'};
const ALICE_C={body:'#4f8ee8',skin:'#ffe3d4',hair:'#f3c34e',legs:'#ffe3d4',shoes:'#ff9ccc'};
const parent=(x,spec)=>{const t=mkC(),tx=t.getContext('2d');const r=person(tx,Object.assign({raw:true,col:BLACK},spec));tx.globalCompositeOperation='source-in';tx.fillStyle='#14102a';tx.fillRect(0,0,MS,MS);x.drawImage(t,0,0);return r};
const doll=(x,spec)=>{const r=person(x,Object.assign({raw:true,col:ALICE_C},spec));return r};
// la page du journal : papier ligné, marge rouge, deux bouts de scotch
const PAGE=(()=>{const o=mkC(),x=o.getContext('2d');x.save();x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=18;x.shadowOffsetY=8;fp(x,'#f7f0de',c=>{c.moveTo(26,22);for(let u=26;u<742;u+=12)c.lineTo(u,22+rnd(-1.5,1.5));c.lineTo(742,746);for(let u=742;u>26;u-=12)c.lineTo(u,746+rnd(-1.5,1.5));c.closePath()});x.restore();
  x.save();x.beginPath();x.rect(26,22,716,724);x.clip();for(let y=96;y<740;y+=36){x.strokeStyle='rgba(90,130,200,.28)';x.lineWidth=1.4;x.beginPath();x.moveTo(26,y);x.lineTo(742,y);x.stroke()}x.strokeStyle='rgba(220,80,80,.45)';x.lineWidth=1.6;x.beginPath();x.moveTo(84,22);x.lineTo(84,746);x.stroke();
  x.drawImage(PAPERG,0,0);const g=x.createRadialGradient(384,384,200,384,384,560);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(120,80,30,.18)');x.fillStyle=g;x.fillRect(0,0,MS,MS);x.restore();
  [[70,18,-.5],[690,18,.45]].forEach(([a,b,r])=>{x.save();x.translate(a,b);x.rotate(r);x.fillStyle='rgba(240,230,190,.75)';x.fillRect(-40,-12,80,24);x.restore()});return o})();
// version papier : un panneau de carton ondulé, bordé d'une frise grecque peinte (terre cuite et noir), et une étiquette de papier collée pour le texte
const LABEL=mkC();
if(PAPER){const x=PAGE.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,MS,MS);
 const edge=(x0,y0,x1,y1,j)=>{const P=[];for(let u=x0;u<=x1;u+=14)P.push([u,y0+rnd(-j,j)]);for(let v=y0;v<=y1;v+=14)P.push([x1+rnd(-j,j),v]);for(let u=x1;u>=x0;u-=14)P.push([u,y1+rnd(-j,j)]);for(let v=y1;v>=y0;v-=14)P.push([x0+rnd(-j,j),v]);return P};
 const poly=(P)=>{x.beginPath();P.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath()};
 const B=edge(18,16,750,752,2);x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle='#b48a56';poly(B);x.fill();x.restore();
 x.save();poly(B);x.clip();for(let i=0;i<9000;i++){x.fillStyle=Math.random()<.5?`rgba(255,235,200,${rnd(.04,.12)})`:`rgba(70,40,15,${rnd(.04,.1)})`;x.fillRect(rnd(0,MS),rnd(0,MS),rnd(1,3),rnd(1,2))}
  // les cannelures du carton, visibles sur la tranche du haut, déchirée
  x.fillStyle='#e6d0a6';x.fillRect(0,14,MS,22);x.strokeStyle='#9a7040';x.lineWidth=3;x.beginPath();for(let u=0;u<=MS;u+=2)x.lineTo(u,25+Math.sin(u*.32)*8);x.stroke();x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,36,MS,4);
  // la frise grecque, peinte au pinceau
  const band=(y0,h)=>{x.fillStyle='#a84a2a';x.fillRect(40,y0,MS-80,h);x.strokeStyle='#1e1414';x.lineWidth=4;x.lineJoin='miter';for(let u=46;u<MS-60;u+=28){x.beginPath();x.moveTo(u,y0+h-5);x.lineTo(u,y0+5);x.lineTo(u+20,y0+5);x.lineTo(u+20,y0+h-10);x.lineTo(u+8,y0+h-10);x.lineTo(u+8,y0+12);x.lineTo(u+14,y0+12);x.stroke()}};
  band(46,26);band(714,26);
  x.drawImage(PAPERG,0,0);const g=x.createRadialGradient(384,384,220,384,384,560);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(60,30,10,.25)');x.fillStyle=g;x.fillRect(0,0,MS,MS);x.restore();
 // l'étiquette de papier collée, pour l'écriture d'Alice
 const y=LABEL.getContext('2d');const L=edge(60,506,726,708,2.5);y.save();y.shadowColor='rgba(0,0,0,.35)';y.shadowBlur=8;y.shadowOffsetY=4;y.fillStyle='#f6eedb';y.beginPath();L.forEach(([a,b],i)=>i?y.lineTo(a,b):y.moveTo(a,b));y.closePath();y.fill();y.restore();
 y.save();y.clip();y.drawImage(PAPERG,0,0);y.restore();
 [[94,512,-.4],[692,512,.4]].forEach(([a,b,r])=>{y.save();y.translate(a,b);y.rotate(r);y.fillStyle='rgba(235,220,180,.7)';y.fillRect(-26,-9,52,18);y.restore()})}
const easeBack=t=>{const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
// les pièces se dressent l'une après l'autre (pop !), puis respirent doucement, chacune à sa profondeur
// la lumière des souvenirs : un calque translucide entre les plans du fond, des rayons doux, des poussières qui flottent
const MOTES=[...Array(26)].map(()=>({x:rnd(80,690),y:rnd(60,520),r:rnd(1.4,3.2),s:rnd(.2,.6),ph:rnd(0,6)}));
const MLT=mkC(),mlx=MLT.getContext('2d');
function memLight(c0,T,t,P){if(!PAPER)return;const k=clamp((t-.6)/.8);if(k<=0)return;const c=mlx;c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-over';c.clearRect(0,0,MS,MS);c.save();c.globalCompositeOperation='lighter';
 for(let i=0;i<3;i++){const a=-.5+i*.18+Math.sin(T*.2+i)*.03,x0=600-i*70;const g=c.createLinearGradient(x0,0,x0-300,560);g.addColorStop(0,'rgba(255,230,180,.16)');g.addColorStop(1,'rgba(255,230,180,0)');c.fillStyle=g;c.beginPath();c.moveTo(x0-20,0);c.lineTo(x0+30,0);c.lineTo(x0-260+Math.sin(a)*40,560);c.lineTo(x0-380+Math.sin(a)*40,560);c.closePath();c.fill()}
 MOTES.forEach(m=>{const y=m.y-((T*m.s*18)%80),x=m.x+Math.sin(T*.7+m.ph)*10,al=.5+.5*Math.sin(T*1.3+m.ph);blob(c,x,y,m.r*5,`rgba(255,236,190,${.22*al})`);c.fillStyle=`rgba(255,246,220,${.7*al})`;c.beginPath();c.arc(x,y,m.r*.6,0,7);c.fill()});c.restore();
 if(P&&P[0]){c.globalCompositeOperation='destination-in';c.drawImage(P[0].c,0,0);c.globalCompositeOperation='source-over'}c0.save();c0.globalAlpha=k;c0.globalCompositeOperation='lighter';c0.drawImage(MLT,0,0);c0.restore()}
// la languette à tirer : chaque souvenir a un petit mécanisme de papier (le soleil se lève, les rideaux s'ouvrent…)
const TAB={p:0,drag:false,x0:0,L:80,used:0,need:false,rev:false,auto:0,note:''};
const TABFX={echo:{1:[0,-110]}};
const tabX=()=>626+TAB.p*TAB.L,tabHit=([x,y])=>x>tabX()-40&&x<tabX()+70&&y>286&&y<366;
// ce que la languette dévoile : ce qu'Alice a perdu, et qu'elle garde
const REVEAL=PAPER?{
 echo:()=>cut(x=>{parent(x,{kind:'girl',x:565,y:572,h:172,view:'back'});},{border:5,outline:0}),
 maman:()=>cut(x=>{fp(x,'#9a6a3a',c=>rrect(c,128,186,150,22,5));fp(x,'#7a4a26',c=>c.rect(128,204,150,4));[146,260].forEach(px=>fp(x,'#d8b878',c=>c.arc(px,197,4,0,7)));x.strokeStyle='#7a4a26';x.lineWidth=9;x.lineCap='round';x.beginPath();x.moveTo(200,204);x.lineTo(214,236);x.stroke();fp(x,'#9a6a3a',c=>c.arc(215,239,8,0,7));
   x.save();x.translate(220,282);x.rotate(-.18);
   fp(x,'#14102a',c=>c.ellipse(0,18,80,30,0,0,7));
   x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=2;x.beginPath();x.ellipse(0,18,72,24,0,Math.PI*.1,Math.PI*.9);x.stroke();
   fp(x,'#1c1630',c=>{c.moveTo(-40,14);c.bezierCurveTo(-44,-14,-38,-34,-30,-40);c.lineTo(30,-40);c.bezierCurveTo(38,-34,44,-14,40,14);c.ellipse(0,14,40,15,0,0,Math.PI,false);c.closePath()});
   fp(x,'#5a4630',c=>{c.moveTo(-41,4);c.ellipse(0,4,41,15,0,Math.PI,0,true);c.lineTo(40,14);c.ellipse(0,14,40,15,0,0,Math.PI,false);c.closePath()});
   fp(x,'#2c2444',c=>c.ellipse(0,-40,30,11,0,0,7));
   x.strokeStyle='#14102a';x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(-18,-40);x.quadraticCurveTo(0,-34,18,-40);x.stroke();
   x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=2;x.beginPath();x.moveTo(-34,-30);x.quadraticCurveTo(-38,-10,-36,2);x.stroke();
   x.restore()},{border:5,outline:0}),
 papa:()=>cut(x=>{x.save();x.translate(250,270);x.rotate(-.08);x.scale(1.75,1.75);fp(x,'#f6eedb',c=>{c.moveTo(-70,0);c.lineTo(0,6);c.lineTo(70,0);c.lineTo(70,-44);c.lineTo(0,-38);c.lineTo(-70,-44);c.closePath()});x.strokeStyle='rgba(120,90,60,.6)';x.lineWidth=1.5;x.beginPath();x.moveTo(0,6);x.lineTo(0,-38);x.stroke();
   x.font='600 19px Caveat, cursive';x.fillStyle='#22306e';x.fillText('pour Alice,',-62,-14);x.fillText('plus tard.',8,-12);x.restore()},{border:5,outline:1.4}),
 phare:()=>cut(x=>{const H=430;fp(x,'#1a1430',c=>{c.moveTo(186,H-2);c.lineTo(236,H-2);c.lineTo(228,H+8);c.lineTo(194,H+8);c.closePath()});fp(x,'#1a1430',c=>c.rect(209,H-34,3,32));fp(x,'#1a1430',c=>{c.moveTo(212,H-32);c.lineTo(232,H-10);c.lineTo(212,H-10);c.closePath()});fp(x,'#ffd27a',c=>c.arc(196,H-14,4,0,7))},{border:4,outline:0}),
 ia:()=>cut(x=>{x.save();x.translate(150,190);x.rotate(-.07);fp(x,'#fff3a8',c=>c.rect(-62,-50,124,104));fp(x,'rgba(240,228,190,.8)',c=>c.rect(-20,-60,40,16));x.font='600 32px Caveat, cursive';x.fillStyle='#22306e';x.fillText('Cherche',-50,-12);x.fillText('d’abord.',-50,20);x.font='600 24px Caveat, cursive';x.fillText('Papa',8,46);x.restore()},{border:4,outline:1.4})}:{};
const REVC={};function drawReveal(c,T,id){if(!REVEAL[id])return;const R=REVC[id]||(REVC[id]=REVEAL[id]());const a=TAB.rev?1:TAB.p;if(a<=.01)return;c.save();c.globalAlpha=a;
 if(id==='phare'){c.save();c.globalCompositeOperation='lighter';const ang=Math.sin(T*.9)*.5+Math.PI,L=420;const g=c.createLinearGradient(560,251,560+Math.cos(ang)*L,251+Math.sin(ang)*L*.3);g.addColorStop(0,'rgba(255,236,170,.85)');g.addColorStop(1,'rgba(255,236,170,0)');c.fillStyle=g;c.beginPath();c.moveTo(560,251);c.lineTo(560+Math.cos(ang-.08)*L,251+Math.sin(ang-.08)*L*.3-30);c.lineTo(560+Math.cos(ang+.08)*L,251+Math.sin(ang+.08)*L*.3+30);c.closePath();c.fill();blob(c,560,251,40,'rgba(255,236,170,.7)');blob(c,196,416,26,`rgba(255,210,120,${.5+.3*Math.sin(T*3)})`);c.restore()}
 if(id==='echo'){c.save();c.globalCompositeOperation='lighter';blob(c,565,500,80,'rgba(255,220,160,.35)');c.restore()}
 c.drawImage(R.c,0,0);c.restore()}
function tabReveal(){if(TAB.rev)return;TAB.rev=true;TAB.p=1;TAB.used=1;const n=TAB.note;JR.noteN=(JR.noteN||0)+1;JR.note={text:n,t0:performance.now()};sndPaper(.4,.3);sndTone(523,1.2,.05);say.className='jr';sayWho.textContent='';sayTxt.textContent='À retenir : '+n;say.hidden=false;waitTap=true}
function drawTab(c,T){if(!PAPER||!REVEAL[SCR.id]||!(TAB.need||TAB.rev))return;if(TAB.auto&&!TAB.rev)TAB.p=Math.min(1,(performance.now()-TAB.auto)/650);if(!TAB.drag&&!TAB.rev&&!TAB.auto)TAB.p*=.9;if(!TAB.rev&&TAB.p>.85)tabReveal();
const x=tabX(),y=296;
 // la bande de papier qui sort de derrière l'image : on voit qu'on tire un mécanisme, pas une étiquette qu'on arrache
 c.save();c.fillStyle=c.createPattern(KRAFTP||PAPERG,'repeat');c.fillRect(520,308,x-30-520+2,36);c.fillStyle='rgba(60,35,10,.22)';c.fillRect(520,308,x-30-520+2,3);c.fillRect(520,341,x-30-520+2,3);c.strokeStyle='rgba(120,80,40,.5)';c.setLineDash([5,6]);c.lineWidth=1.5;c.beginPath();c.moveTo(560,326);c.lineTo(x-44,326);c.stroke();c.restore();
 c.save();c.translate(x-30,y+30);c.scale(1.32,1.32);c.translate(-(x-30),-(y+30));c.save();c.shadowColor='rgba(20,10,0,.45)';c.shadowBlur=8;c.shadowOffsetY=4;c.fillStyle=c.createPattern(KRAFTP||PAPERG,'repeat');c.beginPath();c.moveTo(x-30,y);c.lineTo(x+46,y);c.quadraticCurveTo(x+58,y+30,x+46,y+60);c.lineTo(x-30,y+60);c.closePath();c.fill();c.restore();
 c.strokeStyle='rgba(120,80,40,.8)';c.lineWidth=2;c.beginPath();c.moveTo(x-30,y);c.lineTo(x+46,y);c.quadraticCurveTo(x+58,y+30,x+46,y+60);c.lineTo(x-30,y+60);c.stroke();
 c.font='700 26px Caveat, cursive';c.fillStyle='#5a3418';c.fillText('tirer',x-22,y+38);c.strokeStyle='#5a3418';c.lineWidth=3;c.beginPath();c.moveTo(x+22,y+30);c.lineTo(x+40,y+30);c.moveTo(x+32,y+22);c.lineTo(x+40,y+30);c.lineTo(x+32,y+38);c.stroke();c.restore();
 if(!TAB.rev&&typeof drawHand==='function'){const k=(T*.6)%1,e=clamp((k-.2)/.5);drawHand(c,x+8+e*70,y+44,k>.15&&k<.75)}}
function drawPieces(c,P,T,t){P.forEach((p,i)=>{const k=clamp((t-.15-i*.13)/.42),e=k<=0?0:easeBack(k);if(e<=0)return;const d=p.depth,dx=Math.sin(T*.55+d*1.3)*(1.5+d*1.6),dy=Math.cos(T*.4+d)*d*.6,piv=p.base||700;
  if(PAPER&&!p.vivid){const v=mkC(),vx=v.getContext('2d');vx.filter='saturate(1.45) brightness(1.05) contrast(1.04)';vx.drawImage(p.c,0,0);p.c=v;p.vivid=1}
  if(PAPER&&i>0&&P[i-1].depth<1.5&&d>=1.5){const b=P[0];if(!b.haze){b.haze=mkC();const hx=b.haze.getContext('2d');hx.drawImage(b.c,0,0);hx.globalCompositeOperation='source-in';hx.fillStyle='#fbf3e2';hx.fillRect(0,0,MS,MS)}c.save();c.globalAlpha=.18*e;c.drawImage(b.haze,Math.sin(T*.55)*1.5,0);c.restore()}
  c.save();c.translate(0,piv);c.scale(1,Math.max(.001,e));c.translate(dx,dy-piv);const fx=PAPER&&TABFX[SCR.id]&&TABFX[SCR.id][i];if(fx)c.translate(fx[0]*TAB.p,fx[1]*TAB.p);
  c.save();c.globalAlpha=.35+d*.05;c.filter=`blur(${3+d*1.5}px)`;c.drawImage(p.sh,5+d*3.5,7+d*4);c.restore();c.drawImage(p.c,0,0);c.restore()})}
const POP={};
const stripes=(x,X,Y,W,H,c1,c2,w=26)=>{fp(x,c1,c=>rrect(c,X,Y,W,H,20));x.save();x.beginPath();rrect(x,X,Y,W,H,20);x.clip();x.fillStyle=c2;for(let u=X;u<X+W;u+=w*2)x.fillRect(u,Y,w,H);x.restore()};
const plant=(x,px,py,s=1)=>{fp(x,'#d8744a',c=>{c.moveTo(px-26*s,py-50*s);c.lineTo(px+26*s,py-50*s);c.lineTo(px+20*s,py);c.lineTo(px-20*s,py);c.closePath()});[[-30,-120,-.5],[0,-150,0],[28,-118,.5],[-14,-96,-.25],[16,-100,.3]].forEach(([dx,dy,r])=>fp(x,'#4fae5a',c=>{c.ellipse(px+dx*s,py+dy*s,12*s,40*s,r,0,7)}))};
/* la chambre */
{const wallp=cut(x=>stripes(x,70,40,628,640,'#c9a6d8','#bb95cc'),{crayon:.35,border:0,outline:0});
 const win=cut(x=>{fp(x,'#1d2266',c=>rrect(c,400,96,240,300,26));fp(x,'#fff1c8',c=>c.arc(560,200,34,0,7));fp(x,'#1d2266',c=>c.arc(576,190,30,0,7));for(let i=0;i<26;i++)fp(x,'#fff6d8',c=>c.arc(rnd(420,620),rnd(120,380),rnd(1.2,2.6),0,7));
   x.strokeStyle='#7a4a2e';x.lineWidth=12;x.beginPath();x.moveTo(520,96);x.lineTo(520,396);x.moveTo(400,246);x.lineTo(640,246);x.stroke()});
 const curt=cut(x=>{[[392,1],[648,-1]].forEach(([cx,k])=>fp(x,'#e0709e',c=>{c.moveTo(cx-k*8,84);c.quadraticCurveTo(cx+k*46,130,cx+k*28,250);c.quadraticCurveTo(cx+k*8,330,cx+k*40,420);c.lineTo(cx-k*26,420);c.quadraticCurveTo(cx-k*32,250,cx-k*26,84);c.closePath()}));fp(x,'#7a4a2e',c=>rrect(c,380,76,280,14,6))});
 const bed=cut(x=>{fp(x,'#6a4aa0',c=>{c.moveTo(600,690);c.lineTo(600,470);c.quadraticCurveTo(630,440,662,470);c.lineTo(662,690);c.closePath()});
   fp(x,'#7aa6ea',c=>{c.moveTo(330,690);c.lineTo(330,560);c.quadraticCurveTo(340,520,400,520);c.quadraticCurveTo(520,506,610,516);c.lineTo(610,690);c.closePath()});
   for(let i=0;i<10;i++){const sx=rnd(350,590),sy=rnd(570,670);x.fillStyle='#fff3c0';x.beginPath();for(let k=0;k<10;k++){const a=k/10*Math.PI*2,rr=k%2?3:8;x.lineTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr)}x.fill()}
   fp(x,'#fffaf0',c=>c.ellipse(560,510,46,22,-.1,0,7));chibi(x,{x:548,y:600,h:120,view:'front',armL:[-200,0],armR:[200,0]});fp(x,'#7aa6ea',c=>{c.moveTo(470,690);c.lineTo(470,548);c.quadraticCurveTo(540,530,610,540);c.lineTo(610,690);c.closePath()})});
 const lamp=cut(x=>{fp(x,'#9a6a42',c=>rrect(c,140,560,96,130,8));fp(x,'#5a3a2a',c=>c.rect(184,470,8,92));fp(x,'#f6c453',c=>{c.moveTo(146,480);c.quadraticCurveTo(188,466,230,480);c.lineTo(216,430);c.quadraticCurveTo(188,420,160,430);c.closePath()})});
 let hands=null;const mom=cut(x=>{// maman assise au bord du lit, presque de face, les jambes croisées ; elle tourne la tête vers Alice
   x.save();x.translate(188,556);x.rotate(.06);fp(x,'#c8463a',c=>rrect(c,-36,-14,72,16,3));fp(x,'#fffaf0',c=>c.rect(-32,-3,64,4));x.restore();
   const K='#14102a';
   fp(x,K,c=>{// jambe du dessous, droite et fine, pied posé
     c.moveTo(440,566);c.lineTo(452,566);c.lineTo(450,676);c.lineTo(462,684);c.lineTo(460,690);c.lineTo(436,690);c.lineTo(438,676);c.closePath()});
   fp(x,K,c=>{// jambe croisée par-dessus, en biais, pointe du pied tendue
     c.moveTo(404,566);c.lineTo(420,566);c.bezierCurveTo(432,600,446,626,462,650);c.lineTo(476,664);c.lineTo(470,670);c.lineTo(452,660);c.bezierCurveTo(432,632,414,602,404,566);c.closePath()});
   fp(x,K,c=>{// robe : buste, taille fine, jupe jusqu'aux genoux
     c.moveTo(406,436);c.bezierCurveTo(400,462,410,480,414,496);c.bezierCurveTo(396,512,378,534,372,566);c.bezierCurveTo(372,582,392,588,420,584);c.bezierCurveTo(446,590,474,586,482,570);c.bezierCurveTo(476,540,462,512,446,496);c.bezierCurveTo(450,480,460,462,456,436);c.bezierCurveTo(442,428,420,428,406,436);c.closePath()});
   fp(x,K,c=>{c.moveTo(424,410);c.lineTo(438,410);c.lineTo(440,432);c.lineTo(422,432);c.closePath()});
   fp(x,K,c=>{// tête tournée vers Alice (profil vers la droite), cheveux longs sur l'épaule
     c.moveTo(416,392);c.bezierCurveTo(414,368,434,358,448,370);c.lineTo(454,384);c.lineTo(449,388);c.bezierCurveTo(450,398,444,408,432,410);c.bezierCurveTo(422,412,412,420,406,440);c.bezierCurveTo(400,430,404,404,416,392);c.closePath()});
   fp(x,K,c=>{// bras vers Alice, la main sur la couverture
     c.moveTo(452,440);c.bezierCurveTo(470,466,490,488,512,504);c.lineTo(530,506);c.bezierCurveTo(534,512,528,518,518,516);c.bezierCurveTo(496,512,474,494,446,462);c.closePath()});
   fp(x,K,c=>{// l'autre main posée sur le genou
     c.moveTo(410,440);c.bezierCurveTo(398,486,404,528,420,556);c.lineTo(432,556);c.bezierCurveTo(418,526,414,488,420,446);c.closePath()})});
 const fg=cut(x=>{// au premier plan : un ours en peluche et une pile de livres
   fp(x,'#b07a4a',c=>c.ellipse(118,690,34,40,0,0,7));fp(x,'#b07a4a',c=>c.arc(118,632,28,0,7));[-1,1].forEach(k=>fp(x,'#b07a4a',c=>c.arc(118+k*22,610,11,0,7)));fp(x,'#e8c49a',c=>c.ellipse(118,640,12,9,0,0,7));fp(x,'#2a1a10',c=>c.arc(108,626,3,0,7));fp(x,'#2a1a10',c=>c.arc(128,626,3,0,7));
   [[650,690,'#e0445a'],[656,664,'#4fae5a'],[648,640,'#4a86e0']].forEach(([bx,by,col],i)=>fp(x,col,c=>rrect(c,bx-46+i*3,by-24,92-i*6,24,4)))});
 POP.maman={P:[{...wallp,depth:0},{...win,depth:.6},{...curt,depth:1.1},{...bed,depth:1.8},{...lamp,depth:2.3},{...mom,depth:3},{...fg,depth:4.2}],
  fx:(c,T)=>{c.save();c.globalCompositeOperation='lighter';blob(c,188,455,150+8*Math.sin(T*6),'rgba(255,200,110,.5)');blob(c,188,460,44,'rgba(255,240,180,.65)');c.restore();NOTES.slice(0,4).forEach((n,i)=>{const k=(T*.12+n.p)%1;drawNote(c,400+i*34+Math.sin(T+i)*10,420-k*220,n.s,Math.sin(k*Math.PI)*.9)})}}}
/* la bibliothèque */
{const wallp=cut(x=>stripes(x,70,40,628,640,'#e8c890','#dcb87a',22),{crayon:.35,border:0,outline:0});
 const shelf=cut(x=>{fp(x,'#8a5530',c=>rrect(c,130,70,520,470,18));for(let r=0;r<4;r++)fp(x,'#5a3418',c=>c.rect(146,186+r*108,488,12))});
 const books=cut(x=>{for(let r=0;r<4;r++){let u=150;while(u<620){const w=rnd(18,30),h=rnd(64,92),t=rnd(-.06,.06);x.save();x.translate(u+w/2,186+r*108);x.rotate(t);fp(x,hsl([0,20,40,200,140,280][(Math.random()*6)|0],rnd(45,65),rnd(40,58)),c=>rrect(c,-w/2,-h,w,h,3));x.fillStyle='rgba(255,240,200,.65)';x.fillRect(-w/2+3,-h*.72,w-6,3);x.fillRect(-w/2+3,-h*.3,w-6,2);x.restore();u+=w+rnd(4,8)}}},{border:3,outline:1.4});
 const desk=cut(x=>{fp(x,'#6a3e22',c=>{c.moveTo(150,560);c.lineTo(650,560);c.lineTo(650,582);c.lineTo(626,582);c.lineTo(622,690);c.lineTo(604,690);c.lineTo(600,582);c.lineTo(200,582);c.lineTo(196,690);c.lineTo(178,690);c.lineTo(174,582);c.lineTo(150,582);c.closePath()});
   fp(x,'#3a2414',c=>c.rect(548,488,7,74));fp(x,'#f6c453',c=>{c.moveTo(512,494);c.quadraticCurveTo(551,480,590,494);c.lineTo(578,456);c.quadraticCurveTo(551,446,524,456);c.closePath()});
   fp(x,'#4a86e0',c=>c.arc(230,520,32,0,7));fp(x,'#4fae5a',c=>{c.ellipse(222,512,14,18,.4,0,7)});fp(x,'#6a3e22',c=>c.rect(226,552,8,10))});
 let pp;const ppl=cut(x=>{pp=parent(x,{kind:'man',x:320,y:690,h:325,view:'back',hat:'#000',scarf:'#000',armL:[-18,6],armR:[62,28]});
   if(pp.hr){x.save();x.translate(pp.hr[0]+10,pp.hr[1]-4);x.rotate(-.2);fp(x,'#d8323c',c=>rrect(c,-18,-13,36,26,3));fp(x,'#ffd27a',c=>c.rect(-18,-2,36,3));x.restore()}
   chibi(x,{x:478,y:692,h:140,view:'front',armL:[-140,10],armR:[-160,-10]})});
 const fg=cut(x=>plant(x,660,700,1.1));
 POP.papa={P:[{...wallp,depth:0},{...shelf,depth:.5},{...books,depth:1},{...desk,depth:1.9},{...ppl,depth:3},{...fg,depth:4.2}],
  fx:(c,T)=>{c.save();c.globalCompositeOperation='lighter';blob(c,551,470,150+6*Math.sin(T*6),'rgba(255,200,110,.5)');blob(c,551,476,44,'rgba(255,240,180,.65)');for(let i=0;i<22;i++){const k=(T*.05+i*.13)%1;c.fillStyle=`rgba(255,230,180,${.5*Math.sin(k*Math.PI)})`;c.fillRect(420+Math.sin(i*7)*130,640-k*320,2.5,2.5)}c.restore()}}}
/* la voûte */
{const glow=cut(x=>{const g=x.createLinearGradient(0,50,0,690);g.addColorStop(0,'#3a3a8a');g.addColorStop(.45,'#b07ab0');g.addColorStop(.75,'#f6b07a');g.addColorStop(1,'#ffd890');x.fillStyle=g;x.beginPath();rrect(x,90,50,588,640,22);x.fill();for(let i=0;i<30;i++)fp(x,'#fff6d8',c=>c.arc(rnd(110,660),rnd(70,240),rnd(1,2.2),0,7))},{crayon:.3,border:0,outline:0});
 const wall=cut(x=>{// la colline et ses pierres levées, au couchant
   fp(x,'#6a5a8a',c=>{c.moveTo(96,560);c.quadraticCurveTo(260,470,420,500);c.quadraticCurveTo(560,520,672,470);c.lineTo(672,690);c.lineTo(96,690);c.closePath()});
   [[170,520,.8],[250,492,1],[520,500,1.05],[610,486,.85]].forEach(([px,py,s])=>fp(x,'#8a7aa8',c=>{c.moveTo(px-14*s,py+10);c.lineTo(px-12*s,py-110*s);c.lineTo(px-30*s,py-112*s);c.lineTo(px-30*s,py-140*s);c.lineTo(px+30*s,py-140*s);c.lineTo(px+30*s,py-112*s);c.lineTo(px+12*s,py-110*s);c.lineTo(px+14*s,py+10);c.closePath()}));
   fp(x,'#5a4a7a',c=>{c.moveTo(96,640);c.quadraticCurveTo(384,600,672,640);c.lineTo(672,690);c.lineTo(96,690);c.closePath()})});
 const fam=cut(x=>{parent(x,{kind:'man',x:330,y:690,h:272,view:'back',hat:'#000',scarf:'#000',armL:[-14,6],armR:[22,0]});
   const K='#14102a';// maman, de dos, dans la même robe que le soir du lit
   fp(x,K,c=>{c.moveTo(430,606);c.lineTo(440,606);c.lineTo(439,684);c.lineTo(444,690);c.lineTo(428,690);c.lineTo(430,684);c.closePath();c.moveTo(452,606);c.lineTo(462,606);c.lineTo(463,684);c.lineTo(468,690);c.lineTo(452,690);c.lineTo(453,684);c.closePath()});
   fp(x,K,c=>{c.moveTo(428,500);c.bezierCurveTo(424,520,430,534,434,548);c.bezierCurveTo(418,566,404,588,402,612);c.bezierCurveTo(424,620,470,620,490,612);c.bezierCurveTo(488,588,474,566,458,548);c.bezierCurveTo(462,534,468,520,464,500);c.bezierCurveTo(452,494,440,494,428,500);c.closePath()});
   fp(x,K,c=>{c.moveTo(438,482);c.lineTo(454,482);c.lineTo(454,500);c.lineTo(438,500);c.closePath()});
   fp(x,K,c=>{c.ellipse(446,462,17,21,0,0,7)});fp(x,K,c=>{c.moveTo(430,460);c.bezierCurveTo(426,490,432,512,446,522);c.bezierCurveTo(460,512,466,490,462,460);c.closePath()});
   fp(x,K,c=>{c.moveTo(430,504);c.bezierCurveTo(418,524,408,544,398,560);c.lineTo(406,566);c.bezierCurveTo(418,548,428,530,438,512);c.closePath()});
   fp(x,K,c=>{c.moveTo(462,504);c.bezierCurveTo(470,526,474,548,476,566);c.lineTo(468,568);c.bezierCurveTo(464,548,460,528,454,510);c.closePath()});
   chibi(x,{x:388,y:696,h:124,view:'back',armL:[-16,0],armR:[16,0]})});
 const fg=cut(x=>{// au premier plan : herbes hautes et pierres, pas de bougies
   [[120,700],[648,700]].forEach(([px,py],i)=>{fp(x,'#7a6a9a',c=>{c.moveTo(px-60,py);c.quadraticCurveTo(px-50,py-56,px,py-62);c.quadraticCurveTo(px+50,py-56,px+60,py);c.closePath()});
     x.strokeStyle='#5a7a4a';x.lineWidth=5;x.lineCap='round';for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(px+k*12,py-40);x.quadraticCurveTo(px+k*16,py-100,px+k*22+(i?-8:8),py-130);x.stroke()}})});
 const sun=cut(x=>{fp(x,'#ffe0a0',c=>c.arc(384,500,46,0,7))},{border:0,outline:0,crayon:.2});
 POP.echo={P:[{...glow,depth:0},{...sun,depth:.5},{...wall,depth:1},{...fam,depth:2.6},{...fg,depth:4}],
  fx:(c,T)=>{
   NOTES.forEach((n,i)=>{const k=(T*.1+n.p)%1;drawNote(c,n.x+Math.sin(T*.8+i)*14,620-k*420,n.s*1.1,Math.sin(k*Math.PI)*.95)})}}}
/* le ponton */
{const H=430;
 const sky=cut(x=>{const g=x.createLinearGradient(0,50,0,H+10);g.addColorStop(0,'#2a2a7a');g.addColorStop(.55,'#8a5aa8');g.addColorStop(.85,'#f0a0a0');g.addColorStop(1,'#ffcf9a');x.fillStyle=g;x.beginPath();rrect(x,70,50,628,H+30,24);x.fill();for(let i=0;i<40;i++)fp(x,'#fff6d8',c=>c.arc(rnd(90,680),rnd(70,230),rnd(1,2.4),0,7))},{crayon:.4,border:0,outline:0});
 const clouds=cut(x=>{[[220,200,90],[520,160,110],[380,270,80]].forEach(([cx,cy,w])=>fp(x,'#ffd6e0',c=>{c.moveTo(cx-w,cy);c.quadraticCurveTo(cx-w*.7,cy-30,cx-w*.3,cy-18);c.quadraticCurveTo(cx,cy-46,cx+w*.4,cy-20);c.quadraticCurveTo(cx+w*.8,cy-26,cx+w,cy);c.closePath()}))});
 const sea1=cut(x=>{fp(x,'#3a4ea0',c=>wave(c,H-6,4,7,0,72,696,H+80))});
 const isle=cut(x=>{fp(x,'#5a5a8a',c=>{c.moveTo(470,H+10);c.quadraticCurveTo(500,H-24,560,H-22);c.quadraticCurveTo(620,H-24,650,H+10);c.closePath()});
   fp(x,'#fffaf0',c=>{c.moveTo(545,H-20);c.lineTo(575,H-20);c.lineTo(568,H-160);c.lineTo(552,H-160);c.closePath()});[[H-50,H-74],[H-110,H-132]].forEach(([a,b])=>fp(x,'#e0445a',c=>{c.moveTo(547,a);c.lineTo(573,a);c.lineTo(571,b);c.lineTo(549,b);c.closePath()}));
   fp(x,'#2a2a40',c=>c.rect(546,H-170,28,10));fp(x,'#ffe9a8',c=>c.rect(550,H-188,20,18));fp(x,'#e0445a',c=>{c.moveTo(542,H-188);c.quadraticCurveTo(560,H-218,578,H-188);c.closePath()})});
 const sea2=cut(x=>{fp(x,'#3e58b0',c=>wave(c,H+30,6,6,1.2,64,704,700));x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=3;x.lineCap='round';for(let i=0;i<12;i++){const a=rnd(100,660),b=rnd(H+80,680);x.beginPath();x.arc(a,b,10,Math.PI*1.1,Math.PI*1.9);x.stroke()}});
 const pier=cut(x=>{fp(x,'#b07240',c=>{c.moveTo(150,700);c.lineTo(450,700);c.lineTo(340,H+40);c.lineTo(270,H+40);c.closePath()});x.strokeStyle='#6a3e1e';for(let k=1;k<10;k++){const t=k/10,y=H+40+(700-H-40)*t*t;x.lineWidth=1.5+t*2;x.beginPath();x.moveTo(270-120*t*t,y);x.lineTo(340+110*t*t,y);x.stroke()}
   const pa=parent(x,{kind:'man',x:330,y:H+80,h:236,view:'back',hat:'#000',scarf:'#000',armL:[-14,0],armR:[128,-12]});const al=chibi(x,{x:290,y:H+88,h:96,view:'back',armL:[-14,0],armR:[150,0]});if(pa&&pa.hl)fp(x,'#14102a',c=>c.ellipse(pa.hl[0],pa.hl[1],5,4,0,0,7))});
 const fg=cut(x=>{// au premier plan : les deux poteaux du bout du ponton, reliés par une corde ; et la mouette
   const posts=[[176,700],[424,700]];x.strokeStyle='#e8d8b0';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(176,566);x.quadraticCurveTo(300,640,424,566);x.stroke();
   posts.forEach(([px,py])=>{fp(x,'#7a4a26',c=>rrect(c,px-18,py-140,36,150,8));fp(x,'#9a6236',c=>c.ellipse(px,py-140,18,7,0,0,7));x.strokeStyle='#5a3418';x.lineWidth=2;[40,80,120].forEach(dy=>{x.beginPath();x.moveTo(px-16,py-140+dy);x.lineTo(px+16,py-136+dy);x.stroke()})});
   fp(x,'#fffaf0',c=>{c.moveTo(200,130);c.quadraticCurveTo(215,115,232,128);c.quadraticCurveTo(248,115,264,130);c.quadraticCurveTo(248,124,232,136);c.quadraticCurveTo(215,124,200,130);c.closePath()})});
 POP.phare={P:[{...sky,depth:0,base:H},{...clouds,depth:.7,base:H},{...sea1,depth:1.1},{...isle,depth:1.6,base:H+10},{...sea2,depth:2.3},{...pier,depth:3.2},{...fg,depth:4.4}],
  fx:(c,T)=>{const L=[560,H-180],cc=Math.cos(T*.9),w=Math.abs(cc),dir=cc>0?1:-1;c.save();c.globalCompositeOperation='lighter';const gg=c.createLinearGradient(L[0],L[1],L[0]+dir*380,L[1]);gg.addColorStop(0,`rgba(255,240,180,${.6*w})`);gg.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=gg;
   c.beginPath();c.moveTo(L[0],L[1]);c.lineTo(L[0]+dir*380*w,L[1]-55*w);c.lineTo(L[0]+dir*380*w,L[1]+45*w);c.closePath();c.fill();blob(c,L[0],L[1],40+12*w,`rgba(255,236,170,${.7+.3*w})`);c.restore()}}}

/* ---------- l'écriture d'Alice, à la main, à côté des dessins ---------- */
const JR={items:[],cur:null,note:null};const INKC={alice:'#22306e',maman:'#22306e',papa:'#22306e'};const PRE={maman:'Maman : « ',papa:'Papa : « '};
function jWrite(who,t){t=String(t).replace(/ ([:;?!»])/g,'\u202f$1').replace(/« /g,'«\u202f');const text=((PRE[who]||'')+t+(PRE[who]?' »':'')).replace(/ ([:;?!»])/g,'\u202f$1').replace(/« /g,'«\u202f');JR.items.push({who,text,t0:performance.now()});if(JR.items.length>3)JR.items.shift()}
const jChars=it=>Math.floor((performance.now()-it.t0)/1000*42);
const jWriting=()=>{const it=JR.items[JR.items.length-1];return it&&jChars(it)<it.text.length};
function jFinish(){JR.items.forEach(it=>it.t0=-1e9)}
function jLines(c,text,w){const words=text.split(' '),out=[];let l='';words.forEach(wd=>{const t=l?l+' '+wd:wd;if(c.measureText(t).width>w&&l){out.push(l);l=wd}else l=t});if(l)out.push(l);return out}
// un cadre tracé à la main : quatre traits un peu tremblés qui dépassent aux coins
const WOB=[...Array(40)].map(()=>rnd(-1.6,1.6));
function handBox(c,x,y,w,h){c.beginPath();const seg=(x0,y0,x1,y1,o)=>{c.moveTo(x0,y0);for(let k=1;k<=8;k++){const t=k/8;c.lineTo(lerp(x0,x1,t)+WOB[(o+k)%40]*(y0===y1?0:1),lerp(y0,y1,t)+WOB[(o+k*3)%40]*(y0===y1?1:0))}};
  seg(x-6,y,x+w+8,y+2,0);seg(x+w,y-6,x+w-2,y+h+7,9);seg(x+w+5,y+h,x-4,y+h-2,17);seg(x+2,y+h+6,x,y-7,27);c.stroke()}
function drawJournal(c,T){c.save();c.textBaseline='alphabetic';
  if(JR.note){// Alice encadre l'essentiel au crayon, avec une petite étoile
    const k=clamp((performance.now()-JR.note.t0)/700);let fz=46;for(;fz>=32;fz-=2){c.font=`600 ${fz}px Caveat, "Patrick Hand", cursive`;if(jLines(c,JR.note.text,520).length<=2)break}
    const ls=jLines(c,JR.note.text,520),bh=ls.length*fz*1.15+30,by=624-bh/2;c.strokeStyle='#22306e';c.lineWidth=2.6;c.globalAlpha=k;handBox(c,110,by,560,bh);
    // de temps en temps, un petit dessin au stylo à côté du cadre, jamais au même endroit
    const dk=(JR.noteN||0)%3;if(dk){const px=dk===1?660:120,py=dk===1?by-10:by+bh+6;c.save();c.translate(px,py);c.rotate(dk===1?.15:-.1);c.beginPath();
      if(dk===1){for(let i=0;i<10;i++){const a=i/10*Math.PI*2-Math.PI/2,rr=i%2?6:14;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath()}else{c.moveTo(-14,4);c.quadraticCurveTo(-4,-12,6,0);c.quadraticCurveTo(14,10,22,-6);c.moveTo(-14,10);c.quadraticCurveTo(-4,-6,6,6);c.quadraticCurveTo(14,16,22,0)}c.stroke();c.restore()}
    let y=by+fz*.95+12;ls.forEach(l=>{c.fillText(l,390-c.measureText(l).width/2,y);y+=fz*1.15});if(waitTap){c.fillStyle='#c8902a';c.globalAlpha=.5+.5*Math.sin(T*4);c.font='26px serif';c.fillText('▸',700,736)}c.restore();return}
  let items=JR.items.slice(-2),fs=40,lines;const fit=()=>{for(fs=44;fs>=38;fs-=2){c.font=`600 ${fs}px Caveat, "Patrick Hand", cursive`;lines=0;items.forEach(it=>lines+=jLines(c,it.text,600).length);if(lines*(fs*1.15)<=(PAPER?150:190))return true}return false};
  if(!fit()){items=JR.items.slice(-1);if(!fit()){fs=38;c.font=`600 ${fs}px Caveat, "Patrick Hand", cursive`}}
  const lh=fs*1.15;let y=(PAPER?532:548)+lh*.85;items.forEach((it,i)=>{const old=i<items.length-1;c.fillStyle=INKC[it.who]||'#22306e';c.globalAlpha=old?.42:1;let n=jChars(it);for(const ln of jLines(c,it.text,600)){const s=ln.slice(0,Math.max(0,n));c.fillText(s,100,y);n-=ln.length+1;y+=lh}});
  c.globalAlpha=1;if(waitTap&&!jWriting()&&JR.items.length){c.fillStyle='#c8902a';c.globalAlpha=.5+.5*Math.sin(T*4);c.font='26px serif';c.fillText('▸',700,736)}c.restore()}

/* ---------- les manipulations sont collées dans le journal comme des cartes ---------- */
const CARD={x:74,y:44,k:.82,r:-.012};
const toManip=(cx,cy)=>{const dx=cx-CARD.x,dy=cy-CARD.y,co=Math.cos(-CARD.r),si=Math.sin(-CARD.r);return[(dx*co-dy*si)/CARD.k,(dx*si+dy*co)/CARD.k]};
const fromManip=(mx2,my2)=>{const co=Math.cos(CARD.r),si=Math.sin(CARD.r),x=mx2*CARD.k,y=my2*CARD.k;return[CARD.x+x*co-y*si,CARD.y+x*si+y*co]};
const cardTmp=mkC(),ctmp=cardTmp.getContext('2d');
// le grain des activités : coups de crayon, fibres du papier, un peu d'ombre sur les bords (comme les souvenirs)
const ACTGRAIN=(()=>{const o=mkC(),x=o.getContext('2d');x.lineCap='round';for(let i=0;i<2600;i++){const a=rnd(0,MS),b=rnd(0,MS),l=rnd(6,16),an=-.9+rnd(-.15,.15);x.strokeStyle=Math.random()<.55?`rgba(255,255,255,${rnd(.05,.12)})`:`rgba(0,0,0,${rnd(.04,.1)})`;x.lineWidth=rnd(1,2);x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*l,b+Math.sin(an)*l);x.stroke()}
 x.drawImage(PAPERG,0,0);const g=x.createRadialGradient(MS/2,MS/2,MS*.3,MS/2,MS/2,MS*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(40,20,10,.22)');x.fillStyle=g;x.fillRect(0,0,MS,MS);
 if(PAPER){const l=x.createRadialGradient(150,90,10,150,90,620);l.addColorStop(0,'rgba(255,236,190,.2)');l.addColorStop(.5,'rgba(255,236,190,.06)');l.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=l;x.fillRect(0,0,MS,MS)}return o})();
function drawCard(c,draw,T){ctmp.setTransform(1,0,0,1,0,0);ctmp.clearRect(0,0,MS,MS);draw(ctmp,T);if(!(SCR.obj&&SCR.obj.noGrain)){ctmp.globalCompositeOperation='source-atop';ctmp.drawImage(ACTGRAIN,0,0);ctmp.globalCompositeOperation='source-over'}
  c.save();c.translate(CARD.x,CARD.y);c.rotate(CARD.r);c.scale(CARD.k,CARD.k);c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=16;c.shadowOffsetY=8;c.fillStyle=PAPER?'#9a7448':'#fffaf0';c.fillRect(-16,-16,MS+32,MS+32);c.restore();
  if(PAPER){c.fillStyle='#e6d0a6';c.fillRect(-16,-16,MS+32,6);c.strokeStyle='#7a5630';c.lineWidth=2;c.beginPath();for(let u=-16;u<=MS+16;u+=2)c.lineTo(u,-13+Math.sin(u*.4)*2.5);c.stroke()}
  c.drawImage(cardTmp,0,0);c.restore();
  if(PAPER)[[CARD.x+4,CARD.y+4],[CARD.x+MS*CARD.k-4,CARD.y-6]].forEach(([a,b])=>{c.save();c.translate(a,b);const g=c.createRadialGradient(-3,-3,1,0,0,11);g.addColorStop(0,'#f3d48a');g.addColorStop(1,'#9a7030');c.fillStyle=g;c.beginPath();c.arc(0,0,10,0,7);c.fill();c.strokeStyle='rgba(60,40,10,.6)';c.lineWidth=1.5;c.beginPath();c.moveTo(-5,0);c.lineTo(5,0);c.stroke();c.restore()});
  else[[CARD.x+10,CARD.y-4,-.6],[CARD.x+MS*CARD.k-10,CARD.y-4,.6]].forEach(([a,b,r])=>{c.save();c.translate(a,b);c.rotate(r);c.fillStyle='rgba(240,230,190,.8)';c.fillRect(-36,-11,72,22);c.restore()})}

/* ---------- les sons : papier et petit pion de plastique ---------- */
const SND={ctx:null,on:true,noise:null,fx:null,vm:.7,ve:.8};try{SND.on=localStorage.getItem('nfox-son')!=='0';const v=JSON.parse(localStorage.getItem('nfox-vol')||'null');if(v){SND.vm=v[0];SND.ve=v[1]}}catch(_){}
function sndInit(){if(SND.ctx||!window.AudioContext&&!window.webkitAudioContext)return;try{SND.ctx=new (window.AudioContext||window.webkitAudioContext)();const n=SND.ctx.sampleRate*.6,b=SND.ctx.createBuffer(1,n,SND.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;SND.noise=b;SND.fx=SND.ctx.createGain();SND.fx.gain.value=SND.ve;SND.fx.connect(SND.ctx.destination)}catch(_){}}
// un glissement de papier très doux : bruit filtré grave, une seule montée, volume faible
function sndPaper(vol=.5,dur=.35){if(!SND.on||!SND.ctx)return;const a=SND.ctx,t=a.currentTime,s=a.createBufferSource();s.buffer=SND.noise;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(900,t);f.frequency.linearRampToValueAtTime(1600,t+dur*.5);f.frequency.linearRampToValueAtTime(700,t+dur);f.Q.value=.5;
  const g=a.createGain(),v=vol*.16;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur*1.2);s.connect(f).connect(g).connect(SND.fx);s.start(t,rnd(0,.2),dur*1.3)}
// une note douce (pour les pierres qui chantent)
function sndTone(fr,dur=1.2,vol=.18,when=0){if(!SND.on||!SND.ctx)return;const a=SND.ctx,t=a.currentTime+when;[1,2.01].forEach((m,i)=>{const o=a.createOscillator();o.type='sine';o.frequency.value=fr*m;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*(i?.25:1),t+.03);g.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(g).connect(SND.fx);o.start(t);o.stop(t+dur+.05)})}
// un petit bêlement de mouton
function sndBaa(){if(!SND.on||!SND.ctx)return;const a=SND.ctx,t=a.currentTime;const o=a.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(320,t);o.frequency.linearRampToValueAtTime(290,t+.45);const l=a.createOscillator();l.frequency.value=18;const lg=a.createGain();lg.gain.value=22;l.connect(lg).connect(o.frequency);
  const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=1100;f.Q.value=2;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.06);g.gain.linearRampToValueAtTime(.12,t+.3);g.gain.linearRampToValueAtTime(0,t+.5);o.connect(f).connect(g).connect(SND.fx);o.start(t);l.start(t);o.stop(t+.55);l.stop(t+.55)}
function sndPawn(){if(!SND.on||!SND.ctx)return;const a=SND.ctx,t=a.currentTime;const o=a.createOscillator();o.type='triangle';o.frequency.setValueAtTime(1500,t);o.frequency.exponentialRampToValueAtTime(700,t+.05);const g=a.createGain();g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.07);o.connect(g).connect(SND.fx);o.start(t);o.stop(t+.08);
  const s=a.createBufferSource();s.buffer=SND.noise;const f=a.createBiquadFilter();f.type='highpass';f.frequency.value=3000;const g2=a.createGain();g2.gain.setValueAtTime(.25,t);g2.gain.exponentialRampToValueAtTime(.001,t+.03);s.connect(f).connect(g2).connect(SND.fx);s.start(t,0,.04)}
function sndLid(){if(!SND.on||!SND.ctx)return;const a=SND.ctx,t=a.currentTime;
  const nz=(at,dur,f,q,vol,type='bandpass')=>{const s=a.createBufferSource();s.buffer=SND.noise;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=a.createGain();g.gain.setValueAtTime(0,t+at);g.gain.linearRampToValueAtTime(vol,t+at+.004);g.gain.exponentialRampToValueAtTime(.001,t+at+dur);s.connect(fl).connect(g).connect(SND.fx);s.start(t+at,Math.random()*.3,dur+.05)};
  if(PAPER){nz(0,.18,900,.8,.08);nz(.06,.12,2200,1.2,.05);// le rabat de carton qui se décolle
   nz(.22,.7,1600,.5,.035,'bandpass');nz(.3,.55,500,.6,.05,'lowpass');// le carton qui frotte en s'ouvrant
   nz(.95,.09,260,1.5,.14,'lowpass')}// le couvercle se pose, mat
  else{nz(0,.03,3200,2,.18);nz(.05,.025,2400,2,.12);
  nz(.25,.9,700,.7,.05,'lowpass')}}
// les petites pièces des manipulations deviennent elles aussi des bouts de papier découpés
function bordered(src,b=4){const o=document.createElement('canvas');o.width=src.width+2*b+8;o.height=src.height+2*b+10;const x=o.getContext('2d');const w=document.createElement('canvas');w.width=src.width;w.height=src.height;const wx=w.getContext('2d');wx.drawImage(src,0,0);wx.globalCompositeOperation='source-in';wx.fillStyle='#fffaf0';wx.fillRect(0,0,w.width,w.height);
  x.save();x.filter='blur(3px)';x.globalAlpha=.4;const s=document.createElement('canvas');s.width=w.width;s.height=w.height;const sx=s.getContext('2d');sx.drawImage(w,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='#000';sx.fillRect(0,0,s.width,s.height);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;x.drawImage(s,b+4+Math.cos(a)*b,b+6+Math.sin(a)*b)}x.restore();
  for(let k=0;k<16;k++){const a=k/16*Math.PI*2;x.drawImage(w,b+Math.cos(a)*b,b+Math.sin(a)*b)}x.drawImage(src,b,b);return o}
['moon','sun','scroll','boat'].forEach(k=>{SPR[k]=bordered(SPR[k],k==='scroll'?3:5)});
