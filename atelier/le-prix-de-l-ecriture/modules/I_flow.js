/* ---------- l'écran du couvercle : constellation de la Lyre + souvenirs + manipulations ---------- */
const memF=mkC(),mf=memF.getContext('2d');
// les étoiles sont à l'endroit exact des lieux sur la carte : la constellation, c'est le chemin parcouru
let RECAP=-1;const MAPK=52,toStar=(x,z)=>[MS/2+x*MAPK,MS/2+z*MAPK];const STARS=SPOTS.map(s=>toStar(s.x,s.z));
const ROUTEPX=(()=>{const c=new THREE.CatmullRomCurve3(ROUTE.map(([a,b])=>new THREE.Vector3(a,0,b)));return[...Array(80)].map((_,i)=>{const p=c.getPoint(i/79);return toStar(p.x,p.z)})})();
// les objets-souvenirs, peints en petit, qui apparaissent en surimpression près de leur étoile
const goldG=(c,x0,x1)=>{const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#9a6a20');g.addColorStop(.5,'#ffe9a0');g.addColorStop(1,'#9a6a20');return g};
// les objets en surimpression : tracés de lumière dans la nuit, comme des fantômes
const ghost=(draw)=>sprite(110,110,c=>{c.translate(10,10);c.lineCap=c.lineJoin='round';
  for(const [w,col,bl] of [[9,'rgba(160,200,255,.18)',14],[5,'rgba(220,235,255,.45)',6],[2,'rgba(255,252,240,.95)',0]]){c.save();c.strokeStyle=col;c.lineWidth=w;c.shadowColor='rgba(170,210,255,.9)';c.shadowBlur=bl;draw(c);c.restore()}});
const ICONS=[ghost(c=>{c.beginPath();c.moveTo(34,64);c.bezierCurveTo(12,46,30,30,16,10);c.moveTo(56,64);c.bezierCurveTo(78,46,60,30,74,10);c.moveTo(18,20);c.lineTo(72,20);c.moveTo(25,64);c.quadraticCurveTo(45,82,65,64);c.closePath();for(let k=-2;k<=2;k++){c.moveTo(45+k*6,20);c.lineTo(45+k*4,66)}c.stroke()}),
 ghost(c=>{c.beginPath();c.ellipse(20,45,9,20,0,0,7);c.moveTo(20,25);c.lineTo(78,25);c.moveTo(20,65);c.lineTo(78,65);c.moveTo(78,25);c.ellipse(78,45,9,20,0,-Math.PI/2,Math.PI/2);c.moveTo(48,25);c.lineTo(48,65);c.stroke();c.beginPath();for(let a=0;a<10;a+=.25){const r=a*.8;c.lineTo(20+Math.cos(a)*r*.5,45+Math.sin(a)*r)}c.stroke()}),
 ghost(c=>{c.beginPath();c.moveTo(14,70);c.quadraticCurveTo(8,30,40,20);c.quadraticCurveTo(76,16,76,56);c.quadraticCurveTo(76,76,14,70);c.stroke();c.beginPath();c.ellipse(38,56,7,5,-.4,0,7);c.moveTo(45,55);c.lineTo(45,30);c.quadraticCurveTo(54,36,56,44);c.stroke()}),
 ghost(c=>{c.beginPath();c.moveTo(28,30);c.lineTo(45,14);c.lineTo(62,30);c.closePath();c.rect(30,30,30,36);c.moveTo(26,72);c.lineTo(64,72);c.moveTo(45,40);c.quadraticCurveTo(38,50,45,58);c.quadraticCurveTo(52,50,45,40);c.stroke()})];
{const o=[...ICONS];ICONS[0]=o[2];ICONS[1]=o[0];ICONS[2]=o[1]}
const SCR={kind:null,id:null,obj:null,a:0,ta:0};let lit=0,constel=0,vegaA=0,vegaT=0;
const LYRE_E=[[0,1],[1,2],[2,0]],TRACE={on:false,done:false,edges:new Set(),cur:null,drag:null,miss:0,t0:0,flash:0};
const ek=(a,b)=>a<b?a+'-'+b:b+'-'+a,starAt=(x,y)=>{let best=-1,bd=80;STARS.forEach(([sx,sy],i)=>{const d=Math.hypot(x-sx,y-sy);if(d<bd){bd=d;best=i}});return best};
function traceLink(a,b){if(a<0||b<0||a===b)return false;const k=ek(a,b);if(!LYRE_E.some(([p,q])=>ek(p,q)===k)){TRACE.miss++;showHint(TRACE.miss>1?'« Suis le bord : d’une étoile à sa voisine, celle qui brille. »':'« Pas en travers, Alice. Suis le bord. »');return false}
  if(!TRACE.edges.has(k)){TRACE.edges.add(k);sndTone([392,494,587][TRACE.edges.size-1],1.4,.12);if(TRACE.edges.size===3){TRACE.done=true;TRACE.doneT=performance.now();TRACE.cur=null;setTimeout(()=>{if(TRACE.on){TRACE.on=false;hideSay();step()}},900)}}TRACE.cur=b;return true}
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
function drawScreen(T){mx.setTransform(1,0,0,1,0,0);mx.clearRect(0,0,MS,MS);
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
  if(constel>0){mx.save();// les trois premiers lieux dessinent un Δ : le Deltoton ; Alexandrie brille sur son bord, comme au bord du vrai delta
    const [A,P,S,X]=STARS,ord=[A,P,S,A],k1=TRACE.done?1:clamp(constel*1.6),k2=clamp(constel*1.6-.6),L=(p,q,t)=>[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];
    mx.lineCap='round';mx.shadowColor='rgba(255,220,150,.9)';mx.shadowBlur=10;mx.strokeStyle=`rgba(255,226,160,${.8*constel})`;mx.lineWidth=3;mx.beginPath();mx.moveTo(...A);
    for(let i=0;i<3;i++){const t=clamp(k1*3-i);if(t<=0)break;mx.lineTo(...L(ord[i],ord[i+1],t))}mx.stroke();
    if(k2>0){mx.shadowBlur=0;const cx=(A[0]+P[0]+S[0])/3,cy=(A[1]+P[1]+S[1])/3;mx.save();mx.globalAlpha=k2;mx.textAlign='center';
      mx.font='600 42px Caveat, cursive';mx.fillStyle='rgba(255,236,190,.92)';mx.fillText('le Deltoton',(A[0]+S[0])/2,Math.min(A[1],S[1])-30);mx.restore()}
    const pu=1+.08*Math.sin(T*2.4);if(vegaA>.02){mx.save();mx.globalCompositeOperation='lighter';blob(mx,X[0],X[1],(30+90*vegaA)*pu,`rgba(255,220,150,${.6*vegaA})`);mx.restore();mx.save();mx.globalAlpha=vegaA;mx.strokeStyle='rgba(255,240,210,.9)';mx.lineWidth=1.5;for(let r=0;r<4;r++){const an=r*Math.PI/2+T*.2;mx.beginPath();mx.moveTo(X[0]+Math.cos(an)*10,X[1]+Math.sin(an)*10);mx.lineTo(X[0]+Math.cos(an)*(r%2?32:46),X[1]+Math.sin(an)*(r%2?32:46));mx.stroke()}mx.restore()}
    mx.restore()}
  vegaA+=(vegaT-vegaA)*(1-Math.pow(.15,DTG));
  drawSat(mx,T);
  SCR.a+=(SCR.ta-SCR.a)*(1-Math.pow(.03,DTG));if(SCR.ta===0&&SCR.a<.01){SCR.a=0;if(SCR.kind&&!SCR.keep)SCR.kind=null}
  if(SCR.a>0&&SCR.kind&&!SCR.dio){mf.globalCompositeOperation='source-over';mf.clearRect(0,0,MS,MS);mf.drawImage(PAGE,0,0);
    if(SCR.kind==='mem'){if(PAPER){mf.drawImage(LABEL,0,0);drawTab(mf,T)}const P=POP[SCR.id],t=(performance.now()-(SCR.t0||0))/1000;mf.save();mf.translate(384,30);mf.scale(.72,.72);mf.translate(-384,-40);drawPieces(mf,P.P,T,t);if(t>.8){mf.globalAlpha=clamp(t-.8);P.fx(mf,T);mf.globalAlpha=1}drawReveal(mf,T,SCR.id);memLight(mf,T,t,P.P);mf.restore();drawJournal(mf,T)}
    else if(SCR.obj)drawCard(mf,(c,TT)=>SCR.obj.draw(c,TT),T);
    mx.globalAlpha=SCR.a;mx.drawImage(memF,0,0);mx.globalAlpha=1}
  memTex.needsUpdate=true}

/* ---------- les objets-souvenirs ---------- */
const gm=M.gold;
const mkLyre=()=>{const g=new THREE.Group();// caisse arrondie, deux bras en corne, joug, cordes : une vraie lyre
  const body=mesh(new THREE.SphereGeometry(.14,20,12),gm);body.scale.set(1,.7,.45);body.position.y=.14;g.add(body);
  [-1,1].forEach(k=>{const pts=[[.07*k,.16],[.15*k,.28],[.13*k,.4],[.18*k,.5]].map(([x,y])=>new THREE.Vector3(x,y,0));g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,.022,8),gm));g.add(at(mesh(new THREE.SphereGeometry(.03,10,8),gm),.18*k,.5,0))});
  const yoke=mesh(new THREE.CylinderGeometry(.018,.018,.34,8),gm);yoke.rotation.z=Math.PI/2;yoke.position.y=.45;g.add(yoke);
  for(let k=-2;k<=2;k++)g.add(at(mesh(new THREE.CylinderGeometry(.004,.004,.28,4),M.cream),k*.035,.31,.04));return g};
