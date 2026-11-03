/* ---------- les souvenirs d'Alice, peints à la gouache ---------- */
const mkC=()=>{const c=document.createElement('canvas');c.width=c.height=MS;return c};
const SC4=mkC();
{const x=SC4.getContext('2d'),H=MS*.6;
 let g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,'#17195a');g.addColorStop(.45,'#4b3f98');g.addColorStop(.58,'#e9a3a6');g.addColorStop(.6,'#f6c8a0');g.addColorStop(.62,'#3e4f9c');g.addColorStop(1,'#16245a');x.fillStyle=g;x.fillRect(0,0,MS,MS);
 for(let i=0;i<1100;i++){const cy=rnd(0,H);dab(x,rnd(0,MS),cy,rnd(20,46),rnd(6,12),rnd(-.15,.15),rnd(240,275)+cy/H*60,rnd(40,60),rnd(28,50)+cy/H*25,rnd(.15,.3))}
 blob(x,MS*.7,H,220,'rgba(255,205,170,.45)');
 for(let i=0;i<1500;i++){const cy=rnd(H+6,MS),t=(cy-H)/(MS-H);dab(x,rnd(0,MS),cy,rnd(20,50)*(1-t*.3),rnd(4,9),rnd(-.06,.06),rnd(215,235),rnd(45,65),rnd(32,52)-t*12,rnd(.25,.45))}
 // îlot et phare au loin
 x.fillStyle='#2a2f6a';x.beginPath();x.ellipse(560,H+10,70,16,0,0,7);x.fill();
 x.fillStyle='#f4efe6';x.beginPath();x.moveTo(548,H+4);x.lineTo(572,H+4);x.lineTo(567,H-120);x.lineTo(553,H-120);x.closePath();x.fill();
 x.fillStyle='#e0445a';[[H-28,H-48],[H-78,H-96]].forEach(([a,b])=>x.fillRect(551,b,18,a-b));x.fillStyle='#222';x.fillRect(549,H-126,22,6);x.fillStyle='#e0445a';x.beginPath();x.moveTo(546,H-142);x.lineTo(574,H-142);x.lineTo(560,H-160);x.closePath();x.fill();
 // ponton en perspective
 x.fillStyle='#8a5a3a';x.beginPath();x.moveTo(60,MS);x.lineTo(470,MS);x.lineTo(330,H+60);x.lineTo(250,H+60);x.closePath();x.fill();
 for(let k=0;k<14;k++){const t=k/14,y=H+60+(MS-H-60)*t*t;x.strokeStyle='rgba(40,20,20,.45)';x.lineWidth=1+t*3;x.beginPath();x.moveTo(250-190*t*t,y);x.lineTo(330+140*t*t,y);x.stroke()}
 for(let i=0;i<300;i++){const t=Math.random(),y=H+60+(MS-H-60)*t;dab(x,lerp(290,265,0)+rnd(-40-150*t,40+140*t),y,rnd(14,30),rnd(4,7),0,rnd(20,32),55,rnd(35,52),.35)}
 // le père (de dos) montre le phare ; Alice petite lui tient la main
 person(x,{kind:'man',x:318,y:H+86,h:160,view:'back',hat:'#5a3a22',scarf:'#b84a2a',armL:[-18,6],armR:[128,-12],light:'right',col:{body:'#6a4428',skin:'#e8b89a',hair:'#2a1a14',legs:'#5a5236'}});
 person(x,{kind:'girl',x:268,y:H+90,h:73,view:'back',armL:[-18,4],armR:[40,-6],light:'right',col:{body:'#4f8ee8',skin:'#ffe0cf',hair:'#f3c34e',legs:'#ffe0cf',shoes:'#ff9ccc'}})}
