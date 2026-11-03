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

/* 1. Le théâtre de mémoire : ranger le récit dans des places, puis le retrouver */
const STORY=[['le navire',doodle(96,80,x=>{F(x,'#c98a4a',c=>{c.moveTo(10,52);c.lineTo(86,52);c.quadraticCurveTo(76,72,48,72);c.quadraticCurveTo(20,72,10,52)});F(x,'#fff6e0',c=>{c.moveTo(48,8);c.lineTo(48,48);c.lineTo(80,48);c.closePath()});F(x,'#e0445a',c=>{c.moveTo(44,14);c.lineTo(44,48);c.lineTo(20,48);c.closePath()})})],
 ['la mer couleur de vin',doodle(96,80,x=>{F(x,'#6a1f4e',c=>{c.moveTo(4,74);c.lineTo(4,50);c.bezierCurveTo(14,20,52,6,74,22);c.bezierCurveTo(88,32,80,52,64,46);c.bezierCurveTo(56,42,60,32,66,34);c.bezierCurveTo(56,22,30,34,30,52);c.bezierCurveTo(44,58,70,60,92,56);c.lineTo(92,74);c.closePath()});
  x.strokeStyle='#fff';x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(20,36);x.bezierCurveTo(34,18,58,14,72,24);x.stroke();x.strokeStyle='#2a1a22';x.lineWidth=3;
  F(x,'#a83a6e',c=>{c.moveTo(4,74);c.bezierCurveTo(30,60,60,66,92,62);c.lineTo(92,74);c.closePath()})})],
 ['le héros',doodle(96,96,x=>{x.lineWidth=4;x.beginPath();x.moveTo(78,8);x.lineTo(70,88);x.stroke();F(x,'#c0c0c8',c=>{c.moveTo(78,2);c.lineTo(84,16);c.lineTo(72,16);c.closePath()});
  F(x,'#ffe0c8',c=>c.arc(44,30,16,0,7));F(x,'#d8a030',c=>{c.arc(44,28,17,Math.PI,0);c.lineTo(61,32);c.lineTo(27,32);c.closePath()});F(x,'#e0445a',c=>{c.moveTo(30,14);c.quadraticCurveTo(44,0,60,12);c.quadraticCurveTo(46,10,30,14)});
  F(x,'#e0445a',c=>{c.moveTo(30,48);c.lineTo(58,48);c.lineTo(62,80);c.lineTo(26,80);c.closePath()});F(x,'#3a6ad8',c=>c.arc(30,64,18,0,7));F(x,'#ffd27a',c=>c.arc(30,64,6,0,7))})],
 ['la tempête',doodle(96,80,x=>{F(x,'#8a8aa8',c=>{c.moveTo(14,40);c.quadraticCurveTo(10,18,32,20);c.quadraticCurveTo(40,4,60,14);c.quadraticCurveTo(84,10,82,34);c.quadraticCurveTo(88,46,70,46);c.lineTo(22,46);c.quadraticCurveTo(12,46,14,40)});F(x,'#ffd84a',c=>{c.moveTo(46,46);c.lineTo(36,62);c.lineTo(46,60);c.lineTo(40,78);c.lineTo(60,54);c.lineTo(50,56);c.lineTo(56,46);c.closePath()})})]];
