const SPL={ready:0};
applyPaint();
/* ---------- caméra ---------- */
let yaw=0,yawT=0,dist=40,distT=40,pitch=.6,pitchT=.6,zt=0,zs=0,phase='closed',open=0;
const look=new THREE.Vector3(0,-.6,0),lookT=new THREE.Vector3(0,-.6,0);
const ovDist=()=>Math.max(24,8.3/(Math.tan(camera.fov*Math.PI/360)*camera.aspect));
function camUpdate(){camera.position.set(look.x+Math.sin(yaw)*Math.cos(pitch)*dist,look.y+Math.sin(pitch)*dist,look.z+Math.cos(yaw)*Math.cos(pitch)*dist);camera.lookAt(look)}
const AUTO=location.hash.includes('auto');

/* ---------- toucher : ouvrir, marcher, avancer, manipuler ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let drag=null;
const ZH={el:document.getElementById('zh'),seen:{},t:0};
function zoomHint(k){if(SCR.dio)return;if(ZH.seen[k])return;ZH.seen[k]=1;ZH.el.querySelector('span').textContent=matchMedia('(pointer:fine)').matches?'Molette pour zoomer':'Deux doigts pour zoomer';ZH.el.classList.add('on');clearTimeout(ZH.t);ZH.t=setTimeout(()=>ZH.el.classList.remove('on'),6500)}
function zoomDone(){ZH.seen.free=ZH.seen.lid=1;ZH.el.classList.remove('on')}
const PT=new Map();let pinch=null,gestureMulti=false,manipPtr=false;
const pdist=()=>{const v=[...PT.values()];return Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y)};
const toNDC=e=>{const r=cv.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera)};
const screenUV=e=>{toNDC(e);const h=ray.intersectObject(memMesh,false)[0];return h&&h.uv?[h.uv.x*MS,(1-h.uv.y)*MS]:null};
const freeWalk=()=>phase==='play'&&!busy&&next<4||phase==='play'&&next>=4&&!busy;
cv.addEventListener('pointerdown',e=>{PT.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId)}catch(_){}
  if(DIO.ph&&PT.size===1){sndInit();DIO.down(e);return}
  sndInit();if(curManip&&PT.size===1&&curManip.wantsTap&&curManip.wantsTap()&&!screenUV(e)){curManip.down(-999,-999);return}sndInit();if(TRACE.on&&!TRACE.done&&PT.size===1){const c=screenUV(e);if(c){manipPtr=true;traceDown(c[0],c[1]);return}}if(curManip&&PT.size===1){const c=screenUV(e);if(c){manipPtr=true;sndPaper(.25,.18);curManip.down(...toManip(c[0],c[1]));return}}
  if(PAPER&&SCR.kind==='mem'&&PT.size===1&&REVEAL[SCR.id]&&TAB.need&&!TAB.rev){const c=screenUV(e);if(c&&tabHit(c)){TAB.drag=true;TAB.x0=c[0]-TAB.p*TAB.L;TAB.used=1;sndPaper(.25,.2);return}}
  if(PT.size===1){gestureMulti=false;drag={x:e.clientX,y:e.clientY,yaw:yawT,moved:false,t0:performance.now(),cx:e.clientX,cy:e.clientY}}
  else if(PT.size===2){gestureMulti=true;drag=null;zoomDone();pinch={d0:Math.max(10,pdist()),z0:zt,l0:lidZ}}});
cv.addEventListener('pointermove',e=>{if(!PT.has(e.pointerId))return;PT.set(e.pointerId,{x:e.clientX,y:e.clientY});if(DIO.ph&&DIO.drag){DIO.move(e);return}if(TAB.drag){const c=screenUV(e);if(c)TAB.p=clamp((c[0]-TAB.x0)/TAB.L);return}
  if(manipPtr&&TRACE.on){const c=screenUV(e);if(c)traceMove(c[0],c[1]);return}
  if(manipPtr&&curManip){const c=screenUV(e);if(c)curManip.move(...toManip(c[0],c[1]));return}
  if(pinch&&PT.size>=2){if(camMode==='lid')lidZ=clamp(pinch.l0+Math.log(pdist()/pinch.d0)/Math.log(2.2));else if(phase==='play')zt=clamp(pinch.z0+Math.log(pdist()/pinch.d0)/Math.log(3.2));return}
  if(drag&&drag.held){drag.cx=e.clientX;drag.cy=e.clientY;return}
  if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>6||Math.abs(e.clientY-drag.y)>6)drag.moved=true;if(drag.moved&&freeWalk())yawT=drag.yaw-dx*.007});
// rester appuyé : Alice continue de marcher vers le doigt (et on peut glisser pour la guider)
function holdWalk(now){if(!drag||drag.moved||PT.size!==1||!freeWalk()||camMode==='lid'||phase!=='play')return;if(now-drag.t0<260)return;drag.held=true;if(now-(drag.lw||0)<160)return;drag.lw=now;
  toNDC({clientX:drag.cx,clientY:drag.cy});const pl=new THREE.Plane(new THREE.Vector3(0,1,0),-TOP),hit=new THREE.Vector3();if(ray.ray.intersectPlane(pl,hit)){const g=drag.goal;if(!g||Math.hypot(g[0]-hit.x,g[1]-hit.z)>.45||!figState.moving){drag.goal=[hit.x,hit.z];goTo(hit.x,hit.z)}if(say.className==='hint')hideSay()}}
const endPt=e=>{PT.delete(e.pointerId);if(PT.size<2)pinch=null};
cv.addEventListener('pointercancel',e=>{endPt(e);drag=null;TAB.drag=false;if(manipPtr&&curManip)curManip.up();manipPtr=false});
[['zin',.3],['zout',-.3]].forEach(([id,d])=>{const b=document.getElementById(id);if(b)b.addEventListener('click',ev=>{ev.stopPropagation();zoomDone();if(camMode==='lid')lidZ=clamp(lidZ+d);else zt=clamp(zt+d)})});
cv.addEventListener('wheel',e=>{e.preventDefault();zoomDone();if(camMode==='lid'){lidZ=clamp(lidZ-e.deltaY*(e.ctrlKey?.012:.0016));return}if(phase==='play')zt=clamp(zt-e.deltaY*(e.ctrlKey?.012:.0016))},{passive:false});
['gesturestart','gesturechange'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
cv.addEventListener('pointerup',e=>{const multi=gestureMulti;endPt(e);if(DIO.ph){drag=null;DIO.up();return}if(TAB.drag){TAB.drag=false;drag=null;if(TAB.p>.6&&!TAB.rev)tabReveal();return}
  if(manipPtr){manipPtr=false;if(TRACE.on)traceUp();else if(curManip)curManip.up();return}
  if(drag&&drag.held){drag=null;return}
  if(!drag||drag.moved||multi||PT.size>0){drag=null;return}drag=null;
  if(phase==='closed'){openBox();return}
  if(waitTap){advance();return}
  if(freeWalk()){toNDC(e);const p=new THREE.Plane(new THREE.Vector3(0,1,0),-TOP),hit=new THREE.Vector3();if(ray.ray.intersectPlane(p,hit)){goTo(hit.x,hit.z);if(next===0&&say.className==='hint')hideSay()}}});
say.addEventListener('click',()=>{if(curManip&&curManip.wantsTap&&curManip.wantsTap()){curManip.down(-999,-999);return}if(waitTap)advance();else if(phase==='closed')openBox()});
addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){if(phase==='closed')openBox();else if(waitTap)advance()}});
let tOpen=0;function openBox(){if(phase!=='closed')return;sndInit();sndLid();musicStart();phase='opening';tOpen=performance.now();hideSay();openT=1}

/* ---------- boucle ---------- */
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function lerp(a,b,t){return a+(b-a)*t}
fig.position.copy(START);fig.rotation.y=.6;figState.tx=START.x;figState.tz=START.z;
const BUB=[];const bubTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=160;const x=c.getContext('2d');x.fillStyle='#fffaf0';x.strokeStyle='#2a1a22';x.lineWidth=6;x.beginPath();x.ellipse(128,70,110,56,0,0,7);x.fill();x.stroke();x.beginPath();x.moveTo(90,118);x.lineTo(70,152);x.lineTo(120,124);x.fill();x.font='700 56px Caveat, cursive';x.fillStyle='#2a1a22';x.textAlign='center';x.fillText('Bêê !',128,90);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t})();
// la bulle de papier d'Alice : ce qu'elle se dit flotte au-dessus d'elle ; dès qu'elle bouge, la bulle se froisse et disparaît
const ABUB={s:null,st:0};const BSC=new THREE.Scene();
function aliceSay(text){const c=document.createElement('canvas');c.width=640;c.height=300;const x=c.getContext('2d');
 const path=()=>{x.beginPath();const cx=320,cy=128,rx=292,ry=104;for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,j=1+Math.sin(i*7.1)*.012;x.lineTo(cx+Math.cos(a)*rx*j,cy+Math.sin(a)*ry*j)}x.closePath();x.moveTo(292,226);x.lineTo(320,298);x.lineTo(348,226)};
 x.save();x.shadowColor='rgba(40,20,0,.35)';x.shadowBlur=14;x.shadowOffsetY=6;x.fillStyle='#f8f1df';path();x.fill();x.restore();
 x.save();path();x.clip();for(let i=0;i<2500;i++){x.fillStyle=Math.random()<.5?`rgba(255,255,255,${Math.random()*.25})`:`rgba(120,90,50,${Math.random()*.08})`;x.fillRect(Math.random()*640,Math.random()*300,2,1.5)}x.restore();
 x.strokeStyle='rgba(120,90,60,.55)';x.lineWidth=3;path();x.stroke();
 x.font='600 42px Caveat, cursive';x.fillStyle='#22306e';x.textAlign='center';const ls=jLines(x,nb(text),440);ls.forEach((l,i)=>x.fillText(l,320,128+(i-(ls.length-1)/2)*44+13));
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
 const b=document.createElement('canvas');b.width=b.height=128;const y=b.getContext('2d');y.fillStyle='#efe4cc';y.beginPath();for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=40+Math.random()*16;y.lineTo(64+Math.cos(a)*r,64+Math.sin(a)*r)}y.closePath();y.fill();y.strokeStyle='rgba(120,90,60,.6)';y.lineWidth=2;for(let i=0;i<7;i++){y.beginPath();y.moveTo(64+Math.random()*50-25,64+Math.random()*50-25);y.lineTo(64+Math.random()*70-35,64+Math.random()*70-35);y.stroke()}
 const tb=new THREE.CanvasTexture(b);tb.encoding=THREE.sRGBEncoding;
 if(!ABUB.s){ABUB.s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));ABUB.s.renderOrder=6;ABUB.s.center.set(.5,0);BSC.add(ABUB.s)}else ABUB.s.material.map=t;
 ABUB.s.material.needsUpdate=true;Object.assign(ABUB,{tex:t,ball:tb,st:1,t0:performance.now()/1000,home:fig.position.clone()});ABUB.s.visible=true;ABUB.s.material.opacity=1;ABUB.s.material.rotation=0}
