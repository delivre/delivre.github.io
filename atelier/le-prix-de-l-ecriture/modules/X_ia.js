/* ---------- le cinquième lieu : la nouvelle bibliothèque d'Alexandrie (2002), et la question de l'IA ---------- */
// le bâtiment : un grand disque de verre incliné vers la mer, un mur de granit gravé de signes, le petit planétarium
const BAG=new THREE.Group();
{const glass=canvasTex(512,512,(x,W)=>{x.fillStyle='#9fb8c8';x.fillRect(0,0,W,W);x.strokeStyle='rgba(40,60,80,.55)';x.lineWidth=3;for(let i=0;i<W;i+=26){x.beginPath();x.moveTo(i,0);x.lineTo(i,W);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(W,i);x.stroke()}
   for(let i=0;i<220;i++){x.fillStyle=`rgba(255,255,255,${rnd(.05,.25)})`;x.fillRect(((Math.random()*20)|0)*26+3,((Math.random()*20)|0)*26+3,20,20)}});
 const granite=canvasTex(1024,128,(x,W,H)=>{x.fillStyle='#8f8a86';x.fillRect(0,0,W,128);for(let i=0;i<900;i++){x.fillStyle=`rgba(${rnd(60,200)|0},${rnd(60,190)|0},${rnd(60,190)|0},.25)`;x.fillRect(rnd(0,W),rnd(0,128),2,2)}
   x.strokeStyle='rgba(40,34,40,.75)';x.lineWidth=2.4;x.lineCap='round';for(let gx2=10;gx2<W-10;gx2+=24)for(let gy2=12;gy2<120;gy2+=34){x.beginPath();const k=(Math.random()*5)|0,cx=gx2+8,cy=gy2+10;
     if(k===0){x.arc(cx,cy,7,0,Math.PI*1.5)}else if(k===1){x.moveTo(cx-6,cy+8);x.lineTo(cx,cy-8);x.lineTo(cx+6,cy+8);x.moveTo(cx-3,cy+2);x.lineTo(cx+3,cy+2)}else if(k===2){x.moveTo(cx-6,cy-6);x.lineTo(cx+6,cy-6);x.moveTo(cx,cy-6);x.lineTo(cx,cy+8)}else if(k===3){x.moveTo(cx-6,cy);x.quadraticCurveTo(cx,cy-12,cx+6,cy);x.moveTo(cx,cy);x.lineTo(cx,cy+8)}else{x.moveTo(cx-6,cy+6);x.lineTo(cx+6,cy-6);x.moveTo(cx-6,cy-6);x.lineTo(cx-1,cy-1)}x.stroke()}});
 granite.wrapS=THREE.RepeatWrapping;
 const disc=mesh(new THREE.CylinderGeometry(.66,.66,.07,56),[plastic('#c9d2d8',{roughness:.4}),painted('#9fb8c8',glass,{roughness:.15,clearcoat:1}),plastic('#c9d2d8')]);disc.rotation.x=-.34;disc.position.y=.34;BAG.add(disc);
 const drum=mesh(new THREE.CylinderGeometry(.6,.62,.36,56),plastic('#b8c2c8',{roughness:.5}));drum.position.y=.18;BAG.add(drum);
 const wall=mesh(new THREE.CylinderGeometry(.74,.74,.3,64,1,true,-Math.PI*.42,Math.PI*.84),painted('#8f8a86',granite,{roughness:.8,side:THREE.DoubleSide}));wall.position.y=.15;BAG.add(wall);
 const pl=mesh(new THREE.SphereGeometry(.15,24,16),plastic('#c4c8cf',{roughness:.45,clearcoat:.6}));pl.position.set(.84,.12,-.28);BAG.add(pl);
 BAG.position.set(BAPOS[0],TOP,BAPOS[1]);BAG.rotation.y=.25;BAG.visible=false;BAG.scale.set(1,.01,1);deco.add(BAG)}
