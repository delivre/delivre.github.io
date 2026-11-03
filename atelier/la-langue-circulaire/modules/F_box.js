/* ---------- la boîte : un tambour de carton rond, comme une boîte à chapeau ; sur le couvercle, un grand cercle d'encre ---------- */
const RB=6.0;                                   // rayon du plateau
const A=RB,C=RB,TOP=.35,RW=RB,RD=RB,RR=RB;      // (noms communs aux autres modules)
const box=new THREE.Group();scene.add(box);
// un tirage pseudo-aléatoire reproductible (pour que chaque cercle d'encre garde sa forme)
const seeded=s=>{let a=(s*9301+49297)%233280||1;return()=>{a=(a*9301+49297)%233280;return a/233280}};
/* le cercle d'encre : notre écriture, dans la manière des cercles du film (anneau au pinceau, renflements, éclaboussures, vrilles)
   f : liste de « traits » posés sur l'anneau : {a:angle, k:'blob'|'spike'|'tendril'|'splash'|'hook'|'gap', s:taille, d:+1 dehors / -1 dedans} */
function inkRing(x,cx,cy,r,o={}){const R=seeded(o.seed||7),col=o.col||'#141414',w0=(o.w||r*.085),f=o.f||[],a0=o.a0||0,gap=o.gap==null?.0:o.gap;
 x.save();x.fillStyle=col;x.strokeStyle=col;x.lineCap='round';x.lineJoin='round';
 // la bavure : un lavis très clair qui a coulé autour du trait
 if(o.wash!==false){x.save();x.globalAlpha=.07;for(let i=0;i<40;i++){const a=a0+R()*Math.PI*2,rr=r+(R()-.5)*w0*3;x.beginPath();x.ellipse(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,w0*(1+R()*2),w0*(.6+R()),a,0,7);x.fill()}x.restore()}
 const span=Math.PI*2-gap,N=Math.max(120,Math.round(r*2.2));
 const width=a=>{let w=w0*(.78+.22*Math.sin(a*3+R()*.01)+.12*Math.sin(a*7.3+1));f.forEach(t=>{if(t.k==='blob'||t.k==='splash'){const d=Math.atan2(Math.sin(a-t.a),Math.cos(a-t.a));w+=w0*(t.s||1)*1.3*Math.exp(-d*d/(.018*(t.s||1)))}});
  if(gap>0){const u=(a-a0)/span;w*=Math.min(1,u*6,(1-u)*6)}return Math.max(.5,w)};
 for(let i=0;i<=N;i++){const a=a0+span*i/N,w=width(a),j=(R()-.5)*w0*.18;x.beginPath();x.arc(cx+Math.cos(a)*(r+j),cy+Math.sin(a)*(r+j),w/2,0,7);x.fill()}
 // le grain du pinceau : quelques poils plus clairs dans le trait
 x.save();x.globalCompositeOperation='destination-out';x.globalAlpha=.25;x.lineWidth=1.2;for(let i=0;i<N*.4;i++){const a=a0+span*R(),w=width(a),o2=(R()-.5)*w*.7;x.beginPath();x.arc(cx,cy,r+o2,a,a+.05+R()*.12);x.stroke()}x.restore();
 const tip=(px,py,ang,len,wd)=>{x.beginPath();x.moveTo(px+Math.cos(ang+Math.PI/2)*wd/2,py+Math.sin(ang+Math.PI/2)*wd/2);x.quadraticCurveTo(px+Math.cos(ang)*len*.6,py+Math.sin(ang)*len*.6,px+Math.cos(ang)*len,py+Math.sin(ang)*len);x.quadraticCurveTo(px+Math.cos(ang)*len*.6,py+Math.sin(ang)*len*.6,px+Math.cos(ang-Math.PI/2)*wd/2,py+Math.sin(ang-Math.PI/2)*wd/2);x.fill()};
 f.forEach(t=>{const s=t.s||1,d=t.d||1,px=cx+Math.cos(t.a)*r,py=cy+Math.sin(t.a)*r,out=t.a+(d>0?0:Math.PI);
  if(t.k==='spike'||t.k==='splash'){const n=t.k==='splash'?7:3;for(let k=0;k<n;k++){const ang=out+(R()-.5)*(t.k==='splash'?1.6:.7),len=r*(.08+R()*.22)*s;tip(px,py,ang,len,w0*(.5+R()*.5));if(R()<.7){const dl=len*(1.15+R()*.4);x.beginPath();x.arc(px+Math.cos(ang)*dl,py+Math.sin(ang)*dl,w0*(.12+R()*.25),0,7);x.fill()}}}
  if(t.k==='tendril'){x.lineWidth=w0*.28;let qx=px,qy=py,ang=out;x.beginPath();x.moveTo(qx,qy);for(let k=0;k<14;k++){ang+=(R()-.5)*.5+(t.c||0);qx+=Math.cos(ang)*r*.03*s;qy+=Math.sin(ang)*r*.03*s;x.lineTo(qx,qy)}x.stroke();x.beginPath();x.arc(qx,qy,w0*.22,0,7);x.fill()}
  if(t.k==='hook'){x.lineWidth=w0*.55;const tg=t.a+Math.PI/2*(t.c||1);x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(out)*r*.18*s,py+Math.sin(out)*r*.18*s,px+Math.cos(out)*r*.16*s+Math.cos(tg)*r*.12*s,py+Math.sin(out)*r*.16*s+Math.sin(tg)*r*.12*s);x.stroke()}
  if(t.k==='blob'){for(let k=0;k<3;k++){const ang=out+(R()-.5)*1.2,dl=w0*(1.2+R()*1.6)*s;x.beginPath();x.arc(px+Math.cos(ang)*dl,py+Math.sin(ang)*dl,w0*(.1+R()*.2),0,7);x.fill()}}});
 // quelques gouttes perdues
 for(let i=0;i<(o.drops==null?10:o.drops);i++){const a=R()*Math.PI*2,dl=r+(R()<.5?-1:1)*w0*(1.5+R()*4);x.beginPath();x.arc(cx+Math.cos(a)*dl,cy+Math.sin(a)*dl,w0*(.05+R()*.14),0,7);x.fill()}
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
// le lac (il remplace la mer de la boîte de référence : mêmes noms)
const SEA={x:-2.85,z:2.75};
const COAST=[...Array(40)].map((_,i)=>{const a=i/40*Math.PI*2,k=1+.09*Math.sin(a*3+.7)+.06*Math.sin(a*5+2.1);return[SEA.x+Math.cos(a)*2.05*k,SEA.z+Math.sin(a)*1.32*k]});
const COASTC=[...COAST,COAST[0]];
const inSea=(x,z,m=0)=>pip(x,z,COAST)||(m>0&&segD(x,z,COASTC)<m);
// le ruisseau qui descend des montagnes jusqu'au lac (même rôle que le Nil : on le traverse sur un pont)
const NILE=new THREE.CatmullRomCurve3([[-1.55,-4.9],[-1.95,-3.4],[-1.5,-1.9],[-1.95,-.5],[-2.45,.6],[-2.55,1.6]].map(([a,b])=>new THREE.Vector3(a,0,b)));
const DAMIETTA=[];
// les quatre lieux, dans l'ordre du récit : l'université, le camp, la coquille, la maison du lac
const PLACES=[[3.2,3.0],[3.75,-1.05],[-.15,-2.55],[-4.25,.15]];
const SPOTS=[[2.05,2.3],[2.45,-.45],[-.15,-1.0],[-3.05,.55]].map(([x,z])=>new THREE.Vector3(x,TOP,z));
const LIB=[4.45,.75];                                   // la grande tente des opérations, à côté du camp
const START=new THREE.Vector3(.35,TOP,1.55);
// le cinquième lieu, débloqué à la fin : la salle des enregistrements de l'université, aujourd'hui
const BAPOS=[.85,4.45],SPOT5=new THREE.Vector3(1.05,TOP,3.55);
const ROUTE=[[.35,1.55],[1.3,1.95],[2.05,2.3],[2.75,1.35],[2.7,.3],[2.45,-.45],[1.6,-.75],[.6,-.9],[-.15,-1.0],[-1.15,-.65],[-2.15,-.1],[-3.05,.55],[-2.05,1.05],[-.6,1.55],[.3,2.6],[1.05,3.55]];
const ROUTE2=[[5.75,-1.3],[4.9,-1.35],[4.2,-.6],[3.3,-.35],[2.45,-.45]];   // la piste des camions, depuis le bord de la boîte
const ROUTE0=[[2.05,2.3],[2.45,2.75]];
const GS=LOW?1536:2048,gx=v=>(v/(2*A)+.5)*GS,gz=v=>(v/(2*C)+.5)*GS;
const NILEP=[...Array(41)].map((_,i)=>{const p=NILE.getPoint(i/40);return[p.x,p.z]});
const ROUTEC=new THREE.CatmullRomCurve3(ROUTE.map(([a,b])=>new THREE.Vector3(a,0,b)));const ROUTES=[ROUTE,ROUTE2,ROUTE0].map(R=>new THREE.CatmullRomCurve3(R.map(([a,b])=>new THREE.Vector3(a,0,b))));
const ROUTEPS=ROUTES.map(c=>[...Array(81)].map((_,i)=>{const p=c.getPoint(i/80);return[p.x,p.z]}));const ROUTEP=ROUTEPS[0];const routeD=(x,z)=>Math.min(...ROUTEPS.map(P=>segD(x,z,P)));
const freeSpot=(x,z,m=.45)=>Math.hypot(x,z)<RB-.55&&!inSea(x,z,.35)&&routeD(x,z)>m&&segD(x,z,NILEP)>.4&&PLACES.every(([a,b])=>Math.hypot(x-a,z-b)>1.3)&&Math.hypot(x-LIB[0],z-LIB[1])>.9&&Math.hypot(x-BAPOS[0],z-BAPOS[1])>1.0&&Math.hypot(x-SPOT5.x,z-SPOT5.z)>.6&&Math.hypot(x-START.x,z-START.z)>.8&&z>-4.1;
const OBSTL=[[...PLACES[0],.95],[...PLACES[1],.9],[PLACES[2][0],PLACES[2][1]-.1,.75],[...PLACES[3],.8],[...LIB,.62],[...BAPOS,.62]];
const groundTex=canvasTex(GS,GS,(x,W)=>{
  // prairie pâle, plus sombre au pied des montagnes
  let g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'#7f8c74');g.addColorStop(.35,'#93a17f');g.addColorStop(1,'#a4ad8e');x.fillStyle=g;x.fillRect(0,0,W,W);
  for(let i=0;i<14000;i++){const cx=rnd(0,W),cy=rnd(0,W);dab(x,cx,cy,rnd(14,34),rnd(5,10),rnd(-.6,.6),rnd(70,105),rnd(12,26),rnd(46,66),rnd(.22,.42))}
  for(let i=0;i<70;i++)blob(x,rnd(0,W),rnd(0,W),rnd(90,240),Math.random()<.5?'rgba(214,206,170,.22)':'rgba(70,90,70,.2)');
  // herbes sèches, en mèches couchées par le vent
  for(let i=0;i<5000;i++){const cx=rnd(0,W),cy=rnd(0,W);x.strokeStyle=hsl(rnd(48,75),rnd(14,28),rnd(62,78),rnd(.25,.5));x.lineWidth=rnd(1,2);x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+rnd(6,14),cy-rnd(2,8));x.stroke()}
  // le lac : ardoise bleutée, plus claire au bord, des reflets de ciel
  const coastPath=()=>{x.beginPath();COAST.forEach(([u,v],i)=>i?x.lineTo(gx(u),gz(v)):x.moveTo(gx(u),gz(v)));x.closePath()};
  x.save();coastPath();x.clip();x.fillStyle='#6a7a84';x.fillRect(0,0,W,W);
  for(let i=0;i<1600;i++)dab(x,rnd(0,W),rnd(0,W),rnd(30,70),rnd(4,8),rnd(-.06,.06),rnd(200,215),rnd(8,18),rnd(50,66),rnd(.2,.4));
  [[90,'rgba(120,140,150,.45)'],[44,'rgba(160,176,180,.55)'],[16,'rgba(206,214,210,.8)']].forEach(([lw,col])=>{x.strokeStyle=col;x.lineWidth=lw;x.lineJoin='round';coastPath();x.stroke()});
  for(let i=0;i<70;i++){x.strokeStyle=`rgba(230,236,236,${rnd(.15,.4)})`;x.lineWidth=rnd(1.5,3);const a=rnd(0,W),b=rnd(0,W),l=rnd(20,70);x.beginPath();x.moveTo(a,b);x.lineTo(a+l,b);x.stroke()}x.restore();
  // une grève de galets clairs tout autour
  for(let k=0;k<COAST.length;k++){const[ax,az]=COAST[k],[bx,bz]=COAST[(k+1)%COAST.length],L=Math.hypot(bx-ax,bz-az),n=Math.ceil(L*70);for(let s=0;s<n;s++){const t=Math.random(),ox=rnd(-6,6),oy=rnd(-6,6);x.fillStyle=hsl(rnd(30,60),rnd(4,12),rnd(66,84),.8);x.beginPath();x.ellipse(gx(ax+(bx-ax)*t)+ox,gz(az+(bz-az)*t)+oy,rnd(2,5),rnd(1.5,3.5),rnd(0,3),0,7);x.fill()}}
  // le ruisseau
  for(let i=0;i<=320;i++){const p=NILE.getPoint(i/320);for(let k=0;k<3;k++)dab(x,gx(p.x+rnd(-.22,.22)),gz(p.z+rnd(-.06,.06)),rnd(16,26),rnd(7,11),rnd(-.6,.6),rnd(70,100),rnd(15,25),rnd(36,46),rnd(.35,.5));
    dab(x,gx(p.x),gz(p.z),rnd(18,26),rnd(10,14),rnd(-.4,.4),rnd(200,212),18,rnd(44,56),.9);if(i%3===0){x.fillStyle='rgba(230,236,236,.5)';x.fillRect(gx(p.x)+rnd(-4,2),gz(p.z)+rnd(-4,4),rnd(4,9),1.6)}}
  // pistes de terre : le chemin de l'histoire, et la piste des camions
  ROUTES.forEach((RC,ri)=>{for(let i=0;i<=900;i++){const p=RC.getPoint(i/900),t=RC.getTangent(i/900);for(let k=0;k<2;k++){const o=rnd(-.17,.17);dab(x,gx(p.x-t.z*o),gz(p.z+t.x*o),rnd(14,22),rnd(9,13),Math.atan2(t.z,t.x)+rnd(-.3,.3),rnd(35,45),rnd(10,20),rnd(70,80),rnd(.5,.75))}}
   if(ri===1)[-1,1].forEach(sd=>{x.strokeStyle='rgba(110,96,76,.45)';x.lineWidth=3;x.beginPath();for(let i=0;i<=120;i++){const p=RC.getPoint(i/120),t=RC.getTangent(i/120);const X=gx(p.x-t.z*.07*sd),Z=gz(p.z+t.x*.07*sd);i?x.lineTo(X,Z):x.moveTo(X,Z)}x.stroke()})});
  // le camp : une terre piétinée, du gravier
  blob(x,gx(3.9),gz(-.4),gx(1.9)-gx(0),'rgba(200,192,170,.55)');for(let i=0;i<900;i++){const a=rnd(0,6.3),r=rnd(0,1.6);x.fillStyle=hsl(rnd(30,50),rnd(5,14),rnd(55,78),.7);x.fillRect(gx(3.9+Math.cos(a)*r),gz(-.4+Math.sin(a)*r*.8),2,2)}
  // fleurs des champs, rares et pâles
  for(let i=0;i<900;i++){const px=rnd(-6,6),pz=rnd(-6,6);if(!freeSpot(px,pz,.3))continue;x.fillStyle=[hsl(50,60,80,.9),hsl(0,0,96,.9),hsl(270,25,74,.9)][i%3];x.beginPath();x.arc(gx(px),gz(pz),rnd(2,3.4),0,7);x.fill()}
  // la brume posée sur l'herbe
  for(let i=0;i<40;i++)blob(x,rnd(0,W),rnd(0,W*.7),rnd(120,300),'rgba(236,234,226,.16)');
  // ombres sous les lieux, et sous la coquille qui flotte
  PLACES.forEach(([a,b],i)=>blob(x,gx(a)+30,gz(b)+26,i===2?230:170,i===2?'rgba(30,34,38,.4)':'rgba(40,50,40,.25)'));
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
 const crest=cutMat((x,W,H)=>{x.fillStyle='#5f7280';x.beginPath();x.moveTo(8,H-8);x.quadraticCurveTo(W*.3,H*.35,W*.55,H*.45);x.quadraticCurveTo(W*.75,H*.45,W-8,H-8);x.closePath();x.fill();x.fillStyle='rgba(214,222,222,.95)';x.beginPath();x.moveTo(W*.2,H*.7);x.quadraticCurveTo(W*.35,H*.42,W*.55,H*.45);x.quadraticCurveTo(W*.38,H*.5,W*.3,H*.72);x.closePath();x.fill()},256,128);
 WATER.waves=[];let tries=0;while(WATER.waves.length<7&&tries<600){tries++;const x0=rnd(SEA.x-1.7,SEA.x+1.7),z0=rnd(SEA.z-1,SEA.z+1);if(!pip(x0,z0,COAST)||segD(x0,z0,COASTC)<.4||WATER.waves.some(m=>Math.hypot(m.userData.x-x0,m.position.z-z0)<.9))continue;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(.36,.16),crest);m.customDepthMaterial=crest.userData.depth;m.castShadow=true;m.position.set(x0,TOP-SEAD+.08,z0);m.rotation.y=rnd(-.35,.35);m.userData={x:x0,row:WATER.waves.length};box.add(m);WATER.waves.push(m)}}