const SEATS=[[170,622],[298,586],[470,586],[598,622]];
// une petite main qui montre le geste, tant qu'on ne l'a pas fait une première fois
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
const FEAST=[0,1,2,7].map(k=>({n:['le pain','le poisson','les figues','','','','','le miel'][k],get s(){return OFFER[k].s}}));
function mkTheatre(){const items=STORY.map(([n,s],i)=>({n,s,i,hx:150+i*156,hy:250,x:150+i*156,y:250,seat:-1}));
 const M={scoreA:0,wantsTap:()=>M.state==='reveal',state:'predict',pick:-1,done:false,drag:null,round:1,hint:'Maman me demandait : « Combien de vers un aède récitait-il de mémoire ? »',
 draw(c,T){if((M.state==='predict'||M.state==='reveal')&&PAPER){c.drawImage(theatreNight,0,0);txt(c,'Combien de vers ?',384,120,48);shelfP(c,404);
   const rv=M.state==='reveal'?clamp((performance.now()-M.rt)/1600):0;
   [[200,'100',1],[384,'1 000',4],[568,'16 000',12]].forEach(([x,l,n],i)=>{const nn=i===2?Math.round(n+rv*9):n;pile(c,x,404,nn,false);if(i===2&&rv>0&&rv<1){c.save();c.globalCompositeOperation='lighter';blob(c,x,404-nn*15,70,'rgba(255,220,140,.4)');c.restore()}
    const sel=M.pick===i,good=M.state==='reveal'&&i===2,lift=sel?-10:0;c.save();c.translate(0,lift);tagBox(c,x-78,438,156,62,8);c.font='700 40px Caveat, cursive';c.fillStyle=good?'#2a6a2a':'#3a2410';c.textAlign='center';c.fillText(l,x+8,482);c.textAlign='start';c.restore();
    if(M.state==='predict'&&i===1){const k=(tutT()*.35)%1,u=.5-.5*Math.cos(k*Math.PI*2);drawHand(c,200+u*368+40,520,false)}});
   if(M.state==='reveal'){txt(c,'16 000 vers',568,190-Math.round(rv*9)*0,40,'#ffd27a');txt(c,'toucher pour continuer',384,740,36,'#ffd27a')}else txt(c,'toucher une étiquette',384,740,34,'#fff3d6');return}
  if(M.state==='predict'||M.state==='reveal'){c.drawImage(theatreNight,0,0);txt(c,'Combien de vers ?',384,190,48);[[220,'100',1],[384,'1 000',4],[548,'16 000',12]].forEach(([x,l,n],i)=>{pile(c,x,560,n,M.pick===i);txt(c,l,x,330,40,M.pick===i?'#ffd27a':'#fff3d6');if(M.state==='predict'){const pu=.5+.5*Math.sin(T*4+i);c.save();c.strokeStyle=`rgba(255,226,160,${.35+.4*pu})`;c.lineWidth=3;c.setLineDash([6,8]);c.beginPath();c.ellipse(x,450,78,170,0,0,7);c.stroke();c.restore()}});if(M.state==='predict')txt(c,'toucher une réponse',384,740,34,'#fff3d6');if(M.state==='reveal')txt(c,'toucher pour continuer',384,740,36,'#ffd27a');return}
  c.drawImage(theatreNight,0,0);
  if(M.state==='showA'||M.state==='darkA'||M.state==='recallA'||M.state==='scoreA'){const now=performance.now();
   tagBox(c,40,8,688,118,10);c.save();c.font='600 42px Caveat, cursive';c.fillStyle='#3a2410';c.textAlign='center';
   if(M.state==='showA'){c.fillText('D’abord, une simple liste.',400,56);c.fillText('Retenir les plats, dans l’ordre.',400,104)}
   else{c.fillText('Le festin, dans l’ordre ?',400,76)}c.restore();
   if(M.state==='showA'){const e=now-M.tS,i=Math.floor(e/1400)%4,u=(e%1400)/1400,al=clamp(u*6)*clamp((1-u)*6),f=FEAST[i];
    c.save();c.globalAlpha=al;txt(c,`${i+1} / 4`,384,172,40,'#ffd27a');c.restore();c.save();c.globalAlpha=al;c.translate(384,290);c.scale(1.9,1.9);c.drawImage(f.s,-f.s.width/2,-f.s.height/2);c.restore();c.save();c.globalAlpha=al;txt(c,f.n,384,400,40,'#fff3d6','center','600');c.restore();
    if(e>5600){tagBox(c,234,436,300,76,10);txt(c,'J’ai retenu',384,476,40,'#3a2410')}}
   if(M.state==='recallA'||M.state==='scoreA'){shelfP(c,560);for(let k=0;k<4;k++){const x=150+k*156,f=M.lineA[k];if(f!=null){const o=FEAST[f];c.save();c.translate(x,500);c.scale(1.4,1.4);c.drawImage(o.s,-o.s.width/2,-o.s.height/2);c.restore();if(M.state==='scoreA'){txt(c,f===k?'✓':'✗',x,612,40,f===k?'#9fe0a0':'#f0a0a0')}}else{c.save();c.strokeStyle='rgba(255,231,168,.6)';c.setLineDash([6,6]);c.lineWidth=3;c.strokeRect(x-56,446,112,104);c.restore();txt(c,String(k+1),x,500,34,'#ffe7a8')}}
    if(M.state==='recallA')M.poolA.forEach((f,j)=>{if(M.lineA.includes(f))return;const x=150+j*156,y=270;c.save();c.translate(x,y);c.scale(1.4,1.4);c.drawImage(FEAST[f].s,-FEAST[f].s.width/2,-FEAST[f].s.height/2);c.restore()});
    if(M.state==='scoreA')txt(c,`${M.scoreA} sur 4, avec la liste`,384,300,44,'#ffd27a')}
   let k=0;if(M.state==='darkA')k=clamp((now-M.tA)/800);else if(M.state==='recallA'&&M.tA1)k=1-clamp((now-M.tA1)/800);if(PAPER)curtain(c,k,T);else if(k>0){c.fillStyle=`rgba(8,6,24,${.85*k})`;c.fillRect(0,0,MS,MS)}
   if(M.state==='darkA'&&k>.9)txt(c,'Le rideau tombe…',384,384,40,'#ffe7a8');drawConf(c);return}
  if(M.state==='place'){if(PAPER)tagBox(c,40,8,688,150,10);else{c.fillStyle='rgba(10,8,30,.55)';c.fillRect(0,0,MS,104)}if(PAPER){c.save();c.font='700 40px Caveat, cursive';c.fillStyle='#22306e';c.textAlign='center';c.fillText('Une histoire, ancrée dans des lieux :',400,52);c.font='600 38px Caveat, cursive';c.fillStyle='#3a2410';c.fillText('le navire part sur la mer couleur de vin,',400,96);c.fillText('le héros affronte la tempête.',400,136);c.restore()}else{txt(c,'L\u2019aède chante : le navire part sur la mer',384,36,30);txt(c,'couleur de vin, le héros affronte la tempête.',384,76,30)}}
  if(M.state==='place'||M.state==='recall'){SEATS.forEach(([sx,sy],k)=>{const occ=items.some(it=>it.seat===k&&it!==M.drag);if(PAPER){const hot=M.drag&&!occ&&Math.hypot(M.drag.x-sx,M.drag.y+36-sy)<120;seatDisc(c,sx,sy,occ?'':String(k+1),hot,T)}else{ringPlace(c,sx,sy,T,occ);if(!occ)txt(c,String(k+1),sx,sy+4,34,'#ffe7a8')}})}
  items.forEach(it=>{const show=M.state!=='dark'||it===M.drag;if(!show&&it.seat>=0)return;let tx=it.hx,ty=it.hy;if(it.seat>=0&&it!==M.drag){tx=SEATS[it.seat][0];ty=SEATS[it.seat][1]-36}if(it!==M.drag){it.x+=(tx-it.x)*.25;it.y+=(ty-it.y)*.25}
   if(M.state==='dark'&&it.seat>=0)return;const pe=it.popT?clamp((performance.now()-it.popT)/450):1,lift=(it===M.drag?1.75:(it.seat>=0?1.35:1.55))*(1+(pe<1?Math.sin(pe*Math.PI)*.28:0));dropShadow(c,it.x,it.y+30,34,10);c.save();c.translate(it.x,it.y);c.scale(lift,lift);c.drawImage(it.s,-it.s.width/2,-it.s.height/2);c.restore();
   if(it.seat<0)txt(c,it.n==='la mer couleur de vin'?'la mer de vin':it.n,it.x,it.y+78,29,'#fff3d6','center','600')});
  if(M.state==='place'&&!M.drag&&!M.tut){const it=items.find(o=>o.seat<0);if(it){const k=(tutT()*.45)%1,[sx,sy]=SEATS.find((s,j)=>!items.some(o=>o.seat===j))||SEATS[0],u=clamp((k-.18)/.55),e=u*u*(3-2*u),hx=it.hx+(sx-it.hx)*e,hy=it.hy+(sy-36-it.hy)*e;
   if(k>.18&&k<.8){c.save();c.globalAlpha=.45;c.translate(hx,hy);c.scale(1.4,1.4);c.drawImage(it.s,-it.s.width/2,-it.s.height/2);c.restore()}drawHand(c,hx+6,hy+10,k>.1&&k<.75,k>.9?(1-k)*10:1)}}
  if(PAPER){const now=performance.now();let k=0;if(M.state==='dark')k=clamp((now-M.t0)/800);else if(M.state==='recall'&&M.t1)k=1-clamp((now-M.t1)/800);curtain(c,k,T);if(M.state==='dark'&&k>.9)txt(c,'La nuit tombe sur le théâtre…',384,384,40,'#ffe7a8')}else if(M.state==='dark'){c.fillStyle=`rgba(8,6,24,${Math.min(.85,(performance.now()-M.t0)/900)})`;c.fillRect(0,0,MS,MS);txt(c,'La nuit tombe sur le théâtre…',384,384,40)}
  drawConf(c);
  if(M.state==='result'){tagBox(c,90,96,588,150,10);txt(c,`Une simple liste : ${M.scoreA} sur 4`,384,140,40,'#5a3418');txt(c,`Histoire + lieux : ${M.score} sur 4`,384,200,44,'#22306e')}},
 down(cx,cy){if(M.state==='predict'){const i=cx<292?0:cx<476?1:2;M.pick=i;M.state='reveal';M.rt=performance.now();if(PAPER)confetti(568,300,i===2?26:10);showHint(i===2?'« Oui : 16 000 vers. Et tu sais comment ? »':'« Bien plus : 16 000 vers. Et tu sais comment ? »');return}
  if(M.state==='reveal'){M.state='showA';M.tS=performance.now();showHint('Maman : « D’abord une simple liste, sans histoire ni lieux. Regarde bien, puis touche « J’ai retenu ». »');return}
  if(M.state==='showA'){if(performance.now()-M.tS>5600&&cy>426&&cy<522){M.state='darkA';M.tA=performance.now();setTimeout(()=>{M.poolA=[0,1,2,3].sort(()=>Math.random()-.5);M.lineA=[null,null,null,null];M.state='recallA';M.tA1=performance.now();showHint('Toucher les plats dans l’ordre où l’aède les a chantés.')},1700)}return}
  if(M.state==='recallA'){const j=M.poolA.findIndex((f,j)=>!M.lineA.includes(f)&&Math.hypot(cx-(150+j*156),cy-270)<74);if(j<0)return;const k=M.lineA.indexOf(null);M.lineA[k]=M.poolA[j];sndPaper(.25,.2);
   if(M.lineA.every(v=>v!=null)){M.scoreA=M.lineA.filter((f,k)=>f===k).length;M.state='scoreA';setTimeout(()=>{M.state='place';showHint('« Maintenant, comme les aèdes : une histoire, et chaque moment ancré dans un lieu du théâtre, dans l’ordre : 1, 2, 3, 4. » Faire glisser chaque image sur sa place.')},2400)}return}
  if(M.state==='scoreA'||M.state==='darkA')return;
  if(M.state!=='place'&&M.state!=='recall')return;const it=[...items].reverse().find(it=>Math.hypot(cx-it.x,cy-it.y)<76&&(M.state==='recall'?it.seat<0:true));if(it){M.drag=it;M.ox=cx-it.x;M.oy=cy-it.y;if(M.state==='place')it.seat=-1}},
 move(cx,cy){if(M.drag){M.drag.x=cx-M.ox;M.drag.y=cy-M.oy}},
 up(){const it=M.drag;if(!it)return;M.drag=null;let best=-1,bd=170;SEATS.forEach(([sx,sy],k)=>{const d=Math.hypot(it.x-sx,it.y+36-sy);if(d<bd&&!items.some(o=>o!==it&&o.seat===k)){bd=d;best=k}});if(M.state==='place'){const [qx,qy]=SEATS[it.i];if(Math.hypot(it.x-qx,it.y+36-qy)<210)best=it.i;else if(best>=0)best=-2}if(best===-2){best=-1;showHint('« Dans l’ordre de l’histoire : '+STORY[it.i][0]+' va sur la place '+(it.i+1)+'. »')}else if(best<0)showHint('« Sur un des cercles, Alice. »');it.seat=best;if(best>=0){M.tut=1;it.popT=performance.now();if(PAPER)confetti(SEATS[best][0],SEATS[best][1]-60,12)}
  if(M.state==='place'&&items.every(o=>o.seat>=0)){M.answer=items.map(o=>o.seat);M.state='dark';M.t0=performance.now();showHint('« Regarde bien où chaque image est rangée… »');
   setTimeout(()=>{items.forEach((o,k)=>{o.seat=-1;o.hx=150+[2,0,3,1][k]*156;o.hy=250;o.x=o.hx;o.y=o.hy});M.state='recall';M.t1=performance.now();showHint('« L’aède reprend son récit. Remets chaque image à sa place. » Faire glisser chaque image sur son cercle.')},2600)}
  else if(M.state==='recall'&&items.every(o=>o.seat>=0)){M.score=items.filter((o,k)=>o.seat===M.answer[k]).length;M.state='result';if(PAPER)confetti(384,140,40);showHint(M.score>M.scoreA?'« Tu vois ? Une histoire ancrée dans des lieux : tout revient, dans l’ordre. Les aèdes faisaient pareil… pour 16 000 vers. »':M.score===M.scoreA?'« Autant l’un que l’autre, pour quatre images. Mais pour 16 000 vers, une liste ne tient pas : il faut une histoire et des lieux, le chemin qui ramène le récit. »':'« Ce soir, la liste a mieux marché. Avec l’habitude, l’histoire et les lieux gagnent : c’est ainsi que les aèdes gardaient 16 000 vers. »');setTimeout(()=>M.done=true,3200)}},
 solve(){M.done=true}};return M}

