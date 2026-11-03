/* ---------- l'étoile tombée sur le sol, la traînée de poussière d'étoile, le mode Rappel, les souvenirs à revoir ---------- */
const STARTEX=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(255,255,240,1)');g.addColorStop(.1,'rgba(255,238,175,.95)');g.addColorStop(.32,'rgba(255,205,120,.35)');g.addColorStop(1,'rgba(255,190,90,0)');x.fillStyle=g;x.fillRect(0,0,256,256);
  x.globalCompositeOperation='lighter';[[0,124],[Math.PI/2,124],[Math.PI/4,62],[3*Math.PI/4,62]].forEach(([a,l])=>{x.save();x.translate(128,128);x.rotate(a);const lg=x.createLinearGradient(-l,0,l,0);lg.addColorStop(0,'rgba(255,240,200,0)');lg.addColorStop(.5,'rgba(255,252,235,1)');lg.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=lg;x.beginPath();x.moveTo(-l,0);x.lineTo(0,-6);x.lineTo(l,0);x.lineTo(0,6);x.closePath();x.fill();x.restore()});
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t})();
const BEAMTEX=(()=>{const c=document.createElement('canvas');c.width=8;c.height=256;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'rgba(255,245,215,.95)');g.addColorStop(.35,'rgba(255,230,170,.45)');g.addColorStop(1,'rgba(255,220,150,.12)');x.fillStyle=g;x.fillRect(0,0,8,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t})();
const starSprite=(s,top)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:STARTEX,transparent:true,depthWrite:false,depthTest:!top,blending:THREE.AdditiveBlending,toneMapped:false}));sp.scale.set(s,s,1);if(top)sp.renderOrder=20;sp.visible=false;box.add(sp);return sp};
const MARK={star:starSprite(1.0,true),beam:mesh(new THREE.CylinderGeometry(.03,.42,.8,24,1,true),new THREE.MeshBasicMaterial({map:BEAMTEX,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false}),false,false),
  dust:[...Array(18)].map(()=>starSprite(.2,false)),path:null,pt:0,free:[...SPOTS,SPOT5].map(()=>starSprite(.55,true))};
MARK.beam.renderOrder=19;MARK.beam.visible=false;box.add(MARK.beam);
// une traînée d'étoiles qui coule d'Alice vers le prochain lieu : on sait où aller, sans flèche
function markTick(T,now){recallTick(now);const tgt=phase==='play'&&!busy&&camMode!=='lid'&&!recallLost(now)?(next<4?SPOTS[next]:FIFTH==='open'?SPOT5:null):null;
  MARK.star.visible=MARK.beam.visible=!!tgt;
  if(tgt){const br=.5+.5*Math.sin(T*2.6);MARK.star.position.set(tgt.x,TOP+.85+.06*Math.sin(T*1.7),tgt.z);MARK.star.scale.setScalar(1.05+.35*br);MARK.star.material.rotation=T*.25;MARK.beam.position.set(tgt.x,TOP+.45,tgt.z);MARK.beam.material.opacity=.32+.22*br;
    const fd=Math.hypot(fig.position.x-tgt.x,fig.position.z-tgt.z);
    if(now-MARK.pt>700){MARK.pt=now;MARK.path=fd>1.1?[[fig.position.x,fig.position.z],...findPath(fig.position.x,fig.position.z,tgt.x,tgt.z)]:null}
    const P=MARK.path;let L=[0];if(P)for(let k=1;k<P.length;k++)L.push(L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]));const tot=P?L[L.length-1]:0;
    MARK.dust.forEach((d,k)=>{const s=.6+k*.42+((T*.7)%.42);if(!P||s>tot-.5||s>7.5){d.visible=false;return}let j=1;while(j<L.length-1&&L[j]<s)j++;const u=(s-L[j-1])/((L[j]-L[j-1])||1);d.position.set(P[j-1][0]+(P[j][0]-P[j-1][0])*u,TOP+.14+.05*Math.sin(T*3+k),P[j-1][1]+(P[j][1]-P[j-1][1])*u);d.visible=true;d.material.opacity=Math.min(1,(tot-.5-s)*1.5)*(1-s/8)*(.7+.3*Math.sin(T*5+k*1.7));d.scale.setScalar(.3+.07*Math.sin(T*4+k))})}
  else MARK.dust.forEach(d=>d.visible=false);
  // une fois la boîte finie : une petite étoile sur chaque lieu, pour revoir les souvenirs
  const fr=phase==='play'&&next>=4&&FIFTH==='done'&&!busy&&camMode!=='lid',FS=[...SPOTS,SPOT5];MARK.free.forEach((s,i)=>{s.visible=fr;if(fr){s.position.set(FS[i].x,TOP+.6+.05*Math.sin(T*2+i),FS[i].z);s.scale.setScalar(.8+.1*Math.sin(T*2.2+i));s.material.opacity=REPLAY.last===i?.35:.9}})}

