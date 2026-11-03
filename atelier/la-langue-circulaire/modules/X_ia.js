/* ---------- le cinquième lieu : l'université, aujourd'hui ; la salle des enregistrements, et les langues qui disparaissent ---------- */
// le bâtiment : un pavillon rond (un cercle, encore), une bande peinte d'ondes sonores, une porte allumée
const BAG=new THREE.Group();
{const band=canvasTex(1024,128,(x,W,H)=>{x.fillStyle='#e8e4da';x.fillRect(0,0,W,H);x.strokeStyle='#3e4247';x.lineWidth=3;x.beginPath();for(let u=0;u<=W;u+=3){const a=Math.sin(u*.07)*Math.sin(u*.011)*40;u?x.lineTo(u,H/2+a):x.moveTo(u,H/2+a)}x.stroke();
   x.strokeStyle='rgba(62,66,71,.35)';x.lineWidth=2;x.beginPath();for(let u=0;u<=W;u+=3){const a=Math.sin(u*.05+1)*Math.sin(u*.017)*30;u?x.lineTo(u,H/2+a):x.moveTo(u,H/2+a)}x.stroke()},true);band.wrapS=THREE.RepeatWrapping;
 const drum=mesh(new THREE.CylinderGeometry(.58,.6,.42,48),[new THREE.MeshStandardMaterial({map:band,roughness:.95,bumpMap:FIB,bumpScale:.008}),M.cream,M.cream]);drum.position.y=.21;BAG.add(drum);
 const roof=mesh(new THREE.SphereGeometry(.62,40,12,0,Math.PI*2,0,Math.PI*.22),M.slate);roof.scale.y=.6;roof.position.y=.33;BAG.add(roof);
 BAG.add(at(mesh(new THREE.BoxGeometry(.18,.26,.04),M.glass,false,false),0,.13,.58));
 // deux bobines de bande magnétique, posées dehors comme une enseigne
 [-1,1].forEach(k=>{const r=mesh(new THREE.CylinderGeometry(.11,.11,.03,24),M.slateL);r.rotation.x=Math.PI/2;r.position.set(.32+k*.13,.62,.32);BAG.add(r);const h=mesh(new THREE.CylinderGeometry(.03,.03,.035,10),M.cream);h.rotation.x=Math.PI/2;h.position.copy(r.position);BAG.add(h)});
 BAG.add(at(mesh(new THREE.CylinderGeometry(.008,.008,.3,5),M.slate),.32,.45,.32));
 BAG.position.set(BAPOS[0],TOP,BAPOS[1]);BAG.rotation.y=-.2;BAG.visible=false;BAG.scale.set(1,.01,1);deco.add(BAG)}
let FIFTH=RECALL?'done':'locked',FIFTH_T=0;
if(RECALL){BAG.visible=true;BAG.scale.set(1,1,1);ghostPlace(BAG,true)}
function unlock5(){FIFTH='open';FIFTH_T=performance.now();BAG.visible=true;sndTone(392,2.4,.08);sndTone(587,2.6,.07,.3);sndTone(784,2.8,.06,.6)}
function fifthTick(now){if(FIFTH_T){const e=Math.min(1,(now-FIFTH_T)/2200),k=1-Math.pow(1-e,3);BAG.scale.set(1,Math.max(.01,k*(1+.08*Math.sin(e*Math.PI))),1);if(e>=1)FIFTH_T=0}
  if(FIFTH==='open'&&phase==='play'&&!busy&&fig.position.distanceTo(SPOT5)<.5){FIFTH='busy';figState.path=[];figState.tx=fig.position.x;figState.tz=fig.position.z;figState.moving=false;fig.userData.face=Math.atan2(BAPOS[0]-fig.position.x,BAPOS[1]-fig.position.z);hideSay();run('ai')}
  if(AUTO&&FIFTH==='open'&&!busy&&!figState.moving)goTo(SPOT5.x,SPOT5.z)}
function drawSat(){}

