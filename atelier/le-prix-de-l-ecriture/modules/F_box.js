/* ---------- la boîte : une tête de poète antique en marbre, coupée au front, qui s'ouvre ---------- */
const A=6.3,C=5.6,TOP=.35,HB=3.1,LHT=2.9;           // demi-axes du plateau, hauteur du bas, hauteur du couvercle
const box=new THREE.Group();scene.add(box);
const marbleTex=canvasTex(1024,512,(x,W,H)=>{x.fillStyle='#f3e6cf';x.fillRect(0,0,W,H);
  for(let i=0;i<1500;i++)dab(x,rnd(0,W),rnd(0,H),rnd(20,50),rnd(8,16),rnd(-.4,.4),rnd(30,45),rnd(15,35),rnd(84,93),rnd(.2,.4));
  for(let k=0;k<26;k++){x.strokeStyle=`rgba(${rnd(150,190)|0},${rnd(140,170)|0},${rnd(150,180)|0},${rnd(.18,.4)})`;x.lineWidth=rnd(.8,2.2);let px=rnd(0,W),py=rnd(0,H);x.beginPath();x.moveTo(px,py);for(let s=0;s<14;s++){px+=rnd(-14,30);py+=rnd(-12,12);x.lineTo(px,py)}x.stroke()}});
const baseTex=canvasTex(1024,512,(x,W,H)=>{x.drawImage(marbleTex.image,0,0);
  // frise grecque (méandre) dorée sur fond turquoise, juste sous la coupe
  const y0=H*.5+30,bh=40;x.fillStyle='#2bb5b0';x.fillRect(0,y0,W,bh);x.strokeStyle='#ffd27a';x.lineWidth=4;x.lineJoin='miter';
  for(let u=0;u<W;u+=32){x.beginPath();x.moveTo(u+2,y0+bh-6);x.lineTo(u+2,y0+6);x.lineTo(u+24,y0+6);x.lineTo(u+24,y0+bh-12);x.lineTo(u+10,y0+bh-12);x.lineTo(u+10,y0+14);x.lineTo(u+17,y0+14);x.stroke()}
  x.fillStyle='#ffd27a';x.fillRect(0,y0-3,W,3);x.fillRect(0,y0+bh,W,3)});
M.marble=painted('#efe6d6',marbleTex,{roughness:.32,clearcoat:.9});M.base=painted('#efe6d6',baseTex,{roughness:.32,clearcoat:.9});
M.marbleP=plastic('#f6ead4',{roughness:.3,clearcoat:.9});M.marbleD=plastic('#dcc9aa',{roughness:.35});
M.turq=plastic('#2bb5b0');M.sandC=plastic('#e9c98a');M.terra=plastic('#d0714a',{roughness:.45});M.gold=plastic('#ffcf5a',{metalness:.4,roughness:.28});
M.stone=plastic('#b9adc9',{roughness:.55,clearcoat:.4});M.palmL=plastic('#4fb36a');M.olive=plastic('#8fae5a');M.trunk=plastic('#9a6a3a',{roughness:.5});
// la boîte : un grand rouleau de papyrus déplié — un plateau entre deux rouleaux, comme un livre antique qu'on ouvre
const rr=(w,h,r)=>{const sh=new THREE.Shape();sh.moveTo(-w+r,-h);sh.lineTo(w-r,-h);sh.quadraticCurveTo(w,-h,w,-h+r);sh.lineTo(w,h-r);sh.quadraticCurveTo(w,h,w-r,h);sh.lineTo(-w+r,h);sh.quadraticCurveTo(-w,h,-w,h-r);sh.lineTo(-w,-h+r);sh.quadraticCurveTo(-w,-h,-w+r,-h);return sh};
const RW=A-.6,RD=C+.35,RR=1.4;   // demi-largeur et demi-profondeur du plateau (entre les rouleaux)
GLOSS=!PAPER;M.goldS=PAPER?plastic('#b07a45'):plastic('#ffcf5a',{metalness:.4,roughness:.28});M.redS=plastic(PAPER?'#d8c39a':'#f0414f');M.turqS=plastic(PAPER?'#a84a2a':'#2bb5b0');
const ROPE=PAPER?(()=>{const t=canvasTex(128,32,(x,W,H)=>{x.fillStyle='#d6bf8e';x.fillRect(0,0,W,H);x.strokeStyle='#a88a5a';x.lineWidth=5;for(let u=-H;u<W+H;u+=14){x.beginPath();x.moveTo(u,0);x.lineTo(u+H,H);x.stroke()}x.strokeStyle='rgba(255,245,220,.6)';x.lineWidth=2;for(let u=-H+5;u<W+H;u+=14){x.beginPath();x.moveTo(u,0);x.lineTo(u+H,H);x.stroke()}},true);t.repeat.set(90,1);return new THREE.MeshStandardMaterial({map:t,roughness:.95,bumpMap:t,bumpScale:.02})})():null;
const KRAFT=PAPER?((base,stamp)=>canvasTex(512,512,(x,W)=>{x.fillStyle=base;x.fillRect(0,0,W,W);for(let i=0;i<9000;i++){x.fillStyle=Math.random()<.5?`rgba(255,240,210,${rnd(.05,.14)})`:`rgba(80,50,20,${rnd(.05,.12)})`;x.fillRect(rnd(0,W),rnd(0,W),rnd(1,4),rnd(.6,1.6))}
  for(let u=0;u<W;u+=9){x.fillStyle='rgba(90,60,25,.05)';x.fillRect(u,0,3,W)}
  if(stamp){x.save();x.translate(W*.72,W*.3);x.rotate(-.12);x.strokeStyle='rgba(150,40,30,.45)';x.fillStyle='rgba(150,40,30,.45)';x.lineWidth=4;x.strokeRect(-70,-34,140,68);x.font='700 30px Georgia,serif';x.textAlign='center';x.fillText('↑ HAUT ↑',0,10);x.restore();
   x.fillStyle='rgba(30,20,10,.4)';for(let i=0;i<28;i++)x.fillRect(60+i*5+(i%3)*2,W*.78,i%4?2:4,46)}})):null;
const CORR=PAPER?canvasTex(256,64,(x,W,H)=>{x.fillStyle='#c79c66';x.fillRect(0,0,W,H);x.fillStyle='#e2c79a';x.fillRect(0,0,W,8);x.fillRect(0,H-8,W,8);x.strokeStyle='#8a6232';x.lineWidth=3;x.beginPath();for(let u=0;u<=W;u+=2)x.lineTo(u,H/2+Math.sin(u*.25)*(H/2-12));x.stroke();x.fillStyle='rgba(60,35,10,.25)';x.fillRect(0,8,W,2);x.fillRect(0,H-10,W,2)},true):null;
if(PAPER){CORR.repeat.set(24,1);M.cbTop=new THREE.MeshStandardMaterial({map:KRAFT('#b9915c',true),roughness:.95,bumpMap:FIB,bumpScale:.01});M.cbSide=new THREE.MeshStandardMaterial({map:CORR,roughness:.95});
 const tube=canvasTex(512,128,(x,W,H)=>{x.drawImage(KRAFT('#c9a06a').image,0,0,W,H);x.strokeStyle='rgba(90,60,25,.45)';x.lineWidth=3;for(let u=-H;u<W+H;u+=90){x.beginPath();x.moveTo(u,0);x.lineTo(u+H*1.2,H);x.stroke()}x.strokeStyle='rgba(255,240,210,.35)';x.lineWidth=2;for(let u=-H+4;u<W+H;u+=90){x.beginPath();x.moveTo(u,0);x.lineTo(u+H*1.2,H);x.stroke()}},true);tube.repeat.set(1,3);M.tube=new THREE.MeshStandardMaterial({map:tube,roughness:.95,bumpMap:FIB,bumpScale:.01})}
M.papyrus=plastic(PAPER?'#c9a06a':'#ecd9a8',{roughness:.45,clearcoat:.7});M.papyrusD=plastic(PAPER?'#a8804e':'#c9ad74',{roughness:.5});M.wood=plastic(PAPER?'#8a5a34':'#6a3e22',{roughness:.4});
{const g=new THREE.ExtrudeGeometry(rr(RW+.15,RD,RR),PAPER?{depth:1.25,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,curveSegments:24}:{depth:1.1,bevelEnabled:true,bevelThickness:.15,bevelSize:.15,bevelSegments:4,curveSegments:24});g.rotateX(-Math.PI/2);const m=mesh(g,PAPER?[M.cbTop,M.cbSide]:M.papyrusD,true,true);m.position.y=TOP-1.45;box.add(m)}
{const g=new THREE.ExtrudeGeometry(rr(RW+.2,RD+.05,RR),{depth:.12,bevelEnabled:false,curveSegments:24});g.rotateX(-Math.PI/2);const m=mesh(g,M.turqS,false,true);m.position.y=TOP-.75;box.add(m)}
// les deux rouleaux, avec leurs poignées de bois et leurs embouts dorés
const spiralTex=canvasTex(256,256,(x,W)=>{x.fillStyle='#e8d29c';x.fillRect(0,0,W,W);x.strokeStyle='rgba(120,80,40,.6)';x.lineWidth=3;x.beginPath();for(let a=0;a<44;a+=.1){const r=a*2.8;x.lineTo(W/2+Math.cos(a)*r,W/2+Math.sin(a)*r)}x.stroke()});
M.spiral=painted('#e8d29c',spiralTex,{roughness:.5});
[-1,1].forEach(k=>{const x=k*(RW+.95),rl=new THREE.Group();rl.position.set(x,TOP-.45,0);box.add(rl);
  const cyl=mesh(new THREE.CylinderGeometry(.95,.95,2*RD+.1,48),PAPER?M.tube:M.papyrus);cyl.rotation.x=Math.PI/2;rl.add(cyl);
  for(let i=0;i<(PAPER?0:9);i++){const band=mesh(new THREE.TorusGeometry(.955,.012,6,48),M.papyrusD,false,false);band.position.z=-RD+.2+i*(2*RD-.4)/8;rl.add(band)}
  [-1,1].forEach(e=>{const d=mesh(new THREE.CircleGeometry(.94,48),M.spiral,false,false);d.position.z=e*(RD+.06);d.rotation.y=e>0?0:Math.PI;rl.add(d);
    const h=mesh(new THREE.CylinderGeometry(.22,.26,.7,20),M.wood);h.rotation.x=Math.PI/2;h.position.z=e*(RD+.4);rl.add(h);
    const cap=mesh(new THREE.SphereGeometry(.3,20,14),M.goldS);cap.position.z=e*(RD+.8);rl.add(cap)});
  const tie=mesh(new THREE.TorusGeometry(.98,.06,8,48),M.redS);tie.position.z=0;rl.add(tie)});
