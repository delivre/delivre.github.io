/* ---------- les souvenirs en boîte : le joueur crayonne, le dessin devient une petite boîte de carton qu'on tourne ----------
   Le souvenir naît d'une esquisse au crayon sur une feuille du carnet d'Alice, posée sur le ciel du couvercle.
   Il prend la forme d'une boîte-cadre en carton (un objet entier), avec ses couches en profondeur.
   Un détail caché, sur une paroi intérieure, ne se voit qu'en tournant la boîte. À la fin, la boîte retourne
   dans le dessin, qui se resserre en une étoile. */
const DIO={ok:PAPER,ph:null,id:null,need:false,found:false,yaw:0,pit:0,ty:0,tp:0,t:0,drag:null,strokes:0,full:0,onOut:null,onBack:null};
const dioG=new THREE.Group();dioG.rotation.x=Math.PI/2;dioG.position.y=-.2;lid.add(dioG);dioG.visible=false;
const DU=100,DK=SCRW/7.68*.78; // boîte ronde : le couvercle est plus large, on garde la boîte-souvenir à la taille de l'écrandioG.scale.setScalar(DK);
const dioBox=new THREE.Group();dioG.add(dioBox); // la boîte (tourne)
const dioDeco=new THREE.Group();dioG.add(dioDeco); // la feuille, le dessin, l'étoile (fixes)
const DSB=.8,DGAP=2.0; // taille de la boîte, et sa distance au couvercle une fois sortie
const dioTex=(c)=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t};
const dioBasic=(o)=>new THREE.MeshBasicMaterial(Object.assign({side:THREE.DoubleSide,transparent:true},o));
// le chapeau de Papa, pendu à la patère et penché vers nous : on voit le dessus de la calotte
function drawHat(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);
 x.save();x.filter='blur(7px)';x.fillStyle='rgba(30,15,40,.33)';x.beginPath();x.ellipse(10,30,76,40,0,0,7);x.fill();x.restore();
 x.fillStyle='#9a6a3a';x.beginPath();x.roundRect(-46,-92,92,18,5);x.fill();x.fillStyle='#7a4a26';x.fillRect(-46,-78,92,4);
 x.strokeStyle='#7a4a26';x.lineWidth=8;x.lineCap='round';x.beginPath();x.moveTo(0,-76);x.lineTo(0,-30);x.stroke();
 const g=x.createLinearGradient(0,-20,0,64);g.addColorStop(0,'#3e3756');g.addColorStop(1,'#1e1a2e');
 x.fillStyle=g;x.beginPath();x.ellipse(0,22,74,40,0,0,7);x.fill();x.strokeStyle='#120e1c';x.lineWidth=2.2;x.stroke();
 x.strokeStyle='rgba(255,255,255,.15)';x.lineWidth=2.5;x.beginPath();x.ellipse(0,22,70,36,0,Math.PI*1.08,Math.PI*1.92);x.stroke();
 const side=x.createLinearGradient(-42,0,42,0);side.addColorStop(0,'#2a2440');side.addColorStop(.45,'#3d3658');side.addColorStop(1,'#231e36');
 x.fillStyle=side;x.beginPath();x.ellipse(0,16,42,22,0,0,Math.PI);x.lineTo(-38,-14);x.ellipse(0,-14,38,19,0,Math.PI,0,true);x.closePath();x.fill();
 x.fillStyle='#6a5034';x.beginPath();x.ellipse(0,16,42.5,22.5,0,0,Math.PI);x.lineTo(-41,6);x.ellipse(0,6,41,21,0,Math.PI,0,true);x.closePath();x.fill();
 const top=x.createRadialGradient(-10,-18,3,0,-14,40);top.addColorStop(0,'#5a537c');top.addColorStop(1,'#2e2845');
 x.fillStyle=top;x.beginPath();x.ellipse(0,-14,38,19,0,0,7);x.fill();x.strokeStyle='#15111f';x.lineWidth=2;x.stroke();
 x.strokeStyle='#15111f';x.lineWidth=3.2;x.lineCap='round';x.beginPath();x.moveTo(-24,-15);x.quadraticCurveTo(0,-9,24,-15);x.stroke();
 x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=2;x.beginPath();x.moveTo(-22,-19);x.quadraticCurveTo(0,-14,22,-19);x.stroke();
 x.fillStyle='rgba(18,14,30,.55)';x.beginPath();x.ellipse(-22,-4,3.5,7,.25,0,7);x.ellipse(22,-4,3.5,7,-.25,0,7);x.fill();
 x.save();x.translate(34,10);x.rotate(-.5);x.fillStyle='#b8763a';x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(11,-20,5,-44);x.quadraticCurveTo(-7,-22,0,0);x.fill();x.strokeStyle='#7a4a1a';x.lineWidth=1.4;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(4,-22,5,-42);x.stroke();x.restore();
 x.restore()}
