/* ---------- les activités : on comprend le phénomène en le vivant ---------- */
// chaque petit dessin devient une pièce de papier : coups de crayon, fibres, un peu de lumière, un liseré blanc
const paperize=(o,k=1)=>{const x=o.getContext('2d'),w=o.width,h=o.height;x.save();x.globalCompositeOperation='source-atop';x.lineCap='round';for(let i=0;i<w*h/90*k;i++){const a=rnd(0,w),b=rnd(0,h),l=rnd(4,10),an=-.9+rnd(-.2,.2);x.strokeStyle=Math.random()<.55?`rgba(255,255,255,${rnd(.1,.22)})`:`rgba(0,0,0,${rnd(.06,.14)})`;x.lineWidth=rnd(1,1.8);x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.cos(an)*l,b+Math.sin(an)*l);x.stroke()}
 x.drawImage(PAPERG,0,0);const g=x.createLinearGradient(0,0,w*.5,h);g.addColorStop(0,'rgba(255,245,225,.2)');g.addColorStop(1,'rgba(20,10,30,.18)');x.fillStyle=g;x.fillRect(0,0,w,h);x.restore();return o};
// chaque objet est une petite pièce découpée posée sur la carte : on voit son ombre, comme s'il se soulevait un peu
const lifted=(src,pad=14)=>{const o=document.createElement('canvas');o.width=src.width+pad*2;o.height=src.height+pad*2;const x=o.getContext('2d');const s2=document.createElement('canvas');s2.width=o.width;s2.height=o.height;const sx=s2.getContext('2d');sx.drawImage(src,pad,pad);sx.globalCompositeOperation='source-in';sx.fillStyle='rgba(30,15,5,.55)';sx.fillRect(0,0,o.width,o.height);
 x.filter='blur(5px)';x.drawImage(s2,5,8);x.filter='none';x.drawImage(src,pad,pad);return o};
const doodle=(w,h,fn)=>{const o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d');x.lineJoin=x.lineCap='round';x.strokeStyle='#3a2630';x.lineWidth=2.6;fn(x,w,h);const b=bordered(paperize(o),4);return PAPER?lifted(b):b};
// une étiquette de kraft, avec son œillet et un bout de ficelle (au lieu des cadres blancs cernés de noir)
const KRAFTP=(()=>{const o=document.createElement('canvas');o.width=o.height=128;const x=o.getContext('2d');x.fillStyle='#e8d5ac';x.fillRect(0,0,128,128);for(let i=0;i<900;i++){x.fillStyle=Math.random()<.5?`rgba(255,250,235,${rnd(.1,.3)})`:`rgba(120,80,40,${rnd(.06,.16)})`;x.fillRect(rnd(0,128),rnd(0,128),rnd(1,3),rnd(.6,1.4))}return o})();
// une bande de papier arrachée du carnet d'Alice : papier crème ligné, bords déchirés, un bout de scotch, un petit dessin à l'encre
function tagBox(c,X,Y,W,H,R){if(!PAPER){c.save();c.fillStyle='#fbf3df';c.strokeStyle='#2a1a22';c.lineWidth=3;c.beginPath();rrect(c,X,Y,W,H,R);c.fill();c.stroke();c.restore();return}
 c.save();const seed=Math.abs(Math.round(X*7+Y*13+W))%97;let r=seed;const rn=()=>{r=(r*37+11)%97;return r/97};
 const path=()=>{c.beginPath();c.moveTo(X,Y);for(let u=X;u<=X+W;u+=12)c.lineTo(u,Y+(rn()-.5)*2);for(let v=Y;v<=Y+H;v+=6)c.lineTo(X+W+(v/6%2?3:-1),v);for(let u=X+W;u>=X;u-=12)c.lineTo(u,Y+H+(rn()-.5)*2);for(let v=Y+H;v>=Y;v-=6)c.lineTo(X+(v/6%2?-3:1),v);c.closePath()};
 c.shadowColor='rgba(30,15,5,.35)';c.shadowBlur=6;c.shadowOffsetX=2;c.shadowOffsetY=4;path();c.fillStyle='#f8f1df';c.fill();c.shadowColor='transparent';
 c.save();path();c.clip();c.strokeStyle='rgba(90,130,200,.22)';c.lineWidth=1.3;for(let v=Y+H*.78;v>Y;v-=Math.max(20,H*.42)){c.beginPath();c.moveTo(X,v);c.lineTo(X+W,v);c.stroke()}
 if(W>140&&H<120){c.strokeStyle='rgba(210,80,80,.35)';c.beginPath();c.moveTo(X+30,Y);c.lineTo(X+30,Y+H);c.stroke()}c.drawImage(PAPERG,X,Y,W,H,X,Y,W,H);c.restore();
 c.save();c.translate(X+W*.5+(seed%2?-W*.35:W*.35),Y+2);c.rotate(seed%2?-.18:.2);c.fillStyle='rgba(240,228,190,.65)';c.fillRect(-22,-8,44,16);c.restore();
 if(W>140&&H<120){c.strokeStyle='#22306e';c.lineWidth=2.2;c.lineCap='round';const dx=X+15,dy=Y+H/2;c.beginPath();
  if(seed%3===0){for(let i=0;i<10;i++){const a=i/10*Math.PI*2-Math.PI/2,rr=i%2?3:8;c.lineTo(dx+Math.cos(a)*rr,dy+Math.sin(a)*rr)}c.closePath()}
  else if(seed%3===1){for(let a=0;a<11;a+=.4)c.lineTo(dx+Math.cos(a)*a*.75,dy+Math.sin(a)*a*.75)}
  else{c.moveTo(dx-6,dy-2);c.bezierCurveTo(dx-6,dy-9,dx,dy-8,dx,dy-3);c.bezierCurveTo(dx,dy-8,dx+6,dy-9,dx+6,dy-2);c.lineTo(dx,dy+6);c.closePath()}c.stroke()}
 c.restore()}

const F=(x,col,fn)=>{x.fillStyle=col;x.beginPath();fn(x);x.fill();x.stroke()};
const dropShadow=(c,x,y,w,h)=>{c.save();c.globalAlpha=.3;c.filter='blur(6px)';c.fillStyle='#000';c.beginPath();c.ellipse(x+6,y+8,w,h,0,0,7);c.fill();c.restore()};
const ringPlace=(c,x,y,T,on)=>{c.save();c.globalCompositeOperation='lighter';blob(c,x,y,70,on?'rgba(255,215,120,.45)':'rgba(255,240,210,.28)');c.globalCompositeOperation='source-over';c.fillStyle=on?'rgba(255,215,120,.25)':'rgba(255,240,200,.16)';c.strokeStyle=on?'rgba(255,215,120,1)':'rgba(255,240,190,1)';c.lineWidth=6;c.setLineDash([10,7]);c.lineDashOffset=-T*20;c.beginPath();c.ellipse(x,y,64,34,0,0,7);c.fill();c.stroke();c.restore()};

function drawHand(c,x,y,press,a=1){c.save();c.globalAlpha=a;if(press){c.strokeStyle='rgba(255,226,160,.9)';c.lineWidth=4;c.beginPath();c.arc(x,y,22+10*((performance.now()/400)%1),0,7);c.stroke()}
  c.translate(x,y);c.rotate(-.3);const s=press?.92:1;c.scale(s,s);c.fillStyle='#fffaf0';c.strokeStyle='#2a1a22';c.lineWidth=3;c.lineJoin='round';
  c.beginPath();rrect(c,-10,0,20,52,10);c.fill();c.stroke();[[12,30],[26,34],[38,40]].forEach(([dx,dy])=>{c.beginPath();rrect(c,dx-4,dy,15,26,7);c.fill();c.stroke()});
  c.beginPath();rrect(c,-14,40,60,50,18);c.fill();c.stroke();c.restore()}
const tutT=()=>performance.now()/1000;
// --- décor de papier pour l'aède : l'étagère, les disques de carton, le rideau, les confettis
const shelfP=(c,y)=>{c.save();c.shadowColor='rgba(20,10,0,.5)';c.shadowBlur=10;c.shadowOffsetY=6;c.fillStyle='#8a5a34';c.fillRect(60,y,648,16);c.restore();c.fillStyle='#b07a45';c.fillRect(60,y,648,5);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(60,y+14,648,2);[[120],[648]].forEach(([x])=>{c.fillStyle='#6a4426';c.beginPath();c.moveTo(x-10,y+16);c.lineTo(x+10,y+16);c.lineTo(x,y+40);c.closePath();c.fill()})};
const seatDisc=(c,x,y,n,hot,T)=>{c.save();c.shadowColor='rgba(20,10,0,.45)';c.shadowBlur=8;c.shadowOffsetY=5;c.fillStyle=c.createPattern(KRAFTP,'repeat');c.beginPath();c.ellipse(x,y,64,32,0,0,7);c.fill();c.restore();
 c.strokeStyle='rgba(120,80,40,.8)';c.lineWidth=3;c.beginPath();c.ellipse(x,y,64,32,0,0,7);c.stroke();c.strokeStyle='rgba(120,80,40,.35)';c.lineWidth=2;c.beginPath();c.ellipse(x,y,52,24,0,0,7);c.stroke();
 if(hot){c.save();c.globalCompositeOperation='lighter';blob(c,x,y,90,`rgba(255,215,130,${.35+.15*Math.sin(T*6)})`);c.restore()}
 if(n){c.font='700 40px Caveat, cursive';c.fillStyle='#5a3418';c.textAlign='center';c.textBaseline='middle';c.fillText(n,x,y+2);c.textAlign='start';c.textBaseline='alphabetic'}};
const curtain=(c,k,T)=>{if(k<=0)return;const w=MS/2*k;[[0,1],[MS,-1]].forEach(([x0,d])=>{c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=18;const x1=x0+d*w;const g=c.createLinearGradient(Math.min(x0,x1),0,Math.max(x0,x1),0);for(let i=0;i<=8;i++)g.addColorStop(i/8,i%2?'#a8262e':'#cc3a3a');c.fillStyle=g;c.beginPath();c.moveTo(x0,0);c.lineTo(x1,0);
  for(let v=0;v<=MS;v+=32)c.lineTo(x1+d*Math.sin(v*.05+T)*4*k,v);c.lineTo(x0,MS);c.closePath();c.fill();c.restore()});
 c.fillStyle='#8a1e26';c.beginPath();c.moveTo(0,0);c.lineTo(MS,0);c.lineTo(MS,50);for(let u=MS;u>=0;u-=48)c.quadraticCurveTo(u-24,82,u-48,50);c.closePath();c.fill();c.fillStyle='#e0b050';for(let u=24;u<MS;u+=48){c.beginPath();c.arc(u,72,6,0,7);c.fill()}};
const CONF=[];const confetti=(x,y,n=18)=>{for(let i=0;i<n;i++)CONF.push({x,y,vx:rnd(-4,4),vy:rnd(-9,-3),r:rnd(0,6),vr:rnd(-.3,.3),c:['#a84a2a','#e9c98a','#3b6fd6','#f3ead6','#8fae5a'][i%5],t:performance.now()})};
const drawConf=(c)=>{const now=performance.now();for(let i=CONF.length-1;i>=0;i--){const p=CONF[i],a=(now-p.t)/1000;if(a>1.6){CONF.splice(i,1);continue}p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;c.save();c.globalAlpha=Math.min(1,(1.6-a)*2);c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.fillRect(-6,-3,12,6);c.restore()}};

/* ---------- la langue circulaire : décors et outils communs ---------- */
// la vitre de la coquille : un écran de brume lumineuse, où l'encre apparaît
const FOGBG=(()=>{const o=mkC(),x=o.getContext('2d');const g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,'#cfd2d0');g.addColorStop(.45,'#ecebe5');g.addColorStop(1,'#c2c6c4');x.fillStyle=g;x.fillRect(0,0,MS,MS);
 for(let i=0;i<70;i++)blob(x,rnd(0,MS),rnd(0,MS),rnd(80,230),'rgba(255,255,255,.16)');for(let i=0;i<26;i++)blob(x,rnd(0,MS),rnd(MS*.5,MS),rnd(60,170),'rgba(120,128,132,.07)');
 for(let i=0;i<1400;i++)dab(x,rnd(0,MS),rnd(0,MS),rnd(20,60),rnd(4,9),rnd(-.1,.1),rnd(190,220),rnd(4,10),rnd(78,92),rnd(.05,.12));
 const v=x.createRadialGradient(MS/2,MS/2,MS*.3,MS/2,MS/2,MS*.72);v.addColorStop(0,'rgba(40,44,48,0)');v.addColorStop(1,'rgba(40,44,48,.35)');x.fillStyle=v;x.fillRect(0,0,MS,MS);return o})();