GLOSS=false;
// le plateau : une vraie carte de la Méditerranée orientale (longitude/latitude projetées), simplifiée mais juste
const LL=(lon,lat)=>[(lon-30.5)*.5,-(lat-32.8)*.58];
const COAST=[[17.5,32.3],[20.0,32.1],[21.5,32.9],[23.0,32.6],[24.2,32.0],[25.2,31.55],[27.2,31.35],[28.8,30.95],[29.9,31.2],[30.4,31.5],[31.0,31.6],[31.8,31.5],[32.3,31.25],[33.6,31.1],[34.3,31.35],[34.9,32.4],[35.1,33.1],[35.5,33.9],[35.9,34.9],[35.8,35.8],[36.2,36.6],[35.6,36.75],[34.6,36.8],[33.6,36.2],[32.5,36.2],[31.3,36.8],[30.6,36.85],[30.2,36.3],[29.2,36.3],[28.1,36.7],[27.4,37.1],[27.1,37.9],[26.6,38.5],[26.9,39.1],[26.2,39.6],[26.3,40.3],[25.6,40.85],[24.4,40.9],[23.8,40.7],[23.7,39.7],[24.3,38.8],[24.6,38.1],[24.6,37.75],[24.1,37.45],[23.3,37.15],[23.2,36.45],[22.5,36.4],[21.7,36.5],[20.5,36.9],[19.8,38.2],[19.6,39.4],[19.2,40.2],[17.5,40.6]].map(([a,b])=>{const[x,z]=LL(a,b);return[Math.max(-5.55,Math.min(5.55,x)),z]});
const COASTC=[...COAST,COAST[0]];
const SEA={x:-1.6,z:-1.2};
const pip=(x,z,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,zi]=P[i],[xj,zj]=P[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)c=!c}return c};
const segD=(px,pz,P)=>{let m=1e9;for(let i=0;i<P.length-1;i++){const[ax,az]=P[i],[bx,bz]=P[i+1],dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((px-ax)*dx+(pz-az)*dz)/(dx*dx+dz*dz||1)));m=Math.min(m,Math.hypot(px-ax-dx*t,pz-az-dz*t))}return m};
const inSea=(x,z,m=0)=>pip(x,z,COAST)||(m>0&&segD(x,z,COASTC)<m&&x>-5.5);
// le Nil, d'Assouan au Caire, puis la branche de Rosette ; la branche de Damiette est peinte à part
const NILE=new THREE.CatmullRomCurve3([[32.9,24.1],[32.65,25.7],[32.75,26.2],[31.9,26.6],[31.2,27.2],[30.75,28.1],[31.1,29.1],[31.25,30.05],[31.1,30.75],[30.9,31.5]].map(([a,b])=>{const[x,z]=LL(a,b);return new THREE.Vector3(x,0,z)}));
const DAMIETTA=[[31.25,30.05],[31.55,30.8],[31.85,31.45]].map(([a,b])=>LL(a,b));
// les quatre lieux, à leur vraie place, dans l'ordre de l'histoire (Göbekli Tepe, la Grèce, Thèbes, Alexandrie) : un théâtre grec, Göbekli Tepe en Anatolie, Thèbes d'Égypte (le palais de Thamus), Alexandrie
// les trois premiers dessinent un grand Δ (le Deltoton des Grecs, comme le delta du Nil) ; Alexandrie est sur son bord, comme au bord du vrai delta
const SPOTS=[[4.0,-2.3],[-4.3,-2.5],[1.75,3.85],[-.25,1.3]].map(([x,z])=>new THREE.Vector3(x,TOP,z));
const PLACES=[[4.6,-3.15],[-4.6,-3.4],[2.5,4.45],[-.35,.6]];const LIB=[-.95,1.5];
const START=new THREE.Vector3(2.3,TOP,-2.95);
// le cinquième lieu, débloqué à la fin : la nouvelle bibliothèque d'Alexandrie (2002)
const BAPOS=[-2.75,1.75],SPOT5=new THREE.Vector3(-2.0,TOP,2.45);
const ROUTE=[[-4.2,-4.35],[-3.5,-4.05],[-3.0,-4.95],[-1.5,-5.0],[-.8,-4.35],[.5,-3.4],[2.5,-2.9],[4.0,-2.3],[3.4,-1.5],[2.85,0.0],[2.35,1.05],[1.5,1.6],[1.05,2.3],[.6,2.75],[0,2.85],[-.45,2.35],[-.4,1.75],[-.25,1.3]];
const ROUTE2=[[1.05,2.3],[.85,2.55],[.75,2.75],[.95,3.25],[1.4,3.55],[1.75,3.85]];
const ROUTE0=[[-3.5,-4.05],[-3.65,-3.2],[-4.3,-2.5]];
const GS=LOW?1536:2048,gx=v=>(v/(2*A)+.5)*GS,gz=v=>(v/(2*C)+.5)*GS;
const NILEP=[...Array(31)].map((_,i)=>{const p=NILE.getPoint(i/30);return[p.x,p.z]});
const ROUTEC=new THREE.CatmullRomCurve3(ROUTE.map(([a,b])=>new THREE.Vector3(a,0,b)));const ROUTES=[ROUTE,ROUTE2,ROUTE0].map(R=>new THREE.CatmullRomCurve3(R.map(([a,b])=>new THREE.Vector3(a,0,b))));
const ROUTEPS=ROUTES.map(c=>[...Array(81)].map((_,i)=>{const p=c.getPoint(i/80);return[p.x,p.z]}));const ROUTEP=ROUTEPS[0];const routeD=(x,z)=>Math.min(...ROUTEPS.map(P=>segD(x,z,P)));
const freeSpot=(x,z,m=.45)=>(x/(A-.5))**2+(z/(C-.5))**2<1&&!inSea(x,z,.35)&&routeD(x,z)>m&&segD(x,z,NILEP)>.4&&segD(x,z,DAMIETTA)>.3&&PLACES.every(([a,b])=>Math.hypot(x-a,z-b)>1.35)&&Math.hypot(x-LIB[0],z-LIB[1])>.9&&Math.hypot(x-BAPOS[0],z-BAPOS[1])>1.0&&Math.hypot(x-SPOT5.x,z-SPOT5.z)>.6&&Math.hypot(x-START.x,z-START.z)>.8;
const groundTex=canvasTex(GS,GS,(x,W)=>{
  // prairie méditerranéenne : vert tendre, plus doré vers le sud
  let g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'#7fae52');g.addColorStop(.55,'#93b45a');g.addColorStop(1,'#a9b25e');x.fillStyle=g;x.fillRect(0,0,W,W);
  for(let i=0;i<14000;i++){const cx=rnd(0,W),cy=rnd(0,W);dab(x,cx,cy,rnd(14,34),rnd(5,10),rnd(-.6,.6),rnd(78,110),rnd(35,55),rnd(38,60),rnd(.22,.45))}
  for(let i=0;i<60;i++)blob(x,rnd(0,W),rnd(0,W),rnd(90,220),Math.random()<.5?'rgba(200,210,110,.25)':'rgba(60,110,60,.22)');
  // champs : blé doré en sillons, cultures vertes, vignes en rangs
  const field=(x0,z0,w,h,ang,kind)=>{x.save();x.translate(gx(x0),gz(z0));x.rotate(ang);const W2=w/(2*A)*W,H2=h/(2*C)*W;x.beginPath();x.rect(-W2/2,-H2/2,W2,H2);x.clip();
    if(kind==='ble'){x.fillStyle='#d9b85a';x.fillRect(-W2/2,-H2/2,W2,H2);for(let k=-H2/2;k<H2/2;k+=10){x.strokeStyle=`rgba(${rnd(170,200)|0},${rnd(130,150)|0},60,.6)`;x.lineWidth=4;x.beginPath();x.moveTo(-W2/2,k);x.lineTo(W2/2,k+rnd(-2,2));x.stroke()}}
    else if(kind==='vigne'){x.fillStyle='#a8a05a';x.fillRect(-W2/2,-H2/2,W2,H2);for(let k=-H2/2+8;k<H2/2;k+=16){for(let j=-W2/2;j<W2/2;j+=rnd(5,9))dab(x,j,k+rnd(-2,2),rnd(10,16),rnd(5,8),rnd(-.3,.3),rnd(85,115),rnd(35,55),rnd(28,40),rnd(.6,.9))}}
    else{x.fillStyle='#6fa64a';x.fillRect(-W2/2,-H2/2,W2,H2);for(let k=-H2/2;k<H2/2;k+=12){x.strokeStyle='rgba(60,120,50,.7)';x.lineWidth=5;x.beginPath();x.moveTo(-W2/2,k);x.lineTo(W2/2,k);x.stroke()}}
    for(let i=0;i<60;i++)dab(x,rnd(-W2/2,W2/2),rnd(-H2/2,H2/2),rnd(12,24),rnd(4,8),0,kind==='ble'?45:95,40,kind==='ble'?62:45,.3);x.restore();
    x.save();x.translate(gx(x0),gz(z0));x.rotate(ang);x.setLineDash([3,5]);x.strokeStyle='rgba(120,110,90,.8)';x.lineWidth=5;x.strokeRect(-W2/2,-H2/2,W2,H2);x.restore()};
  [[-4.6,-4.4,.8,.6,.2,'vigne'],[1.6,-4.1,1.2,.7,.1,'ble'],[3.4,-4.3,1.0,.6,-.2,'vert'],[-.2,-4.9,.9,.5,0,'vigne'],[3.9,-.5,.8,1.0,.1,'ble'],[4.4,1.6,.8,.6,0,'vigne'],[-.2,2.5,.5,.6,.1,'vert'],[1.35,2.6,.5,.5,0,'vert']].forEach(f=>field(...f));
  // déserts : la Libye et l'Égypte, dorées, sauf le long du Nil
  for(let i=0;i<5200;i++){const px=rnd(-6,6),pz=rnd(.4,6);if(inSea(px,pz))continue;const[lon,lat]=[px/.5+30.5,32.8-pz/.58];if(lat>31.35)continue;const dn=Math.min(segD(px,pz,NILEP),segD(px,pz,DAMIETTA));if(dn<.45)continue;
    dab(x,gx(px),gz(pz),rnd(18,40),rnd(8,14),rnd(-.4,.4),rnd(36,46),rnd(45,65),rnd(70,82),Math.min(.75,(dn-.45)*1.2))}
  // la mer : bleu profond au large, turquoise près des côtes
  const coastPath=()=>{x.beginPath();COAST.forEach(([u,v],i)=>i?x.lineTo(gx(u),gz(v)):x.moveTo(gx(u),gz(v)));x.closePath()};
  x.save();coastPath();x.clip();x.fillStyle='#1d5cae';x.fillRect(0,0,W,W);
  for(let i=0;i<2200;i++)dab(x,rnd(0,W),rnd(0,W),rnd(24,60),rnd(5,10),rnd(-.1,.1),rnd(195,215),rnd(60,80),rnd(40,64),rnd(.2,.4));
  [[150,'rgba(44,142,208,.55)'],[80,'rgba(76,196,208,.6)'],[34,'rgba(143,226,212,.85)']].forEach(([lw,col])=>{x.strokeStyle=col;x.lineWidth=lw;x.lineJoin='round';coastPath();x.stroke()});
  for(let i=0;i<160;i++){x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=2;const a=rnd(0,W),b=rnd(0,W);x.beginPath();x.arc(a,b,rnd(8,20),Math.PI*1.1,Math.PI*1.9);x.stroke()}x.restore();
  // plages de sable clair, le long de la vraie côte
  for(let k=0;k<COAST.length;k++){const[ax,az]=COAST[k],[bx,bz]=COAST[(k+1)%COAST.length],L=Math.hypot(bx-ax,bz-az),n=Math.ceil(L*60),ang=Math.atan2(bz-az,bx-ax);for(let s=0;s<n;s++){const t=Math.random();dab(x,gx(ax+(bx-ax)*t)+rnd(-4,4),gz(az+(bz-az)*t)+rnd(-4,4),rnd(16,28),rnd(6,10),ang,rnd(40,48),rnd(55,75),rnd(80,90),rnd(.4,.65))}}
  // le Nil : eau bleu-vert, rives luxuriantes, delta en éventail
  for(let i=0;i<=300;i++){const p=NILE.getPoint(i/300);for(let k=0;k<7;k++){const o=rnd(-.6,.6);dab(x,gx(p.x+o),gz(p.z+rnd(-.1,.1)),rnd(18,30),rnd(8,12),rnd(-.6,.6),rnd(95,130),rnd(45,60),rnd(32,46),rnd(.4,.6))}
    dab(x,gx(p.x),gz(p.z),rnd(22,32),rnd(16,22),rnd(-.4,.4),rnd(185,200),65,rnd(44,54),.85)}
  {const ap=LL(31.25,30.05),base=[LL(30.35,31.45),LL(30.9,31.55),LL(31.4,31.55),LL(31.85,31.5)];
   x.save();x.beginPath();x.moveTo(gx(ap[0]),gz(ap[1]));x.lineTo(...[LL(29.95,31.3)].map(([u,v])=>[gx(u),gz(v)])[0]);base.forEach(([u,v])=>x.lineTo(gx(u),gz(v)));x.lineTo(...[LL(32.3,31.3)].map(([u,v])=>[gx(u),gz(v)])[0]);x.closePath();x.clip();
   for(let i=0;i<700;i++){const u=rnd(-1,1.2),v=rnd(.5,1.8);dab(x,gx(u),gz(v),rnd(14,24),rnd(6,10),rnd(-.5,.5),rnd(88,120),rnd(45,60),rnd(34,48),.6)}x.restore();
   x.strokeStyle='rgba(60,150,190,.95)';x.lineCap='round';x.lineWidth=12;x.beginPath();DAMIETTA.forEach(([u,v],i)=>i?x.lineTo(gx(u),gz(v)):x.moveTo(gx(u),gz(v)));x.stroke();
   for(let i=0;i<=60;i++){const t=i/60,[u0,v0]=DAMIETTA[0],[u1,v1]=DAMIETTA[2];for(let k=0;k<3;k++)dab(x,gx(u0+(u1-u0)*t+rnd(-.25,.25)),gz(v0+(v1-v0)*t),rnd(14,22),rnd(6,10),rnd(-.5,.5),rnd(95,130),50,rnd(34,46),.45)}}
  // murets de pierre
  for(let k=0;k<9;k++){let px=rnd(-5,5),pz=rnd(-5,5);if(inSea(px,pz,.5))continue;const ang=rnd(0,Math.PI);for(let s=0;s<28;s++){const qx=px+Math.cos(ang)*s*.06,qz=pz+Math.sin(ang)*s*.06;if(!freeSpot(qx,qz,.3))continue;x.fillStyle=hsl(rnd(30,45),rnd(10,25),rnd(70,84));x.beginPath();x.ellipse(gx(qx),gz(qz),7,5,rnd(0,3),0,7);x.fill()}}
  // le chemin pavé, bordé de pierres
  ROUTES.forEach(RC=>{
  for(let i=0;i<=1000;i++){const p=RC.getPoint(i/1000),t=RC.getTangent(i/1000);for(let k=0;k<2;k++){const o=rnd(-.2,.2);dab(x,gx(p.x-t.z*o),gz(p.z+t.x*o),rnd(14,22),rnd(10,14),Math.atan2(t.z,t.x)+rnd(-.3,.3),rnd(32,40),rnd(30,45),rnd(80,90),rnd(.55,.8))}}
  for(let i=0;i<=320;i++){const p=RC.getPoint(i/320),t=RC.getTangent(i/320);[-1,1].forEach(sd=>{x.fillStyle=hsl(rnd(25,40),rnd(15,30),rnd(64,78));x.beginPath();x.ellipse(gx(p.x-t.z*.27*sd),gz(p.z+t.x*.27*sd),rnd(4,7),rnd(3,5),rnd(0,3),0,7);x.fill()})}
  for(let i=0;i<=220;i++){const p=RC.getPoint(i/220);x.strokeStyle='rgba(150,120,90,.35)';x.lineWidth=1.5;x.strokeRect(gx(p.x)+rnd(-14,6),gz(p.z)+rnd(-14,6),rnd(10,16),rnd(8,12))}})
  // fleurs des champs : coquelicots, marguerites, boutons d'or
  const FL=[[355,85,55],[0,0,98],[50,95,62],[280,50,72]];for(let i=0;i<1600;i++){const px=rnd(-6,6),pz=rnd(-5.5,5.5);if(!freeSpot(px,pz,.3))continue;const[h,s2,l]=FL[i%4];for(let k=0;k<3;k++){x.fillStyle=hsl(h,s2,l,.92);x.beginPath();x.arc(gx(px)+rnd(-5,5),gz(pz)+rnd(-5,5),rnd(2.2,3.8),0,7);x.fill()}}
  // ombres peintes sous les lieux, assombri vers le bord
  PLACES.forEach(([a,b])=>blob(x,gx(a)+40,gz(b)+34,170,'rgba(40,50,30,.28)'));
  const e=x.createRadialGradient(W/2,W/2,W*.38,W/2,W/2,W*.5);e.addColorStop(0,'rgba(40,40,20,0)');e.addColorStop(1,'rgba(40,40,20,.35)');x.fillStyle=e;x.fillRect(0,0,W,W)});
