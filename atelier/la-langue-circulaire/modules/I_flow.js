/* ---------- l'écran du couvercle : constellation de la Lyre + souvenirs + manipulations ---------- */
const memF=document.createElement('canvas');memF.width=memF.height=Math.round(MS*HD);const mf=memF.getContext('2d');
// les étoiles sont à l'endroit exact des lieux sur la carte : la constellation, c'est le chemin parcouru
let RECAP=-1;const MAPK=52,toStar=(x,z)=>[MS/2+x*MAPK,MS/2+z*MAPK];const STARS=SPOTS.map(s=>toStar(s.x,s.z));
const ROUTEPX=(()=>{const c=new THREE.CatmullRomCurve3(ROUTE.map(([a,b])=>new THREE.Vector3(a,0,b)));return[...Array(80)].map((_,i)=>{const p=c.getPoint(i/79);return toStar(p.x,p.z)})})();
// les objets-souvenirs, peints en petit, qui apparaissent en surimpression près de leur étoile
const goldG=(c,x0,x1)=>{const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#9a6a20');g.addColorStop(.5,'#ffe9a0');g.addColorStop(1,'#9a6a20');return g};
// les objets en surimpression : tracés de lumière dans la nuit, comme des fantômes
const ghost=(draw)=>sprite(110,110,c=>{c.translate(10,10);c.lineCap=c.lineJoin='round';
  for(const [w,col,bl] of [[9,'rgba(160,200,255,.18)',14],[5,'rgba(220,235,255,.45)',6],[2,'rgba(255,252,240,.95)',0]]){c.save();c.strokeStyle=col;c.lineWidth=w;c.shadowColor='rgba(170,210,255,.9)';c.shadowBlur=bl;draw(c);c.restore()}});
const ICONS=[ghost(c=>{c.beginPath();c.moveTo(6,22);c.lineTo(84,8);for(let k=0;k<5;k++){const x=12+k*17;c.moveTo(x,21-k*3);c.lineTo(x,80)}c.moveTo(4,80);c.lineTo(86,80);c.stroke()}),
 ghost(c=>{c.beginPath();c.rect(12,22,66,48);c.stroke();c.font='700 22px Georgia, serif';c.strokeText('ALICE',16,54)}),
 ghost(c=>{c.beginPath();c.arc(45,45,26,0,Math.PI*1.75);c.moveTo(66,30);c.lineTo(80,18);c.moveTo(30,70);c.lineTo(22,82);c.moveTo(20,40);c.lineTo(8,36);c.stroke();c.beginPath();c.arc(78,70,4,0,7);c.stroke()}),
 ghost(c=>{c.beginPath();[[26,40],[60,46]].forEach(([x,y])=>{c.moveTo(x-14,y);c.lineTo(x-11,y+26);c.lineTo(x+11,y+26);c.lineTo(x+14,y);c.closePath();c.moveTo(x+14,y+6);c.arc(x+18,y+12,6,-1.4,1.4)});c.moveTo(18,30);c.quadraticCurveTo(22,22,18,14);c.moveTo(54,36);c.quadraticCurveTo(58,28,54,20);c.stroke()})];
const SCR={kind:null,id:null,obj:null,a:0,ta:0};let lit=0,constel=0,vegaA=0,vegaT=0;
const LYRE_E=[[0,1],[1,2],[2,3],[3,0]],TRACE={on:false,done:false,edges:new Set(),cur:null,drag:null,miss:0,t0:0,flash:0};
const ek=(a,b)=>a<b?a+'-'+b:b+'-'+a,starAt=(x,y)=>{let best=-1,bd=80;STARS.forEach(([sx,sy],i)=>{const d=Math.hypot(x-sx,y-sy);if(d<bd){bd=d;best=i}});return best};
function traceLink(a,b){if(a<0||b<0||a===b)return false;const k=ek(a,b);if(!LYRE_E.some(([p,q])=>ek(p,q)===k)){TRACE.miss++;showHint(TRACE.miss>1?'« Suis le bord : d’une étoile à sa voisine, celle qui brille. »':'« Pas en travers, Alice. Suis le bord. »');return false}
  if(!TRACE.edges.has(k)){TRACE.edges.add(k);sndTone([392,494,587,698][TRACE.edges.size-1],1.4,.12);if(TRACE.edges.size===LYRE_E.length){TRACE.done=true;TRACE.doneT=performance.now();TRACE.cur=null;setTimeout(()=>{if(TRACE.on){TRACE.on=false;hideSay();step()}},900)}}TRACE.cur=b;return true}
function traceDown(x,y){const s=starAt(x,y);if(s<0)return;if(TRACE.cur!=null&&TRACE.cur!==s&&traceLink(TRACE.cur,s))return;TRACE.cur=s;TRACE.drag=[x,y]}
function traceMove(x,y){if(TRACE.cur!=null)TRACE.drag=[x,y];const s=starAt(x,y);if(TRACE.cur!=null&&s>=0&&s!==TRACE.cur){const k=ek(TRACE.cur,s);if(LYRE_E.some(([p,q])=>ek(p,q)===k)&&!TRACE.edges.has(k))traceLink(TRACE.cur,s)}}
function traceUp(){TRACE.drag=null}
function traceNext(){const c=TRACE.cur??0;const e=LYRE_E.find(([p,q])=>(p===c||q===c)&&!TRACE.edges.has(ek(p,q)))||LYRE_E.find(([p,q])=>!TRACE.edges.has(ek(p,q)));return e?(e[0]===c?e[1]:e[1]===c?e[0]:e[0]):-1}
const pencil=(a,b,w=3)=>{for(let k=0;k<2;k++){mx.strokeStyle=`rgba(60,58,70,${k?.35:.75})`;mx.lineWidth=k?w*.6:w;mx.beginPath();const n=8;for(let i=0;i<=n;i++){const t=i/n,x=a[0]+(b[0]-a[0])*t+(i%n?Math.sin(i*7.3+k)*1.6:0),y=a[1]+(b[1]-a[1])*t+(i%n?Math.cos(i*5.1+k)*1.6:0);i?mx.lineTo(x,y):mx.moveTo(x,y)}mx.stroke()}};
function drawSketch(T,al){mx.save();mx.globalAlpha=al;mx.translate(384,384);mx.rotate(-.012);mx.translate(-384,-384);
 mx.save();mx.shadowColor='rgba(0,0,0,.4)';mx.shadowBlur=14;mx.fillStyle='#f7f1e1';mx.fillRect(24,24,720,720);mx.restore();
 mx.strokeStyle='rgba(90,130,200,.18)';mx.lineWidth=1;for(let u=24;u<744;u+=24){mx.beginPath();mx.moveTo(u,24);mx.lineTo(u,744);mx.stroke();mx.beginPath();mx.moveTo(24,u);mx.lineTo(744,u);mx.stroke()}
 mx.strokeStyle='rgba(210,80,80,.4)';mx.lineWidth=1.6;mx.beginPath();mx.moveTo(84,24);mx.lineTo(84,744);mx.stroke();mx.drawImage(PAPERG,0,0);
 mx.font='600 46px Caveat, cursive';mx.fillStyle='rgba(60,58,70,.8)';mx.fillText('Ma constellation',100,84);
 mx.lineCap='round';mx.setLineDash([3,12]);mx.strokeStyle='rgba(60,58,70,.35)';mx.lineWidth=2.5;LYRE_E.forEach(([p,q])=>{mx.beginPath();mx.moveTo(...STARS[p]);mx.lineTo(...STARS[q]);mx.stroke()});mx.setLineDash([]);
 STARS.forEach(([sx,sy],i)=>{if(i>=lit)return;mx.strokeStyle='rgba(60,58,70,.8)';mx.lineWidth=2.4;mx.beginPath();for(let k=0;k<10;k++){const a=k/10*Math.PI*2-Math.PI/2,r=k%2?6:15;mx.lineTo(sx+Math.cos(a)*r,sy+Math.sin(a)*r)}mx.closePath();mx.stroke();
  const ic=ICONS[i];mx.save();mx.globalAlpha=al*.45;mx.filter='grayscale(1) brightness(.4)';mx.drawImage(ic,sx-ic.width*.4,sy+20,ic.width*.8,ic.height*.8);mx.restore()});
 LYRE_E.forEach(([p,q])=>{if(TRACE.edges.has(ek(p,q)))pencil(STARS[p],STARS[q])});
 if(TRACE.drag&&TRACE.cur!=null)pencil(STARS[TRACE.cur],TRACE.drag,2.4);
 if(!TRACE.done){const nx=TRACE.cur==null?0:traceNext(),pu=.5+.5*Math.sin(T*5);if(nx>=0){const[sx,sy]=STARS[nx];mx.strokeStyle=`rgba(200,140,40,${.35+.4*pu})`;mx.lineWidth=3;mx.beginPath();mx.arc(sx,sy,28+6*pu,0,7);mx.stroke()}
  if(TRACE.cur!=null){const[sx,sy]=STARS[TRACE.cur];mx.fillStyle='rgba(200,140,40,.18)';mx.beginPath();mx.arc(sx,sy,24,0,7);mx.fill()}
  if(TRACE.edges.size===0&&!TRACE.drag){const[a,b2]=LYRE_E[0],A=STARS[a],B=STARS[b2],k=(performance.now()/1000*.45)%1,u=clamp((k-.15)/.6);drawHand(mx,A[0]+(B[0]-A[0])*u+6,A[1]+(B[1]-A[1])*u+10,k>.1&&k<.8,k>.9?(1-k)*10:1)}}
 mx.restore()}
function drawScreen(T){mx.setTransform(HD,0,0,HD,0,0);mx.clearRect(0,0,MS,MS);
  STARS.forEach(([sx,sy],i)=>{const on=i<lit?1:0;blob(mx,sx,sy,14+on*56,`rgba(255,226,150,${.16+on*.62})`);mx.fillStyle=`rgba(255,245,215,${.4+on*.6})`;mx.beginPath();mx.arc(sx,sy,3+on*6,0,7);mx.fill()});
  STARS.forEach(([sx,sy],i)=>{if(i<lit){const hl=RECAP===i?1:0,k=(.5+.5*constel)*(.85+.15*Math.sin(T*2+i)),s=lerp(.75,1.05,constel)+hl*.45,ic=ICONS[i];mx.save();mx.globalCompositeOperation='lighter';mx.globalAlpha=Math.min(1,k+hl*.3);if(hl)blob(mx,sx,sy+14+ic.height*s/2,110,'rgba(170,210,255,.5)');mx.drawImage(ic,sx-ic.width*s/2,sy+14,ic.width*s,ic.height*s);mx.restore()}});
  // version papier : on trace d'abord au crayon, sur une page du carnet d'Alice ; puis la page s'efface et les traits deviennent des étoiles
  const pgK=PAPER&&(TRACE.on||TRACE.done)?(TRACE.done?1-clamp((performance.now()-(TRACE.doneT||0))/1100):1):0;
  const SK=PAPER&&TRACE.on&&!TRACE.done;if(SK)drawSketch(T,1);
  if(!SK&&(TRACE.on||TRACE.done&&constel<=0)){mx.save();mx.lineCap='round';
    if(!TRACE.done){mx.setLineDash([2,11]);mx.strokeStyle='rgba(225,240,255,.6)';mx.lineWidth=4.5;LYRE_E.forEach(([p,q])=>{mx.beginPath();mx.moveTo(...STARS[p]);mx.lineTo(...STARS[q]);mx.stroke()});mx.setLineDash([]);
      const nx=TRACE.cur==null?0:traceNext(),pu=.5+.5*Math.sin(T*5);if(nx>=0){const[sx,sy]=STARS[nx];mx.strokeStyle=`rgba(255,226,160,${.4+.5*pu})`;mx.lineWidth=4;mx.beginPath();mx.arc(sx,sy,30+8*pu,0,7);mx.stroke()}
      if(TRACE.edges.size===0&&!TRACE.drag){const[a,b2]=LYRE_E[0],A=STARS[a],B=STARS[b2],k=(performance.now()/1000*.45)%1,u=clamp((k-.15)/.6);drawHand(mx,A[0]+(B[0]-A[0])*u+6,A[1]+(B[1]-A[1])*u+10,k>.1&&k<.8,k>.9?(1-k)*10:1)}
      if(TRACE.cur!=null){const[sx,sy]=STARS[TRACE.cur];mx.fillStyle='rgba(255,236,190,.35)';mx.beginPath();mx.arc(sx,sy,26,0,7);mx.fill()}}
    mx.shadowColor='rgba(255,220,150,.9)';mx.shadowBlur=10;mx.strokeStyle='rgba(255,226,160,.85)';mx.lineWidth=3.5;
    LYRE_E.forEach(([p,q])=>{if(TRACE.edges.has(ek(p,q))){mx.beginPath();mx.moveTo(...STARS[p]);mx.lineTo(...STARS[q]);mx.stroke()}});
    if(TRACE.drag&&TRACE.cur!=null){mx.strokeStyle='rgba(255,236,190,.6)';mx.lineWidth=3;mx.beginPath();mx.moveTo(...STARS[TRACE.cur]);mx.lineTo(...TRACE.drag);mx.stroke()}mx.restore()}
  if(pgK>0&&TRACE.done)drawSketch(T,pgK);
  if(constel>0){mx.save();// le chemin fait le tour des quatre lieux et revient au début : un cercle
    const ord=[0,1,2,3,0].map(i=>STARS[i]),k1=TRACE.done?1:clamp(constel*1.6),k2=clamp(constel*1.6-.6),L=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
    mx.lineCap='round';mx.shadowColor='rgba(255,220,150,.9)';mx.shadowBlur=10;mx.strokeStyle=`rgba(255,226,160,${.8*constel})`;mx.lineWidth=3;mx.beginPath();mx.moveTo(...ord[0]);
    for(let i=0;i<4;i++){const t=clamp(k1*4-i);if(t<=0)break;mx.lineTo(...L(ord[i],ord[i+1],t))}mx.stroke();
    if(k2>0){mx.shadowBlur=0;const cx=STARS.reduce((a,p)=>a+p[0],0)/4,cy=STARS.reduce((a,p)=>a+p[1],0)/4,r=STARS.reduce((a,p)=>a+Math.hypot(p[0]-cx,p[1]-cy),0)/4;
      mx.save();mx.globalAlpha=k2*.9;mx.globalCompositeOperation='lighter';drawGlyph(mx,{seed:1918,a0:-.5,f:[{a:-.3,k:'splash',s:1.2},{a:1.6,k:'blob',s:1},{a:3.3,k:'tendril',s:1.2},{a:4.9,k:'spike',s:1}]},cx,cy,r,k2,'#ffe2a8');mx.restore();
      mx.save();mx.globalAlpha=k2;mx.textAlign='center';mx.font='600 44px Caveat, cursive';mx.fillStyle='rgba(255,236,190,.92)';mx.fillText('un cercle',cx,cy+12);mx.restore()}
    const X=STARS[0],pu=1+.08*Math.sin(T*2.4);if(vegaA>.02){mx.save();mx.globalCompositeOperation='lighter';blob(mx,X[0],X[1],(30+90*vegaA)*pu,`rgba(255,220,150,${.6*vegaA})`);mx.restore()}
    mx.restore()}
  vegaA+=(vegaT-vegaA)*(1-Math.pow(.15,DTG));
  drawSat(mx,T);
  SCR.a+=(SCR.ta-SCR.a)*(1-Math.pow(.03,DTG));if(SCR.ta===0&&SCR.a<.01){SCR.a=0;if(SCR.kind&&!SCR.keep)SCR.kind=null}
  if(SCR.a>0&&SCR.kind){mf.setTransform(HD,0,0,HD,0,0);mf.globalCompositeOperation='source-over';mf.clearRect(0,0,MS,MS);mf.drawImage(PAGE,0,0);
    if(SCR.kind==='mem'){if(PAPER)mf.drawImage(LABEL,0,0);const P=POP[SCR.id],t=(performance.now()-(SCR.t0||0))/1000;mf.save();mf.translate(384,30);mf.scale(.72,.72);mf.translate(-384,-40);drawPieces(mf,P.P,T,t);if(t>.8){mf.globalAlpha=clamp(t-.8);P.fx(mf,T);mf.globalAlpha=1}drawReveal(mf,T,SCR.id);memLight(mf,T,t,P.P);mf.restore();if(PAPER)drawTab(mf,T);drawJournal(mf,T)}
    else if(SCR.obj){drawCard(mf,(c,TT)=>SCR.obj.draw(c,TT),T);drawCap(mf,T)}
    mx.globalAlpha=SCR.a;mx.drawImage(memF,0,0,MS,MS);mx.globalAlpha=1}
  memTex.needsUpdate=true}

/* ---------- les objets-souvenirs ---------- */
const gm=M.gold;
const mkBars=()=>{const g=new THREE.Group();const rail=mesh(new THREE.BoxGeometry(.36,.035,.05),M.woodL);rail.position.y=.32;rail.rotation.z=.25;g.add(rail);for(let k=0;k<4;k++)g.add(at(mesh(new THREE.CylinderGeometry(.014,.014,.26-k*.03,8),M.cream),-.13+k*.09,.15+k*.012,0));return g};
const mkCereal=()=>{const g=new THREE.Group();const t=canvasTex(128,160,(x,W,H)=>{x.fillStyle='#f6f2ea';x.fillRect(0,0,W,H);x.fillStyle='#e8b84a';x.fillRect(0,0,W,14);x.fillRect(0,H-14,W,14);x.font='700 34px "Patrick Hand", Caveat, cursive';x.fillStyle='#22306e';x.textAlign='center';x.fillText('ALICE',W/2,H/2+12)});
  const b=mesh(new THREE.BoxGeometry(.24,.3,.07),[M.cream,M.cream,M.cream,M.cream,new THREE.MeshStandardMaterial({map:t,roughness:.9}),M.cream]);b.position.y=.16;g.add(b);return g};
const mkPen=()=>{const g=new THREE.Group();const b=mesh(new THREE.CylinderGeometry(.025,.025,.3,12),M.black);b.rotation.z=Math.PI/2.3;b.position.y=.12;g.add(b);const n=mesh(new THREE.ConeGeometry(.022,.07,10),plastic('#c9c9c9'));n.rotation.z=Math.PI/2.3+Math.PI;n.position.set(-.16,.06,0);g.add(n);const blot=mesh(new THREE.CircleGeometry(.12,16),new THREE.MeshStandardMaterial({color:'#141414',roughness:.6}),false,false);blot.rotation.x=-Math.PI/2;blot.position.set(-.1,.075,.04);g.add(blot);return g};
const mkCups=()=>{const g=new THREE.Group();[[-.08,0],[.09,.04]].forEach(([x,z])=>{const c=mesh(new THREE.CylinderGeometry(.06,.045,.09,16),M.cream);c.position.set(x,.11,z);g.add(c);const h=mesh(new THREE.TorusGeometry(.025,.008,6,12),M.cream);h.position.set(x+.065,.115,z);g.add(h);const t=mesh(new THREE.CircleGeometry(.055,14),plastic('#a8743a'),false,false);t.rotation.x=-Math.PI/2;t.position.set(x,.152,z);g.add(t)});return g};
const KEEPS=[mkBars,mkCereal,mkPen,mkCups].map((f,i)=>{const o=new THREE.Group();const ped=mesh(new THREE.CylinderGeometry(.16,.19,.12,20),M.marbleP);ped.position.y=.06;o.add(ped);const it=f();it.position.y=.1;o.add(it);o.userData.it=it;o.scale.setScalar(.001);o.userData.s=0;const p=SPOTS[i];o.position.set(p.x+.45,TOP,p.z+.15);box.add(o);return o});
// le repère du prochain lieu : une petite lentille de plastique translucide, moulée dans le sol, qui s'allume de l'intérieur
const ring=new THREE.Group();box.add(ring);ring.material={opacity:1};
{const lensMat=new THREE.MeshPhysicalMaterial({color:new THREE.Color('#fff2c8').convertSRGBToLinear(),emissive:new THREE.Color('#ffc65a'),emissiveIntensity:1,roughness:.15,clearcoat:1,transmission:.3,transparent:true,opacity:.92});ring.userData.mat=lensMat;
 const lens=mesh(new THREE.SphereGeometry(.34,32,10,0,Math.PI*2,0,Math.PI*.18),lensMat,false,false);lens.scale.y=.9;lens.position.y=-.36;ring.add(lens);
 const rim=mesh(new THREE.TorusGeometry(.36,.04,10,40),plastic('#c9b48a',{roughness:.4}),false,true);rim.rotation.x=Math.PI/2;rim.position.y=-.06;ring.add(rim)}
const spotLight=new THREE.PointLight(0xffc870,.8,2.4,2);box.add(spotLight);
const ring2=new THREE.Object3D();ring2.material={opacity:0};ring2.scale.setScalar(1);
const poolTex=canvasTex(256,256,(x,W)=>{const g=x.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);g.addColorStop(0,'rgba(255,236,180,.95)');g.addColorStop(.55,'rgba(255,214,130,.45)');g.addColorStop(1,'rgba(255,214,130,0)');x.fillStyle=g;x.fillRect(0,0,W,W);for(let i=0;i<120;i++)dab(x,W/2+rnd(-70,70),W/2+rnd(-70,70),rnd(10,24),rnd(4,8),rnd(0,3),45,90,85,.12)});
const ringGlow=mesh(new THREE.CircleGeometry(.6,32),new THREE.MeshBasicMaterial({map:poolTex,transparent:true,opacity:.7,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending}),false,false);ringGlow.rotation.x=-Math.PI/2;box.add(ringGlow);
// une colonne de lumière dorée et un losange qui flotte au-dessus du prochain lieu
const beacon=new THREE.Group();box.add(beacon);if(0){const col=new THREE.Mesh(new THREE.CylinderGeometry(.42,.5,3.2,32,1,true),new THREE.MeshBasicMaterial({color:'#ffd77a',transparent:true,opacity:.32,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));col.position.y=1.6;beacon.add(col);
 const gem=mesh(new THREE.OctahedronGeometry(.2),new THREE.MeshPhysicalMaterial({color:'#ffd27a',emissive:new THREE.Color('#ffb340'),emissiveIntensity:.6,metalness:.4,roughness:.2,clearcoat:1}),false,false);gem.scale.y=1.5;gem.position.y=2.2;beacon.add(gem);beacon.userData.gem=gem}

/* ---------- les dialogues : on avance en touchant, à son rythme ---------- */
const say=$('say'),sayWho=say.querySelector('.who'),sayTxt=say.querySelector('.txt');let waitTap=false;
const WHO={alice:'Alice',maman:'Maman',papa:'Papa',lieu:'',src:''};
const nb=t=>String(t).replace(/ ([:;?!»])/g,'\u202f$1').replace(/« /g,'«\u202f').replace(/(\d) (\d{3})/g,'$1\u202f$2');
function showLine(who,t){t=nb(t);if(SCR.kind==='mem'&&SCR.ta===1&&INKC[who]){jWrite(who,t);say.className='jr';sayWho.textContent=WHO[who]||'';sayTxt.textContent=t;say.hidden=false;waitTap=true;return}say.className='line '+who;sayWho.textContent=WHO[who]||'';sayTxt.textContent=t;say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=true}
function showHint(t){t=nb(t);if(SCR.kind==='manip'&&SCR.obj){capWrite(t);say.className='jr';sayWho.textContent='';sayTxt.textContent=t;say.hidden=false;waitTap=false;return}say.className='hint';sayWho.textContent='';sayTxt.textContent=t;say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=false}
function showAsk([i,q,good,...bad]){q=nb(q);good=nb(good);bad=bad.map(nb);say.className='line ask';sayWho.textContent='';const opts=[[good,1],...bad.map(b=>[b,0])].sort(()=>Math.random()-.5);sayTxt.innerHTML='';const p=document.createElement('div');p.textContent=q;sayTxt.appendChild(p);
  opts.forEach(([t,ok])=>{const b=document.createElement('button');b.className='ch';b.textContent=t;b.addEventListener('click',ev=>{ev.stopPropagation();if(say.dataset.done)return;say.dataset.done='1';b.classList.add(ok?'ok':'no');if(!ok)[...sayTxt.querySelectorAll('.ch')].forEach(o=>{if(o.textContent===good)o.classList.add('ok')});sndPaper(.3,.2);setTimeout(()=>{delete say.dataset.done;waitTap=false;hideSay();step()},ok?900:1900)});sayTxt.appendChild(b)});
  say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=false}
function hideSay(){say.hidden=true;waitTap=false}

/* ---------- le scénario ---------- */
let Q=[],qi=0,busy=false,curManip=null,camMode='title',next=0,openT=0;
const RC=(i,q,ans)=>[{fn:()=>{RECAP=i}},{say:'lieu',t:q},{say:'lieu',t:ans}];
const RCARD=[[0,'Maman : « Où commence “tiède” ? »','Chacun place la frontière ailleurs. Chaque langue découpe le monde à sa façon, sans empêcher de voir ce qu’elle ne nomme pas.'],
 [1,'Papa : « Gavagai ! Qu’est-ce que ça veut dire ? »','Impossible à deviner : il faut un oui, un non, des questions. Une langue s’apprend en face à face.'],
 [2,'Maman : « Pourquoi écrire en cercles ? »','Dessinées, des phrases emboîtées se lisent d’un regard. Mais pour tracer le cercle, il faut connaître toute la phrase.'],
 [3,'Papa : « Une langue change-t-elle la pensée ? »','Elle ne l’enferme pas et ne fait pas voir l’avenir. Elle oblige à regarder certaines choses : où en est l’action, comment on sait.'],
 [4,'Maman : « Et quand une langue disparaît ? »','S’en va une façon de dire, et l’attention qui va avec. Une langue vit dans ceux qui la parlent : demander pendant qu’on peut.']];
const CARDST=[null,null,null,null,null],CARDFIRST=[null,null,null,null,null];
const SUITS=['♠','♥','♣','♦','♥'];
function showCard([i,q,a]){q=nb(q);a=nb(a);say.className='line ask card';sayWho.textContent='';sayTxt.innerHTML='';const s=SUITS[i%5],red=s==='♥'||s==='♦';
  const fc=document.createElement('div');fc.className='fc'+(red?' red':'');fc.innerHTML=`<div class="fc-in"><div class="fc-f"><span class="big">${s}</span><span class="co tl">${i+1}<br>${s}</span><span class="co br">${i+1}<br>${s}</span><div class="fc-t"></div><div class="fc-h">Chercher la réponse dans sa tête, puis toucher la carte</div></div><div class="fc-b"><span class="big">${s}</span><span class="co tl">${i+1}<br>${s}</span><span class="co br">${i+1}<br>${s}</span><div class="fc-t"></div></div></div>`;
  fc.querySelector('.fc-f .fc-t').textContent=q;fc.querySelector('.fc-b .fc-t').textContent=a;sayTxt.appendChild(fc);
  const row=document.createElement('div');row.className='fc-row';sayTxt.appendChild(row);
  fc.addEventListener('click',ev=>{ev.stopPropagation();if(fc.classList.contains('flip'))return;fc.classList.add('flip');sndPaper(.35,.25);
    setTimeout(()=>{[['Je l’avais ✓',1],['Pas encore ↺',0]].forEach(([t,ok])=>{const b=document.createElement('button');b.className='ch half';b.textContent=t;b.addEventListener('click',e2=>{e2.stopPropagation();if(say.dataset.done)return;say.dataset.done='1';CARDST[i]=ok?1:0;if(CARDFIRST[i]==null)CARDFIRST[i]=ok?1:0;pipsSync();b.classList.add(ok?'ok':'no');if(ok)sndTone(659,.9,.1);setTimeout(()=>{delete say.dataset.done;hideSay();step()},500)});row.appendChild(b)})},450)});
  say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=false}
const SCRIPTS={
 // fil : les mots découpent le monde → un mot se demande → une phrase en cercle → une langue fait regarder → (aujourd'hui) une langue vit dans ceux qui la parlent
 intro:[{cam:'box'},{fn:()=>{aliceSay('Une carte de Maman est arrivée. Un seul mot dessus. J’ai rouvert notre boîte ronde.');showHint('Toucher le sol pour emmener Alice vers la lumière. Glisser pour tourner, pincer pour zoomer.')}}],
 0:[{cam:'box'},{say:'lieu',t:'L’université. Dans le film, Louise y enseigne les langues. Toutes parlent du même monde, mais chacune le découpe à sa façon.'},{cam:'lid'},{manip:()=>mkMots()},
  {mem:'escalier'},{say:'alice',t:'C’était le film préféré de Maman. Papa disait qu’il était trop triste pour moi.'},
  {say:'alice',t:'Un soir, je suis descendue en cachette. Entre les barreaux, je voyais la brume sur l’écran, et Maman, toute seule sous son plaid.'},
  {fn:()=>{MEMX.papa=performance.now()}},{say:'papa',t:'Juste le début. Après, au lit.'},{say:'alice',t:'Il ne m’a pas renvoyée. Il s’est assis sur la marche, tout contre moi, et il a passé son bras autour de mes épaules.'},
  {note:'Chaque langue découpe le monde à sa façon, sans nous empêcher de le voir.'},
  {say:'alice',t:'Sur la table basse, son carnet était ouvert, plein de cercles et de mots. Elle ne regardait pas le film : elle l’étudiait.'},
  {say:'alice',t:'Mais alors, comment parler à quelqu’un dont on ne connaît pas un seul mot ?'},{memoff:1},{reward:0},{cam:'box'}],
 1:[{cam:'box'},{say:'lieu',t:'Le camp. Louise ôte sa combinaison, s’avance vers la vitre et montre un tableau blanc : HUMAIN.'},
  {ask:[-1,'Le capitaine Cook montre un animal et demande son nom. On lui répond : « kangourou ». Que voulait dire ce mot ?','Personne ne sait : l’histoire est inventée','« Je ne comprends pas »','« Animal qui saute »']},
  {say:'lieu',t:'Dans le film, Louise répond « je ne comprends pas »… puis avoue que l’histoire est fausse : « Mais elle illustrait mon idée. » Un mot se vérifie. Une belle histoire aussi.'},
  {cam:'lid'},{manip:()=>mkGavagai()},
  {mem:'canape'},{say:'alice',t:'Quelques semaines plus tard, Maman m’a laissée le regarder en entier, avec elle.'},
  {say:'alice',t:'Pendant la scène du tableau, j’ai écrit ALICE sur un carton de céréales et je me suis plantée devant la télé. Maman a écrit MAMAN.'},
  {say:'papa',t:'Kangourou !'},{say:'maman',t:'Elle est fausse, cette histoire.'},{say:'papa',t:'Mais elle marche.'},
  {note:'Un mot montré du doigt peut tout vouloir dire. On ne le devine pas : on le demande.'},
  {say:'alice',t:'Au dos de son carton, Maman avait écrit « maman » dans toutes les langues qu’elle connaissait. Presque toutes commencent par m.'},{say:'maman',t:'C’est souvent le premier mot. Le plus facile à dire, avec les lèvres.'},
  {say:'alice',t:'Ensuite, dans le film, les visiteurs ont écrit. Des cercles. Pourquoi des cercles ?'},{memoff:1},{reward:1},{cam:'box'}],
 2:[{cam:'box'},{say:'lieu',t:'La coquille. Derrière la vitre, les visiteurs écrivaient à l’encre, des deux mains, en partant des deux bouts à la fois. Le cercle se refermait.'},
  {say:'lieu',t:'Louise comprend : pour écrire ainsi, il faut déjà connaître chaque mot de la phrase, et la place qu’il prendra.'},{cam:'lid'},{manip:()=>mkEmboite()},
  {mem:'encre'},{say:'alice',t:'Après le film, j’ai voulu écrire comme eux, avec le stylo-plume de Maman. Une tache est tombée sur la nappe.'},
  {say:'alice',t:'Ça se lit par où ?'},{say:'maman',t:'Par partout à la fois. Pour l’écrire, il faut déjà savoir la fin.'},
  {say:'alice',t:'Moi, je ne sais jamais la fin de mes phrases.'},{say:'papa',t:'Ça, c’est vrai.'},
  {note:'Ce qui nous perd dans une ligne de sons se lit d’un regard quand c’est dessiné.'},
  {say:'alice',t:'Mon cercle voulait dire « encore ». Bien plus tard, je l’ai retrouvé dans son vieux carnet d’étudiante, glissé au milieu de ses cercles à elle.'},
  {say:'alice',t:'Mais apprendre leur langue, qu’est-ce que ça changeait dans la tête de Louise ?'},{memoff:1},{reward:2},{cam:'box'}],
 3:[{cam:'box'},{say:'lieu',t:'La maison du lac. Dans le film, c’est ici que Louise se souvient… de jours qui ne sont pas encore venus.'},
  {say:'lieu',t:'Dans le film, Ian lui donne son nom : l’hypothèse de Sapir-Whorf. La langue qu’on parle façonnerait notre façon de penser. Jusqu’où ?'},
  {ask:[-1,'Apprendre une langue peut-il faire voir l’avenir ?','Non : c’est la part de fiction du film','Oui, si on la parle assez bien','Oui, mais seulement en rêve']},
  {say:'lieu',t:'Une langue qui enfermerait la pensée : cette version forte n’est plus défendue. Une langue qui oriente l’attention, ce qu’on remarque et ce qu’on doit dire : cette version-là se discute encore.'},
  {cam:'lid'},{manip:()=>mkAspect()},
  {mem:'fin'},{say:'alice',t:'À la fin, j’ai compris, pour la petite fille du film.'},{say:'alice',t:'Elle savait, et elle l’a fait quand même ?'},
  {say:'alice',t:'Maman s’est tue longtemps.'},{say:'maman',t:'Elle ne voyait pas une fin. Elle voyait tout en même temps. Les jours heureux aussi.'},
  {say:'papa',t:'Nous, on ne voit rien d’avance. Alors on profite.'},
  {note:'Une langue ne fait pas voir l’avenir. Elle change ce qu’on regarde.'},
  {say:'alice',t:'Plus tard dans la nuit, je suis redescendue boire de l’eau. Depuis l’escalier, j’ai vu Maman regarder encore la fin, toute seule. Je suis remontée sans bruit.'},
  {memoff:1},{reward:3},
  {wait:600},{cam:'lid'},{trace:1},{fn:()=>{constelT=1}},{wait:1800},
  {say:'maman',t:'Regarde : ton chemin fait le tour, et revient à son début. Comme un de leurs cercles.'},{say:'alice',t:'Et chaque étoile garde un morceau du film. Je m’en souviens encore ?'},
  {ask:[0,'L’escalier garde…','Chaque langue découpe le monde à sa façon','Toutes les langues ont les mêmes mots','On ne voit pas ce qu’on ne sait pas nommer']},
  {ask:[1,'Le carton ALICE garde…','Un mot ne se devine pas : il se demande','Un mot montré du doigt n’a qu’un sens','Un mot se traduit toujours mot à mot']},
  {ask:[2,'La tache d’encre garde…','Dessinées, des phrases emboîtées se lisent d’un regard','En ligne, on suit mieux qu’en cercle','Un cercle se lit de gauche à droite']},
  {ask:[3,'Les deux tasses de thé gardent…','La langue fait regarder autrement, sans enfermer','La langue permet de voir l’avenir','La langue ne change rien à rien']},
  {fn:()=>{RECAP=3;vegaT=1;sndTone(784,2.4,.12);sndTone(1175,2.4,.06,.25)}},{wait:1400},{say:'alice',t:'Quatre lieux, un seul trait. Un cercle n’a ni début ni fin.'},{fn:()=>{RECAP=-1}},
  {say:'alice',t:'Louise pensait autrement, oui. L’avenir, lui, c’est le cinéma.'},
  {cam:'box'},{fn:()=>{unlock5()}},{wait:1800},{say:'alice',t:'Le fil revient à l’université. Aujourd’hui.'},{fn:()=>{hideSay();next=4;REPLAY.last=3}}]};
let constelT=0,DTG=.016;
let curName=null;function run(name){curName=name;Q=SCRIPTS[name];qi=0;busy=true;step()}
function step(){while(qi<Q.length){const s=Q[qi++];
  if(s.cam){camMode=s.cam;continue}
  if(s.fn){s.fn();continue}
  if(s.mem){MEMX.papa=0;Object.assign(TAB,{need:false,rev:false,auto:0,p:0});SCR.kind='mem';SCR.id=s.mem;SCR.ta=1;SCR.t0=performance.now();JR.items=[];JR.note=null;sndPaper(.6,.5);continue}
  if(s.note&&PAPER&&SCR.kind==='mem'&&REVEAL[SCR.id]&&!TAB.rev){Object.assign(TAB,{need:true,note:s.note,auto:0,p:0});say.className='hint';sayWho.textContent='';sayTxt.textContent='Tirer la languette.';say.hidden=false;waitTap=true;return}
  if(s.note){JR.noteN=(JR.noteN||0)+1;JR.note={text:s.note,t0:performance.now()};sndPaper(.4,.3);say.className='jr';sayWho.textContent='';sayTxt.textContent='À retenir : '+s.note;say.hidden=false;waitTap=true;return}
  if(s.memoff){SCR.ta=0;continue}
  if(s.reward!=null){const o=KEEPS[s.reward];o.userData.s=1;lit=s.reward+1;continue}
  if(s.lid!=null){openT=s.lid;continue}
  if(s.wait){setTimeout(step,AUTO?s.wait*.4:s.wait);return}
  if(s.say){showLine(s.say,s.t);return}
  if(s.ask){RECAP=s.ask[0];showAsk(s.ask);return}
  if(s.copy){showCopy();return}
  if(s.card){RECAP=s.card[0]<4?s.card[0]:-1;showCard(s.card);return}
  if(s.retry){const miss=[...Array(s.retry).keys()].filter(i=>CARDST[i]===0);if(miss.length)Q.splice(qi,0,{say:'alice',t:'Je reprends celles qui m\u2019échappaient.'},...miss.map(i=>({card:RCARD[i]})));continue}
  if(s.arg){startArg();return}
  if(s.trace){TRACE.on=true;TRACE.t0=performance.now();showHint('Maman me montrait le ciel : « Relie les étoiles, dans l’ordre du chemin. Suis les pointillés. »');return}
  if(s.manip){sndPaper(.45,.4);curManip=s.manip();SCR.kind='manip';SCR.obj=curManip;SCR.ta=1;showHint(curManip.hint);return}}
  busy=false;if(typeof curName==='number'&&curName<3)next=curName+1;Q=[]}
function advance(){if(jWriting()){jFinish();return}if(PAPER&&TAB.need&&!TAB.rev){if(!TAB.auto)TAB.auto=performance.now();return}if(waitTap){waitTap=false;hideSay();step()}}
function manipTick(){if(curManip&&curManip.done){curManip=null;SCR.ta=0;hideSay();setTimeout(step,600)}}
