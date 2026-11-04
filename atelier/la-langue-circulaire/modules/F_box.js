/* ---------- la boîte : un tambour de carton rond, comme une boîte à chapeau ; sur le couvercle, un grand cercle d'encre ---------- */
const RB=6.0;                                   // rayon du plateau
const A=RB,C=RB,TOP=.35,RW=RB,RD=RB,RR=RB;      // (noms communs aux autres modules)
const box=new THREE.Group();scene.add(box);
// un tirage pseudo-aléatoire reproductible (pour que chaque cercle d'encre garde sa forme)
const seeded=s=>{let a=(s*9301+49297)%233280||1;return()=>{a=(a*9301+49297)%233280;return a/233280}};
/* le cercle d'encre : une tache, pas un trait. Un anneau au pinceau très chargé, d'épaisseur très inégale (des masses lourdes, des passages fins),
   aux bords fumés, avec des éclaboussures, des coulures, des vrilles. f : traits posés sur l'anneau
   {a:angle, k:'blob'|'spike'|'tendril'|'splash'|'hook', s:taille, d:+1 dehors / -1 dedans} */
function inkRing(x,cx,cy,r,o={}){const R=seeded(o.seed||7),col=o.col||'#141414',w0=(o.w||r*.085),f=o.f||[],a0=o.a0||0,gap=o.gap==null?0:o.gap,soft=o.wash!==false;
 const span=Math.PI*2-gap,N=Math.max(160,Math.round(r*3.2));
 // bruit lisse le long de l'anneau : le rayon ondule, l'épaisseur gonfle et maigrit
 const ph=[...Array(6)].map(()=>R()*6.283),nz=(a,k)=>Math.sin(a*2+ph[k])*.5+Math.sin(a*3.3+ph[k+1])*.3+Math.sin(a*7.1+ph[k+2])*.2;
 const heavy=[...Array(3)].map(()=>({a:a0+R()*span,s:.8+R()*1.0}));
 const near=(a,b)=>{const d=Math.atan2(Math.sin(a-b),Math.cos(a-b));return d};
 const width=a=>{const q=nz(a,0)*.5+.5;let w=w0*(.45+1.15*q*q);heavy.concat(f.filter(t=>t.k==='blob'||t.k==='splash')).forEach(t=>{const d=near(a,t.a);w+=w0*(t.s||1)*1.0*Math.exp(-d*d/(.025*(t.s||1)))});
  if(gap>0){const u=(a-a0)/span;w*=Math.min(1,u*5,(1-u)*5)}return Math.max(w0*.12,w)};
 const rad=a=>r+r*.035*nz(a,3);
 x.save();x.fillStyle=col;x.strokeStyle=col;x.lineCap='round';x.lineJoin='round';
 // la fumée : l'encre qui a diffusé autour du trait
 if(soft){for(let p=0;p<2;p++){x.save();x.globalAlpha=.022;for(let i=0;i<=N/3;i++){const a=a0+span*i/(N/3),w=width(a)*(1.5+p*.6);x.beginPath();x.arc(cx+Math.cos(a)*rad(a),cy+Math.sin(a)*rad(a),w/2,0,7);x.fill()}x.restore()}
  x.save();x.globalAlpha=.03;for(let i=0;i<40;i++){const a=a0+R()*span,rr=rad(a)+(R()-.5)*w0*2.2;x.beginPath();x.ellipse(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,w0*(1+R()*2.5),w0*(.4+R()*.8),a+Math.PI/2+(R()-.5),0,7);x.fill()}x.restore()}
 // le corps : des touches de pinceau qui se chevauchent, orientées le long du cercle
 for(let i=0;i<=N;i++){const a=a0+span*i/N,w=width(a),rr=rad(a),px=cx+Math.cos(a)*rr,py=cy+Math.sin(a)*rr;x.save();x.globalAlpha=.85+R()*.15;x.translate(px,py);x.rotate(a+Math.PI/2);x.beginPath();x.ellipse((R()-.5)*w*.08,(R()-.5)*w*.1,Math.max(r*span/N*2.2,w*.35),w/2*(.92+R()*.12),0,0,7);x.fill();x.restore()}
 // le bord qui s'effiloche : des poils, de la poussière d'encre
 for(let i=0;i<N*1.2;i++){const a=a0+R()*span,w=width(a),side=R()<.5?-1:1,rr=rad(a)+side*w*(.44+R()*.16);x.globalAlpha=.25+R()*.45;x.beginPath();x.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,w0*(.02+R()*.07),0,7);x.fill()}
 x.globalAlpha=1;
 // le pinceau sec : des stries claires dans le trait
 x.save();x.globalCompositeOperation='destination-out';for(let i=0;i<N*.5;i++){const a=a0+R()*span,w=width(a),o2=(R()-.5)*w*.75;x.globalAlpha=.12+R()*.25;x.lineWidth=.6+R()*1.4;x.beginPath();x.arc(cx,cy,rad(a)+o2,a,a+.04+R()*.18);x.stroke()}x.restore();
 const tip=(px,py,ang,len,wd)=>{x.beginPath();x.moveTo(px+Math.cos(ang+Math.PI/2)*wd/2,py+Math.sin(ang+Math.PI/2)*wd/2);x.quadraticCurveTo(px+Math.cos(ang)*len*.55+Math.cos(ang+Math.PI/2)*wd*.15,py+Math.sin(ang)*len*.55+Math.sin(ang+Math.PI/2)*wd*.15,px+Math.cos(ang)*len,py+Math.sin(ang)*len);x.quadraticCurveTo(px+Math.cos(ang)*len*.55-Math.cos(ang+Math.PI/2)*wd*.15,py+Math.sin(ang)*len*.55-Math.sin(ang+Math.PI/2)*wd*.15,px+Math.cos(ang-Math.PI/2)*wd/2,py+Math.sin(ang-Math.PI/2)*wd/2);x.fill()};
 const drop=(px,py,s)=>{x.beginPath();x.ellipse(px,py,s*(1+R()*.4),s*(.7+R()*.4),R()*3,0,7);x.fill()};
 f.forEach(t=>{const s=t.s||1,d=t.d||1,rr=rad(t.a),px=cx+Math.cos(t.a)*rr,py=cy+Math.sin(t.a)*rr,out=t.a+(d>0?0:Math.PI),w=width(t.a);
  if(t.k==='splash'||t.k==='spike'){const n=t.k==='splash'?3:2;for(let k=0;k<n;k++){const ang=out+(R()-.5)*(t.k==='splash'?1.0:.6),len=r*(.025+R()*.06)*s;x.beginPath();x.ellipse(px+Math.cos(ang)*len*.45,py+Math.sin(ang)*len*.45,len*.75,w*(.45+R()*.3),ang,0,7);x.fill();
     let dl=len*(1.1+R()*.3);const m=1+(R()*3|0);for(let j=0;j<m;j++){drop(px+Math.cos(ang)*dl,py+Math.sin(ang)*dl,w0*(.1+R()*.28)/(1+j*.6));dl+=w0*(.6+R()*.9)}}
   // la pluie de gouttelettes autour de l'impact
   for(let k=0;k<12*s;k++){const ang=out+(R()-.5)*2.2,dl=w*.8+R()*r*.22*s;x.globalAlpha=.5+R()*.5;drop(px+Math.cos(ang)*dl,py+Math.sin(ang)*dl,w0*(.03+R()*.12));x.globalAlpha=1}}
  if(t.k==='tendril'){let qx=px,qy=py,ang=out,lw=w*.45;for(let k=0;k<18;k++){ang+=(R()-.5)*.45+(t.c||0);const nx=qx+Math.cos(ang)*r*.022*s,ny=qy+Math.sin(ang)*r*.022*s;x.lineWidth=lw;x.beginPath();x.moveTo(qx,qy);x.lineTo(nx,ny);x.stroke();qx=nx;qy=ny;lw*=.88}drop(qx,qy,w0*.18)}
  if(t.k==='hook'){x.lineWidth=w*.5;const tg=t.a+Math.PI/2*(t.c||1);x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(out)*r*.2*s,py+Math.sin(out)*r*.2*s,px+Math.cos(out)*r*.17*s+Math.cos(tg)*r*.13*s,py+Math.sin(out)*r*.17*s+Math.sin(tg)*r*.13*s);x.stroke();drop(px+Math.cos(out)*r*.17*s+Math.cos(tg)*r*.13*s,py+Math.sin(out)*r*.17*s+Math.sin(tg)*r*.13*s,w*.22)}
  if(t.k==='blob'){for(let k=0;k<5;k++){const ang=out+(R()-.5)*1.4,dl=w*(.6+R()*1.2)*s;drop(px+Math.cos(ang)*dl,py+Math.sin(ang)*dl,w0*(.12+R()*.3))}}});
 // des gouttes perdues, tout autour
 for(let i=0;i<(o.drops==null?16:o.drops);i++){const a=R()*Math.PI*2,dl=r+(R()<.5?-1:1)*w0*(1.2+R()*5);x.globalAlpha=.5+R()*.5;drop(cx+Math.cos(a)*dl,cy+Math.sin(a)*dl,w0*(.04+R()*.16))}
 x.restore()}
// des « mots » de cercle tout prêts : chaque graine donne un cercle reconnaissable
const GLYPH=(seed,n=4)=>{const R=seeded(seed*17+3),K=['blob','spike','tendril','splash','hook'],f=[];for(let i=0;i<n;i++)f.push({a:R()*Math.PI*2,k:K[(R()*K.length)|0],s:.7+R()*.8,d:R()<.75?1:-1,c:(R()-.5)*.3});return{seed,f,a0:R()*6.28,gap:R()<.35?.25+R()*.3:0}};

const KRAFT=PAPER?((base,stamp)=>canvasTex(512,512,(x,W)=>{x.fillStyle=base;x.fillRect(0,0,W,W);for(let i=0;i<9000;i++){x.fillStyle=Math.random()<.5?`rgba(255,240,210,${rnd(.05,.14)})`:`rgba(80,50,20,${rnd(.05,.12)})`;x.fillRect(rnd(0,W),rnd(0,W),rnd(1,4),rnd(.6,1.6))}
  for(let u=0;u<W;u+=9){x.fillStyle='rgba(90,60,25,.05)';x.fillRect(u,0,3,W)}
  if(stamp){x.save();x.translate(W*.72,W*.3);x.rotate(-.12);x.strokeStyle='rgba(150,40,30,.45)';x.fillStyle='rgba(150,40,30,.45)';x.lineWidth=4;x.strokeRect(-70,-34,140,68);x.font='700 30px Georgia,serif';x.textAlign='center';x.fillText('↑ HAUT ↑',0,10);x.restore();
   x.fillStyle='rgba(30,20,10,.4)';for(let i=0;i<28;i++)x.fillRect(60+i*5+(i%3)*2,W*.78,i%4?2:4,46)}})):((base)=>canvasTex(64,64,(x,W)=>{x.fillStyle=base;x.fillRect(0,0,W,W)}));