let FIFTH=RECALL?'done':'locked',FIFTH_T=0;
if(RECALL){BAG.visible=true;BAG.scale.set(1,1,1);ghostPlace(BAG,true)}
function unlock5(){FIFTH='open';FIFTH_T=performance.now();BAG.visible=true;sndTone(392,2.4,.08);sndTone(587,2.6,.07,.3);sndTone(784,2.8,.06,.6)}
function fifthTick(now){if(FIFTH_T){const e=Math.min(1,(now-FIFTH_T)/2200),k=1-Math.pow(1-e,3);BAG.scale.set(1,Math.max(.01,k*(1+.08*Math.sin(e*Math.PI))),1);if(e>=1)FIFTH_T=0}
  if(FIFTH==='open'&&phase==='play'&&!busy&&fig.position.distanceTo(SPOT5)<.5){FIFTH='busy';figState.path=[];figState.tx=fig.position.x;figState.tz=fig.position.z;figState.moving=false;fig.userData.face=Math.atan2(BAPOS[0]-fig.position.x,BAPOS[1]-fig.position.z);hideSay();run('ai')}
  if(AUTO&&FIFTH==='open'&&!busy&&!figState.moving)goTo(SPOT5.x,SPOT5.z)}
// au couvercle : une étoile qui bouge, un satellite ; le savoir tourne au-dessus de nos têtes
function drawSat(c,T){if(FIFTH==='locked')return;const k=(T*.025)%1,x=60+k*650,y=150+Math.sin(k*Math.PI)*-60+k*90,b=.6+.4*Math.abs(Math.sin(T*3));c.save();c.globalCompositeOperation='lighter';blob(c,x,y,22,`rgba(170,220,255,${.5*b})`);c.fillStyle=`rgba(230,245,255,${b})`;c.beginPath();c.arc(x,y,3.5,0,7);c.fill();
  c.strokeStyle='rgba(170,220,255,.18)';c.setLineDash([2,8]);c.lineWidth=2;c.beginPath();for(let u=0;u<=k;u+=.02){const xx=60+u*650,yy=150+Math.sin(u*Math.PI)*-60+u*90;u?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke();c.restore()}

// ---- l'activité : six choses à savoir sur la nouvelle bibliothèque. Une fois sur deux, la machine répond (et tout est « enregistré ») ;
// l'autre fois, papa ne donne qu'un indice et il faut chercher. Puis on range des livres (on pense à autre chose), et papa repose les six questions.
const IAF=[{q:'En quelle année l’a-t-on inaugurée ?',a:'2002',o:['1997','2002','2008'],ai:'Elle a été inaugurée en 2002.',clue:'Une année qui se lit pareil dans les deux sens.'},
 {q:'Combien d’écritures sont gravées sur son mur ?',a:'120',o:['40','120','300'],ai:'Son mur de granit porte des signes de 120 écritures.',clue:'Dix fois douze.'},
 {q:'Combien de livres peut-elle contenir ?',a:'8 millions',o:['2 millions','8 millions','20 millions'],ai:'Ses rayonnages peuvent accueillir 8 millions de livres.',clue:'Le chiffre qui, couché, devient l’infini : ∞.'},
 {q:'Qui l’a dessinée ?',a:'Des Norvégiens',o:['Des Italiens','Des Norvégiens','Des Japonais'],ai:'Elle a été dessinée par Snøhetta, une agence norvégienne.',clue:'Un pays de fjords, tout au nord.'},
 {q:'Quelle forme a son grand toit ?',a:'Un disque penché',o:['Une pyramide','Un dôme','Un disque penché'],ai:'Son toit est un immense disque de verre penché vers la mer.',clue:'Comme un soleil qui se lève sur la mer.'},
 {q:'Combien de niveaux a sa salle de lecture ?',a:'11',o:['3','11','25'],ai:'Sa salle de lecture descend en 11 niveaux.',clue:'Un de plus que tes doigts.'}];
const SANS='system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
function mkIA(){const ids=[0,1,2,3,4,5].sort(()=>Math.random()-.5),mode={};ids.forEach((k,j)=>mode[k]=j%2?'cherche':'machine');
 const test=[...ids].sort(()=>Math.random()-.5);
 const M={noGrain:true,st:'intro',i:0,sub:'ask',done:false,score:{machine:0,cherche:0},books:[],hint:'Ce soir-là, papa me parlait de la nouvelle bibliothèque d’Alexandrie. Il avait inventé un jeu.'};
 const opts=k=>IAF[k].o.map((t,j)=>({t,ok:t===IAF[k].a,x:404,y:500+j*76,w:440,h:64}));let O=null;
 const btn={x:384,y:560,w:460,h:84},cont={x:384,y:660,w:360,h:66};
 const tablet=(c,f)=>{c.save();dropShadow(c,384,690,320,18);c.fillStyle='#24242e';c.strokeStyle='#2a1a22';c.lineWidth=4;c.beginPath();rrect(c,40,40,688,690,34);c.fill();c.stroke();c.fillStyle='#f4f6fb';c.beginPath();rrect(c,66,66,636,638,20);c.fill();c.restore();f()};
 const sans=(c,t,x,y,s,col,w='600',mw=560)=>{c.font=`${w} ${s}px ${SANS}`;c.fillStyle=col;c.textAlign='center';const ls=jLines(c,t,mw);ls.forEach((l,k)=>c.fillText(l,x,y+k*s*1.25));return ls.length};
 const button=(c,o,label,col)=>{c.save();c.fillStyle=col;c.strokeStyle='#2a1a22';c.lineWidth=3;c.beginPath();rrect(c,o.x-o.w/2,o.y-o.h/2,o.w,o.h,16);c.fill();c.stroke();c.restore();sans(c,label,o.x,o.y+11,30,'#1a2140','700')};
 const pill=(c,t,bg,fg)=>{c.save();c.fillStyle=bg;c.beginPath();rrect(c,96,96,576,64,14);c.fill();c.restore();sans(c,t,384,136,25,fg,'700',600)};
 // --- l'écran de la machine : une conversation (générique, sans marque)
 const HAND='600 {s}px Caveat, "Patrick Hand", cursive';
 const hand=(c,t,x,y,s,col,mw=540,al='center')=>{t=nb(t);c.font=HAND.replace('{s}',s);c.fillStyle=col;c.textAlign=al;c.textBaseline='alphabetic';const ls=jLines(c,t,mw);ls.forEach((l,k)=>c.fillText(l,x,y+k*s*1.1));return ls.length};
 const spark=(c,x,y,r,col)=>{c.save();c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*.38:r;c.lineTo(x+Math.cos(a-Math.PI/2)*rr,y+Math.sin(a-Math.PI/2)*rr)}c.closePath();c.fill();c.restore()};
 const SEND={x:384,y:640,w:600,h:96},NEXT={x:384,y:548,w:380,h:70};
 const streamN=k=>{const w=IAF[k].ai.split(' ');if(!M.t0)return w.length;const e=performance.now()-M.t0-650;return e<0?0:Math.min(w.length,1+Math.floor(e/85))};
 const chat=(c,k,T)=>{
  c.save();c.fillStyle='#ffffff';c.beginPath();rrect(c,66,66,636,638,20);c.fill();
  c.fillStyle='#f3f4f8';c.beginPath();rrect(c,66,66,636,88,20);c.fill();c.fillRect(66,120,636,34);c.fillStyle='#e2e4ec';c.fillRect(66,153,636,2);
  c.fillStyle='#1d1f2b';c.beginPath();c.arc(116,110,24,0,7);c.fill();spark(c,116,110,15,'#ffffff');
  c.font=`700 34px ${SANS}`;c.fillStyle='#1d1f2b';c.textAlign='left';c.textBaseline='middle';c.fillText('La machine',152,110);
  c.font=`600 28px ${SANS}`;c.fillStyle='#8a8fa3';c.textAlign='right';c.fillText(`${M.i+1} / 6`,676,110);c.restore();
  const sent=M.sub!=='ask';
  // la barre de saisie, en bas
  c.save();c.fillStyle='#f3f4f8';c.strokeStyle='#d4d7e2';c.lineWidth=2;c.beginPath();rrect(c,96,600,576,84,42);c.fill();c.stroke();
  c.font=`500 31px ${SANS}`;c.textAlign='left';c.textBaseline='middle';
  if(!sent){c.fillStyle='#1d1f2b';const ls=jLines(c,nb(IAF[k].q),450);ls.slice(0,2).forEach((l,j)=>c.fillText(l,126,642+(j-(ls.length>1?.5:0))*36));}
  else{c.fillStyle='#a3a8ba';c.fillText('Poser une question…',126,642)}
  c.fillStyle=sent?'#c9ccd8':'#1d1f2b';c.beginPath();c.arc(628,642,30,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=5;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(628,656);c.lineTo(628,628);c.moveTo(616,640);c.lineTo(628,628);c.lineTo(640,640);c.stroke();c.restore();
  if(!sent){c.save();c.font=`600 30px ${SANS}`;c.fillStyle='#8a8fa3';c.textAlign='center';c.textBaseline='middle';c.fillText('Tout ce qu’elle répond',384,350);c.fillText('est enregistré.',384,392);c.restore();
   if(M.i===0||M.hand){const kk=(tutT()*.7)%1;drawHand(c,640,660,kk<.5)}return}
  // la question, dans une bulle à droite
  c.save();c.font=`500 36px ${SANS}`;const ql=jLines(c,nb(IAF[k].q),430),qw=Math.max(...ql.map(l=>c.measureText(l).width))+48,qh=ql.length*44+30;
  c.fillStyle='#e4e9ff';c.beginPath();rrect(c,672-qw,180,qw,qh,26);c.fill();c.fillStyle='#1d1f2b';c.textAlign='left';c.textBaseline='middle';ql.forEach((l,j)=>c.fillText(l,672-qw+24,180+37+j*44));
  // la réponse, à gauche, qui s'écrit toute seule
  const y0=180+qh+40;c.fillStyle='#1d1f2b';c.beginPath();c.arc(116,y0+18,20,0,7);c.fill();spark(c,116,y0+18,12,'#ffffff');
  const n=streamN(k);
  if(n===0){for(let i=0;i<3;i++){c.fillStyle=`rgba(29,31,43,${.25+.6*Math.max(0,Math.sin(T*7-i*.9))})`;c.beginPath();c.arc(162+i*24,y0+18,7,0,7);c.fill()}}
  else{c.font=`500 38px ${SANS}`;const all=jLines(c,IAF[k].ai,500);let left=n;c.fillStyle='#1d1f2b';all.forEach((l,j)=>{const ws=l.split(' '),sh=ws.slice(0,Math.max(0,left)).join(' ');left-=ws.length;if(sh)c.fillText(sh,152,y0+18+j*48)})}
  c.restore();
  if(n>=IAF[k].ai.split(' ').length)button(c,NEXT,'Question suivante','#ffd27a')};
 // --- le carnet de papa : du papier, écrit à la main
 const paper=(c,head,f)=>{c.save();dropShadow(c,384,700,300,16);c.translate(384,384);c.rotate(-.012);c.translate(-384,-384);
  c.fillStyle='#fbf6e6';c.strokeStyle='#d8ccb0';c.lineWidth=2;c.beginPath();rrect(c,64,56,640,650,10);c.fill();c.stroke();
  c.strokeStyle='rgba(90,130,200,.28)';c.lineWidth=2;for(let y=196;y<700;y+=56){c.beginPath();c.moveTo(70,y);c.lineTo(698,y);c.stroke()}
  c.strokeStyle='rgba(210,70,70,.45)';c.beginPath();c.moveTo(120,60);c.lineTo(120,702);c.stroke();
  const hd=head.split('|');hand(c,hd[0],404,122,46,'#7a4a10',560);if(hd[1])hand(c,hd[1],404,170,36,'#9a7a50',560);c.restore();f()};
 const pencilBox=(c,o,label,fill)=>{c.save();if(fill){c.fillStyle=fill;c.beginPath();rrect(c,o.x-o.w/2,o.y-o.h/2,o.w,o.h,18);c.fill()}
  c.strokeStyle='rgba(60,50,40,.75)';c.lineWidth=2.4;for(let p=0;p<2;p++){c.beginPath();rrect(c,o.x-o.w/2+p*2,o.y-o.h/2-p,o.w-p*3,o.h+p*2,18);c.stroke()}
  c.restore();hand(c,label,o.x,o.y+15,46,'#1e2a6a',o.w)};
 M.draw=(c,T)=>{const g=c.createLinearGradient(0,0,0,MS);g.addColorStop(0,'#1c2350');g.addColorStop(1,'#3a2f5c');c.fillStyle=g;c.fillRect(0,0,MS,MS);
  if(M.st==='shelf'){c.fillStyle='#5a3418';c.fillRect(120,170,528,16);c.fillRect(120,330,528,16);
   M.books.forEach((b,j)=>{const x=b.on?140+b.slot*44:b.x,y=b.on?170-b.h:b.y;c.save();c.fillStyle=b.col;c.strokeStyle='#2a1a22';c.lineWidth=3;c.beginPath();rrect(c,x,y,38,b.h,4);c.fill();c.stroke();c.restore()});
   txt(c,'Papa éteint l’écran : « Aide-moi à ranger. »',384,450,32);txt(c,`${M.books.filter(b=>b.on).length} / 6`,384,500,30,'#ffd27a');
   if(!M.books.some(b=>b.on)){const b=M.books[0],k=(tutT()*.7)%1;drawHand(c,b.x+30,b.y+40,k<.5)}c.textAlign='start';return}
  if(M.st==='learn'&&mode[ids[M.i]]==='cherche'){const k=ids[M.i];
   paper(c,'Papa : « Cherche. »|Rien n’est enregistré.',()=>{hand(c,`${M.i+1} / 6`,676,92,30,'#9a8a70',200,'right');
    const nq=hand(c,IAF[k].q,404,250,46,'#1e2a6a',540);hand(c,'Indice : '+IAF[k].clue,404,250+nq*51+40,38,'#8a4a14',540);
    O.forEach(o=>pencilBox(c,o,o.t,M.sub==='ask'?null:o.ok?'rgba(120,200,110,.45)':o.picked?'rgba(230,110,100,.4)':null))});c.textAlign='start';return}
  if(M.st==='test'){const k=test[M.i];
   paper(c,'Papa : « Et maintenant…|sans regarder. »',()=>{hand(c,`${M.i+1} / 6`,676,92,30,'#9a8a70',200,'right');hand(c,IAF[k].q,404,270,46,'#1e2a6a',540);
    O.forEach(o=>pencilBox(c,o,o.t,o.st==='ok'?'rgba(120,200,110,.45)':o.st==='no'?'rgba(230,110,100,.4)':null))});c.textAlign='start';return}
  tablet(c,()=>{
   if(M.st==='intro'){sans(c,'La nouvelle bibliothèque d’Alexandrie',384,150,36,'#1a2140','800');sans(c,'Ouverte en 2002, tout près de l’ancienne.',384,240,30,'#3a3f55');
    sans(c,'Six questions. Pour trois d’entre elles, la machine répond. Pour les trois autres, papa ne donne qu’un indice.',384,330,30,'#3a3f55','600',540);button(c,cont,'Commencer','#ffd27a')}
   else if(M.st==='learn')chat(c,ids[M.i],T);
   else if(M.st==='end'){sans(c,'Ce qui est resté',384,140,38,'#1a2140','800');
    [['machine','Ce que la machine m’a donné'],['cherche','Ce que j’ai cherché moi-même']].forEach(([k,l],j)=>{const y=210+j*170;c.save();c.fillStyle=k==='machine'?'#e3e9ff':'#fff3d0';c.beginPath();rrect(c,96,y,576,140,18);c.fill();c.restore();sans(c,l,384,y+50,30,'#1a2140','600');sans(c,`${M.score[k]} sur 3`,384,y+112,52,k==='machine'?'#2a3a8a':'#7a4a10','800')});
    button(c,{...cont,y:640},'Continuer','#ffd27a')}});
  c.textAlign='start';c.textBaseline='alphabetic'};
 const hit=(arr,cx,cy)=>arr.find(o=>Math.abs(cx-o.x)<o.w/2&&Math.abs(cy-o.y)<o.h/2+8);
 const startShelf=()=>{M.st='shelf';M.books=[0,1,2,3,4,5].map(j=>({x:120+j*90,y:560,h:110+(j%3)*14,col:['#c8463a','#4a86e0','#4fae5a','#e0a030','#8a5aa8','#2a8a8a'][j],on:false}));showHint('Papa éteignait l’écran. « Aide-moi à ranger les livres. »')};
 M.down=(cx,cy)=>{if(M.lock)return;
  if(M.st==='intro'){if(hit([cont],cx,cy)){M.st='learn';M.i=0;M.sub='ask';O=opts(ids[0]);sndPaper(.2,.15)}return}
  if(M.st==='learn'){const k=ids[M.i],md=mode[k];
   if(md==='machine'){if(M.sub==='ask'){if(hit([SEND],cx,cy)){M.sub='shown';M.t0=performance.now();M.hand=0;sndTone(880,.25,.05)}else M.hand=1;return}
    if(streamN(k)<IAF[k].ai.split(' ').length){M.t0=1;return}}
   else{if(M.sub==='ask'){const o=hit(O,cx,cy);if(!o)return;o.picked=1;M.sub=o.ok?'right':'wrong';sndTone(o.ok?659:392,.8,.1);showHint(o.ok?'« Tu l’as trouvé. »':'« Pas grave : tu as cherché, c’est ça qui compte. »');M.lock=1;setTimeout(()=>{M.lock=0;nextL()},1500);return}return}
   nextL();return}
  if(M.st==='shelf'){const b=M.books.find(b=>!b.on&&cx>b.x-10&&cx<b.x+48&&cy>b.y-10&&cy<b.y+b.h+10);if(!b)return;b.slot=M.books.filter(o=>o.on).length;b.on=true;sndPaper(.25,.2);
   if(M.books.every(o=>o.on)){M.lock=1;setTimeout(()=>{M.lock=0;M.st='test';M.i=0;O=opts(test[0]);showHint('Puis papa reprenait son carnet. « Les six questions. Sans regarder. »')},900)}return}
  if(M.st==='test'){const o=hit(O,cx,cy);if(!o)return;const k=test[M.i];o.st=o.ok?'ok':'no';if(!o.ok)O.forEach(p=>{if(p.ok)p.st='ok'});if(o.ok)M.score[mode[k]]++;sndPaper(.25,.2);M.lock=1;
   setTimeout(()=>{M.lock=0;M.i++;if(M.i<6)O=opts(test[M.i]);else{M.st='end';showHint(M.score.cherche>M.score.machine?'« Tu vois ? Ce que tu as cherché toi-même est resté. »':M.score.cherche===M.score.machine?'« Égalité, ce soir. Mais on refera le test dans une semaine… »':'« Ce soir, la machine gagne. Mais on refera le test dans une semaine… »')}},1000);return}
  if(M.st==='end'&&hit([{...cont,y:640}],cx,cy))M.done=true};
 function nextL(){M.i++;if(M.i<6){M.sub='ask';O=opts(ids[M.i])}else startShelf()}
 M.surf=()=>M.st==='shelf'||M.st==='test'||(M.st==='learn'&&mode[ids[M.i]]==='cherche')?'paper':'screen';
 M.move=()=>{};M.up=()=>{};M.solve=()=>{M.score={machine:1,cherche:3};M.done=true};return M}

// ---- l'écho d'Alice : la cuisine, la tablette, la main de papa sur l'écran
{const wallp=cut(x=>stripes(x,70,40,628,640,'#2e3566','#283060',22),{crayon:.35,border:0,outline:0});
 const win=cut(x=>{fp(x,'#5a3a2a',c=>rrect(c,430,90,190,200,10));fp(x,'#141a48',c=>c.rect(444,104,162,172));fp(x,'#fff1c0',c=>c.arc(560,150,20,0,7));fp(x,'#141a48',c=>c.arc(552,144,18,0,7));for(let i=0;i<12;i++)fp(x,'#fff6d8',c=>c.arc(rnd(452,600),rnd(112,270),rnd(1.2,2.4),0,7));fp(x,'#5a3a2a',c=>c.rect(522,104,6,172));fp(x,'#5a3a2a',c=>c.rect(444,186,162,6))});
 const table=cut(x=>{fp(x,'#8a5a34',c=>{c.moveTo(330,560);c.lineTo(660,560);c.lineTo(660,586);c.lineTo(636,586);c.lineTo(632,690);c.lineTo(612,690);c.lineTo(608,586);c.lineTo(382,586);c.lineTo(378,690);c.lineTo(358,690);c.lineTo(354,586);c.lineTo(330,586);c.closePath()});
   x.save();x.translate(430,550);x.rotate(-.04);fp(x,'#2a2a36',c=>rrect(c,-44,-12,88,16,5));fp(x,'#7fb0ff',c=>rrect(c,-38,-9,76,9,3));x.restore();
   fp(x,'#f2e2b0',c=>{c.moveTo(560,552);c.lineTo(636,546);c.lineTo(640,556);c.lineTo(564,562);c.closePath()})});
 let pp;const dad=cut(x=>{pp=parent(x,{kind:'man',x:250,y:700,h:395,view:'front',hat:'#000',armL:[-8,6],armR:[62,8]});if(pp.hr)fp(x,'#14102a',c=>c.ellipse(pp.hr[0],pp.hr[1],10,7,.2,0,7))});
 const ppl=cut(x=>{chibi(x,{x:520,y:700,h:150,view:'front',armL:[-150,30],armR:[-20,0]});
   fp(x,'#fffaf0',c=>c.ellipse(600,420,46,32,0,0,7));fp(x,'#fffaf0',c=>c.arc(570,462,8,0,7));fp(x,'#fffaf0',c=>c.arc(556,478,5,0,7));x.font='700 40px Caveat, cursive';x.fillStyle='#22306e';x.textAlign='center';x.fillText('?',600,434)});
 POP.ia={P:[{...wallp,depth:0},{...win,depth:.6},{...table,depth:1.9},{...dad,depth:2.4},{...ppl,depth:3}],
  fx:(c,T)=>{c.save();c.globalCompositeOperation='lighter';blob(c,430,540,90+6*Math.sin(T*3),'rgba(120,170,255,.45)');for(let i=0;i<8;i++){const k=(T*.12+i*.125)%1;c.fillStyle=`rgba(255,230,160,${.7*Math.sin(k*Math.PI)})`;c.beginPath();c.arc(600+Math.sin(i*5+T)*40,380-k*120,2.6,0,7);c.fill()}c.restore()}}}

// ---- le script du cinquième lieu
SCRIPTS.ai=[{say:'lieu',t:'Alexandrie, aujourd’hui. Une nouvelle bibliothèque est sortie de terre, tout près de l’ancienne.'},{cam:'lid'},{manip:mkIA},
 {say:'papa',t:'Ce qu’on cherche soi-même, même avec un simple indice, la mémoire le garde mieux. Les chercheurs l’appellent l’effet de génération.'},
 {say:'lieu',t:'Après Thamus, on a parlé d’« effet Google » : on retiendrait moins ce qu’on sait trouvable en ligne. Pas encore tout à fait prouvé.'},
 {say:'lieu',t:'Avec l’IA, la réponse arrive avant même qu’on cherche.'},
 {mem:'ia'},{say:'alice',t:'Papa ne disait pas « n’utilise pas la machine ». Il posait sa main sur l’écran.'},{say:'papa',t:'D’abord, cherche avec ce que tu sais déjà, même un morceau de réponse.'},{say:'papa',t:'Ensuite, demande, et creuse. Soit ça confirme ce que tu pensais, soit ça t’apprend plus. Et ce qui est nouveau s’accroche à ce que tu avais trouvé.'},
 {note:'Chercher d’abord en soi. Ce qu’on apprend ensuite s’y accroche.'},{memoff:1},{cam:'box'},
  {say:'alice',t:'Depuis, je range tout comme ça. Ma chambre, ma rue, le chemin du collège : chaque coin garde quelque chose.'},
  {say:'alice',t:'Plus tard, c’était pour moi. Ses notes sont là, dans le livre, en haut à gauche : l’écrit garde pour ceux qui viennent après. Le chemin, lui, reste dans ma tête.'},
 {fn:()=>{hideSay();FIFTH='done';REPLAY.last=4;markDone();setTimeout(()=>showHint('Les souvenirs restent dans la boîte. Revenir '+dayFr(3)+', et toucher « Rappel » : c’est le meilleur moment pour tout rallumer de mémoire.'),500)}}];
{const S=SCRIPTS.ai,a=S.findIndex(s=>s.mem),b=S.findIndex(s=>s.memoff);SCRIPTS.m4=[{cam:'lid'},...S.slice(a,b+1),{cam:'box'}]}
// à la première personne : le jeu de Papa se joue au bureau, devant le terminal
if(FPM&&FP_PLACES[4]){const a=SCRIPTS.ai,i=a.findIndex(s=>s.manip);a.splice(a[i-1]&&a[i-1].cam==='lid'?i-1:i,a[i-1]&&a[i-1].cam==='lid'?2:1,{fp:4})}
