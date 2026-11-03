/* ---------- personnages peints : de vraies silhouettes, puis passées à la gouache ---------- */
// limb : un membre effilé qui passe par plusieurs articulations (épaule → coude → poignet)
function limb(c,pts,ws){for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]],[wa,wb]=[ws[i],ws[i+1]];const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
  c.beginPath();c.moveTo(a[0]+nx*wa/2,a[1]+ny*wa/2);c.lineTo(b[0]+nx*wb/2,b[1]+ny*wb/2);c.lineTo(b[0]-nx*wb/2,b[1]-ny*wb/2);c.lineTo(a[0]-nx*wa/2,a[1]-ny*wa/2);c.closePath();c.fill()}
  pts.forEach((p,i)=>{c.beginPath();c.arc(p[0],p[1],ws[i]/2,0,7);c.fill()})}
const rad=d=>d*Math.PI/180;
// angle 0 = bras le long du corps ; positif = vers la droite de l'image
const armPts=(sx,sy,ua,la,len,ang,bend)=>{const e=[sx+Math.sin(rad(ang))*ua*len,sy+Math.cos(rad(ang))*ua*len];const a2=ang+bend;return[[sx,sy],e,[e[0]+Math.sin(rad(a2))*la*len,e[1]+Math.cos(rad(a2))*la*len]]};
/* spec : {kind:'man'|'woman'|'girl', x, y (sol), h, view:'back'|'front', seated, armL:[angle,coude], armR, tilt, col:{body,skin,hair,dress,legs,shoes}, light:'left'|'right', glow} */
function person(ctx,s){const H=s.h,S=Math.ceil(H*1.6),o=document.createElement('canvas');o.width=o.height=S;const c=o.getContext('2d');const cx=S/2,gy=S*.92;
  const child=s.kind==='girl',hr=H*(child?.105:.072),sw=H*(child?.15:s.kind==='man'?.19:.16),hw=H*(child?.12:s.kind==='man'?.13:.15);
  const headY=gy-H+hr,neckY=headY+hr*1.15,shY=neckY+H*.035,waistY=gy-H*(child?.47:.52),hipY=gy-H*(child?.4:.46),kneeY=gy-H*.24;
  const tilt=s.tilt||0,col=s.col;c.save();c.translate(cx,gy);c.rotate(rad(tilt*.3));c.translate(-cx,-gy);
  // jambes
  c.fillStyle=col.legs||col.body;if(!s.seated){[-1,1].forEach(k=>limb(c,[[cx+k*hw*.45,hipY],[cx+k*hw*.42,kneeY],[cx+k*hw*.38,gy-H*.03]],[H*(child?.06:.075),H*.055,H*.04]));
    c.fillStyle=col.shoes||'#1a1420';[-1,1].forEach(k=>{c.beginPath();c.ellipse(cx+k*hw*.38,gy-H*.015,H*.04,H*.022,0,0,7);c.fill()})}
  // bras (derrière le corps quand vu de dos, devant sinon)
  const drawArm=(k,a)=>{if(!a)return;const sx=cx+k*sw*.5,sy=shY+H*.015;c.fillStyle=col.body;const p=armPts(sx,sy,.5,.48,H*(child?.32:.36),a[0],a[1]);limb(c,p.slice(0,2),[H*.06,H*.05]);c.fillStyle=col.sleeve||col.body;limb(c,p.slice(1),[H*.05,H*.038]);c.fillStyle=col.skin;c.beginPath();c.arc(p[2][0],p[2][1],H*.024,0,7);c.fill();return p[2]};
  // torse / manteau / robe
  c.fillStyle=col.body;c.beginPath();c.moveTo(cx-sw*.5,shY);c.quadraticCurveTo(cx-sw*.62,shY+H*.04,cx-sw*.42,waistY);
  if(s.kind==='man'){c.lineTo(cx-hw*.62,gy-H*(s.seated?.3:.22));c.lineTo(cx+hw*.62,gy-H*(s.seated?.3:.22))}
  else if(s.kind==='woman'){c.quadraticCurveTo(cx-hw*.9,gy-H*.25,cx-hw*1.05,gy-H*(s.seated?.28:.1));c.lineTo(cx+hw*1.05,gy-H*(s.seated?.28:.1));c.quadraticCurveTo(cx+hw*.9,gy-H*.25,cx+sw*.42,waistY)}
  else{c.quadraticCurveTo(cx-hw*.8,gy-H*.32,cx-hw*1.25,gy-H*.2);c.lineTo(cx+hw*1.25,gy-H*.2);c.quadraticCurveTo(cx+hw*.8,gy-H*.32,cx+sw*.42,waistY)}
  c.lineTo(cx+sw*.42,waistY);c.quadraticCurveTo(cx+sw*.62,shY+H*.04,cx+sw*.5,shY);c.quadraticCurveTo(cx,shY-H*.03,cx-sw*.5,shY);c.fill();
  if(col.dress&&!child){c.fillStyle=col.dress;c.globalAlpha=.6;c.fillRect(cx-sw*.4,waistY-H*.01,sw*.8,H*.02);c.globalAlpha=1}
  const hl=drawArm(-1,s.armL),hrp=drawArm(1,s.armR);
  // cou et tête
  c.fillStyle=col.skin;c.fillRect(cx-H*.022,neckY-hr*.3,H*.044,shY-neckY+hr*.4);c.beginPath();c.ellipse(cx,headY,hr*.92,hr,0,0,7);c.fill();
  c.fillStyle=col.hair;
  if(s.view==='back'){c.beginPath();c.ellipse(cx,headY-hr*.05,hr*.98,hr*1.04,0,0,7);c.fill()}else{c.beginPath();c.ellipse(cx,headY-hr*.3,hr,hr*.78,0,Math.PI,0);c.fill()}
  if(s.kind==='woman'){c.beginPath();c.arc(cx+hr*.15,headY-hr*.9,hr*.55,0,7);c.fill()}
  // l'aventurier : chapeau à bords, sacoche de cuir en bandoulière, foulard
  if(s.hat){c.fillStyle=s.hat;c.beginPath();c.ellipse(cx,headY-hr*.45,hr*1.75,hr*.32,0,0,7);c.fill();c.beginPath();c.moveTo(cx-hr*.95,headY-hr*.5);c.quadraticCurveTo(cx-hr*1.0,headY-hr*1.55,cx,headY-hr*1.4);c.quadraticCurveTo(cx+hr*1.0,headY-hr*1.55,cx+hr*.95,headY-hr*.5);c.closePath();c.fill();
    c.fillStyle='rgba(30,15,8,.7)';c.fillRect(cx-hr*.95,headY-hr*.72,hr*1.9,hr*.18)}
  if(s.bag){c.strokeStyle=s.bag;c.lineWidth=H*.018;c.beginPath();c.moveTo(cx-sw*.42,shY);c.lineTo(cx+hw*.75,hipY-H*.02);c.stroke();c.fillStyle=s.bag;c.beginPath();c.roundRect?c.roundRect(cx+hw*.45,hipY-H*.05,H*.12,H*.09,H*.015):c.rect(cx+hw*.45,hipY-H*.05,H*.12,H*.09);c.fill()}
  if(s.scarf){c.fillStyle=s.scarf;c.beginPath();c.ellipse(cx,shY-H*.005,sw*.32,H*.022,0,0,7);c.fill()}
  if(child){c.beginPath();c.moveTo(cx-hr,headY-hr*.2);c.quadraticCurveTo(cx-hr*1.3,headY+hr*1.5,cx-hr*.7,headY+hr*2.2);c.lineTo(cx+hr*.7,headY+hr*2.2);c.quadraticCurveTo(cx+hr*1.3,headY+hr*1.5,cx+hr,headY-hr*.2);c.closePath();if(s.view==='back')c.fill();else{c.save();c.globalCompositeOperation='destination-over';c.fill();c.restore()}
    c.fillStyle='#ffffff';[-1,1].forEach(k=>{c.fillRect(cx+k*hw*.38-H*.022,gy-H*.17,H*.044,H*.1)})}
  c.restore();
  // passage à la gouache : touches de couleur, lumière d'un côté, ombre de l'autre
  // silhouette à contre-jour : presque noire, la couleur d'Alice affleure à peine, un fil de lumière sur un bord
  if(s.raw){ctx.drawImage(o,s.x-cx,s.y-gy);return{hl:hl&&[hl[0]+s.x-cx,hl[1]+s.y-gy],hr:hrp&&[hrp[0]+s.x-cx,hrp[1]+s.y-gy]}}
  // peinte à la main : la silhouette est repeinte coup de pinceau par coup de pinceau, les bords s'effilochent
  const L=s.light==='right'?1:-1,id=c.getImageData(0,0,S,S).data,inside=[];
  for(let y=0;y<S;y+=2)for(let x=0;x<S;x+=2){if(id[(y*S+x)*4+3]>110)inside.push(x,y)}
  const P=document.createElement('canvas');P.width=P.height=S;const pc=P.getContext('2d');pc.lineCap='round';
  const n=inside.length/2,N=Math.min(4000,Math.round(n*.9)),off=Math.max(2,H*.018);
  for(let k=0;k<N;k++){const q=(Math.random()*n|0)*2,x=inside[q],y=inside[q+1],o4=(y*S+x)*4;
    const r=id[o4],g=id[o4+1],b=id[o4+2],mix=.16;const cr=18+(r-18)*mix|0,cg=14+(g-14)*mix|0,cb=36+(b-36)*mix|0;
    pc.save();pc.translate(x+rnd(-1,1),y+rnd(-1,1));pc.rotate(Math.PI/2+rnd(-.5,.5));pc.fillStyle=`rgba(${cr},${cg},${cb},${rnd(.45,.8)})`;pc.beginPath();pc.ellipse(0,0,rnd(H*.025,H*.06),rnd(H*.008,H*.02),0,0,7);pc.fill();pc.restore()}
  // un fil de lumière du côté de la lampe, lui aussi au pinceau
  const lc=s.glow?s.glow.replace(/[\d.]+\)$/,''):'rgba(255,220,170,';
  for(let k=0;k<n;k+=2){const q=k*2,x=inside[q],y=inside[q+1],xo=Math.round(x+L*off);if(xo<0||xo>=S||id[(y*S+xo)*4+3]<60){if(Math.random()<.55){pc.fillStyle=lc+rnd(.35,.8)+')';pc.beginPath();pc.ellipse(x+L*rnd(0,1.5),y,rnd(.8,1.8),rnd(1.5,3.5),0,0,7);pc.fill()}}}
  ctx.save();ctx.filter=`blur(${Math.max(.4,H*.003)}px)`;ctx.drawImage(P,s.x-cx,s.y-gy);ctx.restore();return{hl:hl&&[hl[0]+s.x-cx,hl[1]+s.y-gy],hr:hrp&&[hrp[0]+s.x-cx,hrp[1]+s.y-gy]}}
// une forme peinte : remplissage + touches + lumière + bord
function paintShape(c,path,col,box,o={}){c.save();path(c);c.fillStyle=col;c.fill();c.clip();const[x,y,w,h]=box,[H0,S0,L0]=hslOf(col);
  for(let i=0;i<(o.n||Math.max(30,w*h/250));i++)dab(c,rnd(x,x+w),rnd(y,y+h),rnd(8,Math.max(10,w/6)),rnd(4,10),o.ang!=null?o.ang+rnd(-.2,.2):rnd(-.6,.6),H0+rnd(-8,8),S0,L0+rnd(-12,12),rnd(.2,.4));
  const g=c.createLinearGradient(x,y,x+w*.6,y+h);g.addColorStop(0,'rgba(255,240,210,.28)');g.addColorStop(1,'rgba(20,10,30,.28)');c.fillStyle=g;c.fillRect(x,y,w,h);c.restore();
  if(o.edge!==false){c.save();path(c);c.strokeStyle=o.edge||'rgba(40,20,20,.45)';c.lineWidth=o.lw||2;c.stroke();c.restore()}}
const sprite=(w,h,fn)=>{const o=document.createElement('canvas');o.width=w;o.height=h;fn(o.getContext('2d'),w,h);return o};