groundTex.repeat.set(1/(2*A),1/(2*C));groundTex.offset.set(.5,.5);
const SEAD=.05;
if(PAPER){const cb=canvasTex(512,64,(x,W,H)=>{x.fillStyle='#d9b98a';x.fillRect(0,0,W,H);x.fillStyle='#f3e4c6';x.fillRect(0,0,W,9);x.fillRect(0,H-9,W,9);x.strokeStyle='#b8925e';x.lineWidth=3;x.beginPath();for(let u=0;u<W;u+=2){x.lineTo(u,32+Math.sin(u*.45)*14)}x.stroke();x.fillStyle='rgba(120,80,40,.25)';x.fillRect(0,9,W,2);x.fillRect(0,H-11,W,2)},true);cb.repeat.set(30,1);M.base=new THREE.MeshStandardMaterial({map:cb,roughness:.95,flatShading:false});const cb2=cb.clone();cb2.needsUpdate=true;cb2.repeat.set(3,1.2);M.edge=new THREE.MeshStandardMaterial({map:cb2,roughness:.95})}
M.ground=painted('#93b45a',groundTex,{roughness:.75,clearcoat:.15,clearcoatRoughness:.5,envMapIntensity:.15});
{const g=new THREE.ExtrudeGeometry(rr(RW,RD-.1,RR-.1),{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:4,curveSegments:24});g.rotateX(-Math.PI/2);const p=mesh(g,[M.ground,M.base],false,true);p.position.y=TOP-.36-(PAPER?SEAD:0);box.add(p)}
{const pts=rr(RW+.08,RD-.02,RR).getPoints(160).map(v=>new THREE.Vector3(v.x,TOP+.04,v.y));box.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),320,.13,12,true),ROPE||M.goldS))}
const WATER={};
// version papier : la terre est une feuille de carton découpée le long de la vraie côte ; la mer est en dessous, en bandes de vagues qui glissent
if(PAPER){const sh=rr(RW,RD-.1,RR-.1);const hole=new THREE.Path();[...COAST].reverse().forEach(([u,v],i)=>i?hole.lineTo(u,-v):hole.moveTo(u,-v));hole.closePath();sh.holes.push(hole);
 const g=new THREE.ExtrudeGeometry(sh,{depth:SEAD,bevelEnabled:false,curveSegments:24});g.rotateX(-Math.PI/2);
 const land=mesh(g,[M.ground,M.edge],true,true);land.position.y=TOP-SEAD;box.add(land);
 // la mer : un papier bleu peint (la peinture de la carte), puis des rangées de vagues découpées
 const waveTex=canvasTex(512,64,(x,W,H)=>{x.clearRect(0,0,W,H);const top=u=>14+Math.sin(u/W*Math.PI*8)*7;
   x.fillStyle='rgba(220,232,250,.85)';x.beginPath();x.moveTo(0,H);for(let u=0;u<=W;u+=4)x.lineTo(u,top(u)-2);x.lineTo(W,H);x.closePath();x.fill();
   const g2=x.createLinearGradient(0,10,0,H);g2.addColorStop(0,'#5a8ee0');g2.addColorStop(1,'#2a5cc0');x.fillStyle=g2;x.beginPath();x.moveTo(0,H);for(let u=0;u<=W;u+=4)x.lineTo(u,top(u));x.lineTo(W,H);x.closePath();x.fill();
   x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=2;for(let k=0;k<8;k++){const u0=k*W/8+20;x.beginPath();x.arc(u0+14,top(u0+14)+12,7,Math.PI*1.1,Math.PI*1.9);x.stroke()}},true);
 const wm=new THREE.MeshStandardMaterial({map:waveTex,alphaTest:.5,side:THREE.DoubleSide,roughness:.95,bumpMap:FIB,bumpScale:.006});
 const wd=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:waveTex,alphaTest:.5});
 // quelques crêtes de vagues découpées, posées çà et là (pas de rangées : rien qui s'aligne)
 const crest=cutMat((x,W,H)=>{x.fillStyle='#3f72d4';x.beginPath();x.moveTo(8,H-8);x.quadraticCurveTo(W*.3,H*.15,W*.55,H*.3);x.quadraticCurveTo(W*.42,H*.45,W*.5,H*.62);x.quadraticCurveTo(W*.75,H*.35,W-8,H-8);x.closePath();x.fill();
   x.fillStyle='rgba(200,222,250,.95)';x.beginPath();x.moveTo(W*.18,H*.62);x.quadraticCurveTo(W*.32,H*.22,W*.55,H*.3);x.quadraticCurveTo(W*.36,H*.34,W*.3,H*.62);x.closePath();x.fill()},256,128);
 WATER.waves=[];let tries=0;while(WATER.waves.length<16&&tries<800){tries++;const x0=rnd(-5.3,5.3),z0=rnd(-5,2);if(!pip(x0,z0,COAST)||segD(x0,z0,COASTC)<.45||WATER.waves.some(m=>Math.hypot(m.userData.x-x0,m.position.z-z0)<1.1))continue;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(.42,.21),crest);m.customDepthMaterial=crest.userData.depth;m.castShadow=true;m.position.set(x0,TOP-SEAD+.1,z0);m.rotation.y=rnd(-.35,.35);m.userData={x:x0,row:WATER.waves.length};box.add(m);WATER.waves.push(m)}
 waveTex.wrapS=THREE.RepeatWrapping;
 // petites découpes : coins de carton recollés au ruban adhésif, ici et là
}

// l'eau de la mer, légèrement transparente
if(!PAPER){const sh=new THREE.Shape();COAST.forEach(([u,v],i)=>i?sh.lineTo(u,-v):sh.moveTo(u,-v));sh.closePath();const g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);
 const w=mesh(g,new THREE.MeshStandardMaterial({color:new THREE.Color('#1a6fc0').convertSRGBToLinear(),roughness:.25,metalness:0,transparent:true,opacity:.1,envMapIntensity:.1,depthWrite:false}),false,false);w.position.set(0,TOP+.035,0);box.add(w);
 const rip=canvasTex(512,512,(x,W)=>{x.clearRect(0,0,W,W);x.lineCap='round';for(let i=0;i<70;i++){const cx=rnd(0,W),cy=rnd(0,W),l=rnd(14,40);x.strokeStyle=`rgba(255,255,255,${rnd(.35,.75)})`;x.lineWidth=rnd(2,4);x.beginPath();x.arc(cx,cy,l,Math.PI*1.15,Math.PI*1.85);x.stroke()}},true);rip.repeat.set(.2,.32);
 const rm=new THREE.MeshBasicMaterial({map:rip,transparent:true,opacity:.8,depthWrite:false,toneMapped:false});const r1=mesh(g.clone(),rm,false,false);r1.position.set(0,TOP+.045,0);box.add(r1);
 const rip2=rip.clone();rip2.needsUpdate=true;rip2.repeat.set(.22,.34);const r2=mesh(g.clone(),new THREE.MeshBasicMaterial({map:rip2,transparent:true,opacity:.35,depthWrite:false,toneMapped:false}),false,false);r2.position.set(0,TOP+.05,0);box.add(r2);WATER.t1=rip;WATER.t2=rip2;WATER.m=w}