/* 2. Le papyrus de Thot : avoir la liste sous les yeux… puis la perdre */
const OFFER=[['pain','#d8a058',x=>F(x,'#d8a058',c=>c.ellipse(45,45,32,20,0,0,7))],['poisson','#6aa8d8',x=>{F(x,'#6aa8d8',c=>{c.moveTo(12,45);c.quadraticCurveTo(40,18,66,45);c.quadraticCurveTo(40,72,12,45)});F(x,'#6aa8d8',c=>{c.moveTo(64,45);c.lineTo(82,30);c.lineTo(82,60);c.closePath()})}],
 ['figues','#7a3a7a',x=>{[[32,48],[56,48],[44,30]].forEach(([a,b])=>F(x,'#7a3a7a',c=>c.ellipse(a,b,14,16,0,0,7)))}],['jarre de lait','#f4ecdc',x=>F(x,'#f4ecdc',c=>{c.moveTo(34,16);c.lineTo(56,16);c.lineTo(54,26);c.quadraticCurveTo(76,46,56,76);c.lineTo(34,76);c.quadraticCurveTo(14,46,36,26);c.closePath()})],
 ['oie','#ffffff',x=>{F(x,'#fff',c=>c.ellipse(46,56,28,16,0,0,7));F(x,'#fff',c=>{c.moveTo(60,50);c.quadraticCurveTo(70,20,60,16);c.lineTo(66,14);c.quadraticCurveTo(80,24,68,52);c.closePath()});F(x,'#f0a040',c=>{c.moveTo(62,16);c.lineTo(76,18);c.lineTo(64,22);c.closePath()})}],
 ['lotus','#f08ab0',x=>{[-24,0,24].forEach(r=>F(x,'#f08ab0',c=>{c.save();c.translate(45,64);c.rotate(r*Math.PI/180);c.moveTo(0,0);c.quadraticCurveTo(-14,-30,0,-48);c.quadraticCurveTo(14,-30,0,0);c.restore()}))}],
 ['raisin','#5a8a3a',x=>{[[36,30],[54,30],[45,44],[30,46],[60,46],[45,60]].forEach(([a,b])=>F(x,'#5a8a3a',c=>c.arc(a,b,10,0,7)))}],['miel','#f2b630',x=>{F(x,'#f2b630',c=>{c.moveTo(24,30);c.lineTo(66,30);c.lineTo(62,74);c.lineTo(28,74);c.closePath()});F(x,'#c88a3a',c=>c.rect(20,22,50,10))}]
,['dattes','#8a4a24',x=>{[[30,40,-.4],[48,34,.2],[62,46,.5],[40,60,.1],[58,64,-.3]].forEach(([a,b,r])=>F(x,'#8a4a24',c=>c.ellipse(a,b,9,15,r,0,7)))}],
 ['oignons','#f0e6d8',x=>{[[32,52],[58,52]].forEach(([a,b])=>{F(x,'#f0e6d8',c=>{c.moveTo(a,b-30);c.quadraticCurveTo(a+18,b-6,a+14,b+12);c.quadraticCurveTo(a,b+22,a-14,b+12);c.quadraticCurveTo(a-18,b-6,a,b-30)});x.beginPath();x.moveTo(a,b-30);x.lineTo(a,b-40);x.stroke()})}],
 ['encens','#c8a070',x=>{F(x,'#8a6a4a',c=>{c.moveTo(22,56);c.lineTo(68,56);c.lineTo(60,76);c.lineTo(30,76);c.closePath()});F(x,'#c8a070',c=>{c.moveTo(34,56);c.lineTo(45,34);c.lineTo(56,56);c.closePath()});x.strokeStyle='rgba(120,110,130,.8)';x.beginPath();x.moveTo(45,30);x.bezierCurveTo(36,20,54,14,44,4);x.stroke();x.strokeStyle='#3a2630'}],
 ['pastèque','#5aa04a',x=>{F(x,'#5aa04a',c=>{c.moveTo(10,40);c.lineTo(80,40);c.arc(45,40,35,0,Math.PI);c.closePath()});F(x,'#e8504a',c=>{c.moveTo(16,42);c.lineTo(74,42);c.arc(45,42,29,0,Math.PI);c.closePath()});x.fillStyle='#2a1a22';[[34,52],[45,58],[56,52]].forEach(([a,b])=>{x.beginPath();x.ellipse(a,b,2.5,4,0,0,7);x.fill()})}]
].map(([n,col,fn])=>({n,s:doodle(90,90,x=>fn(x))}));
const papyrusSheet=(list)=>doodle(310,410,x=>{F(x,'#f2e2b0',c=>{c.moveTo(20,10);c.lineTo(290,10);c.lineTo(290,400);c.lineTo(20,400);c.closePath()});[[20,205],[290,205]].forEach(([a,b])=>F(x,'#e0c88a',c=>c.ellipse(a,b,12,200,0,0,7)));
  x.font='700 34px Caveat, cursive';x.fillStyle='#5a3418';x.fillText('Pour le roi :',52,54);list.forEach((k,i)=>{const o=OFFER[k].s;x.save();x.translate(155-(i%2?-64:64),54+i*58);x.scale(1.02,1.02);x.drawImage(o,-o.width/2,-10);x.restore()})});
