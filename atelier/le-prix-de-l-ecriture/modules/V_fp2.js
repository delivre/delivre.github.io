/* ---------- les autres lieux à la première personne ---------- */
const fpGlowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,226,150,1)');g.addColorStop(.35,'rgba(255,200,110,.55)');g.addColorStop(1,'rgba(255,200,110,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return fpTex(c)})();
const fpGlow=(parent,pos,s=.45)=>{const m=new THREE.SpriteMaterial({map:fpGlowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0});const o=new THREE.Sprite(m);o.position.copy(pos);o.scale.setScalar(s);parent.add(o);return o};

/* ===== 0. Göbekli Tepe : assis sur le talus de l'enceinte, face aux piliers gravés =====
   Les quatre piliers du bord le plus proche regardent vers nous (leurs animaux gravés sont sur la face extérieure).
   Vu d'ici (on regarde vers +x), la gauche de l'écran est le -z de la maquette. */
// on s'assied de l'autre côté de l'enceinte (vers le coin de la boîte) : on regarde à travers les piliers, vers toute la carte
{const EYE=new THREE.Vector3(.99,1.3,-1.54),P={first:'intro',face:Math.atan2(EYE.x,EYE.z),floorY:.21,eye:EYE,look:new THREE.Vector3(-.49,.1,.76),hf:72,memUp:.3,screen:true,down:.35,downIn:['ask','end']};FP_PLACES[0]=P;
 const B4=[1,2,0,3];let pil=[],glows=[],deco,T0=[0,0,0,0];
 P.init=()=>{P.g=GOBE;deco=new THREE.Group();deco.visible=false;GOBE.add(deco);
  // les quatre piliers du bord le plus proche de nous, rangés de gauche à droite tels qu'on les voit
  const tps=GOBE.userData.tps.slice(0,8),ed=new THREE.Vector3(EYE.x,0,EYE.z).normalize(),rt=new THREE.Vector3(-ed.z,0,ed.x).negate();
  pil=tps.sort((a,b)=>b.position.dot(ed)-a.position.dot(ed)).slice(0,4).sort((a,b)=>a.position.dot(rt)-b.position.dot(rt));pil.forEach((p,j)=>p.userData.obj=j);
  glows=pil.map(p=>{const d=EYE.clone().sub(p.position).setY(0).normalize();return fpGlow(deco,p.position.clone().add(new THREE.Vector3(0,.22,0)).addScaledVector(d,.09),.5)});
  P.sites=pil.map(p=>fpSite(deco,new THREE.Vector3(p.position.x,.228,p.position.z),'',.075,.18))};
 P.objs=()=>FPT.st==='intro'||FPT.st==='input'?pil:[];
 P.enter=()=>{deco.visible=true;pil.forEach(p=>{p.visible=true;if(p.userData.ry0==null)p.userData.ry0=p.rotation.y;p.rotation.y=Math.atan2(P.eye.x-p.position.x,P.eye.z-p.position.z)});P.sites.forEach(d=>d.visible=false);P.seq=[0,1,2,3].sort(()=>Math.random()-.5);P.len=3;P.inp=0};
 P.leave=()=>{deco.visible=false;pil.forEach(p=>{p.visible=true;if(p.userData.ry0!=null)p.rotation.y=p.userData.ry0})};
 P.toMem=()=>{pil.forEach(p=>p.visible=true)};
 const top=(j)=>pil[j].position.clone().add(new THREE.Vector3(0,.52,0));
 P.light=(j,dur=1)=>{T0[j]=performance.now();sndTone(PIL_NOTES[j],1.1*dur,.15);const b=BEASTS[B4[pil[j].userData.k%4]][1];const c=fpPut(b,.15,top(j));fpAfter(1000,()=>fpUnput(c))};
 P.show=()=>{FPT.st='show';P.inp=0;P.seq.slice(0,P.len).forEach((j,k)=>fpAfter(600+k*900,()=>P.light(j)));
  fpAfter(600+P.len*900,()=>{FPT.st='input';fpHint(P.len===3?'« À toi de rechanter : touche les pierres dans le même ordre. »':'« Le chant s’allonge. Rechante-le. »')})};
 P.go=(st)=>{if(st==='intro')fpHint('Il y a 11 600 ans, des chasseurs dressaient ici des piliers géants, gravés d’animaux. Papa disait qu’ils gardaient un chant. Toucher une pierre pour l’écouter.')};
 P.tap=(st,h)=>{
  if(st==='intro'&&h.obj!=null){P.show();return}
  if(st==='input'&&h.obj!=null){const j=h.obj;P.light(j,.8);
   if(j===P.seq[P.inp]){P.inp++;if(P.inp>=P.len){if(P.len===3){P.len=4;FPT.st='wait';fpHint('« Bien ! Écoute la suite… »');fpAfter(1300,()=>P.show())}
     else{FPT.st='wait';fpHint('« Tu connais le chant des pierres. »');fpAfter(1700,()=>{fpCurtKT=1;fpHint('Puis Papa éteignait la lumière…');fpAfter(1200,()=>{pil.forEach(p=>p.visible=false);P.sites.forEach(d=>{d.visible=true;d.material.emissiveIntensity=.25});P.inp=0;P.got=[];fpCurtKT=0;
       fpAfter(500,()=>{FPT.st='ask';fpHint('« Les pierres ont disparu. » Toucher les cercles où elles étaient, dans l’ordre du chant.')})})})}}}
   else{FPT.st='wait';fpHint('« Presque. Écoute encore. »');fpAfter(1200,()=>P.show())}return}
  if(st==='ask'&&h.site!=null){const s=h.site;if(P.got.some(o=>o.s===s))return;const ok=s===P.seq[P.inp];P.got.push({s,ok});sndTone(PIL_NOTES[s],.9,.13);
   fpPut(fpTag(String(P.inp+1),{w:120,h:120,fs:70,col:ok?'#2a6a2a':'#a8582a'}),.14,P.sites[s].position.clone().add(new THREE.Vector3(0,.01,0)));P.sites[s].visible=false;P.inp++;
   if(P.inp>=4){FPT.st='end';const n=P.got.filter(o=>o.ok).length;fpAfter(700,()=>{pil.forEach(p=>p.visible=true);fpResult(`${n} sur 4, de mémoire`);
     fpHint((n>=3?'« Tu as revu les pierres dans ta tête, n’est-ce pas ? Le chant était là où on l’avait laissé. C’est ça, un palais de mémoire. »':'« Les places t’ont déjà aidée. Avec un peu d’habitude, on retrouve tout un chant comme ça : c’est un palais de mémoire. »')+' Toucher pour continuer.');fpWait(()=>fpFinish())})}return}};
 P.tick=(now,T)=>{glows.forEach((g,j)=>{const idle=FPT.st==='intro'?.18+.12*Math.sin(T*3+j):0;g.material.opacity=Math.max(idle,Math.max(0,1-(now-T0[j])/900)*.95);g.visible=pil[j].visible})};
 P.auto=(st)=>{if(st==='intro')fpTap({obj:0});else if(st==='input')fpTap({obj:P.seq[P.inp]});else if(st==='ask')fpTap({site:P.seq[P.inp]})}}