// le bureau de la linguiste, le soir : bois sombre, une lampe, une fenêtre dans la brume
const OFFICEBG=(()=>{const o=mkC(),x=o.getContext('2d');const g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,'#2b2f33');g.addColorStop(1,'#1d1f22');x.fillStyle=g;x.fillRect(0,0,MS,MS);
 for(let i=0;i<1600;i++)dab(x,rnd(0,MS),rnd(0,MS),rnd(24,56),rnd(6,12),rnd(-.2,.2),rnd(200,225),rnd(6,14),rnd(14,26),rnd(.15,.3));
 paintShape(x,c=>{c.beginPath();c.rect(470,40,250,250)},'#7f8a90',[470,40,250,250],{n:80,edge:'rgba(255,255,255,.2)'});for(let i=0;i<20;i++)blob(x,rnd(480,710),rnd(60,280),rnd(30,70),'rgba(235,236,232,.35)');
 x.fillStyle='#3a3026';x.fillRect(462,32,266,10);x.fillRect(462,288,266,10);x.fillRect(462,32,10,266);x.fillRect(718,32,10,266);x.fillRect(590,32,8,266);
 x.save();x.globalCompositeOperation='lighter';blob(x,120,120,260,'rgba(255,200,120,.22)');x.restore();
 paintShape(x,c=>{c.beginPath();c.rect(0,560,MS,208)},'#4a3626',[0,560,MS,208],{ang:0,n:160,edge:'rgba(255,220,170,.2)'});return o})();