// où se cache le détail de chaque souvenir : sur quelle paroi, à quelle profondeur, à quelle hauteur
// les souvenirs qui se passent dehors : parois de ciel
const DIOSKY={}; // aucun souvenir dehors dans cette boîte (sinon : id:'couchant' ou 'nuit')
// La langue circulaire : le monde de Maman, caché sur une paroi (carnet, carton, vieux carnet, croquis, dos de la carte)
const DIOHID={escalier:{wall:-1,d:.5,h:.12,s:1.15},canape:{wall:1,d:.5,h:.15,s:1.15},encre:{wall:-1,d:.5,h:.1,s:1.15},fin:{wall:1,d:.5,h:.1,s:1.1},ia:{wall:-1,d:.5,h:.15,s:1.1}};
const bboxOf=(c)=>{const W=c.width,H=c.height,d=c.getContext('2d').getImageData(0,0,W,H).data;let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2){if(d[(y*W+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}}return x1<0?null:[Math.max(0,x0-2),Math.max(0,y0-2),Math.min(W,x1+3),Math.min(H,y1+3)]};
const cropC=(c,b)=>{const o=document.createElement('canvas');o.width=b[2]-b[0];o.height=b[3]-b[1];o.getContext('2d').drawImage(c,-b[0],-b[1]);return o};
function hiddenCanvas(id){if(id==='maman'){const c=document.createElement('canvas');c.width=c.height=260;drawHat(c.getContext('2d'),130,140,1.1);return c}
  const R=REVEAL[id]&&(REVC[id]||(REVC[id]=REVEAL[id]()));const c=R&&(R.c||R);return c&&c.getContext?c:null}
// l'esquisse au crayon, tirée des contours des pièces du souvenir
function sketchOf(P,b){const S=384,k=S/768,W=Math.round((b[2]-b[0])*k),H=Math.round((b[3]-b[1])*k);const acc=new Float32Array(W*H);
  const tmp=document.createElement('canvas');tmp.width=W;tmp.height=H;const tx=tmp.getContext('2d');
  const edge=(src,mode,w)=>{tx.clearRect(0,0,W,H);tx.drawImage(src,-b[0]*k,-b[1]*k,768*k,768*k);const d=tx.getImageData(0,0,W,H).data;const v=new Float32Array(W*H);for(let i=0;i<W*H;i++)v[i]=mode?d[i*4+3]/255:(d[i*4]*.3+d[i*4+1]*.59+d[i*4+2]*.11)/255*(d[i*4+3]/255);
    for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;const gx=v[i+1]-v[i-1]+.5*(v[i-W+1]-v[i-W-1]+v[i+W+1]-v[i+W-1]),gy=v[i+W]-v[i-W]+.5*(v[i+W-1]-v[i-W-1]+v[i+W+1]-v[i-W+1]);const g=Math.hypot(gx,gy)*w;if(g>acc[i])acc[i]=g}};
  P.forEach((p,i)=>{if(i)edge(p.c,1,1.2)});const comp=document.createElement('canvas');comp.width=comp.height=768;const cx=comp.getContext('2d');P.forEach((p,i)=>{if(i)cx.drawImage(p.c,0,0)});edge(comp,0,.9);
  const o=document.createElement('canvas');o.width=W*2;o.height=H*2;const ox=o.getContext('2d');const img=tx.createImageData(W,H);
  for(let i=0;i<W*H;i++){const a=Math.max(0,Math.min(1,(acc[i]-.22)/.5))*(.6+.4*Math.random());img.data[i*4]=78;img.data[i*4+1]=76;img.data[i*4+2]=90;img.data[i*4+3]=a*150}
  tx.putImageData(img,0,0);ox.imageSmoothingEnabled=true;ox.drawImage(tmp,0,0,W*2,H*2);ox.globalAlpha=.5;ox.drawImage(tmp,2,2,W*2,H*2);return o}
// la feuille du carnet, à petits carreaux, avec la marge rouge
const dioSheetC=document.createElement('canvas');dioSheetC.width=720;dioSheetC.height=740;
{const x=dioSheetC.getContext('2d');x.fillStyle='#f7f1e1';x.fillRect(0,0,720,740);x.strokeStyle='rgba(90,130,200,.2)';x.lineWidth=1;for(let u=0;u<740;u+=24){x.beginPath();x.moveTo(0,u);x.lineTo(720,u);x.stroke();if(u<720){x.beginPath();x.moveTo(u,0);x.lineTo(u,740);x.stroke()}}
 x.strokeStyle='rgba(210,80,80,.45)';x.lineWidth=2;x.beginPath();x.moveTo(30,0);x.lineTo(30,740);x.stroke();for(let i=0;i<4000;i++){x.fillStyle=`rgba(120,90,50,${Math.random()*.05})`;x.fillRect(Math.random()*720,Math.random()*740,2,1)}}