const shellCount=box.children.length;
/* ---------- les décors des lieux ---------- */
const deco=new THREE.Group();box.add(deco);
const put=(o,x,z,y=TOP)=>{o.position.set(x,y,z);deco.add(o);return o};
// ---- des découpes de carton croisées, comme dans un livre pop-up
const CROSS=(()=>{const g=new THREE.BufferGeometry();const P=[-1,-1,0, 1,-1,0, 1,1,0, -1,1,0, 0,-1,-1, 0,-1,1, 0,1,1, 0,1,-1],U=[0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1],N=[0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0];
 g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);return g})();
function cutMat(draw,W=256,H=256,edge='#fbf5e6'){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const s=document.createElement('canvas');s.width=W;s.height=H;const sx=s.getContext('2d');draw(sx,W,H);
 if(edge){const w=document.createElement('canvas');w.width=W;w.height=H;const wx=w.getContext('2d');wx.drawImage(s,0,0);wx.globalCompositeOperation='source-in';wx.fillStyle=edge;wx.fillRect(0,0,W,H);
 for(let k=0;k<16;k++){const a=k/16*Math.PI*2;x.drawImage(w,Math.cos(a)*5,Math.sin(a)*5)}}x.drawImage(s,0,0);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;
 const m=new THREE.MeshStandardMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,roughness:.95,metalness:0,bumpMap:FIB,bumpScale:.008});
 m.userData.depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});return m}