const GSPR={};
const glyph=(g,r,col='#141414')=>{const k=g.seed+'|'+r+'|'+col+'|'+(g.gap||0);if(GSPR[k])return GSPR[k];const S=Math.ceil(r*2.9),o=document.createElement('canvas');o.width=o.height=S;inkRing(o.getContext('2d'),S/2,S/2,r,Object.assign({col,w:r*.11},g));return GSPR[k]=o};
// un cercle d'encre, entier ou en train de se tracer (k de 0 à 1 : l'encre part des deux bouts à la fois et se rejoint)
function drawGlyph(c,g,x,y,r,k=1,col='#141414',rot=0){const s=glyph(g,Math.round(r),col);c.save();c.translate(x,y);c.rotate(rot);if(k<1){const a0=(g.a0||0)+Math.PI,sp=Math.PI*k;c.beginPath();c.moveTo(0,0);c.arc(0,0,s.width,a0-sp,a0+sp);c.closePath();c.clip()}c.drawImage(s,-s.width/2,-s.height/2);c.restore()}
// des étiquettes-boutons, en bandes de papier du carnet d'Alice
// un texte qui rétrécit juste assez pour tenir dans sa bande de papier (jamais sous 28)
const fitTxt=(c,s,x,y,size,col,maxW,al='center')=>{c.save();let z=size;c.font=`600 ${Math.round(z*1.2)}px Caveat, "Patrick Hand", cursive`;while(z>28&&c.measureText(s).width>maxW){z-=1;c.font=`600 ${Math.round(z*1.2)}px Caveat, "Patrick Hand", cursive`}c.restore();txt(c,s,x,y,z,col,al)};
const btn=(c,x,y,w,h,label,on,size=38,col)=>{c.save();if(on){c.save();c.globalCompositeOperation='lighter';blob(c,x+w/2,y+h/2,w*.6,'rgba(255,214,130,.35)');c.restore()}tagBox(c,x,y,w,h,10);c.restore();fitTxt(c,label,x+w/2,y+h/2+2,size,col||(on?'#7a2a08':'#22306e'),w-24)};
const inR=(cx,cy,[x,y,w,h])=>cx>=x&&cx<=x+w&&cy>=y&&cy<=y+h;
const tapLine=(c,y,s='toucher pour continuer')=>txt(c,s,384,y,34,'#5a4a3a','center','600',true);
// un bandeau de papier pour les consignes en haut de la carte
const header=(c,l1,l2,y=26)=>{tagBox(c,26,y,716,l2?118:72,12);fitTxt(c,l1,384,y+36,38,'#22306e',680);if(l2)fitTxt(c,l2,384,y+84,34,'#3a2a20',680)};

/* 1. L'université — « Où sont les mots ? » : une langue parlée est une file de sons, sans espaces */
const VOY=[['a','patte'],['â','pâte'],['é','été'],['è','mère'],['e','le'],['eu','peu'],['eu','peur'],['i','ici'],['o','peau'],['o','pore'],['ou','loup'],['u','lune'],['an','blanc'],['on','bon'],['in','vin'],['un','brun']];
const FR_S=['la','lin','guis','te','re','gar','de','la','vi','tre'],FR_CUT=[0,3,6,7];        // la | linguiste | regarde | la | vitre
const AL_S=['ka','lu','mi','so','ta','ne','ru','ka','lu','po'];
const KALU={seed:31,a0:.3,f:[{a:-2.2,k:'hook',s:1.6},{a:.95,k:'hook',s:1.6},{a:-.6,k:'blob',s:1},{a:2.4,k:'spike',s:1.1},{a:3.6,k:'tendril',s:1,d:-1}]};
function mkMots(){const M={state:'predict',pick:-1,cuts:new Set(),done:false,t0:0,ok:false,
 hint:'Maman, dans son bureau : « Avant de parler aux visiteurs, une question. Combien de voyelles a le français… quand on le parle ? »',
 wantsTap:()=>['reveal','r1end','r2end','circle'].includes(M.state),
 syl(){return M.state.startsWith('r1')?FR_S:AL_S},
 pos(i,n){const w=n>8?68:70,x0=384-(n-1)*w/2;return[x0+i*w,430]},
 draw(c,T){c.drawImage(OFFICEBG,0,0);
  if(M.state==='predict'||M.state==='reveal'){header(c,'Combien de voyelles en français,','quand on le parle ?');
   if(M.state==='predict'){[['5',0],['11',1],['16',2]].forEach(([l,i])=>btn(c,104+i*200,250,160,110,l,M.pick===i,60))}
   else{const k=clamp((performance.now()-M.t0)/1400);VOY.forEach(([v,ex],i)=>{if(i/16>k)return;const col=i%4,row=i/4|0,x=40+col*178,y=176+row*96;tagBox(c,x,y,166,80,8);txt(c,v,x+44,y+40,46,'#7a2a08');txt(c,ex,x+112,y+42,30,'#3a2a20','center','600',true)});
    if(k>=1){tagBox(c,40,566,688,120,10);txt(c,'16 voyelles à l’oral, pour 5 lettres : a, e, i, o, u.',384,604,36,'#22306e');txt(c,'L’écrit ne montre pas tout ce qu’on entend.',384,650,36,'#22306e');tapLine(c,724)}}
   return}
  const S=M.syl(),n=S.length,r1=M.state.startsWith('r1');
  header(c,r1?'Une phrase, comme on l’entend : sans espaces.':'La voix des visiteurs, enregistrée.',r1?'Toucher entre deux sons pour séparer les mots.':'Où commencent leurs mots ? Couper où l’on veut.');
  // l'onde sonore, qui passe sous les syllabes
  c.save();c.strokeStyle='rgba(255,226,170,.55)';c.lineWidth=3;c.beginPath();for(let u=40;u<=728;u+=3){const a=Math.sin(u*.09+T*4)*Math.sin(u*.013+T)*34*(r1?1:1.2);u===40?c.moveTo(u,520+a):c.lineTo(u,520+a)}c.stroke();c.restore();
  S.forEach((s,i)=>{const[x,y]=M.pos(i,n);const lift=Math.sin(T*3-i*.5)*3;tagBox(c,x-30,y-34+lift,60,70,8);txt(c,s,x,y+2+lift,40,r1?'#22306e':'#3a3a3a')});
  for(let i=0;i<n-1;i++){const[x]=M.pos(i,n),gx=x+(M.pos(1,n)[0]-M.pos(0,n)[0])/2;if(M.cuts.has(i)){c.save();c.strokeStyle='#c8463a';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(gx+6,376);c.lineTo(gx-6,484);c.stroke();c.restore()}else{c.fillStyle='rgba(255,236,200,.35)';c.beginPath();c.arc(gx,470,5,0,7);c.fill()}}
  if(M.state==='r1'&&M.cuts.size===0){const[x]=M.pos(0,n);const k=(tutT()*.7)%1;drawHand(c,x+36,452,k<.5)}
  if(M.state==='r1'||M.state==='r2')btn(c,264,620,240,84,'C’est coupé',false,40);
  if(M.state==='r1end'){tagBox(c,40,566,688,150,10);if(M.ok){txt(c,'la | linguiste | regarde | la | vitre',384,602,38,'#22306e');txt(c,'Facile : on connaît déjà ces mots.',384,648,36,'#3a2a20')}else{txt(c,'la | linguiste | regarde | la | vitre',384,602,38,'#22306e');txt(c,'Presque. Et pourtant, on connaît ces mots.',384,648,36,'#3a2a20')}tapLine(c,696)}
  if(M.state==='r2end'){tagBox(c,40,566,688,150,10);txt(c,'9 endroits où couper : 512 découpages possibles.',384,602,36,'#22306e');txt(c,'Rien, dans le son, ne dit lequel est juste.',384,648,36,'#3a2a20');tapLine(c,696)}
  if(M.state==='circle'){const k=clamp((performance.now()-M.t0)/1800);c.save();c.globalAlpha=.94;c.fillStyle='#e9e8e2';c.fillRect(40,140,688,600);c.restore();
   drawGlyph(c,KALU,384,350,170,k);
   if(k>.6){c.save();c.strokeStyle='#c8463a';c.lineWidth=4;c.setLineDash([8,8]);[KALU.f[0].a,KALU.f[1].a].forEach(a=>{c.beginPath();c.arc(384+Math.cos(a)*170,350+Math.sin(a)*170,62,0,7);c.stroke()});c.restore()}
   if(k>=1){txt(c,'Écrit, le message reste sous les yeux.',384,566,38,'#22306e');fitTxt(c,'Le même trait revient deux fois : « ka-lu » ?',384,612,38,'#7a2a08',660);tapLine(c,700)}}},
 down(cx,cy){const now=performance.now();
  if(M.state==='predict'){[0,1,2].forEach(i=>{if(inR(cx,cy,[104+i*200,250,160,110])){M.pick=i;M.state='reveal';M.t0=now;sndPaper(.4,.3);showHint(i===2?'« Exactement : seize. L’écriture n’en montre que cinq. »':'« Seize ! a, â, é, è, e, eu, eu, i, o, o, ou, u, an, on, in, un. L’écriture n’en montre que cinq. »')}});return}
  if(M.state==='reveal'){if(now-M.t0<1400)return;M.state='r1';M.cuts=new Set();showHint('« D’abord en français. Coupe la phrase en mots. »');return}
  if(M.state==='r1end'){M.state='r2';M.cuts=new Set();showHint('« Maintenant leur langue. Pas un mot connu. Coupe-la comme tu peux. »');return}
  if(M.state==='r2end'){M.state='circle';M.t0=now;sndPaper(.4,.3);showHint('« Et si on l’écrivait ? »');return}
  if(M.state==='circle'){if(now-M.t0<1800)return;M.score=M.ok?1:0;M.done=true;return}
  if(M.state==='r1'||M.state==='r2'){if(inR(cx,cy,[264,620,240,84])){if(M.state==='r1'){M.ok=FR_CUT.every(i=>M.cuts.has(i))&&M.cuts.size===FR_CUT.length;if(!M.ok){M.cuts=new Set(FR_CUT)}M.state='r1end';sndTone(M.ok?659:440,.8,.08);showHint(M.ok?'« Sans réfléchir. Parce que tu connais déjà les mots. »':'« Presque. Tu les connais pourtant, ces mots. Et à l’oral, c’est encore plus traître : “une heure et demie” se prononce comme “une heure ennemie”. »')}
     else{M.state='r2end';sndTone(392,.8,.08);showHint('« Voilà ce que Louise a dit au colonel : avec un enregistrement, on ne peut rien faire. Il faut être en face. »')}return}
   const S=M.syl(),n=S.length,dx=M.pos(1,n)[0]-M.pos(0,n)[0];for(let i=0;i<n-1;i++){const gx=M.pos(i,n)[0]+dx/2;if(Math.abs(cx-gx)<dx*.45&&cy>360&&cy<500){if(M.cuts.has(i))M.cuts.delete(i);else M.cuts.add(i);sndPaper(.2,.15);return}}}},
 move(){},up(){},solve(){M.done=true}};return M}

