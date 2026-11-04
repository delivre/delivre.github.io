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

/* Chaque activité : très peu de gestes, et un principe qu'on découvre. On se laisse porter. */
const nextBtn=(c,label='suite ▸')=>btn(c,284,672,200,72,label,false,38);
const hitNext=(cx,cy)=>inR(cx,cy,[284,672,200,72]);
const bigLine=(c,s,y,size=44,col='#22306e')=>fitTxt(c,s,384,y,size,col,690);
const paper=(c,y,h)=>tagBox(c,34,y,700,h,14);

/* 1. L'université — « Où commence tiède ? » : chaque langue, chaque personne, découpe le monde à sa façon */
const THERMO=(c,T)=>{const x0=94,x1=674,y=350;const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#3b6fd6');g.addColorStop(.5,'#e9e2c8');g.addColorStop(1,'#c8463a');c.save();c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=10;c.shadowOffsetY=5;c.fillStyle=g;c.beginPath();rrect(c,x0,y-30,x1-x0,60,30);c.fill();c.restore();
 txt(c,'glacée',x0+40,y+64,30,'#cfe0f0');txt(c,'brûlante',x1-50,y+64,30,'#f6c4b0');return[x0,x1,y]};
function mkMots(){const M={state:'drag',v:.35,drag:false,t0:0,pick:-1,done:false,
 hint:'Maman, la main sous le robinet : « Une question pour toi, ma puce. L’eau du bain : à partir d’où est-elle “tiède” ? »',
 wantsTap:()=>['marks','snow2','end'].includes(M.state),
 draw(c,T){c.drawImage(OFFICEBG,0,0);const now=performance.now();
  if(M.state==='drag'||M.state==='marks'){paper(c,28,96);bigLine(c,'Où commence « tiède » ?',76,46);const[x0,x1,y]=THERMO(c,T);
   const mark=(v,lab,col,up)=>{const px=x0+(x1-x0)*v;c.save();c.fillStyle=col;c.beginPath();c.moveTo(px,y-36);c.lineTo(px-14,y-62);c.lineTo(px+14,y-62);c.closePath();c.fill();c.restore();txt(c,lab,px,y-86-(up?44:0),34,col)};
   mark(M.v,'moi','#ffd27a');
   if(M.state==='drag'){txt(c,'Glisser la flèche dorée',384,520,40,'#f3ead6');txt(c,'là où l’eau devient « tiède ».',384,566,40,'#f3ead6');const k=(tutT()*.6)%1;drawHand(c,x0+(x1-x0)*(M.v+.12*Math.sin(k*Math.PI)),y-50,k<.6);if(M.moved)nextBtn(c,'c’est là')}
   else{const k=clamp((now-M.t0)/900);if(k>.2)mark(.45,'Maman','#e8b4c8',true);if(k>.6)mark(.6,'Papa','#9ec6f0',true);
    if(k>=1){paper(c,470,190);bigLine(c,'Trois personnes, trois « tiède ».',516,42);bigLine(c,'Le monde, lui, n’a pas de frontière :',566,38,'#3a2a20');bigLine(c,'c’est le mot qui en trace une.',612,38,'#3a2a20');tapLine(c,700)}}return}
  if(M.state==='snow'||M.state==='snow2'){paper(c,28,96);bigLine(c,'Les Inuits ont-ils des dizaines de mots',62,40);bigLine(c,'pour dire la neige ?',104,40);
   [['2',0],['50',1],['100',2]].forEach(([l,i])=>btn(c,94+i*200,170,180,110,l,M.pick===i,58));
   if(M.state==='snow2'){paper(c,320,330);bigLine(c,'Deux racines seulement :',372,42,'#7a2a08');bigLine(c,'la neige au sol, la neige qui tombe.',420,38);bigLine(c,'Les « cent mots », c’est un mythe.',476,38);
    bigLine(c,'Et nous ? neige, givre, verglas,',536,36,'#3a2a20');bigLine(c,'poudreuse, grésil, flocon…',576,36,'#3a2a20');tapLine(c,700)}return}
  if(M.state==='end'){paper(c,150,420);bigLine(c,'Chacun coupe ailleurs,',224,44);bigLine(c,'chaque langue aussi.',278,44);bigLine(c,'Mais couper n’est pas enfermer :',366,40,'#3a2a20');bigLine(c,'quand un mot manque, on dit',416,38,'#3a2a20');bigLine(c,'« rouge foncé », « neige qui colle ».',470,40,'#7a2a08');tapLine(c,640)}},
 down(cx,cy){const now=performance.now();
  if(M.state==='drag'){if(M.moved&&hitNext(cx,cy)){M.state='marks';M.t0=now;sndTone(523,.8,.08);showHint('« Moi, je le mets ici. Papa, un peu plus loin : il aime l’eau chaude. Aucun de nous n’a tort. »');return}if(Math.abs(cy-350)<90){M.drag=true;M.move(cx,cy)}return}
  if(M.state==='marks'){if(now-M.t0<900)return;M.state='snow';showHint('« Et d’une langue à l’autre, les frontières bougent aussi. On raconte même que les Inuits voient la neige autrement… »');return}
  if(M.state==='snow'){[0,1,2].forEach(i=>{if(inR(cx,cy,[94+i*200,170,180,110])){M.pick=i;M.state='snow2';sndTone(i===0?659:440,.6,.08);showHint(i===0?'« Bravo ! Presque personne ne le sait. Le reste, ils le fabriquent, comme nous disons “neige fondue”. »':'« Tout le monde le croit ! Landragin le démonte : deux racines, et des mots qu’on fabrique avec. »')}});return}
  if(M.state==='snow2'){M.state='end';showHint('« Alors les mots découpent… mais ils ne nous enferment pas ? » Maman m’a embrassée : « C’est toute la question de Sapir et Whorf. »');return}
  if(M.state==='end'){M.done=true}},
 move(cx){if(M.drag&&M.state==='drag'){M.v=clamp((cx-94)/580,.04,.96);M.moved=true}},up(){M.drag=false},solve(){M.done=true}};return M}