const shellCount=box.children.length;
/* ---------- les décors des quatre lieux ---------- */
const deco=new THREE.Group();box.add(deco);
const put=(o,x,z,y=TOP)=>{o.position.set(x,y,z);deco.add(o);return o};
const css=m=>m&&m.color?'#'+m.color.clone().convertLinearToSRGB().getHexString():'#888';
const PAWNC={};const pawnMat=(b,hd)=>{const k=css(b)+css(hd);return PAWNC[k]||(PAWNC[k]=cutMat((x,W,H)=>{x.fillStyle=css(b);x.beginPath();x.moveTo(W*.36,H*.42);x.lineTo(W*.64,H*.42);x.lineTo(W*.76,H*.97);x.lineTo(W*.24,H*.97);x.closePath();x.fill();
  x.fillStyle=css(hd);x.beginPath();x.arc(W/2,H*.27,W*.17,0,7);x.fill();x.fillStyle='rgba(0,0,0,.12)';x.fillRect(W/2,H*.42,W*.22,H*.55)},96,160))};
const pawn=(body,head,h=.36)=>{const g=new THREE.Group();g.add(at(mesh(new THREE.CylinderGeometry(.07,.1,h,14),body),0,h/2,0));g.add(at(mesh(new THREE.SphereGeometry(.075,14,10),head),0,h+.06,0));return g};
let THEA=null,GOBE=null,PALA=null,PHAR=null; // la maquette du théâtre (pour la vue à la première personne)
// 1. le théâtre de l'aède : des gradins en demi-cercle bien fermés, une scène, un mur de scène à colonnes
{const g=new THREE.Group();
 const tier=(r0,r1,h,mat)=>{const sh=new THREE.Shape();sh.absarc(0,0,r1,0,Math.PI,false);sh.absarc(0,0,r0,Math.PI,0,true);sh.closePath();const geo=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:2,curveSegments:40});geo.rotateX(-Math.PI/2);const m=mesh(geo,mat);g.add(m)};
 [[.42,.56,.08],[.56,.7,.16],[.7,.84,.24],[.84,1.02,.32]].forEach(([r0,r1,h],i)=>tier(r0+.004,r1-.004,h,i%2?M.marble:M.marbleP));
 // escaliers qui montent entre les gradins
 [-.5,0,.5].forEach(a=>{for(let k=0;k<4;k++){const st=mesh(new THREE.BoxGeometry(.06,.02,.12),M.terra);const r=.49+k*.14;st.position.set(Math.cos(Math.PI/2+a)*r,.09+k*.08,-Math.sin(Math.PI/2+a)*r);st.rotation.y=a;g.add(st)}});
 // l'orchestra (le cercle de danse) et la scène
 g.add(at(mesh(new THREE.CylinderGeometry(.4,.42,.08,40),M.sandC),0,0,0));
 g.add(at(mesh(new THREE.BoxGeometry(1.3,.16,.32),M.marbleD),0,.04,.52));
 g.add(at(mesh(new THREE.BoxGeometry(1.3,.16,.05),M.terra),0,.2,.67));
 [-.5,-.25,0,.25,.5].forEach(x=>{g.add(at(mesh(new THREE.CylinderGeometry(.035,.04,.36,12),M.marbleP),x,.3,.6));g.add(at(mesh(new THREE.BoxGeometry(.09,.03,.09),M.marbleP),x,.49,.6))});
 g.add(at(mesh(new THREE.BoxGeometry(1.36,.05,.14),M.marbleP),0,.52,.6));
 // l'aède sur la scène, avec sa lyre
 const bard=pawn(M.white,M.skin,.3);bard.position.set(0,.12,.48);g.add(bard);const bb=mesh(new THREE.SphereGeometry(.05,10,8),M.marbleD);bb.scale.y=1.4;bb.position.set(0,.43,.42);g.add(bb);
 // le public, assis sur les gradins
 [[-.95,.62,.16],[-.55,.62,.16],[-.2,.62,.16],[.25,.62,.16],[.7,.62,.16],[-.75,.76,.24],[-.3,.76,.24],[.1,.76,.24],[.5,.76,.24],[-.45,.9,.32],[.35,.9,.32]].forEach(([a,r,h],i)=>{const t=Math.PI/2+a;const p=pawn([M.terra,M.turq,M.cream,M.blue,M.yellow,M.red][i%6],M.skin,.12);p.scale.setScalar(.75);p.position.set(Math.cos(t)*r,h,-Math.sin(t)*r);p.userData.a=a;(g.userData.pub=g.userData.pub||[]).push(p);g.add(p)});
 g.scale.setScalar(.78);put(g,...PLACES[1]);THEA=g;THEA.userData.bard=bard;THEA.userData.lyre=bb}
// 2. le palais du roi Thamus
{const g=new THREE.Group();[-.5,.5].forEach(x=>{const t=mesh(new THREE.CylinderGeometry(.3,.42,1.25,4),M.sandC);t.rotation.y=Math.PI/4;t.position.set(x,.62,0);g.add(t);const c=mesh(new THREE.BoxGeometry(.48,.08,.48),M.turq);c.position.set(x,1.28,0);g.add(c);
   const st=mesh(new THREE.BoxGeometry(.44,.05,.02),M.terra);st.position.set(x,.95,.27);g.add(st)});
 g.add(at(mesh(new THREE.BoxGeometry(.62,.16,.36),M.turq),0,.98,0));g.add(at(mesh(new THREE.BoxGeometry(.4,.75,.05),M.terra),0,.38,-.12));
 [-.55,-.2,.2,.55].forEach(x=>{g.add(at(mesh(new THREE.CylinderGeometry(.07,.08,.72,12),M.sandC),x,.36,-.7));g.add(at(mesh(new THREE.ConeGeometry(.14,.18,12,1,true),M.palmL),x,.78,-.7))});
 const ob=mesh(new THREE.CylinderGeometry(.08,.15,1.7,4),M.marbleD);ob.rotation.y=Math.PI/4;ob.position.set(1.05,.85,-.45);g.add(ob);const py=mesh(new THREE.ConeGeometry(.11,.16,4),M.gold);py.rotation.y=Math.PI/4;py.position.set(1.05,1.78,-.45);g.add(py);
 if(PAPER){// Thamus et Thot en papier plié : robes en cônes, némès rayé bleu et or, tête d'ibis et long bec courbe
  const stripe=canvasTex(128,64,(x,W,H)=>{for(let u=0;u<W;u+=16){x.fillStyle=(u/16)%2?'#e8b04a':'#2a4a9a';x.fillRect(u,0,16,H)}},true);stripe.repeat.set(3,1);
  const nem=new THREE.MeshStandardMaterial({map:stripe,roughness:.95,flatShading:true,side:THREE.DoubleSide});
  const ocre=plastic('#d8a24a'),robe=plastic('#f3ead6'),peau=plastic('#b9764a'),noir=plastic('#2a2430'),pap=plastic('#efe2bf');
  {const th=new THREE.Group();th.position.set(-.32,0,.62);th.rotation.y=.5;g.add(th);g.userData.th=th;
   th.add(at(mesh(new THREE.BoxGeometry(.36,.2,.32),ocre),0,.1,0));th.add(at(mesh(new THREE.BoxGeometry(.36,.5,.05),ocre),0,.34,-.14));[-.16,.16].forEach(x=>th.add(at(mesh(new THREE.ConeGeometry(.03,.08,4),ocre),x,.62,-.14)));
   th.add(at(mesh(new THREE.ConeGeometry(.13,.34,6),robe),0,.36,.02));th.add(at(mesh(new THREE.IcosahedronGeometry(.07,1),peau),0,.6,.03));
   const n=mesh(new THREE.ConeGeometry(.11,.2,8,1,true),nem);n.position.set(0,.6,0);th.add(n);th.add(at(mesh(new THREE.CylinderGeometry(.075,.075,.03,8),nem),0,.66,.0));
   th.add(at(mesh(new THREE.ConeGeometry(.018,.06,4),ocre),0,.72,.06));[-.08,.08].forEach(x=>{const a=mesh(new THREE.ConeGeometry(.025,.16,4),robe);a.position.set(x,.38,.08);a.rotation.x=1.2;th.add(a)})}
  {const ib=new THREE.Group();ib.position.set(.3,0,.66);ib.rotation.y=-.6;g.add(ib);g.userData.ib=ib;
   ib.add(at(mesh(new THREE.ConeGeometry(.12,.42,6),robe),0,.21,0));ib.add(at(mesh(new THREE.CylinderGeometry(.06,.07,.08,6),plastic('#3b6fd6')),0,.42,0));
   ib.add(at(mesh(new THREE.IcosahedronGeometry(.065,1),noir),0,.52,.01));const bk=mesh(new THREE.ConeGeometry(.016,.22,4),noir);bk.position.set(0,.47,.12);bk.rotation.x=2.1;ib.add(bk);
   const sh=mesh(new THREE.PlaneGeometry(.22,.15),new THREE.MeshStandardMaterial({color:pap.color,side:THREE.DoubleSide,roughness:.95}));sh.position.set(-.1,.33,.13);sh.rotation.set(-.5,.2,.15);ib.add(sh);
   [-1,1].forEach(k=>{const r=mesh(new THREE.CylinderGeometry(.018,.018,.17,6),pap);r.rotation.z=Math.PI/2;r.rotation.y=.2;r.position.set(-.1+k*.11,.33,.13);ib.add(r)})}
 }else{
 // le roi Thamus sur son trône d'or (coiffe rayée bleu et or), face à Thot, dieu à tête d'ibis, qui lui tend un papyrus déroulé
 {const th=new THREE.Group();th.position.set(-.32,0,.62);th.rotation.y=.5;g.add(th);g.userData.th=th;th.add(at(mesh(new THREE.BoxGeometry(.34,.2,.3),M.gold),0,.1,0));th.add(at(mesh(new THREE.BoxGeometry(.34,.42,.06),M.gold),0,.3,-.13));
  const k=pawn(M.white,M.skin,.32);k.position.set(0,.16,.02);k.scale.setScalar(1.25);th.add(k);
  for(let s=0;s<5;s++){const n=mesh(new THREE.CylinderGeometry(.05+s*.022,.06+s*.022,.035,16,1,false,Math.PI*.15,Math.PI*1.7),s%2?M.gold:M.blue);n.position.set(0,.66-s*.035,-.005);n.rotation.y=Math.PI;th.add(n)}
  th.add(at(mesh(new THREE.SphereGeometry(.025,8,6),M.gold),0,.72,.07))}
 {const ib=new THREE.Group();ib.position.set(.3,0,.66);ib.rotation.y=-.6;g.add(ib);g.userData.ib=ib;const body=pawn(M.white,M.white,.36);body.scale.setScalar(1.25);ib.add(body);ib.children.length;
  const head=mesh(new THREE.SphereGeometry(.08,14,10),M.black);head.position.set(0,.58,0);ib.add(head);
  const beak=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0,.57,.06],[0,.53,.18],[0,.45,.27]].map(p=>new THREE.Vector3(...p))),12,.016,6),M.black);ib.add(beak);
  const sheet=mesh(new THREE.BoxGeometry(.24,.005,.16),M.cream);sheet.position.set(-.12,.34,.12);sheet.rotation.set(.6,0,.2);ib.add(sheet);
  [-1,1].forEach(k=>{const r=mesh(new THREE.CylinderGeometry(.018,.018,.17,8),M.cream);r.rotation.x=Math.PI/2;r.position.set(-.12+k*.12,.34,.12);ib.add(r)})}



 }
 g.rotation.y=-.3;g.scale.setScalar(.9);put(g,...PLACES[2]);PALA=g}