function abubTick(T){const b=ABUB.s;if(!b||!ABUB.st)return;const now=performance.now()/1000,zk=1-.68*zs,base=[3.4*zk,1.6*zk];
 if(ABUB.st===1){const k=Math.min(1,(now-ABUB.t0)/.45),e=easeBack(k);b.scale.set(base[0]*Math.max(.02,e),base[1]*Math.max(.02,e),1);{const w=new THREE.Vector3();fig.getWorldPosition(w);b.position.set(w.x,w.y+1.12+Math.sin(T*1.6)*.03,w.z)}
  if(fig.position.distanceTo(ABUB.home)>.08||phase!=='play'){ABUB.st=2;ABUB.t2=now;ABUB.y=b.position.y;sndPaper(.45,.35)}}
 else{const k=(now-ABUB.t2)/.75;if(k>=1){b.visible=false;ABUB.st=0;return}
  if(k>.25&&b.material.map!==ABUB.ball){b.material.map=ABUB.ball;b.material.needsUpdate=true}
  const sq=k<.25?1-k*2.4:.4*(1-(k-.25)*.3);b.scale.set(k<.25?base[0]*sq:.6*zk,k<.25?base[1]*(1+k*.6):.6*zk,1);b.material.rotation=k*6;b.position.y=ABUB.y-(k>.25?(k-.25)*(k-.25)*5:0);b.material.opacity=k>.7?(1-k)/.3:1}}