function mkThot(){// le piège de l'écrit : le papyrus se relit à volonté… alors on ne retient pas
 const NO=OFFER.length,N=5,ids=[...Array(NO).keys()],pick=[...ids].sort(()=>Math.random()-.5),list=pick.slice(0,N),order=[...ids].sort(()=>Math.random()-.5),sheet=papyrusSheet(list);
 const slots=order.map((k,i)=>NO>8?{k,x:110+(i%4)*182,y:520+Math.floor(i/4)*92,sel:false}:{k,x:120+(i%4)*176,y:i<4?568:690,sel:false});
 const M={wantsTap:()=>M.state==='look'||M.state==='result',state:'look',got:0,err:0,open:true,reads:1,done:false,hint:'Papa jouait à Thot : « Voici la liste des offrandes. Regarde-la bien. »',
 draw(c,T){c.drawImage(palaceBG,0,0);
  c.save();c.translate(586,286);c.scale(1.2,1.2);c.drawImage(KING,-KING.width/2,-KING.height/2);c.restore();c.save();tagBox(c,514,96,144,46,10);c.restore();txt(c,'Thamus',586,121,36,'#3a1a08');
  const big=slots.length>8,sc=big?1.0:1.3;if(big&&PAPER)[0,1,2].forEach(r=>{const y=520+r*92+40;c.save();c.shadowColor='rgba(20,10,0,.5)';c.shadowBlur=8;c.shadowOffsetY=5;c.fillStyle='#8a5a34';c.fillRect(20,y,728,12);c.restore();c.fillStyle='#b07a45';c.fillRect(20,y,728,4)});
  slots.forEach(s=>{const o=OFFER[s.k];if(!big)dropShadow(c,s.x,s.y+34,30,8);const sh=s.shake?Math.max(0,1-(performance.now()-s.shake)/500):0;c.save();c.translate(s.x+Math.sin(sh*30)*8*sh,s.y-(s.sel?10:0));if(s.sel){c.save();c.globalCompositeOperation='lighter';blob(c,0,0,64,'rgba(255,210,122,.5)');c.restore()}c.scale(sc,sc);c.drawImage(o.s,-o.s.width/2,-o.s.height/2);c.restore()});
  if(M.state==='look'){c.save();c.translate(220,slots.length>8?228:250);c.rotate(-.03);{const k=slots.length>8?.98:1.18;c.scale(k,k)}dropShadow(c,0,150,140,20);c.drawImage(sheet,-sheet.width/2,-sheet.height/2+20);c.restore();txt(c,'toucher pour commencer',586,470,34,'#fff3d6')}
  if(M.state==='task'){
   if(M.open){c.save();c.translate(220,slots.length>8?228:250);c.rotate(-.03);{const k=slots.length>8?.98:1.18;c.scale(k,k)}dropShadow(c,0,150,140,20);c.drawImage(sheet,-sheet.width/2,-sheet.height/2+20);c.restore()}
   else{const pu=.5+.5*Math.sin(T*3);c.save();c.globalCompositeOperation='lighter';blob(c,190,260,90,`rgba(255,220,140,${.25+.2*pu})`);c.restore();c.save();c.translate(190,250);c.scale(1.7,1.7);c.drawImage(kidScroll,-kidScroll.width/2,-kidScroll.height/2);c.restore();
     c.save();tagBox(c,70,330,240,92,14);c.restore();txt(c,'relire le papyrus',190,362,32,'#3a1a08');txt(c,M.reads<2?'lu une fois':`relu ${M.reads-1} fois`,190,400,34,'#7a4a10')}
   c.save();tagBox(c,470,424,232,M.err?78:52,12);c.restore();txt(c,`${M.got} / ${N} apportées`,594,450,36,'#3a1a08');if(M.err)txt(c,M.err===1?'1 erreur':`${M.err} erreurs`,594,484,34,'#9a3a1a');
   if(M.got===0&&M.open){const s=slots.find(o=>o.k===list[0]);if(s){const k=(tutT()*.7)%1;drawHand(c,s.x+10,s.y+18,k<.5)}}
   if(M.got>=1&&M.reads===1&&!M.open){const k=(tutT()*.7)%1;drawHand(c,214,236,k<.5)}}
  if(M.state==='burn'){const k=Math.min(1,(performance.now()-M.t0)/900);c.save();c.globalAlpha=1-k;c.translate(220-k*320,slots.length>8?228:250);c.rotate(-k*.8);{const kk=slots.length>8?.98:1.18;c.scale(kk,kk)}c.drawImage(sheet,-sheet.width/2,-sheet.height/2+20);c.restore()}
  if(M.state==='recall'){if(PAPER)tagBox(c,30,34,708,108,10);else{c.fillStyle='rgba(251,243,223,.92)';c.fillRect(0,40,MS,96)}txt(c,'Thamus a jeté le papyrus.',384,80,38,'#3a1a08');txt(c,`Quelles étaient les ${N} offrandes ?`,384,122,40,'#3a1a08')}
  if(M.state==='result'){if(PAPER)tagBox(c,30,170,708,230,10);else{c.fillStyle='rgba(251,243,223,.94)';c.fillRect(0,170,MS,230)}txt(c,M.err?`${N} offrandes apportées · ${M.err===1?'1 erreur':M.err+' erreurs'}`:`${N} offrandes apportées, sans erreur`,384,230,40,'#7a2a08');txt(c,M.reads<2?'et je ne l’avais lu qu’une fois':`et je l’avais relu ${M.reads-1} fois`,384,290,36,'#3a1a08');txt(c,'toucher pour continuer',384,360,34,'#7a4a10')}},
 down(cx,cy){if(M.state==='result'){M.done=true;return}
  if(M.state==='look'){M.state='task';showHint('« Maintenant, apporte-les au roi. Et si tu as un doute, tu peux relire la liste. »');return}
  if(M.state==='task'&&!M.open&&Math.hypot(cx-190,cy-260)<110){M.open=true;M.reads++;sndPaper(.35,.25);return}
  const s=slots.find(s=>Math.hypot(cx-s.x,cy-s.y)<(slots.length>8?58:74));if(!s)return;
  if(M.state==='task'){if(list.includes(s.k)&&!s.sel){s.sel=true;M.got++;M.open=false;sndPaper(.4,.25);if(M.got===1)showHint('Le papyrus se roulait à chaque offrande. Le relire ? Il suffisait de le toucher.');
     if(M.got===N){M.state='burn';M.t0=performance.now();showHint('Puis Thamus prenait le papyrus… et le jetait au vent.');setTimeout(()=>{M.score=N;M.state='result';showHint(M.reads<=1&&!M.err?'« Tu ne l’as lu qu’une fois : tu t’es forcée à retenir. Mais qui fait cet effort, quand la liste est toujours là ? »':M.reads<=1?'« Une seule lecture, et presque tout de mémoire. Les erreurs montrent l’effort : c’est lui qui fait retenir. »':'« Tu l’as relu '+(M.reads-1)+' fois : la liste faisait l’effort à ta place. » Exactement la crainte de Thamus.')},1600)}}
   else if(!list.includes(s.k)){M.err++;s.shake=performance.now();sndTone(330,.4,.08);showHint('Thamus fronçait les sourcils : ce n’était pas sur la liste. « Tu peux la relire. »')}}
  else if(M.state==='recall'&&!s.sel){const n=slots.filter(o=>o.sel).length;if(n>=N)return;s.sel=true;sndPaper(.25,.2);if(n+1===N){M.score=slots.filter(o=>o.sel&&list.includes(o.k)).length;M.state='result';
   showHint(M.score===N&&M.reads<=2?'« Tu ne l’as presque pas relu : tu t’es forcée à retenir. Mais qui fait cet effort, quand la liste est là ? »':M.score===N?'« Tout juste. Mais tu l’as relu '+(M.reads-1)+' fois : la liste faisait l’effort à ta place. » C’est le piège que craignait Thamus.':'Le papyrus était toujours là, alors je le relisais… et ma mémoire, elle, ne gardait rien. Exactement la crainte de Thamus.')}}},
 move(){},up(){},solve(){M.done=true}};M.list=list;M.slots=slots;return M}