const cutMesh=(m)=>{const o=new THREE.Mesh(CROSS,m);o.castShadow=true;o.receiveShadow=true;o.customDepthMaterial=m.userData.depth;return o};
const blobs=(x,pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach(([a,b,r])=>{x.moveTo(a+r,b);x.arc(a,b,r,0,7)});x.fill()};
const flatCut=(m,w,h)=>{const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.castShadow=true;o.receiveShadow=true;o.customDepthMaterial=m.userData.depth;return o};
M.white=plastic('#f3f0e6');M.cream=plastic('#efe8d6');M.slate=plastic('#3e4247');M.slate2=plastic('#4a4f55');M.slateL=plastic('#5c6268');M.olive=plastic('#6d7254');M.wood=plastic('#8a6a4a');M.woodL=plastic('#b08a62');M.brick=plastic('#9a5a44');M.glass=new THREE.MeshStandardMaterial({color:new THREE.Color('#fff1d0').convertSRGBToLinear(),emissive:new THREE.Color('#ffb85e'),emissiveIntensity:.85,roughness:.9});
M.skin=plastic('#e8c0a0');M.marbleP=M.cream;M.black=plastic('#26282c');M.red=plastic('#a84a2a');M.stone=plastic('#a9aaa6');M.sandC=plastic('#cfc6ae');
const box3=(w,h,d,m,x=0,y=0,z=0)=>at(mesh(new THREE.BoxGeometry(w,h,d),m),x,y+h/2,z);
// 1. l'université : un bâtiment de brique à colonnes, fenêtres allumées
{const g=new THREE.Group();
 const brickT=canvasTex(256,128,(x,W,H)=>{x.fillStyle='#9a5a44';x.fillRect(0,0,W,H);for(let r=0;r<H;r+=10){x.fillStyle='rgba(240,220,200,.35)';x.fillRect(0,r,W,1.5);for(let u=(r/10%2)*12;u<W;u+=24)x.fillRect(u,r,1.5,10)}for(let i=0;i<300;i++){x.fillStyle=`rgba(${Math.random()<.5?'60,30,20':'200,140,110'},.15)`;x.fillRect(rnd(0,W),rnd(0,H),rnd(4,12),rnd(3,8))}},true);brickT.repeat.set(2,1);
 const bm=new THREE.MeshStandardMaterial({map:brickT,roughness:.95,bumpMap:FIB,bumpScale:.01});
 g.add(box3(1.7,.62,.75,bm,0,0,0));g.add(box3(.6,.85,.62,bm,0,0,.02));
 const rf=new THREE.Shape();rf.moveTo(-.95,0);rf.lineTo(.95,0);rf.lineTo(0,.32);rf.closePath();const rg=new THREE.ExtrudeGeometry(rf,{depth:.85,bevelEnabled:false});rg.translate(0,0,-.425);g.add(at(mesh(rg,M.slate2),0,.62,0));
 const rp=new THREE.Shape();rp.moveTo(-.38,0);rp.lineTo(.38,0);rp.lineTo(0,.24);rp.closePath();const rpg=new THREE.ExtrudeGeometry(rp,{depth:.76,bevelEnabled:false});rpg.translate(0,0,-.32);g.add(at(mesh(rpg,M.slate),0,.85,.12));
 // le porche : colonnes blanches, fronton, marches
 [-.27,-.09,.09,.27].forEach(px=>g.add(at(mesh(new THREE.CylinderGeometry(.03,.034,.52,10),M.white),px,.3,.47)));g.add(box3(.7,.06,.16,M.white,0,.56,.46));
 [0,1,2].forEach(k=>g.add(box3(.7-k*.06,.035,.12,M.cream,0,k*.035,.6-k*.06)));
 // fenêtres allumées, sur deux rangs
 for(let r=0;r<2;r++)for(let c=-2;c<=2;c++){if(c===0)continue;g.add(at(mesh(new THREE.BoxGeometry(.13,.16,.02),M.glass,false,false),c*.32,.18+r*.24,.385))}
 g.add(at(mesh(new THREE.BoxGeometry(.16,.18,.02),M.glass,false,false),0,.62,.335));
 // une horloge ronde au fronton
 g.add(at(mesh(new THREE.CylinderGeometry(.07,.07,.02,20),M.cream),0,.98,.43));g.children[g.children.length-1].rotation.x=Math.PI/2;
 g.rotation.y=-.45;put(g,...PLACES[0])}