function showBubble(g){let b=BUB.find(o=>!o.visible);if(!b){b=new THREE.Sprite(new THREE.SpriteMaterial({map:bubTex,transparent:true,depthTest:false}));b.scale.set(.7,.44,1);b.renderOrder=5;box.add(b);BUB.push(b)}b.userData.g=g;b.userData.t0=performance.now()/1000;b.visible=true}
// la boîte s'ouvre : tout est déjà là, dessous. Chaque objet n'apparaît que lorsque le couvercle est assez levé pour ne plus le traverser
let REV=null;const _bb=new THREE.Box3(),_m=new THREE.Matrix4(),_z=new THREE.Matrix4().makeScale(0,0,0);
function critAngle(maxY,minZ){const dz=minZ+RD,dy=maxY-(TOP+.06);if(dy<=0)return 0;if(dz<=.05)return Math.PI/2;return Math.atan2(dy,dz)+.05}
function revealBuild(){REV=[];const skip=new Set([hinge,fig,ring,ringGlow,deco,...(RECALL?[]:[BAG]),MARK.beam,...BUB,...KEEPS]);box.updateMatrixWorld(true);
  const add=o=>{if(skip.has(o)||o.isSprite||o.isLight)return;if(o.isInstancedMesh){const crit=[],orig=[];const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();for(let i=0;i<o.count;i++){o.getMatrixAt(i,_m);orig.push(_m.clone());_bb.copy(g.boundingBox).applyMatrix4(_m);crit.push(critAngle(_bb.max.y,_bb.min.z))}REV.push({o,inst:true,crit,orig,shown:crit.map(()=>true)});return}
    _bb.setFromObject(o);if(_bb.isEmpty())return;REV.push({o,crit:critAngle(_bb.max.y,_bb.min.z)})};
  box.children.forEach((o,i)=>{if(i<shellCount)return;if(o===deco)deco.children.forEach(add);else add(o)});
  const fb=new THREE.Box3().setFromObject(fig);REV.push({o:fig,crit:critAngle(fb.max.y,fb.min.z)})}