// ---- les lieux fantômes (mode Rappel) : il faut s'en souvenir pour les rallumer
const PLACEG=[...PLACES,LIB].map(([px,pz])=>deco.children.find(o=>Math.abs(o.position.x-px)<1e-3&&Math.abs(o.position.z-pz)<1e-3)).filter(Boolean);
const GHOSTM=new THREE.MeshBasicMaterial({color:new THREE.Color('#d6e4ff'),transparent:true,opacity:.28,depthWrite:false});
function ghostPlace(g,on){if(!g)return;g.traverse(o=>{if(!o.isMesh)return;if(on){if(!o.userData.om)o.userData.om=o.material;o.material=GHOSTM;o.castShadow=false}else if(o.userData.om){o.material=o.userData.om;o.castShadow=true}})}
const POPS=[];function revive(i){const gs=i===3?[PLACEG[3],PLACEG[4]]:[PLACEG[i]];gs.forEach(g=>{if(!g)return;ghostPlace(g,false);if(g.userData.bs==null)g.userData.bs=g.scale.x;POPS.push({g,t0:performance.now()})});
  lit=Math.max(lit,i+1);KEEPS[i].userData.s=1;sndTone(523,1.6,.1);sndTone(659,1.6,.08,.12);sndTone(784,1.8,.07,.24);
  const b=starSprite(2.2,true);b.position.set(SPOTS[i].x,TOP+.7,SPOTS[i].z);b.visible=true;POPS.push({burst:b,t0:performance.now()})}
function popTick(now){for(let k=POPS.length-1;k>=0;k--){const p=POPS[k],e=(now-p.t0)/700;if(p.g){const s=p.g.userData.bs*(1+.22*Math.sin(Math.min(1,e)*Math.PI)*(1-Math.min(1,e)));p.g.scale.set(s,s,s);if(e>=1){p.g.scale.setScalar(p.g.userData.bs);POPS.splice(k,1)}}
  else{p.burst.material.opacity=Math.max(0,1-e/1.4);p.burst.scale.setScalar(1+e*2.2);if(e>1.4){box.remove(p.burst);POPS.splice(k,1)}}}}

