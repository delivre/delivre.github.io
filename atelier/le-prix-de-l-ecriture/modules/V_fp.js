/* ---------- les lieux vécus de l'intérieur, à la première personne ----------
   On plonge de la carte jusque dans le lieu de la maquette. L'activité s'y joue en vrai volume, puis le souvenir
   sort sur place (une boîte dans le lieu, lui-même dans la boîte), avant que son étoile monte au couvercle.
   Le moteur est commun ; chaque lieu fournit sa configuration (FP_PLACES[n]) : où l'on s'assied, ce qu'on y fait. */
const FPM=PAPER&&!/flat/.test(location.hash);
const FPT={on:false,k:0,kT:0,st:null,t0:0,cb:null,yaw:0,yawT:0,drag:null,hand:[],sel:null,fly:[],auto:0,P:null,gen:0};
const FP_PLACES=[];
const fpG=new THREE.Group();fpG.visible=false; // les objets du moment (cartes posées, étiquettes), rattachés au lieu en cours
const fpTex=(c)=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t};
function fpCard(c,h,o={}){const w=h*c.width/c.height;const m=new THREE.MeshStandardMaterial({map:fpTex(c),transparent:true,alphaTest:.04,side:THREE.DoubleSide,roughness:.95,metalness:0});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);p.castShadow=!o.noShadow;p.userData.h=h;p.renderOrder=o.ro||0;return p}
// une étiquette de papier, écrite à la main
function fpTag(text,o={}){const W=o.w||360,H=o.h||132,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');tagBox(x,8,8,W-16,H-16,10);
  const lines=String(text).split('\n');lines.forEach((l,i)=>txt(x,l,W/2,H/2+(i-(lines.length-1)/2)*(o.fs||44)*1.05,o.fs||44,o.col||'#3a2410'));return c}
const fpDiscC=(n)=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle=x.createPattern(KRAFTP,'repeat');x.beginPath();x.arc(64,64,58,0,7);x.fill();
  x.strokeStyle='rgba(120,80,40,.85)';x.lineWidth=6;x.stroke();x.strokeStyle='rgba(120,80,40,.4)';x.lineWidth=3;x.beginPath();x.arc(64,64,46,0,7);x.stroke();
  if(n){x.font='700 64px Caveat, cursive';x.fillStyle='#5a3418';x.textAlign='center';x.textBaseline='middle';x.fillText(n,64,68)}return c};
// un lieu de dépôt : un disque de carton au sol (numéroté ou non) et une zone de toucher plus large
function fpSite(parent,pos,label,r=.045,hitR=.13,yaw=Math.PI){const m=new THREE.MeshStandardMaterial({map:fpTex(fpDiscC(label)),roughness:.95,emissive:new THREE.Color('#ffcf80'),emissiveIntensity:0});
  const d=new THREE.Mesh(new THREE.CircleGeometry(r,32),m);d.rotation.x=-Math.PI/2;d.rotation.z=yaw;d.position.copy(pos);d.receiveShadow=true;d.visible=false;parent.add(d);
  const hit=new THREE.Mesh(new THREE.SphereGeometry(hitR,8,6),new THREE.MeshBasicMaterial({visible:false}));hit.position.copy(pos).add(new THREE.Vector3(0,hitR*.5,0));parent.add(hit);d.userData.hit=hit;return d}
// la nuit qui tombe (un voile bleu nuit sur la vue) : pour cacher sans rideau
const fpNight=document.createElement('div');fpNight.style.cssText='position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .9s;background:radial-gradient(ellipse at 50% 35%,rgba(30,34,80,.86),rgba(6,6,22,.97))';cv.insertAdjacentElement('afterend',fpNight);
let fpCurtKT=0;
// le ciel : à hauteur du lieu, un vrai ciel de fin de journée (le soleil est du côté de la lumière de la maquette)
const fpSky=(()=>{const sd=new THREE.Vector3(sun.position.x,0,sun.position.z).normalize();sd.y=.16;sd.normalize();
  const m=new THREE.ShaderMaterial({side:THREE.BackSide,transparent:true,depthWrite:false,uniforms:{op:{value:0},sd:{value:sd}},
   vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'varying vec3 vD;uniform float op;uniform vec3 sd;float hs(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}'+
   'void main(){vec3 d=normalize(vD);float h=d.y;float s=max(dot(d,sd),0.);'+
   'vec3 hor=vec3(.98,.66,.42),mid=vec3(.62,.42,.58),zen=vec3(.13,.13,.32);vec3 c=mix(hor,mid,smoothstep(-.02,.22,h));c=mix(c,zen,smoothstep(.18,.75,h));'+
   'c+=vec3(1.,.72,.4)*pow(s,6.)*.55+vec3(1.,.9,.7)*pow(s,300.)*1.2;'+
   'vec3 q=floor(d*180.);float st=step(.996,hs(q))*smoothstep(.35,.8,h);c+=vec3(st*.9);gl_FragColor=vec4(c,op);}'});
  const o=new THREE.Mesh(new THREE.SphereGeometry(60,32,16),m);o.renderOrder=-10;o.frustumCulled=false;o.visible=false;scene.add(o);return o})();