/* 2. Le camp — « Gavagai ! » : un mot montré du doigt peut tout vouloir dire ; on ne le devine pas, on le demande */
const G_OUI=GLYPH(101,3),G_GAV=GLYPH(303,5);
const PICS={
 lapin:doodle(150,110,x=>{F(x,'#f6f2ea',c=>{c.ellipse(70,70,44,28,0,0,7)});F(x,'#f6f2ea',c=>c.ellipse(112,48,20,17,0,0,7));F(x,'#f6f2ea',c=>{c.ellipse(108,20,6,18,-.2,0,7)});F(x,'#f6f2ea',c=>{c.ellipse(120,20,6,18,.2,0,7)});F(x,'#f6f2ea',c=>c.arc(26,62,9,0,7));x.fillStyle='#2a1a22';x.beginPath();x.arc(118,46,3,0,7);x.fill();x.beginPath();x.moveTo(50,96);x.lineTo(30,104);x.moveTo(92,96);x.lineTo(118,104);x.stroke()}),
 dort:doodle(150,100,x=>{F(x,'#f6f2ea',c=>{c.ellipse(70,64,48,26,0,0,7)});F(x,'#f6f2ea',c=>c.ellipse(112,64,20,16,0,0,7));F(x,'#f6f2ea',c=>{c.ellipse(96,40,6,18,-1.1,0,7)});x.beginPath();x.moveTo(112,62);x.quadraticCurveTo(118,66,124,62);x.stroke();x.font='600 26px Caveat, cursive';x.fillStyle='#22306e';x.fillText('z',120,24);x.fillText('z',134,12)}),
 chien:doodle(160,110,x=>{F(x,'#b8865a',c=>{c.ellipse(76,58,46,20,-.1,0,7)});F(x,'#b8865a',c=>c.ellipse(128,40,20,16,0,0,7));F(x,'#8a5a34',c=>c.ellipse(122,30,8,14,.6,0,7));x.lineWidth=6;x.strokeStyle='#8a5a34';x.beginPath();x.moveTo(44,70);x.lineTo(18,92);x.moveTo(60,72);x.lineTo(56,100);x.moveTo(96,72);x.lineTo(118,96);x.moveTo(108,66);x.lineTo(132,86);x.moveTo(32,52);x.quadraticCurveTo(14,40,8,26);x.stroke();x.lineWidth=2.6;x.strokeStyle='#3a2630';x.beginPath();x.moveTo(2,60);x.lineTo(-10,60);x.moveTo(4,74);x.lineTo(-8,76);x.stroke()}),
 feuille:doodle(140,110,x=>{x.save();x.translate(70,56);x.rotate(-.5);F(x,'#c98a3a',c=>{c.moveTo(-40,0);c.quadraticCurveTo(0,-34,40,0);c.quadraticCurveTo(0,34,-40,0)});x.beginPath();x.moveTo(-40,0);x.lineTo(40,0);x.stroke();x.restore();x.strokeStyle='#8a9aa8';x.beginPath();x.moveTo(6,90);x.quadraticCurveTo(40,80,60,96);x.moveTo(20,104);x.quadraticCurveTo(60,94,90,104);x.stroke()}),
 balan:doodle(150,120,x=>{x.lineWidth=5;x.strokeStyle='#6a4a30';x.beginPath();x.moveTo(20,110);x.lineTo(40,8);x.lineTo(110,8);x.lineTo(130,110);x.stroke();x.lineWidth=2.6;x.strokeStyle='#3a2630';x.beginPath();x.moveTo(62,8);x.lineTo(56,78);x.moveTo(88,8);x.lineTo(94,78);x.stroke();F(x,'#c84a3a',c=>c.rect(50,76,50,8));x.strokeStyle='#8a9aa8';x.beginPath();x.arc(75,60,40,1.2,1.9);x.stroke()}),
 mur:doodle(150,110,x=>{for(let r=0;r<4;r++)for(let k=0;k<4;k++){F(x,'#b8aca0',c=>c.rect(8+k*34+(r%2)*16,8+r*24,30,20))}})};