/* ---- l'activité : « Comment je le sais » (les évidentiels), puis le carnet de Grand-père */
const TARI=[['niwhãka','on l’a vu mordre'],['niwhãmahka','on a entendu les cris'],['niwhãpidaka','quelqu’un l’a raconté'],['niwhãsika','on a vu la blessure'],['niwhãnihka','on le devine à son air']];
const EV=[['vu',{seed:81,f:[{a:-1.57,k:'blob',s:1.6},{a:1.57,k:'blob',s:1.6}]}],['entendu',{seed:82,f:[{a:0,k:'tendril',s:1.3,c:.12},{a:.4,k:'tendril',s:1,c:.12}]}],['on me l’a dit',{seed:83,f:[{a:2.4,k:'hook',s:1.4},{a:3.9,k:'hook',s:1.4,c:-1}]}],['déduit',{seed:84,f:[{a:-.8,k:'spike',s:1.2},{a:.8,k:'spike',s:1.2,d:-1}]}]];
const WEEK=[['La carte de Maman est arrivée.',x=>{F(x,'#f3ead6',c=>c.rect(40,40,150,100));x.beginPath();x.moveTo(120,50);x.lineTo(120,130);x.stroke();F(x,'#c8463a',c=>c.rect(150,50,30,36));F(x,'#ffe3d4',c=>c.ellipse(70,150,26,16,-.4,0,7))}],
 ['Cette nuit, il y a eu de l’orage.',x=>{F(x,'#7aa6ea',c=>{c.moveTo(20,170);c.lineTo(20,110);c.quadraticCurveTo(110,94,210,110);c.lineTo(210,170);c.closePath()});F(x,'#f3c34e',c=>c.ellipse(60,104,22,16,0,0,7));x.beginPath();x.moveTo(50,104);x.lineTo(62,104);x.stroke();x.font='600 36px Caveat, cursive';x.fillStyle='#22306e';x.fillText('BOUM',120,50)}],
 ['Il va neiger demain.',x=>{F(x,'#8a6a4a',c=>c.rect(60,70,120,80));F(x,'#3e4247',c=>c.arc(100,110,24,0,7));for(let k=0;k<4;k++){x.beginPath();x.moveTo(140,90+k*14);x.lineTo(170,90+k*14);x.stroke()}x.beginPath();x.moveTo(170,70);x.lineTo(190,30);x.stroke();x.font='600 30px Caveat, cursive';x.fillStyle='#22306e';x.fillText('« neige… »',150,36)}],
 ['Le facteur est passé.',x=>{F(x,'#f6f4ee',c=>c.rect(0,120,230,60));F(x,'#3e4247',c=>c.rect(150,60,60,46));F(x,'#c8463a',c=>c.rect(200,48,8,30));F(x,'#6a4a30',c=>c.rect(176,106,8,50));x.fillStyle='#8a8f94';for(let k=0;k<6;k++){x.beginPath();x.ellipse(20+k*24,150-k*4,6,9,.3,0,7);x.fill()}}]];
const WEEKS=WEEK.map(([t,f])=>doodle(230,190,x=>f(x)));
// une page du carnet de Grand-père : son écriture serrée, ses abréviations ; on ne la lit pas
const GPPAGE=(()=>{const o=document.createElement('canvas');o.width=440;o.height=330;const x=o.getContext('2d');x.fillStyle='#efe6cf';x.fillRect(0,0,440,330);x.drawImage(PAPERG,0,0,440,330,0,0,440,330);
 x.strokeStyle='rgba(90,130,200,.25)';for(let y=40;y<330;y+=30){x.beginPath();x.moveTo(0,y);x.lineTo(440,y);x.stroke()}
 const R=seeded(1937);x.strokeStyle='#2a2a4a';x.lineWidth=2.2;x.lineCap='round';for(let y=36;y<320;y+=30){let px=20+R()*10;while(px<410){const w=20+R()*50;x.beginPath();x.moveTo(px,y);for(let u=0;u<w;u+=3){x.lineTo(px+u,y-4-Math.abs(Math.sin(u*.6+R()*3))*10*(R()<.3?1.6:1))}x.stroke();if(R()<.2){x.beginPath();x.moveTo(px+w+3,y-14);x.lineTo(px+w+7,y-2);x.stroke()}px+=w+12+R()*8}}
 x.fillStyle='rgba(255,226,120,.35)';x.fillRect(16,126,330,36);return lifted(bordered(o,5))})();