const CORR=canvasTex(256,64,(x,W,H)=>{x.fillStyle='#c79c66';x.fillRect(0,0,W,H);x.fillStyle='#e2c79a';x.fillRect(0,0,W,8);x.fillRect(0,H-8,W,8);x.strokeStyle='#8a6232';x.lineWidth=3;x.beginPath();for(let u=0;u<=W;u+=2)x.lineTo(u,H/2+Math.sin(u*.25)*(H/2-12));x.stroke();x.fillStyle='rgba(60,35,10,.25)';x.fillRect(0,8,W,2);x.fillRect(0,H-10,W,2)},true);
const rr=(w,h,r)=>{const sh=new THREE.Shape();sh.moveTo(-w+r,-h);sh.lineTo(w-r,-h);sh.quadraticCurveTo(w,-h,w,-h+r);sh.lineTo(w,h-r);sh.quadraticCurveTo(w,h,w-r,h);sh.lineTo(-w+r,h);sh.quadraticCurveTo(-w,h,-w,h-r);sh.lineTo(-w,-h+r);sh.quadraticCurveTo(-w,-h,-w+r,-h);return sh};
const disc=(r)=>{const sh=new THREE.Shape();sh.absarc(0,0,r,0,Math.PI*2,false);return sh};
const ROPE=(()=>{const t=canvasTex(128,32,(x,W,H)=>{x.fillStyle='#d6bf8e';x.fillRect(0,0,W,H);x.strokeStyle='#a88a5a';x.lineWidth=5;for(let u=-H;u<W+H;u+=14){x.beginPath();x.moveTo(u,0);x.lineTo(u+H,H);x.stroke()}x.strokeStyle='rgba(255,245,220,.6)';x.lineWidth=2;for(let u=-H+5;u<W+H;u+=14){x.beginPath();x.moveTo(u,0);x.lineTo(u+H,H);x.stroke()}},true);t.repeat.set(110,1);return new THREE.MeshStandardMaterial({map:t,roughness:.95,bumpMap:t,bumpScale:.02})})();
M.cbTop=new THREE.MeshStandardMaterial({map:KRAFT('#b9915c',true),roughness:.95,bumpMap:FIB,bumpScale:.01});
{const t=CORR.clone();t.needsUpdate=true;t.repeat.set(34,1);M.cbSide=new THREE.MeshStandardMaterial({map:t,roughness:.95})}
M.goldS=plastic('#b07a45');
// le tambour : un cylindre de carton ondulé, un bord de kraft, une ficelle
{const side=mesh(new THREE.CylinderGeometry(RB+.3,RB+.36,1.3,128,1,true),M.cbSide,true,true);side.position.y=TOP-.82;box.add(side);
 const bot=mesh(new THREE.CircleGeometry(RB+.36,96),M.cbTop,false,true);bot.rotation.x=-Math.PI/2;bot.position.y=TOP-1.47;box.add(bot);
 const lip=mesh(new THREE.RingGeometry(RB-.05,RB+.3,128,1),M.cbTop,false,true);lip.rotation.x=-Math.PI/2;lip.position.y=TOP-.17;box.add(lip);
 // une étiquette de carton collée sur le flanc, côté face : le tampon « ↑ HAUT ↑ »
 const lab=mesh(new THREE.PlaneGeometry(1.6,.9),new THREE.MeshStandardMaterial({map:KRAFT('#c9a06a',true),roughness:.95}),false,true);lab.position.set(2.2,TOP-.8,Math.sqrt((RB+.35)**2-2.2**2)+.01);lab.rotation.y=Math.atan2(2.2,Math.sqrt((RB+.35)**2-2.2**2));box.add(lab)}

// le plateau : une vallée du Montana dans la brume (le film y pose la coquille). Nord = fond de la boîte (z négatif)
const pip=(x,z,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,zi]=P[i],[xj,zj]=P[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)c=!c}return c};
const segD=(px,pz,P)=>{let m=1e9;for(let i=0;i<P.length-1;i++){const[ax,az]=P[i],[bx,bz]=P[i+1],dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((px-ax)*dx+(pz-az)*dz)/(dx*dx+dz*dz||1)));m=Math.min(m,Math.hypot(px-ax-dx*t,pz-az-dz*t))}return m};
// la carte est un cercle : un lac rond au centre, un chemin qui en fait le tour, et les cinq lieux posés sur ce chemin
// comme les traits d'un cercle d'encre. La coquille domine le fond, au-dessus de l'eau.
const SEA={x:0,z:.35};const LR=1.85,RING=3.25;
const pol=(deg,r)=>{const a=deg*Math.PI/180;return[SEA.x+Math.sin(a)*r,SEA.z+Math.cos(a)*r]};
const COAST=[...Array(48)].map((_,i)=>{const a=i/48*Math.PI*2,k=1+.05*Math.sin(a*3+.7)+.03*Math.sin(a*5+2.1);return[SEA.x+Math.cos(a)*LR*k,SEA.z+Math.sin(a)*LR*k]});
const COASTC=[...COAST,COAST[0]];
const inSea=(x,z,m=0)=>pip(x,z,COAST)||(m>0&&segD(x,z,COASTC)<m);
// le ruisseau qui descend des montagnes jusqu'au lac (même rôle que le Nil : on le traverse sur une passerelle)
const NILE=new THREE.CatmullRomCurve3([[-2.6,-5.0],[-2.35,-3.9],[-1.75,-2.9],[-1.3,-2.0],[-1.0,-1.25]].map(([a,b])=>new THREE.Vector3(a,0,b)));
const DAMIETTA=[];
// les angles des lieux sur le cercle, dans l'ordre du récit (sens des aiguilles d'une montre, vu d'en haut)
const ANG=[55,125,180,250,315];
const PLACES=[pol(55,4.2),pol(125,4.25),pol(180,4.15),pol(250,4.05)];
const SPOTS=ANG.slice(0,4).map(a=>{const[x,z]=pol(a,RING);return new THREE.Vector3(x,TOP,z)});
const LIB=pol(97,4.75);                                   // la grande tente des opérations, à côté du camp
const START=(()=>{const[x,z]=pol(8,RING);return new THREE.Vector3(x,TOP,z)})();
// le cinquième lieu, débloqué à la fin : la salle des enregistrements de l'université, aujourd'hui
const BAPOS=pol(315,4.15),SPOT5=(()=>{const[x,z]=pol(315,RING);return new THREE.Vector3(x,TOP,z)})();
const ROUTE=[...Array(41)].map((_,i)=>pol(8+i*9,RING));                           // le chemin circulaire, depuis le départ
const ROUTE2=[[5.85,-1.0],[5.2,-1.25],[4.4,-1.7],pol(125,RING)];                // la piste des camions
const ROUTE0=[pol(55,RING),pol(55,3.75)];
const GS=LOW?1536:2048,gx=v=>(v/(2*A)+.5)*GS,gz=v=>(v/(2*C)+.5)*GS;
const NILEP=[...Array(41)].map((_,i)=>{const p=NILE.getPoint(i/40);return[p.x,p.z]});
const ROUTEC=new THREE.CatmullRomCurve3(ROUTE.map(([a,b])=>new THREE.Vector3(a,0,b)));const ROUTES=[ROUTE,ROUTE2,ROUTE0].map(R=>new THREE.CatmullRomCurve3(R.map(([a,b])=>new THREE.Vector3(a,0,b))));
const ROUTEPS=ROUTES.map(c=>[...Array(121)].map((_,i)=>{const p=c.getPoint(i/120);return[p.x,p.z]}));const ROUTEP=ROUTEPS[0];const routeD=(x,z)=>Math.min(...ROUTEPS.map(P=>segD(x,z,P)));
const freeSpot=(x,z,m=.45)=>Math.hypot(x,z)<RB-.55&&!inSea(x,z,.35)&&routeD(x,z)>m&&segD(x,z,NILEP)>.4&&PLACES.every(([a,b])=>Math.hypot(x-a,z-b)>1.25)&&Math.hypot(x-LIB[0],z-LIB[1])>.9&&Math.hypot(x-BAPOS[0],z-BAPOS[1])>1.0&&Math.hypot(x-SPOT5.x,z-SPOT5.z)>.6&&Math.hypot(x-START.x,z-START.z)>.6&&z>-4.3;
const OBSTL=[[...PLACES[0],.95],[...PLACES[1],1.0],[PLACES[2][0],PLACES[2][1],.7],[...PLACES[3],.8],[...LIB,.62],[...BAPOS,.62]];
const groundTex=canvasTex(GS,GS,(x,W)=>{
  // prairie pâle, plus sombre au pied des montagnes, avec des plaques d'herbe dorée (l'automne au Montana)
  let g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'#6e8a4e');g.addColorStop(.35,'#8fae5a');g.addColorStop(1,'#a9c26a');x.fillStyle=g;x.fillRect(0,0,W,W);
  for(let i=0;i<15000;i++){const cx=rnd(0,W),cy=rnd(0,W);dab(x,cx,cy,rnd(14,34),rnd(5,10),rnd(-.6,.6),rnd(68,108),rnd(28,48),rnd(40,60),rnd(.22,.42))}
  for(let i=0;i<46;i++){const px=rnd(-5.5,5.5),pz=rnd(-4,5.5);if(Math.hypot(px,pz)>5.6)continue;for(let k=0;k<70;k++)dab(x,gx(px+rnd(-.5,.5)),gz(pz+rnd(-.35,.35)),rnd(18,34),rnd(6,10),rnd(-.5,.5),rnd(30,46),rnd(60,78),rnd(52,64),rnd(.25,.5))}
  for(let i=0;i<60;i++)blob(x,rnd(0,W),rnd(0,W),rnd(90,240),Math.random()<.5?'rgba(240,190,90,.16)':'rgba(60,110,60,.18)');
  for(let i=0;i<6000;i++){const cx=rnd(0,W),cy=rnd(0,W);x.strokeStyle=hsl(rnd(45,75),rnd(14,32),rnd(60,80),rnd(.25,.5));x.lineWidth=rnd(1,2);x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+rnd(6,14),cy-rnd(2,8));x.stroke()}
  // un anneau d'herbe plus claire entre le chemin et le lac : la prairie fauchée, en rond
  for(let i=0;i<2600;i++){const a=rnd(0,6.283),r=rnd(LR+.25,RING-.25);dab(x,gx(SEA.x+Math.cos(a)*r),gz(SEA.z+Math.sin(a)*r),rnd(16,30),rnd(6,9),a+Math.PI/2+rnd(-.3,.3),rnd(72,100),rnd(36,52),rnd(46,60),rnd(.25,.45))}
  // et plein de fleurs d'automne : asters mauves, verges d'or, coquelicots tardifs
  for(let i=0;i<5200;i++){const a=rnd(0,6.283),r=rnd(LR+.2,RING-.2),px=SEA.x+Math.cos(a)*r,pz=SEA.z+Math.sin(a)*r;if(routeD(px,pz)<.25)continue;const q=Math.random();x.fillStyle=q<.35?hsl(rnd(265,290),55,rnd(62,74),.9):q<.7?hsl(rnd(42,50),85,rnd(52,62),.9):q<.85?hsl(rnd(2,12),75,rnd(50,58),.9):hsl(0,0,97,.9);x.beginPath();x.arc(gx(px)+rnd(-3,3),gz(pz)+rnd(-3,3),rnd(2.2,4.2),0,7);x.fill()}
  // le lac : ardoise, plus clair au bord, des reflets de ciel, et le reflet sombre de la coquille
  const coastPath=()=>{x.beginPath();COAST.forEach(([u,v],i)=>i?x.lineTo(gx(u),gz(v)):x.moveTo(gx(u),gz(v)));x.closePath()};
  x.save();coastPath();x.clip();const lg=x.createRadialGradient(gx(SEA.x),gz(SEA.z),0,gx(SEA.x),gz(SEA.z),gx(LR)-gx(0));lg.addColorStop(0,'#fbf6ee');lg.addColorStop(.6,'#ece6ec');lg.addColorStop(.88,'#c9c2d4');lg.addColorStop(1,'#8f88a6');x.fillStyle=lg;x.fillRect(0,0,W,W);
  for(let i=0;i<260;i++){const a=rnd(0,6.283),r=rnd(0,LR*.95),cx=gx(SEA.x+Math.cos(a)*r),cy=gz(SEA.z+Math.sin(a)*r),rr=rnd(20,60);blob(x,cx+rr*.25,cy+rr*.3,rr,'rgba(150,140,180,.16)');blob(x,cx,cy,rr,`rgba(255,${rnd(244,252)|0},${rnd(236,248)|0},.55)`)}
  
  
  [[70,'rgba(120,110,150,.45)'],[34,'rgba(170,160,190,.5)'],[12,'rgba(240,236,244,.9)']].forEach(([lw,col])=>{x.strokeStyle=col;x.lineWidth=lw;x.lineJoin='round';coastPath();x.stroke()});x.restore();
  // une grève de galets clairs tout autour
  for(let k=0;k<COAST.length;k++){const[ax,az]=COAST[k],[bx,bz]=COAST[(k+1)%COAST.length],L=Math.hypot(bx-ax,bz-az),n=Math.ceil(L*80);for(let s=0;s<n;s++){const t=Math.random(),ox=rnd(-7,7),oy=rnd(-7,7);x.fillStyle=hsl(rnd(30,60),rnd(4,12),rnd(66,86),.85);x.beginPath();x.ellipse(gx(ax+(bx-ax)*t)+ox,gz(az+(bz-az)*t)+oy,rnd(2,5),rnd(1.5,3.5),rnd(0,3),0,7);x.fill()}}
  // le ruisseau
  for(let i=0;i<=320;i++){const p=NILE.getPoint(i/320);for(let k=0;k<3;k++)dab(x,gx(p.x+rnd(-.22,.22)),gz(p.z+rnd(-.06,.06)),rnd(16,26),rnd(7,11),rnd(-.6,.6),rnd(70,100),rnd(15,25),rnd(36,46),rnd(.35,.5));
    dab(x,gx(p.x),gz(p.z),rnd(18,26),rnd(10,14),rnd(-.4,.4),rnd(200,212),18,rnd(48,60),.9);if(i%3===0){x.fillStyle='rgba(230,236,236,.55)';x.fillRect(gx(p.x)+rnd(-4,2),gz(p.z)+rnd(-4,4),rnd(4,9),1.6)}}
  // le chemin circulaire : de la terre claire, bordée de petites pierres ; la piste des camions, avec ses ornières
  ROUTES.forEach((RC,ri)=>{const N=ri?600:1600;for(let i=0;i<=N;i++){const p=RC.getPoint(i/N),t=RC.getTangent(i/N);for(let k=0;k<2;k++){const o=rnd(-.17,.17);dab(x,gx(p.x-t.z*o),gz(p.z+t.x*o),rnd(14,22),rnd(9,13),Math.atan2(t.z,t.x)+rnd(-.3,.3),rnd(35,45),rnd(10,20),rnd(72,82),rnd(.5,.75))}}
   if(ri===0)for(let i=0;i<=520;i++){const p=RC.getPoint(i/520),t=RC.getTangent(i/520);[-1,1].forEach(sd=>{x.fillStyle=hsl(rnd(30,45),rnd(6,16),rnd(60,76));x.beginPath();x.ellipse(gx(p.x-t.z*.25*sd),gz(p.z+t.x*.25*sd),rnd(3.5,6),rnd(2.5,4),rnd(0,3),0,7);x.fill()})}
   if(ri===1)[-1,1].forEach(sd=>{x.strokeStyle='rgba(110,96,76,.45)';x.lineWidth=3;x.beginPath();for(let i=0;i<=120;i++){const p=RC.getPoint(i/120),t=RC.getTangent(i/120);const X=gx(p.x-t.z*.07*sd),Z=gz(p.z+t.x*.07*sd);i?x.lineTo(X,Z):x.moveTo(X,Z)}x.stroke()})});
  // le camp : une terre piétinée, du gravier, l'aire de l'hélicoptère
  {const[cx0,cz0]=PLACES[1];blob(x,gx(cx0),gz(cz0),gx(1.5)-gx(0),'rgba(200,192,170,.6)');for(let i=0;i<1200;i++){const a=rnd(0,6.3),r=rnd(0,1.3);x.fillStyle=hsl(rnd(30,50),rnd(5,14),rnd(55,78),.7);x.fillRect(gx(cx0+Math.cos(a)*r),gz(cz0+Math.sin(a)*r),2,2)}
   const[hx,hz]=pol(140,4.95);x.strokeStyle='rgba(240,236,224,.85)';x.lineWidth=7;x.beginPath();x.arc(gx(hx),gz(hz),gx(.32)-gx(0),0,7);x.stroke();x.font='700 44px Georgia, serif';x.fillStyle='rgba(240,236,224,.85)';x.textAlign='center';x.fillText('H',gx(hx),gz(hz)+15)}
  // fleurs des champs, rares et pâles
  for(let i=0;i<1100;i++){const px=rnd(-6,6),pz=rnd(-6,6);if(!freeSpot(px,pz,.3))continue;x.fillStyle=[hsl(50,60,80,.9),hsl(0,0,96,.9),hsl(270,25,74,.9)][i%3];x.beginPath();x.arc(gx(px),gz(pz),rnd(2,3.4),0,7);x.fill()}
  for(let i=0;i<40;i++)blob(x,rnd(0,W),rnd(0,W*.7),rnd(120,300),'rgba(236,234,226,.14)');
  PLACES.forEach(([a,b],i)=>blob(x,gx(a)+30,gz(b)+26,170,'rgba(40,50,40,.25)'));
  const e=x.createRadialGradient(W/2,W/2,W*.36,W/2,W/2,W*.5);e.addColorStop(0,'rgba(40,46,40,0)');e.addColorStop(1,'rgba(40,46,40,.4)');x.fillStyle=e;x.fillRect(0,0,W,W)});