const GUESS=['un lapin','un animal','blanc','« regarde ! »'];
const GSCN=[['chien','Un chien qui détale.',1],['feuille','Une feuille emportée par le vent.',1],['dort','Un lapin qui dort.',0]];
function mkGavagai(){const M={state:'rabbit',t0:performance.now(),pick:-1,i:-1,done:false,
 hint:'Un lapin traverse le champ. Le visiteur trace un cercle. Papa, de la cuisine : « Gavagai ! Ça veut dire lapin, non ? »',
 wantsTap:()=>['rabbit','scene','fin'].includes(M.state),
 draw(c,T){c.drawImage(FOGBG,0,0);const now=performance.now(),k=(now-M.t0)/1000;
  if(M.state==='rabbit'){const lx=lerp(60,640,clamp(k/1.8));if(k<2.2){c.save();c.globalAlpha=1-clamp((k-1.8)/.4);c.drawImage(PICS.lapin,lx-75,560);c.restore()}drawGlyph(c,G_GAV,384,330,170,clamp((k-.4)/1.8));if(k>2.3){bigLine(c,'« Gavagai ! »',640,54);tapLine(c,712)}return}
  if(M.state==='guess'){drawGlyph(c,G_GAV,384,250,150);paper(c,450,80);bigLine(c,'Gavagai, ça veut dire… ?',490,44);GUESS.forEach((g,i)=>btn(c,40+(i%2)*352,560+(i/2|0)*96,336,82,g,M.pick===i,40));return}
  if(M.state==='scene'){const[img,l,yes]=GSCN[M.i];paper(c,30,74);bigLine(c,'Louise continue de montrer, et de demander.',67,36,'#3a2a20');const p=PICS[img];c.save();c.translate(220,330);c.scale(1.6,1.6);c.drawImage(p,-p.width/2,-p.height/2);c.restore();bigLine(c,l,470,40);
   const kk=clamp((k-.4)/1.2);if(yes)drawGlyph(c,G_GAV,560,320,110,kk);else if(kk>.3){c.save();c.globalAlpha=kk;txt(c,'…',560,320,90,'#3a3a3a');c.restore()}
   if(kk>=1){bigLine(c,yes?'« Gavagai ! »':'Silence. Pas de gavagai.',560,44,yes?'#22306e':'#6a5a5a');const note=M.i===0?(M.pick===0?'Un chien ? Alors ce n’est pas « lapin ».':'Un chien aussi ?'):M.i===1?'Une feuille ? Ni lapin, ni animal…':'Un lapin… mais immobile.';bigLine(c,note,620,36,'#7a2a08');tapLine(c,712)}return}
  if(M.state==='fin'){paper(c,120,500);drawGlyph(c,G_GAV,384,260,100);bigLine(c,'Gavagai voulait dire :',420,40,'#3a2a20');bigLine(c,'« ce qui s’enfuit ».',476,52,'#7a2a08');bigLine(c,'Un seul exemple ne suffit jamais.',548,38);bigLine(c,'Un mot ne se devine pas : il se demande.',596,38);tapLine(c,690)}},
 down(cx,cy){const now=performance.now();
  if(M.state==='rabbit'){if(now-M.t0<2300)return;M.state='guess';showHint('Maman souriait : elle connaissait le piège. « À ton avis, ma puce ? »');return}
  if(M.state==='guess'){GUESS.forEach((g,i)=>{if(inR(cx,cy,[40+(i%2)*352,560+(i/2|0)*96,336,82])){M.pick=i;sndPaper(.3,.2);M.state='scene';M.i=0;M.t0=now;showHint('« '+(i===3?'Regarde':g[0].toUpperCase()+g.slice(1))+' ? Un seul exemple, c’est trop peu. Louise montre autre chose, et elle demande. »')}});return}
  if(M.state==='scene'){if(now-M.t0<1600)return;M.i++;M.t0=now;sndPaper(.25,.2);if(M.i>=GSCN.length){M.state='fin';sndTone(784,1.2,.1);showHint('« C’est l’énigme du philosophe Quine. Voilà pourquoi Louise enlève sa combinaison : une langue s’apprend en face à face. »')}return}
  if(M.state==='fin'){M.done=true}},
 move(){},up(){},solve(){M.done=true}};return M}