function mkEvid(){const M={state:'tari',place:[-1,-1,-1,-1],drag:null,tried:[],t0:performance.now(),done:false,
 hint:'Dans la salle des enregistrements, une voix de femme, très vieille, parle une langue d’Amazonie. Maman m’en avait parlé.',
 wantsTap:()=>['tari','mid','fin'].includes(M.state),
 card(i){return[34+(i%2)*360,138+(i/2|0)*262]},tag(j){return[34+j*180,684]},
 draw(c,T){c.drawImage(FOGBG,0,0);const now=performance.now();
  if(M.state==='tari'){header(c,'En tariana, « l’alien l’a mordu »','se dit de cinq façons. Selon comment on le sait :');
   TARI.forEach(([w,l],i)=>{const y=184+i*92;tagBox(c,40,y,688,78,8);txt(c,w,190,y+40,42,'#7a2a08');txt(c,l,500,y+42,36,'#22306e')});txt(c,'Un Français qui l’apprend passe pour un menteur.',384,664,36,'#3a2a20');tapLine(c,720);return}
  if(M.state==='play'||M.state==='mid'){header(c,'La semaine d’Alice, dans une langue qui oblige à dire',M.state==='play'?'comment on sait. Glisser chaque marque sur sa phrase.':'comment on sait. Chaque phrase a sa marque.');
   WEEK.forEach(([t],i)=>{const[x,y]=M.card(i);tagBox(c,x,y,340,244,10);c.drawImage(WEEKS[i],x+8,y+6,200,165);const ls=(()=>{c.font='600 38px Caveat, cursive';return jLines(c,t,316)})();ls.slice(0,2).forEach((l,k)=>txt(c,l,x+170,y+190+k*32,32,'#22306e'));
    const j=M.place.indexOf(i);if(j>=0){drawGlyph(c,EV[j][1],x+276,y+70,42);txt(c,EV[j][0],x+276,y+140,30,'#7a2a08')}});
   [0,1,2,3].forEach(j=>{if(M.place[j]>=0)return;let[x,y]=M.tag(j);if(M.drag&&M.drag.j===j){x=M.drag.x-80;y=M.drag.y-40}tagBox(c,x,y-40,164,100,10);drawGlyph(c,EV[j][1],x+82,y-6,24);txt(c,EV[j][0],x+82,y+40,30,'#7a2a08')});
   if(M.state==='mid')tapLine(c,736,'toucher : le carnet de Grand-père');
   else if(M.place.every(p=>p<0)&&!M.drag){const k=(tutT()*.6)%1,[tx,ty]=M.tag(0),[cx2,cy2]=M.card(0);drawHand(c,tx+80+(cx2+250-tx-80)*clamp(k*1.4),ty+(cy2+80-ty)*clamp(k*1.4),k<.8)}return}
  if(M.state==='carnet'||M.state==='fin'){c.save();c.translate(384,250);c.rotate(-.02);c.drawImage(GPPAGE,-GPPAGE.width/2,-GPPAGE.height/2);c.restore();
   if(M.state==='carnet'){txt(c,'Comment le savait-il ?',384,452,42,'#22306e');[['traducteur automatique',0],['chercher seule',1],['demander à quelqu’un',2]].forEach(([l,i])=>btn(c,30+i*244,500,224,84,l,M.tried.includes(i),i===0?26:32));
    const last=M.tried[M.tried.length-1];if(last!=null){tagBox(c,40,604,688,120,10);
     if(last===0){txt(c,'« Le jardin bleu court sous la montre. »',384,642,36,'#3a3a3a');txt(c,'traduction sûre à 97 %',384,690,30,'#9a3a1a','center','600',true)}
     if(last===1){txt(c,'Un M. Une date, peut-être. Pas le sens.',384,646,36,'#3a2a20');txt(c,'Ses abréviations sont à lui.',384,692,32,'#5a4a3a','center','600',true)}
     if(last===2){txt(c,'Il faudrait le lui demander.',384,646,38,'#22306e');txt(c,'À lui.',384,692,36,'#22306e')}}}
   else{tagBox(c,40,450,688,280,12);txt(c,'Un écrit garde des mots,',384,500,40,'#22306e');txt(c,'pas la façon dont on les savait.',384,546,40,'#22306e');txt(c,'Quand une langue s’éteint, s’en va aussi',384,612,36,'#3a2a20');txt(c,'l’habitude de dire comment on sait.',384,654,36,'#3a2a20');tapLine(c,712)}}},
 down(cx,cy){const now=performance.now();
  if(M.state==='tari'){M.state='play';showHint('« À toi : raconte ta semaine. Mais dans cette langue-là, chaque phrase doit dire comment tu le sais. »');return}
  if(M.state==='mid'){M.state='carnet';showHint('Puis j’ai ouvert le carnet de Grand-père. Une ligne, surtout. Comment le savait-il ?');return}
  if(M.state==='fin'){M.done=true;return}
  if(M.state==='carnet'){[0,1,2].forEach(i=>{if(inR(cx,cy,[30+i*244,500,224,84])){if(!M.tried.includes(i))M.tried.push(i);else{M.tried=M.tried.filter(t=>t!==i);M.tried.push(i)}sndPaper(.3,.2);
     showHint(i===0?'La machine répond tout de suite, et sûre d’elle. Mais ce sont ses mots à lui, ses abréviations.':i===1?'Je reconnais des lettres. Pas ce qu’il voulait dire.':'Maman dit qu’une langue ne s’apprend qu’en face de quelqu’un.');
     if(M.tried.length===3&&i===2||M.tried.length===3)setTimeout(()=>{if(M.state==='carnet'){M.state='fin';sndTone(523,1.4,.07)}},2600)}});return}
  if(M.state==='play')[0,1,2,3].forEach(j=>{if(M.place[j]>=0||M.drag)return;const[x,y]=M.tag(j);if(inR(cx,cy,[x,y-40,164,100])){M.drag={j,x:cx,y:cy};sndPaper(.25,.2)}})},
 move(cx,cy){if(M.drag){M.drag.x=cx;M.drag.y=cy}},
 up(){if(!M.drag)return;const{j,x,y}=M.drag;M.drag=null;const i=[0,1,2,3].find(i=>{const[sx,sy]=M.card(i);return x>sx&&x<sx+340&&y>sy&&y<sy+244});if(i==null)return;
  if(i===j&&!M.place.includes(i)){M.place[j]=i;sndTone(523+j*60,.6,.07);if(M.place.every(p=>p>=0))setTimeout(()=>{M.state='mid';showHint('« Tu as dû te demander, pour chaque phrase : je l’ai vu ? entendu ? on me l’a dit ? En français, rien ne t’y oblige. »')},700)}
  else{sndTone(330,.4,.06);showHint('« Comment le sais-tu, au juste ? Tu l’as vu, tu l’as entendu, on te l’a dit… ou tu l’as deviné à des traces ? »')}},
 solve(){M.done=true}};return M}
