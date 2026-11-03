/* ---------- les manipulations, peintes dans le même style gouache que les souvenirs ---------- */
const txt=(c,s,x,y,size,col='#fff3d6',al='center',w='700',it=false)=>{c.save();c.font=`600 ${Math.round(size*1.2)}px Caveat, "Patrick Hand", cursive`;{const mw=al==='center'?2*Math.min(x,MS-x)-100:MS-x-30;while(size>24&&c.measureText(s).width>mw){size-=1;c.font=`600 ${Math.round(size*1.2)}px Caveat, "Patrick Hand", cursive`}}c.textAlign=al;c.textBaseline='middle';const dk=/^#/.test(col)&&(parseInt(col.slice(1,3),16)*.3+parseInt(col.slice(3,5),16)*.59+parseInt(col.slice(5,7),16)*.11)<128;if(dk){c.lineJoin='round';c.lineWidth=Math.max(4,size*.22);c.strokeStyle='rgba(255,250,236,.85)';c.strokeText(s,x,y)}else{c.fillStyle='rgba(10,6,30,.5)';c.fillText(s,x+1.5,y+2)}c.fillStyle=col;c.fillText(s,x,y);c.restore()};
const gouacheBG=(top,bot,hue,l0,l1)=>{const o=mkC(),x=o.getContext('2d');const g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,MS,MS);
  for(let i=0;i<1500;i++){const cy=rnd(0,MS);dab(x,rnd(0,MS),cy,rnd(24,54),rnd(8,14),rnd(-.2,.2),hue+rnd(-12,12),rnd(35,55),lerp(l0,l1,cy/MS)+rnd(-6,6),rnd(.15,.3))}return o};
const starsOn=(x,n,y1)=>{for(let i=0;i<n;i++){const a=rnd(0,MS),b=rnd(0,y1),r=rnd(.8,2.2);blob(x,a,b,r*4,'rgba(255,240,200,.25)');x.fillStyle=`rgba(255,246,220,${rnd(.5,.95)})`;x.beginPath();x.arc(a,b,r,0,7);x.fill()}};
// rouleaux, lune, soleil, bateaux : de petites peintures prêtes à poser
const SPR={
 scroll:sprite(120,46,(c)=>{const g=c.createLinearGradient(0,6,0,40);g.addColorStop(0,'#fff4d6');g.addColorStop(.35,'#ecd7a6');g.addColorStop(.8,'#b8925a');g.addColorStop(1,'#8a6838');c.fillStyle=g;c.beginPath();c.moveTo(16,7);c.lineTo(104,7);c.ellipse(104,23,8,16,0,-Math.PI/2,Math.PI/2);c.lineTo(16,39);c.closePath();c.fill();
  for(let i=0;i<10;i++){c.strokeStyle='rgba(140,100,50,.25)';c.lineWidth=1;c.beginPath();c.moveTo(20+i*9,8);c.lineTo(18+i*9,38);c.stroke()}
  const e=c.createRadialGradient(14,23,1,14,23,17);e.addColorStop(0,'#c9a46a');e.addColorStop(1,'#f3e2b8');c.fillStyle=e;c.beginPath();c.ellipse(16,23,8,16,0,0,7);c.fill();c.strokeStyle='rgba(120,80,40,.7)';c.lineWidth=1.2;c.beginPath();for(let a=0;a<14;a+=.25){const r=a*.55;c.lineTo(16+Math.cos(a)*r*.5,23+Math.sin(a)*r)}c.stroke();
  c.fillStyle='#a8282e';c.fillRect(56,6,6,34);c.beginPath();c.moveTo(59,40);c.lineTo(52,46);c.lineTo(56,40);c.moveTo(59,40);c.lineTo(66,46);c.lineTo(62,40);c.fill()}),
 sheet:sprite(260,60,(c)=>{const g=c.createLinearGradient(0,0,0,60);g.addColorStop(0,'#f6e8c4');g.addColorStop(1,'#dcc290');c.fillStyle=g;c.fillRect(0,8,260,44);for(let r=0;r<4;r++)for(let k=6;k<252;k+=rnd(10,22)){c.fillStyle='rgba(70,45,25,.55)';c.fillRect(k,16+r*9,rnd(5,14),2)}}),
 moon:sprite(120,120,(c)=>{blob(c,60,60,58,'rgba(255,240,200,.4)');paintShape(c,x=>{x.beginPath();x.arc(60,60,32,0,7)},'#fff0c4',[28,28,64,64],{n:60,edge:false});c.fillStyle='rgba(200,180,150,.35)';[[50,52,7],[70,68,5],[66,48,4]].forEach(([a,b,r])=>{c.beginPath();c.arc(a,b,r,0,7);c.fill()})}),
 sun:sprite(160,160,(c)=>{blob(c,80,80,78,'rgba(255,220,140,.55)');paintShape(c,x=>{x.beginPath();x.arc(80,80,34,0,7)},'#ffd774',[46,46,68,68],{n:60,edge:false})}),
 boat:sprite(70,60,(c)=>{paintShape(c,x=>{x.beginPath();x.moveTo(30,6);x.lineTo(30,42);x.lineTo(58,42);x.closePath()},'#efe4d0',[30,6,28,36],{n:20});paintShape(c,x=>{x.beginPath();x.moveTo(6,44);x.lineTo(64,44);x.quadraticCurveTo(58,56,36,56);x.quadraticCurveTo(14,56,6,44);x.closePath()},'#7a4a2a',[6,44,58,12],{n:20})})};