let REVDONE=false;function revealTick(ang){if(REVDONE)return;if(!REV)revealBuild();let all=true;
  REV.forEach(r=>{if(r.inst){let ch=false;r.crit.forEach((c,i)=>{const s=ang>c;if(s!==r.shown[i]){r.shown[i]=s;r.o.setMatrixAt(i,s?r.orig[i]:_z);ch=true}if(!s)all=false});if(ch)r.o.instanceMatrix.needsUpdate=true}else{const s=ang>r.crit;r.o.visible=s;if(!s)all=false;else if(PAPER&&r.o!==fig){if(r.t0==null){r.t0=performance.now();r.sy=r.o.scale.y}const k=clamp((performance.now()-r.t0)/600);r.o.scale.y=r.sy*Math.max(.02,easeBack(k));if(k<1)all=false}}});
  if(all&&ang>1.5)REVDONE=true}
let POPDONE=false,lidZ=0,lidSharp=0,last=performance.now(),tStart=performance.now(),hinted=false,autoT=0;
function constrain(x,z){if(inSea(x,z,.3)){let best=null;for(let k=0;k<COAST.length;k++){const[ax,az]=COAST[k],[bx,bz]=COAST[(k+1)%COAST.length],dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1))),px=ax+dx*t,pz=az+dz*t,d=Math.hypot(x-px,z-pz);if(!best||d<best.d)best={d,px,pz}}
   if(best){const vx=best.px-SEA.x,vz=best.pz-SEA.z;let ox=x-best.px,oz=z-best.pz;const l=Math.hypot(ox,oz)||1;const sgn=pip(x,z,COAST)?-1:1;x=best.px+ox/l*.32*sgn;z=best.pz+oz/l*.32*sgn;if(inSea(x,z,.29)){x=best.px;z=best.pz}}}
  const w=RW-.45,h=RD-.45;x=Math.max(-w,Math.min(w,x));z=Math.max(-h,Math.min(h,z));const ax=Math.abs(x),az=Math.abs(z),r=RR;if(ax>w-r&&az>h-r){const cx=w-r,cz=h-r,d=Math.hypot(ax-cx,az-cz);if(d>r){x=Math.sign(x)*(cx+(ax-cx)*r/d);z=Math.sign(z)*(cz+(az-cz)*r/d)}}return[x,z]}