const mkIA=mkEvid;
// ---- le script du cinquième lieu
SCRIPTS.ai=[{say:'lieu',t:'L’université, aujourd’hui. Au sous-sol, des voix enregistrées : des langues que plus personne ne parle.'},
 {say:'lieu',t:'Sur 7 000 langues, 500 sont parlées par moins de 100 personnes. On estime qu’une langue disparaîtra toutes les deux semaines jusqu’en 2100.'},{cam:'lid'},{manip:mkEvid},
 {say:'lieu',t:'Une linguiste, Ana Fernández Garay, a réuni les derniers à parler le tehuelche, en Patagonie. Ensemble, ils retrouvaient leurs mots. Mais la prononciation exacte était déjà perdue.'},
 {say:'lieu',t:'Une façon de penser disparaît-elle avec sa langue ? Pas nos perceptions, dit Landragin : elles restent proches. Mais une façon de dire, et l’attention qui va avec.'},
 {mem:'ia'},{say:'alice',t:'Une carte de Maman est arrivée ce matin. Un seul mot dessus. Un mot que je ne connais pas.'},{say:'alice',t:'Et dans le carton de ses affaires, un carnet de Grand-père. Je n’arrive pas à le lire.'},
 {say:'alice',t:'Grand-père commençait toujours par dire comment il savait. « Ça, je l’ai vu. » « Ça, on me l’a raconté. »'},
 {note:'Une langue vit dans ceux qui la parlent. Demander, tant qu’il y a quelqu’un pour répondre.'},{say:'alice',t:'Au dos de la carte, tout petit, Maman avait écrit : « Je t’apprendrai ce mot en rentrant. Il ne s’apprend pas sur une carte. »'},{memoff:1},{cam:'box'},
 {say:'alice',t:'Je ne sais pas lire son carnet. Il faudrait quelqu’un en face.'},
 {fn:()=>{hideSay();FIFTH='done';REPLAY.last=4;markDone();setTimeout(()=>showHint('Les souvenirs restent dans la boîte. Revenir '+dayFr(3)+', et toucher « Rappel » : c’est le meilleur moment pour tout rallumer de mémoire.'),500)}}];
{const S=SCRIPTS.ai,a=S.findIndex(s=>s.mem),b=S.findIndex(s=>s.memoff);SCRIPTS.m4=[{cam:'lid'},...S.slice(a,b+1),{cam:'box'}]}