const dioSheet=new THREE.Mesh(new THREE.PlaneGeometry(1,1),dioBasic({map:dioTex(dioSheetC),opacity:0,depthWrite:false}));dioSheet.position.z=.02;dioSheet.rotation.z=-.015;dioDeco.add(dioSheet);
const dioDrawC=document.createElement('canvas');dioDrawC.width=640;dioDrawC.height=640;const dioDrawX=dioDrawC.getContext('2d');const dioDrawT=dioTex(dioDrawC);
const dioDraw=new THREE.Mesh(new THREE.PlaneGeometry(1,1),dioBasic({map:dioDrawT,depthWrite:false}));dioDraw.position.z=.04;dioDeco.add(dioDraw);
const dioMaskC=document.createElement('canvas');dioMaskC.width=160;dioMaskC.height=160;const dioMaskX=dioMaskC.getContext('2d');
const dioStarC=document.createElement('canvas');dioStarC.width=dioStarC.height=128;{const x=dioStarC.getContext('2d');const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,230,160,1)');g.addColorStop(.25,'rgba(255,210,122,.8)');g.addColorStop(1,'rgba(255,210,122,0)');x.fillStyle=g;x.fillRect(0,0,128,128);x.fillStyle='#fff6d8';x.beginPath();x.moveTo(64,14);x.quadraticCurveTo(70,58,114,64);x.quadraticCurveTo(70,70,64,114);x.quadraticCurveTo(58,70,14,64);x.quadraticCurveTo(58,58,64,14);x.fill()}
const dioStar=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4),dioBasic({map:dioTex(dioStarC),opacity:0,depthWrite:false}));dioStar.position.z=.06;dioDeco.add(dioStar);
// la lumière du souvenir (rayons, poussières, effets) sur une fine couche à mi-profondeur
const dioFxC=document.createElement('canvas');dioFxC.width=dioFxC.height=384;const dioFxX=dioFxC.getContext('2d');const dioFxT=dioTex(dioFxC);
let dioFx=null,dioMats=[],DB=null,dioSketch=null;
function dioBuild(id){while(dioBox.children.length)dioBox.remove(dioBox.children[0]);dioMats=[];const P=POP[id].P;
  let b=bboxOf(P[0].c)||[70,40,698,680];P.forEach((p,i)=>{if(!i)return;const q=bboxOf(p.c);if(q)b=[Math.min(b[0],q[0]),Math.min(b[1],q[1]),Math.max(b[2],q[2]),Math.max(b[3],q[3])]});b=[Math.max(0,b[0]-8),Math.max(0,b[1]-8),Math.min(768,b[2]+8),Math.min(768,b[3]+8)];DB=b;const bx0=(b[0]-384)/DU,bx1=(b[2]-384)/DU,by1=(384-b[1])/DU,by0=(384-b[3])/DU;
  const CZ=30,D=4.2*.9+.5,sc=z=>(CZ-z)/CZ,sD=sc(D),ZO=-D/2;
  const add=(m)=>{dioBox.add(m);[].concat(m.material).forEach(x=>{x.userData.o=x.opacity;dioMats.push(x)});return m};
  const plane=(c,w,h,x,y,z,o={})=>add(new THREE.Mesh(new THREE.PlaneGeometry(w,h),dioBasic(Object.assign({map:dioTex(c),alphaTest:.02},o))));
  P.forEach((p,i)=>{const bb=i?bboxOf(p.c):b;if(!bb)return;const c=cropC(p.c,bb),z=p.depth*.9+(i?.12:0),s=sc(z),w=(bb[2]-bb[0])/DU*s,h=(bb[3]-bb[1])/DU*s,x=((bb[0]+bb[2])/2-384)/DU*s,y=(384-(bb[1]+bb[3])/2)/DU*s;
    if(i){const sh=plane(c,w,h,0,0,0,{color:0x000000,opacity:.3,depthWrite:false});sh.position.set(x+.05,y-.07,z-.04+ZO);if(p.when)sh.material.userData.w=p.when}
    const pm=plane(c,w,h,0,0,0);pm.position.set(x,y,z+ZO);if(p.when)pm.material.userData.w=p.when});
  // la lumière du souvenir
  {const z=2.0,s=sc(z);const m=add(new THREE.Mesh(new THREE.PlaneGeometry(7.68*s,7.68*s),dioBasic({map:dioFxT,depthWrite:false,blending:THREE.AdditiveBlending})));m.position.set(0,0,z+ZO);dioFx=POP[id]}
  // les parois : un tunnel de papier, du fond jusqu'à l'ouverture
  const wallT=dioTex(cropC(P[0].c,b));
  const quad=(p,mat)=>{const g=new THREE.BufferGeometry();const v=[],uv=[];const U4=[[0,0],[1,0],[1,1],[0,1]];[0,1,2,0,2,3].forEach(k=>{v.push(...p[k]);uv.push(...U4[k])});g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));return add(new THREE.Mesh(g,mat))};
  const Pp=(x,y,z,s)=>[x*s,y*s,z+ZO];
  const SKY=DIOSKY[id];
  if(SKY){// dehors : les parois sont du ciel, étoilé en haut ; au couchant, plus orangé vers le fond (le soleil est en face)
    const skyC=(side)=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,512);
      if(SKY==='couchant'){g.addColorStop(0,'#2c2866');g.addColorStop(.42,'#4a3c80');g.addColorStop(.74,'#a05e78');g.addColorStop(1,'#eea062')}else{g.addColorStop(0,'#1e2658');g.addColorStop(1,'#3a4690')}
      x.fillStyle=g;x.fillRect(0,0,512,512);
      if(SKY==='couchant'&&side){const bx=side>0?0:512,h=x.createRadialGradient(bx,560,0,bx,560,520);h.addColorStop(0,'rgba(255,180,100,.55)');h.addColorStop(1,'rgba(255,180,100,0)');x.fillStyle=h;x.fillRect(0,0,512,512)}
      let r=7+(side+2)*13;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647};
      for(let i=0;i<110;i++){const sx=rnd()*512,sy=Math.pow(rnd(),1.6)*(side?380:512),a=(1-sy/(side?420:600))*(.4+.6*rnd());x.fillStyle=`rgba(255,246,220,${a})`;x.beginPath();x.arc(sx,sy,1.2+rnd()*2,0,7);x.fill()}
      for(let i=0;i<5;i++){const sx=rnd()*512,sy=rnd()*(side?220:512);x.fillStyle='rgba(255,240,200,.9)';x.beginPath();for(let k=0;k<8;k++){const a=k/8*Math.PI*2,q=k%2?1.6:5;x.lineTo(sx+Math.cos(a)*q,sy+Math.sin(a)*q)}x.fill()}
      return dioTex(c)};
    quad([Pp(bx0,by0,0,1),Pp(bx0,by0,D,sD),Pp(bx0,by1,D,sD),Pp(bx0,by1,0,1)],dioBasic({map:skyC(-1),color:0xf2eef6}));
    quad([Pp(bx1,by0,D,sD),Pp(bx1,by0,0,1),Pp(bx1,by1,0,1),Pp(bx1,by1,D,sD)],dioBasic({map:skyC(1),color:0xdcd6e4}));
    quad([Pp(bx0,by1,0,1),Pp(bx0,by1,D,sD),Pp(bx1,by1,D,sD),Pp(bx1,by1,0,1)],dioBasic({map:skyC(0),color:0xc8c2d4}));
  }else{
  quad([Pp(bx0,by0,0,1),Pp(bx0,by0,D,sD),Pp(bx0,by1,D,sD),Pp(bx0,by1,0,1)],dioBasic({map:wallT,color:0xb9a6c4}));
  quad([Pp(bx1,by0,D,sD),Pp(bx1,by0,0,1),Pp(bx1,by1,0,1),Pp(bx1,by1,D,sD)],dioBasic({map:wallT,color:0x9c8aa8}));
  quad([Pp(bx0,by1,0,1),Pp(bx0,by1,D,sD),Pp(bx1,by1,D,sD),Pp(bx1,by1,0,1)],dioBasic({map:wallT,color:0x6f6280}))}
  const fl=document.createElement('canvas');fl.width=512;fl.height=256;{const x=fl.getContext('2d');if(SKY){x.fillStyle=SKY==='couchant'?'#4a3a4e':'#2e3442';x.fillRect(0,0,512,256);for(let i=0;i<500;i++){x.fillStyle=i%3?'rgba(20,12,24,.28)':'rgba(255,220,180,.10)';x.beginPath();x.arc(Math.random()*512,Math.random()*256,1+Math.random()*3,0,7);x.fill()}}else{x.fillStyle='#8a5d36';x.fillRect(0,0,512,256);for(let i=0;i<14;i++){x.fillStyle=i%2?'rgba(60,35,15,.25)':'rgba(255,230,190,.08)';x.fillRect(0,i*19,512,2)}}}
  quad([Pp(bx0,by0,D,sD),Pp(bx0,by0,0,1),Pp(bx1,by0,0,1),Pp(bx1,by0,D,sD)],dioBasic({map:dioTex(fl),color:0xc9b08f}));
  // le détail caché, contre une paroi : invisible de face, il se découvre en tournant
  const H=DIOHID[id],hc=hiddenCanvas(id),hb=hc&&bboxOf(hc);
  if(H&&hb){const c=cropC(hc,hb),z=D*H.d,s=sc(z),hw=(hb[2]-hb[0])/DU*H.s*s,hh=(hb[3]-hb[1])/DU*H.s*s;const wx=(H.wall<0?bx0:bx1)*s-H.wall*(.04+hw*.22),wy=H.stand?by0*s+hh/2:(by1*H.h)*s;
    const m=plane(c,hw,hh,0,0,0);m.position.set(wx,wy,z+ZO);m.rotation.y=H.wall<0?Math.PI/2-Math.atan2(bx0*(1-sD),D):-Math.PI/2+Math.atan2(bx1*(1-sD),D);DIO.hid={x:wx*DSB,wall:H.wall,m,r0:m.rotation.y,x0:wx,stand:!!H.stand}}
  else DIO.hid=null;
  // la boîte de carton : le cadre de l'ouverture et la coque
  const kr=document.createElement('canvas');kr.width=kr.height=256;{const x=kr.getContext('2d');x.fillStyle='#c79c66';x.fillRect(0,0,256,256);for(let i=0;i<2500;i++){x.fillStyle=Math.random()<.5?`rgba(255,240,210,${Math.random()*.12})`:`rgba(90,55,20,${Math.random()*.14})`;x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*3,1)}}
  const kT=dioTex(kr);const kM=(c=0xffffff)=>dioBasic({map:kT,color:c});
  const ox0=bx0*sD,ox1=bx1*sD,oy0=by0*sD,oy1=by1*sD,M=.55;
  {const sh=new THREE.Shape();sh.moveTo(ox0-M,oy0-M);sh.lineTo(ox1+M,oy0-M);sh.lineTo(ox1+M,oy1+M);sh.lineTo(ox0-M,oy1+M);sh.closePath();const h=new THREE.Path();h.moveTo(ox0,oy0);h.lineTo(ox1,oy0);h.lineTo(ox1,oy1);h.lineTo(ox0,oy1);h.closePath();sh.holes.push(h);
   const m=add(new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.18,bevelEnabled:false}),[kM(),kM(0xa8834f)]));m.position.z=D+ZO-.02}
  const k0=bx0-M*.6,k1=bx1+M*.6,k2=by0-M*.6,k3=by1+M*.6;
  quad([[k0,k2,ZO-.05],[k1,k2,ZO-.05],[k1,k3,ZO-.05],[k0,k3,ZO-.05]],kM(0x9a7444));
  quad([[k0,k2,ZO-.05],[ox0-M,oy0-M,D+ZO],[ox0-M,oy1+M,D+ZO],[k0,k3,ZO-.05]],kM(0xb08550));
  quad([[ox1+M,oy0-M,D+ZO],[k1,k2,ZO-.05],[k1,k3,ZO-.05],[ox1+M,oy1+M,D+ZO]],kM(0x9c7646));
  quad([[k0,k3,ZO-.05],[ox0-M,oy1+M,D+ZO],[ox1+M,oy1+M,D+ZO],[k1,k3,ZO-.05]],kM(0xd2ac78));
  quad([[ox0-M,oy0-M,D+ZO],[k0,k2,ZO-.05],[k1,k2,ZO-.05],[ox1+M,oy0-M,D+ZO]],kM(0x8a663a));
  // ordre de dessin du fond vers l'avant : quand la boîte est presque plate (elle sort du dessin, elle y rentre), les couches ne se chevauchent plus
  dioBox.children.forEach(m=>{m.geometry.computeBoundingSphere();m.renderOrder=Math.round((m.position.z+m.geometry.boundingSphere.center.z+20)*100)});
  DIO.D=D;DIO.box=[ox0-M,ox1+M,oy0-M,oy1+M];
  // la feuille et le dessin, à la taille du cadre (vu à plat, posé sur le couvercle)
  const fw=(ox1-ox0+2*M)*DSB,fh=(oy1-oy0+2*M)*DSB,fx=(ox0+ox1)/2*DSB,fy=(oy0+oy1)/2*DSB;
  dioSheet.scale.set(fw*1.12,fh*1.12,1);dioSheet.position.set(fx,fy,.02);dioDraw.scale.set(fw,fh,1);dioDraw.position.set(fx,fy,.04);
  dioSketch=sketchOf(P,b);DIO.frame=[fx,fy,fw,fh]}