// 3. les pierres devenues temple
if(PAPER){const g=new THREE.Group();const stoneC=plastic('#cbbfa6');
 const anim=(k)=>{const t=canvasTex(128,256,(x,W,H)=>{x.fillStyle='#cbbfa6';x.fillRect(0,0,W,H);for(let i=0;i<900;i++){x.fillStyle=Math.random()<.5?`rgba(255,250,235,${rnd(.08,.2)})`:`rgba(90,70,50,${rnd(.06,.14)})`;x.fillRect(rnd(0,W),rnd(0,H),rnd(1,3),rnd(1,2))}
   x.strokeStyle='#5a4632';x.lineWidth=6;x.lineCap='round';x.lineJoin='round';x.beginPath();const cx=64,cy=150;
   if(k===0){x.moveTo(cx-34,cy+10);x.quadraticCurveTo(cx-6,cy-26,cx+26,cy-4);x.lineTo(cx+38,cy-18);x.moveTo(cx+26,cy-4);x.lineTo(cx+40,cy+4);x.moveTo(cx-20,cy+2);x.lineTo(cx-24,cy+30);x.moveTo(cx+14,cy);x.lineTo(cx+16,cy+30);x.moveTo(cx-34,cy+10);x.lineTo(cx-48,cy-10)}
   else if(k===1){x.ellipse(cx,cy,34,20,0,0,7);x.moveTo(cx+34,cy-4);x.lineTo(cx+46,cy-12);x.moveTo(cx-20,cy+18);x.lineTo(cx-22,cy+36);x.moveTo(cx+18,cy+18);x.lineTo(cx+20,cy+36)}
   else if(k===2){x.moveTo(cx,cy-40);x.lineTo(cx,cy+30);x.moveTo(cx,cy-20);x.lineTo(cx-40,cy-34);x.moveTo(cx,cy-20);x.lineTo(cx+40,cy-34);x.moveTo(cx-10,cy-44);x.lineTo(cx+10,cy-44)}
   else{x.moveTo(cx-10,cy-60);for(let i=0;i<8;i++)x.quadraticCurveTo(cx+(i%2?26:-26),cy-50+i*14,cx+(i%2?-10:10),cy-40+i*14)}x.stroke()});return new THREE.MeshStandardMaterial({map:t,roughness:.95,bumpMap:t,bumpScale:.015})};
 const AM=[0,1,2,3].map(anim),side=M.cbSide;
 const tp=(x,z,a,h,k)=>{const p=new THREE.Group();p.userData.k=k;p.userData.a=a;(g.userData.tps=g.userData.tps||[]).push(p);const sh=mesh(new THREE.BoxGeometry(.13,h,.07),[stoneC,stoneC,stoneC,stoneC,AM[k%4],stoneC]);sh.position.y=h/2;p.add(sh);const hd=mesh(new THREE.BoxGeometry(.3,.11,.1),stoneC);hd.position.y=h+.05;p.add(hd);p.position.set(x,0,z);p.rotation.y=a;g.add(p)};
 // le muret circulaire, en carton empilé (on voit les couches)
 for(let r=0;r<3;r++){const ring=mesh(new THREE.CylinderGeometry(.92-r*.015,.94-r*.015,.07,40,1,true),side);ring.material=side;ring.position.y=.035+r*.07;g.add(ring)}
 g.add(at(mesh(new THREE.CylinderGeometry(.9,.9,.02,40),plastic('#b8a882')),0,.21,0));
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;tp(Math.cos(a)*.72,Math.sin(a)*.72,-a+Math.PI/2,.38,i)}
 tp(-.14,0,0,.62,0);tp(.14,0,0,.62,1);
 g.children.forEach(o=>{if(o.isGroup)o.position.y+=.21});put(g,...PLACES[0]);GOBE=g}
else
{const g=new THREE.Group();g.add(at(mesh(new THREE.CylinderGeometry(.85,.9,.1,40),M.marbleD),0,.01,0));
 [0,1,2,3,4].forEach(i=>{const a=Math.PI*(.55+i*.225);const s=mesh(new THREE.BoxGeometry(.2,.55+i%2*.1,.13),M.stone);s.position.set(Math.cos(a)*.7,.3,Math.sin(a)*.7);s.rotation.y=-a;g.add(s)});
 [-.45,-.15,.15,.45].map(t=>t*Math.PI).forEach(a=>{g.add(at(mesh(new THREE.CylinderGeometry(.07,.08,.8,14),M.marbleP),Math.cos(a)*.66,.43,Math.sin(a)*.66))});
 const arch=mesh(new THREE.TorusGeometry(.66,.07,8,30,Math.PI*.9),M.marbleP);arch.rotation.set(Math.PI/2,0,-Math.PI*.45);arch.position.y=.86;g.add(arch);
 const ps=new THREE.Shape();ps.moveTo(-.26,0);ps.lineTo(.26,0);ps.lineTo(0,.16);ps.closePath();const pg=new THREE.ExtrudeGeometry(ps,{depth:.5,bevelEnabled:false});pg.translate(0,0,-.25);const ped=mesh(pg,M.marbleP);ped.rotation.y=Math.PI/2;ped.position.set(.66,.9,0);g.add(ped);
 put(g,...PLACES[0])}
// 4. le phare d'Alexandrie et la bibliothèque
let pharosFire,pharosLight;const BEAM={};
{const g=new THREE.Group();const rock=mesh(new THREE.SphereGeometry(.55,20,12),M.stone);rock.scale.set(1,.35,.9);g.add(rock);
 g.add(at(mesh(new THREE.BoxGeometry(.6,.85,.6),M.marbleP),0,.5,0));g.add(at(mesh(new THREE.BoxGeometry(.66,.06,.66),M.gold),0,.95,0));
 g.add(at(mesh(new THREE.CylinderGeometry(.22,.26,.55,8),M.marbleP),0,1.26,0));g.add(at(mesh(new THREE.CylinderGeometry(.27,.27,.05,8),M.gold),0,1.55,0));
 g.add(at(mesh(new THREE.CylinderGeometry(.14,.17,.3,16),M.marbleP),0,1.72,0));
 // détails du phare (vus de près, à la première personne) : assises de pierre, fenêtres éclairées, tritons aux angles, statue au sommet
 {const gr=new THREE.MeshStandardMaterial({color:new THREE.Color('#cbbfa6').convertSRGBToLinear(),roughness:.95}),win=new THREE.MeshStandardMaterial({color:new THREE.Color('#3a2a30').convertSRGBToLinear(),emissive:new THREE.Color('#ffb060'),emissiveIntensity:.45,roughness:.9});
  [.17,.29,.41,.53,.65,.77].forEach(y=>g.add(at(mesh(new THREE.BoxGeometry(.624,.012,.624),gr,false,false),0,y+.075,0)));
  for(let f=0;f<4;f++){const a=f*Math.PI/2;for(let r=0;r<3;r++)for(let c=-1;c<=1;c+=2){const w=mesh(new THREE.BoxGeometry(.045,.075,.012),win,false,false);w.position.set(Math.sin(a)*.312+Math.cos(a)*c*.12,.34+r*.2,Math.cos(a)*.312-Math.sin(a)*c*.12);w.rotation.y=a;g.add(w)}}
  {const d=mesh(new THREE.BoxGeometry(.12,.16,.012),win,false,false);d.position.set(0,.16,.312);g.add(d)}
  for(let k=0;k<8;k++){const a=k*Math.PI/4+Math.PI/8,w=mesh(new THREE.BoxGeometry(.04,.07,.012),win,false,false);w.position.set(Math.sin(a)*.25,1.3,Math.cos(a)*.25);w.rotation.y=a;g.add(w)}
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([x,z])=>{const t=mesh(new THREE.ConeGeometry(.035,.12,8),M.gold);t.position.set(x*.29,1.04,z*.29);g.add(t)});
  {const st=new THREE.Group();st.add(at(mesh(new THREE.CylinderGeometry(.02,.03,.1,8),M.gold),0,0,0));st.add(at(mesh(new THREE.SphereGeometry(.025,10,8),M.gold),0,.07,0));st.position.y=2.29;g.add(st)}}
 pharosFire=mesh(new THREE.ConeGeometry(.1,.22,12),new THREE.MeshBasicMaterial({color:'#ffb347'}),false,false);pharosFire.position.y=1.98;g.add(pharosFire);if(PAPER){// un faisceau qui s'efface en douceur : fort près de la lanterne, rien au bout, sans bord net
 const am=canvasTex(64,256,(x,W,H)=>{const gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#fff');gr.addColorStop(.25,'#777');gr.addColorStop(.6,'#222');gr.addColorStop(1,'#000');x.fillStyle=gr;x.fillRect(0,0,W,H)});am.encoding=THREE.LinearEncoding;
 const bmG=new THREE.Group();[[.32,.075],[.6,.035]].forEach(([r,o])=>{const bg=new THREE.ConeGeometry(r,2.6,24,1,true);bg.translate(0,-1.3,0);bg.rotateZ(Math.PI/2);bmG.add(new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:'#ffd9a0',alphaMap:am,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})))});bmG.position.y=1.99;g.add(bmG);BEAM.m=bmG}
if(PAPER){const lan=mesh(new THREE.CylinderGeometry(.17,.2,.32,8,1,true),new THREE.MeshStandardMaterial({color:'#fff1d0',emissive:new THREE.Color('#ffb25a'),emissiveIntensity:1.8,transparent:true,opacity:.9,side:THREE.DoubleSide,roughness:.9,bumpMap:FIB,bumpScale:.01}),false,false);lan.position.y=1.99;g.add(lan);g.add(at(mesh(new THREE.ConeGeometry(.17,.12,8),plastic('#a84a2a')),0,2.18,0))}
 pharosLight=new THREE.PointLight(0xffa850,.9,5,2);pharosLight.position.y=2.0;g.add(pharosLight);
 put(g,...PLACES[3]);PHAR=g}
{const g=new THREE.Group();g.add(at(mesh(new THREE.BoxGeometry(1.1,.08,.6),M.marbleD),0,.04,0));
 [-.45,-.15,.15,.45].forEach(x=>g.add(at(mesh(new THREE.CylinderGeometry(.045,.05,.5,10),M.marbleP),x,.33,.24)));
 g.add(at(mesh(new THREE.BoxGeometry(1.0,.5,.3),M.sandC),0,.33,-.08));g.add(at(mesh(new THREE.BoxGeometry(1.15,.07,.62),M.marbleP),0,.62,0));
 const rs=new THREE.Shape();rs.moveTo(-.33,0);rs.lineTo(.33,0);rs.lineTo(0,.24);rs.closePath();const rg=new THREE.ExtrudeGeometry(rs,{depth:1.15,bevelEnabled:false});rg.translate(0,0,-.575);const roof=mesh(rg,M.terra);roof.rotation.y=Math.PI/2;roof.position.set(0,.655,0);g.add(roof);
 [-.45,-.15,.15,.45].forEach(x=>g.add(at(mesh(new THREE.CylinderGeometry(.045,.05,.5,10),M.marbleP),x,.33,-.24)));
 const winM=PAPER?new THREE.MeshStandardMaterial({color:'#fff3d6',emissive:new THREE.Color('#ffb95e'),emissiveIntensity:.9,roughness:.9}):M.cream;
 for(let r=0;r<3;r++)for(let c=0;c<5;c++){const d=at(mesh(new THREE.CylinderGeometry(.035,.035,.04,10),winM),-.32+c*.16,.18+r*.12,.08);d.rotation.x=Math.PI/2;g.add(d)}
 put(g,...LIB).rotation.y=.35}
