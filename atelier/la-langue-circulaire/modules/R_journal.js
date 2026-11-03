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
  const band=(y0,h)=>{for(let u=60,k=0;u<MS-50;u+=46,k++)inkRing(x,u,y0+h/2,13,{seed:300+k+(y0|0),w:4.5,drops:1,wash:false,gap:k%3===0?.9:0,f:[{a:(k*1.7)%6.3,k:['blob','spike','tendril','hook'][k%4],s:1}]})};
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
const TABFX={};
const tabX=()=>626+TAB.p*TAB.L,tabHit=([x,y])=>x>tabX()-40&&x<tabX()+70&&y>286&&y<366;
// ce que la languette dévoile : ce qu'Alice a perdu, et qu'elle garde
const REVEAL=PAPER?{
 // la valise de Maman, au pied de l'escalier, déjà fermée
 escalier:()=>cut(x=>{fp(x,'#8a3a2e',c=>rrect(c,96,560,170,120,10));fp(x,'#6a2a22',c=>rrect(c,150,536,62,30,8));fp(x,'#efe6cf',c=>c.rect(96,610,170,8));fp(x,'#e8d8b0',c=>{c.moveTo(250,600);c.lineTo(290,620);c.lineTo(282,650);c.lineTo(244,632);c.closePath()});x.strokeStyle='#e8d8b0';x.lineWidth=3;x.beginPath();x.moveTo(240,600);x.lineTo(250,604);x.stroke();fp(x,'#2a2a30',c=>c.arc(122,688,9,0,7));fp(x,'#2a2a30',c=>c.arc(240,688,9,0,7))},{border:5,outline:1.4}),
 // la place de Papa est vide : il est au téléphone, dans une langue qu'Alice ne connaît pas
 canape:()=>cut(x=>{fp(x,'#fffaf0',c=>{c.ellipse(230,220,110,52,0,0,7);c.moveTo(190,262);c.lineTo(176,300);c.lineTo(214,266)});x.strokeStyle='#22306e';x.lineWidth=3;x.lineCap='round';const R=seeded(77);for(let k=0;k<3;k++){let px=150;x.beginPath();x.moveTo(px,200+k*20);while(px<300){const w=10+R()*18;for(let u=0;u<w;u+=3)x.lineTo(px+u,200+k*20-Math.abs(Math.sin(u*.8+R()*3))*8);px+=w+8;x.moveTo(px,200+k*20)}x.stroke()}
   fp(x,'#14102a',c=>rrect(c,196,382,22,44,5))},{border:5,outline:1.4}),
 // des mois plus tard : le cercle d'Alice, plié dans le passeport de Maman
 encre:()=>cut(x=>{x.save();x.translate(560,190);x.rotate(.1);fp(x,'#5a1e2a',c=>rrect(c,-110,-80,220,160,8));fp(x,'#efe6cf',c=>c.rect(-100,-72,96,144));fp(x,'#e6dcc2',c=>c.rect(4,-72,96,144));x.strokeStyle='#d8b04a';x.lineWidth=2;x.strokeRect(-92,-62,80,30);
   x.save();x.translate(30,10);x.rotate(-.25);fp(x,'#fbf8f0',c=>c.rect(-70,-50,140,100));x.save();x.beginPath();x.rect(-70,-50,140,100);x.clip();inkRing(x,30,10,58,{seed:9,w:9,f:[{a:.6,k:'tendril',s:1.4},{a:3.4,k:'splash',s:1}],drops:4});x.restore();x.strokeStyle='rgba(120,100,70,.5)';x.beginPath();x.moveTo(0,-50);x.lineTo(0,50);x.stroke();x.restore();x.restore()},{border:5,outline:1.4}),
 // plus tard dans la nuit : depuis l'escalier, Maman qui regarde encore la fin, toute seule (un croquis d'Alice)
 fin:()=>cut(x=>{x.save();x.translate(250,210);x.rotate(-.05);fp(x,'#f6f1e2',c=>c.rect(-160,-130,320,260));x.save();x.beginPath();x.rect(-160,-130,320,260);x.clip();
   fp(x,'#cfd9e2',c=>c.rect(40,-60,100,70));x.strokeStyle='#3a3a4a';x.lineWidth=3;x.strokeRect(40,-60,100,70);fp(x,'#d8904a',c=>rrect(c,-60,40,170,60,12));fp(x,'#14102a',c=>c.ellipse(20,24,16,20,0,0,7));fp(x,'#14102a',c=>{c.moveTo(-6,60);c.quadraticCurveTo(0,38,20,40);c.quadraticCurveTo(40,38,46,60);c.closePath()});
   for(let k=0;k<7;k++){fp(x,'#c9a678',c=>c.rect(-150+k*48,-130,14,260))}x.strokeStyle='rgba(60,58,70,.35)';x.lineWidth=1;for(let i=0;i<40;i++){x.beginPath();const a=rnd(-160,160),b=rnd(-130,130);x.moveTo(a,b);x.lineTo(a+8,b+12);x.stroke()}x.restore();x.restore()},{border:5,outline:1.4}),
 // au dos de la carte, tout petit, Maman avait écrit…
 ia:()=>cut(x=>{x.save();x.translate(260,200);x.rotate(-.06);fp(x,'#f6efe0',c=>c.rect(-190,-110,380,220));x.strokeStyle='rgba(120,100,70,.4)';x.lineWidth=2;x.beginPath();x.moveTo(60,-90);x.lineTo(60,90);x.stroke();x.font='600 40px Caveat, cursive';x.fillStyle='#6a1a2a';
   x.fillText('Je t’apprendrai',-176,-44);x.fillText('ce mot en rentrant.',-176,2);x.font='600 34px Caveat, cursive';x.fillText('Maman',-80,70);fp(x,'#c8463a',c=>c.rect(110,-90,58,70));x.restore()},{border:5,outline:1.4})}:{};
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
// la télévision : l'écran gris de brume, et dans la brume, la coquille (notre galet de papier, pas l'image du film)
const tvSet=(x,X,Y,W,H,scr='shell')=>{fp(x,'#2a2a30',c=>rrect(c,X-12,Y-12,W+24,H+24,10));const g=x.createLinearGradient(0,Y,0,Y+H);g.addColorStop(0,'#c9d6dc');g.addColorStop(1,'#eef2f0');x.fillStyle=g;x.fillRect(X,Y,W,H);
 if(scr==='shell'){fp(x,'#3e4247',c=>c.ellipse(X+W*.55,Y+H*.42,W*.07,H*.32,0,0,7));fp(x,'rgba(255,255,255,.7)',c=>c.ellipse(X+W*.5,Y+H*.82,W*.5,H*.1,0,0,7))}
 if(scr==='board'){fp(x,'#3e4247',c=>c.rect(X,Y+H*.75,W,H*.25));fp(x,'#ffffff',c=>c.rect(X+W*.3,Y+H*.25,W*.4,H*.32));x.font=`700 ${Math.round(H*.14)}px Georgia, serif`;x.fillStyle='#1d2a66';x.textAlign='center';x.fillText('HUMAIN',X+W*.5,Y+H*.47);x.textAlign='start';fp(x,'#f0e6d6',c=>c.ellipse(X+W*.5,Y+H*.66,W*.04,H*.1,0,0,7))}
 fp(x,'#2a2a30',c=>c.rect(X+W*.3,Y+H+12,W*.4,18))};