let pile=(c,x,y,n,sel)=>{for(let i=0;i<n;i++)c.drawImage(SPR.scroll,x-60+((i*37)%17-8),y-23-i*15);if(sel){c.save();c.strokeStyle='#ffd27a';c.lineWidth=5;c.beginPath();c.arc(x,y-30,96,0,7);c.stroke();c.restore()}};

// la lune suit un bel arc de cercle, bien symétrique
const moonArc=q=>{const a=Math.PI*(1.1+.8*q);return[385+250*Math.cos(a),560+250*Math.sin(a)]};
/* 1. l'Iliade : prédire, puis faire passer quatre nuits */
const iliadeBG=(()=>{const o=gouacheBG('#141247','#4a3480',255,18,40),x=o.getContext('2d');starsOn(x,140,MS*.55);return o})();
const theatreNight=(()=>{const o=mkC(),x=o.getContext('2d');x.drawImage(iliadeBG,0,0);
  [[330,60,'#5a4a7a'],[270,90,'#4a3c6a'],[210,118,'#3c3058']].forEach(([r,h,col])=>paintShape(x,c=>{c.beginPath();c.ellipse(384,650,r,h,0,Math.PI,0);c.closePath()},col,[384-r,650-h,2*r,h],{ang:0,n:120,edge:'rgba(255,230,190,.25)'}));
  paintShape(x,c=>{c.beginPath();c.ellipse(384,652,150,26,0,0,7)},'#8a7a9a',[234,626,300,52],{n:60});
  person(x,{kind:'man',x:384,y:650,h:120,view:'front',armL:[-30,-30],armR:[40,-50],light:'right',glow:'rgba(255,240,200,.5)',col:{body:'#f0e6d6',skin:'#e8b89a',hair:'#d8d0c8',legs:'#f0e6d6'}});return o})();