// les objets posés dans le lieu (cartes, étiquettes)
const fpStage=[];function fpClearStage(){fpStage.forEach(o=>fpG.remove(o));fpStage.length=0}
function fpPut(c,h,pos,o={}){const p=fpCard(c,h,o);p.position.copy(pos).add(new THREE.Vector3(0,h/2,0));p.rotation.y=o.ry!=null?o.ry:FPT.P.face;p.userData.pop=performance.now();fpG.add(p);fpStage.push(p);return p}
function fpUnput(p){fpG.remove(p);const i=fpStage.indexOf(p);if(i>=0)fpStage.splice(i,1)}
// la main : des cartes tenues en bas de la vue (placées chaque image devant la caméra)
function fpSetHand(cards,stack){FPT.stack=!!stack;FPT.hand.forEach(o=>scene.remove(o.m));FPT.hand=cards.map((c)=>{const m=fpCard(c.c,.06,{noShadow:true,ro:20});m.material.depthTest=false;scene.add(m);return Object.assign({m,lift:0},c)});FPT.sel=null}
function fpHandTick(){const dg=FPT.drag&&FPT.drag.card&&FPT.drag.moved&&FPT.drag.p?FPT.drag:null;const n=FPT.hand.length;if(!n)return;const fw=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion),rt=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  const vh=2*Math.tan(camera.fov*Math.PI/360)*.3,vw=vh*camera.aspect,gap=Math.min(.075,vw*.9/n);
  if(FPT.stack){// des réponses écrites : l'une sous l'autre, bien lisibles
   FPT.hand.forEach((o,i)=>{const tl=(o===FPT.sel?1:0);o.lift+=(tl-o.lift)*.2;const w=o.m.geometry.parameters.width,h=o.m.geometry.parameters.height,s=Math.min(vw*.78/w,vh*.16/h),y=-vh*.02-i*h*s*1.12;
    o.m.position.copy(camera.position).addScaledVector(fw,.3).addScaledVector(up,y).addScaledVector(rt,o.lift*.006);o.m.quaternion.copy(camera.quaternion);o.m.rotateZ((i%2?.012:-.012));o.m.scale.setScalar(o.used?0.0001:s*(1+o.lift*.06))});return}
  FPT.hand.forEach((o,i)=>{const tl=(o===FPT.sel?1:0)+(o.hot?.5:0);o.lift+=(tl-o.lift)*.2;const x=(i-(n-1)/2)*gap,y=-vh*.2+o.lift*.012;
    o.m.position.copy(camera.position).addScaledVector(fw,.3).addScaledVector(rt,x).addScaledVector(up,y);o.m.quaternion.copy(camera.quaternion);o.m.rotateZ((i-(n-1)/2)*-.06);const w=o.m.geometry.parameters.width,fit=Math.min(1,gap*.94/w);o.m.scale.setScalar(o.used?0.0001:fit*(1+o.lift*.15));
    if(dg&&dg.card===o){const w2=FPT.P.g.localToWorld(dg.p.clone().add(new THREE.Vector3(0,FPT.P.dragLift||.09,0)));o.m.position.copy(w2);o.m.quaternion.copy(camera.quaternion);o.m.scale.setScalar(2.1)}})}