function frame(now){const rawDt=Math.min(1,(now-last)/1000),dt=Math.min(.05,rawDt);DTG=Math.min(.2,rawDt);last=now;const T=REDUCED?0:now/1000;const OV=ovDist();
  if(phase==='closed'){pitchT=.6;distT=OV*.8;yawT=Math.sin(T*.3)*.15;lookT.set(0,-.3,0);if(!hinted&&now-tStart>2200){hinted=true;showHint(isDone()&&!RECALL?'Toucher la boîte pour l’ouvrir. Ou « Rappel », en haut, pour la rallumer de mémoire.':RECALL?'Mode rappel. Toucher la boîte pour l’ouvrir.':'Toucher la boîte pour l’ouvrir.')}if(AUTO&&now-tStart>3000)openBox()}
  if(phase==='opening'){const e=(now-tOpen)/1000;pitchT=lerp(.6,.9,ease(clamp(e/2.6)));distT=lerp(OV*.8,OV,ease(clamp(e/2.6)));yawT=0;lookT.set(0,lerp(-.3,.6,ease(clamp(e/2.6))),0);if(e>2.9){phase='play';const jm=location.hash.match(/jump(\d)/);if(jm){next=+jm[1];lit=next;for(let i=0;i<next;i++)KEEPS[i].userData.s=1;const s=SPOTS[Math.min(next,SPOTS.length-1)];fig.position.set(s.x-.8,TOP,s.z+.3);figState.tx=fig.position.x;figState.tz=fig.position.z;camMode='box'}else run(RECALL?'rintro':'intro')}}
  if(phase==='play'){
    if(camMode!=='lid')lidZ=0;
    if(camMode==='lid'){// face au couvercle, bien droit, quel que soit l'angle choisi avant
      const n=new THREE.Vector3(0,-1,0).applyQuaternion(lid.getWorldQuaternion(new THREE.Quaternion()));pitchT=Math.asin(clamp(n.y,-1,1));yawT=Math.round(yaw/(Math.PI*2))*Math.PI*2+Math.atan2(n.x,n.z);distT=OV*.67*lerp(1,.5,lidZ);lookT.copy(lid.localToWorld(new THREE.Vector3(0,-.16,lerp(0,-1.6,lidZ))))}
    else if(camMode==='top'){pitchT=1.25;distT=OV*1.05;lookT.set(0,.3,0)}
    else{zs+=(zt-zs)*(1-Math.pow(.002,dt));pitchT=lerp(.9,.45,zs);distT=OV*Math.pow(4.6/OV,zs);const fz=clamp(zs*1.3);lookT.set(fig.position.x*fz,lerp(.6,.7,zs),fig.position.z*fz)}
    // marche
    if(!busy){const dx=figState.tx-fig.position.x,dz=figState.tz-fig.position.z,d=Math.hypot(dx,dz);if(d<.12&&figState.path&&figState.path.length){const n=figState.path.shift();figState.tx=n[0];figState.tz=n[1]}figState.moving=d>.03||!!(figState.path&&figState.path.length);
      if(figState.moving){let ty=Math.atan2(dx,dz),dy=ty-fig.rotation.y;while(dy>Math.PI)dy-=Math.PI*2;while(dy<-Math.PI)dy+=Math.PI*2;fig.rotation.y+=dy*Math.min(1,dt*14);
        const more=figState.path&&figState.path.length,face=d<1e-4||Math.abs(dy)<.6,vmax=2.85*Math.min(1,(more?1:d/.45)+.25);figState.v=face?Math.min(vmax,(figState.v||0)+dt*9):Math.max(0,(figState.v||0)-dt*12);const st=Math.min(d,figState.v*dt);const dd=Math.max(d,1e-6);let[nx,nz]=constrain(fig.position.x+dx/dd*st,fig.position.z+dz/dd*st);
        const mv=Math.hypot(nx-fig.position.x,nz-fig.position.z);if(st>1e-4&&mv<st*.6){if(figState.path&&figState.path.length){const n=figState.path.shift();figState.tx=n[0];figState.tz=n[1]}else{figState.tx=fig.position.x;figState.tz=fig.position.z;figState.v=0}}else{fig.position.x=nx;fig.position.z=nz}figState.phase+=mv*11}else figState.v=0;
      if(next<4&&fig.position.distanceTo(SPOTS[next])<.5){figState.path=[];figState.tx=fig.position.x;figState.tz=fig.position.z;figState.moving=false;const P=PLACES[next];fig.userData.face=Math.atan2(P[0]-fig.position.x,P[1]-fig.position.z);hideSay();run(RECALL?'r'+next:next)}
      replayTick();
      if(AUTO&&next<4&&!figState.moving&&!busy){goTo(SPOTS[next].x,SPOTS[next].z)}}
    else figState.moving=false;
    if(fig.userData.face!=null&&busy){let dy=fig.userData.face-fig.rotation.y;while(dy>Math.PI)dy-=Math.PI*2;while(dy<-Math.PI)dy+=Math.PI*2;fig.rotation.y+=dy*Math.min(1,dt*6)}
    fig.position.y=TOP+bridgeH(fig.position.x,fig.position.z)+(figState.moving?Math.abs(Math.sin(figState.phase))*.05:0);fig.userData.arms.forEach((g,i)=>g.rotation.x=figState.moving?Math.sin(figState.phase+i*Math.PI)*.18:g.rotation.x*.85);fig.userData.back.rotation.x=figState.moving?.12+Math.sin(figState.phase*2)*.04:Math.sin(T*1.3)*.02;fig.rotation.z=figState.moving?Math.sin(figState.phase)*.08:0;
    manipTick();dioTick(DTG,T);
    if(camMode==='lid'&&SCR.kind&&!SCR.dio)zoomHint('lid');else if(freeWalk()&&open>.95)zoomHint('free');
    if(AUTO){autoT+=rawDt;if(TRACE.on&&!TRACE.done&&autoT>1.2){autoT=0;const c=TRACE.cur??0,n=traceNext();if(n>=0)traceLink(c,n)}if(say.classList.contains('ask')&&autoT>1.5){autoT=0;const fc=say.querySelector('.fc:not(.flip)');if(fc)fc.click();else{const b=say.querySelector('.ch');if(b)b.click()}}if(waitTap&&autoT>1.2){autoT=0;advance()}if(curManip&&!curManip.done&&autoT>2){autoT=0;curManip.solve()}}}
  // couvercle
  open+=(openT-open)*(1-Math.pow(.25,dt));revealTick(ease(clamp(open))*1.92);hinge.rotation.x=-ease(clamp(open))*1.92;
  // repère du prochain lieu, objets, constellation
  holdWalk(now);markTick(T,now);popTick(now);fifthTick(now);carnetTick();const showRing=phase==='play'&&next<4&&!busy;ring.visible=false;ringGlow.visible=spotLight.visible=showRing;ring2.visible=false;beacon.visible=false;if(showRing){const s=SPOTS[next];ring.position.set(s.x,TOP+.1,s.z);ringGlow.position.set(s.x,TOP+.09,s.z);const br=.5+.5*Math.sin(T*2.2);ring.userData.mat.emissiveIntensity=.6+.9*br;ringGlow.material.opacity=.35+.4*br;ringGlow.scale.setScalar(1+.08*br);spotLight.position.set(s.x,TOP+.5,s.z);spotLight.intensity=.5+.6*br}
  KEEPS.forEach(o=>{if(o.userData.s){o.scale.setScalar(o.scale.x+(1.4-o.scale.x)*.08);o.userData.it.rotation.y=Math.sin(T*.6)*.5;o.userData.it.position.y=.1+.03*Math.sin(T*2)}});
  constel+=(constelT-constel)*(1-Math.pow(.2,DTG));
  if(WATER.waves)WATER.waves.forEach(m=>{const u=m.userData;m.position.x=u.x+Math.sin(T*.55+u.row*1.3)*.06;m.position.y=TOP-SEAD+.1+Math.sin(T*1.3+u.row*2.1)*.015;m.rotation.z=Math.sin(T*1.1+u.row)*.06});if(PAPER){paperTick(T);{const fifth=FIFTH==='done'||FIFTH==='busy';THREAD.pins.forEach((g,i)=>{const on=i<4?i<lit:fifth&&lit>=4;if(on&&!g.visible){g.visible=true;g.userData.t0=T}if(!on)g.visible=false;if(g.visible){const k=Math.min(1,(T-g.userData.t0)/.5);g.scale.setScalar(Math.max(.001,1+Math.sin(k*Math.PI)*.25-(1-k)))}});THREAD.segs.forEach((sg,i)=>{const on=THREAD.pins[sg.a].visible&&THREAD.pins[sg.b].visible;if(on&&!sg.m.visible){sg.m.visible=true;sg.t0=T}if(!on){sg.m.visible=false;return}const k=Math.min(1,(T-sg.t0-.3)/1.4);sg.m.geometry.setDrawRange(0,Math.max(0,Math.floor(sg.n*k/6)*6))})}if(BEAM.m){BEAM.m.rotation.y=T*.6;const on=phase!=='closed'&&phase!=='opening';if(on&&BEAM.t0==null)BEAM.t0=T;const k=BEAM.t0==null?0:Math.min(1,(T-BEAM.t0)/2.5);BEAM.m.visible=k>0;BEAM.m.children.forEach((c,i)=>{c.material.opacity=(i?.035:.075)*k*k})}CRANES.forEach(g=>{g.visible=phase!=='closed'&&phase!=='opening';const u=g.userData,a=T*.35+u.ph;if(g.visible&&u.t0==null)u.t0=T;const k=u.t0==null?0:Math.min(1,(T-u.t0-u.ph*.6)/4),e=k<=0?0:1-Math.pow(1-k,3);g.visible=g.visible&&k>0;g.scale.setScalar(1.4);const px=u.cx+Math.cos(a)*u.r,py=TOP+u.h+Math.sin(T*1.3+u.ph)*.08,pz=u.cz+Math.sin(a)*u.r;g.position.set(px+(1-e)*(9+u.ph*2),py+(1-e)*4,pz+(1-e)*7);g.rotation.y=-a;const f=Math.sin(T*6+u.ph)*.5;u.wl.rotation.z=f;u.wr.rotation.z=-f});CLOUDS.forEach(g=>{g.position.x=g.userData.x+Math.sin(T*.25+g.userData.ph)*.25})}
  if(WATER.t1){WATER.t1.offset.set(T*.012,Math.sin(T*.3)*.02);WATER.t2.offset.set(-T*.009,T*.006);WATER.m.material.opacity=.2+.05*Math.sin(T*.8)}
  sheep.forEach((g,i)=>{const u=g.userData;if(!u.home){u.home=g.position.clone();u.tgt=g.position.clone();u.cd=0}const dx=g.position.x-fig.position.x,dz=g.position.z-fig.position.z,d=Math.hypot(dx,dz);
    if(d<1.0&&phase==='play'){const k=1.1/Math.max(d,.1);let nx=fig.position.x+dx*k,nz=fig.position.z+dz*k;if(!freeSpot(nx,nz,.2)){nx=u.home.x+(u.home.x-fig.position.x)*.3;nz=u.home.z+(u.home.z-fig.position.z)*.3}u.tgt.set(nx,TOP,nz);
      if(T-u.cd>4){u.cd=T;showBubble(g)}}
    const mv=g.position.distanceTo(u.tgt);if(mv>.02){g.position.x+=(u.tgt.x-g.position.x)*.06;g.position.z+=(u.tgt.z-g.position.z)*.06;g.rotation.y=Math.atan2(u.tgt.x-g.position.x,u.tgt.z-g.position.z)-Math.PI/2;g.position.y=TOP+Math.abs(Math.sin(T*14+i))*.06}else g.position.y=TOP+Math.max(0,Math.sin(T*2+i*1.7))*.02});
  abubTick(T);BUB.forEach(b=>{const k=(T-b.userData.t0);b.visible=k<1.4;if(b.visible){b.position.copy(b.userData.g.position).add(new THREE.Vector3(0,.55+k*.15,0));b.material.opacity=Math.min(1,(1.4-k)*3)}});boats.forEach((b,i)=>{b.position.y=(PAPER?TOP-.035:TOP+.06)+Math.sin(T*1.4+i)*.015;b.rotation.z=Math.sin(T*1.1+i)*.06});
  pharosLight.intensity=.8+.15*Math.sin(T*7);pharosFire.scale.y=1+.12*Math.sin(T*9);
  drawScreen(T);
  const k=1-Math.pow(.03,dt);yaw+=(yawT-yaw)*k;pitch+=(pitchT-pitch)*k;dist+=(distT-dist)*k;look.lerp(lookT,k);camUpdate();
  const fp=(camMode==='lid'&&phase==='play'?lid.localToWorld(apexL.clone()).lerp(look,.4):zs>.45&&phase==='play'&&camMode==='box'?fig.position.clone().add(new THREE.Vector3(0,.6,0)):look.clone()).project(camera);
  lidSharp+=((camMode==='lid'&&phase==='play'?1:0)-lidSharp)*.06;const tsA=lerp(2.8,3,zs)*(1-lidSharp);hPass.uniforms.h.value=tsA/SW;vPass.uniforms.v.value=tsA/SH;hPass.uniforms.r.value=vPass.uniforms.r.value=clamp(fp.y*.5+.5,.25,.75);
  composer.render();if(window.__frame)window.__frame();if(!SPL.ready){SPL.ready=1;const b=document.getElementById('splgo');if(b){b.disabled=false;b.textContent='J’ouvre la boîte';b.onclick=()=>{const sp=document.getElementById('splash');sp.classList.add('out');setTimeout(()=>sp.remove(),800);openBox()}}}if(ABUB.s&&ABUB.s.visible){const ac=renderer.autoClear;renderer.autoClear=false;renderer.setRenderTarget(null);renderer.clearDepth();renderer.render(BSC,camera);renderer.autoClear=ac}requestAnimationFrame(frame)}