function mkIliade(){const M={state:'predict',pick:-1,night:0,prog:0,done:false,hint:'Combien de vers un aède récitait-il de mémoire ? Touche ta réponse.',
  draw(c,T){if(M.state==='predict'||M.state==='reveal'){c.drawImage(iliadeBG,0,0);txt(c,'Combien de vers ?',384,190,48);[[220,'100',1],[384,'1 000',4],[548,'16 000',12]].forEach(([x,l,n],i)=>{pile(c,x,560,n,M.pick===i);txt(c,l,x,330,40,M.pick===i?'#ffd27a':'#fff3d6')})}
    else{c.drawImage(theatreNight,0,0);const p=M.prog,[mxp,my]=moonArc(p);
      if(M.dragX==null){for(let i=0;i<=24;i++){const q=i/24;if(q<p)continue;const [px,py]=moonArc(q),tw=.45+.45*Math.sin(T*3-i*.6);blob(c,px,py,14,`rgba(255,226,160,${tw*.5})`);c.fillStyle=`rgba(255,244,210,${tw})`;c.beginPath();c.arc(px,py,3.5+(i%3===0?2:0),0,7);c.fill()}
        const pu=(T*.6)%1;for(let r=0;r<2;r++){const k=(pu+r*.5)%1;c.strokeStyle=`rgba(255,236,190,${.45*(1-k)})`;c.lineWidth=2;c.beginPath();c.arc(mxp,my,40+k*46,0,7);c.stroke()}}
      blob(c,mxp,my,90+10*Math.sin(T*2),'rgba(255,230,170,.3)');c.drawImage(SPR.moon,mxp-60,my-60);
      const v=Math.min(16000,Math.round((M.night+p)*4000/100)*100);txt(c,v.toLocaleString('fr-FR')+' vers',384,170,60,'#ffd27a');txt(c,M.night<4?`nuit ${M.night+1} sur 4`:'quatre nuits',384,232,34,'#fff3d6','center','600',true);
      const L=(M.night+p)/4*380;if(L>2){c.drawImage(SPR.sheet,0,0,Math.min(260,L*260/380),60,190,580,L,60);c.drawImage(SPR.scroll,190+L-20,586,60,46)}}},
  down(cx){if(M.state==='predict'){const i=cx<302?0:cx<466?1:2;M.pick=i;M.state='reveal';showHint(i===2?'Bien vu : 16 000 vers. Fais-les réciter pour en sentir la taille.':'Plus que ça ! Fais réciter l’Iliade pour voir.');setTimeout(()=>{M.state='moon';showHint('Pose le doigt sur la lune et emmène-la le long des étoiles, de gauche à droite : une nuit de récit.')},1700)}else if(M.state==='moon')M.dragX=cx},
  move(cx){if(M.state!=='moon'||M.dragX==null)return;const d=(cx-M.dragX)/440;M.dragX=cx;if(d>0){M.prog+=d;if(M.prog>=1){M.night++;M.prog=0;if(M.night>=4){M.night=4;M.state='end';showHint('Quatre nuits pour réciter l’Iliade… de mémoire.');setTimeout(()=>M.done=true,1900)}}}},
  up(){M.dragX=null},solve(){M.pick=2;M.night=4;M.prog=0;M.state='end';M.done=true}};return M}

/* 2. la balance de Thamus */
const palaceBG=(()=>{const o=gouacheBG('#6a3e22','#c4945a',30,32,60),x=o.getContext('2d');
  [150,618].forEach(cx=>{paintShape(x,c=>{c.beginPath();c.rect(cx-34,110,68,560)},'#8a5a34',[cx-34,110,68,560],{ang:Math.PI/2,n:90});paintShape(x,c=>{c.beginPath();c.rect(cx-44,96,88,26)},'#2bb5b0',[cx-44,96,88,26],{n:20});paintShape(x,c=>{c.beginPath();c.moveTo(cx-44,96);c.quadraticCurveTo(cx,40,cx+44,96);c.closePath()},'#4fb36a',[cx-44,40,88,56],{n:20})});
  {const g=x.createLinearGradient(368,0,400,0);g.addColorStop(0,'#8a6020');g.addColorStop(.35,'#fff0b0');g.addColorStop(.6,'#e0b048');g.addColorStop(1,'#7a5418');x.fillStyle=g;x.fillRect(373,300,22,190);for(let k=0;k<4;k++){x.fillStyle='rgba(120,80,20,.35)';x.fillRect(376+k*5,302,1.5,186)}
   x.fillStyle=g;x.beginPath();x.moveTo(366,300);x.quadraticCurveTo(384,272,402,300);x.closePath();x.fill();
   const b2=x.createLinearGradient(0,480,0,510);b2.addColorStop(0,'#ffe9a0');b2.addColorStop(1,'#8a6020');x.fillStyle=b2;x.beginPath();x.moveTo(330,508);x.lineTo(438,508);x.lineTo(420,486);x.lineTo(348,486);x.closePath();x.fill();
   x.fillStyle='#2bb5b0';x.fillRect(352,492,64,5)}
  return o})();
