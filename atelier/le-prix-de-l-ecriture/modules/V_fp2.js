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
  fpAfter(600+P.len*900,()=>{FPT.st='input';fpHint(P.len===3?'« À toi de rechanter l’histoire : touche les pierres dans le même ordre. »':'« L’histoire s’allonge. Rechante-la. »')})};
 P.go=(st)=>{if(st==='intro')fpHint('Il y a 11 600 ans, des chasseurs dressaient ici des piliers géants, gravés d’animaux. Papa disait qu’ils chantaient une histoire. Toucher une pierre pour l’écouter.')};
 P.tap=(st,h)=>{
  if(st==='intro'&&h.obj!=null){P.show();return}
  if(st==='input'&&h.obj!=null){const j=h.obj;P.light(j,.8);
   if(j===P.seq[P.inp]){P.inp++;if(P.inp>=P.len){if(P.len===3){P.len=4;FPT.st='wait';fpHint('« Bien ! Écoute la suite… »');fpAfter(1300,()=>P.show())}
     else{FPT.st='wait';fpHint('« Tu connais l’histoire des pierres. »');fpAfter(1700,()=>{fpCurtKT=1;fpHint('Puis Papa éteignait la lumière…');fpAfter(1200,()=>{pil.forEach(p=>p.visible=false);P.sites.forEach(d=>{d.visible=true;d.material.emissiveIntensity=.25});P.inp=0;P.got=[];fpCurtKT=0;
       fpAfter(500,()=>{FPT.st='ask';fpHint('« Les pierres ont disparu. » Toucher les cercles où elles étaient, dans l’ordre de l’histoire.')})})})}}}
   else{FPT.st='wait';fpHint('« Presque. Écoute encore. »');fpAfter(1200,()=>P.show())}return}
  if(st==='ask'&&h.site!=null){const s=h.site;if(P.got.some(o=>o.s===s))return;const ok=s===P.seq[P.inp];P.got.push({s,ok});sndTone(PIL_NOTES[s],.9,.13);
   fpPut(fpTag(String(P.inp+1),{w:120,h:120,fs:70,col:ok?'#2a6a2a':'#a8582a'}),.14,P.sites[s].position.clone().add(new THREE.Vector3(0,.01,0)));P.sites[s].visible=false;P.inp++;
   if(P.inp>=4){FPT.st='end';const n=P.got.filter(o=>o.ok).length;fpAfter(700,()=>{pil.forEach(p=>p.visible=true);fpPut(fpTag(`${n} sur 4, de mémoire`,{w:520,h:140,fs:52,col:'#22306e'}),.12,new THREE.Vector3(.24,.228,-.37));
     fpHint((n>=3?'« Tu as revu les pierres dans ta tête, n’est-ce pas ? Le chant était là où on l’avait laissé. C’est ça, un palais de mémoire. »':'« Les places t’ont déjà aidée. Avec un peu d’habitude, on retrouve tout un chant comme ça : c’est un palais de mémoire. »')+' Toucher pour continuer.');fpWait(()=>fpFinish())})}return}};
 P.tick=(now,T)=>{glows.forEach((g,j)=>{const idle=FPT.st==='intro'?.18+.12*Math.sin(T*3+j):0;g.material.opacity=Math.max(idle,Math.max(0,1-(now-T0[j])/900)*.95);g.visible=pil[j].visible})};
 P.auto=(st)=>{if(st==='intro')fpTap({obj:0});else if(st==='input')fpTap({obj:P.seq[P.inp]});else if(st==='ask')fpTap({site:P.seq[P.inp]})}}