const KING=doodle(200,230,x=>{
  F(x,'#e8b850',c=>rrect(c,30,40,140,170,12));F(x,'#c8902a',c=>rrect(c,20,150,160,64,10));
  F(x,'#f6f0e2',c=>{c.moveTo(62,110);c.lineTo(138,110);c.lineTo(150,200);c.lineTo(50,200);c.closePath()});
  F(x,'#2a6ad8',c=>{c.moveTo(70,112);c.lineTo(130,112);c.lineTo(124,128);c.lineTo(76,128);c.closePath()});
  [[60,150],[140,150]].forEach(([a,b])=>F(x,'#c98a5a',c=>c.ellipse(a,b,10,22,a<100?.3:-.3,0,7)));
  F(x,'#2a6ad8',c=>{c.moveTo(58,108);c.lineTo(72,50);c.quadraticCurveTo(100,30,128,50);c.lineTo(142,108);c.lineTo(124,96);c.lineTo(76,96);c.closePath()});
  x.strokeStyle='#ffd27a';x.lineWidth=4;[62,74,86].forEach(y=>{x.beginPath();x.moveTo(70,y+(y-50)*.2);x.lineTo(78,y);x.moveTo(130,y+(y-50)*.2);x.lineTo(122,y);x.stroke()});x.strokeStyle='#2a1a22';x.lineWidth=3;
  F(x,'#c98a5a',c=>c.ellipse(100,74,22,26,0,0,7));
  F(x,'#2a6ad8',c=>{c.moveTo(76,58);c.quadraticCurveTo(100,40,124,58);c.lineTo(124,64);c.lineTo(76,64);c.closePath()});
  F(x,'#ffd27a',c=>{c.moveTo(96,48);c.quadraticCurveTo(100,36,104,48);c.closePath()});
  x.fillStyle='#2a1a22';x.beginPath();x.arc(92,76,3,0,7);x.arc(108,76,3,0,7);x.fill();
  x.beginPath();x.moveTo(92,88);x.lineTo(108,88);x.stroke();
  F(x,'#3a2410',c=>{c.moveTo(96,98);c.lineTo(104,98);c.lineTo(102,112);c.lineTo(98,112);c.closePath()});
});

/* 3. Les pierres qui chantent : chaque lieu garde une note… le rouleau les mélange */
const STONE_NOTES=[392,494,587];
// les animaux gravés sur les piliers de Göbekli Tepe : vautour, renard, sanglier, serpent
const BEASTS=[['le vautour',doodle(140,120,x=>{// ailes déployées, tête nue, bec crochu
   F(x,'#4a3a4a',c=>{c.moveTo(70,60);c.bezierCurveTo(50,30,20,20,6,40);c.lineTo(20,44);c.lineTo(12,56);c.lineTo(28,56);c.lineTo(24,68);c.bezierCurveTo(44,64,58,70,70,76);c.bezierCurveTo(82,70,96,64,116,68);c.lineTo(112,56);c.lineTo(128,56);c.lineTo(120,44);c.lineTo(134,40);c.bezierCurveTo(120,20,90,30,70,60);c.closePath()});
   F(x,'#5a4a5a',c=>{c.ellipse(70,78,14,22,0,0,7)});F(x,'#4a3a4a',c=>{c.moveTo(60,96);c.lineTo(70,112);c.lineTo(80,96);c.closePath()});
   F(x,'#f2c8b0',c=>c.arc(70,50,10,0,7));F(x,'#f0d060',c=>{c.moveTo(76,48);c.quadraticCurveTo(88,50,84,60);c.quadraticCurveTo(80,54,74,54);c.closePath()});x.fillStyle='#2a1a22';x.beginPath();x.arc(72,47,2,0,7);x.fill()})],
 ['le renard',doodle(140,120,x=>{// de profil, museau pointu, oreilles, grande queue au bout blanc
   F(x,'#e0702a',c=>{c.moveTo(30,70);c.bezierCurveTo(10,50,6,92,26,90);c.bezierCurveTo(16,96,30,104,44,90);c.closePath()});F(x,'#fff',c=>{c.moveTo(10,64);c.bezierCurveTo(2,72,6,82,16,80);c.closePath()});
   F(x,'#e0702a',c=>c.ellipse(64,76,32,16,0,0,7));[44,56,74,86].forEach(u=>F(x,'#2a1a22',c=>c.rect(u,86,6,18)));
   F(x,'#e0702a',c=>{c.moveTo(88,70);c.lineTo(92,40);c.lineTo(102,56);c.lineTo(110,40);c.lineTo(114,58);c.lineTo(134,68);c.lineTo(112,78);c.closePath()});
   F(x,'#fff',c=>{c.moveTo(112,72);c.lineTo(134,68);c.lineTo(114,78);c.closePath()});x.fillStyle='#2a1a22';x.beginPath();x.arc(132,68,3,0,7);x.arc(108,62,2.5,0,7);x.fill()})],
 ['le sanglier',doodle(140,120,x=>{// corps massif, crête de poils, groin, défense
   F(x,'#6a4632',c=>{c.moveTo(20,80);c.bezierCurveTo(16,52,40,40,70,42);c.lineTo(74,34);c.lineTo(80,42);c.lineTo(86,34);c.lineTo(92,44);c.bezierCurveTo(108,46,118,56,124,70);c.lineTo(134,74);c.lineTo(132,86);c.lineTo(118,88);c.bezierCurveTo(110,96,40,98,20,80);c.closePath()});
   F(x,'#4a2e20',c=>{[[34,88],[52,90],[90,90],[106,88]].forEach(([u,v])=>c.rect(u,v,9,18))});F(x,'#d89a8a',c=>c.ellipse(132,80,5,7,0,0,7));
   F(x,'#fffaf0',c=>{c.moveTo(120,86);c.quadraticCurveTo(128,80,126,70);c.lineTo(122,82);c.closePath()});F(x,'#6a4632',c=>{c.moveTo(98,48);c.lineTo(104,34);c.lineTo(110,50);c.closePath()});x.fillStyle='#2a1a22';x.beginPath();x.arc(114,62,2.5,0,7);x.fill()})],
 ['le serpent',doodle(140,120,x=>{x.lineCap='round';x.lineJoin='round';const path=c=>{c.beginPath();c.moveTo(14,96);c.bezierCurveTo(40,60,60,110,80,74);c.bezierCurveTo(96,44,112,56,118,44)};
   x.strokeStyle='#2a1a22';x.lineWidth=20;path(x);x.stroke();x.strokeStyle='#5aa04a';x.lineWidth=14;path(x);x.stroke();x.strokeStyle='#f0d060';x.lineWidth=4;x.setLineDash([4,10]);path(x);x.stroke();x.setLineDash([]);
   F(x,'#5aa04a',c=>c.ellipse(122,40,13,10,-.5,0,7));x.fillStyle='#2a1a22';x.beginPath();x.arc(126,36,2.5,0,7);x.fill();x.strokeStyle='#e0445a';x.lineWidth=2.5;x.beginPath();x.moveTo(133,34);x.lineTo(140,30);x.moveTo(136,32);x.lineTo(139,38);x.stroke()})]];