/* 2. Le camp — « Gavagai ! » : un mot montré du doigt peut tout vouloir dire ; on ne le devine pas, on le demande */
const G_OUI=GLYPH(101,3),G_NON={...GLYPH(202,2),gap:.9},G_GAV=GLYPH(303,5);
const PICS={
 lapin:doodle(150,110,x=>{F(x,'#f6f2ea',c=>{c.ellipse(70,70,44,28,0,0,7)});F(x,'#f6f2ea',c=>c.ellipse(112,48,20,17,0,0,7));F(x,'#f6f2ea',c=>{c.ellipse(108,20,6,18,-.2,0,7)});F(x,'#f6f2ea',c=>{c.ellipse(120,20,6,18,.2,0,7)});F(x,'#f6f2ea',c=>c.arc(26,62,9,0,7));x.fillStyle='#2a1a22';x.beginPath();x.arc(118,46,3,0,7);x.fill();x.beginPath();x.moveTo(50,96);x.lineTo(30,104);x.moveTo(92,96);x.lineTo(118,104);x.stroke()}),
 dort:doodle(150,100,x=>{F(x,'#f6f2ea',c=>{c.ellipse(70,64,48,26,0,0,7)});F(x,'#f6f2ea',c=>c.ellipse(112,64,20,16,0,0,7));F(x,'#f6f2ea',c=>{c.ellipse(96,40,6,18,-1.1,0,7)});x.beginPath();x.moveTo(112,62);x.quadraticCurveTo(118,66,124,62);x.stroke();x.font='600 26px Caveat, cursive';x.fillStyle='#22306e';x.fillText('z',120,24);x.fillText('z',134,12)}),
 chien:doodle(160,110,x=>{F(x,'#b8865a',c=>{c.ellipse(76,58,46,20,-.1,0,7)});F(x,'#b8865a',c=>c.ellipse(128,40,20,16,0,0,7));F(x,'#8a5a34',c=>c.ellipse(122,30,8,14,.6,0,7));x.lineWidth=6;x.strokeStyle='#8a5a34';x.beginPath();x.moveTo(44,70);x.lineTo(18,92);x.moveTo(60,72);x.lineTo(56,100);x.moveTo(96,72);x.lineTo(118,96);x.moveTo(108,66);x.lineTo(132,86);x.moveTo(32,52);x.quadraticCurveTo(14,40,8,26);x.stroke();x.lineWidth=2.6;x.strokeStyle='#3a2630';x.beginPath();x.moveTo(2,60);x.lineTo(-10,60);x.moveTo(4,74);x.lineTo(-8,76);x.stroke()}),
 feuille:doodle(140,110,x=>{x.save();x.translate(70,56);x.rotate(-.5);F(x,'#c98a3a',c=>{c.moveTo(-40,0);c.quadraticCurveTo(0,-34,40,0);c.quadraticCurveTo(0,34,-40,0)});x.beginPath();x.moveTo(-40,0);x.lineTo(40,0);x.stroke();x.restore();x.strokeStyle='#8a9aa8';x.beginPath();x.moveTo(6,90);x.quadraticCurveTo(40,80,60,96);x.moveTo(20,104);x.quadraticCurveTo(60,94,90,104);x.stroke()}),
 balan:doodle(150,120,x=>{x.lineWidth=5;x.strokeStyle='#6a4a30';x.beginPath();x.moveTo(20,110);x.lineTo(40,8);x.lineTo(110,8);x.lineTo(130,110);x.stroke();x.lineWidth=2.6;x.strokeStyle='#3a2630';x.beginPath();x.moveTo(62,8);x.lineTo(56,78);x.moveTo(88,8);x.lineTo(94,78);x.stroke();F(x,'#c84a3a',c=>c.rect(50,76,50,8));x.strokeStyle='#8a9aa8';x.beginPath();x.arc(75,60,40,1.2,1.9);x.stroke()}),
 mur:doodle(150,110,x=>{for(let r=0;r<4;r++)for(let k=0;k<4;k++){F(x,'#b8aca0',c=>c.rect(8+k*34+(r%2)*16,8+r*24,30,20))}})};