// végétation dense : cyprès, buissons, oliviers, rochers, colonnes brisées, amphores, moutons (instances, légères pour le téléphone)
const scatter=(n,m,fn)=>{const pts=[];let tries=0;while(pts.length<n&&tries<n*40){tries++;const x=rnd(-A,A),z=rnd(-C,C);if((x/A)**2+(z/C)**2<.74&&freeSpot(x,z,m)&&pts.every(([a,b])=>Math.hypot(a-x,b-z)>.32))pts.push([x,z])}pts.forEach(([x,z],i)=>fn(x,z,i))};
const inst=(geo,mat,list,cast=true)=>{const im=new THREE.InstancedMesh(geo,mat,list.length);im.castShadow=cast;im.receiveShadow=false;const d=new THREE.Object3D();list.forEach((t,i)=>{d.position.set(t[0],t[1],t[2]);d.rotation.set(0,t[4]||0,0);d.scale.set(t[3],t[5]||t[3],t[3]);d.updateMatrix();im.setMatrixAt(i,d.matrix)});box.add(im);return im};
// ---- version papier : des découpes de carton croisées, comme dans un livre pop-up
const CROSS=(()=>{const g=new THREE.BufferGeometry();const P=[-1,-1,0, 1,-1,0, 1,1,0, -1,1,0, 0,-1,-1, 0,-1,1, 0,1,1, 0,1,-1],U=[0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1],N=[0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0];
 g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);return g})();
function cutMat(draw,W=256,H=256){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const s=document.createElement('canvas');s.width=W;s.height=H;const sx=s.getContext('2d');draw(sx,W,H);
 const w=document.createElement('canvas');w.width=W;w.height=H;const wx=w.getContext('2d');wx.drawImage(s,0,0);wx.globalCompositeOperation='source-in';wx.fillStyle='#fbf5e6';wx.fillRect(0,0,W,H);
 for(let k=0;k<16;k++){const a=k/16*Math.PI*2;x.drawImage(w,Math.cos(a)*5,Math.sin(a)*5)}x.drawImage(s,0,0);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;
 const m=new THREE.MeshStandardMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,roughness:.95,metalness:0,bumpMap:FIB,bumpScale:.008});
 m.userData.depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});return m}
const cutMesh=(m)=>{const o=new THREE.Mesh(CROSS,m);o.castShadow=true;o.receiveShadow=true;o.customDepthMaterial=m.userData.depth;return o};
const blobs=(x,pts,col)=>{x.fillStyle=col;x.beginPath();pts.forEach(([a,b,r])=>{x.moveTo(a+r,b);x.arc(a,b,r,0,7)});x.fill()};
const CUT=PAPER?{
 cyp:cutMat((x,W,H)=>{const f=(col,side)=>{x.fillStyle=col;x.beginPath();x.moveTo(128,6);x.bezierCurveTo(128+side*70,70,128+side*62,200,128,250);x.closePath();x.fill()};f('#2f6a3e',-1);f('#22543a',1)}),
 bush:cutMat((x)=>{blobs(x,[[70,110,44],[128,92,56],[186,112,42],[100,124,40],[160,126,40]],'#5f9a46');blobs(x,[[150,96,30],[186,116,26]],'#4f8a3c');x.fillStyle='#5f9a46';x.fillRect(30,118,196,20)}),
 bush2:cutMat((x)=>{blobs(x,[[64,116,40],[118,96,52],[178,108,46],[150,126,40]],'#7fb04e');blobs(x,[[128,100,28]],'#6fa040');x.fillStyle='#7fb04e';x.fillRect(28,120,196,18)}),
 olive:cutMat((x)=>{x.fillStyle='#8a5a30';x.beginPath();x.moveTo(118,250);x.lineTo(124,150);x.lineTo(108,118);x.lineTo(118,116);x.lineTo(130,140);x.lineTo(146,112);x.lineTo(154,116);x.lineTo(136,152);x.lineTo(140,250);x.closePath();x.fill();
   blobs(x,[[128,70,48],[80,96,36],[176,92,38],[110,48,30],[156,56,32]],'#8fae5a');blobs(x,[[150,78,22],[86,104,18],[120,56,16]],'#7a9a4a')}),
 sheep:cutMat((x,W,H)=>{x.fillStyle='#2a2630';[[96,150],[120,156],[150,156],[172,150]].forEach(([a,b])=>x.fillRect(a,b,9,46));blobs(x,[[88,112,34],[124,96,40],[160,104,36],[104,140,32],[146,140,32],[182,128,24]],'#fbfaf6');x.strokeStyle='#d8d2c6';x.lineWidth=3;x.beginPath();x.arc(124,118,22,3.6,5.6);x.stroke();x.fillStyle='#2a2630';x.beginPath();x.ellipse(206,104,24,18,.35,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(214,98,4,0,7);x.fill()},256,208),
 palm:cutMat((x)=>{x.strokeStyle='#9a6a3a';x.lineWidth=12;x.lineCap='round';x.beginPath();x.moveTo(132,252);x.quadraticCurveTo(116,170,128,92);x.stroke();
   for(let i=0;i<7;i++){const a=-Math.PI+i/6*Math.PI,ex=128+Math.cos(a)*112,ey=96+Math.sin(a)*58+(Math.abs(Math.cos(a))*40);x.fillStyle=i%2?'#4fb36a':'#3f9a58';x.beginPath();x.moveTo(128,90);
    const mx=(128+ex)/2,my=(90+ey)/2-34;x.quadraticCurveTo(mx-8,my-10,ex,ey);x.quadraticCurveTo(mx+8,my+16,128,98);x.closePath();x.fill()}})}:null;
M.cypress=plastic('#2f6a3e',{roughness:.6,clearcoat:.3});M.bushP=painted('#5f9a46',leafTex('#5f9a46'),{roughness:.65,clearcoat:.25});M.bushP2=painted('#7fb04e',leafTex('#86b456'),{roughness:.65,clearcoat:.25});M.bush=plastic('#5f9a46');M.bush2=plastic('#7fb04e');M.flowerR=plastic('#e8423f');M.flowerW=plastic('#fffaf0');M.flowerY=plastic('#ffd23f');M.wool=plastic('#fbf6ee',{roughness:.6,clearcoat:.3});
{const cyp=[],bush=[],bush2=[],rocks=[],fl=[[],[],[]],trunks=[];
 scatter(26,.5,(x,z,i)=>{if((x/A)**2+(z/C)**2>.62)return;const s=rnd(.8,1.2);cyp.push([x,TOP+.55*s,z,.16*s,0,.62*s]);trunks.push([x,TOP+.06,z,.04,0,.12])});
 scatter(46,.4,(x,z,i)=>{(i%2?bush:bush2).push([x,TOP+.04,z,rnd(.16,.24),rnd(0,6),rnd(.08,.12)])});
 scatter(22,.4,(x,z)=>rocks.push([x,TOP+.04,z,rnd(.1,.18),rnd(0,6),rnd(.07,.12)]));
 scatter(150,.3,(x,z,i)=>fl[i%3].push([x,TOP+.08,z,.035,0,.035]));
 const cone=new THREE.ConeGeometry(1,2,PAPER?6:10);cone.translate(0,0,0);if(PAPER){const im=inst(CROSS,CUT.cyp,cyp.map(t=>[t[0],t[1],t[2],t[3]*1.7,t[4],t[5]]));im.customDepthMaterial=CUT.cyp.userData.depth}else inst(cone,M.cypress,cyp);inst(new THREE.CylinderGeometry(1,1,1,6),M.trunk,trunks,false);
 const sph=PAPER?new THREE.IcosahedronGeometry(1,0):new THREE.SphereGeometry(1,14,8);if(PAPER){[[CUT.bush,bush],[CUT.bush2,bush2]].forEach(([m,l])=>{const im=inst(CROSS,m,l.map(t=>[t[0],t[1]+t[5]*1.2,t[2],t[3]*1.2,t[4],t[5]*2.8]));im.customDepthMaterial=m.userData.depth})}else{inst(sph,M.bushP,bush);inst(sph,M.bushP2,bush2)}inst(PAPER?(()=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position,map={};for(let i=0;i<p.count;i++){const k=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(3)).join();const f=map[k]||(map[k]=rnd(.78,1.12));p.setXYZ(i,p.getX(i)*f,p.getY(i)*f,p.getZ(i)*f)}g.computeVertexNormals();return g})():new THREE.IcosahedronGeometry(1,1),PAPER?plastic('#cfc8bc'):M.stone,rocks);
 const fs=new THREE.SphereGeometry(1,6,4);inst(fs,M.flowerR,fl[0],false);inst(fs,M.flowerW,fl[1],false);inst(fs,M.flowerY,fl[2],false)}
// colonnes brisées, amphores et petit troupeau de moutons, pour la vie
[[-2.1,-4.65],[.8,-2.6],[3.3,-3.6]].forEach(([x,z],i)=>{const c=mesh(new THREE.CylinderGeometry(.08,.09,.3+i*.12,12),M.marbleP);c.position.set(x,TOP+.15+i*.06,z);box.add(c);const f=mesh(new THREE.CylinderGeometry(.09,.09,.24,12),M.marbleP);f.rotation.z=Math.PI/2;f.position.set(x+.25,TOP+.09,z+.1);box.add(f)});
[[-4.75,-3.9],[-4.6,-4.0],[-.95,2.1],[2.9,.4]].forEach(([x,z])=>{const g=new THREE.Group();const b=mesh(new THREE.SphereGeometry(.08,12,10),M.terra);b.scale.y=1.3;b.position.y=.1;g.add(b);g.add(at(mesh(new THREE.CylinderGeometry(.03,.045,.07,10),M.terra),0,.22,0));g.position.set(x,TOP,z);box.add(g)});
// version papier : des moutons pliés en origami (corps crème à facettes, tête et pattes de papier sombre)
const ORI=PAPER?(()=>{const cr=plastic('#f3ead6'),dk=plastic('#3a3036');const body=new THREE.DodecahedronGeometry(.13,0);body.scale(1.35,.95,1);
 const head=new THREE.IcosahedronGeometry(.07,1);head.scale(1.25,.95,.9);const ear=new THREE.BufferGeometry();ear.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0, -.03,.02,.07, .03,-.01,.05],3));ear.computeVertexNormals();
 const leg=new THREE.ConeGeometry(.022,.11,3);leg.rotateX(Math.PI);return{cr,dk,body,head,ear,leg}})():null;
const sheep=[];[[.15,-4.35],[.4,-4.2],[-.05,-4.1],[-4.55,-4.7],[-4.3,-4.85]].forEach(([x,z],i)=>{const g=new THREE.Group();if(PAPER){const b=mesh(ORI.body,ORI.cr);b.position.y=.17;b.rotation.set(.2,.3,.1);g.add(b);const h=mesh(ORI.head,ORI.dk);h.position.set(.19,.23,0);h.rotation.z=-.2;g.add(h);
  [-1,1].forEach(k=>{const e=mesh(ORI.ear,new THREE.MeshStandardMaterial({color:ORI.dk.color,side:THREE.DoubleSide,flatShading:true,roughness:.95}));e.position.set(.15,.25,k*.03);e.scale.z=k;g.add(e)});
  [-.07,.07].forEach(lx=>[-.05,.05].forEach(lz=>{const l=mesh(ORI.leg,ORI.dk);l.position.set(lx,.055,lz);g.add(l)}));g.position.set(x,TOP,z);g.rotation.y=i*1.3;box.add(g);sheep.push(g);return}const b=mesh(new THREE.SphereGeometry(.12,14,10),M.wool);b.scale.set(1.25,.9,.9);b.position.y=.16;g.add(b);const h=mesh(new THREE.SphereGeometry(.06,10,8),M.black);h.position.set(.15,.2,0);g.add(h);[-.06,.06].forEach(lx=>[-.05,.05].forEach(lz=>g.add(at(mesh(new THREE.CylinderGeometry(.015,.015,.1,5),M.black),lx,.05,lz))));g.position.set(x,TOP,z);g.rotation.y=i*1.3;box.add(g);sheep.push(g)});