// une carte qui s'envole de la main (ou d'ailleurs) vers sa place
function fpFly(o,pos,h,done,from){if(o)o.used=true;const p=fpCard(o?o.c:from.c,h);p.position.copy(o?o.m.position:from.w);FPT.P.g.worldToLocal(p.position);p.rotation.y=FPT.P.face;fpG.add(p);fpStage.push(p);
  FPT.fly.push({p,a:p.position.clone(),b:pos.clone().add(new THREE.Vector3(0,h/2,0)),t0:performance.now(),done,arc:FPT.P.arc||.18});sndPaper(.35,.3);return p}
function fpFlyTick(now){for(let i=FPT.fly.length-1;i>=0;i--){const f=FPT.fly[i],u=clamp((now-f.t0)/700),e=u*u*(3-2*u);f.p.position.lerpVectors(f.a,f.b,e);f.p.position.y+=Math.sin(e*Math.PI)*f.arc;f.p.scale.setScalar(.35+.65*e);if(u>=1){FPT.fly.splice(i,1);f.done&&f.done()}}}
const fpHint=(t)=>showHint(t);
const fpAfter=(ms,fn)=>{const id=FPT.gen;setTimeout(()=>{if(FPT.gen===id&&FPT.on)fn()},AUTO?ms*.5:ms)};
function fpGo(st){FPT.st=st;FPT.t0=performance.now();FPT.auto=0;FPT.P.go(st)}
// fin de l'activité : on reste dans le lieu, le souvenir vient ici
function fpFinish(){FPT.st='mem';FPT.wait=false;fpSetHand([]);fpClearStage();(FPT.P.sites||[]).forEach(d=>d.visible=false);FPT.P.toMem&&FPT.P.toMem();const cb=FPT.cb;FPT.cb=null;cb&&cb()}
// attendre un toucher pour continuer
function fpWait(fn){FPT.wait=true;FPT.next=fn}
FPT.start=(n,cb)=>{const P=FP_PLACES[n];if(!P){cb&&cb();return}FPT.P=P;P.init&&!P.ready&&(P.init(),P.ready=1);P.g.add(fpG);ZH.el.classList.remove('on');FPT.cb=cb;DIO.host=FPT.host;FPT.on=true;FPT.kT=1;FPT.gen++;fpG.visible=true;FPT.yaw=FPT.yawT=0;fpCurtKT=0;fpClearStage();
  hideSay();P.enter&&P.enter();fpAfter(1900,()=>fpGo(P.first))};
const fpRay=new THREE.Raycaster();
function fpRayAt(e){const r=cv.getBoundingClientRect(),v=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);fpRay.setFromCamera(v,camera)}
function fpPick(e){fpRayAt(e);const hh=fpRay.intersectObjects(FPT.hand.filter(o=>!o.used).map(o=>o.m),false)[0];if(hh)return{hand:FPT.hand.find(o=>o.m===hh.object)};
  const S=(FPT.P.sites||[]),ph=fpRay.intersectObjects(S.filter(d=>d.visible).map(d=>d.userData.hit),false)[0];if(ph)return{site:S.findIndex(d=>d.userData.hit===ph.object)};
  const O=FPT.P.objs?FPT.P.objs():[],po=fpRay.intersectObjects(O,true)[0];if(po){let o=po.object;while(o&&o.userData.obj==null)o=o.parent;if(o)return{obj:o.userData.obj}}return{}}
const fpFloor=new THREE.Plane(new THREE.Vector3(0,1,0),0);
function fpFloorPt(e){fpRayAt(e);fpFloor.constant=-FPT.P.g.localToWorld(new THREE.Vector3(0,FPT.P.floorY||0,0)).y;const p=new THREE.Vector3();return fpRay.ray.intersectPlane(fpFloor,p)?FPT.P.g.worldToLocal(p):null}
const fpNear=(p)=>{let b=-1,bd=FPT.P.nearR||.17;(FPT.P.sites||[]).forEach((d,i)=>{if(!d.visible)return;const q=d.position;const dd=Math.hypot(p.x-q.x,p.z-q.z);if(dd<bd){bd=dd;b=i}});return b};
FPT.down=(e)=>{const h=FPT.P.canDrag&&FPT.P.canDrag()&&!FPT.fly.length?fpPick(e).hand:null;FPT.drag={x:e.clientX,y:e.clientY,yaw:FPT.yawT,moved:false,card:h&&!h.used?h:null};if(FPT.drag.card)FPT.sel=FPT.drag.card;return true};
FPT.move=(e)=>{const d=FPT.drag;if(!d)return;if(Math.abs(e.clientX-d.x)+Math.abs(e.clientY-d.y)>8)d.moved=true;if(d.card){if(d.moved){const p=fpFloorPt(e);d.p=p;d.near=p?fpNear(p):-1;(FPT.P.sites||[]).forEach((q,i)=>{if(q.visible)q.material.emissiveIntensity=i===d.near?.9:.08})}return}
  if(!FPT.P.noLook)FPT.yawT=clamp(d.yaw-(e.clientX-d.x)/Math.min(innerWidth,innerHeight)*1.2,-.55,.55)};