// S1 — maman chante une longue histoire, un morceau chaque soir
const SC1=mkC();{const x=SC1.getContext('2d');let g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,'#2a1f55');g.addColorStop(1,'#4a2f5e');x.fillStyle=g;x.fillRect(0,0,MS,MS);
  for(let i=0;i<1400;i++)dab(x,rnd(0,MS),rnd(0,MS),rnd(24,50),rnd(8,14),rnd(-.2,.2),rnd(255,290),rnd(30,45),rnd(22,36),rnd(.2,.35));
  // fenêtre et lune
  x.fillStyle='#16123c';x.fillRect(440,170,170,210);blob(x,540,240,90,'rgba(255,236,190,.35)');x.fillStyle='#fff0c8';x.beginPath();x.arc(540,240,30,0,7);x.fill();x.strokeStyle='#6a4a3a';x.lineWidth=10;x.strokeRect(440,170,170,210);x.beginPath();x.moveTo(525,170);x.lineTo(525,380);x.moveTo(440,275);x.lineTo(610,275);x.stroke();
  // lampe chaude
  blob(x,180,470,200,'rgba(255,190,110,.5)');paintShape(x,c=>{c.beginPath();c.moveTo(158,462);c.quadraticCurveTo(180,452,202,462);c.lineTo(194,436);c.quadraticCurveTo(180,430,166,436);c.closePath()},'#e8a04a',[156,428,48,36],{n:20,edge:false});x.fillStyle='rgba(30,20,30,.9)';x.fillRect(177,462,5,60);x.beginPath();x.ellipse(180,600,30,7,0,0,7);x.fill();x.fillRect(150,522,62,78);
  // le lit en ombre chinoise, Alice petite blottie sous la couverture (seuls ses cheveux attrapent la lumière)
  x.save();x.translate(330,600);x.scale(.75,.75);x.translate(-300,-575);
  x.fillStyle='rgba(18,14,38,.9)';x.beginPath();x.moveTo(300,575);x.lineTo(300,500);x.quadraticCurveTo(310,470,360,468);x.quadraticCurveTo(470,455,560,462);x.quadraticCurveTo(625,466,632,500);x.lineTo(632,575);x.closePath();x.fill();
  x.fillRect(620,420,14,160);x.beginPath();x.arc(627,418,10,0,7);x.fill();
  x.beginPath();x.ellipse(560,452,40,22,-.1,0,7);x.fill();
  x.strokeStyle='rgba(255,200,130,.55)';x.lineWidth=2;x.beginPath();x.moveTo(305,498);x.quadraticCurveTo(312,472,360,469);x.quadraticCurveTo(470,456,555,463);x.stroke();
  x.fillStyle='rgba(243,195,78,.8)';x.beginPath();x.ellipse(548,440,20,13,-.3,0,7);x.fill();x.restore();
  // maman assise au bord du lit, le livre ouvert
  const pm=person(x,{kind:'woman',x:262,y:600,h:184,view:'back',seated:true,armL:[72,-8],armR:[86,-22],light:'left',glow:'rgba(255,190,110,.55)',col:{body:'#6a3a5a',skin:'#e8b89a',hair:'#3a2018'}});
  // le livre ouvert, tenu à deux mains, éclairé par la lampe
  const bx=pm.hl&&pm.hr?(pm.hl[0]+pm.hr[0])/2:300,by=pm.hl&&pm.hr?(pm.hl[1]+pm.hr[1])/2-4:440;x.save();x.translate(bx,by);x.rotate(-.12);x.scale(.7,.7);blob(x,0,0,70,'rgba(255,220,160,.35)');
  [-1,1].forEach(k=>{x.fillStyle='#f4e6c4';x.beginPath();x.moveTo(0,-14);x.quadraticCurveTo(k*16,-20,k*32,-15);x.lineTo(k*31,14);x.quadraticCurveTo(k*16,9,0,15);x.closePath();x.fill();
    x.strokeStyle='rgba(120,90,60,.45)';x.lineWidth=1;for(let l=-8;l<10;l+=4){x.beginPath();x.moveTo(k*5,l);x.lineTo(k*26,l-2);x.stroke()}});
  x.strokeStyle='rgba(90,60,40,.8)';x.lineWidth=1.5;x.beginPath();x.moveTo(0,-14);x.lineTo(0,15);x.stroke();x.restore();
  [pm.hl,pm.hr].forEach(h=>{if(!h)return;x.fillStyle='rgba(18,14,38,.92)';x.beginPath();x.ellipse(h[0],h[1],8,6,.3,0,7);x.fill()})}