// végétation et petits détails
const olive=(x,z,s=1)=>{if(PAPER){const o=cutMesh(CUT.olive);o.scale.set(.36*s,.42*s,.36*s);o.position.y=.42*s;o.rotation.y=Math.random()*3;const g=new THREE.Group();g.add(o);put(g,x,z);return}const g=new THREE.Group();g.add(at(mesh(new THREE.CylinderGeometry(.04*s,.07*s,.45*s,8),M.trunk),0,.22*s,0));[[0,.55,0,.28],[-.18,.48,.08,.2],[.18,.5,-.05,.21]].forEach(([a,b,c,r])=>g.add(at(mesh(PAPER?new THREE.IcosahedronGeometry(r*s,0):new THREE.SphereGeometry(r*s,14,10),M.olive),a*s,b*s,c*s)));put(g,x,z)};
const PALMLEAF=(()=>{const sh=new THREE.Shape();sh.moveTo(0,0);const n=6;for(let i=1;i<=n;i++){const u=i/n;sh.lineTo(u*.5,.07*Math.sin(u*Math.PI)+(i%2?.035:0))}for(let i=n-1;i>=0;i--){const u=i/n;sh.lineTo(u*.5,-.07*Math.sin(u*Math.PI)-(i%2?.035:0))}
 const g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);const pos=g.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i);pos.setY(i,-x*x*.9)}g.computeVertexNormals();return g})();
if(PAPER)M.palmLP=plastic('#4fb36a',{side:THREE.DoubleSide});
const palm=(x,z,s=1)=>{if(PAPER){const o=cutMesh(CUT.palm);o.scale.set(.55*s,.58*s,.55*s);o.position.y=.58*s;o.rotation.y=Math.random()*3;const g=new THREE.Group();g.add(o);put(g,x,z);return}const g=new THREE.Group();const t=mesh(new THREE.CylinderGeometry(.035*s,.06*s,.9*s,8),M.trunk);t.position.y=.45*s;t.rotation.z=.08;g.add(t);
  for(let i=0;i<7;i++){const l=PAPER?mesh(PALMLEAF,M.palmLP):mesh(new THREE.SphereGeometry(.22*s,12,6),M.palmL);if(PAPER)l.scale.setScalar(s);else l.scale.set(1.5,.15,.45);const a=i/7*Math.PI*2;l.position.set(Math.cos(a)*.2*s+.04,.9*s,Math.sin(a)*.2*s);l.rotation.set(0,-a,-.35);g.add(l)}put(g,x,z)};
// petits îlots plats : une galette de sable, quelques rochers bas et une touffe d'herbe
const isle=(x,z,s,sx=1,ry=0)=>{const g=new THREE.Group();g.scale.set(sx,1,1);g.rotation.y=ry;const sand=mesh(new THREE.CylinderGeometry(.42*s,.5*s,.08,28),M.sandC,false,true);sand.position.y=.02;g.add(sand);[[-.12,.05,.75],[.14,-.08,.55],[.02,.16,.45]].forEach(([a,b,k])=>{const r=mesh(new THREE.IcosahedronGeometry(.16*s*k,1),M.stone);r.scale.y=.55;r.position.set(a*s,.08,b*s);g.add(r)});const gr=mesh(new THREE.ConeGeometry(.08*s,.18*s,6),M.olive);gr.position.set(.1*s,.14,.1*s);g.add(gr);put(g,x,z,PAPER?TOP-SEAD+.01:TOP+.03)};
const BOATG=(()=>{const g=new THREE.BufferGeometry();const v=[-.12,0,0, .12,0,0, .27,.13,.07, -.27,.13,.07,  .12,0,0, -.12,0,0, -.27,.13,-.07, .27,.13,-.07,  -.13,.12,0, .13,.12,0, 0,.34,0,  -.27,.13,.07, -.12,0,0, -.27,.13,-.07,  .12,0,0, .27,.13,.07, .27,.13,-.07];
 g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,11,12,13,14,15,16]);g.computeVertexNormals();return g})();
const sail=(x,z,r)=>{if(PAPER){const g=new THREE.Group();const col=['#f3ead6','#d8bf8e','#efe4cc'][Math.abs(Math.round(r*7))%3];const m=mesh(BOATG,new THREE.MeshStandardMaterial({color:new THREE.Color(col).convertSRGBToLinear(),side:THREE.DoubleSide,flatShading:true,roughness:.95,bumpMap:FIB,bumpScale:.006}));m.scale.setScalar(1.7);m.castShadow=true;g.add(m);g.rotation.y=r;put(g,x,z,TOP-.04);return g}const g=new THREE.Group();const h=mesh(new THREE.SphereGeometry(.22,16,8,0,Math.PI*2,Math.PI/2,Math.PI/2),M.trunk);h.scale.set(1,.5,.4);g.add(h);g.add(at(mesh(new THREE.CylinderGeometry(.012,.012,.45,6),M.trunk),0,.2,0));
  const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(.26,0);sh.lineTo(0,.36);sh.closePath();g.add(at(mesh(new THREE.ShapeGeometry(sh),new THREE.MeshPhysicalMaterial({color:'#fff6e6',side:THREE.DoubleSide,roughness:.5})),.02,.05,0));g.rotation.y=r;put(g,x,z,TOP+.06);return g};
[[-4.9,-2.6],[-2.4,-4.95],[-.3,-3.8],[1.0,-4.5],[3.0,-3.8],[4.6,-1.2]].forEach(([x,z],i)=>olive(x,z,.9+i%2*.25));
[[-.75,1.95],[1.25,1.25],[2.6,.45],[-1.75,2.6],[.3,4.3],[2.3,3.3]].forEach(([x,z],i)=>palm(x,z,.95+i%3*.1));
// repères de la Méditerranée orientale, à leur vraie place : la Crète, Chypre, Rhodes et deux Cyclades
isle(...LL(24.9,35.25),.5,2.8,.05);isle(...LL(33.2,35.1),.45,1.9,-.35);isle(...LL(28.0,36.2),.2);isle(...LL(25.4,37.0),.22);isle(...LL(25.0,36.6),.18);
const boats=[sail(-1.0,-.5,.6),sail(-3.5,-.1,2.2),sail(1.0,-.3,1.2)];
[[-1.0,3.35,.4],[-1.3,3.6,.3]].forEach(([x,z,s])=>{const p=mesh(new THREE.ConeGeometry(s,s*.9,4),M.sandC);p.rotation.y=Math.PI/4;put(p,x,z,TOP+s*.45)});
for(let i=0;i<18;i++){const p=NILE.getPoint(i/17*.9),side=i%2?1:-1;if(segD(p.x-(i%2?.3:.55),p.z,ROUTEP)<.45)continue;const g=new THREE.Group();for(let k=0;k<4;k++){const s=mesh(new THREE.CylinderGeometry(.008,.01,.32,5),M.palmL);s.rotation.z=(k-1.5)*.18;s.position.y=.16;g.add(s);const tuft=mesh(new THREE.SphereGeometry(.04,8,6),M.palmL);tuft.position.set(Math.sin((k-1.5)*.18)*-.16,.32,0);g.add(tuft)}put(g,p.x-(i%2?.3:.55),p.z)}
const CRANES=[],CLOUDS=[];
if(PAPER){// des grues en papier plié qui tournent au-dessus du phare et de la mer
 const cg=new THREE.BufferGeometry();const v=[0,0,-.16, 0,.02,.12, -.03,-.02,0, 0,0,-.16, 0,.02,.12, .03,-.02,0, 0,.02,.12, 0,.12,.2, .02,0,.05, 0,0,-.16, 0,.1,-.22, -.02,0,-.08];cg.setAttribute('position',new THREE.Float32BufferAttribute(v,3));cg.computeVertexNormals();
 const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.06, 0,0,.08, .22,.03,0],3));wg.computeVertexNormals();
 [['#f3ead6',-.35,.6,1.0,1.5],['#d8bf8e',-1.6,-1.2,1.5,1.75]].forEach(([col,cx,cz,r,h],i)=>{const m=new THREE.MeshStandardMaterial({color:new THREE.Color(col).convertSRGBToLinear(),side:THREE.DoubleSide,flatShading:true,roughness:.95});
  const g=new THREE.Group();const b=mesh(cg,m);g.add(b);const wl=mesh(wg,m),wr=mesh(wg,m);wr.scale.x=-1;g.add(wl);g.add(wr);g.userData={cx,cz,r,h,ph:i*2.1,wl,wr};g.scale.setScalar(1.4);box.add(g);CRANES.push(g)});
 // des bouts de ruban adhésif qui tiennent la carte au fond de la boîte
 const tm=new THREE.MeshStandardMaterial({color:new THREE.Color('#fff4d0').convertSRGBToLinear(),transparent:true,opacity:.62,roughness:.55,side:THREE.DoubleSide});
 [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{const cx=sx*(RW+.08-RR*.25),cz=sz*(RD-.02-RR*.25);const R=.165,a1=-Math.PI/3,P=[[-R-.3,.012],[-R-.06,.012]];for(let k=0;k<=40;k++){const a=Math.PI+(a1-Math.PI)*k/40;P.push([R*Math.cos(a),.04+R*Math.sin(a)])}const e=P[P.length-1];P.push([e[0]-.03,-.17]);const L=[0];for(let k=1;k<P.length;k++)L.push(L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]));const LT=L[L.length-1];const g=new THREE.PlaneGeometry(1,.26,96,1);g.rotateX(-Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++){const sl=(p.getX(i)+.5)*LT;let k=1;while(k<L.length-1&&L[k]<sl)k++;const f=(sl-L[k-1])/Math.max(1e-6,L[k]-L[k-1]);p.setX(i,P[k-1][0]+(P[k][0]-P[k-1][0])*f);p.setY(i,P[k-1][1]+(P[k][1]-P[k-1][1])*f)}g.computeVertexNormals();const t=new THREE.Mesh(g,tm);t.position.set(cx,TOP,cz);t.rotation.y=-Math.atan2(sz,sx);t.receiveShadow=true;box.add(t)});
 [].forEach(([x,z,r])=>{const t=mesh(new THREE.PlaneGeometry(.7,.24),tm,false,true);t.rotation.set(-Math.PI/2,0,r);t.position.set(x,TOP+.012,z);box.add(t)})}