groundTex.repeat.set(1/(2*A),1/(2*C));groundTex.offset.set(.5,.5);
const SEAD=.05;
{const cb=canvasTex(512,64,(x,W,H)=>{x.fillStyle='#d9b98a';x.fillRect(0,0,W,H);x.fillStyle='#f3e4c6';x.fillRect(0,0,W,9);x.fillRect(0,H-9,W,9);x.strokeStyle='#b8925e';x.lineWidth=3;x.beginPath();for(let u=0;u<W;u+=2){x.lineTo(u,32+Math.sin(u*.45)*14)}x.stroke();x.fillStyle='rgba(120,80,40,.25)';x.fillRect(0,9,W,2);x.fillRect(0,H-11,W,2)},true);cb.repeat.set(40,1);M.base=new THREE.MeshStandardMaterial({map:cb,roughness:.95});const cb2=cb.clone();cb2.needsUpdate=true;cb2.repeat.set(3,1.2);M.edge=new THREE.MeshStandardMaterial({map:cb2,roughness:.95})}
M.ground=painted('#93a17f',groundTex,{roughness:.8});
{const g=new THREE.ExtrudeGeometry(disc(RB),{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:4,curveSegments:96});g.rotateX(-Math.PI/2);const p=mesh(g,[M.ground,M.base],false,true);p.position.y=TOP-.36-SEAD;box.add(p)}
{const pts=[...Array(161)].map((_,i)=>{const a=i/160*Math.PI*2;return new THREE.Vector3(Math.cos(a)*(RB+.08),TOP+.04,Math.sin(a)*(RB+.08))});box.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),360,.13,12,true),ROPE))}
const WATER={};
// la terre est une feuille de carton découpée le long de la rive ; le lac peint est en dessous
{const sh=disc(RB);const hole=new THREE.Path();[...COAST].reverse().forEach(([u,v],i)=>i?hole.lineTo(u,-v):hole.moveTo(u,-v));hole.closePath();sh.holes.push(hole);
 const g=new THREE.ExtrudeGeometry(sh,{depth:SEAD,bevelEnabled:false,curveSegments:96});g.rotateX(-Math.PI/2);
 const land=mesh(g,[M.ground,M.edge],true,true);land.position.y=TOP-SEAD;box.add(land);
 // quelques rides découpées, posées sur le lac
 const crest=cutMat((x,W,H)=>{x.fillStyle='#aebbbb';x.beginPath();x.moveTo(8,H-8);x.quadraticCurveTo(W*.3,H*.35,W*.55,H*.45);x.quadraticCurveTo(W*.75,H*.45,W-8,H-8);x.closePath();x.fill();x.fillStyle='rgba(250,252,250,.95)';x.beginPath();x.moveTo(W*.2,H*.7);x.quadraticCurveTo(W*.35,H*.42,W*.55,H*.45);x.quadraticCurveTo(W*.38,H*.5,W*.3,H*.72);x.closePath();x.fill()},256,128);
 WATER.waves=[];let tries=0;while(WATER.waves.length<0&&tries<600){tries++;const x0=rnd(SEA.x-1.7,SEA.x+1.7),z0=rnd(SEA.z-1,SEA.z+1);if(!pip(x0,z0,COAST)||segD(x0,z0,COASTC)<.4||WATER.waves.some(m=>Math.hypot(m.userData.x-x0,m.position.z-z0)<.9))continue;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(.36,.16),crest);m.customDepthMaterial=crest.userData.depth;m.castShadow=true;m.position.set(x0,TOP-SEAD+.08,z0);m.rotation.y=rnd(-.35,.35);m.userData={x:x0,row:WATER.waves.length};box.add(m);WATER.waves.push(m)}}

const shellCount=box.children.length;
/* ---------- les décors des lieux ---------- */
const deco=new THREE.Group();box.add(deco);
const put=(o,x,z,y=TOP)=>{o.position.set(x,y,z);deco.add(o);return o};
// ---- des découpes de carton croisées, comme dans un livre pop-up
const CROSS=(()=>{const g=new THREE.BufferGeometry();const P=[-1,-1,0, 1,-1,0, 1,1,0, -1,1,0, 0,-1,-1, 0,-1,1, 0,1,1, 0,1,-1],U=[0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1],N=[0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0];
 g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);return g})();