/* ===== 2. Thèbes : debout dans la cour du palais, face au roi Thamus (à gauche) et à Thot (à droite) =====
   Les offrandes sont posées par terre devant nous ; le papyrus de Thot se lit en grand, puis se roule à chaque offrande. */
{const P={first:'look',face:0,floorY:0,eye:new THREE.Vector3(0,.74,2.2),look:new THREE.Vector3(0,.14,.85),hf:54,memUp:.3,arc:.12};FP_PLACES[2]=P;
 const N=5;let deco,offs=[],hud=null,roll=null;
 // une carte « tenue » devant la caméra (le papyrus ouvert, ou roulé dans un coin)
 const mkHud=(c,h)=>{const m=fpCard(c,h,{noShadow:true,ro:22});m.material.depthTest=false;m.visible=false;scene.add(m);return m};
 P.init=()=>{P.g=PALA;deco=new THREE.Group();deco.visible=false;PALA.add(deco)};
 P.enter=()=>{deco.visible=true;const NO=OFFER.length,ids=[...Array(NO).keys()];P.list=[...ids].sort(()=>Math.random()-.5).slice(0,N);P.got=0;P.err=0;P.reads=1;P.open=true;
  const order=[...ids].sort(()=>Math.random()-.5);offs.forEach(o=>deco.remove(o));
  offs=order.map((k,i)=>{const r=Math.floor(i/4),c=i%4,p=fpCard(OFFER[k].s,.13);p.position.set(-.42+c*.28+(r%2)*.06,.07,1.55-r*.21);p.userData={obj:i,k,sel:false};deco.add(p);return p});
  if(!hud){hud=mkHud(papyrusSheet(P.list),.2);roll=mkHud(kidScroll,.06);roll.userData.obj='scroll'}else{scene.remove(hud);hud=mkHud(papyrusSheet(P.list),.2)}};
 P.leave=()=>{deco.visible=false;hud.visible=roll.visible=false};
 P.toMem=()=>{hud.visible=roll.visible=false};
 P.objs=()=>FPT.st==='task'?[...offs.filter(o=>!o.userData.sel),...(roll.visible?[roll]:[])]:[];
 P.go=(st)=>{if(st==='look'){fpHint('Papa jouait à Thot : « Voici la liste des offrandes. Regarde-la bien. » Toucher pour commencer.');fpWait(()=>{FPT.st='task';P.open=false;fpHint('« Maintenant, apporte-les au roi. Et si tu as un doute, tu peux relire la liste. » Toucher une offrande pour l’apporter.')})}};
 const kingAt=(n)=>new THREE.Vector3(-.36+(n%3)*.09,.02,.86+Math.floor(n/3)*.06);
 P.tap=(st,h)=>{if(st!=='task')return;
  if(h.obj==='scroll'){P.open=true;P.reads++;sndPaper(.35,.25);return}
  if(h.obj==null)return;const o=offs[h.obj];if(!o||o.userData.sel)return;
  if(P.list.includes(o.userData.k)){o.userData.sel=true;P.open=false;const w=o.getWorldPosition(new THREE.Vector3());o.visible=false;fpFly(null,kingAt(P.got),.09,null,{c:OFFER[o.userData.k].s,w});P.got++;
    if(P.got===1)fpHint('Le papyrus se roulait à chaque offrande. Le relire ? Il suffisait de le toucher, en bas.');
    if(P.got===N){FPT.st='burn';P.open=true;P.burnT=performance.now();fpHint('Puis Thamus prenait le papyrus… et le jetait au vent.');
     fpAfter(1700,()=>{FPT.st='result';fpPut(fpTag((P.err?`${N} offrandes · ${P.err===1?'1 erreur':P.err+' erreurs'}`:`${N} offrandes, sans erreur`)+'\n'+(P.reads<2?'lu une seule fois':`relu ${P.reads-1} fois`),{w:600,h:190,fs:46,col:'#7a2a08'}),.16,new THREE.Vector3(0,.01,1.72));
      fpHint((P.reads<=1&&!P.err?'« Tu ne l’as lu qu’une fois : tu t’es forcée à retenir. Mais qui fait cet effort, quand la liste est toujours là ? »':P.reads<=1?'« Une seule lecture, et presque tout de mémoire. Les erreurs montrent l’effort : c’est lui qui fait retenir. »':'« Tu l’as relu '+(P.reads-1)+' fois : la liste faisait l’effort à ta place. » Exactement la crainte de Thamus.')+' Toucher pour continuer.');fpWait(()=>fpFinish())})}}
  else{P.err++;o.userData.shake=performance.now();sndTone(330,.4,.08);fpHint('Thamus fronçait les sourcils : ce n’était pas sur la liste. « Tu peux la relire. »')}};
 P.tick=(now)=>{const fw=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion),rt=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  const vh=2*Math.tan(camera.fov*Math.PI/360)*.3,vw=vh*camera.aspect;
  const burn=FPT.st==='burn'?clamp((now-P.burnT)/1200):0,showHud=(FPT.st==='look'||(FPT.st==='task'&&P.open)||FPT.st==='burn')&&burn<1;
  hud.visible=showHud&&FPT.k>.9;if(hud.visible){const s=Math.min(1,vw*.8/hud.geometry.parameters.width);hud.position.copy(camera.position).addScaledVector(fw,.3).addScaledVector(up,vh*.17+burn*.1).addScaledVector(rt,-burn*vw*.8);hud.quaternion.copy(camera.quaternion);hud.rotateZ(-.03-burn*.9);hud.scale.setScalar(s);hud.material.opacity=1-burn}
  roll.visible=FPT.st==='task'&&!P.open&&FPT.k>.9;if(roll.visible){roll.position.copy(camera.position).addScaledVector(fw,.3).addScaledVector(up,-vh*.2).addScaledVector(rt,-vw*.33);roll.quaternion.copy(camera.quaternion);roll.scale.setScalar(1+.06*Math.sin(now/300))}
  offs.forEach(o=>{const sh=o.userData.shake?Math.max(0,1-(now-o.userData.shake)/500):0;o.rotation.z=Math.sin(sh*30)*.15*sh})};
 P.auto=(st)=>{if(st==='task'){const o=offs.find(o=>!o.userData.sel&&P.list.includes(o.userData.k));if(o)fpTap({obj:o.userData.obj})}}}

