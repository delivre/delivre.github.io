/* ---------- la figurine d'Alice : 14 ans, fine et délicate, blond doré ondulé, robe bleue moderne ---------- */
const fig=new THREE.Group();box.add(fig);
const hairTex=canvasTex(512,512,(x,W)=>{const g=x.createLinearGradient(0,0,0,W);g.addColorStop(0,'#ffe9a6');g.addColorStop(.45,'#f2c24c');g.addColorStop(1,'#c9902a');x.fillStyle=g;x.fillRect(0,0,W,W);
  for(let i=0;i<1100;i++){const cx=rnd(0,W),cy=rnd(0,W),t=cy/W;x.strokeStyle=hsl(rnd(38,46),rnd(75,92),82-t*28+rnd(-8,8),rnd(.35,.7));x.lineWidth=rnd(1.5,3.5);x.lineCap='round';x.beginPath();x.moveTo(cx,cy);x.bezierCurveTo(cx+8,cy+15,cx-8,cy+30,cx+rnd(-3,3),cy+rnd(40,60));x.stroke()}
  for(let i=0;i<80;i++){x.strokeStyle='rgba(255,250,225,.85)';x.lineWidth=2;const cx=rnd(0,W),cy=rnd(0,W*.5);x.beginPath();x.moveTo(cx,cy);x.quadraticCurveTo(cx+5,cy+10,cx,cy+rnd(16,30));x.stroke()}});
hairTex.wrapS=THREE.RepeatWrapping;hairTex.repeat.set(3,1);
const dressTex=canvasTex(512,256,(x,W,H)=>{x.fillStyle='#4f8ee8';x.fillRect(0,0,W,H);
  for(let i=0;i<700;i++)dab(x,rnd(0,W),rnd(0,H),rnd(10,22),rnd(4,8),Math.PI/2+rnd(-.2,.2),rnd(212,222),rnd(65,80),rnd(55,70),rnd(.2,.4));
  x.fillStyle='#ffffff';x.fillRect(0,H*.9,W,H*.03);x.setLineDash([6,5]);x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=2;x.beginPath();x.moveTo(0,H*.84);x.lineTo(W,H*.84);x.stroke();x.setLineDash([]);
  });// robe bleue unie, sans motifs
M.blonde=painted('#f2c24c',hairTex,{roughness:.42,clearcoat:.75,clearcoatRoughness:.28});M.blondeD=M.blonde.clone();M.blondeD.side=THREE.DoubleSide;PAINT.push({m:M.blondeD,map:hairTex,plain:new THREE.Color('#f2c24c').convertSRGBToLinear()});
M.dress=painted('#4d8fe6',dressTex,{roughness:.5,clearcoat:.6});
M.fair=plastic('#ffe9e0',{roughness:.5,clearcoat:.35,emissive:new THREE.Color('#ffd6c8').convertSRGBToLinear(),emissiveIntensity:.16});
const navy=plastic('#1d2a5a'),sole=plastic('#ff9ccc'),strap=plastic('#ffcf3f'),pearl=plastic('#fff8ee',{roughness:.15}),goldBar=plastic('#ffd27a',{metalness:.5,roughness:.25});
const P=(geo,mat,x,y,z,c=true)=>{const m=mesh(geo,mat,c,false);m.position.set(x,y,z);fig.add(m);return m};
const HR=.215,HY=.79;
// socle transparent
fig.add(at(mesh(new THREE.CylinderGeometry(.24,.26,.04,32),new THREE.MeshPhysicalMaterial({color:'#e8f4ff',transmission:.7,transparent:true,opacity:.6,roughness:.05}),false,true),0,.02,0));
// jambes fines (courtes) et baskets blanches
[-.05,.05].forEach(x=>{P(new THREE.CylinderGeometry(.03,.032,.16,12),M.fair,x,.135,0);
  const s=P(new THREE.SphereGeometry(.052,16,12),M.white,x,.058,.018);s.scale.set(1,.62,1.5);const so=P(new THREE.SphereGeometry(.054,16,8),sole,x,.04,.018);so.scale.set(1.02,.22,1.55)});
// robe trapèze, taille fine
{const prof=[[.04,.19],[.17,.19],[.175,.205],[.15,.27],[.12,.34],[.095,.4],[.093,.44],[.104,.48],[.098,.52],[.06,.545],[0,.55]].map(([r,y])=>new THREE.Vector2(r,y));
 fig.add(mesh(new THREE.LatheGeometry(prof,40),M.dress,true,false))}
P(new THREE.TorusGeometry(.055,.01,8,24),M.white,0,.54,0).rotation.x=Math.PI/2;
P(new THREE.CylinderGeometry(.028,.03,.06,12),M.fair,0,.565,0);
[-.105,.105].forEach(x=>{const s=P(new THREE.SphereGeometry(.045,14,10),M.dress,x,.5,0);s.scale.set(1,.85,1)});
// bras fins
const arms=[-.118,.118].map(x=>{const g=new THREE.Group();g.position.set(x,.495,0);fig.add(g);
  g.add(at(mesh(new THREE.CylinderGeometry(.03,.027,.16,10),M.fair,true,false),0,-.09,0));g.add(at(mesh(new THREE.SphereGeometry(.033,12,10),M.fair,true,false),0,-.18,0));g.rotation.z=x<0?-.1:.1;return g});
// pas de sac : Alice voyage léger