function dioDrawPaint(p,fade){const x=dioDrawX;x.clearRect(0,0,640,640);x.globalAlpha=fade;x.strokeStyle='rgba(60,58,72,.75)';x.lineWidth=4;x.lineCap='round';
  const per=[[10,10],[630,10],[630,630],[10,630],[10,10]];let L=0;const seg=[];for(let i=0;i<4;i++){const a=per[i],b=per[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]);seg.push([a,b,l]);L+=l}
  let left=Math.min(1,p)*L;x.beginPath();x.moveTo(10,10);for(const [a,b,l] of seg){if(left<=0)break;const k=Math.min(1,left/l);x.lineTo(a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k);left-=l}x.stroke();
  if(dioSketch){const t=dioDrawPaint.t||(dioDrawPaint.t=document.createElement('canvas'));t.width=t.height=640;const tx=t.getContext('2d');tx.clearRect(0,0,640,640);const m=.55/DSB*0+40;tx.drawImage(dioSketch,m,m,640-2*m,640-2*m);
    tx.globalCompositeOperation='destination-in';tx.drawImage(dioMaskC,0,0,640,640);tx.globalCompositeOperation='source-over';if(DIO.full>0){tx.globalAlpha=DIO.full;tx.drawImage(dioSketch,m,m,640-2*m,640-2*m);tx.globalAlpha=1}x.drawImage(t,0,0)}
  x.globalAlpha=1;dioDrawT.needsUpdate=true}