/* ===== 2. Thèbes : debout dans la cour du palais, face au roi Thamus (à gauche) et à Thot (à droite) =====
   Les offrandes sont posées par terre devant nous ; le papyrus de Thot se lit en grand, puis se roule à chaque offrande. */
{const P={first:'look',face:0,floorY:0,eye:new THREE.Vector3(0,1.2,1.85),look:new THREE.Vector3(0,0,.95),hf:60,memUp:.6,arc:.12};FP_PLACES[2]=P;
 const N=5;let deco,offs=[],hud=null,roll=null;
 // une carte « tenue » devant la caméra (le papyrus ouvert, ou roulé dans un coin)
 const mkHud=(c,h)=>{const m=fpCard(c,h,{noShadow:true,ro:22});m.material.depthTest=false;m.visible=false;scene.add(m);return m};
 P.init=()=>{P.g=PALA;deco=new THREE.Group();deco.visible=false;PALA.add(deco)};
 P.enter=()=>{deco.visible=true;const NO=OFFER.length,ids=[...Array(NO).keys()];P.list=[...ids].sort(()=>Math.random()-.5).slice(0,N);P.got=0;P.err=0;P.reads=1;P.open=true;
  const order=[...ids].sort(()=>Math.random()-.5);offs.forEach(o=>deco.remove(o));
  offs=order.map((k,i)=>{const r=Math.floor(i/4),c=i%4,p=fpCard(OFFER[k].s,.21);p.position.set(-.38+c*.25+(r%2)*.05,.07,1.36-r*.22);p.rotation.x=-.95;p.userData={obj:i,k,sel:false};deco.add(p);return p});
  if(!hud){hud=mkHud(papyrusSheet(P.list),.2);roll=mkHud(kidScroll,.06);roll.userData.obj='scroll'}else{scene.remove(hud);hud=mkHud(papyrusSheet(P.list),.2)}};
 P.leave=()=>{deco.visible=false;hud.visible=roll.visible=false};
 P.toMem=()=>{hud.visible=roll.visible=false;deco.visible=false};
 P.objs=()=>FPT.st==='task'?[...offs.filter(o=>!o.userData.sel),...(roll.visible?[roll]:[])]:[];
 P.go=(st)=>{if(st==='look'){fpHint('Papa jouait à Thot : « Voici la liste des offrandes. Regarde-la bien. » Toucher pour commencer.');fpWait(()=>{FPT.st='task';P.open=false;fpHint('« Maintenant, apporte-les au roi. Et si tu as un doute, tu peux relire la liste. » Toucher une offrande pour l’apporter.')})}};
 const kingAt=(n)=>new THREE.Vector3(-.4+(n%3)*.08,.02,.76+Math.floor(n/3)*.05);
 P.tap=(st,h)=>{if(st!=='task')return;
  if(h.obj==='scroll'){P.open=true;P.reads++;sndPaper(.35,.25);return}
  if(h.obj==null)return;const o=offs[h.obj];if(!o||o.userData.sel)return;
  if(P.list.includes(o.userData.k)){o.userData.sel=true;P.open=false;const w=o.getWorldPosition(new THREE.Vector3());o.visible=false;fpFly(null,kingAt(P.got),.09,null,{c:OFFER[o.userData.k].s,w});P.got++;
    if(P.got===1)fpHint('Le papyrus se roulait à chaque offrande. Le relire ? Il suffisait de le toucher, en bas.');
    if(P.got===N){FPT.st='burn';P.open=true;P.burnT=performance.now();fpHint('Puis Thamus prenait le papyrus… et le jetait au vent.');
     fpAfter(1700,()=>{FPT.st='result';fpResult((P.err?`${N} offrandes · ${P.err===1?'1 erreur':P.err+' erreurs'}`:`${N} offrandes, sans erreur`)+'\n'+(P.reads<2?'lu une seule fois':`relu ${P.reads-1} fois`));
      fpHint((P.reads<=1&&!P.err?'« Tu ne l’as lu qu’une fois : tu t’es forcée à retenir. Mais qui fait cet effort, quand la liste est toujours là ? »':P.reads<=1?'« Une seule lecture, et presque tout de mémoire. Les erreurs montrent l’effort : c’est lui qui fait retenir. »':'« Tu l’as relu '+(P.reads-1)+' fois : la liste faisait l’effort à ta place. » Exactement la crainte de Thamus.')+' Toucher pour continuer.');fpWait(()=>fpFinish())})}}
  else{P.err++;o.userData.shake=performance.now();sndTone(330,.4,.08);fpHint('Thamus fronçait les sourcils : ce n’était pas sur la liste. « Tu peux la relire. »')}};
 P.tick=(now)=>{const fw=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion),rt=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  const vh=2*Math.tan(camera.fov*Math.PI/360)*.3,vw=vh*camera.aspect;
  const burn=FPT.st==='burn'?clamp((now-P.burnT)/1200):0,showHud=(FPT.st==='look'||(FPT.st==='task'&&P.open)||FPT.st==='burn')&&burn<1;
  hud.visible=showHud&&FPT.k>.9;if(hud.visible){const s=Math.min(vw*.62/hud.geometry.parameters.width,vh*.42/hud.geometry.parameters.height);hud.position.copy(camera.position).addScaledVector(fw,.3).addScaledVector(up,vh*.27+burn*.1).addScaledVector(rt,-burn*vw*.8);hud.quaternion.copy(camera.quaternion);hud.rotateZ(-.03-burn*.9);hud.scale.setScalar(s);hud.material.opacity=1-burn}
  roll.visible=FPT.st==='task'&&!P.open&&FPT.k>.9;if(roll.visible){roll.position.copy(camera.position).addScaledVector(fw,.3).addScaledVector(up,-vh*.2).addScaledVector(rt,-vw*.33);roll.quaternion.copy(camera.quaternion);roll.scale.setScalar(1+.06*Math.sin(now/300))}
  offs.forEach(o=>{const sh=o.userData.shake?Math.max(0,1-(now-o.userData.shake)/500):0;o.rotation.z=Math.sin(sh*30)*.15*sh})};
 P.auto=(st)=>{if(st==='task'){const o=offs.find(o=>!o.userData.sel&&P.list.includes(o.userData.k));if(o)fpTap({obj:o.userData.obj})}}}