// tête
P(new THREE.SphereGeometry(HR,36,24),M.fair,0,HY,0);
// cheveux : calotte, longue chevelure ondulée dans le dos, frange, mèches devant les oreilles
{P(new THREE.SphereGeometry(HR+.017,40,20,0,Math.PI*2,0,Math.PI*.44),M.blonde,0,HY+.004,-.006,false);
 const back=new THREE.Group();back.position.set(0,HY,0);fig.add(back);
 {const R=HR+.024,g=new THREE.SphereGeometry(R,56,48,Math.PI*.5+.6,Math.PI*2-1.2,Math.PI*.28,Math.PI*.6),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i),low=Math.max(0,-v.y/R),ang=Math.atan2(v.z,v.x);
   v.y*=v.y<0?1.5:1.05;const k=1+low*.16+.065*Math.min(1,low*1.4)*Math.sin(ang*9+v.y*7)+.015*Math.sin(ang*23);v.x*=k;v.z*=k;
   if(low>.8){const e=(low-.8)*5;v.y+=e*.03*Math.cos(ang*9+v.y*7);v.x*=1-e*.06;v.z*=1-e*.06}p.setXYZ(i,v.x,v.y,v.z)}
  g.computeVertexNormals();back.add(mesh(g,M.blondeD,true,false))}
 fig.userData.back=back;
 const fr=P(new THREE.SphereGeometry(HR+.026,32,10,Math.PI*.5-1.05,2.1,Math.PI*.2,Math.PI*.15),M.blondeD,0,HY,0,false);fr.rotation.y=Math.PI;
 [[-.62,.35,1],[-.3,.22,1.1],[.05,-.15,1.15],[.38,-.32,1],[.66,-.4,.9]].forEach(([a,tilt,s])=>{const g=new THREE.Group();g.rotation.y=a;g.position.set(0,HY,0);fig.add(g);
   const l=mesh(new THREE.SphereGeometry(.056,16,12),M.blonde,false,false);l.scale.set(.85*s,1.12*s,.38);l.position.set(0,.088,HR-.004);l.rotation.set(-.35,0,tilt);g.add(l)});
 // mèches ondulées devant les oreilles
 [-1,1].forEach(sx=>{const pts=[];for(let k=0;k<=8;k++){const t=k/8;pts.push(new THREE.Vector3(sx*(HR-.01+t*.02)+sx*Math.sin(t*6)*.008,HY-.02-t*.2,.05-t*.02))}
   const tg=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.026,10,false);fig.add(mesh(tg,M.blonde,true,false));P(new THREE.SphereGeometry(.026,10,8),M.blonde,pts[8].x,pts[8].y,pts[8].z)});
 // barrette moderne sur le côté : barre dorée + perle
 const bar=P(new THREE.CylinderGeometry(.009,.009,.1,10),goldBar,-.15,HY+.12,.13,false);bar.rotation.set(.5,0,-1.0);
 const bar2=P(new THREE.CylinderGeometry(.009,.009,.08,10),goldBar,-.165,HY+.095,.125,false);bar2.rotation.set(.5,0,-1.0);
 P(new THREE.SphereGeometry(.016,12,10),pearl,-.115,HY+.145,.155,false)}
// visage : yeux bleu nuit, reflets, sourcils fins, petit sourire, joues
[-.074,.074].forEach(x=>{const e=P(new THREE.SphereGeometry(.033,16,12),navy,x,HY-.018,HR-.02,false);e.scale.set(.95,1.02,.42);const lid=P(new THREE.TorusGeometry(.031,.0055,6,16,Math.PI*.9),navy,x,HY-.016,HR-.008,false);lid.rotation.z=Math.PI*.05+(x<0?.12:-.12);
  P(new THREE.SphereGeometry(.01,8,6),new THREE.MeshBasicMaterial({color:'#fff'}),x-.009,HY+.004,HR-.006,false);P(new THREE.SphereGeometry(.0055,8,6),new THREE.MeshBasicMaterial({color:'#9fd0ff'}),x+.008,HY-.028,HR-.006,false);
  const b=P(new THREE.CylinderGeometry(.0075,.006,.05,6),plastic('#b88a3c'),x,HY+.04,HR-.01,false);b.rotation.z=Math.PI/2+(x<0?-.08:.08)});
{const m=P(new THREE.CylinderGeometry(.0045,.0045,.03,8),plastic('#c46a78'),.004,HY-.078,HR-.006,false);m.rotation.z=Math.PI/2+.12}
[-.13,.13].forEach(x=>{const c=P(new THREE.SphereGeometry(.032,10,8),new THREE.MeshBasicMaterial({color:'#ff9fb0',transparent:true,opacity:.18}),x,HY-.055,HR-.045,false);c.scale.z=.3});
fig.userData.arms=arms;
fig.position.set(0,TOP,5.1);fig.rotation.y=0;fig.scale.setScalar(1);

const figState={tx:0,tz:5.1,moving:false,phase:0};


/* ---------- version papier : Alice est une découpe (le même dessin que dans ses souvenirs), qui se retourne comme une carte ---------- */
const PF={};
if(PAPER){/* Alice reste en volume : une figurine de papier mat, ado de 14 ans ; son socle devient une rondelle de carton */fig.children[0].material=plastic('#c9a06a')}
function paperTick(T){if(!PAPER)return;const dt=Math.min(.1,Math.max(0,T-(PF.T||T)));PF.T=T;const v=new THREE.Vector3();
 const yaw=Math.atan2(camera.position.x-fig.position.x,camera.position.z-fig.position.z),R=[Math.cos(yaw),-Math.sin(yaw)];
 // les moutons
 sheep.forEach(g=>{const o=g.userData.pp;if(!o)return;const th=g.rotation.y,dot=Math.cos(th)*R[0]+(-Math.sin(th))*R[1];o.rotation.y=yaw-th;const t=dot>=0?1:-1;o.scale.x+=(t-o.scale.x)*Math.min(1,dt*10);if(Math.abs(o.scale.x)<.02)o.scale.x=.02*t})}