const tvGlow=(c,X,Y,T,r=200)=>{c.save();c.globalCompositeOperation='lighter';const f=.8+.12*Math.sin(T*7)+.06*Math.sin(T*13);blob(c,X,Y,r*f,`rgba(170,205,225,${.38*f})`);blob(c,X,Y,r*.4,`rgba(220,240,250,${.35*f})`);c.restore()};
const motes=(c,T,x0,x1,y0,y1)=>{c.save();c.globalCompositeOperation='lighter';for(let i=0;i<20;i++){const k=(T*.04+i*.13)%1;c.fillStyle=`rgba(220,236,250,${.45*Math.sin(k*Math.PI)})`;c.fillRect(x0+((i*97)%(x1-x0)),y1-k*(y1-y0),2.5,2.5)}c.restore()};
const banister=(x,x0,y0,x1,y1,n)=>{for(let i=0;i<=n;i++){const t=i/n,px=x0+(x1-x0)*t,py=y0+(y1-y0)*t;fp(x,'#efe2c6',c=>rrect(c,px-8,py-150,16,150,5));x.fillStyle='rgba(120,80,40,.3)';x.fillRect(px+3,py-146,4,142)}
 x.save();x.lineCap='round';x.strokeStyle='#8a5a34';x.lineWidth=22;x.beginPath();x.moveTo(x0-20,y0-150);x.lineTo(x1+20,y1-150);x.stroke();x.strokeStyle='#b07a45';x.lineWidth=8;x.beginPath();x.moveTo(x0-20,y0-156);x.lineTo(x1+20,y1-156);x.stroke();x.restore()};