if(PAPER){const em=new THREE.LineBasicMaterial({color:'#5a4632',transparent:true,opacity:.28});deco.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&o.geometry&&o.geometry.attributes.position.count<600&&o.material&&!o.material.alphaTest&&!o.material.transparent&&o.material.type!=='MeshBasicMaterial'){const e=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,35),em);o.add(e)}})}
// le fil de laine rouge : des punaises sur chaque lieu, reliées dans l'ordre du récit (le chemin de la méthode des lieux)
const THREAD={pins:[],segs:[]};
if(PAPER){const wool=canvasTex(64,16,(x,W,H)=>{x.fillStyle='#b8322e';x.fillRect(0,0,W,H);x.strokeStyle='#e0574a';x.lineWidth=3;for(let u=-H;u<W+H;u+=8){x.beginPath();x.moveTo(u,0);x.lineTo(u+H,H);x.stroke()}},true);wool.repeat.set(60,1);
 const wm=new THREE.MeshStandardMaterial({map:wool,roughness:.95}),head=plastic('#c8302a'),pinM=plastic('#d8d0c0');
 const pts=[0,1,2,3].map(i=>{const[px,pz]=PLACES[i],sp=SPOTS[i];return[px+(sp.x-px)*.45,pz+(sp.z-pz)*.45]});pts.push([BAPOS[0]+(SPOT5.x-BAPOS[0])*.45,BAPOS[1]+(SPOT5.z-BAPOS[1])*.45]);
 const H=.55;pts.forEach(([x,z])=>{const g=new THREE.Group();g.add(at(mesh(new THREE.CylinderGeometry(.008,.004,H,6),pinM),0,H/2,0));g.add(at(mesh(new THREE.SphereGeometry(.095,12,10),head),0,H,0));g.position.set(x,TOP,z);g.scale.setScalar(.001);g.visible=false;box.add(g);THREAD.pins.push(g)});
 [[0,1],[1,2],[2,0],[2,3],[3,4]].forEach(([ia,ib])=>{const i=ia;const[a1,b1]=pts[ia],[a2,b2]=pts[ib],d=Math.hypot(a2-a1,b2-b1),y=TOP+H;const mid=new THREE.Vector3((a1+a2)/2,Math.max(TOP+.18,y-.1*d),(b1+b2)/2);
  const c=new THREE.CatmullRomCurve3([new THREE.Vector3(a1,y,b1),new THREE.Vector3(a1+(a2-a1)*.25,y-.06*d,b1+(b2-b1)*.25),mid,new THREE.Vector3(a1+(a2-a1)*.75,y-.06*d,b1+(b2-b1)*.75),new THREE.Vector3(a2,y,b2)]);
  const tg=new THREE.TubeGeometry(c,80,.016,6,false);const m=new THREE.Mesh(tg,wm);m.castShadow=true;m.visible=false;box.add(m);THREAD.segs.push({m,n:tg.index.count,t0:0,a:ia,b:ib})})}
const BRIDGE={};const bridgeH=(x,z)=>{if(BRIDGE.L==null)return 0;const dx=x-BRIDGE.x,dz=z-BRIDGE.z,u=dx*Math.cos(BRIDGE.a)+dz*Math.sin(BRIDGE.a),v=-dx*Math.sin(BRIDGE.a)+dz*Math.cos(BRIDGE.a);if(Math.abs(u)>BRIDGE.L/2||Math.abs(v)>BRIDGE.W/2+.1)return 0;const t=2*u/BRIDGE.L;return .1+.15*(1-t*t)};
// petit pont de pierre sur le Nil
{// un vrai petit pont en dos d'âne : une arche moulée, un tablier, deux parapets — là où le chemin traverse le Nil
 let best=null;for(let i=0;i<=200;i++){const p=ROUTEC.getPoint(i/200);for(let k=0;k<=60;k++){const q=NILE.getPoint(k/60),d=Math.hypot(p.x-q.x,p.z-q.z);if(!best||d<best.d)best={d,p,t:ROUTEC.getTangent(i/200)}}}
 const g=new THREE.Group(),L=1.5,Wd=.62,R=.42;
 const sh=new THREE.Shape();sh.moveTo(-L/2,0);sh.lineTo(-L/2,.12);sh.quadraticCurveTo(0,.42,L/2,.12);sh.lineTo(L/2,0);sh.lineTo(R,0);sh.absarc(0,0,R,0,Math.PI,false);sh.lineTo(-L/2,0);
 const geo=new THREE.ExtrudeGeometry(sh,{depth:Wd,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:2,curveSegments:24});geo.translate(0,0,-Wd/2);g.add(mesh(geo,M.marbleP));
 [-1,1].forEach(k=>{const ps=new THREE.Shape();ps.moveTo(-L/2,.12);ps.quadraticCurveTo(0,.42,L/2,.12);ps.lineTo(L/2,.24);ps.quadraticCurveTo(0,.54,-L/2,.24);ps.closePath();const pg=new THREE.ExtrudeGeometry(ps,{depth:.07,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2,curveSegments:24});pg.translate(0,0,k*(Wd/2-.035)-.035);g.add(mesh(pg,M.marble))});
 g.position.set(best.p.x,TOP-.03,best.p.z);g.rotation.y=-Math.atan2(best.t.z,best.t.x);box.add(g);BRIDGE.x=best.p.x;BRIDGE.z=best.p.z;BRIDGE.a=Math.atan2(best.t.z,best.t.x);BRIDGE.L=L;BRIDGE.W=Wd}

/* ---------- le couvercle : une feuille de papyrus écrite, une lyre d'or au centre ---------- */
const hinge=new THREE.Group();hinge.position.set(0,TOP+.06,-RD);box.add(hinge);
const lid=new THREE.Group();lid.position.set(0,0,RD);hinge.add(lid);
const lidTop=canvasTex(1024,1024,(x,W)=>{x.fillStyle='#ead6a2';x.fillRect(0,0,W,W);for(let i=0;i<1600;i++)dab(x,rnd(0,W),rnd(0,W),rnd(20,50),rnd(6,12),rnd(-.1,.1),rnd(38,46),rnd(40,60),rnd(68,84),rnd(.2,.4));
  for(let i=0;i<W;i+=5){x.strokeStyle=`rgba(150,110,60,${rnd(.04,.1)})`;x.lineWidth=1;x.beginPath();x.moveTo(0,i);x.lineTo(W,i+rnd(-2,2));x.stroke()}
  // colonnes de texte grec à l'encre brune
  const G='ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';x.fillStyle='rgba(70,40,20,.55)';x.font='22px Georgia, serif';[[90,330],[690,930]].forEach(([a,b])=>{for(let y=110;y<W-100;y+=34){let t='';for(let k=0;k<11;k++)t+=G[(Math.random()*24)|0];x.fillText(t,a,y)}});
  x.strokeStyle='rgba(120,70,30,.6)';x.lineWidth=3;x.strokeRect(50,50,W-100,W-100);x.strokeRect(62,62,W-124,W-124);
  // la lyre d'or
  x.save();x.translate(W/2,W/2+40);blob(x,0,-60,260,'rgba(255,230,160,.4)');x.lineCap='round';
  const gold=(lw)=>{x.lineWidth=lw;const g=x.createLinearGradient(-120,0,120,0);g.addColorStop(0,'#9a6a20');g.addColorStop(.5,'#ffe9a0');g.addColorStop(1,'#9a6a20');x.strokeStyle=g;x.fillStyle=g};
  gold(26);x.beginPath();x.moveTo(-55,40);x.bezierCurveTo(-150,-20,-60,-140,-130,-230);x.stroke();x.beginPath();x.moveTo(55,40);x.bezierCurveTo(150,-20,60,-140,130,-230);x.stroke();
  gold(18);x.beginPath();x.moveTo(-120,-190);x.lineTo(120,-190);x.stroke();x.beginPath();x.ellipse(0,60,95,60,0,0,7);x.fill();
  x.strokeStyle='rgba(255,248,220,.9)';x.lineWidth=3;for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(k*22,-190);x.lineTo(k*16,40);x.stroke()}
  x.restore();});
if(PAPER){const src=lidTop.image,c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d');x.drawImage(KRAFT('#b48a56').image,0,0,1024,1024);
 x.save();x.beginPath();const P=[];for(let u=90;u<=934;u+=18)P.push([u,90+rnd(-6,6)]);for(let v=90;v<=934;v+=18)P.push([934+rnd(-6,6),v]);for(let u=934;u>=90;u-=18)P.push([u,934+rnd(-6,6)]);for(let v=934;v>=90;v-=18)P.push([90+rnd(-6,6),v]);P.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.clip();x.drawImage(src,0,0);x.restore();
 [[110,110,-.7],[914,110,.7],[110,914,.7],[914,914,-.7]].forEach(([a,b,r])=>{x.save();x.translate(a,b);x.rotate(r);x.fillStyle='rgba(240,228,190,.7)';x.fillRect(-60,-18,120,36);x.restore()});lidTop.image=c;lidTop.needsUpdate=true}
GLOSS=!PAPER;M.lidTop=painted('#ead6a2',lidTop,{roughness:.4,clearcoat:.8});GLOSS=false;
{const g=new THREE.ExtrudeGeometry(rr(RW,RD,RR),PAPER?{depth:.5,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:1,curveSegments:24}:{depth:.45,bevelEnabled:true,bevelThickness:.12,bevelSize:.12,bevelSegments:4,curveSegments:24});g.rotateX(-Math.PI/2);lid.add(mesh(g,PAPER?[M.cbTop,M.cbSide]:M.papyrusD));
 const t=new THREE.PlaneGeometry(2*RW-.3,2*RD-.3);t.rotateX(-Math.PI/2);const tm=mesh(t,M.lidTop,false,true);tm.position.y=.62;lid.add(tm);
 const pts=rr(RW+.05,RD+.05,RR).getPoints(160).map(v=>new THREE.Vector3(v.x,.5,v.y));lid.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),320,.1,10,true),ROPE||M.goldS))}
// le ciel peint à l'intérieur, et l'écran des souvenirs posé dessus
const skyIn=canvasTex(1024,1024,(x,W)=>{const g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'#141050');g.addColorStop(.6,'#2c2478');g.addColorStop(1,'#4a3486');x.fillStyle=g;x.fillRect(0,0,W,W);
  for(let i=0;i<2600;i++){dab(x,rnd(0,W),rnd(0,W),rnd(22,50),rnd(6,12),rnd(-.25,.25),rnd(235,265),rnd(45,65),rnd(16,36),rnd(.15,.3))}
  for(let i=0;i<500;i++){const cx=rnd(0,W),cy=rnd(0,W),r=rnd(.8,2.4);blob(x,cx,cy,r*4,'rgba(255,240,200,.25)');x.fillStyle='rgba(255,246,220,.95)';x.beginPath();x.arc(cx,cy,r,0,7);x.fill()}});
{const g=new THREE.ShapeGeometry(rr(RW-.05,RD-.05,RR),24);g.rotateX(Math.PI/2);const pos=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,pos.getX(i)/(2*RW)+.5,pos.getZ(i)/(2*RD)+.5);
 const m=mesh(g,PAPER?new THREE.MeshStandardMaterial({map:skyIn,roughness:.95,bumpMap:FIB,bumpScale:.01}):new THREE.MeshPhysicalMaterial({map:skyIn,roughness:.45,clearcoat:.4}),false,false);m.position.y=-.14;lid.add(m)}
const MS=768,MEMC=document.createElement('canvas');MEMC.width=MEMC.height=MS;const mx=MEMC.getContext('2d');
const memTex=new THREE.CanvasTexture(MEMC);memTex.encoding=THREE.sRGBEncoding;memTex.generateMipmaps=false;memTex.minFilter=THREE.LinearFilter;memTex.anisotropy=renderer.capabilities.getMaxAnisotropy();
const SCRW=Math.min(2*RW,2*RD)-.6;
const memGeo=new THREE.PlaneGeometry(SCRW,SCRW);memGeo.rotateX(Math.PI/2);
const memMesh=new THREE.Mesh(memGeo,new THREE.MeshBasicMaterial({map:memTex,transparent:true,depthWrite:false}));memMesh.position.y=-.16;memMesh.renderOrder=2;lid.add(memMesh);
const apexL=new THREE.Vector3(0,-.16,0);
// coordonnées écran → point 3D (pour les tests)
const canvasToWorld=(cx,cy)=>lid.localToWorld(new THREE.Vector3((cx/MS-.5)*SCRW,-.16,(.5-cy/MS)*SCRW));