const HYP=[['lapin',x=>x.lapin],['animal',null],['blanc',null],['oreille',null],['qui court',null],['qui bouge',null]];
// ce que dirait chaque hypothèse devant chaque objet (oui = 1) ; la vraie réponse : « ce qui s'enfuit »
const TESTS=[{k:'dort',n:'un lapin qui dort',h:[1,1,1,1,0,0],a:0},{k:'chien',n:'un chien qui court',h:[0,1,0,1,1,1],a:1},{k:'feuille',n:'une feuille qui s’envole',h:[0,0,0,0,0,1],a:1},{k:'balan',n:'une balançoire qui bouge',h:[0,0,0,0,0,1],a:0},{k:'mur',n:'le mur',h:[0,0,0,0,0,0],a:0}];
function mkGavagai(){const M={state:'learn',lstep:0,map:null,alive:[1,1,1,1,1,1],asked:[],show:null,t0:performance.now(),done:false,
 hint:'Au camp, Louise apprenait d’abord deux mots : oui et non. Elle montrait le carton ALICE… et le visiteur répondait.',
 wantsTap:()=>['learn','gav0','fin','fin2'].includes(M.state)&&M.state!=='learn'||M.state==='learn'&&M.lstep<2,
 draw(c,T){c.drawImage(FOGBG,0,0);const now=performance.now();
  if(M.state==='learn'){header(c,M.lstep<2?'Le carton ALICE, et ce qu’on désigne :':'Lequel de ces cercles veut dire « oui » ?');
   const pair=[[0,'Alice se désigne',G_OUI],[1,'Alice désigne le mur',G_NON]];
   pair.forEach(([i,l,g])=>{if(i>M.lstep&&M.lstep<2)return;const x=i?560:208;tagBox(c,x-130,170,260,64,10);txt(c,l,x,202,34,'#3a2a20');
    // le carton et le geste
    c.save();c.translate(x,300);tagBox(c,-70,-26,140,52,6);txt(c,'ALICE',0,2,36,'#22306e');c.restore();txt(c,i?'→ le mur':'→ moi',x,360,32,'#5a4a3a','center','600',true);
    const k=i===M.lstep?clamp((now-M.t0)/1300):1;drawGlyph(c,g,x,500,92,k);
    if(M.lstep>=2){const on=M.map===i;if(on){c.save();c.strokeStyle='#c8463a';c.lineWidth=5;c.beginPath();c.arc(x,500,128,0,7);c.stroke();c.restore()}}});
   if(M.lstep<2)tapLine(c,690,M.lstep===0?'toucher : Alice désigne le mur':'toucher pour continuer');
   else{txt(c,'Toucher le cercle du « oui ».',384,690,36,'#3a2a20');}return}
  if(M.state==='gav0'){header(c,'Un lapin détale derrière la vitre.','Le visiteur trace un cercle : « gavagai ».');const k=clamp((now-M.t0)/2200);
   const lx=lerp(80,700,clamp((now-M.t0)/1600));if(k<.8){c.save();c.globalAlpha=1-clamp((k-.6)/.2);c.drawImage(PICS.lapin,lx-75,560);c.restore()}
   drawGlyph(c,G_GAV,384,390,120,clamp((now-M.t0-500)/1600));if(k>=1){txt(c,'Gavagai : que veut dire ce mot ?',384,612,40,'#22306e');tapLine(c,690)}return}
  if(M.state==='ask'||M.state==='fin'||M.state==='fin2'){
   // les six idées
   tagBox(c,22,22,724,58,10);txt(c,'« Gavagai », ça veut dire…',384,52,36,'#22306e');
   HYP.forEach(([l],i)=>{const x=34+(i%3)*240,y=96+(i/3|0)*76;const al=M.alive[i];c.save();c.globalAlpha=al?1:.45;tagBox(c,x,y,224,62,8);txt(c,l,x+112,y+32,38,al?'#22306e':'#6a5a5a');c.restore();
    if(!al){c.save();c.strokeStyle='#c8463a';c.lineWidth=5;c.beginPath();c.moveTo(x+12,y+40);c.lineTo(x+212,y+24);c.stroke();c.restore()}});
   if(M.state==='ask'){
    if(M.show){const t=TESTS[M.show.i],k=clamp((now-M.show.t0)/900);c.save();c.globalAlpha=Math.min(1,k*2);const p=PICS[t.k];c.drawImage(p,190-p.width/2,360-p.height/2);c.restore();txt(c,'« Gavagai ? »',190,452,38,'#22306e');
      const k2=clamp((now-M.show.t0-700)/1200);if(k2>0)drawGlyph(c,t.a?G_OUI:G_NON,540,360,82,k2);if(k2>=1)txt(c,t.a?'oui':'non',540,470,44,t.a?'#2a6a3a':'#9a3a1a')}
    else{txt(c,'Lui montrer quelque chose, et lui demander :',384,330,36,'#3a2a20');txt(c,'« Gavagai ? »',384,380,46,'#22306e')}
    TESTS.forEach((t,i)=>{const x=24+i*146,y=530,used=M.asked.includes(i);c.save();c.globalAlpha=used?.4:1;tagBox(c,x,y,138,190,10);const p=PICS[t.k],s=Math.min(1,120/p.width);c.save();c.translate(x+69,y+70);c.scale(s,s);c.drawImage(p,-p.width/2,-p.height/2);c.restore();const ls=(()=>{c.font='600 34px Caveat, cursive';return jLines(c,t.n,124)})();ls.slice(0,2).forEach((l,j)=>txt(c,l,x+69,y+140+j*32,30,'#3a2a20'));c.restore()});
    if(!M.asked.length){const k=(tutT()*.7)%1;drawHand(c,96,610,k<.5)}}
   if(M.state==='fin'){tagBox(c,40,320,688,330,12);txt(c,'Aucune de nos six idées ne tient !',384,366,40,'#7a2a08');txt(c,'Le lapin qui détale, le chien, la feuille… oui.',384,420,36,'#3a2a20');txt(c,'Le lapin qui dort, la balançoire… non.',384,466,36,'#3a2a20');
    txt(c,'Gavagai voulait dire : « ce qui s’enfuit ».',384,532,42,'#22306e');txt(c,`${M.asked.length} questions posées`,384,590,36,'#5a4a3a');tapLine(c,690)}
   if(M.state==='fin2'){tagBox(c,40,320,688,330,12);txt(c,'Un seul exemple : six sens possibles.',384,380,40,'#22306e');txt(c,'Des questions, des oui, des non :',384,446,38,'#3a2a20');txt(c,'et le sens qu’on n’avait pas imaginé.',384,494,38,'#3a2a20');txt(c,'Un mot ne se devine pas. Il se demande.',384,566,40,'#7a2a08');tapLine(c,690)}}},
 down(cx,cy){const now=performance.now();
  if(M.state==='learn'){if(M.lstep<2){if(now-M.t0<1300)return;M.lstep++;M.t0=now;if(M.lstep===1)showHint('Puis elle montrait le carton ALICE en désignant le mur. Le visiteur répondait autrement.');else showHint('Deux réponses. L’une veut dire oui, l’autre non. Laquelle est le « oui » ?');return}
   [[208,0],[560,1]].forEach(([x,i])=>{if(Math.hypot(cx-x,cy-500)<130){M.map=i;sndPaper(.3,.2);if(i===0){sndTone(659,.8,.08);showHint('« Oui : quand le carton dit vrai. C’est la première chose à apprendre, disait Maman. Sans oui ni non, on ne peut rien vérifier. »');setTimeout(()=>{M.state='gav0';M.t0=performance.now();showHint('Puis, un matin, un lapin a traversé le champ.')},2200)}else{sndTone(330,.5,.08);showHint('Pas celui-là : Alice ne s’appelle pas « mur ». Le « oui », c’est quand le carton dit vrai.')}}});return}
  if(M.state==='gav0'){if(now-M.t0<2200)return;M.state='ask';showHint('« Tu crois savoir ? Vérifie. Montre-lui quelque chose et demande : gavagai ? »');return}
  if(M.state==='fin'){M.state='fin2';return}
  if(M.state==='fin2'){M.score=M.asked.length;M.done=true;return}
  if(M.state==='ask'){if(M.show&&now-M.show.t0<1900)return;TESTS.forEach((t,i)=>{const x=24+i*146;if(inR(cx,cy,[x,530,138,190])&&!M.asked.includes(i)){M.asked.push(i);M.show={i,t0:now};sndPaper(.35,.25);
     setTimeout(()=>{const before=M.alive.slice();HYP.forEach((h,j)=>{if(t.h[j]!==t.a)M.alive[j]=0});const gone=HYP.filter((h,j)=>before[j]&&!M.alive[j]).map(h=>'« '+h[0]+' »');
      if(t.k==='mur')showHint('« Le mur ? Non. Bien : il ne dit pas oui à tout. Une question fausse exprès, ça sert aussi. »');
      else showHint(`${t.n[0].toUpperCase()+t.n.slice(1)} : ${t.a?'oui':'non'}. `+(gone.length?`Ce n’est donc pas ${gone.join(', ')}.`:'Rien d’éliminé, mais c’est une preuve de plus.'));
      if(!M.alive.some(a=>a)&&M.state==='ask'){setTimeout(()=>{M.state='fin';sndTone(784,1.2,.1);showHint('« Fyunch (clic) », dans un roman de Niven et Pournelle, ne voulait dire aucun des sens imaginés non plus. Landragin adore cet exemple.')},1800)}},1900)}});}},
 move(){},up(){},solve(){M.done=true}};return M}