/* ===== 3. Alexandrie : rentrer au port de nuit =====
   L'étape au-dessus du théâtre. L'aède suivait son chemin dans l'ordre ; un marin, lui, doit retrouver CHAQUE repère, dans n'importe quel ordre.
   Au couchant, depuis le bateau, Papa raconte l'entrée du port : cinq repères sur l'eau, de gauche à droite, chacun avec son petit morceau d'histoire.
   La nuit tombe : on ne voit plus que la lumière du phare. Papa demande les repères dans le désordre ; on touche l'endroit où chacun était. */
{const EYE=new THREE.Vector3(0,.5,-2.75),PORT=new THREE.Vector3(0,.44,-1.85),P={first:'look',face:Math.PI,floorY:-.05,eye:EYE,look:new THREE.Vector3(0,.42,0),hf:58,memUp:.15,screen:true,noLook:true};FP_PLACES[3]=P;
 // vu du bateau (on regarde vers +z), la gauche de l'écran est le +x de la maquette : de gauche à droite = x décroissant
 const LM=[{n:'le rocher',t:'D’abord le rocher, où les mouettes dorment.',p:[.44,-1.44]},{n:'la statue',t:'Puis la statue dorée, qui montre le chemin du doigt.',p:[.22,-1.33]},
  {n:'la jarre',t:'Au milieu, la grande jarre, pleine de l’huile du phare.',p:[0,-1.29]},{n:'la colonne',t:'Puis la colonne brisée, tombée d’un vieux temple.',p:[-.22,-1.33]},{n:'l’obélisque',t:'Et l’obélisque, tout au bout : après lui, c’est le port.',p:[-.44,-1.44]}];
 let deco,marks=[],wins=[],seaY=-.06;
 P.init=()=>{P.g=PHAR;deco=new THREE.Group();deco.visible=false;PHAR.add(deco);
  const terra=M.terra,marb=M.marbleP,stone=new THREE.MeshStandardMaterial({color:new THREE.Color('#8c8478').convertSRGBToLinear(),roughness:1,flatShading:true});
  marks=LM.map((L,i)=>{const g=new THREE.Group();g.position.set(L.p[0],seaY,L.p[1]);
   g.add(at(mesh(new THREE.CylinderGeometry(.1,.12,.08,10),stone),0,.02,0));
   if(i===0){const r=mesh(new THREE.DodecahedronGeometry(.1,0),stone);r.position.y=.1;r.scale.set(1.1,1.2,.9);r.rotation.set(.3,.5,.2);g.add(r);[[-.03,.2],[.04,.18]].forEach(([x,y])=>{const b=mesh(new THREE.SphereGeometry(.018,8,6),M.white||marb);b.position.set(x,y,0);g.add(b)})}
   if(i===1){g.add(at(mesh(new THREE.BoxGeometry(.08,.1,.08),marb),0,.11,0));g.add(at(mesh(new THREE.CylinderGeometry(.018,.03,.13,10),M.gold),0,.225,0));g.add(at(mesh(new THREE.SphereGeometry(.024,10,8),M.gold),0,.31,0));
    const arm=at(mesh(new THREE.CylinderGeometry(.007,.007,.09,6),M.gold),.035,.29,0);arm.rotation.z=-.6;g.add(arm)}
   if(i===2){const pts=[[0,0],[.04,.008],[.062,.05],[.06,.11],[.03,.145],[.027,.165],[.038,.172]].map(([a,b])=>new THREE.Vector2(a,b));g.add(at(mesh(new THREE.LatheGeometry(pts,18),terra),0,.06,0))}
   if(i===3){g.add(at(mesh(new THREE.CylinderGeometry(.035,.04,.2,12),marb),0,.15,0));const t=at(mesh(new THREE.CylinderGeometry(.035,.035,.1,12),marb),.06,.07,0);t.rotation.z=1.3;g.add(t)}
   if(i===4){const ob=mesh(new THREE.CylinderGeometry(.018,.04,.3,4),M.marbleD);ob.rotation.y=Math.PI/4;ob.position.y=.2;g.add(ob);const py=mesh(new THREE.ConeGeometry(.028,.05,4),M.gold);py.rotation.y=Math.PI/4;py.position.y=.375;g.add(py)}
   g.userData.obj=i;g.userData.lab=fpTag(L.n,{w:340,h:110,fs:46});deco.add(g);return g});
  wins=[[.12,.34],[-.12,.54],[.12,.74],[-.12,.34],[0,1.3]].map(([x,y])=>fpGlow(deco,new THREE.Vector3(x,y,y>1?-.27:-.34),.22))};
 P.objs=()=>FPT.st==='night'?marks:[];
 P.enter=()=>{deco.visible=true;{const w=PHAR.localToWorld(new THREE.Vector3(0,0,-2));P.waves=(WATER.waves||[]).filter(m=>m.visible&&Math.hypot(m.position.x-w.x,m.position.z-w.z)<1.6);P.waves.forEach(m=>m.visible=false)}marks.forEach(g=>{g.visible=true;g.scale.setScalar(1)});P.got=[];P.tries=0;P.miss=0;EYE.set(0,.5,-2.75);P.seen=-1;FPT.nightT=0;P.order=[0,1,2,3,4].sort(()=>Math.random()-.5);P.q=0};
 P.leave=()=>{deco.visible=false;(P.waves||[]).forEach(m=>m.visible=true);FPT.nightT=0;EYE.set(0,.5,-2.75);if(BEAM.m&&P.beamO)BEAM.m.children.forEach((m,i)=>m.material.opacity=P.beamO[i])};
 P.toMem=()=>{FPT.nightT=.45};
 P.go=(st)=>{if(st==='look'){fpHint('Papa disait : « L’aède suivait son chemin, dans l’ordre. Un marin, lui, doit retrouver chaque repère, dans n’importe quel ordre. La nuit, la carte reste à la bibliothèque. » Toucher pour écouter l’entrée du port.');
  fpWait(()=>{FPT.st='show';P.t0=performance.now();P.seen=-1})}};
 const ask=()=>{const k=P.order[P.q];fpHint('Papa : « Où était '+LM[k].n+' ? » Toucher l’endroit, dans le noir.')};
 P.tap=(st,h)=>{if(st!=='night'||h.obj==null)return;const k=P.order[P.q],g=marks[h.obj];
  if(h.obj===k){P.got.push(P.miss===0);P.miss=0;g.visible=true;g.scale.setScalar(.01);g.userData.pop=performance.now();sndTone([523,587,659,698,784][P.q],1.2,.12);
   {const lb=fpPut(g.userData.lab,.13,new THREE.Vector3(g.position.x,seaY+.42,g.position.z));fpAfter(1300,()=>fpUnput(lb))}P.q++;
   if(P.q<5)fpAfter(900,ask);else{FPT.st='end';fpHint('Le phare brille de toutes ses fenêtres. Le bateau rentre au port.');fpAfter(2200,()=>{const n=P.got.filter(Boolean).length;fpResult(`Au port : ${n} repères sur 5\nretrouvés du premier coup`);
     fpHint((n>=4?'Dans le désordre, dans le noir, sans carte : les repères étaient dans ma tête, chacun à sa place. Le rouleau garde ; ce qu’on retient éclaire.':'J’ai hésité, mais chaque repère a retrouvé sa place. Le rouleau garde ; ce qu’on retient éclaire.')+' Toucher pour continuer.');fpWait(()=>fpFinish())})}}
  else{P.miss++;P.shake=performance.now();sndTone(196,.5,.1);const gk=marks[k];
   if(P.miss>=2){gk.visible=true;gk.userData.blink=performance.now();fpHint('Le bateau frôle les rochers… « Là, regarde : '+LM[k].n+'. »');fpAfter(1400,()=>{if(P.order[P.q]===k)gk.visible=false})}
   else fpHint('Le bateau frôle les rochers. Ce n’était pas là. « Où était '+LM[k].n+' ? »')}};
 P.tick=(now,T,dt)=>{
  if(FPT.st==='show'){const el=now-P.t0-400,i=Math.floor(el/3600);if(el>0&&i<5&&i!==P.seen){P.seen=i;const g=marks[i];g.userData.blink=now;fpClearStage();fpPut(g.userData.lab,.13,new THREE.Vector3(g.position.x,seaY+.42,g.position.z));sndPaper(.25,.2);
     fpHint('Papa : « '+LM[i].t+' »')}
   if(i>=5&&P.seen!==9){P.seen=9;fpClearStage();FPT.nightT=1;fpHint('Puis la nuit tombait. Plus de repères : seulement la lumière du phare.');
    fpAfter(2800,()=>{marks.forEach(g=>g.visible=false);FPT.st='night';ask()})}}
  marks.forEach(g=>{const b=g.userData.blink?Math.max(0,1-(now-g.userData.blink)/1400):0;const pu=g.userData.pop?clamp((now-g.userData.pop)/450):1;if(g.visible)g.scale.setScalar(Math.max(.01,pu<1?pu+Math.sin(pu*Math.PI)*.2:1)*(1+.18*b))});
  const sh=P.shake?Math.max(0,1-(now-P.shake)/500):0,tgt=FPT.st==='end'||FPT.st==='mem'?PORT:new THREE.Vector3(0,.5,-2.75);EYE.x+=(tgt.x-EYE.x)*(1-Math.pow(.4,dt));EYE.z+=(tgt.z-EYE.z)*(1-Math.pow(.4,dt));EYE.y=tgt.y+Math.sin(T*1.3)*.012+Math.sin(sh*40)*.02*sh;
  wins.forEach((g,i)=>{g.material.opacity=i<P.got.length?.95:0;g.scale.setScalar(.22+.03*Math.sin(T*3+i))});
  if(BEAM.m){if(!P.beamO)P.beamO=BEAM.m.children.map(m=>m.material.opacity);BEAM.m.children.forEach((m,i)=>m.material.opacity=P.beamO[i]*(1+(FPT.night||0)*(1+P.got.length*.5)))}};
 P.auto=(st)=>{if(st==='night')fpTap({obj:P.order[P.q]})}}