const cardboard=(x,cx,cy,w,h,label,r=0,col='#22306e',box=false)=>{x.save();x.translate(cx,cy);x.rotate(r);if(box){fp(x,'#e8b84a',c=>c.rect(-w/2-8,-h/2-6,w+16,h+12));}fp(x,box?'#f6f2ea':'#d8b98a',c=>c.rect(-w/2,-h/2,w,h));x.font=`700 ${Math.round(h*.5)}px "Patrick Hand", Caveat, cursive`;x.fillStyle=col;x.textAlign='center';x.textBaseline='middle';x.fillText(label,0,4);x.restore()};
const sofa=(x,X,Y,W,H,col,col2)=>{fp(x,col2,c=>rrect(c,X,Y,W,H*.55,24));fp(x,col,c=>rrect(c,X-20,Y+H*.35,W+40,H*.65,18));fp(x,col2,c=>rrect(c,X-34,Y+H*.2,50,H*.8,16));fp(x,col2,c=>rrect(c,X+W-16,Y+H*.2,50,H*.8,16))};
/* 1. l'escalier : la nuit, en cachette, entre les barreaux ; Papa s'assoit à côté */
{const wall=cut(x=>stripes(x,70,40,628,640,'#3a3f6a','#343963'),{crayon:.35,border:0,outline:0});
 const room=cut(x=>{fp(x,'#5a3a4a',c=>c.rect(330,560,368,140));fp(x,'#c8463a',c=>c.ellipse(560,650,150,34,0,0,7));tvSet(x,500,380,150,110,'shell');
   sofa(x,430,580,240,110,'#d8904a','#c07a3a');
   fp(x,'#14102a',c=>{c.ellipse(560,560,30,36,0,0,7)});fp(x,'#14102a',c=>{c.moveTo(510,620);c.quadraticCurveTo(515,585,560,588);c.quadraticCurveTo(605,585,610,620);c.closePath()});fp(x,'#7a2a3a',c=>{c.moveTo(580,592);c.quadraticCurveTo(612,600,612,624);c.lineTo(574,624);c.closePath()})});
 const stairs=cut(x=>{for(let k=0;k<9;k++){const sx=70+k*0,sy=700-k*52,w=230+k*38;fp(x,'#c98a5a',c=>c.rect(70,sy-52,w,52));fp(x,'#9a6236',c=>c.rect(70,sy-12,w,12))}});
 const kids=cut(x=>{parent(x,{kind:'man',x:206,y:600,h:240,view:'front',seated:true,hat:'#000',armL:[-20,40],armR:[70,50]});chibi(x,{x:342,y:540,h:170,view:'front',armL:[-30,-120],armR:[30,120]})});
 const fg=cut(x=>banister(x,110,700,470,360,7));
 POP.escalier={P:[{...wall,depth:0},{...room,depth:.9},{...stairs,depth:1.6},{...kids,depth:2.5},{...fg,depth:3.8}],
  fx:(c,T)=>{tvGlow(c,575,435,T,220);motes(c,T,420,690,360,640)}}}