function cutMat(draw,W=256,H=256,edge='#fbf5e6',ew=5){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const s=document.createElement('canvas');s.width=W;s.height=H;const sx=s.getContext('2d');draw(sx,W,H);
 if(edge){const w=document.createElement('canvas');w.width=W;w.height=H;const wx=w.getContext('2d');wx.drawImage(s,0,0);wx.globalCompositeOperation='source-in';wx.fillStyle=edge;wx.fillRect(0,0,W,H);
 for(let k=0;k<16;k++){const a=k/16*Math.PI*2;x.drawImage(w,Math.cos(a)*ew,Math.sin(a)*ew)}}x.drawImage(s,0,0);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;
 const m=new THREE.MeshStandardMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,roughness:.95,metalness:0,bumpMap:FIB,bumpScale:.008});
 m.userData.depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});return m}
const cutMesh=(m)=>{const o=new THREE.Mesh(CROSS,m);o.castShadow=true;o.receiveShadow=true;o.customDepthMaterial=m.userData.depth;return o};
const blobs=(x,pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach(([a,b,r])=>{x.moveTo(a+r,b);x.arc(a,b,r,0,7)});x.fill()};
const flatCut=(m,w,h)=>{const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.castShadow=true;o.receiveShadow=true;o.customDepthMaterial=m.userData.depth;return o};
M.white=plastic('#f3f0e6');M.cream=plastic('#efe8d6');M.slate=plastic('#3e4247');M.slate2=plastic('#4a4f55');M.slateL=plastic('#5c6268');M.olive=plastic('#6d7254');M.wood=plastic('#8a6a4a');M.woodL=plastic('#b08a62');M.brick=plastic('#9a5a44');M.glass=new THREE.MeshStandardMaterial({color:new THREE.Color('#fff1d0').convertSRGBToLinear(),emissive:new THREE.Color('#ffb85e'),emissiveIntensity:.85,roughness:.9});
M.skin=plastic('#e8c0a0');M.marbleP=M.cream;M.black=plastic('#26282c');M.red=plastic('#a84a2a');M.stone=plastic('#a9aaa6');M.sandC=plastic('#cfc6ae');
const box3=(w,h,d,m,x=0,y=0,z=0)=>at(mesh(new THREE.BoxGeometry(w,h,d),m),x,y+h/2,z);
const faceLake=(x,z)=>Math.atan2(SEA.x-x,SEA.z-z);   // tournée vers le lac
// 1. l'université : un bâtiment de brique à colonnes, fenêtres allumées, deux réverbères
{const g=new THREE.Group();
 const brickT=canvasTex(256,128,(x,W,H)=>{x.fillStyle='#9a5a44';x.fillRect(0,0,W,H);for(let r=0;r<H;r+=10){x.fillStyle='rgba(240,220,200,.35)';x.fillRect(0,r,W,1.5);for(let u=(r/10%2)*12;u<W;u+=24)x.fillRect(u,r,1.5,10)}for(let i=0;i<300;i++){x.fillStyle=`rgba(${Math.random()<.5?'60,30,20':'200,140,110'},.15)`;x.fillRect(rnd(0,W),rnd(0,H),rnd(4,12),rnd(3,8))}},true);brickT.repeat.set(2,1);
 const bm=new THREE.MeshStandardMaterial({map:brickT,roughness:.95,bumpMap:FIB,bumpScale:.01});
 g.add(box3(1.7,.62,.75,bm,0,0,0));g.add(box3(.6,.85,.62,bm,0,0,.02));
 const rf=new THREE.Shape();rf.moveTo(-.95,0);rf.lineTo(.95,0);rf.lineTo(0,.32);rf.closePath();const rg=new THREE.ExtrudeGeometry(rf,{depth:.85,bevelEnabled:false});rg.translate(0,0,-.425);g.add(at(mesh(rg,M.slate2),0,.62,0));
 const rp=new THREE.Shape();rp.moveTo(-.38,0);rp.lineTo(.38,0);rp.lineTo(0,.24);rp.closePath();const rpg=new THREE.ExtrudeGeometry(rp,{depth:.76,bevelEnabled:false});rpg.translate(0,0,-.32);g.add(at(mesh(rpg,M.slate),0,.85,.12));
 [-.27,-.09,.09,.27].forEach(px=>g.add(at(mesh(new THREE.CylinderGeometry(.03,.034,.52,10),M.white),px,.3,.47)));g.add(box3(.7,.06,.16,M.white,0,.56,.46));
 [0,1,2].forEach(k=>g.add(box3(.7-k*.06,.035,.12,M.cream,0,k*.035,.6-k*.06)));
 for(let r=0;r<2;r++)for(let c=-2;c<=2;c++){if(c===0)continue;g.add(at(mesh(new THREE.BoxGeometry(.13,.16,.02),M.glass,false,false),c*.32,.18+r*.24,.385))}
 g.add(at(mesh(new THREE.BoxGeometry(.16,.18,.02),M.glass,false,false),0,.62,.335));
 {const ck=mesh(new THREE.CylinderGeometry(.07,.07,.02,20),M.cream);ck.rotation.x=Math.PI/2;ck.position.set(0,.98,.43);g.add(ck)}
 const[px,pz]=PLACES[0];g.rotation.y=faceLake(px,pz);put(g,px,pz)}
// 2. le camp : tentes de papier plié, camions, mâts d'éclairage et guirlande, tableau « HUMAIN », hélicoptère posé
let pharosFire,pharosLight;const BEAM={};const MAPFX={lamps:[],beams:[]};
{const g=new THREE.Group();
 const tent=(w,l,h)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth:l,bevelEnabled:false});geo.translate(0,0,-l/2);return mesh(geo,M.white)};
 [[-.55,-.45],[-.05,-.6],[.45,-.7],[-.7,.15],[-.2,.0],[.3,-.1]].forEach(([x,z],i)=>{const t=tent(.4,.56,.3);t.position.set(x,0,z);t.rotation.y=.15;g.add(t);const dr=mesh(new THREE.PlaneGeometry(.14,.18),M.slate,false,false);dr.position.set(x+Math.sin(.15)*.281,.09,z+Math.cos(.15)*.281);dr.rotation.y=.15;g.add(dr)});
 [[.1,.65,.2],[.62,.35,1.4],[-.62,.72,-.4]].forEach(([x,z,r])=>{const c=new THREE.Group();c.add(box3(.3,.22,.2,M.olive,-.05,.06,0));c.add(box3(.14,.16,.2,M.olive,.2,.06,0));c.add(box3(.04,.08,.18,M.glass,.27,.13,0));[-.12,.06,.2].forEach(wx=>[-1,1].forEach(k=>{const w=mesh(new THREE.CylinderGeometry(.045,.045,.03,12),M.black);w.rotation.x=Math.PI/2;w.position.set(wx,.045,k*.11);c.add(w)}));c.position.set(x,0,z);c.rotation.y=r;g.add(c)});
 // deux mâts d'éclairage, une guirlande d'ampoules tendue entre eux
 const mast=(x,z)=>{g.add(at(mesh(new THREE.CylinderGeometry(.012,.018,1.25,6),M.slate),x,.62,z));g.add(box3(.2,.06,.06,M.slate,x,1.24,z));const f=mesh(new THREE.BoxGeometry(.16,.07,.05),new THREE.MeshBasicMaterial({color:'#ffd9a0'}),false,false);f.position.set(x,1.25,z+.04);g.add(f);return f};
 pharosFire=mast(-.95,-.15);mast(.85,-.35);
 pharosLight=new THREE.PointLight(0xffc880,1.0,5,2);pharosLight.position.set(-.05,1.1,.1);g.add(pharosLight);
 {const P=[...Array(13)].map((_,i)=>{const t=i/12;return new THREE.Vector3(-.95+1.8*t,1.18-.32*Math.sin(t*Math.PI),-.15-.2*t)});g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P),40,.005,4),M.black,false,false));
  P.slice(1,-1).forEach(p=>{const b=mesh(new THREE.SphereGeometry(.022,8,6),new THREE.MeshBasicMaterial({color:'#ffcf80'}),false,false);b.position.copy(p).add(new THREE.Vector3(0,-.03,0));g.add(b);MAPFX.lamps.push(b)})}
 {const wt=canvasTex(256,160,(x,W,H)=>{x.fillStyle='#f6f4ee';x.fillRect(0,0,W,H);x.strokeStyle='#8a8a8a';x.lineWidth=6;x.strokeRect(3,3,W-6,H-6);x.fillStyle='#1d2a66';x.font='700 58px Georgia, serif';x.textAlign='center';x.fillText('HUMAIN',W/2,H/2+20)});
  const wb=mesh(new THREE.PlaneGeometry(.42,.26),new THREE.MeshStandardMaterial({map:wt,roughness:.6}),true,false);wb.position.set(.15,.42,.42);g.add(wb);
  [-1,1].forEach(k=>{const l=mesh(new THREE.CylinderGeometry(.008,.008,.5,5),M.wood);l.position.set(.15+k*.17,.25,.4);g.add(l)})}
 const[px,pz]=PLACES[1];g.rotation.y=faceLake(px,pz);put(g,px,pz);MAPFX.camp=g}
// la grande tente des opérations, demi-cylindre blanc, avec son antenne
{const g=new THREE.Group();const t=mesh(new THREE.CylinderGeometry(.42,.42,.95,24,1,false,0,Math.PI),M.white);t.rotation.z=Math.PI/2;t.rotation.y=Math.PI/2;g.add(t);
 g.add(at(mesh(new THREE.CylinderGeometry(.01,.01,.6,5),M.slate),.35,.55,-.3));const dish=mesh(new THREE.SphereGeometry(.16,16,8,0,Math.PI*2,0,Math.PI*.35),M.cream);dish.rotation.x=-1.1;dish.position.set(.35,.85,-.28);g.add(dish);
 g.rotation.y=faceLake(...LIB)+Math.PI/2;put(g,...LIB)}