/* 3. La coquille — « Une phrase dans une phrase » : en ligne, notre mémoire décroche ; dessinée en cercles, la phrase se lit d'un regard */
const EMBS=[{l:'Le malt était dans la maison.',ring:['le malt','était dans la maison']},
 {l:'Le malt que le rat a mangé était dans la maison.',ring:['le rat','a mangé le malt']},
 {l:'Le malt que le rat que le chat a mordu a mangé était dans la maison.',ring:['le chat','a mordu le rat']}];
const RINGS3=[GLYPH(41,4),GLYPH(52,3),GLYPH(63,3)];
function mkEmboite(){const M={state:'build',n:1,t0:performance.now(),pick:-1,done:false,
 hint:'Maman a pris un crayon : « Une phrase peut en cacher une autre, comme des poupées russes. Regarde. »',
 wantsTap:()=>['res','end'].includes(M.state),
 draw(c,T){c.drawImage(FOGBG,0,0);const now=performance.now(),k=clamp((now-M.t0)/1200);
  // en haut : la phrase en ligne
  paper(c,24,M.n===3?150:110);const L=EMBS[M.n-1].l;const ls=(()=>{c.font='600 50px Caveat, cursive';return jLines(c,L,640)})();ls.forEach((t,i)=>fitTxt(c,t,384,70+i*46,40,M.n===3?'#5a2a2a':'#22306e',660));
  // en dessous : la même phrase, en cercles emboîtés
  const cy=M.state==='res'||M.state==='end'?400:420,R=[230,160,92];
  for(let j=0;j<M.n;j++){const kk=j===M.n-1?k:1;drawGlyph(c,RINGS3[j],384,cy,R[j],kk);if(kk>.6){c.save();c.globalAlpha=clamp((kk-.6)/.4);const r=EMBS[j].ring,ty=j===2?-18:-R[j]+44;txt(c,r[0],384,cy+ty,j===2?32:34,['#22306e','#7a2a08','#141414'][j]);txt(c,r[1],384,cy+(j===2?20:R[j]-48),j===2?28:32,['#22306e','#7a2a08','#141414'][j]);c.restore()}}
  if(M.state==='build'){if(k>=1)btn(c,214,672,340,72,M.n<3?'glisser une phrase ▸':'qui a mordu ?',false,36);if(M.n===1&&k>=1){const kk=(tutT()*.7)%1;drawHand(c,384,708,kk<.5)}}
  if(M.state==='ask'){['le malt','le rat','le chat'].forEach((l,i)=>btn(c,64+i*220,672,200,72,l,M.pick===i,40))}
  if(M.state==='res'){paper(c,660,96);bigLine(c,M.pick===2?'Le chat ! On le voit d’un regard.':'Le chat : regarde le petit cercle.',708,40,'#7a2a08')}
  if(M.state==='end'){c.save();c.globalAlpha=.94;paper(c,200,420);c.restore();bigLine(c,'En ligne, deux phrases glissées',270,42);bigLine(c,'au milieu suffisent à nous perdre :',318,42);bigLine(c,'la mémoire ne tient pas les morceaux.',366,38,'#3a2a20');bigLine(c,'Dessinée, la phrase se lit d’un regard.',440,42,'#7a2a08');bigLine(c,'Les visiteurs écrivent comme ça :',500,36,'#3a2a20');bigLine(c,'toute la phrase, d’un seul geste.',540,36,'#3a2a20');tapLine(c,600)}},
 down(cx,cy){const now=performance.now();
  if(M.state==='build'){if(now-M.t0<1200||!inR(cx,cy,[214,672,340,72]))return;if(M.n<3){M.n++;M.t0=now;sndPaper(.35,.25);showHint(M.n===2?'« Le rat a mangé le malt. Ça se suit encore. »':'« Et le chat a mordu le rat. Lis la ligne du haut… Tu t’y retrouves ? Moi non plus. »')}else{M.state='ask';showHint('« Sans relire : qui a mordu ? »')}return}
  if(M.state==='ask'){[0,1,2].forEach(i=>{if(inR(cx,cy,[64+i*220,672,200,72])){M.pick=i;M.state='res';sndTone(i===2?659:440,.7,.08);showHint('« Dans la ligne, on revient en arrière. Dans les cercles, le chat est au cœur, avec ce qu’il a fait. »')}});return}
  if(M.state==='res'){M.state='end';return}
  if(M.state==='end'){M.done=true}},
 move(){},up(){},solve(){M.done=true}};return M}