if(location.hash.includes('test'))window.__T={note:(t)=>{JR.note={text:t,t0:performance.now()}},manip:(n)=>{camMode='lid';curManip=({t:mkTheatre,h:mkThot,p:mkPierres,a:mkPhares,i:mkIA,g:mkArg})[n||'t']();SCR.kind='manip';SCR.obj=curManip;SCR.ta=1},lidcam:(k,w,t)=>{Object.assign(TAB,{need:false,rev:false,auto:0,p:0,note:''});JR.note=null;JR.items=[];camMode='lid';SCR.kind='mem';SCR.id=k;SCR.ta=1;SCR.t0=performance.now();jWrite(w||'alice',t||'Il avait de la poussière plein les mains. Il revenait d’un endroit dont il ne parlait jamais.')},gt:()=>lidTop.image.toDataURL('image/jpeg',.7),dbg:()=>{const M=mkSoleil(),o=mkC();M.p=.2;M.draw(o.getContext('2d'),0);return o.toDataURL()},advance,solve:()=>curManip&&curManip.solve(),toScreen:(cx,cy)=>{const v=canvasToWorld(...fromManip(cx,cy)).project(camera);return[(v.x*.5+.5)*SW,(-v.y*.5+.5)*SH]},st:()=>({phase,next,busy,waitTap,manip:!!curManip,camMode,lidZ,dist:+dist.toFixed(2),OV:+ovDist().toFixed(2)}),spot:i=>{const v=SPOTS[i].clone().project(camera);return[(v.x*.5+.5)*SW,(-v.y*.5+.5)*SH]},dbgp:(X,Z)=>{const[i,j]=toCell(X,Z);let s='';for(let b=j-6;b<=j+6;b++){for(let a=i-12;a<=i+12;a++)s+=(a===i&&b===j)?'@':BLK[b*NX+a]?'#':'.';s+='\n'}return s+JSON.stringify(findPath(X,Z,2.25,3.75))},fp:()=>({x:fig.position.x,z:fig.position.z,tx:figState.tx,tz:figState.tz,path:figState.path,v:figState.v}),ask:()=>{camMode='lid';constelT=1;lit=4;Q=SCRIPTS[3].filter(s=>s.ask);qi=0;step()},vega:()=>{vegaT=1},trace:()=>{camMode='lid';lit=4;Q=[{trace:1},{fn:()=>{constelT=1}},{wait:1600},{fn:()=>{vegaT=1}}];qi=0;step()},stars:()=>STARS,jw:(w,t)=>jWrite(w,t),lidScreen:(x,y)=>{const v=canvasToWorld(x,y).project(camera);return[(v.x*.5+.5)*SW,(-v.y*.5+.5)*SH]},mus:()=>({paused:MUS.el?MUS.el.paused:null,g:MUS.g?+MUS.g.gain.value.toFixed(3):null,st:SND.ctx&&SND.ctx.state,on:SND.on,t:MUS.el?+MUS.el.currentTime.toFixed(1):0}),grid:()=>{let s='';for(let j=0;j<NZ;j+=2){for(let i=0;i<NX;i++)s+=BLK[j*NX+i]?'#':'.';s+='\n'}return s},recall:()=>RECALL,thot:()=>curManip&&curManip.list?curManip.list.map(k=>{const s=curManip.slots.find(o=>o.k===k);return[s.x,s.y]}):null,card:()=>{Q=[{card:RCARD[1]}];qi=0;busy=true;step()},ask0:()=>{Q=SCRIPTS[3].filter(s=>s.ask);qi=0;busy=true;step()},mdown:(x,y)=>curManip&&curManip.down(x,y),tab:(p)=>{TAB.need=true;TAB.note=TAB.note||'Avant l’écriture, chaque savoir avait sa place.';TAB.p=p;TAB.drag=p>0},arg:()=>{camMode='lid';startArg()},mmove:(x,y)=>curManip&&curManip.move(x,y),mup:()=>curManip&&curManip.up(),seq:()=>curManip&&curManip.seq,mst:()=>curManip&&(curManip.state||curManip.st),cmb:()=>curManip&&[curManip.big,curManip.bt,performance.now()],unlock:()=>{unlock5()},memf:()=>memF.toDataURL('image/png'),tr:()=>({on:TRACE.on,done:TRACE.done,n:TRACE.edges.size}),tn:()=>[TRACE.done,TRACE.cur??0,traceNext()],mstate:()=>curManip?{state:curManip.state,score:curManip.score}:null};
requestAnimationFrame(frame);
{const b=$('snd'),pn=$('sndpanel'),m=$('volm'),e=$('vole'),mute=$('mute');m.value=Math.round(SND.vm*100);e.value=Math.round(SND.ve*100);
 const sync=()=>{b.setAttribute('aria-pressed',String(SND.on));mute.textContent=SND.on?'Tout couper':'Remettre le son';b.classList.toggle('off',!SND.on)};sync();
 b.addEventListener('click',()=>{sndInit();pn.hidden=!pn.hidden;b.setAttribute('aria-expanded',String(!pn.hidden))});
 const on=()=>{if(!SND.on){SND.on=true;try{localStorage.setItem('nfox-son','1')}catch(_){}sync()}};
 m.addEventListener('input',()=>{SND.vm=m.value/100;on();musicStart();musicSync();volSync()});
 e.addEventListener('input',()=>{SND.ve=e.value/100;on();musicSync();volSync()});e.addEventListener('change',()=>sndPaper(.5,.3));
 mute.addEventListener('click',()=>{SND.on=!SND.on;try{localStorage.setItem('nfox-son',SND.on?'1':'0')}catch(_){}sync();musicStart();musicSync()});
 document.addEventListener('pointerdown',ev=>{if(!pn.hidden&&!pn.contains(ev.target)&&ev.target!==b&&!b.contains(ev.target)){pn.hidden=true;b.setAttribute('aria-expanded','false')}},true)}