function dioBrush(u,v){const x=u*160,y=(1-v)*160;const g=dioMaskX.createRadialGradient(x,y,0,x,y,15);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');dioMaskX.fillStyle=g;dioMaskX.fillRect(x-15,y-15,30,30)}
function dioCoverage(){const d=dioMaskX.getImageData(0,0,160,160).data;let n=0;for(let i=3;i<d.length;i+=16)if(d[i]>60)n++;return n/(d.length/16)}
const dsm=t=>t<0?0:t>1?1:t*t*(3-2*t);
function dioSetBox(k){dioBox.scale.set(DSB,DSB,DSB*Math.max(.02,k));dioBox.position.z=.06+(DGAP+DIO.D/2*DSB)*k;const o=dsm(k*4),dt=k>.97;dioMats.forEach(m=>{m.opacity=m.userData.o*(m.userData.w?m.userData.w():1)*o;m.depthTest=dt});return o}
// l'aide : la main qui tient un crayon, et le crayon qui suit le doigt
const dioHand=document.createElement('div');dioHand.setAttribute('aria-hidden','true');dioHand.style.cssText='position:fixed;left:0;top:0;pointer-events:none;opacity:0;transition:opacity .4s;transform:translate(-28px,-102px);z-index:30';
const DPEN='<g transform="translate(36 132) rotate(37)"><g transform="rotate(-90)"><path d="M0 0 L14 -5 L14 5 Z" fill="#f0d6aa"/><path d="M0 0 L5 -1.8 L5 1.8Z" fill="#2a1a22"/><rect x="14" y="-5" width="84" height="10" fill="#f2b833"/><rect x="14" y="-5" width="84" height="3.3" fill="#f8d066"/><rect x="98" y="-5.4" width="7" height="10.8" fill="#bdb8ae"/><rect x="104" y="-5.4" width="9" height="10.8" rx="3.5" fill="#e0705a"/><path d="M0 0 L14 -5 H104 M0 0 L14 5 H104" fill="none" stroke="#2a1a22" stroke-width="2" stroke-linejoin="round"/><rect x="104" y="-5.4" width="9" height="10.8" rx="3.5" fill="none" stroke="#2a1a22" stroke-width="2"/><path d="M14 -5 V5" stroke="#2a1a22" stroke-width="1.4"/></g></g>';
dioHand.innerHTML='<svg width="124" height="124" viewBox="0 0 160 160"><g transform="translate(36 132) rotate(37)"><g transform="rotate(-90)"><path d="M0 0 L14 -5 L14 5 Z" fill="#f0d6aa"/><path d="M0 0 L5 -1.8 L5 1.8Z" fill="#2a1a22"/><rect x="14" y="-5" width="84" height="10" fill="#f2b833"/><rect x="14" y="-5" width="84" height="3.3" fill="#f8d066"/><rect x="98" y="-5.4" width="7" height="10.8" fill="#bdb8ae"/><rect x="104" y="-5.4" width="9" height="10.8" rx="3.5" fill="#e0705a"/><path d="M0 0 L14 -5 H104 M0 0 L14 5 H104" fill="none" stroke="#2a1a22" stroke-width="2" stroke-linejoin="round"/><rect x="104" y="-5.4" width="9" height="10.8" rx="3.5" fill="none" stroke="#2a1a22" stroke-width="2"/><path d="M14 -5 V5" stroke="#2a1a22" stroke-width="1.4"/></g><g fill="#fffaf0" stroke="#2a1a22" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M-6 -70 C-4 -81 22 -85 34 -69 C43 -56 39 -32 27 -24 C19 -19 8 -20 2 -22 Z"/><rect x="-13" y="-74" width="24" height="14" rx="7"/><rect x="-15" y="-61" width="25" height="14" rx="7"/><rect x="-15" y="-48" width="25" height="14" rx="7"/><rect x="-12" y="-35" width="22" height="13" rx="6.5"/><path d="M26 -68 C14 -70 2 -69 -4 -64 C-10 -59 -8 -51 -1 -51 C8 -51 16 -51 26 -50 Z" stroke="none"/><path d="M17 -69 C8 -69 1 -68 -4 -64 C-10 -59 -8 -51 -1 -51 C6 -51 12 -51 17 -51" fill="none"/></g></g></svg>';
const dioPen=document.createElement('div');dioPen.setAttribute('aria-hidden','true');dioPen.style.cssText='position:fixed;left:0;top:0;pointer-events:none;opacity:0;transform:translate(-18px,-66px);z-index:30';dioPen.innerHTML='<svg width="80" height="80" viewBox="0 0 160 160">'+DPEN+'</svg>';
// la phrase d'Alice quand on découvre le détail : un papier collé en haut de l'écran, qui ne cache rien
const dioNote=document.createElement('div');dioNote.style.cssText='position:fixed;left:50%;top:calc(max(14px,env(safe-area-inset-top)) + 56px);transform:translateX(-50%) rotate(-1.5deg);width:min(330px,80vw);padding:10px 16px;background:#f8f1df;color:#22306e;font:600 21px/1.2 Caveat,cursive;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.45);opacity:0;transition:opacity 1s;pointer-events:none;z-index:25';
document.body.append(dioHand,dioPen,dioNote);
const dioToWorld=(x,y,z)=>dioG.localToWorld(new THREE.Vector3(x,y,z));
function dioHandAt(t){const f=DIO.frame;if(!f)return;const k=(t*.6)%1,e=.5-.5*Math.cos(k*Math.PI*2);const p=dioToWorld(f[0]+f[2]*(-.25+.5*e),f[1]+f[3]*(-.05+.1*Math.sin(k*Math.PI*4)),.05).project(camera);const r=cv.getBoundingClientRect();dioHand.style.left=(r.left+(p.x+1)/2*r.width)+'px';dioHand.style.top=(r.top+(1-p.y)/2*r.height)+'px'}
function dioHit(e){toNDC(e);const h=ray.intersectObject(dioDraw,false)[0];return h&&h.uv?h.uv:null}
// ----- le déroulé -----
DIO.start=(id,onOut)=>{DIO.id=id;DIO.seen=false;DIO.hidT=0;DIO.onOut=onOut;DIO.ph='sheet';DIO.t=0;DIO.need=false;DIO.found=false;DIO.strokes=0;DIO.full=0;DIO.yaw=DIO.pit=DIO.ty=DIO.tp=0;dioMaskX.clearRect(0,0,160,160);
  dioBuild(id);if(DIO.host)DIO.host.attach(DIO.frame);dioBox.rotation.set(0,0,0);dioSetBox(0);dioBox.visible=false;dioG.visible=true;dioStar.material.opacity=0;dioNote.style.opacity=0;dioDrawPaint(0,0);
  showHint('Crayonner le souvenir du bout du doigt.')};
DIO.needFind=(text)=>{DIO.need=true;DIO.lesson=text;if(!DIO.seen)showHint('Tourner doucement la boîte du doigt : quelque chose s’y cache.')};
// où l'étoile va se poser dans la constellation du couvercle
function dioGoal(){const st=STARS[Math.min(lit,STARS.length-1)];DIO.goal=st?[(st[0]/MS-.5)*SCRW/dioG.scale.x,(.5-st[1]/MS)*SCRW/dioG.scale.x]:null}
DIO.close=(onBack)=>{if(!DIO.ph){onBack&&onBack();return}DIO.onBack=onBack;dioGoal();DIO.ph='back';DIO.t=0;dioNote.style.opacity=0;hideSay()};
DIO.down=(e)=>{if(!DIO.ph)return false;if(DIO.ph==='draw'){const uv=dioHit(e);DIO.drag={draw:true,uv};if(uv)dioBrush(uv.x,uv.y);DIO.strokes++;dioPen.style.left=e.clientX+'px';dioPen.style.top=e.clientY+'px';dioPen.style.opacity=1;return true}
  if(DIO.ph==='out'){DIO.drag={x:e.clientX,y:e.clientY,ty:DIO.ty,tp:DIO.tp,moved:false};DIO.touched=true;return true}return DIO.ph!=='sheet'||true};
DIO.move=(e)=>{const d=DIO.drag;if(!d)return!!DIO.ph;if(d.draw){const uv=dioHit(e);dioPen.style.left=e.clientX+'px';dioPen.style.top=e.clientY+'px';if(uv){if(d.uv){for(let i=1;i<=8;i++)dioBrush(d.uv.x+(uv.x-d.uv.x)*i/8,d.uv.y+(uv.y-d.uv.y)*i/8)}d.uv=uv}return true}
  const k=Math.min(innerWidth,innerHeight);if(Math.abs(e.clientX-d.x)+Math.abs(e.clientY-d.y)>8)d.moved=true;DIO.ty=clamp(d.ty+(e.clientX-d.x)/k*1.4,-.62,.62);DIO.tp=clamp(d.tp+(e.clientY-d.y)/k,-.18,.42);return true};
DIO.up=()=>{const d=DIO.drag;DIO.drag=null;dioPen.style.opacity=0;if(!DIO.ph)return false;if(d&&!d.draw&&!d.moved&&waitTap)advance();return true};
function dioTick(dt,T){if(!DIO.ph)return;DIO.t+=dt;const t=DIO.t;
  if(AUTO&&DIO.ph==='draw'&&t>1.2){DIO.strokes=1;dioMaskX.fillRect(0,0,160,160)}
  if(DIO.ph==='sheet'){dioSheet.material.opacity=dsm(t/.5);dioDrawPaint(dsm(t/1.1),1);if(t>1.1){DIO.ph='draw';DIO.t=0}}
  else if(DIO.ph==='draw'){dioDrawPaint(1,1);dioHand.style.opacity=DIO.strokes?0:(t>.4?1:0);if(!DIO.strokes&&t>.4)dioHandAt(t);if(DIO.strokes&&!DIO.drag&&dioCoverage()>.16){DIO.ph='fill';DIO.t=0;dioHand.style.opacity=0}}
  else if(DIO.ph==='fill'){DIO.full=dsm(t/.9);dioDrawPaint(1,1);if(t>1.1){DIO.ph='rise';DIO.t=0;dioBox.visible=true;sndPaper(.5,.4)}}
  else if(DIO.ph==='rise'){const k=dsm(t/1.8),o=dioSetBox(k);dioDrawPaint(1,1-o);dioSheet.material.opacity=1-o;if(t>1.85){DIO.ph='out';DIO.t=0;DIO.touched=false;const f=DIO.onOut;DIO.onOut=null;f&&f()}}
  else if(DIO.ph==='out'){dioMats.forEach(m=>{if(m.userData.w)m.opacity=m.userData.o*m.userData.w()});if(!DIO.drag&&!DIO.touched)DIO.ty=Math.sin(t*.7)*.18;else if(!DIO.drag){DIO.ty*=Math.pow(.6,dt);DIO.tp*=Math.pow(.6,dt)}
    if(AUTO&&DIO.need&&!DIO.found&&t>1.5&&DIO.hid)DIO.ty=.5*DIO.hid.wall;
    // trouvé en avance (pendant qu'Alice parle) : on s'en souvient, la phrase viendra à son heure
    if(DIO.touched&&DIO.hid&&DIO.yaw*DIO.hid.wall>.3)DIO.seen=true;
    if(DIO.need&&!DIO.found&&DIO.hid&&(DIO.seen||DIO.yaw*DIO.hid.wall>.3)){DIO.found=true;DIO.need=false;DIO.hidT=performance.now();dioNote.textContent=DIO.lesson;dioNote.style.opacity=1;sndPaper(.4,.3);sndTone(523,1.2,.05);showHint('Toucher pour continuer.');waitTap=true}}
  else if(DIO.ph==='back'){const k=1-dsm(t/1.6),o=dioSetBox(k);DIO.ty*=Math.pow(.2,dt);DIO.tp*=Math.pow(.2,dt);dioDrawPaint(1,1-o);dioSheet.material.opacity=1-o;if(t>1.7){DIO.ph='star';DIO.t=0;dioBox.visible=false;DIO.sl=1;if(DIO.host){DIO.host.detach();DIO.host=null;dioGoal();DIO.sl=1.9}}}
  else if(DIO.ph==='star'){const sl=DIO.sl||1,k=dsm(t/(1.6*sl)),f=DIO.frame;dioDrawPaint(1,1-k);dioSheet.material.opacity=1-k;dioStar.material.opacity=Math.min(1,k*2)*(1-dsm((t-1.6*sl)/.5));const g=DIO.goal||[f[0]+f[2]*.25,f[1]+f[3]*.38];dioStar.position.set(lerp(f[0],g[0],k),lerp(f[1],g[1],k)+Math.sin(k*Math.PI)*.5,.06);dioStar.scale.setScalar(1.8-1.3*k);
    if(t>2.1*sl){DIO.ph=null;dioG.visible=false;const cb=DIO.onBack;DIO.onBack=null;cb&&cb()}}
  DIO.yaw+=(DIO.ty-DIO.yaw)*(1-Math.pow(.002,dt));DIO.pit+=(DIO.tp-DIO.pit)*(1-Math.pow(.002,dt));dioBox.rotation.set(DIO.pit,DIO.yaw,0);
  // la lumière du souvenir
  if(dioBox.visible&&dioFx&&dioFx.fx){dioFxX.clearRect(0,0,384,384);dioFxX.save();dioFxX.scale(.5,.5);dioFx.fx(dioFxX,T);dioFxX.restore();dioFxT.needsUpdate=true}}

if(/test/.test(location.hash))window.__D={dio:(id)=>{camMode='lid';SCR.kind='mem';SCR.id=id;SCR.ta=1;SCR.dio=true;DIO.start(id,()=>{})},fill:()=>{DIO.strokes=1;dioMaskX.fillRect(0,0,160,160)},rot:(y,p)=>{DIO.ty=y;DIO.tp=p||0;DIO.touched=true},need:(t)=>DIO.needFind(t),close:()=>DIO.close(()=>{}),st:()=>[DIO.ph,DIO.found,+DIO.yaw.toFixed(2)]};