// l'hélicoptère, en papier plié : un posé sur l'aire, un autre qui tourne au-dessus de la vallée
const heli=()=>{const g=new THREE.Group(),m=plastic('#4a5048'),d=plastic('#2a2e2c');const b=mesh(new THREE.SphereGeometry(.13,10,8),m);b.scale.set(1.5,.85,.9);b.position.y=.13;g.add(b);
 g.add(at(mesh(new THREE.CylinderGeometry(.025,.012,.42,6),m),-.32,.17,0));g.children[g.children.length-1].rotation.z=Math.PI/2+.12;g.add(at(mesh(new THREE.BoxGeometry(.03,.12,.01),d),-.52,.22,0));
 g.add(at(mesh(new THREE.BoxGeometry(.04,.012,.02),d),0,.25,0));const rot=new THREE.Group();rot.position.y=.27;[0,1].forEach(k=>{const bl=mesh(new THREE.BoxGeometry(.75,.006,.035),d,true,false);bl.rotation.y=k*Math.PI/2;rot.add(bl)});g.add(rot);
 [-1,1].forEach(k=>g.add(at(mesh(new THREE.BoxGeometry(.34,.012,.012),d),0,.01,k*.09)));g.userData.rot=rot;return g};
{const[hx,hz]=pol(140,4.95);const h=heli();h.rotation.y=.6;put(h,hx,hz);MAPFX.heli0=h}
// 3. la coquille : un galet immense en tranches de carton ardoise empilées, qui flotte au-dessus de l'eau et de l'herbe
const SHELL={};
{const g=new THREE.Group();const H=3.9,N=56,lift=.75;
 for(let i=0;i<N;i++){const t=(i+.5)/N,prof=Math.sin(Math.PI*Math.pow(t,.92)),r=.62*Math.pow(prof,.8)+.02;const s=mesh(new THREE.CylinderGeometry(r*.72,r*.72,H/N*.97,48),i%6===0?M.slate2:M.slate);s.scale.z=.5;s.position.y=lift+t*H;g.add(s)}
 SHELL.g=g;g.scale.setScalar(.88);g.rotation.y=.25;put(g,SEA.x,SEA.z);SHELL.y0=TOP;
 // la plate-forme élévatrice, sous son ventre, côté lac
 const pl=new THREE.Group();pl.add(box3(.42,.04,.42,M.white,0,.18,0));[-1,1].forEach(k=>{const b=mesh(new THREE.BoxGeometry(.5,.02,.03),M.slateL);b.rotation.z=k*.35;b.position.set(0,.09,k*.17);pl.add(b)});pl.add(box3(.46,.04,.46,M.slateL,0,0,0));
 put(pl,...pol(180,3.72))}
// 4. la maison du lac : murs pâles, grande baie vitrée allumée, terrasse ; le ponton avance sur l'eau
{const g=new THREE.Group();
 g.add(box3(1.0,.42,.6,M.cream,0,0,0));g.add(box3(1.18,.05,.78,M.slate,0,.42,0));g.add(box3(.5,.3,.5,M.cream,-.25,.47,-.04));g.add(box3(.62,.04,.6,M.slate,-.25,.77,-.04));
 g.add(at(mesh(new THREE.BoxGeometry(.8,.3,.02),M.glass,false,false),.05,.2,.305));g.add(at(mesh(new THREE.BoxGeometry(.36,.18,.02),M.glass,false,false),-.25,.58,.215));
 [-.35,-.05,.25].forEach(px=>g.add(box3(.015,.32,.015,M.slate,px,0,.31)));
 g.add(box3(1.2,.04,.4,M.woodL,0,0,.5));
 const[px,pz]=PLACES[3];g.rotation.y=faceLake(px,pz);put(g,px,pz);
 const d=new THREE.Group(),L=1.45;d.add(box3(.26,.03,L,M.woodL,0,.05,0));for(let k=0;k<11;k++)d.add(box3(.27,.006,.02,M.wood,0,.081,-L/2+.06+k*.13));[[-.12,-L/2+.1],[.12,-L/2+.1],[-.12,L/2-.1],[.12,L/2-.1],[-.12,0],[.12,0]].forEach(([a,b])=>d.add(at(mesh(new THREE.CylinderGeometry(.02,.02,.18,6),M.wood),a,.02,b)));
 const[dx,dz]=pol(250,2.25);d.rotation.y=faceLake(dx,dz);put(d,dx,dz,TOP-.03)}
// des réverbères le long du chemin circulaire, entre les lieux
[30,90,152,215,282,345].forEach(a=>{const[x,z]=pol(a,RING+.42);const g=new THREE.Group();g.add(at(mesh(new THREE.CylinderGeometry(.012,.016,.62,6),M.black),0,.31,0));g.add(at(mesh(new THREE.BoxGeometry(.07,.04,.07),M.black),0,.64,0));
 const b=mesh(new THREE.SphereGeometry(.035,10,8),new THREE.MeshBasicMaterial({color:'#ffd9a0'}),false,false);b.position.y=.6;g.add(b);MAPFX.lamps.push(b);put(g,x,z);OBSTL.push([x,z,.12])});
// 5. (aujourd'hui) la salle des enregistrements : construite dans X_ia
/* ---------- montagnes, sapins, rochers, brume ---------- */
const scatter=(n,m,fn)=>{const pts=[];let tries=0;while(pts.length<n&&tries<n*40){tries++;const x=rnd(-A,A),z=rnd(-C,C);if(freeSpot(x,z,m)&&pts.every(([a,b])=>Math.hypot(a-x,b-z)>.32))pts.push([x,z])}pts.forEach(([x,z],i)=>fn(x,z,i))};
const inst=(geo,mat,list,cast=true)=>{const im=new THREE.InstancedMesh(geo,mat,list.length);im.castShadow=cast;im.receiveShadow=false;const d=new THREE.Object3D();list.forEach((t,i)=>{d.position.set(t[0],t[1],t[2]);d.rotation.set(0,t[4]||0,0);d.scale.set(t[3],t[5]||t[3],t[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});box.add(im);return im};
const CUT={
 pine:cutMat((x)=>{x.fillStyle='#5a4632';x.fillRect(122,200,12,54);const f=(col,dx)=>{x.fillStyle=col;x.beginPath();x.moveTo(128,4);for(let k=0;k<5;k++){const y=40+k*40,w=26+k*20;x.lineTo(128+w+dx,y+14);x.lineTo(128+w*.45,y+4)}x.lineTo(128,214);x.closePath();x.fill()};f('#43544a',0);
   x.save();x.globalCompositeOperation='source-atop';x.fillStyle='#34433b';x.fillRect(128,0,128,256);x.restore();x.fillStyle='#43544a';x.beginPath();x.moveTo(128,4);for(let k=0;k<5;k++){const y=40+k*40,w=26+k*20;x.lineTo(128-w,y+14);x.lineTo(128-w*.45,y+4)}x.lineTo(128,214);x.closePath();x.fill()},256,256,'#9aa592',3),
 pine2:cutMat((x)=>{x.fillStyle='#5a4632';x.fillRect(123,200,10,54);x.fillStyle='#55665a';x.beginPath();x.moveTo(128,8);for(let k=0;k<4;k++){const y=50+k*44,w=30+k*20;x.lineTo(128+w,y+18);x.lineTo(128+w*.4,y+6)}x.lineTo(128,214);for(let k=3;k>=0;k--){const y=50+k*44,w=30+k*20;x.lineTo(128-w*.4,y+6);x.lineTo(128-w,y+18)}x.closePath();x.fill();x.save();x.globalCompositeOperation='source-atop';x.fillStyle='rgba(30,40,34,.3)';x.fillRect(128,0,128,214);x.restore()},256,256,'#9aa592',3),
 grass:cutMat((x)=>{x.strokeStyle='#8e9a6c';x.lineWidth=5;x.lineCap='round';for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(128+k*12,250);x.quadraticCurveTo(128+k*16,170,128+k*30+rnd(-10,10),rnd(100,150));x.stroke()}x.strokeStyle='#c4b07a';x.lineWidth=3;for(let k=-2;k<=2;k+=2){x.beginPath();x.moveTo(128+k*12,250);x.quadraticCurveTo(128+k*14,190,128+k*22,rnd(140,175));x.stroke()}},256,256,'#d6d4bc',1.5),
 birch:cutMat((x)=>{x.fillStyle='#e8e4d8';x.fillRect(120,110,16,146);x.fillStyle='#2a2a2a';for(let i=0;i<8;i++)x.fillRect(120+(i%2)*6,124+i*16,rnd(6,10),3);blobs(x,[[128,80,52],[86,104,38],[170,100,40],[108,54,34],[152,58,34]],'#c9a64a');blobs(x,[[150,86,26],[96,112,20]],'#a8843a')}),
 reed:cutMat((x)=>{x.strokeStyle='#6f7e52';x.lineWidth=4;x.lineCap='round';for(let k=-3;k<=3;k++){x.beginPath();x.moveTo(128+k*14,252);x.quadraticCurveTo(128+k*16,150,128+k*26+rnd(-8,8),rnd(40,90));x.stroke()}x.fillStyle='#5a3e28';[[-2,70],[2,58],[-3,96]].forEach(([k,y])=>{x.beginPath();x.ellipse(128+k*16,y,6,20,0,0,7);x.fill()})},256,256,'#c9cbb2',1.5)};
// les montagnes : des bandes de papier déchiré dressées en arc au fond de la boîte, de plus en plus pâles au loin
const MOUNT=(col,snow,seed,h0)=>cutMat((x,W,H)=>{const R=seeded(seed);x.fillStyle=col;x.beginPath();x.moveTo(0,H);let y=H*h0;x.lineTo(0,y);const pk=[];for(let u=0;u<=W;u+=8){y+=(R()-.5)*26+(H*h0-y)*.02;if(u>W*.15&&u<W*.85&&R()<.06){y-=H*.18*R()}y=Math.max(H*.06,Math.min(H*.8,y));x.lineTo(u,y);pk.push([u,y])}x.lineTo(W,H);x.closePath();x.fill();
  // le bord déchiré, un peu plus clair ; la forêt sombre au pied
  x.save();x.globalCompositeOperation='source-atop';x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=6;x.beginPath();pk.forEach(([u,v],i)=>i?x.lineTo(u,v+3):x.moveTo(u,v+3));x.stroke();
  if(snow){x.fillStyle='rgba(240,240,236,.85)';pk.forEach(([u,v])=>{if(v<H*.32){x.beginPath();x.moveTo(u-14,v+18);x.lineTo(u,v-2);x.lineTo(u+14,v+20);x.closePath();x.fill()}})}
  const gr=x.createLinearGradient(0,H*.55,0,H);gr.addColorStop(0,'rgba(40,56,44,0)');gr.addColorStop(1,'rgba(40,56,44,.75)');x.fillStyle=gr;x.fillRect(0,H*.55,W,H*.45);
  for(let u=0;u<W;u+=rnd(5,11)){const hh=rnd(16,30);x.fillStyle='rgba(38,52,42,.85)';x.beginPath();x.moveTo(u-6,H*.92);x.lineTo(u,H*.92-hh);x.lineTo(u+6,H*.92);x.fill()}x.restore()},512,256,null);
const MT=[MOUNT('#8f989c',true,11,.3),MOUNT('#6c757b',true,23,.38),MOUNT('#55605e',false,37,.5)];
const CLOUDS=[],CRANES=[];
{const lay=[[5.55,2.2,MT[0],.45],[5.05,1.65,MT[1],.25],[4.6,1.15,MT[2],.05]];
 lay.forEach(([r,h,m,y0],li)=>{for(let k=0;k<6;k++){const a=-Math.PI*(.12+k*.76/5)+(li%2?.07:0);const w=2.6*r/5.2,o=flatCut(m,w,h);const px=Math.cos(a)*r,pz=Math.sin(a)*r;o.position.set(px,TOP+h/2-.08+y0*0,pz);o.rotation.y=-a-Math.PI/2;o.material=m;box.add(o)}});
 // les nuages bas, en calque, qui glissent le long de la crête
 const cloudT=canvasTex(512,128,(x,W,H)=>{x.clearRect(0,0,W,H);for(let i=0;i<26;i++){const cx=rnd(60,W-60),cy=rnd(44,90),r=rnd(26,56);const g2=x.createRadialGradient(cx,cy,0,cx,cy,r);g2.addColorStop(0,'rgba(246,244,238,.85)');g2.addColorStop(1,'rgba(246,244,238,0)');x.fillStyle=g2;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()}});
 const cm=new THREE.MeshBasicMaterial({map:cloudT,transparent:true,depthWrite:false,opacity:.85,side:THREE.DoubleSide,toneMapped:false});
 [[-2.6,-4.3,1.45,3.4],[1.2,-4.6,1.75,3.8],[3.6,-3.2,1.25,3.0],[-4.3,-2.6,1.1,2.6]].forEach(([x,z,y,w],i)=>{const o=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.25),cm);o.position.set(x,TOP+y,z);o.lookAt(0,TOP+y,6);o.userData={x,ph:i*1.7};o.renderOrder=3;box.add(o);CLOUDS.push(o)});
 // et la brume couchée sur la prairie, en feuilles de calque à peine visibles
 const mistT=canvasTex(256,256,(x,W)=>{const g2=x.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);g2.addColorStop(0,'rgba(244,242,236,.55)');g2.addColorStop(1,'rgba(244,242,236,0)');x.fillStyle=g2;x.fillRect(0,0,W,W)});
 const mm=new THREE.MeshBasicMaterial({map:mistT,transparent:true,depthWrite:false,opacity:.5,toneMapped:false});
 [[-1.4,-3.4,.5,3.2],[1.8,-3.3,.42,2.6],[.2,-.5,.3,2.6],[-.6,1.4,.22,2.2],[1.2,.6,.26,2.0],[-3.6,-1.8,.32,2.2]].forEach(([x,z,y,s],i)=>{const o=new THREE.Mesh(new THREE.PlaneGeometry(s,s*.6),mm);o.rotation.x=-Math.PI/2;o.position.set(x,TOP+y,z);o.userData={x,ph:i*2.3};o.renderOrder=3;box.add(o);CLOUDS.push(o)})}
{const pines=[],pines2=[],grass=[],rocks=[],birch=[],reeds=[];
 const nearPlace=(x,z,m)=>PLACES.some(([p,q])=>Math.hypot(x-p,z-q)<m)||Math.hypot(x-LIB[0],z-LIB[1])<m*.8||Math.hypot(x-BAPOS[0],z-BAPOS[1])<m*.8;
 // la forêt : une couronne de sapins tout autour, plus dense au pied des montagnes
 for(let i=0;i<620;i++){const a=rnd(0,Math.PI*2),r=rnd(4.35,5.6),x=Math.cos(a)*r,z=Math.sin(a)*r;if(z<-4.5&&Math.abs(x)<3.2)continue;if(nearPlace(x,z,1.05)||segD(x,z,NILEP)<.3||routeD(x,z)<.4)continue;if(pines.concat(pines2).some(t=>Math.hypot(t[0]-x,t[2]-z)<.24))continue;const s=rnd(.8,1.25)*(z<-3?1.15:1);(i%3?pines:pines2).push([x,TOP+.3*s,z,.2*s,0,.3*s])}
 for(let i=0;i<40;i++){const a=rnd(0,Math.PI*2),r=rnd(3.75,4.3),x=SEA.x+Math.cos(a)*r,z=SEA.z+Math.sin(a)*r;if(nearPlace(x,z,1.15)||segD(x,z,NILEP)<.35||routeD(x,z)<.42||Math.hypot(x,z)>RB-.5)continue;birch.push([x,TOP+.36,z,.24,0,.36]);OBSTL.push([x,z,.2])}
 // dans la prairie fauchée, quelques touffes ; au bord de l'eau, des roseaux
 for(let i=0;i<220;i++){const a=rnd(0,Math.PI*2),r=rnd(LR+.35,RING-.35),x=SEA.x+Math.cos(a)*r,z=SEA.z+Math.sin(a)*r;if(Math.abs(Math.atan2(x-SEA.x,z-SEA.z)*180/Math.PI-(-110))<9)continue;grass.push([x,TOP+.08,z,.1,0,.08])}
 for(let i=0;i<120;i++){const a=rnd(0,Math.PI*2),r=LR+rnd(.02,.22),x=SEA.x+Math.cos(a)*r,z=SEA.z+Math.sin(a)*r;const deg=(Math.atan2(x-SEA.x,z-SEA.z)*180/Math.PI+360)%360;if(Math.abs(deg-250)<10||Math.abs(deg-180)<8)continue;reeds.push([x,TOP+.13,z,.11,rnd(0,3),.14])}
 for(let i=0;i<70;i++){const a=rnd(0,Math.PI*2),r=rnd(3.75,4.35),x=SEA.x+Math.cos(a)*r,z=SEA.z+Math.sin(a)*r;if(!nearPlace(x,z,.9)&&routeD(x,z)>.35)grass.push([x,TOP+.08,z,.11,0,.09])}
 scatter(26,.4,(x,z)=>rocks.push([x,TOP+.04,z,rnd(.08,.16),rnd(0,6),rnd(.06,.11)]));
 [[CUT.pine,pines],[CUT.pine2,pines2],[CUT.grass,grass],[CUT.birch,birch],[CUT.reed,reeds]].forEach(([m,l])=>{if(!l.length)return;const im=inst(CROSS,m,l);im.customDepthMaterial=m.userData.depth});
 inst((()=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position,map={};for(let i=0;i<p.count;i++){const k=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(3)).join();const f=map[k]||(map[k]=rnd(.78,1.12));p.setXYZ(i,p.getX(i)*f,p.getY(i)*f,p.getZ(i)*f)}g.computeVertexNormals();return g})(),plastic('#b9bab4'),rocks)}