/* 2. le canapé : le carton « ALICE », le carton « MAMAN » ; Papa crie « Kangourou ! » de la cuisine */
{const wall=cut(x=>stripes(x,70,40,628,640,'#2f3a5c','#2a3454'),{crayon:.35,border:0,outline:0});
 const door=cut(x=>{fp(x,'#f2c46a',c=>c.rect(96,170,150,470));fp(x,'#e0a84a',c=>c.rect(96,560,150,80));parent(x,{kind:'man',x:170,y:636,h:300,view:'front',hat:'#000',scarf:'#000',armL:[-20,20],armR:[60,90]});fp(x,'#6a4a30',c=>c.rect(84,160,12,480));fp(x,'#6a4a30',c=>c.rect(246,160,12,480));fp(x,'#6a4a30',c=>c.rect(84,158,174,12))});
 const tv=cut(x=>tvSet(x,520,250,150,112,'board'));
 const couch=cut(x=>{sofa(x,300,470,370,190,'#d8904a','#c07a3a');parent(x,{kind:'woman',x:560,y:650,h:300,view:'front',seated:true,armL:[-150,10],armR:[150,-10]});cardboard(x,560,386,136,64,'MAMAN',.04,'#5a2a14')});
 const kid=cut(x=>{chibi(x,{x:400,y:700,h:190,view:'front',armL:[-165,20],armR:[165,-20]});cardboard(x,400,488,150,76,'ALICE',-.06,'#22306e',true)});
 const fg=cut(x=>{fp(x,'#7a4a2a',c=>rrect(c,500,676,200,26,8));fp(x,'#f6efe0',c=>c.ellipse(600,668,46,18,0,0,7));for(let i=0;i<14;i++)fp(x,'#fff6d0',c=>c.arc(570+rnd(0,60),660+rnd(-6,4),7,0,7));plant(x,120,700,1)});
 POP.canape={P:[{...wall,depth:0},{...door,depth:.7},{...tv,depth:1.1},{...couch,depth:1.9},{...kid,depth:2.9},{...fg,depth:4.1}],
  fx:(c,T)=>{tvGlow(c,595,306,T,200);c.save();c.globalCompositeOperation='lighter';blob(c,170,400,170,'rgba(255,200,110,.25)');c.restore()}}}