// ---- mode : découverte (première fois) ou rappel (au retour)
const DONE_K='nfox-b1-fait',MODE_K='nfox-b1-mode';
const isDone=()=>{try{return localStorage.getItem(DONE_K)==='1'}catch(_){return false}};
const RECALL=location.hash.includes('rappel')||(()=>{try{return isDone()&&localStorage.getItem(MODE_K)==='rappel'}catch(_){return false}})();
const LAST_K='nfox-b1-date',SCORE_K='nfox-b1-scores';
function markDone(){try{localStorage.setItem(DONE_K,'1');localStorage.setItem(LAST_K,String(Date.now()))}catch(_){}modeBtnSync()}
const dayFr=n=>{try{return new Date(Date.now()+n*864e5).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}).replace(/ /g,'\u00a0')}catch(_){return 'dans\u00a0'+n+'\u00a0jours'}};
function daysSince(){try{const d=+localStorage.getItem(LAST_K);return d?Math.floor((Date.now()-d)/864e5):-1}catch(_){return -1}}
function scores(){try{return JSON.parse(localStorage.getItem(SCORE_K)||'[]')}catch(_){return[]}}
function saveScore(n){try{const s=scores();s.push(n);localStorage.setItem(SCORE_K,JSON.stringify(s.slice(-10)))}catch(_){}}
function returnLine(){const d=daysSince();if(d<0)return 'La boîte a pâli.';if(d===0)return 'Déjà de retour ? La boîte a pâli quand même.';if(d<=2)return `${d===1?'Un jour':d+' jours'} seulement. La boîte a pâli.`;return `${d} jours. Le bon moment : la boîte a pâli, pas ma mémoire.`}
function modeBtnSync(){const b=document.getElementById('mode');if(!b)return;b.hidden=!(isDone()||RECALL);b.textContent=RECALL?'Découverte':'Rappel';b.setAttribute('aria-label',RECALL?'Revenir au mode découverte':'Mode rappel : rallumer la boîte de mémoire')}
{const b=document.getElementById('mode');if(b){modeBtnSync();b.addEventListener('click',ev=>{ev.stopPropagation();const cf=document.getElementById('modecf');cf.querySelector('.q').textContent=RECALL?'Revenir au mode Découverte ? La boîte se refermera.':'Passer en mode Rappel ? La boîte se refermera, et il faudra tout retrouver de mémoire.';cf.hidden=!cf.hidden});
  const cf=document.getElementById('modecf');cf.addEventListener('pointerdown',ev=>ev.stopPropagation());cf.querySelector('.no').addEventListener('click',ev=>{ev.stopPropagation();cf.hidden=true});
  cf.querySelector('.yes').addEventListener('click',ev=>{ev.stopPropagation();cf.hidden=true;try{localStorage.setItem(MODE_K,RECALL?'decouverte':'rappel')}catch(_){}document.getElementById('fade').classList.add('on');setTimeout(()=>{if(location.hash.includes('rappel'))location.hash='';location.reload()},650)});
  document.addEventListener('pointerdown',ev=>{if(!cf.hidden&&!cf.contains(ev.target)&&ev.target!==b)cf.hidden=true},true)}}
if(RECALL){PLACEG.forEach(g=>ghostPlace(g,true))}

// ---- le rappel : retrouver le chemin de mémoire (pas d'étoile-guide), une carte à chaque lieu, puis réécrire l'argument dans son journal
const RNAME=['Göbekli Tepe, les pierres levées.','Le théâtre, en Grèce.','Thèbes, le palais de Thamus.','Alexandrie, au bord du delta.'];
function pipsSync(){const p=document.getElementById('pips');if(!p)return;p.hidden=!RECALL||phase!=='play';p.innerHTML=CARDST.map(s=>`<i class="${s===1?'ok':s===0?'no':''}"></i>`).join('')}
const REC={t:performance.now(),warn:-1};
SCRIPTS.rintro=[{fn:()=>{SCRIPTS.rintro[1].t=returnLine()+' Cette fois, pas d’étoile pour me guider : il faut me souvenir du chemin.'}},{say:'alice',t:''},{fn:()=>{pipsSync();showHint('Retrouver les lieux dans l’ordre de l’histoire. Par où tout a commencé ?')}}];
[0,1,2,3].forEach(i=>{SCRIPTS['r'+i]=[{say:'lieu',t:RNAME[i]},{card:RCARD[i]},{fn:()=>revive(i)},{wait:1100},...(i<3?[{fn:()=>{next=i+1;REC.t=performance.now()}}]:
  [{wait:500},{cam:'lid'},{trace:1},{fn:()=>{constelT=1}},{wait:1400},{fn:()=>{vegaT=1;sndTone(784,2.4,.12);sndTone(1175,2.4,.06,.25)}},{wait:900},
   {cam:'box'},{say:'lieu',t:'Alexandrie, aujourd’hui.'},{card:RCARD[4]},{fn:()=>{ghostPlace(BAG,false);BAG.userData.bs=1;POPS.push({g:BAG,t0:performance.now()});sndTone(659,1.6,.1)}},{wait:1000},{retry:5},
   {cam:'lid'},{say:'alice',t:'Maintenant, je le réécris dans mon journal. Sans rien relire.'},{arg:1},{say:'alice',t:'Si je peux le réécrire, c’est que je l’ai compris.'},{fn:()=>{const n=CARDFIRST.filter(x=>x===1).length,prev=scores();saveScore(n);const p=prev.length?prev[prev.length-1]:null;Q.splice(qi,0,{say:'lieu',t:(p==null?`Cartes retrouvées du premier coup : ${n} sur 5.`:`Cartes retrouvées du premier coup : ${n} sur 5. La dernière fois : ${p} sur 5.`)+' Prochain rappel conseillé : '+dayFr(7)+'.'})}},{cam:'box'},{fn:()=>{hideSay();next=4;REPLAY.last=3;markDone()}}])]});