// l'automne d'Alice : des érables rouges et orangés, des buissons, des meules de foin dans le pré fleuri
{const mapleA=cutMat((x)=>{x.fillStyle='#5a3a26';x.fillRect(122,140,12,116);blobs(x,[[128,92,58],[80,116,40],[176,112,42],[104,60,40],[154,62,40],[128,140,34]],'#d8562e');blobs(x,[[150,82,30],[98,120,22],[170,128,20]],'#b83a22');blobs(x,[[110,70,20],[140,50,14],[84,104,14]],'#f2a04a')}),
  mapleB=cutMat((x)=>{x.fillStyle='#5a3a26';x.fillRect(122,140,12,116);blobs(x,[[128,92,56],[82,118,38],[174,114,40],[104,62,38],[152,60,38]],'#eaa23a');blobs(x,[[150,84,28],[96,122,22]],'#d07a26');blobs(x,[[112,72,18],[140,48,14]],'#ffd36a')}),
  bush=cutMat((x)=>{blobs(x,[[128,200,54],[80,214,36],[176,214,38],[128,170,40]],'#7a8a3a');blobs(x,[[150,196,26],[96,214,20]],'#a85a2a');for(let i=0;i<14;i++){x.fillStyle=['#c8463a','#e8b84a','#b07ad0'][i%3];x.beginPath();x.arc(rnd(86,170),rnd(166,230),5,0,7);x.fill()}});
 const A1=[],A2=[],BU=[];
 for(let i=0;i<120;i++){const a=rnd(0,Math.PI*2),r=rnd(LR+.45,RING-.45),x=SEA.x+Math.cos(a)*r,z=SEA.z+Math.sin(a)*r;const deg=(Math.atan2(x-SEA.x,z-SEA.z)*180/Math.PI+360)%360;
  if(routeD(x,z)<.45||PLACES.some(([p,q])=>Math.hypot(x-p,z-q)<1.2)||[...A1,...A2].some(t=>Math.hypot(t[0]-x,t[2]-z)<.55))continue;if(A1.length+A2.length>=22)break;
  const sc=rnd(.85,1.2);(i%2?A1:A2).push([x,TOP+.3*sc,z,.22*sc,0,.3*sc]);OBSTL.push([x,z,.18])}
 for(let i=0;i<260;i++){const x=rnd(-5,5),z=rnd(-5,5);if(BU.length>=46)break;const rr=Math.hypot(x-SEA.x,z-SEA.z);if(rr<LR+.3||Math.hypot(x,z)>RB-.6||routeD(x,z)<.35||PLACES.some(([p,q])=>Math.hypot(x-p,z-q)<1.0))continue;BU.push([x,TOP+.1,z,.14,0,.11])}
 [[mapleA,A1],[mapleB,A2],[bush,BU]].forEach(([m,l])=>{if(!l.length)return;const im=inst(CROSS,m,l);im.customDepthMaterial=m.userData.depth});
 const hay=plastic('#e2b858'),hb=[];for(let i=0;i<40&&hb.length<7;i++){const a=rnd(0,Math.PI*2),r=rnd(RING+.45,4.2),x=SEA.x+Math.cos(a)*r,z=SEA.z+Math.sin(a)*r;if(Math.hypot(x,z)>RB-.6||routeD(x,z)<.4||PLACES.some(([p,q])=>Math.hypot(x-p,z-q)<1.2)||segD(x,z,NILEP)<.4)continue;
  const m=mesh(new THREE.CylinderGeometry(.12,.12,.16,20),hay,true,true);m.rotation.z=Math.PI/2;m.rotation.y=rnd(0,3);m.position.set(x,TOP+.12,z);box.add(m);hb.push(m);OBSTL.push([x,z,.18])}}