/* 3. La coquille — « Ligne ou cercles » : en ligne, deux phrases emboîtées au milieu d'une autre nous perdent ; dessinées, elles se lisent d'un regard */
// [extérieur, milieu, intérieur] : « le N1 que le N2 que le N3 V3 V2 V1… » ; la question porte sur le verbe le plus enfoui
const EMB=[
 {s:'La lettre que l’homme que le chien a mordu a écrite est partie.',P:[['la lettre','est partie'],['l’homme','a écrit (la lettre)'],['le chien','a mordu (l’homme)']],q:'Qui a écrit ?',o:['l’homme','le chien','la lettre'],a:0},
 {s:'Le gâteau que la fille que le garçon aime a fait est brûlé.',P:[['le gâteau','est brûlé'],['la fille','a fait (le gâteau)'],['le garçon','aime (la fille)']],q:'Qui aime ?',o:['le garçon','la fille','le gâteau'],a:0},
 {s:'Le livre que la linguiste que le colonel appelle a lu est ouvert.',P:[['le livre','est ouvert'],['la linguiste','a lu (le livre)'],['le colonel','appelle (la linguiste)']],q:'Qui a lu ?',o:['la linguiste','le colonel','le livre'],a:0},
 {s:'Le vase que le chat que la voisine nourrit a cassé était bleu.',P:[['le vase','était bleu'],['le chat','a cassé (le vase)'],['la voisine','nourrit (le chat)']],q:'Qui nourrit ?',o:['la voisine','le chat','le vase'],a:0},
 {s:'La chanson que la femme que l’enfant écoute chante est triste.',P:[['la chanson','est triste'],['la femme','chante (la chanson)'],['l’enfant','écoute (la femme)']],q:'Qui écoute ?',o:['l’enfant','la femme','la chanson'],a:0},
 {s:'Le pont que l’ouvrier que l’ingénieur paie construit est long.',P:[['le pont','est long'],['l’ouvrier','construit (le pont)'],['l’ingénieur','paie (l’ouvrier)']],q:'Qui paie ?',o:['l’ingénieur','l’ouvrier','le pont'],a:0}];