// 2. le camp : tentes de papier plié, camions, mât d'éclairage, le tableau blanc « HUMAIN »
let pharosFire,pharosLight;const BEAM={};
{const g=new THREE.Group();
 const tent=(w,l,h)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth:l,bevelEnabled:false});geo.translate(0,0,-l/2);return mesh(geo,M.white)};
 [[-.5,-.35,.3],[.15,-.55,.1],[-.6,.35,-.25],[.5,.45,.6]].forEach(([x,z,r],i)=>{const t=tent(.46,.62,.34);t.position.set(x,0,z);t.rotation.y=r;g.add(t);const dr=mesh(new THREE.PlaneGeometry(.16,.2),M.slate,false,false);dr.position.set(x+Math.sin(r)*.311,.1,z+Math.cos(r)*.311);dr.rotation.y=r;g.add(dr)});
 // deux camions bâchés
 [[.05,.95,.2],[.62,-.2,1.4]].forEach(([x,z,r])=>{const c=new THREE.Group();c.add(box3(.3,.22,.2,M.olive,-.05,.06,0));c.add(box3(.14,.16,.2,M.olive,.2,.06,0));c.add(box3(.04,.08,.18,M.glass,.27,.13,0));[-.12,.06,.2].forEach(wx=>[-1,1].forEach(k=>{const w=mesh(new THREE.CylinderGeometry(.045,.045,.03,12),M.black);w.rotation.x=Math.PI/2;w.position.set(wx,.045,k*.11);c.add(w)}));c.position.set(x,0,z);c.rotation.y=r;g.add(c)});
 // le mât d'éclairage : sa lampe chaude, comme un phare
 g.add(at(mesh(new THREE.CylinderGeometry(.012,.018,1.25,6),M.slate),-.05,.62,.05));g.add(box3(.2,.06,.06,M.slate,-.05,1.24,.05));
 pharosFire=mesh(new THREE.BoxGeometry(.16,.07,.05),new THREE.MeshBasicMaterial({color:'#ffd9a0'}),false,false);pharosFire.position.set(-.05,1.25,.09);g.add(pharosFire);
 pharosLight=new THREE.PointLight(0xffc880,.9,4.5,2);pharosLight.position.set(-.05,1.2,.25);g.add(pharosLight);
 // le tableau blanc, sur son chevalet
 {const wt=canvasTex(256,160,(x,W,H)=>{x.fillStyle='#f6f4ee';x.fillRect(0,0,W,H);x.strokeStyle='#8a8a8a';x.lineWidth=6;x.strokeRect(3,3,W-6,H-6);x.fillStyle='#1d2a66';x.font='700 58px Georgia, serif';x.textAlign='center';x.fillText('HUMAIN',W/2,H/2+20)});
  const wb=mesh(new THREE.PlaneGeometry(.42,.26),new THREE.MeshStandardMaterial({map:wt,roughness:.6}),true,false);wb.position.set(-.85,.42,-.05);wb.rotation.y=-.9;g.add(wb);
  [-1,1].forEach(k=>{const l=mesh(new THREE.CylinderGeometry(.008,.008,.5,5),M.wood);l.position.set(-.85+Math.cos(-.9)*k*.17,.25,-.05-Math.sin(-.9)*k*.17);g.add(l)})}
 g.rotation.y=.15;put(g,...PLACES[1])}