/* 3. l'encre : le stylo-plume de Maman, un cercle sur la feuille, une tache sur la nappe */
{const wall=cut(x=>{fp(x,'#3a4a5a',c=>rrect(c,70,40,628,640,20));fp(x,'#9aa8b0',c=>rrect(c,300,80,170,170,10));for(let i=0;i<10;i++)fp(x,'rgba(240,240,236,.45)',c=>c.arc(320+rnd(0,130),110+rnd(0,120),rnd(14,30),0,7));x.strokeStyle='#2a3036';x.lineWidth=10;x.strokeRect(300,80,170,170);x.beginPath();x.moveTo(385,80);x.lineTo(385,250);x.stroke()},{crayon:.35,border:0,outline:0});
 const lamp=cut(x=>{fp(x,'#2a2a30',c=>c.rect(381,40,6,120));fp(x,'#e8b84a',c=>{c.moveTo(330,200);c.quadraticCurveTo(384,140,438,200);c.closePath()})});
 const folks=cut(x=>{parent(x,{kind:'man',x:180,y:620,h:330,view:'front',hat:'#000',scarf:'#000',armL:[-15,10],armR:[70,80]});fp(x,'#f6efe0',c=>rrect(c,226,420,30,36,6));parent(x,{kind:'woman',x:560,y:610,h:330,view:'front',tilt:-14,armL:[-60,-50],armR:[20,30]});chibi(x,{x:384,y:520,h:150,view:'front',armL:[-40,40],armR:[40,-30]})});
 const table=cut(x=>{fp(x,'#e8eef4',c=>{c.moveTo(110,520);c.lineTo(660,520);c.lineTo(700,700);c.lineTo(70,700);c.closePath()});x.save();x.beginPath();x.moveTo(110,520);x.lineTo(660,520);x.lineTo(700,700);x.lineTo(70,700);x.closePath();x.clip();x.strokeStyle='rgba(90,130,200,.35)';x.lineWidth=12;for(let u=0;u<16;u++){x.beginPath();x.moveTo(60+u*44,520);x.lineTo(40+u*48,700);x.stroke()}for(let v=530;v<700;v+=40){x.beginPath();x.moveTo(40,v);x.lineTo(720,v);x.stroke()}x.restore();
   x.save();x.translate(384,600);x.rotate(-.06);fp(x,'#fbf8f0',c=>c.rect(-90,-56,180,112));inkRing(x,0,0,38,{seed:9,w:6,f:[{a:.6,k:'tendril',s:1.4},{a:3.4,k:'splash',s:1}],drops:6});x.restore();
   inkRing(x,520,650,20,{seed:14,w:16,f:[{a:1,k:'splash',s:1.6},{a:4,k:'blob',s:1.4}],col:'#1a1f3a',drops:14,wash:false})});
 const fg=cut(x=>{x.save();x.translate(250,660);x.rotate(-.5);fp(x,'#1a1a2a',c=>rrect(c,-60,-9,120,18,8));fp(x,'#d8b04a',c=>c.rect(20,-9,8,18));fp(x,'#c9c9c9',c=>{c.moveTo(-60,-6);c.lineTo(-86,0);c.lineTo(-60,6);c.closePath()});x.restore();fp(x,'#1a1f3a',c=>rrect(c,600,600,52,64,10));fp(x,'#2a2a30',c=>c.rect(612,584,28,18))});
 POP.encre={P:[{...wall,depth:0},{...lamp,depth:.6},{...folks,depth:1.6},{...table,depth:2.7},{...fg,depth:4}],
  fx:(c,T)=>{c.save();c.globalCompositeOperation='lighter';blob(c,384,230,240+8*Math.sin(T*5),'rgba(255,200,110,.32)');blob(c,384,206,50,'rgba(255,240,180,.6)');c.restore()}}}
/* 4. la fin du film : « Elle savait, et elle l'a fait quand même ? » — Papa passe un bras autour des deux */
{const wall=cut(x=>stripes(x,70,40,628,640,'#2a3150','#262c49'),{crayon:.35,border:0,outline:0});
 const frames=cut(x=>{[[150,120,110,80],[300,100,90,120],[460,130,120,90]].forEach(([a,b,w,h])=>{fp(x,'#c9a06a',c=>c.rect(a-8,b-8,w+16,h+16));fp(x,'#5a6a7a',c=>c.rect(a,b,w,h))})});
 const couch=cut(x=>{sofa(x,150,360,470,260,'#d8904a','#c07a3a');parent(x,{kind:'man',x:250,y:600,h:330,view:'front',seated:true,hat:'#000',armL:[-20,30],armR:[-110,70]});parent(x,{kind:'woman',x:520,y:600,h:320,view:'front',seated:true,tilt:-8,armL:[-60,-40],armR:[20,40]});chibi(x,{x:390,y:560,h:150,view:'front',armL:[-30,30],armR:[30,-30]})});
 const table=cut(x=>{fp(x,'#7a4a2a',c=>rrect(c,200,610,380,40,10));fp(x,'#5a3418',c=>c.rect(220,650,16,50));fp(x,'#5a3418',c=>c.rect(544,650,16,50));[[320,596],[440,598]].forEach(([a,b])=>{fp(x,'#f6efe0',c=>rrect(c,a-26,b-34,52,40,8));x.strokeStyle='#f6efe0';x.lineWidth=7;x.beginPath();x.arc(a+28,b-16,11,-1.4,1.4);x.stroke();fp(x,'#a8743a',c=>c.ellipse(a,b-32,22,6,0,0,7))})});
 const fg=cut(x=>{plant(x,640,700,1.05);fp(x,'#4a86e0',c=>rrect(c,90,660,90,24,4));fp(x,'#e0445a',c=>rrect(c,96,636,80,24,4))});
 POP.fin={P:[{...wall,depth:0},{...frames,depth:.6},{...couch,depth:1.7},{...table,depth:2.8},{...fg,depth:4}],
  fx:(c,T)=>{tvGlow(c,384,820,T,420);motes(c,T,140,620,200,620)}}}