const PIL_NOTES=[330,392,494,587];
// le décor de Göbekli Tepe, en couches de papier découpé (jour et nuit)
const PIERRES_BG=(()=>{const mk=night=>{const o=mkC();
  const sky=cut(x=>{const g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,night?'#0e1236':'#2a3270');g.addColorStop(.6,night?'#22205a':'#8a5a8a');g.addColorStop(1,night?'#2a2050':'#f2a65a');x.fillStyle=g;x.fillRect(0,0,MS,MS);
    for(let i=0;i<(night?120:40);i++)fp(x,`rgba(255,246,216,${night?rnd(.5,1):rnd(.2,.5)})`,c=>c.arc(rnd(0,MS),rnd(0,MS*.5),rnd(1,2.4),0,7))},{border:0,outline:0,crayon:.5});
  const star=cut(x=>{if(night){fp(x,'#fff0c4',c=>c.arc(600,150,34,0,7));fp(x,night?'#22205a':'#8a5a8a',c=>c.arc(614,140,30,0,7))}else{fp(x,'#ffcf6a',c=>c.arc(560,470,62,0,7))}},{border:5,outline:0});
  const far=cut(x=>fp(x,night?'#2c2a5e':'#7a5a8a',c=>{wave(c,440,26,3,1.2,-10,MS+10,MS)}),{border:0,outline:1.6});
  const mid=cut(x=>fp(x,night?'#28354a':'#6a7a4a',c=>{wave(c,500,16,4,.4,-10,MS+10,MS)}),{border:5,outline:1.6});
  const ground=cut(x=>{fp(x,night?'#2f4a34':'#6f9a4a',c=>{wave(c,548,6,3,2,-10,MS+10,MS)});for(let i=0;i<26;i++){const gx2=rnd(10,MS-10),gy=rnd(640,740);fp(x,night?'#3f5e3a':'#8fba5a',c=>{c.moveTo(gx2-14,gy);c.quadraticCurveTo(gx2-10,gy-30,gx2-4,gy-36);c.quadraticCurveTo(gx2-2,gy-14,gx2,gy-4);c.quadraticCurveTo(gx2+4,gy-28,gx2+12,gy-30);c.quadraticCurveTo(gx2+10,gy-10,gx2+14,gy);c.closePath()})}},{border:5,outline:1.6});
  compose(o,[[sky,0],[star,.6],[far,1],[mid,1.6],[ground,2.2]]);return o};return{day:mk(false),night:mk(true)}})();
const PILLAR=(()=>{const P=cut(x=>{const px=384,py=440;fp(x,'#c4bba4',c=>{c.moveTo(px-36,py+120);c.lineTo(px-32,py-86);c.quadraticCurveTo(px-66,py-84,px-62,py-108);c.lineTo(px-58,py-130);c.quadraticCurveTo(px,py-142,px+62,py-128);c.lineTo(px+64,py-104);c.quadraticCurveTo(px+62,py-84,px+32,py-86);c.lineTo(px+38,py+120);c.closePath()});
   fp(x,'rgba(255,255,255,.25)',c=>{c.moveTo(px-58,py-128);c.quadraticCurveTo(px,py-140,px+60,py-126);c.lineTo(px+58,py-112);c.quadraticCurveTo(px,py-124,px-56,py-114);c.closePath()});fp(x,'rgba(0,0,0,.12)',c=>{c.moveTo(px+6,py-86);c.lineTo(px+32,py-86);c.lineTo(px+38,py+120);c.lineTo(px+8,py+120);c.closePath()});
   x.strokeStyle='rgba(70,58,46,.6)';x.lineWidth=4;x.lineCap='round';[-1,1].forEach(k=>{x.beginPath();x.moveTo(px+k*30,py-70);x.quadraticCurveTo(px+k*34,py-20,px+k*6,py+4);x.stroke()});x.beginPath();x.moveTo(px-14,py+14);x.lineTo(px+14,py+14);x.stroke()},{border:6,outline:2});
  const sh=mkC(),sx=sh.getContext('2d');sx.filter='blur(6px)';sx.globalAlpha=.4;sx.drawImage(P.sh,8,10);return{c:P.c,sh}})();
function mkPierres(){// le premier lieu : les piliers chantent une histoire ; on la rechante ; puis, sans les pierres, on la retrouve… en revoyant les pierres
 const AN=[0,1,2,3].sort(()=>Math.random()-.5);const P=[0,1,2,3].map(i=>({x:168+i*144,y:440,t:-9,a:AN[i]}));const seq=[0,1,2,3].sort(()=>Math.random()-.5);
 const M={wantsTap:()=>M.state==='intro'||M.state==='end',seq,state:'intro',len:3,inp:0,got:[],done:false,hint:'Il y a 11 600 ans, des chasseurs dressaient ici des piliers géants, gravés d’animaux. Papa disait qu’ils chantaient une histoire.',
 light(i,dur=1){P[i].t=performance.now();sndTone(PIL_NOTES[i],1.1*dur,.15);M.big=i;M.bt=performance.now()},
 show(){M.state='show';M.inp=0;seq.slice(0,M.len).forEach((p,k)=>setTimeout(()=>M.light(p),600+k*900));setTimeout(()=>{M.state='input';M.big=-1;showHint(M.len===3?'« À toi de rechanter l’histoire : touche les pierres dans le même ordre. »':'« L’histoire s’allonge. Rechante-la. »')},600+M.len*900)},
 draw(c,T){const night=M.state==='ask'||M.state==='end';c.drawImage(night?PIERRES_BG.night:PIERRES_BG.day,0,0);
  P.forEach((p,i)=>{const age=(performance.now()-p.t)/1000,glow=Math.max(0,1-age/.9);if(M.state==='ask')return;c.save();c.globalAlpha=night?.15:1;dropShadow(c,p.x,p.y+118,52,10);
   c.drawImage(PILLAR.sh,p.x-384,p.y-440);c.drawImage(PILLAR.c,p.x-384,p.y-440);
   const b=BEASTS[p.a][1];c.globalAlpha=(night?.15:1)*.6;c.drawImage(b,p.x-b.width*.4,p.y-10,b.width*.8,b.height*.8);c.globalAlpha=night?.15:1;
   if(glow>0){c.globalCompositeOperation='lighter';blob(c,p.x,p.y,120,`rgba(255,220,140,${.7*glow})`);c.globalCompositeOperation='source-over'}c.restore()});
  if(M.big>=0&&!night){const k=Math.min(1,(performance.now()-M.bt)/220),b=BEASTS[P[M.big].a][1],s=1.9*k;c.save();c.translate(P[M.big].x,220);c.scale(s,s);c.drawImage(b,-b.width/2,-b.height/2);c.restore()}
  if(M.state==='input'||M.state==='show'){for(let k=0;k<M.len;k++){c.fillStyle=k<M.inp?'#ffd27a':'rgba(255,240,210,.35)';c.beginPath();c.arc(384+(k-(M.len-1)/2)*34,690,9,0,7);c.fill()}}
  if(M.state==='intro'){txt(c,'toucher les pierres pour les écouter',384,690,36);const k=(tutT()*.7)%1;drawHand(c,P[1].x+14,P[1].y+10,k<.5)}
  if(M.state==='input'&&M.inp===0&&M.len===3){const k=(tutT()*.7)%1;drawHand(c,P[seq[0]].x+12,P[seq[0]].y+30,k<.5,.85)}
  if(M.state==='ask'||M.state==='end'){P.forEach((p,i)=>{const g=M.got.find(o=>o.i===i);c.save();c.setLineDash([8,8]);c.strokeStyle=g?(g.ok?'rgba(160,230,160,.9)':'rgba(255,170,120,.9)'):'rgba(255,240,210,.55)';c.lineWidth=4;c.beginPath();rrect(c,p.x-40,p.y-136,80,260,10);c.stroke();c.restore();
     if(g){txt(c,String(g.n),p.x,p.y-10,54,g.ok?'#bff0bf':'#ffc89a');if(M.state==='end'){const b=BEASTS[p.a][1];c.save();c.globalAlpha=.9;c.drawImage(b,p.x-b.width*.45,p.y+30,b.width*.9,b.height*.9);c.restore()}}});
    txt(c,M.state==='end'?`${M.got.filter(o=>o.ok).length} sur 4, de mémoire`:'les pierres ont disparu',384,120,38,'#fff3d6');if(M.state==='end')txt(c,'toucher pour continuer',384,720,34,'#ffd27a')}},
 down(cx,cy){if(M.state==='intro'){M.show();return}
  if(M.state==='input'){const i=P.findIndex(p=>Math.abs(cx-p.x)<70&&cy>p.y-150&&cy<p.y+130);if(i<0)return;M.light(i,.8);
   if(i===seq[M.inp]){M.inp++;if(M.inp>=M.len){if(M.len===3){M.len=4;M.state='wait';showHint('« Bien ! Écoute la suite… »');setTimeout(()=>M.show(),1300)}else{M.state='wait';showHint('« Tu connais l’histoire des pierres. »');setTimeout(()=>{M.state='ask';M.inp=0;M.got=[];showHint('Puis papa éteignait la lumière. « Les pierres ont disparu. Touche leurs places, dans l’ordre de l’histoire. »')},1800)}}}
   else{M.state='wait';showHint('« Presque. Écoute encore. »');setTimeout(()=>M.show(),1200)}return}
  if(M.state==='ask'){const i=P.findIndex(p=>Math.abs(cx-p.x)<70&&cy>p.y-150&&cy<p.y+130);if(i<0||M.got.some(o=>o.i===i))return;const ok=i===seq[M.inp];M.got.push({i,ok,n:M.inp+1});sndTone(PIL_NOTES[i],.9,.13);M.inp++;
   if(M.inp>=4){M.state='end';const n=M.got.filter(o=>o.ok).length;showHint(n>=3?'« Tu as revu les pierres dans ta tête, n’est-ce pas ? Le chant était là où on l’avait laissé. C’est ça, un palais de mémoire. »':'« Les places t’ont déjà aidée. Avec un peu d’habitude, on retrouve tout un chant comme ça : c’est un palais de mémoire. »')}return}
  if(M.state==='end'){M.done=true}},
 move(){},up(){},solve(){M.done=true}};return M}