// en mode rappel, l'étoile-guide ne revient que si on reste perdu un moment ; arriver au mauvais lieu donne un indice doux
function recallTick(now){if(!RECALL||phase!=='play')return;pipsSync();if(figState.moving||busy)REC.t=now;
  if(next<4&&!busy){SPOTS.forEach((s,j)=>{if(j>next&&fig.position.distanceTo(s)<.6&&REC.warn!==j){REC.warn=j;showHint('« Pas encore : ce lieu-là vient plus tard dans l’histoire. »')}})}}
const recallLost=now=>RECALL&&now-REC.t<22000;
// ---- réécrire l'argument : cinq étiquettes à remettre dans l'ordre, chacune à côté de l'image de son lieu
const ARG=['Avant l’écriture, on rangeait le savoir dans des lieux.','Un lieu par scène : les aèdes gardaient 16 000 vers en tête.','Avec l’écriture, Thamus craint qu’on relise au lieu de retenir.','Kelly : garder l’écrit, mais réapprendre à retenir.','Avec l’IA : chercher d’abord soi-même, puis demander.'];
function startArg(){curManip=mkArg();SCR.kind='manip';SCR.obj=curManip;SCR.ta=1;curManip.panel()}
// réécrire l'argument : les phrases à choisir sont en bas (grandes, lisibles) ; on les écrit dans l'ordre, en face de chaque lieu
function mkArg(){const order=[0,1,2,3,4].sort(()=>Math.random()-.5),labels=order.map(k=>({k,slot:-1,flash:0}));
 const SL=[0,1,2,3,4].map(i=>({y:150+i*122}));const ICN=[...ICONS.slice(0,4).map(ic=>{const o=document.createElement('canvas');o.width=ic.width;o.height=ic.height;const x=o.getContext('2d');x.drawImage(ic,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#22306e';x.fillRect(0,0,o.width,o.height);return o}),null];
 const M={done:false,hint:'',
 panel(){say.className='line ask';sayWho.textContent='';sayTxt.innerHTML='';const p=document.createElement('div');p.textContent=M.end?'Réécrit de mémoire ✓':'Choisir la phrase suivante de l’histoire :';sayTxt.appendChild(p);
  if(!M.end)labels.filter(l=>l.slot<0).forEach(l=>{const b=document.createElement('button');b.className='ch';b.textContent=nb(ARG[l.k]);b.addEventListener('click',ev=>{ev.stopPropagation();M.pick(l)});sayTxt.appendChild(b)});say.hidden=false},
 pick(l){const s=[0,1,2,3,4].find(i=>!labels.some(o=>o.slot===i));l.slot=s;sndPaper(.25,.18);if(labels.every(o=>o.slot>=0))M.check();else M.panel()},
 draw(c,T){c.fillStyle='#fbf3df';c.fillRect(0,0,MS,MS);c.strokeStyle='rgba(120,150,200,.3)';c.lineWidth=2;for(let y=40;y<MS;y+=61){c.beginPath();c.moveTo(0,y);c.lineTo(MS,y);c.stroke()}
  c.drawImage(PAPERG,0,0);c.textAlign='left';c.font='700 44px Caveat, cursive';c.fillStyle='#a84a2a';c.fillText('Ce que la boîte raconte',34,62);
  SL.forEach((s,i)=>{c.save();c.globalAlpha=.9;if(ICN[i])c.drawImage(ICN[i],18,s.y-26,62,62);else{c.font='700 42px Caveat, cursive';c.fillStyle='#22306e';c.fillText('✦',36,s.y+22)}c.restore();
   const L=labels.find(l=>l.slot===i);
   if(L){const sh=L.flash>performance.now()?Math.sin(performance.now()/40)*6:0;c.font='600 46px Caveat, cursive';c.fillStyle=L.ok===false?'#a03030':'#22306e';jLines(c,nb(ARG[L.k]),640).slice(0,2).forEach((ln,k)=>c.fillText(ln,98+sh,s.y+6+k*48))}
   else{c.strokeStyle='rgba(34,48,110,.35)';c.setLineDash([6,8]);c.beginPath();c.moveTo(98,s.y+14);c.lineTo(740,s.y+14);c.stroke();c.setLineDash([])}});
  c.textAlign='start'},
 down(cx,cy){if(M.end)return;const i=SL.findIndex(s=>cy>s.y-40&&cy<s.y+80);if(i>=0){const L=labels.find(l=>l.slot===i);if(L&&!L.ok){L.slot=-1;L.ok=undefined;M.panel()}}},
 check(){let all=true;labels.forEach(l=>{l.ok=l.slot===l.k;if(!l.ok){all=false;l.flash=performance.now()+600}});
  if(all){M.end=true;M.panel();sndTone(523,1.2,.1);sndTone(659,1.2,.08,.15);sndTone(784,1.4,.07,.3);setTimeout(()=>{M.done=true},2200)}
  else{say.className='hint';sayWho.textContent='';sayTxt.textContent='« Presque. Regarde l’image de chaque lieu : quelle phrase va avec ? »';setTimeout(()=>{labels.forEach(l=>{if(!l.ok){l.slot=-1;l.ok=undefined}});M.panel()},1400)}},
 move(){},up(){},solve(){labels.forEach(l=>{l.slot=l.k;l.ok=true});M.end=true;M.done=true}};return M}
// ---- souvenirs à revoir : une fois la boîte finie, chaque étoile au sol rejoue l'écho d'Alice
const REPLAY={last:-1};
[0,1,2,3].forEach(i=>{const S=SCRIPTS[i],a=S.findIndex(s=>s.mem),b=S.findIndex(s=>s.memoff);if(a>=0&&b>a)SCRIPTS['m'+i]=[{cam:'lid'},...S.slice(a,b+1),{cam:'box'}]});
const ACTS=[()=>mkPierres(),()=>mkTheatre(),()=>mkThot(),()=>mkPhares(),()=>mkIA()];
[0,1,2,3,4].forEach(i=>{SCRIPTS['a'+i]=[{cam:'lid'},{manip:ACTS[i]},{cam:'box'}]});
const PLNAME=['Göbekli Tepe','Le théâtre','Thèbes','Alexandrie','Alexandrie, aujourd’hui'];
function offerReplay(i){say.className='line ask';sayWho.textContent='';sayTxt.innerHTML='';const p=document.createElement('div');p.textContent=PLNAME[i]+'.';sayTxt.appendChild(p);
  [['Revoir le souvenir d’Alice',()=>run('m'+i)],['Refaire l’activité',()=>run('a'+i)],['Continuer à me promener',()=>{}]].forEach(([t,f])=>{const bt=document.createElement('button');bt.className='ch';bt.textContent=t;bt.addEventListener('click',ev=>{ev.stopPropagation();hideSay();f()});sayTxt.appendChild(bt)});
  say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=false}
function replayTick(){if(phase!=='play'||busy||next<4||FIFTH!=='done')return;const FS=[...SPOTS,SPOT5];let near=-1;FS.forEach((s,i)=>{if(fig.position.distanceTo(s)<.5)near=i});
  if(near<0){if(REPLAY.last>=0&&fig.position.distanceTo(FS[REPLAY.last])>1.2){REPLAY.last=-1;if(say.classList.contains('ask'))hideSay()}return}if(near===REPLAY.last)return;REPLAY.last=near;figState.path=[];figState.tx=fig.position.x;figState.tz=fig.position.z;offerReplay(near)}