/* 5. aujourd'hui : la chambre chez la tante ; la carte à un seul mot ; le carton et le carnet */
{const wall=cut(x=>stripes(x,70,40,628,640,'#7a8a98','#728291'),{crayon:.35,border:0,outline:0});
 const win=cut(x=>{fp(x,'#1d2440',c=>rrect(c,420,90,220,250,18));for(let i=0;i<40;i++)fp(x,'#f6f6f2',c=>c.arc(rnd(436,624),rnd(104,330),rnd(1.5,3.5),0,7));fp(x,'#e8ecef',c=>{c.moveTo(420,300);c.quadraticCurveTo(530,276,640,300);c.lineTo(640,340);c.lineTo(420,340);c.closePath()});x.strokeStyle='#e8e4da';x.lineWidth=10;x.strokeRect(420,90,220,250);x.beginPath();x.moveTo(530,90);x.lineTo(530,340);x.stroke()});
 const desk=cut(x=>{fp(x,'#9a6a42',c=>rrect(c,100,470,560,24,6));fp(x,'#7a4a2a',c=>c.rect(120,494,16,206));fp(x,'#7a4a2a',c=>c.rect(624,494,16,206));
   fp(x,'#c9a06a',c=>{c.moveTo(150,470);c.lineTo(300,470);c.lineTo(290,380);c.lineTo(160,380);c.closePath()});fp(x,'#b08a52',c=>{c.moveTo(160,380);c.lineTo(290,380);c.lineTo(310,350);c.lineTo(180,350);c.closePath()});
   x.save();x.translate(225,410);x.rotate(-.1);fp(x,'#5a4a3a',c=>rrect(c,-50,-34,100,64,4));fp(x,'#efe6cf',c=>rrect(c,-44,-28,88,52,3));x.strokeStyle='#2a2a4a';x.lineWidth=2;for(let k=0;k<4;k++){x.beginPath();x.moveTo(-36,-16+k*12);for(let u=0;u<70;u+=4)x.lineTo(-36+u,-18+k*12-Math.abs(Math.sin(u*.7))*5);x.stroke()}x.restore();
   fp(x,'#3a3036',c=>c.rect(560,380,8,90));fp(x,'#e8b84a',c=>{c.moveTo(530,390);c.quadraticCurveTo(564,360,598,390);c.closePath()})});
 const girl=cut(x=>{chibi(x,{x:430,y:700,h:220,view:'front',armL:[-140,20],armR:[30,-20]});x.save();x.translate(330,470);x.rotate(-.2);fp(x,'#f3ead6',c=>c.rect(-60,-40,120,80));x.font='600 34px Caveat, cursive';x.fillStyle='#5a1a2a';x.textAlign='center';x.fillText('~ ~~ ~',0,10);x.restore()});
 const fg=cut(x=>{[[90,700,'#b48a56'],[96,640,'#c9a06a'],[102,580,'#b48a56']].forEach(([a,b,col],i)=>{fp(x,col,c=>c.rect(a,b-60,150-i*10,60));x.strokeStyle='rgba(90,60,30,.6)';x.lineWidth=3;x.strokeRect(a,b-60,150-i*10,60);inkRing(x,a+40,b-30,16,{seed:5+i,w:5,drops:2})});plant(x,670,700,.95)});
 POP.ia={P:[{...wall,depth:0},{...win,depth:.6},{...desk,depth:1.7},{...girl,depth:2.8},{...fg,depth:4}],
  fx:(c,T)=>{c.save();c.globalCompositeOperation='lighter';blob(c,564,390,160+6*Math.sin(T*5),'rgba(255,200,110,.32)');c.restore();for(let i=0;i<24;i++){const k=(T*.05+i*.11)%1;c.fillStyle=`rgba(250,250,248,${.8*Math.sin(k*Math.PI)})`;c.beginPath();c.arc(440+((i*53)%190),100+k*230,2.4,0,7);c.fill()}}}}
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