// la grande tente des opérations, demi-cylindre blanc, avec son antenne
{const g=new THREE.Group();const t=mesh(new THREE.CylinderGeometry(.42,.42,.95,24,1,false,0,Math.PI),M.white);t.rotation.z=Math.PI/2;t.rotation.y=Math.PI/2;t.position.y=0;g.add(t);
 g.add(at(mesh(new THREE.CylinderGeometry(.01,.01,.6,5),M.slate),.35,.55,-.3));const dish=mesh(new THREE.SphereGeometry(.16,16,8,0,Math.PI*2,0,Math.PI*.35),M.cream);dish.rotation.x=-1.1;dish.position.set(.35,.85,-.28);g.add(dish);
 g.rotation.y=.4;put(g,...LIB)}
// 3. la coquille : un galet immense en tranches de carton ardoise empilées, qui flotte au-dessus de l'herbe
const SHELL={};
{const g=new THREE.Group();const H=3.9,N=48,lift=.7;
 for(let i=0;i<N;i++){const t=(i+.5)/N,prof=Math.sin(Math.PI*Math.pow(t,.92)),r=.62*Math.pow(prof,.8)+.02;const s=mesh(new THREE.CylinderGeometry(r*.72,r*.72,H/N*.96,48),i%4===0?M.slate2:M.slate);s.scale.z=.5;s.position.y=lift+t*H;g.add(s)}
 // une fine bande de brume autour de son pied
 SHELL.g=g;g.rotation.y=.25;put(g,...PLACES[2]);
 // la plate-forme élévatrice, sous le ventre de la coquille
 const pl=new THREE.Group();pl.add(box3(.42,.04,.42,M.white,0,.18,0));[-1,1].forEach(k=>{const b=mesh(new THREE.BoxGeometry(.5,.02,.03),M.slateL);b.rotation.z=k*.35;b.position.set(0,.09,k*.17);pl.add(b)});pl.add(box3(.46,.04,.46,M.slateL,0,0,0));
 put(pl,PLACES[2][0]+.1,PLACES[2][1]+.55)}