/* 4. La maison du lac — « Le cercle qui se ferme » : une langue peut obliger à dire où en est l'action, plutôt que quand */
const VIGN=(k)=>{const o=document.createElement('canvas');o.width=300;o.height=230;const x=o.getContext('2d');x.lineJoin=x.lineCap='round';x.strokeStyle='#3a2630';x.lineWidth=3;
 x.fillStyle='#f3ead6';x.fillRect(0,0,300,230);x.fillStyle='#c9b48a';x.fillRect(0,170,300,60);// sol
 const vali=(px,py,open,fill)=>{F(x,'#8a4a3a',c=>c.rect(px,py,150,64));if(open){F(x,'#6a3a2e',c=>{c.moveTo(px,py);c.lineTo(px+150,py);c.lineTo(px+140,py-60);c.lineTo(px+10,py-60);c.closePath()});F(x,'#f6efe0',c=>c.rect(px+8,py+8,134,48))
   ;for(let i=0;i<fill;i++){F(x,['#4a86e0','#e8b84a','#7aa86a','#d87a6a'][i%4],c=>c.rect(px+12+(i%3)*44,py+14+(i/3|0)*18,38,16))}}else{F(x,'#6a3a2e',c=>c.rect(px+50,py-14,50,14));x.beginPath();x.moveTo(px,py+32);x.lineTo(px+150,py+32);x.stroke()}};
 if(k<3){F(x,'#fffaf0',c=>c.rect(60,24,180,140));const e=[.12,.55,1][k],a0=-1.9;x.strokeStyle='#14102a';x.lineWidth=9;x.beginPath();x.arc(150,94,48,a0,a0+e*6.2832);x.stroke();x.lineWidth=3;
   const pa=a0+e*6.2832,px=150+Math.cos(pa)*48,py=94+Math.sin(pa)*48;if(k<2){x.save();x.translate(px,py);x.rotate(.7);F(x,'#e8b84a',c=>c.rect(-6,-70,12,64));F(x,'#3a2630',c=>{c.moveTo(-6,-6);c.lineTo(6,-6);c.lineTo(0,6);c.closePath()});x.restore()}
   else{F(x,'#14102a',c=>c.arc(196,52,5,0,7));F(x,'#14102a',c=>c.arc(108,140,4,0,7))}x.strokeStyle='#3a2630'}
 if(k===3){vali(70,120,false,0);[[86,140,'#e05a4a'],[150,132,'#4a86e0'],[180,150,'#e8b84a'],[110,124,'#7aa86a']].forEach(([a,b,col])=>F(x,col,c=>c.arc(a,b,9,0,7)));
   F(x,'#fffaf0',c=>c.rect(20,16,110,80));for(let r=0;r<3;r++)for(let q=0;q<5;q++){x.beginPath();x.moveTo(28+q*20,26+r*24);x.lineTo(40+q*20,38+r*24);x.moveTo(40+q*20,26+r*24);x.lineTo(28+q*20,38+r*24);x.stroke()}}
 return lifted(bordered(paperize(o),5))};