const beamSpr=sprite(400,40,(c)=>{const g=c.createLinearGradient(0,10,0,30);g.addColorStop(0,'#fff0b0');g.addColorStop(.4,'#e8b850');g.addColorStop(1,'#8a6020');c.fillStyle=g;c.beginPath();c.moveTo(16,14);c.quadraticCurveTo(200,6,384,14);c.lineTo(384,26);c.quadraticCurveTo(200,20,16,26);c.closePath();c.fill();
  [16,384].forEach(x=>{const r=c.createRadialGradient(x-3,17,1,x,20,11);r.addColorStop(0,'#fff6c8');r.addColorStop(1,'#a87a28');c.fillStyle=r;c.beginPath();c.arc(x,20,10,0,7);c.fill()});
  const r=c.createRadialGradient(197,17,1,200,20,14);r.addColorStop(0,'#fff6c8');r.addColorStop(1,'#a87a28');c.fillStyle=r;c.beginPath();c.arc(200,20,14,0,7);c.fill();c.fillStyle='#2bb5b0';c.beginPath();c.arc(200,20,6,0,7);c.fill()});
const panSpr=sprite(170,160,(c)=>{c.strokeStyle='#c9952e';c.lineWidth=2;c.setLineDash([4,3]);[[28,136],[85,136],[142,136]].forEach(([x,y])=>{c.beginPath();c.moveTo(85,10);c.lineTo(x,y);c.stroke()});c.setLineDash([]);
  const g=c.createLinearGradient(0,128,0,156);g.addColorStop(0,'#fff0b0');g.addColorStop(.5,'#d8a640');g.addColorStop(1,'#7a5418');c.fillStyle=g;c.beginPath();c.moveTo(10,134);c.quadraticCurveTo(85,170,160,134);c.closePath();c.fill();c.fillStyle='#f6d88a';c.beginPath();c.ellipse(85,134,75,6,0,0,7);c.fill();c.fillStyle='#e8b850';c.beginPath();c.arc(85,10,6,0,7);c.fill()});