// 4. la maison du lac : murs pâles, grande baie vitrée allumée, terrasse de bois, ponton sur l'eau
{const g=new THREE.Group();
 g.add(box3(1.0,.42,.6,M.cream,0,0,0));g.add(box3(1.18,.05,.78,M.slate,0,.42,0));g.add(box3(.5,.3,.5,M.cream,-.25,.47,-.04));g.add(box3(.62,.04,.6,M.slate,-.25,.77,-.04));
 g.add(at(mesh(new THREE.BoxGeometry(.8,.3,.02),M.glass,false,false),.05,.2,.305));g.add(at(mesh(new THREE.BoxGeometry(.36,.18,.02),M.glass,false,false),-.25,.58,.215));
 [-.35,-.05,.25].forEach(px=>g.add(box3(.015,.32,.015,M.slate,px,0,.31)));
 g.add(box3(1.2,.04,.4,M.woodL,0,0,.5));
 g.rotation.y=.55;put(g,...PLACES[3]);
 // le ponton, qui avance dans le lac
 const d=new THREE.Group();d.add(box3(.26,.03,1.15,M.woodL,0,.05,0));for(let k=0;k<9;k++)d.add(box3(.27,.006,.02,M.wood,0,.081,-.52+k*.13));[[-.12,-.5],[.12,-.5],[-.12,.5],[.12,.5]].forEach(([px,pz])=>d.add(at(mesh(new THREE.CylinderGeometry(.02,.02,.18,6),M.wood),px,.02,pz)));
 d.rotation.y=.35;put(d,-3.75,1.45,TOP-.03)}