/* 4. Alexandrie : la bibliothèque garde, le phare guide. Il faut les deux. */
function mkAlex(){const boats=[0,1,2].map(i=>({x:150+i*200,y:640,ph:i*2,dir:1}));
 const M={lit:false,stored:false,scroll:{x:640,y:720},drag:false,done:false,hint:'Des bateaux cherchent le port dans la nuit. Range le rouleau dans la bibliothèque, et allume le phare.',
 draw(c,T){c.drawImage(harborBG,0,0);
  if(M.stored)F(c,'#f0e0b8',cc=>cc.arc(262,473,13,0,7));else{c.strokeStyle=`rgba(255,215,120,${.5+.4*Math.sin(T*4)})`;c.setLineDash([5,4]);c.lineWidth=3;c.strokeRect(246,454,32,38);c.setLineDash([])}
  if(M.lit){const w=.5+.5*Math.sin(T*2);c.save();c.globalCompositeOperation='lighter';blob(c,555,200,130,'rgba(255,190,90,.6)');const gg=c.createLinearGradient(555,200,80,420);gg.addColorStop(0,`rgba(255,230,160,${.45*w+.2})`);gg.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=gg;c.beginPath();c.moveTo(555,200);c.lineTo(60,380);c.lineTo(60,520);c.closePath();c.fill();c.restore();
   F(c,'#ffb347',cc=>{cc.moveTo(540,208);cc.quadraticCurveTo(555,150+Math.sin(T*9)*6,570,208)})}
  else{c.strokeStyle=`rgba(255,215,120,${.4+.4*Math.sin(T*4)})`;c.lineWidth=3;c.setLineDash([5,4]);c.beginPath();c.arc(555,196,30,0,7);c.stroke();c.setLineDash([])}
  // les bateaux restent sur l'eau : perdus ils tournent en rond, guidés ils rentrent au port (devant la bibliothèque)
  c.fillStyle='rgba(30,50,120,.35)';c.fillRect(0,580,MS,190);
  // les bateaux restent sur l'eau, au premier plan : perdus ils errent, guidés par la lumière seule ils s'approchent du phare sans savoir où accoster, avec les deux ils rentrent au quai de la bibliothèque
  boats.forEach((b,i)=>{const both=M.lit&&M.stored;let tx;if(both)tx=220+i*60;else if(M.lit)tx=520+Math.sin(T*.6+b.ph)*50+i*20;else tx=150+i*200+Math.sin(T*.35+b.ph)*80;b.dir=tx>b.x+1?1:tx<b.x-1?-1:b.dir;b.x+=(tx-b.x)*.012;
   const y=640+i*18+Math.sin(T*1.6+b.ph)*3;c.save();c.translate(b.x,y);c.scale(b.dir,1);c.rotate(Math.sin(T*1.3+b.ph)*.06);c.drawImage(SPR.boat,-SPR.boat.width/2,-SPR.boat.height+10);c.restore()});
  if(M.lit&&M.stored){c.fillStyle='#8a5a34';c.strokeStyle='#2a1a22';c.lineWidth=3;c.beginPath();c.rect(170,608,200,14);c.fill();c.stroke()}
  if(!M.stored){dropShadow(c,M.scroll.x,M.scroll.y+16,50,8);c.drawImage(kidScroll,M.scroll.x-kidScroll.width/2,M.scroll.y-kidScroll.height/2)}},
 down(cx,cy){if(!M.stored&&Math.hypot(cx-M.scroll.x,cy-M.scroll.y)<70){M.drag=true;M.ox=cx-M.scroll.x;M.oy=cy-M.scroll.y}else if(!M.lit&&Math.hypot(cx-555,cy-205)<75){M.lit=true;M.check()}},
 move(cx,cy){if(M.drag){M.scroll.x=cx-M.ox;M.scroll.y=cy-M.oy}},
 up(){if(!M.drag)return;M.drag=false;if(Math.hypot(M.scroll.x-262,M.scroll.y-473)<80){M.stored=true;M.check()}else{M.scroll.x=640;M.scroll.y=720}},
 check(){if(M.lit&&M.stored&&!M.fin){M.fin=true;showHint('Le savoir est gardé, la lumière guide : les bateaux rentrent au port.');setTimeout(()=>M.done=true,3200)}else if(M.lit)showHint('La lumière guide les bateaux… mais ils ne savent pas où accoster. Range le rouleau.');else if(M.stored)showHint('Le savoir est rangé, mais personne ne le voit dans la nuit. Allume le phare.')},
 solve(){M.lit=M.stored=true;M.done=true}};return M}

/* 4. Allumer les phares : chaque souvenir retrouvé allume une lampe ; le rouleau ne fait que garder la réponse */
const PQ=[['« À Göbekli Tepe, comment retrouvait-on un chant ? »','En revenant à sa pierre','En le gravant en lettres','En le demandant au roi'],
 ['« Comment l’aède gardait-il 16 000 vers ? »','Rangés dans des lieux','Écrits sur sa lyre','Appris d’un seul bloc'],
 ['« Que craignait Thamus, avec l’écriture ? »','Qu’on s’y fie, et qu’on oublie','Qu’on écrive des mensonges','Que les rouleaux brûlent']];
const PHARE_BG=mkC();
{const sky=nightCard('#141250','#2a3a7a'),sea=cut(x=>fp(x,'#2a3e8a',c=>wave(c,446,6,6,0,-10,MS+10,MS+10)));
 const lib=cut(x=>{fp(x,'#e6d4ae',c=>rrect(c,470,300,220,150,6));fp(x,'#c8463a',c=>{c.moveTo(454,304);c.lineTo(580,250);c.lineTo(706,304);c.closePath()});
   for(let k=0;k<4;k++)fp(x,'#f6eedc',c=>rrect(c,486+k*52,316,20,128,3));
   for(let k=0;k<3;k++){const px=508+k*52;fp(x,'#5a3418',c=>rrect(c,px,330,30,104,3));for(let r=0;r<3;r++)fp(x,'#f0e0b8',c=>c.arc(px+15,350+r*32,10,0,7))}});
 const tower=cut(x=>{fp(x,'#5a5a78',c=>c.ellipse(250,452,120,22,0,0,7));fp(x,'#f2ece0',c=>{c.moveTo(196,450);c.lineTo(214,190);c.lineTo(286,190);c.lineTo(304,450);c.closePath()});
   fp(x,'#f4eee4',c=>rrect(c,222,118,56,76,4));fp(x,'#e8bc50',c=>rrect(c,206,184,88,10,3));fp(x,'#e8bc50',c=>rrect(c,216,110,68,10,3));fp(x,'#c8463a',c=>{c.moveTo(222,110);c.lineTo(250,72);c.lineTo(278,110);c.closePath()});
   [[250,156],[250,262],[250,366]].forEach(([a,b2])=>fp(x,'#2a2a4a',c=>rrect(c,a-16,b2-20,32,40,14)))});
 compose(PHARE_BG,[[sky,0],[sea,1],[lib,2.2],[tower,2.6]])}