// S2 — papa offre à Alice son premier carnet
const SC2=mkC();{const x=SC2.getContext('2d');let g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,'#3a2418');g.addColorStop(1,'#5a3a24');x.fillStyle=g;x.fillRect(0,0,MS,MS);
  for(let r=0;r<4;r++)for(let i=0;i<14;i++){const h=rnd(50,80);x.fillStyle=hsl(rnd(0,40),rnd(30,60),rnd(25,45));x.fillRect(120+i*38,150+r*95+(80-h),30,h)}
  for(let r=0;r<4;r++){x.fillStyle='#2a180e';x.fillRect(110,232+r*95,560,10)}
  for(let i=0;i<900;i++)dab(x,rnd(0,MS),rnd(0,MS),rnd(20,40),rnd(6,12),rnd(-.2,.2),rnd(20,35),rnd(30,50),rnd(22,38),rnd(.12,.25));
  blob(x,520,420,260,'rgba(255,200,120,.45)');x.fillStyle='#4a2c18';x.fillRect(160,520,480,30);x.fillRect(190,550,20,120);x.fillRect(590,550,20,120);
  x.fillStyle='#e8a04a';x.beginPath();x.moveTo(510,470);x.lineTo(570,470);x.lineTo(556,440);x.lineTo(524,440);x.closePath();x.fill();x.fillStyle='#3a2414';x.fillRect(536,470,8,50);
  // papa (de dos) tend le carnet rouge ; Alice petite, de face, tend les bras
  const pp=person(x,{kind:'man',x:290,y:640,h:224,view:'back',hat:'#5a3a22',scarf:'#b84a2a',armL:[-18,6],armR:[62,28],light:'right',glow:'rgba(255,200,120,.5)',col:{body:'#7a5030',skin:'#e8b89a',hair:'#2a1a14',legs:'#6a6040'}});
  person(x,{kind:'girl',x:452,y:650,h:102,view:'front',armL:[-118,10],armR:[18,-4],light:'left',glow:'rgba(255,200,120,.5)',col:{body:'#4f8ee8',skin:'#ffe0cf',hair:'#f3c34e',legs:'#ffe0cf',shoes:'#ff9ccc'}});
  if(pp.hr){x.save();x.translate(pp.hr[0]+10,pp.hr[1]-4);x.rotate(-.2);x.fillStyle='#c8323c';x.fillRect(-20,-14,40,28);x.fillStyle='#ffd27a';x.fillRect(-20,-2,40,3);x.restore()}}
// S3 — sous une voûte de pierre, les parents chantent pour faire entendre l'écho
const SC3=mkC();{const x=SC3.getContext('2d');let g=x.createLinearGradient(0,0,0,MS);g.addColorStop(0,'#cdb79a');g.addColorStop(1,'#7a6a5a');x.fillStyle=g;x.fillRect(0,0,MS,MS);
  for(let i=0;i<1500;i++)dab(x,rnd(0,MS),rnd(0,MS),rnd(20,44),rnd(8,14),rnd(-.3,.3),rnd(28,40),rnd(15,30),rnd(55,75),rnd(.2,.35));
  [180,384,588].forEach(cx=>{x.fillStyle='rgba(90,70,60,.5)';x.beginPath();x.moveTo(cx-90,MS);x.lineTo(cx-90,300);x.arc(cx,300,90,Math.PI,0);x.lineTo(cx+90,MS);x.lineTo(cx+70,MS);x.lineTo(cx+70,300);x.arc(cx,300,70,0,Math.PI,true);x.lineTo(cx-70,MS);x.closePath();x.fill()});
  blob(x,384,175,120,'rgba(255,240,200,.5)');{const win=c=>{c.beginPath();c.moveTo(352,240);c.lineTo(352,160);c.arc(384,160,32,Math.PI,0);c.lineTo(416,240);c.closePath()};paintShape(x,win,'#fff0c8',[350,126,68,116],{ang:Math.PI/2,n:40,edge:'rgba(90,70,60,.6)',lw:4});x.strokeStyle='rgba(90,70,60,.7)';x.lineWidth=4;x.beginPath();x.moveTo(384,128);x.lineTo(384,240);x.moveTo(352,190);x.lineTo(416,190);x.stroke()}
  for(let k=0;k<5;k++){x.fillStyle=`rgba(255,240,200,${.12-k*.015})`;x.beginPath();x.moveTo(356,238);x.lineTo(412,238);x.lineTo(470+k*30,MS);x.lineTo(300-k*30,MS);x.closePath();x.fill()}
  person(x,{kind:'man',x:318,y:660,h:156,view:'back',hat:'#5a3a22',scarf:'#b84a2a',armL:[-18,6],armR:[28,0],light:'right',glow:'rgba(255,240,200,.45)',col:{body:'#6a4428',skin:'#e8b89a',hair:'#2a1a14',legs:'#5a5236'}});
  person(x,{kind:'woman',x:452,y:660,h:144,view:'back',tilt:-6,armL:[-28,0],armR:[18,-4],light:'left',glow:'rgba(255,240,200,.45)',col:{body:'#4a2c48',skin:'#e8b89a',hair:'#3a2018',legs:'#2a1a26'}});
  person(x,{kind:'girl',x:386,y:664,h:73,view:'back',armL:[-42,0],armR:[42,0],light:'right',glow:'rgba(255,240,200,.45)',col:{body:'#4f8ee8',skin:'#ffe0cf',hair:'#f3c34e',legs:'#ffe0cf',shoes:'#ff9ccc'}});}