FPT.up=(e)=>{const d=FPT.drag;FPT.drag=null;if(!d||FPT.k<.9||FPT.fly.length)return;
  if(d.card&&d.moved){const o=d.card;if(d.near>=0)fpTap({site:d.near,card:o,dragged:true});else FPT.sel=null;return}
  if(d.moved)return;fpTap(fpPick(e))};
function fpTap(h={}){if(FPT.wait){FPT.wait=false;const f=FPT.next;FPT.next=null;f&&f();return}if(FPT.st==='mem'||FPT.st==='out')return;FPT.P.tap(FPT.st,h)}
// le souvenir sorti sur place : la feuille et la boîte apparaissent devant nous, dans le lieu
const fpAnchor=new THREE.Group();scene.add(fpAnchor);FPT.anchorD=.6;
FPT.host={attach(fr){fpAnchor.add(dioG);dioG.rotation.set(0,0,0);dioG.position.set(0,0,0);const D=FPT.anchorD,vf=camera.fov*Math.PI/180,vh=2*D*Math.tan(vf/2),vw=vh*camera.aspect;
   const sc=Math.min(.46*vw/fr[2],.3*vh/fr[3]);dioG.scale.setScalar(sc);FPT.anc={sc,fx:fr[0],fy:fr[1],vh}},
 detach(){lid.add(dioG);dioG.rotation.set(Math.PI/2,0,0);dioG.position.set(0,-.2,0);dioG.scale.setScalar(DK);FPT.exit()}};
function fpAnchorTick(){if(dioG.parent!==fpAnchor||!FPT.anc)return;const a=FPT.anc,fw=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion),rt=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  fpAnchor.quaternion.copy(camera.quaternion);fpAnchor.position.copy(camera.position).addScaledVector(fw,FPT.anchorD).addScaledVector(rt,-a.fx*a.sc).addScaledVector(up,-a.fy*a.sc+a.vh*.06)}
FPT.exit=()=>{FPT.st='out';camMode='lid';FPT.kT=0;DIO.host=null;const P=FPT.P;fpAfter(1900,()=>{FPT.on=false;fpG.visible=false;fpClearStage();(P.sites||[]).forEach(d=>d.visible=false);P.leave&&P.leave()})};
// la caméra : on plonge de la vue de la carte jusque dans le lieu (en arc, sans raser la maquette), et on en ressort
const fpPos=new THREE.Vector3(),fpLk=new THREE.Vector3(),fpQa=new THREE.Quaternion(),fpQb=new THREE.Quaternion(),fpM=new THREE.Matrix4();
function fpCam(dt){FPT.k+=(FPT.kT-FPT.k)*(1-Math.pow(.12,dt));if(Math.abs(FPT.k-FPT.kT)<.002)FPT.k=FPT.kT;const k=FPT.k;
  if(k<.001){if(camera.userData.fpFov){camera.fov=camera.userData.fpFov;camera.near=.1;camera.updateProjectionMatrix();camera.userData.fpFov=0;fpSky.visible=false;fig.visible=true}return}
  const P=FPT.P;if(!camera.userData.fpFov)camera.userData.fpFov=camera.fov;const f0=camera.userData.fpFov;
  if(DIO.ph)FPT.yawT=0;FPT.yaw+=(FPT.yawT-FPT.yaw)*.12;FPT.up2=(FPT.up2||0)+(((FPT.st==='mem'&&DIO.ph)?1:0)-(FPT.up2||0))*.05;const e=k*k*(3-2*k);
  fpPos.copy(P.eye);P.g.localToWorld(fpPos);const lk=P.look.clone().add(new THREE.Vector3(0,(P.memUp||.3)*FPT.up2,0)).sub(P.eye).applyAxisAngle(new THREE.Vector3(0,1,0),FPT.yaw).add(P.eye);fpLk.copy(lk);P.g.localToWorld(fpLk);
  fpM.lookAt(fpPos,fpLk,new THREE.Vector3(0,1,0));fpQb.setFromRotationMatrix(fpM);fpQa.copy(camera.quaternion);
  const p0=camera.position.clone(),pe=Math.pow(e,.7);camera.position.lerpVectors(p0,fpPos,pe);camera.position.y+=Math.sin(pe*Math.PI)*2.6;
  camera.quaternion.copy(fpQa).slerp(fpQb,e);
  const hf=(P.hf||48)*Math.PI/180,vf=2*Math.atan(Math.tan(hf/2)/camera.aspect)*180/Math.PI,fpf=clamp(vf,52,84);camera.fov=lerp(f0,fpf,e);camera.near=lerp(.1,.01,e);camera.updateProjectionMatrix();
  fig.visible=k<.4;fpSky.visible=k>.01;fpSky.material.uniforms.op.value=e;fpSky.position.copy(camera.position);
  fpNight.style.opacity=fpCurtKT;
  const now=performance.now(),T=now/1000;fpFlyTick(now);
  fpStage.forEach(p=>{const u=clamp((now-p.userData.pop)/450);if(!FPT.fly.some(f=>f.p===p))p.scale.setScalar(Math.max(.001,u<1?u+Math.sin(u*Math.PI)*.25:1))});
  if(FPT.on&&FPT.st&&P.tick)P.tick(now,T,dt);
  fpHandTick();fpAnchorTick();
  if(AUTO&&FPT.on&&FPT.k>.95&&!FPT.fly.length&&FPT.st!=='mem'&&FPT.st!=='out'){FPT.auto+=dt;if(FPT.auto>1.2){FPT.auto=0;if(FPT.wait)fpTap();else P.auto&&P.auto(FPT.st)}}}