// 5. (aujourd'hui) la salle des enregistrements : construite dans X_ia
/* ---------- montagnes, sapins, rochers, brume ---------- */
const scatter=(n,m,fn)=>{const pts=[];let tries=0;while(pts.length<n&&tries<n*40){tries++;const x=rnd(-A,A),z=rnd(-C,C);if(freeSpot(x,z,m)&&pts.every(([a,b])=>Math.hypot(a-x,b-z)>.32))pts.push([x,z])}pts.forEach(([x,z],i)=>fn(x,z,i))};
const inst=(geo,mat,list,cast=true)=>{const im=new THREE.InstancedMesh(geo,mat,list.length);im.castShadow=cast;im.receiveShadow=false;const d=new THREE.Object3D();list.forEach((t,i)=>{d.position.set(t[0],t[1],t[2]);d.rotation.set(0,t[4]||0,0);d.scale.set(t[3],t[5]||t[3],t[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});box.add(im);return im};
const CUT={
 pine:cutMat((x)=>{x.fillStyle='#5a4632';x.fillRect(122,200,12,54);const f=(col,dx)=>{x.fillStyle=col;x.beginPath();x.moveTo(128,4);for(let k=0;k<5;k++){const y=40+k*40,w=26+k*20;x.lineTo(128+w+dx,y+14);x.lineTo(128+w*.45,y+4)}x.lineTo(128,214);x.closePath();x.fill()};f('#43544a',0);
   x.save();x.globalCompositeOperation='source-atop';x.fillStyle='#34433b';x.fillRect(128,0,128,256);x.restore();x.fillStyle='#43544a';x.beginPath();x.moveTo(128,4);for(let k=0;k<5;k++){const y=40+k*40,w=26+k*20;x.lineTo(128-w,y+14);x.lineTo(128-w*.45,y+4)}x.lineTo(128,214);x.closePath();x.fill()}),
 pine2:cutMat((x)=>{x.fillStyle='#5a4632';x.fillRect(123,200,10,54);x.fillStyle='#55665a';x.beginPath();x.moveTo(128,8);for(let k=0;k<4;k++){const y=50+k*44,w=30+k*20;x.lineTo(128+w,y+18);x.lineTo(128+w*.4,y+6)}x.lineTo(128,214);for(let k=3;k>=0;k--){const y=50+k*44,w=30+k*20;x.lineTo(128-w*.4,y+6);x.lineTo(128-w,y+18)}x.closePath();x.fill();x.fillStyle='rgba(30,40,34,.3)';x.fillRect(128,0,128,214)}),
 grass:cutMat((x)=>{x.strokeStyle='#8e9a6c';x.lineWidth=7;x.lineCap='round';for(let k=-5;k<=5;k++){x.beginPath();x.moveTo(128+k*8,250);x.quadraticCurveTo(128+k*12,170,128+k*22+rnd(-10,10),rnd(90,140));x.stroke()}x.strokeStyle='#b8b88a';x.lineWidth=4;for(let k=-4;k<=4;k+=2){x.beginPath();x.moveTo(128+k*8,250);x.quadraticCurveTo(128+k*10,190,128+k*16,rnd(130,170));x.stroke()}}),
 birch:cutMat((x)=>{x.fillStyle='#e8e4d8';x.fillRect(120,110,16,146);x.fillStyle='#2a2a2a';for(let i=0;i<8;i++)x.fillRect(120+(i%2)*6,124+i*16,rnd(6,10),3);blobs(x,[[128,80,52],[86,104,38],[170,100,40],[108,54,34],[152,58,34]],'#9aa66a');blobs(x,[[150,86,26],[96,112,20]],'#848f5a')})};
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
 [[-1.2,-3.2,.5,3.2],[1.8,-3.0,.4,2.6],[-.2,-2.4,.32,2.2],[-3.4,-1.6,.3,2.2],[3.0,1.0,.22,1.8]].forEach(([x,z,y,s],i)=>{const o=new THREE.Mesh(new THREE.PlaneGeometry(s,s*.6),mm);o.rotation.x=-Math.PI/2;o.position.set(x,TOP+y,z);o.userData={x,ph:i*2.3};o.renderOrder=3;box.add(o);CLOUDS.push(o)})}
{const pines=[],pines2=[],grass=[],rocks=[],birch=[];
 // forêts : au pied des montagnes, autour du lac, et quelques sapins isolés
 for(let i=0;i<260;i++){const a=rnd(-Math.PI*.98,-Math.PI*.02),r=rnd(3.9,5.3),x=Math.cos(a)*r,z=Math.sin(a)*r;if(!freeSpot(x,z,.35)&&z>-4.1)continue;if(inSea(x,z,.3)||segD(x,z,NILEP)<.3||PLACES.some(([p,q])=>Math.hypot(x-p,z-q)<1.2)||Math.hypot(x-LIB[0],z-LIB[1])<.8)continue;if(pines.concat(pines2).some(t=>Math.hypot(t[0]-x,t[2]-z)<.26))continue;const s=rnd(.85,1.25);(i%3?pines:pines2).push([x,TOP+.3*s,z,.2*s,0,.3*s])}
 scatter(26,.45,(x,z,i)=>{const s=rnd(.9,1.3);(i%2?pines:pines2).push([x,TOP+.3*s,z,.2*s,0,.3*s]);OBSTL.push([x,z,.2])});
 scatter(8,.5,(x,z)=>{birch.push([x,TOP+.36,z,.24,0,.36]);OBSTL.push([x,z,.2])});
 scatter(60,.3,(x,z)=>grass.push([x,TOP+.08,z,.1,0,.08]));
 scatter(22,.4,(x,z)=>rocks.push([x,TOP+.04,z,rnd(.08,.16),rnd(0,6),rnd(.06,.11)]));
 [[CUT.pine,pines],[CUT.pine2,pines2],[CUT.grass,grass],[CUT.birch,birch]].forEach(([m,l])=>{if(!l.length)return;const im=inst(CROSS,m,l);im.customDepthMaterial=m.userData.depth});
 inst((()=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position,map={};for(let i=0;i<p.count;i++){const k=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(3)).join();const f=map[k]||(map[k]=rnd(.78,1.12));p.setXYZ(i,p.getX(i)*f,p.getY(i)*f,p.getZ(i)*f)}g.computeVertexNormals();return g})(),plastic('#b9bab4'),rocks)}