const NOTES=[...Array(9)].map((_,i)=>({x:rnd(260,520),p:rnd(0,1),s:rnd(.7,1.2)}));
function drawNote(c,x,y,s,a){c.save();c.globalAlpha=a;c.fillStyle='#ffe6a0';c.strokeStyle='#ffe6a0';c.lineWidth=3*s;c.beginPath();c.ellipse(x,y,9*s,7*s,-.4,0,7);c.fill();c.beginPath();c.moveTo(x+8*s,y);c.lineTo(x+8*s,y-30*s);c.quadraticCurveTo(x+18*s,y-22*s,x+20*s,y-12*s);c.stroke();c.restore()}
const SCENES={
  maman:{bg:SC1,anim:(c,T)=>{c.save();c.globalCompositeOperation='lighter';blob(c,250,315,60+6*Math.sin(T*7),'rgba(255,200,120,.35)');c.restore();NOTES.slice(0,5).forEach((n,i)=>{const k=(T*.12+n.p)%1;drawNote(c,280+i*40+Math.sin(T+i)*10,420-k*240,n.s*.9,Math.sin(k*Math.PI)*.85)})}},
  papa:{bg:SC2,anim:(c,T)=>{c.save();c.globalCompositeOperation='lighter';blob(c,540,455,70+6*Math.sin(T*6),'rgba(255,200,120,.35)');for(let i=0;i<20;i++){const k=(T*.05+i*.13)%1;c.fillStyle=`rgba(255,230,180,${.4*Math.sin(k*Math.PI)})`;c.fillRect(420+Math.sin(i*7)*120,600-k*300,2,2)}c.restore()}},
  echo:{bg:SC3,anim:(c,T)=>{NOTES.forEach((n,i)=>{const k=(T*.1+n.p)%1;drawNote(c,n.x+Math.sin(T*.8+i)*14,560-k*420,n.s,Math.sin(k*Math.PI)*.9)});c.save();c.strokeStyle='rgba(255,240,200,.35)';c.lineWidth=2;for(let r=0;r<3;r++){const k=(T*.3+r/3)%1;c.globalAlpha=1-k;c.beginPath();c.arc(384,520,40+k*260,Math.PI*1.1,Math.PI*1.9);c.stroke()}c.restore()}},
  phare:{bg:SC4,anim:(c,T)=>{const H=MS*.6,ang=T*.9,L=[560,H-131],cc=Math.cos(ang),w=Math.abs(cc),dir=cc>0?1:-1;c.save();c.globalCompositeOperation='lighter';const gg=c.createLinearGradient(L[0],L[1],L[0]+dir*420,L[1]);gg.addColorStop(0,`rgba(255,240,180,${.55*w})`);gg.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=gg;
    c.beginPath();c.moveTo(L[0],L[1]);c.lineTo(L[0]+dir*420*w,L[1]-60*w);c.lineTo(L[0]+dir*420*w,L[1]+50*w);c.closePath();c.fill();blob(c,L[0],L[1],30+10*w,`rgba(255,236,170,${.6+.3*w})`);
    for(let k=0;k<26;k++){const y=H+12+k*9,s=Math.sin(T*3+k*1.7);if(s>.2){c.fillStyle=`rgba(255,230,170,${.5*s})`;c.fillRect(546+Math.sin(k*3.1)*16,y,10+k*.6,2)}}c.restore()}}};