const mkPapyrus=()=>{const g=new THREE.Group();const r=mesh(new THREE.CylinderGeometry(.07,.07,.34,16),M.cream);r.rotation.z=Math.PI/2;r.position.y=.12;g.add(r);g.add(at(mesh(new THREE.SphereGeometry(.05,10,8),M.red),0,.12,.07));{const rb=at(mesh(new THREE.TorusGeometry(.072,.01,6,16),M.red),0,.12,0);rb.rotation.y=Math.PI/2;g.add(rb)};return g};
const mkStone=()=>{const g=new THREE.Group();const s=mesh(new THREE.SphereGeometry(.17,16,12),M.stone);s.scale.set(1,.75,.8);s.position.y=.13;g.add(s);g.add(at(mesh(new THREE.SphereGeometry(.035,10,8),gm),-.02,.14,.13));g.add(at(mesh(new THREE.CylinderGeometry(.008,.008,.12,6),gm),.01,.2,.13));return g};
const mkLantern=()=>{const g=new THREE.Group();g.add(at(mesh(new THREE.CylinderGeometry(.09,.09,.16,16),new THREE.MeshPhysicalMaterial({color:'#fff3c0',emissive:new THREE.Color('#ffcf6a'),emissiveIntensity:.8,transparent:true,opacity:.92})),0,.12,0));g.add(at(mesh(new THREE.ConeGeometry(.12,.1,16),gm),0,.25,0));g.add(at(mesh(new THREE.CylinderGeometry(.11,.11,.03,16),gm),0,.03,0));g.add(at(mesh(new THREE.TorusGeometry(.04,.012,8,16),gm),0,.32,0));return g};
const KEEPS=[mkStone,mkLyre,mkPapyrus,mkLantern].map((f,i)=>{const o=new THREE.Group();const ped=mesh(new THREE.CylinderGeometry(.16,.19,.12,20),M.marbleP);ped.position.y=.06;o.add(ped);const it=f();it.position.y=.1;o.add(it);o.userData.it=it;o.scale.setScalar(.001);o.userData.s=0;const p=SPOTS[i];o.position.set(p.x+.45,TOP,p.z+.15);box.add(o);return o});
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
function showLine(who,t){t=nb(t);if(SCR.kind==='mem'&&SCR.ta===1&&INKC[who]&&!SCR.dio){jWrite(who,t);say.className='jr';sayWho.textContent=WHO[who]||'';sayTxt.textContent=t;say.hidden=false;waitTap=true;return}say.className='line '+who;sayWho.textContent=WHO[who]||'';sayTxt.textContent=t;say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=true}
// le récit (pensées d'Alice, souvenirs) et la consigne (ce qu'il faut faire) : la consigne va à la ligne, dans un autre style
const ACT_RE=/^([\s\S]*?)(?:^|\s)((?:Toucher|Faire glisser|Glisser|Tourner|Crayonner|Tracer|Chercher de mémoire|Choisir|Relier|Appuyer|Écouter)\b[\s\S]*)$/;
function setHintText(t){sayTxt.innerHTML='';const m=t.match(ACT_RE);if(!m){sayTxt.textContent=t;return}
  if(m[1].trim()){const a=document.createElement('span');a.className='rec';a.textContent=m[1].trim();sayTxt.append(a)}const b=document.createElement('span');b.className='act';b.textContent=m[2];sayTxt.append(b)}