// des bouts de papyrus déchirés, posés de travers avec leur ombre : on a envie de les prendre
const tablet=(l1,l2,tint,w,h)=>sprite(w+20,h+22,(c)=>{const edge=(x)=>{x.beginPath();x.moveTo(8,8);for(let u=8;u<w;u+=7)x.lineTo(u,6+rnd(-2.5,2.5));x.lineTo(w+2,10);for(let v=10;v<h;v+=6)x.lineTo(w+2+rnd(-2.5,2.5),v);x.lineTo(w,h+2);for(let u=w;u>8;u-=7)x.lineTo(u,h+2+rnd(-2.5,2.5));x.lineTo(6,h);for(let v=h;v>8;v-=6)x.lineTo(6+rnd(-2.5,2.5),v);x.closePath()};
  c.save();c.translate(6,9);c.globalAlpha=.4;edge(c);c.fillStyle='#2a1408';c.filter='blur(3px)';c.fill();c.restore();c.filter='none';
  paintShape(c,edge,tint,[4,4,w,h],{ang:0,n:60,edge:'rgba(120,80,40,.55)',lw:1.5});
  c.save();edge(c);c.clip();for(let v=10;v<h;v+=5){c.strokeStyle=`rgba(150,110,60,${rnd(.12,.25)})`;c.lineWidth=1;c.beginPath();c.moveTo(6,v+rnd(-1,1));c.lineTo(w,v+rnd(-1,1));c.stroke()}for(let u=12;u<w;u+=9){c.strokeStyle='rgba(150,110,60,.1)';c.beginPath();c.moveTo(u,6);c.lineTo(u+rnd(-2,2),h);c.stroke()}c.restore();
  c.save();c.font=`700 ${h>40?28:20}px Alegreya, Georgia, serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#3a2414';c.fillText(l1,w/2+4,h>40?h*.4+4:h/2+5);if(h>40){c.font='italic 400 19px Alegreya, Georgia, serif';c.fillStyle='#5a3a24';c.fillText(l2,w/2+4,h*.76+4)}c.restore()});
function mkBalance(){const cards=[['Garder','les mots','thot'],['Partager','au loin','thot'],['Oublier','faute d’exercice','thamus'],['Se fier','à l’écrit','thamus']].map(([a,b,s],i)=>{const tint='#ecdcb0';return{side:s,rot:rnd(-.12,.12),big:tablet(a,b,tint,160,66),small:tablet(a,'',tint,124,34),hx:300+(i%2)*168,hy:540+Math.floor(i/2)*78,x:300+(i%2)*168,y:540+Math.floor(i/2)*78,placed:null,shake:0}});
  const M={cards,drag:null,ang:0,done:false,hint:'Range chaque idée sur le bon plateau : ce que Thot promet, ce que Thamus craint.',
  pans:()=>{const a=M.ang;return[[384-170*Math.cos(a),290-170*Math.sin(a)+128],[384+170*Math.cos(a),290+170*Math.sin(a)+128]]},
  draw(c,T){c.drawImage(palaceBG,0,0);const L=cards.filter(k=>k.placed==='thot').length,R=cards.filter(k=>k.placed==='thamus').length;M.ang+=((R-L)*.1-M.ang)*.12;
    const P=M.pans();P.forEach(([px,py],i)=>{c.drawImage(panSpr,px-85,py-134);txt(c,i?'Thamus craint':'Thot promet',px,py-158,30,i?'#ffe0c8':'#d8fff4')});
    c.save();c.translate(384,290);c.rotate(M.ang);c.drawImage(beamSpr,-200,-20);c.restore();
    cards.forEach(k=>{if(k.placed&&k!==M.drag){const [px,py]=P[k.placed==='thot'?0:1];const idx=cards.filter(o=>o.placed===k.placed).indexOf(k);k.x+=(px-k.x)*.25;k.y+=(py-18-idx*32-k.y)*.25}
      else if(!k.placed&&k!==M.drag){k.x+=(k.hx-k.x)*.2;k.y+=(k.hy-k.y)*.2}const sx=k.shake>0?Math.sin(k.shake*40)*6:0;k.shake=Math.max(0,k.shake-.02);
      const s=k.placed&&k!==M.drag?k.small:k.big,lift=k===M.drag?1.08:1,wob=k.placed?0:Math.sin(T*2+k.hx)*.03;c.save();c.translate(k.x+sx,k.y);c.rotate(k===M.drag?0:k.rot+wob);c.scale(lift,lift);c.drawImage(s,-s.width/2,-s.height/2);c.restore()});
    // une main fantôme montre le geste tant qu'on n'a rien pris
    if(!M.touched){const k=cards[0],P0=M.pans()[0],t=(T*.5)%1,e=t<.15?0:t>.75?1:(t-.15)/.6,ex=lerp(k.hx,P0[0],e*e*(3-2*e)),ey=lerp(k.hy,P0[1]-30,e*e*(3-2*e));
      c.save();c.globalAlpha=Math.sin(Math.min(1,t/.9)*Math.PI)*.9;c.setLineDash([4,8]);c.strokeStyle='rgba(255,240,200,.6)';c.lineWidth=3;c.beginPath();c.moveTo(k.hx,k.hy);c.lineTo(ex,ey);c.stroke();c.setLineDash([]);
      c.fillStyle='rgba(255,250,235,.85)';c.beginPath();c.ellipse(ex+16,ey+22,14,18,-.4,0,7);c.fill();c.fillRect(ex+8,ey+30,18,26);c.strokeStyle='rgba(60,40,20,.6)';c.lineWidth=2;c.beginPath();c.ellipse(ex+16,ey+22,14,18,-.4,0,7);c.stroke();
      c.globalAlpha*=.6;c.strokeStyle='#fff3d6';c.beginPath();c.arc(ex,ey,10+8*((T*2)%1),0,7);c.stroke();c.restore()}},
  down(cx,cy){const k=[...cards].reverse().find(k=>!k.placed&&Math.abs(cx-k.x)<88&&Math.abs(cy-k.y)<42);if(k){M.drag=k;M.touched=true;M.ox=cx-k.x;M.oy=cy-k.y}},
  move(cx,cy){if(M.drag){M.drag.x=cx-M.ox;M.drag.y=cy-M.oy}},
  up(){const k=M.drag;if(!k)return;M.drag=null;const P=M.pans();const d0=Math.hypot(k.x-P[0][0],k.y-P[0][1]+40),d1=Math.hypot(k.x-P[1][0],k.y-P[1][1]+40);const tgt=d0<d1?'thot':'thamus';
    if(Math.min(d0,d1)<130){if(tgt===k.side){k.placed=tgt;if(cards.every(o=>o.placed)){showHint('Les deux plateaux pèsent : l’écriture garde et transmet… mais elle peut faire oublier.');setTimeout(()=>M.done=true,2400)}}else k.shake=1}},
  solve(){cards.forEach(k=>k.placed=k.side);M.done=true}};return M}

/* 3. le soleil du temps : des pierres levées au temple */
const SOL={ground:(()=>{const o=mkC(),x=o.getContext('2d');paintShape(x,c=>{c.beginPath();c.rect(0,548,MS,MS-548)},'#8a7a52',[0,548,MS,220],{ang:0,n:220,edge:false});paintShape(x,c=>{c.beginPath();c.rect(150,540,468,18)},'#b8a682',[150,540,468,18],{ang:0,n:40});return o})(),
  stones:(()=>{const o=mkC(),x=o.getContext('2d');for(let i=0;i<5;i++){const cx=200+i*92,h=110+(i%2)*24;paintShape(x,c=>{c.beginPath();c.moveTo(cx-24,546);c.quadraticCurveTo(cx-28,546-h*.6,cx-16,546-h);c.quadraticCurveTo(cx,546-h-10,cx+18,546-h+4);c.quadraticCurveTo(cx+28,546-h*.5,cx+24,546);c.closePath()},'#8c8aa0',[cx-30,546-h-12,60,h+14],{ang:Math.PI/2,n:60})}return o})(),
  temple:(()=>{const o=mkC(),x=o.getContext('2d');for(let i=0;i<5;i++){const cx=200+i*92;paintShape(x,c=>{c.beginPath();c.rect(cx-17,360,34,180)},'#efe6d2',[cx-17,360,34,180],{ang:Math.PI/2,n:50});x.strokeStyle='rgba(150,130,110,.5)';x.lineWidth=2;for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(cx+k*9,368);x.lineTo(cx+k*9,532);x.stroke()}paintShape(x,c=>{c.beginPath();c.rect(cx-24,346,48,16)},'#e8dcc4',[cx-24,346,48,16],{n:12})}
    paintShape(x,c=>{c.beginPath();c.rect(172,318,424,30)},'#ece2cc',[172,318,424,30],{ang:0,n:60});paintShape(x,c=>{c.beginPath();c.moveTo(160,318);c.lineTo(384,236);c.lineTo(608,318);c.closePath()},'#f0e6d2',[160,236,448,82],{ang:0,n:70});return o})()};
function mkSoleil(){const M={p:0,done:false,hint:'Fais avancer le temps : glisse le soleil vers la droite.',
  draw(c,T){const p=M.p;const g=c.createLinearGradient(0,0,0,MS);g.addColorStop(0,`rgb(${40+p*70|0},${50+p*100|0},${120+p*90|0})`);g.addColorStop(1,`rgb(${210+p*20|0},${160+p*50|0},${120+p*60|0})`);c.fillStyle=g;c.fillRect(0,0,MS,MS);
    const sx=140+p*490,sy=330-Math.sin(p*Math.PI)*170;c.drawImage(SPR.sun,sx-80,sy-80);c.drawImage(SOL.ground,0,0);
    c.globalAlpha=1-clamp((p-.35)/.4);c.drawImage(SOL.stones,0,0);c.globalAlpha=clamp((p-.35)/.4);c.drawImage(SOL.temple,0,0);c.globalAlpha=1;
    const tgt=[384,604];[[250,450],[384,430],[520,450]].forEach(([x,y],i)=>{const k=clamp((p-.2-i*.12)/.45);const ix=lerp(x,tgt[0]+(i-1)*30,k),iy=lerp(y,tgt[1],k),s=lerp(1.2,.5,k);
      if(i===0)txt(c,'« »',ix,iy,46*s,'#fff3d6');if(i===1)drawNote(c,ix-6*s,iy+10*s,1.5*s,1);if(i===2){c.save();c.strokeStyle='#fff3d6';c.lineWidth=5*s;c.lineCap='round';c.beginPath();for(let a=0;a<12;a+=.3){const r=a*1.8*s;c.lineTo(ix+Math.cos(a)*r,iy+Math.sin(a)*r)}c.stroke();c.restore()}});
    if(p>.4){c.globalAlpha=clamp((p-.4)*3);c.drawImage(SPR.scroll,384-80,584,160,58);c.globalAlpha=1}
    txt(c,'avant l’écriture',170,662,26,'#fff3d6','left','700',true);txt(c,'après',600,662,26,'#fff3d6','right','700',true)},
  down(cx){M.dragX=cx},move(cx){if(M.dragX==null)return;const d=(cx-M.dragX)/420;M.dragX=cx;if(d>0&&!M.end){M.p=Math.min(1,M.p+d);if(M.p>=.99){M.end=true;showHint('Les mots, la musique et les images sont entrés dans le rouleau. Les lieux de chant sont devenus des temples.');setTimeout(()=>M.done=true,2600)}}},up(){M.dragX=null},
  solve(){M.p=1;M.done=true}};return M}

/* 4. Alexandrie : ranger le savoir ET allumer la lumière */
const harborBG=(()=>{const o=gouacheBG('#121040','#1c2a6a',240,16,30),x=o.getContext('2d');starsOn(x,90,MS*.5);
  paintShape(x,c=>{c.beginPath();c.rect(0,470,MS,MS-470)},'#1e3274',[0,470,MS,298],{ang:0,n:260,edge:false});
  paintShape(x,c=>{c.beginPath();c.rect(140,380,190,196)},'#d8c6a2',[140,380,190,196],{n:80});paintShape(x,c=>{c.beginPath();c.moveTo(124,384);c.lineTo(235,318);c.lineTo(346,384);c.closePath()},'#b23a2a',[124,318,222,66],{ang:0,n:40});
  for(let r=0;r<3;r++)for(let k=0;k<4;k++){const px=160+k*42,py=400+r*52;x.fillStyle='#4a2c18';x.fillRect(px,py,36,42);if(!(r===1&&k===2)){paintShape(x,c=>{c.beginPath();c.arc(px+18,py+21,13,0,7)},'#ecdcb4',[px+5,py+8,26,26],{n:6,edge:'rgba(120,80,40,.5)'})}}
  paintShape(x,c=>{c.beginPath();c.moveTo(500,540);c.lineTo(520,330);c.lineTo(590,330);c.lineTo(610,540);c.closePath()},'#e8e0d2',[500,330,110,210],{ang:Math.PI/2,n:80});
  paintShape(x,c=>{c.beginPath();c.rect(532,250,46,82)},'#ece4d6',[532,250,46,82],{ang:Math.PI/2,n:30});paintShape(x,c=>{c.beginPath();c.rect(541,206,28,46)},'#efe8dc',[541,206,28,46],{n:16});
  [[514,322,82],[528,244,54]].forEach(([a,b,w])=>paintShape(x,c=>{c.beginPath();c.rect(a,b,w,9)},'#e8bc50',[a,b,w,9],{n:10}));
  paintShape(x,c=>{c.beginPath();c.ellipse(555,548,90,18,0,0,7)},'#2a2a4a',[465,530,180,36],{n:30});return o})();
function mkPhare(){const boats=[...Array(3)].map(()=>({x:rnd(260,480),y:rnd(250,360),a:rnd(0,6)}));
  const M={lit:false,scroll:{x:384,y:640,placed:false},drag:false,done:false,hint:'Range le rouleau dans la bibliothèque, puis allume le phare.',
  draw(c,T){c.drawImage(harborBG,0,0);
    if(M.scroll.placed)paintShape(c,x=>{x.beginPath();x.arc(262,473,13,0,7)},'#fff1c8',[249,460,26,26],{n:4});else{c.strokeStyle=`rgba(255,215,120,${.5+.4*Math.sin(T*4)})`;c.setLineDash([5,4]);c.lineWidth=3;c.strokeRect(246,454,32,38);c.setLineDash([])}
    if(M.lit){const w=.5+.5*Math.sin(T*2);c.save();c.globalCompositeOperation='lighter';blob(c,555,200,130,'rgba(255,190,90,.6)');const gg=c.createLinearGradient(555,200,140,170);gg.addColorStop(0,`rgba(255,230,160,${.45*w+.2})`);gg.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=gg;c.beginPath();c.moveTo(555,200);c.lineTo(110,110);c.lineTo(110,270);c.closePath();c.fill();c.restore();
      c.fillStyle='#ffb347';c.beginPath();c.moveTo(540,208);c.quadraticCurveTo(555,150+Math.sin(T*9)*6,570,208);c.fill();c.fillStyle='#fff0a0';c.beginPath();c.moveTo(548,208);c.quadraticCurveTo(555,175+Math.sin(T*11)*4,562,208);c.fill()}
    else{c.strokeStyle=`rgba(255,215,120,${.4+.4*Math.sin(T*4)})`;c.lineWidth=3;c.setLineDash([5,4]);c.beginPath();c.arc(555,196,30,0,7);c.stroke();c.setLineDash([])}
    boats.forEach((b,i)=>{if(M.lit&&M.scroll.placed){b.x+=(330+i*44-b.x)*.01;b.y+=(560+i*10-b.y)*.01}else{b.x+=Math.sin(T*.7+b.a)*.6;b.y+=Math.cos(T*.5+b.a)*.3}c.drawImage(SPR.boat,b.x-35,b.y-40)});
    if(!M.scroll.placed)c.drawImage(SPR.scroll,M.scroll.x-60,M.scroll.y-23)},
  down(cx,cy){if(!M.scroll.placed&&Math.hypot(cx-M.scroll.x,cy-M.scroll.y)<70){M.drag=true;M.ox=cx-M.scroll.x;M.oy=cy-M.scroll.y}else if(!M.lit&&Math.hypot(cx-555,cy-205)<75){M.lit=true;M.check()}},
  move(cx,cy){if(M.drag){M.scroll.x=cx-M.ox;M.scroll.y=cy-M.oy}},
  up(){if(!M.drag)return;M.drag=false;if(Math.hypot(M.scroll.x-262,M.scroll.y-473)<72){M.scroll.placed=true;M.check()}else{M.scroll.x=384;M.scroll.y=640}},
  check(){if(M.lit&&M.scroll.placed&&!M.fin){M.fin=true;showHint('Le savoir est rangé, la lumière est allumée : les bateaux retrouvent le port.');setTimeout(()=>M.done=true,2800)}else if(M.lit)showHint('La lumière brille. Il reste le rouleau à ranger.');else if(M.scroll.placed)showHint('Le rouleau est rangé. Allume maintenant le phare.')},
  solve(){M.lit=true;M.scroll.placed=true;M.done=true}};return M}