/* ===== 1. le théâtre : assis en haut des gradins ===== */
{const P={first:'predict',face:Math.PI,floorY:.045,eye:new THREE.Vector3(0,.5,-.8),look:new THREE.Vector3(0,.19,.42)};FP_PLACES[1]=P;
 let deco,props=[],LOCI=[];
 P.init=()=>{P.g=THEA;deco=new THREE.Group();deco.visible=false;THEA.add(deco);
  // les lieux : un arc devant nous, sur le cercle de l'orchestre, de gauche à droite VU DES GRADINS (assis face à la scène, la gauche de l'écran est le +x de la maquette)
  // chacun a son repère : jarre, autel, colonne brisée, brasero
  const A=[[.3,.06],[.13,.27],[-.13,.27],[-.3,.06]],terra=M.terra,marb=M.marbleP,dark=M.marbleD;
  A.forEach(([x,z],i)=>{const g=new THREE.Group();g.position.set(x,.04,z);let top=.09;
   if(i===0){const pts=[[0,0],[.022,.004],[.034,.03],[.032,.06],[.016,.078],[.014,.09],[.02,.095]].map(([a,b])=>new THREE.Vector2(a,b));g.add(mesh(new THREE.LatheGeometry(pts,18),terra))}
   if(i===1){g.add(at(mesh(new THREE.BoxGeometry(.085,.06,.06),marb),0,.03,0));g.add(at(mesh(new THREE.BoxGeometry(.095,.012,.07),dark),0,.066,0))}
   if(i===2){g.add(at(mesh(new THREE.CylinderGeometry(.028,.032,.085,14),marb),0,.0425,0));g.add(at(mesh(new THREE.BoxGeometry(.07,.012,.07),marb),0,.006,0))}
   if(i===3){g.add(at(mesh(new THREE.CylinderGeometry(.006,.01,.07,8),dark),0,.035,0));g.add(at(mesh(new THREE.CylinderGeometry(.034,.014,.025,14),terra),0,.08,0));
    const fl=mesh(new THREE.ConeGeometry(.018,.04,10),new THREE.MeshBasicMaterial({color:new THREE.Color('#ffb24a')}),false,false);fl.position.y=.11;g.add(fl);g.userData.fl=fl}
   g.scale.setScalar(1.9);deco.add(g);props.push(g);LOCI.push(new THREE.Vector3(x,.045,z-.085))});
  P.sites=LOCI.map((p,i)=>fpSite(deco,new THREE.Vector3(p.x,.046,p.z-.075),String(i+1)))};
 P.enter=()=>{deco.visible=true;P.sites.forEach(d=>d.visible=false);[THEA.userData.bard,THEA.userData.lyre].forEach(o=>{if(o)o.visible=false});(THEA.userData.pub||[]).forEach(p=>p.visible=Math.abs(p.userData.a)>.4)};
 P.leave=()=>{deco.visible=false;[THEA.userData.bard,THEA.userData.lyre].forEach(o=>{if(o)o.visible=true});(THEA.userData.pub||[]).forEach(p=>p.visible=true)};
 P.canDrag=()=>FPT.st==='place'||FPT.st==='recall';
 P.go=(st)=>{
  if(st==='predict'){fpSetHand(['100','1 000','16 000'].map((l,i)=>({c:fpTag(l,{w:300,h:150,fs:52}),i})));fpHint('Maman me demandait : « Combien de vers un aède récitait-il de mémoire ? » Toucher une étiquette.')}
  if(st==='showA'){fpSetHand([]);fpClearStage();fpHint('Maman : « D’abord une simple liste, sans histoire ni lieux. Regarde bien les plats du festin, dans l’ordre. »');P.ai=-1}
  if(st==='recallA'){const pool=[0,1,2,3].sort(()=>Math.random()-.5);fpSetHand(pool.map(f=>({c:FEAST[f].s,f})));P.lineA=[];fpHint('Toucher les plats dans l’ordre où l’aède les a chantés.')}
  if(st==='place'){fpSetHand(STORY.map(([n,s],i)=>({c:s,i})));fpClearStage();P.pi=0;fpHint('« Maintenant, comme les aèdes : une histoire, et chaque moment ancré dans un lieu du théâtre. » Le navire part sur la mer couleur de vin, le héros affronte la tempête. Faire glisser chaque image sur son lieu (celui qui brille).')}
  if(st==='recall'){const pool=[2,0,3,1];fpSetHand(pool.map(i=>({c:STORY[i][1],i})));P.ans=[-1,-1,-1,-1];P.sites.forEach(d=>d.visible=true);fpHint('« L’aède reprend son récit. » Faire glisser chaque image sur le lieu où elle était rangée.')}};
 P.tap=(st,h)=>{
  if(st==='predict'&&h.hand){const ok=h.hand.i===2;FPT.hand.forEach(o=>{if(o!==FPT.hand[2])o.used=true});FPT.sel=FPT.hand[2];sndTone(ok?784:523,.8,.06);
    fpPut(fpTag('16 000 vers',{w:420,h:150,fs:56,col:'#22306e'}),.17,new THREE.Vector3(0,.12,.38));fpHint((ok?'« Oui : 16 000 vers. ':'« Bien plus : 16 000 vers. ')+'Et tu sais comment ? » Toucher pour continuer.');fpWait(()=>fpGo('showA'));return}
  if(st==='recallA'&&h.hand&&!h.hand.used){const k=P.lineA.length;P.lineA.push(h.hand.f);const pos=new THREE.Vector3(.39-k*.26,.12,.4);
    fpFly(h.hand,pos,.19,()=>{if(P.lineA.length===4&&!P.scored){P.scored=1;P.scoreA=P.lineA.filter((f,k)=>f===k).length;P.lineA.forEach((f,k)=>fpPut(fpTag(f===k?'✓':'✗',{w:120,h:110,fs:56,col:f===k?'#2a6a2a':'#a83a2a'}),.07,new THREE.Vector3(.39-k*.26,.34,.4)));
      fpHint(`${P.scoreA} sur 4, avec la liste. Toucher pour continuer.`);fpWait(()=>{P.scored=0;fpGo('place')})}});return}
  if(st==='place'){const i=P.pi;if(i>3)return;const card=h.card||(h.hand&&h.hand.i===i?h.hand:null)||(h.site===i?FPT.hand.find(o=>o.i===i):null);
    if(!card||card.i!==i||(h.dragged&&h.site!==i)){FPT.sel=null;if(h.site!=null||h.dragged)fpHint('« Dans l’ordre de l’histoire : '+STORY[i][0]+' va sur le lieu '+(i+1)+'. »');return}
    P.pi++;fpFly(card,LOCI[i],.12,()=>{P.sites[i].visible=false;if(P.pi===4){fpHint('« Regarde bien où chaque image est rangée… »');fpAfter(2200,()=>{fpCurtKT=1;fpHint('La nuit tombe sur le théâtre…');fpAfter(1100,()=>{fpClearStage();fpCurtKT=0;fpAfter(500,()=>fpGo('recall'))})})}});return}
  if(st==='recall'){if(h.hand&&!h.hand.used&&!h.dragged){FPT.sel=h.hand;sndPaper(.2,.15);return}
    const o=h.card||FPT.sel;if(h.site==null||!o||P.ans.indexOf(h.site)>=0)return;FPT.sel=null;P.ans[o.i]=h.site;P.sites[h.site].visible=false;
    fpFly(o,LOCI[h.site],.12,()=>{if(P.ans.every(v=>v>=0)&&!P.scored){P.scored=1;const sc=P.ans.filter((p,k)=>p===k).length;
      fpPut(fpTag(`Une simple liste : ${P.scoreA} sur 4\nHistoire + lieux : ${sc} sur 4`,{w:620,h:200,fs:46,col:'#22306e'}),.17,new THREE.Vector3(0,.045,-.3));sndTone(784,1.4,.08);sndTone(1175,1.4,.04,.2);
      fpHint((sc>P.scoreA?'« Tu vois ? Une histoire ancrée dans des lieux : tout revient, dans l’ordre. Les aèdes faisaient pareil… pour 16 000 vers. »':sc===P.scoreA?'« Autant l’un que l’autre, pour quatre images. Mais pour 16 000 vers, une liste ne tient pas : il faut une histoire et des lieux. »':'« Ce soir, la liste a mieux marché. Avec l’habitude, l’histoire et les lieux gagnent : c’est ainsi que les aèdes gardaient 16 000 vers. »')+' Toucher pour continuer.');
      fpWait(()=>{P.scored=0;fpFinish()})}});return}};
 P.tick=(now,T)=>{props.forEach(g=>{if(g.userData.fl)g.userData.fl.scale.set(1,1+.25*Math.sin(now/90),1)});
  // la liste : les plats passent un par un, au même endroit, numérotés
  if(FPT.st==='showA'){const el=now-FPT.t0-600,i=Math.floor(el/1500);if(el>0&&i!==P.ai&&i<4){P.ai=i;fpClearStage();fpPut(FEAST[i].s,.3,new THREE.Vector3(0,.12,.38));fpPut(fpTag(`${i+1} / 4`,{w:220,h:110,fs:50,col:'#5a3418'}),.1,new THREE.Vector3(0,.47,.4));fpPut(fpTag(FEAST[i].n,{w:320,h:110,fs:46}),.1,new THREE.Vector3(0,.045,.12));sndPaper(.25,.2)}
   if(i>=4&&P.ai!==9){P.ai=9;fpClearStage();fpCurtKT=1;fpHint('La nuit tombe sur le théâtre…');fpAfter(1100,()=>{fpCurtKT=0;fpAfter(500,()=>fpGo('recallA'))})}}
  P.sites.forEach((d,i)=>{if(FPT.st==='place'){d.visible=i>=P.pi;d.material.emissiveIntensity=i===P.pi?.5+.4*Math.sin(T*5):0}else if(FPT.st==='recall'&&!(FPT.drag&&FPT.drag.moved))d.material.emissiveIntensity=FPT.sel&&d.visible?.35+.3*Math.sin(T*5):.05});
  FPT.hand.forEach(o=>o.hot=FPT.st==='place'&&o.i===P.pi)};
 P.auto=(st)=>{if(st==='predict')fpTap({hand:FPT.hand[2]});else if(st==='recallA'){const f=P.lineA.length;fpTap({hand:FPT.hand.find(o=>o.f===f)})}else if(st==='place')fpTap({site:P.pi});else if(st==='recall'){const o=FPT.hand.find(h=>!h.used);if(o)fpTap({site:o.i,card:o,dragged:true})}}}
if(/test/.test(location.hash))window.__FP=FPT;