function showHint(t){t=nb(t);say.className='hint';sayWho.textContent='';setHintText(t);say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=false}
function showAsk([i,q,good,...bad]){q=nb(q);good=nb(good);bad=bad.map(nb);say.className='line ask';sayWho.textContent='';const opts=[[good,1],...bad.map(b=>[b,0])].sort(()=>Math.random()-.5);sayTxt.innerHTML='';const p=document.createElement('div');p.textContent=q;sayTxt.appendChild(p);
  opts.forEach(([t,ok])=>{const b=document.createElement('button');b.className='ch';b.textContent=t;b.addEventListener('click',ev=>{ev.stopPropagation();if(say.dataset.done)return;say.dataset.done='1';b.classList.add(ok?'ok':'no');if(!ok)[...sayTxt.querySelectorAll('.ch')].forEach(o=>{if(o.textContent===good)o.classList.add('ok')});sndPaper(.3,.2);setTimeout(()=>{delete say.dataset.done;waitTap=false;hideSay();step()},ok?900:1900)});sayTxt.appendChild(b)});
  say.hidden=false;say.classList.remove('in');void say.offsetWidth;say.classList.add('in');waitTap=false}
function hideSay(){say.hidden=true;waitTap=false}

/* ---------- le scénario ---------- */
let Q=[],qi=0,busy=false,curManip=null,camMode='title',next=0,openT=0;
const RC=(i,q,ans)=>[{fn:()=>{RECAP=i}},{say:'lieu',t:q},{say:'lieu',t:ans}];
const RCARD=[[0,'Papa : « À Göbekli Tepe, comment retrouvait-on un chant ? »','On allait à la pierre qui le gardait, même en pensée. Chaque savoir avait sa place.'],
 [1,'Maman : « Comment un aède gardait-il 16 000 vers ? »','Il rangeait chaque scène dans un lieu, puis parcourait les lieux en chantant.'],
 [2,'Papa : « Que craignait Thamus, avec l’écriture ? »','Qu’en se fiant aux signes écrits, on cesse d’exercer sa mémoire, et qu’on oublie.'],
 [3,'Papa : « Alors, il faut renoncer à écrire ? »','Non : garder l’écriture, et rallumer sa mémoire. Le rouleau garde, la mémoire éclaire.'],
 [4,'Papa : « Et avec l’IA ? »','Chercher d’abord avec ce qu’on sait, puis demander et creuser : le nouveau s’accroche à ce qu’on avait trouvé.']];
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
 // court, touchant, mystérieux. fil : une mémoire immense → une invention → une perte → une lumière
 intro:[{cam:'box'},{fn:()=>{if(PAPER)aliceSay('Papa et Maman sont repartis, pour longtemps. J’ai rouvert notre boîte.');showHint((PAPER?'':'« La boîte de papa. Je ne l’avais pas rouverte depuis… » ')+'Toucher le sol pour emmener Alice vers la lumière. Glisser pour tourner, pincer pour zoomer.')}}],
 0:[{cam:'box'},{say:'lieu',t:'Göbekli Tepe, il y a plus de 11 000 ans. Des pierres levées, bien avant l’écriture.'},{cam:'lid'},{manip:mkPierres},
  {mem:'echo'},{say:'alice',t:'Ils chantaient tout bas. La pierre répondait.'},
  {say:'alice',t:'Des années plus tard, j’y suis retournée seule. J’ai chanté tout bas. La pierre, elle, se souvenait.'},{say:'alice',t:'Maman dit qu’on peut tout oublier, sauf les chansons. Elle dit ça en regardant ailleurs.'},
  {note:'Avant l’écriture, chaque savoir avait sa place.'},{memoff:1},{reward:0},{cam:'box'}],
 1:[{cam:'box'},{say:'lieu',t:'La Grèce, bien plus tard. Un aède, un poète qui chante de mémoire, raconte une histoire immense, sans rien écrire.'},{cam:'lid'},{manip:mkTheatre},
  {mem:'maman'},{say:'maman',t:'Où en étions-nous ? Ah oui… le navire.'},
  {say:'alice',t:'Le livre restait ouvert. Elle ne le regardait jamais.'},
  {note:'16 000 vers de mémoire, en 4 soirs.'},{fn:()=>{JR.note=null}},{say:'alice',t:'Quand Papa partait, il laissait son chapeau. Pour que je sache qu’il revenait.'},{memoff:1},{reward:1},{cam:'box'}],
 2:[{cam:'box'},{say:'lieu',t:'Thèbes, en Égypte. Arrive l’écriture : Thot l’offre au roi Thamus. Le roi se méfie.'},{cam:'lid'},{manip:mkThot},
  {mem:'papa'},{say:'papa',t:'Écris tout. Mais ne le laisse pas se souvenir à ta place.'},
  {say:'alice',t:'Il remplissait des carnets entiers. Il n’en relisait jamais aucun.'},{say:'alice',t:'Il disait qu’écrire, c’était déjà retenir. Et que ses carnets, c’était pour plus tard.'},
  {note:'Ce qu’on peut toujours relire, on ne le retient pas.'},{memoff:1},{reward:2},{cam:'box'}],
 3:[{cam:'box'},{say:'lieu',t:'Alexandrie, au bord du delta du Nil. La bibliothèque garde les livres ; le phare guide les bateaux.'},{cam:'lid'},{manip:mkPhares},
  {mem:'phare'},{say:'papa',t:'Si tu te perds… allume tes phares.'},
  {say:'alice',t:'Alors j’en allume un. Ici. Pour qu’il me retrouve.'},
  {note:'Garder l’écriture. Et rallumer sa mémoire.'},{memoff:1},{reward:3},
  {wait:600},{cam:'lid'},{trace:1},{fn:()=>{constelT=1}},{wait:1600},
  {say:'papa',t:'Les Grecs voyaient ce triangle dans le ciel. Ils l\u2019appelaient Deltoton : la lettre Δ. Comme le delta du Nil.'},{say:'alice',t:'Une lettre, oui. Mais posée dans le ciel comme une image, à une place. Même les lettres, on les rangeait dans des lieux.'},{say:'alice',t:'Et chaque étoile gardait quelque chose. Je m\u2019en souviens encore ?'},
  {ask:[0,'La pierre garde…','Un chant retrouvé par sa place','Un chant gravé en lettres','Un chant inventé chaque fois']},
  {ask:[1,'La lyre garde…','16 000 vers rangés dans des lieux','16 000 vers lus sur un rouleau','16 000 vers improvisés le soir']},
  {ask:[2,'Le rouleau scellé garde…','La crainte d’oublier en écrivant','La crainte de perdre les rouleaux','La crainte d’écrire des mensonges']},
  {ask:[3,'La lanterne garde…','Écrire, et rallumer sa mémoire','Tout écrire pour tout garder','Ne plus rien écrire du tout']},
  {fn:()=>{RECAP=3;vegaT=1;sndTone(784,2.4,.12);sndTone(1175,2.4,.06,.25)}},{wait:1400},{say:'alice',t:'Et Alexandrie, au bord du delta, là où l\u2019on a voulu tout écrire. C\u2019est là que j\u2019ai allumé mon phare.'},{fn:()=>{RECAP=-1}},{say:'alice',t:'Thamus avait raison sur le risque. Mais la mémoire, ça se reprend.'},
  {cam:'box'},{fn:()=>{unlock5()}},{wait:1800},{say:'alice',t:'Mais papa ne s\u2019arrêtait jamais à Alexandrie. Il disait que l\u2019histoire continuait… jusqu\u2019à aujourd\u2019hui.'},{fn:()=>{hideSay();next=4;REPLAY.last=3}}]};