/* ===== 4. Aujourd'hui : au bureau, devant la nouvelle bibliothèque d'Alexandrie =====
   Un bureau de papier, un vieux terminal en carton à l'écran bombé, et le carnet de Papa ouvert à côté.
   La conversation avec la machine s'affiche dans l'écran ; quand on cherche soi-même, le regard glisse vers le carnet. */
{const P={first:'ia',face:0,floorY:.16,eye:new THREE.Vector3(0,.29,.235),look:new THREE.Vector3(0,.245,0),hf:50,memUp:.25};FP_PLACES[4]=P;
 let DESK=null,scr,pap,M=null,cvs,ctx,tex,gaze=0;
 const kraft=(hex)=>new THREE.MeshStandardMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),roughness:.95});
 P.init=()=>{const dir=new THREE.Vector2(SPOT5.x-BAPOS[0],SPOT5.z-BAPOS[1]).normalize();
  DESK=new THREE.Group();DESK.position.set(BAPOS[0]+dir.x*.95,TOP,BAPOS[1]+dir.y*.95);DESK.rotation.y=Math.atan2(dir.x,dir.y);box.add(DESK);P.g=DESK;
  const wood=kraft('#9a6a3e'),beige=kraft('#e6dcc4'),dark=kraft('#3a3440'),cream=kraft('#f6efdc');
  DESK.add(at(mesh(new THREE.BoxGeometry(.46,.02,.24),wood),0,.16,.02));[[-.21,-.08],[.21,-.08],[-.21,.12],[.21,.12]].forEach(([x,z])=>DESK.add(at(mesh(new THREE.BoxGeometry(.02,.16,.02),wood),x,.08,z)));
  // le terminal : un gros boîtier de carton beige, l'écran bombé en verre sombre
  DESK.add(at(mesh(new THREE.BoxGeometry(.19,.15,.16),beige),0,.245,-.02));DESK.add(at(mesh(new THREE.BoxGeometry(.13,.1,.06),beige),0,.24,-.12));
  DESK.add(at(mesh(new THREE.BoxGeometry(.17,.13,.004),dark),0,.248,.062));
  cvs=document.createElement('canvas');cvs.width=cvs.height=768;ctx=cvs.getContext('2d');tex=fpTex(cvs);
  const sg=new THREE.PlaneGeometry(.15,.112,8,6);{const p=sg.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.075,y=p.getY(i)/.056;p.setZ(i,.008*(1-.5*(x*x+y*y)))}sg.computeVertexNormals()}
  scr=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({map:tex,color:0xffffff}));scr.position.set(0,.248,.065);DESK.add(scr);
  DESK.add(at(mesh(new THREE.BoxGeometry(.16,.008,.06),beige),0,.174,.1)); // le clavier
  for(let r=0;r<3;r++)for(let c=0;c<9;c++)DESK.add(at(mesh(new THREE.BoxGeometry(.012,.005,.012),cream,false,false),-.064+c*.016,.18,.082+r*.016));
  // le carnet de Papa, ouvert à droite du terminal
  pap=new THREE.Mesh(new THREE.PlaneGeometry(.17,.17),new THREE.MeshStandardMaterial({map:tex,roughness:.95}));pap.position.set(.22,.268,.05);DESK.add(pap);
  {const bk=at(mesh(new THREE.BoxGeometry(.182,.182,.008),kraft('#7a4a22')),.22,.268,.044);DESK.add(bk);const st=at(mesh(new THREE.BoxGeometry(.012,.09,.06),kraft('#5a3418')),.22,.215,.012);DESK.add(st)}
  {const lp=new THREE.Group();lp.add(at(mesh(new THREE.CylinderGeometry(.004,.004,.12,6),dark),0,.06,0));const sh=mesh(new THREE.ConeGeometry(.03,.035,12,1,true),kraft('#c8463a'));sh.position.y=.12;lp.add(sh);lp.position.set(-.19,.17,-.04);DESK.add(lp);
   const gl=fpGlow(DESK,new THREE.Vector3(-.17,.24,-.02),.18);gl.material.opacity=.5}
  DESK.visible=false};
 // quelle surface montre le jeu : l'écran de la machine, ou le papier (carnet, rangement, test)
 const surf=()=>M&&M.surf?M.surf():'screen';
 let hid=[];
 P.enter=()=>{DESK.visible=true;P.back=P.backT=0;const c=DESK.localToWorld(new THREE.Vector3(0,0,.2));hid=deco.children.filter(o=>o.visible&&o!==THEA&&Math.hypot(o.position.x-c.x,o.position.z-c.z)<.75);hid.forEach(o=>o.visible=false);M=mkIA();showHint(M.hint);gaze=surf()==='paper'?1:0};
 P.go=(st)=>{};
 P.leave=()=>{M=null;DESK.visible=false;hid.forEach(o=>o.visible=true);hid=[]};
 P.toMem=()=>{P.backT=1};
 P.pick=(e)=>{const s=surf()==='paper'?pap:scr,h=fpRay.intersectObject(s,false)[0];if(!h||!h.uv)return{};
  const cr=s===scr?[66,66,702,704]:[40,40,728,728];return{uv:[cr[0]+h.uv.x*(cr[2]-cr[0]),cr[1]+(1-h.uv.y)*(cr[3]-cr[1])]}};
 P.tap=(st,h)=>{if(st==='ia'&&M&&h.uv)M.down(h.uv[0],h.uv[1])};
 P.tick=(now,T,dt)=>{if(!M)return;ctx.save();M.draw(ctx,T);ctx.restore();tex.needsUpdate=true;
  const sp=surf(),cr=sp==='paper'?[40,40,728,728]:[66,66,702,704];tex.repeat.set((cr[2]-cr[0])/768,(cr[3]-cr[1])/768);tex.offset.set(cr[0]/768,1-cr[3]/768);
  scr.material.color.setScalar(sp==='paper'?.12:1);pap.material.color.setScalar(sp==='paper'?1:.0);pap.visible=sp==='paper';
  // le regard glisse de l'écran au carnet
  gaze+=((sp==='paper'?1:0)-gaze)*(1-Math.pow(.1,dt));P.back=(P.back||0)+((P.backT||0)-(P.back||0))*(1-Math.pow(.2,dt));const bk=P.back;P.look.set(.22*gaze,.245+.023*gaze,.05*gaze);P.eye.set(.22*gaze,.29-.02*gaze+.12*bk,.235+.02*gaze+.45*bk);
  if(M.done&&FPT.st==='ia'){FPT.st='fin';fpAfter(300,()=>fpFinish())}};
 P.getM=()=>M;
 P.auto=(st)=>{if(st==='ia'&&M&&!M.done)M.solve()}
 if(FPM){P.init();P.ready=1}}