// autour de la coquille, des nuages qui roulent dans le gouffre ; le cercle d'encre est posé dessous
{const t=canvasTex(256,256,(x,W)=>{for(let i=0;i<9;i++){const cx=rnd(60,196),cy=rnd(80,180),r=rnd(40,70);const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'rgba(255,252,246,.95)');g.addColorStop(.6,'rgba(244,238,246,.6)');g.addColorStop(1,'rgba(230,224,240,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()}});
 const mat=new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,opacity:.9,toneMapped:false});
 MAPFX.puffs=[...Array(16)].map((_,i)=>{const sp=new THREE.Sprite(mat);const a=i/16*Math.PI*2+rnd(-.15,.15),r=i%2?rnd(1.32,1.65):rnd(.28,.5),k=rnd(.55,.95);sp.scale.set(k*1.4,k*.8,1);sp.userData={a,r,y:rnd(-.02,.22),ph:rnd(0,6)};sp.renderOrder=2;box.add(sp);return sp})}
// deux oiseaux de papier qui tournent au-dessus de la vallée
const BOATG=(()=>{const g=new THREE.BufferGeometry();const v=[-.12,0,0, .12,0,0, .27,.13,.07, -.27,.13,.07,  .12,0,0, -.12,0,0, -.27,.13,-.07, .27,.13,-.07,  -.13,.12,0, .13,.12,0, 0,.34,0,  -.27,.13,.07, -.12,0,0, -.27,.13,-.07,  .12,0,0, .27,.13,.07, .27,.13,-.07];
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,11,12,13,14,15,16]);g.computeVertexNormals();return g})();
const boats=[];const _noBoat=[(()=>{const g=new THREE.Group();const m=mesh(BOATG,new THREE.MeshStandardMaterial({color:new THREE.Color('#e8e4d8').convertSRGBToLinear(),side:THREE.DoubleSide,flatShading:true,roughness:.95,bumpMap:FIB,bumpScale:.006}));m.scale.setScalar(1.5);m.castShadow=true;g.add(m);g.rotation.y=.8;return g})];
const sheep=[];
{const cg=new THREE.BufferGeometry();const v=[0,0,-.16, 0,.02,.12, -.03,-.02,0, 0,0,-.16, 0,.02,.12, .03,-.02,0, 0,.02,.12, 0,.12,.2, .02,0,.05, 0,0,-.16, 0,.1,-.22, -.02,0,-.08];cg.setAttribute('position',new THREE.Float32BufferAttribute(v,3));cg.computeVertexNormals();
 const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.06, 0,0,.08, .22,.03,0],3));wg.computeVertexNormals();
 [['#2e3236',0,-3.2,1.2,3.4],['#3a3e42',-1.8,-1.4,1.6,2.0]].forEach(([col,cx,cz,r,h],i)=>{const m=new THREE.MeshStandardMaterial({color:new THREE.Color(col).convertSRGBToLinear(),side:THREE.DoubleSide,flatShading:true,roughness:.95});
  const g=new THREE.Group();const b=mesh(cg,m);g.add(b);const wl=mesh(wg,m),wr=mesh(wg,m);wr.scale.x=-1;g.add(wl);g.add(wr);g.userData={cx,cz,r,h,ph:i*2.1,wl,wr};g.scale.setScalar(1.4);box.add(g);CRANES.push(g)})}
// des bouts de ruban adhésif qui tiennent la carte au fond de la boîte
{const tm=new THREE.MeshStandardMaterial({color:new THREE.Color('#fff4d0').convertSRGBToLinear(),transparent:true,opacity:.62,roughness:.55,side:THREE.DoubleSide});
 [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{const cx=sx*(RB+.08)*.7071,cz=sz*(RB+.08)*.7071;const R=.165,a1=-Math.PI/3,P=[[-R-.3,.012],[-R-.06,.012]];for(let k=0;k<=40;k++){const a=Math.PI+(a1-Math.PI)*k/40;P.push([R*Math.cos(a),.04+R*Math.sin(a)])}const e=P[P.length-1];P.push([e[0]-.03,-.17]);const L=[0];for(let k=1;k<P.length;k++)L.push(L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]));const LT=L[L.length-1];const g=new THREE.PlaneGeometry(1,.26,96,1);g.rotateX(-Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++){const sl=(p.getX(i)+.5)*LT;let k=1;while(k<L.length-1&&L[k]<sl)k++;const f=(sl-L[k-1])/Math.max(1e-6,L[k]-L[k-1]);p.setX(i,P[k-1][0]+(P[k][0]-P[k-1][0])*f);p.setY(i,P[k-1][1]+(P[k][1]-P[k-1][1])*f)}g.computeVertexNormals();const t=new THREE.Mesh(g,tm);t.position.set(cx,TOP,cz);t.rotation.y=-Math.atan2(sz,sx);t.receiveShadow=true;box.add(t)})}
{const em=new THREE.LineBasicMaterial({color:'#3a3a3a',transparent:true,opacity:.28});deco.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&o.geometry&&o.geometry.attributes.position.count<600&&o.material&&!o.material.alphaTest&&!o.material.transparent&&o.material.type!=='MeshBasicMaterial'){const e=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,35),em);o.add(e)}})}
// le fil de laine rouge : une punaise par lieu, reliées dans l'ordre du récit ; il revient à l'université : il fait le tour, comme un cercle
const THREAD={pins:[],segs:[]};
{const wool=canvasTex(64,16,(x,W,H)=>{x.fillStyle='#b8322e';x.fillRect(0,0,W,H);x.strokeStyle='#e0574a';x.lineWidth=3;for(let u=-H;u<W+H;u+=8){x.beginPath();x.moveTo(u,0);x.lineTo(u+H,H);x.stroke()}},true);wool.repeat.set(60,1);
 const wm=new THREE.MeshStandardMaterial({map:wool,roughness:.95}),head=plastic('#c8302a'),pinM=plastic('#d8d0c0');
 const pts=[0,1,2,3].map(i=>{const[px,pz]=PLACES[i],sp=SPOTS[i];return[px+(sp.x-px)*.45,pz+(sp.z-pz)*.45]});pts.push([BAPOS[0]+(SPOT5.x-BAPOS[0])*.45,BAPOS[1]+(SPOT5.z-BAPOS[1])*.45]);
 const H=.55;pts.forEach(([x,z])=>{const g=new THREE.Group();g.add(at(mesh(new THREE.CylinderGeometry(.008,.004,H,6),pinM),0,H/2,0));g.add(at(mesh(new THREE.SphereGeometry(.095,12,10),head),0,H,0));g.position.set(x,TOP,z);g.scale.setScalar(.001);g.visible=false;box.add(g);THREAD.pins.push(g)});
 [[0,1],[1,2],[2,3],[3,4]].forEach(([ia,ib])=>{const[a1,b1]=pts[ia],[a2,b2]=pts[ib],d=Math.hypot(a2-a1,b2-b1),y=TOP+H;const mid=new THREE.Vector3((a1+a2)/2,Math.max(TOP+.18,y-.1*d),(b1+b2)/2);
  const c=new THREE.CatmullRomCurve3([new THREE.Vector3(a1,y,b1),new THREE.Vector3(a1+(a2-a1)*.25,y-.06*d,b1+(b2-b1)*.25),mid,new THREE.Vector3(a1+(a2-a1)*.75,y-.06*d,b1+(b2-b1)*.75),new THREE.Vector3(a2,y,b2)]);
  const tg=new THREE.TubeGeometry(c,80,.016,6,false);const m=new THREE.Mesh(tg,wm);m.castShadow=true;m.visible=false;box.add(m);THREAD.segs.push({m,n:tg.index.count,t0:0,a:ia,b:ib})})}
const BRIDGE={};const bridgeH=(x,z)=>{if(BRIDGE.L==null)return 0;const dx=x-BRIDGE.x,dz=z-BRIDGE.z,u=dx*Math.cos(BRIDGE.a)+dz*Math.sin(BRIDGE.a),v=-dx*Math.sin(BRIDGE.a)+dz*Math.cos(BRIDGE.a);if(Math.abs(u)>BRIDGE.L/2||Math.abs(v)>BRIDGE.W/2+.1)return 0;const t=2*u/BRIDGE.L;return .06+.08*(1-t*t)};
// une petite passerelle de bois sur le ruisseau, là où le chemin le traverse
{let best=null;for(let i=0;i<=200;i++){const p=ROUTEC.getPoint(i/200);for(let k=0;k<=60;k++){const q=NILE.getPoint(k/60),d=Math.hypot(p.x-q.x,p.z-q.z);if(!best||d<best.d)best={d,p,t:ROUTEC.getTangent(i/200)}}}
 const g=new THREE.Group(),L=1.0,Wd=.42;
 const sh=new THREE.Shape();sh.moveTo(-L/2,0);sh.quadraticCurveTo(0,.26,L/2,0);sh.lineTo(L/2,.05);sh.quadraticCurveTo(0,.31,-L/2,.05);sh.closePath();
 const geo=new THREE.ExtrudeGeometry(sh,{depth:Wd,bevelEnabled:false,curveSegments:16});geo.translate(0,0,-Wd/2);g.add(mesh(geo,M.woodL));
 [-1,1].forEach(k=>{for(let i=0;i<=4;i++){const u=-L/2+.1+i*(L-.2)/4,y=.26*(1-(2*u/L)**2)*.5;g.add(at(mesh(new THREE.CylinderGeometry(.012,.012,.16,5),M.wood),u,y+.1,k*(Wd/2-.02)))}const rl=new THREE.CatmullRomCurve3([...Array(9)].map((_,i)=>{const u=-L/2+.1+i*(L-.2)/8;return new THREE.Vector3(u,.26*(1-(2*u/L)**2)*.5+.18,k*(Wd/2-.02))}));g.add(mesh(new THREE.TubeGeometry(rl,16,.01,5),M.wood))});
 g.position.set(best.p.x,TOP-.03,best.p.z);g.rotation.y=-Math.atan2(best.t.z,best.t.x);box.add(g);BRIDGE.x=best.p.x;BRIDGE.z=best.p.z;BRIDGE.a=Math.atan2(best.t.z,best.t.x);BRIDGE.L=L;BRIDGE.W=Wd}