const RINGS=[GLYPH(41,4),GLYPH(52,3),GLYPH(63,3)];
function mkEmboite(){const M={state:'predict',pick:-1,i:0,round:1,sc:[0,0],t0:0,opts:null,done:false,
 hint:'Maman me lisait une phrase de Chomsky, reprise dans un roman, L’Enchâssement : « Le malt que le rat que le chat a mordu a mangé était dans la maison. »',
 wantsTap:()=>['pred2','r1in','r2in','show','res'].includes(M.state),
 shuffle(e){M.opts=e.o.map((t,k)=>[t,k]).sort(()=>Math.random()-.5)},
 draw(c,T){c.drawImage(FOGBG,0,0);const now=performance.now();
  if(M.state==='predict'||M.state==='pred2'){tagBox(c,30,30,708,200,12);['« Le malt que le rat','que le chat a mordu a mangé','était dans la maison. »'].forEach((l,k)=>txt(c,l,384,78+k*54,40,'#22306e'));
   txt(c,'Qui a mordu ?',384,290,46,'#3a2a20');['le malt','le rat','le chat'].forEach((l,i)=>btn(c,64+i*220,340,200,90,l,M.pick===i,42));
   if(M.state==='pred2'){tagBox(c,40,470,688,220,12);txt(c,'Le chat a mordu le rat.',384,516,40,'#7a2a08');txt(c,'Le rat a mangé le malt.',384,564,40,'#7a2a08');txt(c,'Deux phrases rangées au milieu d’une autre :',384,620,34,'#3a2a20');txt(c,'notre mémoire décroche.',384,656,34,'#3a2a20');tapLine(c,724)}return}
  if(M.state==='r1in'||M.state==='r2in'){header(c,M.round===1?'Première manche : en ligne.':'Deuxième manche : en cercles.',M.round===1?'Les mots passent un par un, comme à l’oral.':'Les mêmes phrases, dessinées. Même durée.');
   txt(c,'Trois phrases. Une question après chacune.',384,330,40,'#3a2a20');tapLine(c,420,'toucher pour commencer');return}
  const e=EMB[M.i];
  if(M.state==='show'){const t=(now-M.t0)/1000;
   if(M.round===1){const W=e.s.split(' '),per=.55,k=Math.floor(t/per);txt(c,'phrase '+(M.i%3+1)+' sur 3',384,60,34,'#5a4a3a','center','600',true);if(k<W.length){const a=1-((t/per)%1)*.35;c.save();c.globalAlpha=a;txt(c,W[k],384,384,64,'#141414');c.restore()}
    if(k>=W.length+1)M.ask()}
   else{const dur=EMB[M.i-3].s.split(' ').length*.55;txt(c,'phrase '+(M.i%3+1)+' sur 3',384,60,34,'#5a4a3a','center','600',true);if(t<dur){M.drawRings(c,e,clamp(t/1.2))}else M.ask();
    const rest=Math.max(0,dur-t);c.save();c.fillStyle='rgba(60,60,60,.35)';c.fillRect(184,730,400*(rest/dur),8);c.restore()}return}
  if(M.state==='q'){txt(c,'phrase '+(M.i%3+1)+' sur 3',384,60,34,'#5a4a3a','center','600',true);txt(c,e.q,384,240,56,'#22306e');M.opts.forEach(([l,k],j)=>btn(c,64+j*220,340,200,90,l,false,40));return}
  if(M.state==='fb'){txt(c,e.q,384,170,48,'#22306e');M.drawRings(c,e,1,.8);const ok=M.last;txt(c,ok?'Juste.':'Non : '+e.o[e.a]+'.',384,700,42,ok?'#2a6a3a':'#9a3a1a');return}
  if(M.state==='res'){tagBox(c,40,120,688,520,14);txt(c,'En ligne :',230,214,44,'#3a2a20');txt(c,`${M.sc[0]} sur 3`,540,214,52,'#7a2a08');txt(c,'En cercles :',230,300,44,'#3a2a20');txt(c,`${M.sc[1]} sur 3`,540,300,52,'#7a2a08');
   txt(c,'Les mêmes phrases, le même temps.',384,394,36,'#3a2a20');txt(c,'Une ligne de sons passe et fuit ;',384,446,38,'#22306e');txt(c,'un dessin se lit d’un regard.',384,494,38,'#22306e');txt(c,'Et pour le tracer, il faut déjà tout savoir.',384,556,34,'#5a4a3a','center','600',true);tapLine(c,700)}},
 // trois cercles d'encre emboîtés : chacun est une phrase ; le trait relie le verbe à ce qu'il touche
 drawRings(c,e,k,sc=1){c.save();c.translate(384,410);c.scale(sc,sc);[[300,0],[210,1],[118,2]].forEach(([r,j])=>{drawGlyph(c,RINGS[j],0,0,r,clamp(k*1.6-j*.3));});
  if(k>.5){c.globalAlpha=clamp((k-.5)*2);const P=e.P,v=P[2][1].split(' (');txt(c,P[0][0]+'…',0,-255,38,'#22306e');txt(c,'…'+P[0][1],0,258,38,'#22306e');txt(c,P[1][0]+'…',0,-163,32,'#7a2a08');txt(c,'…'+P[1][1],0,166,32,'#7a2a08');
   txt(c,P[2][0],0,-36,32,'#141414');txt(c,v[0],0,2,32,'#141414');if(v[1])txt(c,'('+v[1],0,38,28,'#141414')}c.restore()},
 ask(){M.state='q';M.shuffle(EMB[M.i])},
 down(cx,cy){const now=performance.now();
  if(M.state==='predict'){[0,1,2].forEach(i=>{if(inR(cx,cy,[64+i*220,340,200,90])){M.pick=i;M.state='pred2';sndTone(i===2?659:440,.6,.08);showHint(i===2?'« Oui, le chat. Mais tu as dû relire, n’est-ce pas ? »':'« Le chat ! Ne t’en fais pas : presque tout le monde se perd. Deux phrases emboîtées au milieu, et la mémoire lâche. »')}});return}
  if(M.state==='pred2'){M.state='r1in';showHint('« Les visiteurs, eux, écrivaient en cercles. Essayons les deux. »');return}
  if(M.state==='r1in'||M.state==='r2in'){M.state='show';M.t0=now;hideSay();return}
  if(M.state==='show')return;
  if(M.state==='q'){M.opts.forEach(([l,k],j)=>{if(inR(cx,cy,[64+j*220,340,200,90])){M.last=k===EMB[M.i].a;if(M.last)M.sc[M.round-1]++;sndTone(M.last?659:330,.6,.08);M.state='fb';
     setTimeout(()=>{M.i++;if(M.i===3){M.round=2;M.state='r2in';showHint('« Maintenant, les mêmes phrases… dessinées comme eux. »')}else if(M.i===6){M.state='res';showHint(M.sc[1]>M.sc[0]?'« Tu vois ? Ce que l’oreille perd, l’œil le garde. Les visiteurs pensaient peut-être comme ça : tout en même temps. »':'« Même quand on s’en sort en ligne, il faut tout retenir de tête. Dessinée, la phrase reste là, entière. »')}else{M.state='show';M.t0=performance.now()}},1500)}});return}
  if(M.state==='res'){M.score=M.sc[1]-M.sc[0];M.done=true}},
 move(){},up(){},solve(){M.done=true}};return M}

/* 4. La maison du lac — « Quand, ou où en est-on ? » : le français oblige à dire quand ; une langue à aspect oblige à dire où en est l'action */
const VIGN=(k)=>{const o=document.createElement('canvas');o.width=300;o.height=230;const x=o.getContext('2d');x.lineJoin=x.lineCap='round';x.strokeStyle='#3a2630';x.lineWidth=3;
 x.fillStyle='#f3ead6';x.fillRect(0,0,300,230);x.fillStyle='#c9b48a';x.fillRect(0,170,300,60);// sol
 const vali=(px,py,open,fill)=>{F(x,'#8a4a3a',c=>c.rect(px,py,150,64));if(open){F(x,'#6a3a2e',c=>{c.moveTo(px,py);c.lineTo(px+150,py);c.lineTo(px+140,py-60);c.lineTo(px+10,py-60);c.closePath()});F(x,'#f6efe0',c=>c.rect(px+8,py+8,134,48))
   ;for(let i=0;i<fill;i++){F(x,['#4a86e0','#e8b84a','#7aa86a','#d87a6a'][i%4],c=>c.rect(px+12+(i%3)*44,py+14+(i/3|0)*18,38,16))}}else{F(x,'#6a3a2e',c=>c.rect(px+50,py-14,50,14));x.beginPath();x.moveTo(px,py+32);x.lineTo(px+150,py+32);x.stroke()}};
 if(k===0){vali(40,120,true,0);[[200,140],[214,124],[228,108]].forEach(([a,b],i)=>F(x,['#4a86e0','#e8b84a','#7aa86a'][i],c=>c.rect(a,b,60,14)))}
 if(k===1){vali(60,120,true,4);x.fillStyle='#14102a';x.beginPath();x.ellipse(150,88,8,22,.3,0,7);x.fill();x.beginPath();x.arc(150,60,10,0,7);x.fill()}
 if(k===2){F(x,'#9a8a7a',c=>c.rect(210,20,70,150));F(x,'#c9a84a',c=>c.arc(222,96,4,0,7));vali(40,120,false,0)}
 if(k===3){vali(70,120,false,0);[[86,140,'#e05a4a'],[150,132,'#4a86e0'],[180,150,'#e8b84a'],[110,124,'#7aa86a']].forEach(([a,b,col])=>F(x,col,c=>c.arc(a,b,9,0,7)));
   F(x,'#fffaf0',c=>c.rect(20,16,110,80));for(let r=0;r<3;r++)for(let q=0;q<5;q++){x.beginPath();x.moveTo(28+q*20,26+r*24);x.lineTo(40+q*20,38+r*24);x.moveTo(40+q*20,26+r*24);x.lineTo(28+q*20,38+r*24);x.stroke()}}
 return lifted(bordered(paperize(o),5))};