// les lieux vécus à la première personne : l'activité et le souvenir se passent dans le lieu même
if(FPM)[0,1,2,3].forEach(n=>{if(!FP_PLACES[n])return;const a=SCRIPTS[n],i=a.findIndex(s=>s.manip);if(i<0)return;a.splice(a[i-1]&&a[i-1].cam==='lid'?i-1:i,a[i-1]&&a[i-1].cam==='lid'?2:1,{fp:n});const r=a.findIndex(s=>s.reward!=null);if(!(a[r+1]&&a[r+1].wait))a.splice(r+1,0,{wait:900})})
let constelT=0,DTG=.016;
let curName=null;function run(name){curName=name;Q=SCRIPTS[name];qi=0;busy=true;step()}
function step(){while(qi<Q.length){const s=Q[qi++];
  if(s.cam){camMode=s.cam;continue}
  if(s.fn){s.fn();continue}
  if(s.mem){Object.assign(TAB,{need:false,rev:false,auto:0,p:0});SCR.kind='mem';SCR.id=s.mem;SCR.ta=1;SCR.t0=performance.now();JR.items=[];JR.note=null;sndPaper(.6,.5);SCR.dio=DIO.ok&&!!POP[s.mem];if(SCR.dio){DIO.start(s.mem,()=>step());return}continue}
  if(s.note&&SCR.dio){if(DIOHID[SCR.id]&&DIO.hid&&!DIO.found){DIO.needFind(s.note);waitTap=false;return}dioNote.textContent=s.note;dioNote.style.opacity=1;showHint('Toucher pour continuer.');waitTap=true;return}
  if(s.note&&PAPER&&SCR.kind==='mem'&&REVEAL[SCR.id]&&!TAB.rev){Object.assign(TAB,{need:true,note:s.note,auto:0,p:0});say.className='hint';sayWho.textContent='';sayTxt.textContent='Tirer la languette.';say.hidden=false;waitTap=true;return}
  if(s.note){JR.noteN=(JR.noteN||0)+1;JR.note={text:s.note,t0:performance.now()};sndPaper(.4,.3);say.className='jr';sayWho.textContent='';sayTxt.textContent='À retenir : '+s.note;say.hidden=false;waitTap=true;return}
  if(s.memoff){if(SCR.dio){SCR.dio=false;SCR.ta=0;SCR.a=0;SCR.kind=null;DIO.close(()=>step());return}SCR.ta=0;continue}
  if(s.reward!=null){const o=KEEPS[s.reward];o.userData.s=1;lit=s.reward+1;continue}
  if(s.lid!=null){openT=s.lid;continue}
  if(s.wait){setTimeout(step,AUTO?s.wait*.4:s.wait);return}
  if(s.say){showLine(s.say,s.t);return}
  if(s.ask){RECAP=s.ask[0];showAsk(s.ask);return}
  if(s.copy){showCopy();return}
  if(s.card){RECAP=s.card[0]<4?s.card[0]:-1;showCard(s.card);return}
  if(s.retry){const miss=[...Array(s.retry).keys()].filter(i=>CARDST[i]===0);if(miss.length)Q.splice(qi,0,{say:'alice',t:'Je reprends celles qui m\u2019échappaient.'},...miss.map(i=>({card:RCARD[i]})));continue}
  if(s.arg){startArg();return}
  if(s.trace){TRACE.on=true;TRACE.t0=performance.now();showHint('Papa me montrait le ciel : « Relie les étoiles. Suis les pointillés. »');return}
  if(s.fp!=null){FPT.start(s.fp,()=>step());return}
  if(s.manip){sndPaper(.45,.4);curManip=s.manip();SCR.kind='manip';SCR.obj=curManip;SCR.ta=1;showHint(curManip.hint);return}}
  busy=false;if(typeof curName==='number'&&curName<3)next=curName+1;Q=[]}
function advance(){if(jWriting()){jFinish();return}if(PAPER&&TAB.need&&!TAB.rev){if(!TAB.auto)TAB.auto=performance.now();return}if(waitTap){waitTap=false;hideSay();step()}}
function manipTick(){if(curManip&&curManip.done){curManip=null;SCR.ta=0;hideSay();setTimeout(step,600)}}