/* ===== 3. Alexandrie : sur le rivage, face au phare ; la bibliothèque est à gauche =====
   Trois questions ; pour chacune : chercher de mémoire, ou relire le rouleau. Ce qu'on retrouve soi-même allume une lampe vive. */
{const P={first:'q',face:Math.PI,floorY:0,eye:new THREE.Vector3(-.35,.5,-2.3),look:new THREE.Vector3(.05,.85,0),hf:52,memUp:.15};FP_PLACES[3]=P;
 let deco,lamps=[],scroll=null,beamO=null;
 const scrollC=(a)=>{const c=document.createElement('canvas');c.width=640;c.height=200;const x=c.getContext('2d');x.fillStyle='#f2e2b0';x.fillRect(40,20,560,160);[40,600].forEach(px=>{x.fillStyle='#d8bf86';x.beginPath();x.ellipse(px,100,16,86,0,0,7);x.fill()});
  x.font='700 46px Caveat, cursive';x.fillStyle='#5a3418';x.textAlign='center';x.textBaseline='middle';x.fillText(a,320,104);return c};
 P.init=()=>{P.g=PHAR;deco=new THREE.Group();deco.visible=false;PHAR.add(deco);
  lamps=[[0,.55,-.33],[0,1.27,-.29],[0,1.72,-.2]].map(p=>fpGlow(deco,new THREE.Vector3(...p),.35))};
 P.enter=()=>{deco.visible=true;P.q=0;P.lamps=[0,0,0];P.mode='choose';if(BEAM.m&&!beamO)beamO=BEAM.m.children.map(m=>m.material.opacity)};
 P.leave=()=>{deco.visible=false;if(scroll)scroll.visible=false;if(BEAM.m&&beamO)BEAM.m.children.forEach((m,i)=>m.material.opacity=beamO[i])};
 P.toMem=()=>{if(scroll)scroll.visible=false};
 P.ask=()=>{const [q,a,...bs]=PQ[P.q];P.mode='choose';fpSetHand([['De mémoire','la lampe brillera fort'],['Relire le rouleau','la bibliothèque le sait']].map(([t,u],i)=>({c:fpTag(t+'\n'+u,{w:520,h:150,fs:42}),i})),true);
  fpHint((P.q===0?'« Si tu te perds, allume tes phares », disait Papa. ':'')+q+' Chercher de mémoire, ou relire le rouleau ?')};
 P.go=(st)=>{if(st==='q')P.ask()};
 P.next=()=>{P.q++;fpSetHand([]);if(P.q>=3){FPT.st='end';const b=P.lamps.filter(v=>v===2).length;
   fpPut(fpTag(`${b} sur 3 retrouvées de mémoire\nLe rouleau garde. Ce qu’on retient éclaire.`,{w:640,h:190,fs:42,col:'#22306e'}),.17,new THREE.Vector3(-.2,.02,-1.2));
   fpHint((b===3?'Trois lampes vives : le phare éclaire loin. Le rouleau garde ; c’est ce qu’on retient qui éclaire.':b===0?'Le rouleau avait toutes les réponses… mais le phare brille à peine. Ce qu’on n’a pas retenu n’éclaire pas.':'Le rouleau garde les réponses. Mais seules celles que je portais en moi brillent vraiment.')+' Toucher pour continuer.');fpWait(()=>fpFinish());return}
  fpAfter(400,()=>P.ask())};
 P.tap=(st,h)=>{if(st!=='q')return;
  if(P.mode==='scroll'){P.lamps[P.q]=1;sndTone([392,440,494][P.q],.8,.06);fpHint('Une petite lueur. Le rouleau a répondu à ma place.');scroll.visible=false;P.mode='wait';fpAfter(1500,()=>P.next());return}
  if(!h.hand||P.mode==='wait')return;
  if(P.mode==='choose'){sndPaper(.3,.25);if(h.hand.i===0){P.mode='mem';const [q,a,...bs]=PQ[P.q];const opts=[[a,1],...bs.map(b=>[b,0])].sort(()=>Math.random()-.5);fpSetHand(opts.map(([t,ok])=>({c:fpTag(t,{w:560,h:110,fs:42}),ok})),true);fpHint(q)}
   else{P.mode='scroll';fpSetHand([]);if(scroll)scene.remove(scroll);scroll=fpCard(scrollC(PQ[P.q][1]),.1,{noShadow:true,ro:22});scroll.material.depthTest=false;scene.add(scroll);fpHint('La bibliothèque gardait la réponse. Le rouleau se déroulait… Toucher pour continuer.')}return}
  if(P.mode==='mem'){const ok=h.hand.ok;P.mode='wait';FPT.sel=h.hand;sndPaper(.3,.25);fpAfter(ok?700:1800,()=>{P.lamps[P.q]=ok?2:1;if(ok){sndTone([523,659,784][P.q],1.2,.12);fpHint('Retrouvé de mémoire : la lampe brille fort.')}else fpHint('Pas tout à fait : la bonne réponse était « '+PQ[P.q][1]+' ». Une petite lueur seulement.');fpAfter(1500,()=>P.next())});return}};
 P.tick=(now,T)=>{lamps.forEach((g,i)=>{const v=P.lamps[i];const cur=FPT.st==='q'&&i===P.q&&!v;g.material.opacity=v===2?.95:v===1?.35:cur?.25+.2*Math.sin(T*4):0;g.scale.setScalar(v===2?.42+.03*Math.sin(T*3+i):v===1?.22:.3)});
  if(BEAM.m&&beamO){const b=P.lamps.filter(v=>v===2).length;BEAM.m.children.forEach((m,i)=>m.material.opacity=beamO[i]*(FPT.st==='end'?.6+b*1.2:1))}
  if(scroll&&scroll.visible!==undefined){scroll.visible=P.mode==='scroll'&&FPT.k>.9;if(scroll.visible){const fw=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion),vh=2*Math.tan(camera.fov*Math.PI/360)*.3,vw=vh*camera.aspect;
   scroll.position.copy(camera.position).addScaledVector(fw,.3).addScaledVector(up,vh*.05);scroll.quaternion.copy(camera.quaternion);scroll.scale.setScalar(Math.min(1.4,vw*.85/scroll.geometry.parameters.width))}}};
 P.auto=(st)=>{if(st!=='q')return;if(P.mode==='choose')fpTap({hand:FPT.hand[0]});else if(P.mode==='mem')fpTap({hand:FPT.hand.find(o=>o.ok)});else if(P.mode==='scroll')fpTap({})}}