/* ---------- ce qui bouge : la coquille respire, l'hélicoptère tourne, les projecteurs balaient la brume, le cercle d'encre tourne sur le lac ---------- */
{// le cercle d'encre, pâle comme de la brume, posé sur l'eau
 const t=canvasTex(1024,1024,(x,W)=>{x.clearRect(0,0,W,W);inkRing(x,W/2,W/2,330,{seed:1918,col:'#141414',w:30,drops:30,wash:false,f:[{a:-.3,k:'splash',s:1.4},{a:.9,k:'tendril',s:1.5,c:.06},{a:1.6,k:'blob',s:1.2},{a:2.4,k:'spike',s:1.3,d:-1},{a:3.3,k:'splash',s:1.1},{a:4.1,k:'hook',s:1.3},{a:4.9,k:'tendril',s:1.2,d:-1,c:-.05},{a:5.6,k:'blob',s:.9}]})});
 const m=new THREE.Mesh(new THREE.PlaneGeometry(2.9,2.9),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.55,depthWrite:false,toneMapped:false}));m.rotation.x=-Math.PI/2;m.position.set(SEA.x,TOP+.09,SEA.z);m.renderOrder=3;box.add(m);MAPFX.ink=m}
{// la lueur sous la coquille, sur l'herbe et sur l'eau
 const t=canvasTex(256,256,(x,W)=>{const g=x.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);g.addColorStop(0,'rgba(230,236,240,.9)');g.addColorStop(.5,'rgba(200,214,224,.35)');g.addColorStop(1,'rgba(200,214,224,0)');x.fillStyle=g;x.fillRect(0,0,W,W)});
 const m=new THREE.Mesh(new THREE.CircleGeometry(1.3,32),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));m.rotation.x=-Math.PI/2;m.position.set(SEA.x,TOP-.02,SEA.z);box.add(m);MAPFX.pool=m}
{// les projecteurs du camp, des cônes de lumière très doux, sans bord, qui cherchent la coquille
 const am=canvasTex(64,256,(x,W,H)=>{const gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#fff');gr.addColorStop(.3,'#666');gr.addColorStop(.7,'#1a1a1a');gr.addColorStop(1,'#000');x.fillStyle=gr;x.fillRect(0,0,W,H)});am.encoding=THREE.LinearEncoding;
 [[-.9,1.0],[.8,1.0]].forEach(([lx,ly],i)=>{const L=4.6,geo=new THREE.ConeGeometry(.55,L,24,1,true);geo.translate(0,-L/2,0);geo.rotateX(-Math.PI/2);
  const b=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:'#ffe6b8',alphaMap:am,transparent:true,opacity:.075,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
  const p=new THREE.Vector3(lx,ly,-.2);MAPFX.camp.localToWorld(p);box.worldToLocal(p);b.position.copy(p);box.add(b);MAPFX.beams.push({b,ph:i*2.1})})}
// l'hélicoptère qui tourne au-dessus de la vallée
MAPFX.heli=heli();MAPFX.heli.scale.setScalar(1.15);box.add(MAPFX.heli);
// des halos chauds autour des lampes
{box.updateMatrixWorld(true);const gt=canvasTex(64,64,(x,W)=>{const g=x.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);g.addColorStop(0,'rgba(255,214,150,.9)');g.addColorStop(1,'rgba(255,214,150,0)');x.fillStyle=g;x.fillRect(0,0,W,W)});
 const sm=new THREE.SpriteMaterial({map:gt,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false});
 MAPFX.halos=MAPFX.lamps.map((l,i)=>{const s=new THREE.Sprite(sm);const p=new THREE.Vector3();l.getWorldPosition(p);box.worldToLocal(p);s.position.copy(p);const k=l.geometry.parameters.radius>.03?.42:.2;s.scale.set(k,k,1);s.userData={k,ph:i*1.7};box.add(s);return s})}
{// des poussières de lumière qui montent lentement autour de la coquille
 const n=70,g=new THREE.BufferGeometry(),P=new Float32Array(n*3);MAPFX.motes=[...Array(n)].map(()=>({a:rnd(0,6.3),r:rnd(.5,1.6),y:rnd(0,3.8),s:rnd(.08,.22)}));g.setAttribute('position',new THREE.BufferAttribute(P,3));
 const t=canvasTex(32,32,(x,W)=>{const gr=x.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);gr.addColorStop(0,'rgba(240,244,248,1)');gr.addColorStop(1,'rgba(240,244,248,0)');x.fillStyle=gr;x.fillRect(0,0,W,W)});
 const pts=new THREE.Points(g,new THREE.PointsMaterial({map:t,size:.09,transparent:true,opacity:.75,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));box.add(pts);MAPFX.pts=pts}
function mapTick(T){if(!MAPFX.heli)return;const on=phase!=='closed'&&phase!=='opening';
 if(MAPFX.puffs)MAPFX.puffs.forEach(p=>{const u=p.userData,a=u.a+T*.025;p.position.set(SEA.x+Math.cos(a)*u.r,TOP+u.y+.04*Math.sin(T*.4+u.ph),SEA.z+Math.sin(a)*u.r*.85)});
 // la coquille respire à peine
 SHELL.g.position.y=TOP+.18+.06*Math.sin(T*.45);SHELL.g.rotation.y=.25+.04*Math.sin(T*.13);MAPFX.pool.material.opacity=.38+.12*Math.sin(T*.45);
 // le cercle d'encre tourne lentement sur le lac
 MAPFX.ink.rotation.z=T*.035;MAPFX.ink.material.opacity=.86+.08*Math.sin(T*.3);
 // l'hélicoptère fait le tour de la vallée
 const h=MAPFX.heli,a=T*.16;h.visible=on;h.position.set(SEA.x+Math.cos(a)*4.1,TOP+2.5+.12*Math.sin(T*.9),SEA.z+Math.sin(a)*3.6-.3);h.rotation.set(.12*Math.sin(T*.5),-a-Math.PI,.1);h.userData.rot.rotation.y=T*28;MAPFX.heli0.userData.rot.rotation.y=0;
 // les projecteurs balaient la brume vers la coquille
 MAPFX.beams.forEach(({b,ph})=>{b.visible=on;const tx=SEA.x+Math.sin(T*.23+ph)*1.2,ty=TOP+1.6+Math.sin(T*.31+ph)*.9,tz=SEA.z+Math.cos(T*.19+ph)*.6;const w=new THREE.Vector3(tx,ty,tz);box.localToWorld(w);b.lookAt(w)});
 // les lampes, avec leur halo qui frémit
 MAPFX.halos.forEach(s=>{const k=s.userData.k*(1+.08*Math.sin(T*3+s.userData.ph)+.05*Math.sin(T*7.3+s.userData.ph));s.scale.set(k,k,1);s.visible=on});
 // les poussières de lumière
 const P=MAPFX.pts.geometry.attributes.position;MAPFX.motes.forEach((m,i)=>{m.y+=m.s*.016;if(m.y>4.4)m.y=0;const aa=m.a+T*.05;P.setXYZ(i,SEA.x+Math.cos(aa)*m.r,TOP+m.y,SEA.z+Math.sin(aa)*m.r*.6)});P.needsUpdate=true;MAPFX.pts.visible=on}

/* ---------- le couvercle : un disque de kraft, et dessus, peint à l'encre, un grand cercle ---------- */
const hinge=new THREE.Group();hinge.position.set(0,TOP+.06,-RB);box.add(hinge);
const lid=new THREE.Group();lid.position.set(0,0,RB);hinge.add(lid);
const lidTop=canvasTex(1024,1024,(x,W)=>{x.drawImage(KRAFT('#b48a56').image,0,0,W,W);
  // une feuille de papier de riz, un peu brumeuse, collée sur le kraft
  x.save();x.beginPath();for(let i=0;i<=90;i++){const a=i/90*Math.PI*2,r=430+Math.sin(i*5.3)*6+rnd(-4,4);x.lineTo(W/2+Math.cos(a)*r,W/2+Math.sin(a)*r)}x.closePath();x.fillStyle='#ece8de';x.fill();x.clip();
  for(let i=0;i<900;i++)dab(x,rnd(0,W),rnd(0,W),rnd(30,70),rnd(8,16),rnd(-.2,.2),rnd(30,60),rnd(4,12),rnd(84,94),rnd(.15,.3));
  for(let i=0;i<14;i++)blob(x,rnd(150,W-150),rnd(150,W-150),rnd(100,220),'rgba(190,196,198,.18)');
  inkRing(x,W/2,W/2,300,{seed:1918,w:34,a0:-.5,gap:.0,drops:28,f:[{a:-.3,k:'splash',s:1.5},{a:.9,k:'tendril',s:1.6,c:.06},{a:1.6,k:'blob',s:1.2},{a:2.4,k:'spike',s:1.4,d:-1},{a:3.3,k:'splash',s:1.1},{a:4.1,k:'hook',s:1.3},{a:4.9,k:'tendril',s:1.2,d:-1,c:-.05},{a:5.6,k:'blob',s:.9}]});
  x.restore();
  // le scotch qui la tient
  [[220,190,-.7],[804,190,.7],[220,834,.7],[804,834,-.7]].forEach(([a,b,r])=>{x.save();x.translate(a,b);x.rotate(r);x.fillStyle='rgba(240,228,190,.7)';x.fillRect(-60,-18,120,36);x.restore()})});
M.lidTop=new THREE.MeshStandardMaterial({map:lidTop,roughness:.95,bumpMap:FIB,bumpScale:.008});
{const side=mesh(new THREE.CylinderGeometry(RB+.4,RB+.4,.5,128,1,true),M.cbSide);side.position.y=.25;lid.add(side);
 const t=new THREE.CircleGeometry(RB+.4,128);t.rotateX(-Math.PI/2);const pos=t.attributes.position,uv=t.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/(2*(RB+.4))+.5,.5-pos.getZ(i)/(2*(RB+.4)));const tm=mesh(t,M.lidTop,false,true);tm.position.y=.5;lid.add(tm);
 const pts=[...Array(161)].map((_,i)=>{const a=i/160*Math.PI*2;return new THREE.Vector3(Math.cos(a)*(RB+.45),.5,Math.sin(a)*(RB+.45))});lid.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),360,.1,10,true),ROPE))}
// le ciel peint à l'intérieur : un soir de brume, gris ardoise, quelques étoiles ; l'écran des souvenirs posé dessus
const skyIn=canvasTex(1024,1024,(x,W)=>{const g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'#1d2228');g.addColorStop(.55,'#2e353d');g.addColorStop(1,'#4a5158');x.fillStyle=g;x.fillRect(0,0,W,W);
  for(let i=0;i<2400;i++){dab(x,rnd(0,W),rnd(0,W),rnd(22,60),rnd(6,12),rnd(-.15,.15),rnd(200,220),rnd(6,14),rnd(18,40),rnd(.12,.26))}
  for(let i=0;i<10;i++){const y=rnd(W*.45,W);for(let k=0;k<40;k++)blob(x,rnd(0,W),y+rnd(-30,30),rnd(40,90),'rgba(200,204,206,.05)')}
  for(let i=0;i<260;i++){const cx=rnd(0,W),cy=rnd(0,W*.7),r=rnd(.6,1.8);blob(x,cx,cy,r*4,'rgba(255,246,226,.18)');x.fillStyle='rgba(255,248,232,.85)';x.beginPath();x.arc(cx,cy,r,0,7);x.fill()}});
{const g=new THREE.CircleGeometry(RB+.35,96);g.rotateX(Math.PI/2);const pos=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/(2*RB)+.5,pos.getZ(i)/(2*RB)+.5);
 const m=mesh(g,new THREE.MeshStandardMaterial({map:skyIn,roughness:.95,bumpMap:FIB,bumpScale:.01}),false,false);m.position.y=-.02;lid.add(m)}
const MS=768,HD=LOW?1.5:2,MEMC=document.createElement('canvas');MEMC.width=MEMC.height=Math.round(MS*HD);const mx=MEMC.getContext('2d');
const memTex=new THREE.CanvasTexture(MEMC);memTex.encoding=THREE.sRGBEncoding;memTex.generateMipmaps=false;memTex.minFilter=THREE.LinearFilter;memTex.anisotropy=renderer.capabilities.getMaxAnisotropy();
const SCRW=(RB+.2)*Math.SQRT2-.2;
const memGeo=new THREE.PlaneGeometry(SCRW,SCRW);memGeo.rotateX(Math.PI/2);
const memMesh=new THREE.Mesh(memGeo,new THREE.MeshBasicMaterial({map:memTex,transparent:true,depthWrite:false}));memMesh.position.y=-.16;memMesh.renderOrder=2;lid.add(memMesh);
const apexL=new THREE.Vector3(0,-.16,0);
// coordonnées écran → point 3D (pour les tests)
const canvasToWorld=(cx,cy)=>lid.localToWorld(new THREE.Vector3((cx/MS-.5)*SCRW,-.16,(.5-cy/MS)*SCRW));