// une barque de papier sur le lac, et deux oiseaux de papier qui tournent au-dessus de la vallée
const BOATG=(()=>{const g=new THREE.BufferGeometry();const v=[-.12,0,0, .12,0,0, .27,.13,.07, -.27,.13,.07,  .12,0,0, -.12,0,0, -.27,.13,-.07, .27,.13,-.07,  -.13,.12,0, .13,.12,0, 0,.34,0,  -.27,.13,.07, -.12,0,0, -.27,.13,-.07,  .12,0,0, .27,.13,.07, .27,.13,-.07];
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,11,12,13,14,15,16]);g.computeVertexNormals();return g})();
const boats=[(()=>{const g=new THREE.Group();const m=mesh(BOATG,new THREE.MeshStandardMaterial({color:new THREE.Color('#e8e4d8').convertSRGBToLinear(),side:THREE.DoubleSide,flatShading:true,roughness:.95,bumpMap:FIB,bumpScale:.006}));m.scale.setScalar(1.5);m.castShadow=true;g.add(m);g.rotation.y=.8;put(g,-2.4,3.1,TOP-.04);return g})()];
const sheep=[];
{const cg=new THREE.BufferGeometry();const v=[0,0,-.16, 0,.02,.12, -.03,-.02,0, 0,0,-.16, 0,.02,.12, .03,-.02,0, 0,.02,.12, 0,.12,.2, .02,0,.05, 0,0,-.16, 0,.1,-.22, -.02,0,-.08];cg.setAttribute('position',new THREE.Float32BufferAttribute(v,3));cg.computeVertexNormals();
 const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.06, 0,0,.08, .22,.03,0],3));wg.computeVertexNormals();
 [['#2e3236',-.2,-2.6,1.4,3.2],['#3a3e42',-2.6,2.4,1.1,1.9]].forEach(([col,cx,cz,r,h],i)=>{const m=new THREE.MeshStandardMaterial({color:new THREE.Color(col).convertSRGBToLinear(),side:THREE.DoubleSide,flatShading:true,roughness:.95});
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
const MS=768,MEMC=document.createElement('canvas');MEMC.width=MEMC.height=MS;const mx=MEMC.getContext('2d');
const memTex=new THREE.CanvasTexture(MEMC);memTex.encoding=THREE.sRGBEncoding;memTex.generateMipmaps=false;memTex.minFilter=THREE.LinearFilter;memTex.anisotropy=renderer.capabilities.getMaxAnisotropy();
const SCRW=(RB+.2)*Math.SQRT2-.2;
const memGeo=new THREE.PlaneGeometry(SCRW,SCRW);memGeo.rotateX(Math.PI/2);
const memMesh=new THREE.Mesh(memGeo,new THREE.MeshBasicMaterial({map:memTex,transparent:true,depthWrite:false}));memMesh.position.y=-.16;memMesh.renderOrder=2;lid.add(memMesh);
const apexL=new THREE.Vector3(0,-.16,0);
// coordonnées écran → point 3D (pour les tests)
const canvasToWorld=(cx,cy)=>lid.localToWorld(new THREE.Vector3((cx/MS-.5)*SCRW,-.16,(.5-cy/MS)*SCRW));