const LAMPS=[[250,366],[250,262],[250,156]];
function mkPhares(){const boats=[0,1,2].map(i=>({x:90+i*250,ph:i*2,dir:1}));
 const M={q:0,lamps:[0,0,0],done:false,ans:null,opts:null,mode:'choose',hint:'« Si tu te perds, allume tes phares », disait papa. Pour chaque question : relire le rouleau de la bibliothèque, ou chercher dans sa mémoire.',
 mk(){const [q,a,...bs]=PQ[M.q];M.opts=[[a,1],...bs.map(b=>[b,0])].sort(()=>Math.random()-.5)},
 next(){M.q++;M.ans=null;M.opts=null;M.mode='choose';if(M.q>=3){const b=M.lamps.filter(v=>v===2).length;showHint(b===3?'Trois lampes vives : le phare éclaire loin, les bateaux rentrent. Le rouleau garde ; c’est ce qu’on retient qui éclaire.':b===0?'Le rouleau avait toutes les réponses… mais le phare brille à peine. Ce qu’on n’a pas retenu n’éclaire pas.':'Le rouleau garde les réponses. Mais seules celles que je portais en moi brillent vraiment.');setTimeout(()=>M.done=true,5200)}},
 draw(c,T){c.drawImage(PHARE_BG,0,0);const vivid=M.lamps.filter(v=>v===2).length,fin=M.q>=3;
  if(fin&&vivid>0){const w=.5+.5*Math.sin(T*1.4),pw=vivid/3;c.save();c.globalCompositeOperation='lighter';const ang=Math.sin(T*.6)*.5;c.translate(250,156);c.rotate(ang);const gg=c.createLinearGradient(0,0,560*pw,0);gg.addColorStop(0,`rgba(255,230,160,${(.3+.2*w)*pw})`);gg.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=gg;c.beginPath();c.moveTo(0,0);c.lineTo(600*pw,-90*pw);c.lineTo(600*pw,90*pw);c.closePath();c.fill();c.restore()}
  LAMPS.forEach(([x,y],i)=>{const v=M.lamps[i];if(v){c.save();c.globalCompositeOperation='lighter';blob(c,x,y,v===2?80+6*Math.sin(T*3+i):34,v===2?'rgba(255,200,110,.8)':'rgba(255,200,110,.25)');c.restore();c.save();c.fillStyle=v===2?'#ffe08a':'#8a7a5a';c.beginPath();rrect(c,x-16,y-20,32,40,14);c.fill();c.restore()}
   else if(i===M.q){const p=.5+.5*Math.sin(T*4);c.save();c.strokeStyle=`rgba(255,220,140,${.4+.5*p})`;c.lineWidth=4;c.setLineDash([6,6]);c.beginPath();c.arc(x,y,30,0,7);c.stroke();c.restore()}});
  boats.forEach((b,i)=>{const come=fin&&i<vivid,home=come?370+i*95:90+i*250+Math.sin(T*.35+b.ph)*50;b.dir=home>b.x+1?1:home<b.x-1?-1:b.dir;b.x+=(home-b.x)*.015;const y=(come?520:500+i*40)+Math.sin(T*1.6+b.ph)*3;c.save();c.translate(b.x,y);c.scale(b.dir*1.2,1.2);c.rotate(Math.sin(T*1.3+b.ph)*.06);c.drawImage(SPR.boat,-SPR.boat.width/2,-SPR.boat.height+10);c.restore()});
  if(fin){tagBox(c,60,620,648,110,16);txt(c,`${vivid} sur 3 retrouvées de mémoire`,384,660,36,'#5a3418');txt(c,'Le rouleau garde. Ce qu’on retient éclaire.',384,706,34,'#22306e');return}
  if(!M.opts)M.mk();const [q,a]=PQ[M.q];c.save();tagBox(c,24,404,720,356,18);
  c.font='700 42px Caveat, cursive';c.fillStyle='#22306e';const ls=jLines(c,q,670);ls.forEach((l,i)=>c.fillText(l,384-c.measureText(l).width/2,450+i*44));const by=ls.length>1?510:478;M.by=by;
  if(M.mode==='choose'){[['De mémoire','la lampe brillera fort'],['Relire le rouleau','la bibliothèque le sait']].forEach(([t,u],i)=>{const y=by+i*104;tagBox(c,48,y,672,88,14);c.fillStyle='#2a1a22';c.font='700 44px Caveat, cursive';c.fillText(t,384-c.measureText(t).width/2,y+46);c.font='600 30px Caveat, cursive';c.fillStyle='#7a5a3a';c.fillText(u,384-c.measureText(u).width/2,y+76)})}
  else if(M.mode==='scroll'){c.save();c.translate(384,by+110);const w=560;c.fillStyle='#f2e2b0';c.fillRect(-w/2,-70,w,140);[-1,1].forEach(k=>{c.fillStyle='#d8bf86';c.beginPath();c.ellipse(k*w/2,0,14,76,0,0,7);c.fill()});c.font='700 44px Caveat, cursive';c.fillStyle='#5a3418';c.textAlign='center';c.fillText(a,0,14);c.restore();txt(c,'toucher pour continuer',384,by+230,34,'#7a5a3a')}
  else{M.opts.forEach(([t,ok],i)=>{const y=by+i*78,sel=M.ans&&(M.ans.i===i||(!M.ans.ok&&ok));tagBox(c,48,y,672,68,14);if(sel){c.save();c.fillStyle=ok?'rgba(120,190,100,.35)':'rgba(220,110,90,.3)';c.beginPath();rrect(c,48,y,672,68,8);c.fill();c.restore()}c.fillStyle='#2a1a22';c.font='700 44px Caveat, cursive';c.fillText(t,384-c.measureText(t).width/2,y+48)})}
  c.restore()},
 down(cx,cy){if(M.q>=3||M.ans)return;
  if(M.mode==='scroll'){M.lamps[M.q]=1;sndTone([392,440,494][M.q],.8,.06);showHint('Une petite lueur. Le rouleau a répondu à ma place.');M.next();return}
  if(cx<48||cx>720)return;
  if(M.mode==='choose'){const i=[0,1].find(i=>cy>M.by+i*104-4&&cy<M.by+i*104+92);if(i==null)return;sndPaper(.3,.25);if(i===0)M.mode='mem';else{M.mode='scroll';showHint('La bibliothèque gardait la réponse. Le rouleau se déroulait…')}return}
  if(M.mode==='scroll'){M.lamps[M.q]=1;sndTone([392,440,494][M.q],.8,.06);showHint('Une petite lueur. Le rouleau a répondu à ma place.');M.next();return}
  if(!M.opts)return;M.opts.forEach(([t,ok],i)=>{const y=M.by+i*78;if(cy>y-4&&cy<y+72){M.ans={i,ok};sndPaper(.3,.25);setTimeout(()=>{M.lamps[M.q]=ok?2:1;if(ok){sndTone([523,659,784][M.q],1.2,.12);showHint('Retrouvé de mémoire : la lampe brille fort.')}else showHint('Pas tout à fait : la bonne réponse était sur le rouleau. Une petite lueur seulement.');M.next()},ok?700:2000)}})},
 move(){},up(){},solve(){M.lamps=[2,2,2];M.q=3;M.done=true},wantsTap:()=>M.mode==='scroll'&&M.q<3};return M}