const VIGS=[0,1,2,3].map(VIGN);
const ASP=[['va commencer',{seed:71,f:[{a:-1.6,k:'tendril',s:1.4}],a0:-1.4,gap:1.2}],['en cours',{seed:72,f:[{a:.3,k:'blob',s:1.6},{a:2.6,k:'blob',s:1.2}]}],['terminé',{seed:73,f:[{a:-.2,k:'hook',s:1.5}]}],['toujours',{seed:74,f:[{a:1,k:'spike',s:1},{a:3,k:'spike',s:1},{a:5,k:'spike',s:1}]}]];
const TENSE=[['demain','fera'],['maintenant','fait'],['hier','a fait'],['chaque mois','fait']];
function mkAspect(){const M={state:'intro',round:1,place:[-1,-1,-1,-1],drag:null,order:[0,1,2,3],done:false,t0:performance.now(),
 hint:'Ce soir-là, Maman a fait un jeu avec sa valise. « Quatre images. Mais pour les dire, chaque langue pose sa question. »',
 wantsTap:()=>['intro','mid','res','twist'].includes(M.state),
 slot(i){return[40+(i%2)*356,150+(i/2|0)*268]},
 tag(j){return[30+j*182,690]},
 draw(c,T){c.drawImage(FOGBG,0,0);const now=performance.now();
  if(M.state==='intro'){header(c,'« Maman fait sa valise. »','Quatre fois la même phrase, quatre images.');M.order.forEach((v,i)=>{const[x,y]=M.slot(i);c.drawImage(VIGS[v],x,y,330,250)});tapLine(c,724);return}
  if(M.state==='mid'||M.state==='res'||M.state==='twist'){
   if(M.state==='twist'){tagBox(c,40,60,688,640,14);txt(c,'Whorf, devant la langue hopi, en a conclu',384,120,38,'#3a2a20');txt(c,'qu’on n’y perçoit pas le temps comme nous.',384,166,38,'#3a2a20');
     txt(c,'Mais le français sait le dire aussi :',384,250,40,'#22306e');['« elle va commencer »','« elle est en train de »','« elle vient de finir »','« elle a l’habitude de »'].forEach((l,k)=>txt(c,l,384,312+k*52,40,'#7a2a08'));
     txt(c,'La langue n’enferme pas la pensée.',384,560,40,'#22306e');txt(c,'Elle oblige à regarder certaines choses.',384,606,40,'#22306e');tapLine(c,676);return}
   header(c,M.state==='mid'?'En français, il a fallu dire : quand ?':'La même scène, deux questions.');
   [0,1,2,3].forEach(v=>{const x=40+v*176,y=150;c.drawImage(VIGS[v],x,y,166,128);if(M.state==='res'||M.state==='mid')btn(c,x,300,166,58,TENSE[v][0],false,32);if(M.state==='res'){drawGlyph(c,ASP[v][1],x+83,470,58);txt(c,ASP[v][0],x+83,560,32,'#7a2a08')}});
   if(M.state==='mid'){txt(c,'Maman fera, fait, a fait sa valise…',384,450,38,'#3a2a20');txt(c,'Maintenant, la langue des cercles.',384,520,40,'#22306e');tapLine(c,700)}
   else{txt(c,'Quand ?',384,388,36,'#5a4a3a','center','600',true);txt(c,'Où en est l’action ?',384,620,36,'#5a4a3a','center','600',true);tapLine(c,700)}return}
  // les manches : poser les étiquettes sur les images
  const r1=M.round===1;header(c,r1?'En français : quand Maman fait-elle sa valise ?':'Dans la langue des cercles, le verbe porte une marque :',r1?'Glisser chaque étiquette sur son image.':'où en est l’action ? Glisser chaque cercle sur son image.');
  M.order.forEach((v,i)=>{const[x,y]=M.slot(i);c.drawImage(VIGS[v],x,y,330,250);if(r1){const d=['demain','maintenant','hier','tous les mois'][v];txt(c,d,x+165,y+228,30,'#5a4a3a','center','600',true)}});
  M.place.forEach((p,j)=>{if(p<0)return;const[x,y]=M.slot(p);if(r1)btn(c,x+70,y+92,190,62,TENSE[j][1],false,40);else{c.save();c.fillStyle='rgba(240,238,232,.85)';c.beginPath();c.arc(x+165,y+120,76,0,7);c.fill();c.restore();drawGlyph(c,ASP[j][1],x+165,y+112,52);txt(c,ASP[j][0],x+165,y+176,30,'#7a2a08')}});
  [0,1,2,3].forEach(j=>{if(M.place[j]>=0)return;let[x,y]=M.tag(j);if(M.drag&&M.drag.j===j){x=M.drag.x-80;y=M.drag.y-30}
   if(r1)btn(c,x,y,166,60,TENSE[j][1],!!(M.drag&&M.drag.j===j),36);else{tagBox(c,x,y-34,166,96,10);drawGlyph(c,ASP[j][1],x+40,y+14,30);txt(c,ASP[j][0],x+112,y+14,26,'#7a2a08')}});
  if(M.place.every(p=>p<0)&&!M.drag){const[x,y]=M.tag(0),k=(tutT()*.6)%1;drawHand(c,x+80+(M.slot(M.order.indexOf(0))[0]+120-x)*clamp(k*1.4),y+20+(M.slot(M.order.indexOf(0))[1]+100-y)*clamp(k*1.4),k<.8)}},
 down(cx,cy){const now=performance.now();
  if(M.state==='intro'){M.state='play';M.round=1;showHint('« En français, la phrase change selon le jour. »');return}
  if(M.state==='mid'){M.state='play';M.round=2;M.place=[-1,-1,-1,-1];M.order=[2,0,3,1];showHint('« Dans leur langue, pas de date. Regarde l’image : la valise est vide, à moitié pleine, fermée… ou toute cabossée de voyages ? »');return}
  if(M.state==='res'){M.state='twist';showHint('« Une langue n’enferme pas : elle fait regarder. Et Louise, qui voyait l’avenir ? Ça, c’est la fiction. Même Ted Chiang le dit : “ma vision du monde restera un amalgame”. »');return}
  if(M.state==='twist'){M.done=true;return}
  [0,1,2,3].forEach(j=>{if(M.place[j]>=0||M.drag)return;const[x,y]=M.tag(j);if(inR(cx,cy,[x,y-34,166,100])){M.drag={j,x:cx,y:cy};sndPaper(.25,.2)}})},
 move(cx,cy){if(M.drag){M.drag.x=cx;M.drag.y=cy}},
 up(){if(!M.drag)return;const{j,x,y}=M.drag;M.drag=null;const i=[0,1,2,3].find(i=>{const[sx,sy]=M.slot(i);return x>sx&&x<sx+330&&y>sy&&y<sy+250});if(i==null)return;const v=M.order[i];
  const okp=M.round===1?TENSE[v][1]===TENSE[j][1]:v===j;if(okp&&!M.place.includes(i)){if(M.round===1&&v!==j)showHint('« Tiens : “fait” sert pour maintenant… et pour tous les mois. Le français ne dit pas si c’est en ce moment ou d’habitude, remarque Landragin. »');M.place[j]=i;sndTone(523+j*60,.6,.07);if(M.place.every(p=>p>=0)){setTimeout(()=>{M.state=M.round===1?'mid':'res';if(M.round===2)showHint('« Tu as regardé l’image, pas le calendrier. C’est ce que leur langue t’obligeait à faire. »');else showHint('« Facile : tu savais quel jour c’était. Mais dans la langue des cercles, on ne demande pas la date. »')},700)}}
  else{sndTone(330,.4,.06);showHint(M.round===1?'« Regarde ce qui est écrit sous l’image : c’est quel jour ? »':'« Regarde la valise : où en est Maman ? Elle commence, elle est en train, elle a fini… ou elle le fait tout le temps ? »')}},
 solve(){M.done=true}};return M}