const VIGS=[0,1,2,3].map(VIGN);
const ASPS=[['elle commence','va commencer'],['elle est en train','est en train de'],['c’est fini','vient de finir']];
const VERB=GLYPH(88,3);
function mkAspect(){const M={state:'s',i:0,t0:performance.now(),done:false,
 hint:'Je dessinais un cercle, comme eux. Maman s’est penchée : « Dans leur langue, le verbe ne dit pas quand. Il dit où en est l’action. »',
 wantsTap:()=>true,
 draw(c,T){c.drawImage(FOGBG,0,0);const now=performance.now(),k=clamp((now-M.t0)/1000);
  if(M.state==='s'){paper(c,24,82);bigLine(c,'« Alice dessine un cercle. »',66,46);const v=VIGS[M.i];c.drawImage(v,40,140,340,262);
   // le cercle du verbe se trace avec l'action : un début, une moitié, tout le cercle
   const prog=[.18,.55,1][M.i],prev=M.i?[.18,.55,1][M.i-1]:0;drawGlyph(c,{...VERB,gap:0},570,270,120,lerp(prev,prog,k));
   paper(c,440,150);bigLine(c,'Dans la langue des cercles :',486,36,'#3a2a20');bigLine(c,ASPS[M.i][0],546,50,'#7a2a08');
   tapLine(c,690,M.i<2?'toucher : la suite':'toucher pour continuer');return}
  if(M.state==='fr'){paper(c,40,640);bigLine(c,'En français, le verbe oblige à dire quand :',96,38);bigLine(c,'elle fera · elle fait · elle a fait.',150,42,'#7a2a08');
   bigLine(c,'Le verbe hopi, lui, marque plutôt',236,38);bigLine(c,'où en est l’action. Whorf en a conclu',282,38);bigLine(c,'que les Hopi voient le temps autrement.',328,38);
   bigLine(c,'Mais nous savons le dire aussi :',414,40,'#22306e');bigLine(c,'« va commencer », « est en train de »,',466,38,'#7a2a08');bigLine(c,'« vient de finir ».',514,38,'#7a2a08');
   bigLine(c,'Une langue n’enferme pas la pensée.',590,40);bigLine(c,'Elle oblige à regarder certaines choses.',636,40);tapLine(c,720)}},
 down(){const now=performance.now();if(now-M.t0<1000)return;
  if(M.state==='s'){if(M.i<2){M.i++;M.t0=now;sndPaper(.3,.2);showHint(M.i===1?'« Ton trait avance : le cercle du verbe aussi. »':'« Fini. Il n’a dit ni hier, ni demain. Juste : c’est fait. »')}else{M.state='fr';M.t0=now;showHint('« Et Louise, qui voit l’avenir ? » « Ça, c’est le cinéma, ma puce. Chiang l’écrit : “ma vision du monde restera un amalgame”. »')}return}
  if(M.state==='fr'){M.done=true}},
 move(){},up(){},solve(){M.done=true}};return M}
