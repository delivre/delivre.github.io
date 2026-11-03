/* ---------- Alice dessinée par elle-même : un petit personnage chibi, comme dans la marge d'un cahier ---------- */
function chibi(x,{x:cx,y:gy,h,view='front',armL=[-25,0],armR=[25,0],eyes='open'}){const R=h*.24,hy=gy-h+R,nY=hy+R*.92,dB=gy-h*.17;
  const arm=(sx,a)=>{const r1=Math.PI/180*a[0],r2=Math.PI/180*(a[0]+a[1]),l=h*.2;const ex=sx+Math.sin(r1)*l,ey=nY+h*.05+Math.cos(r1)*l,hx=ex+Math.sin(r2)*l*.8,hy2=ey+Math.cos(r2)*l*.8;
    x.strokeStyle='#ffe3d4';x.lineCap='round';x.lineWidth=h*.075;x.beginPath();x.moveTo(sx,nY+h*.05);x.lineTo(ex,ey);x.lineTo(hx,hy2);x.stroke();return[hx,hy2]};
  const back=view==='back';
  if(back){fp(x,'#f3c34e',c=>{c.moveTo(cx-R*1.05,hy);c.quadraticCurveTo(cx-R*1.25,nY+R*.8,cx-R*.8,nY+R*1.05);c.lineTo(cx+R*.8,nY+R*1.05);c.quadraticCurveTo(cx+R*1.25,nY+R*.8,cx+R*1.05,hy);c.closePath()})}
  const hl=arm(cx-h*.1,armL),hr=arm(cx+h*.1,armR);
  // jambes et chaussures
  [-1,1].forEach(k=>{fp(x,'#ffe3d4',c=>rrect(c,cx+k*h*.07-h*.032,dB-2,h*.064,gy-dB-h*.03,h*.03));fp(x,'#ff9ccc',c=>c.ellipse(cx+k*h*.075,gy-h*.025,h*.055,h*.03,0,0,7))});
  // la robe bleue, simple
  fp(x,'#4a86e0',c=>{c.moveTo(cx-h*.1,nY);c.quadraticCurveTo(cx,nY-h*.02,cx+h*.1,nY);c.lineTo(cx+h*.21,dB);c.quadraticCurveTo(cx,dB+h*.035,cx-h*.21,dB);c.closePath()});
  if(!back)fp(x,'#fffaf0',c=>{c.moveTo(cx-h*.06,nY+1);c.quadraticCurveTo(cx,nY+h*.05,cx+h*.06,nY+1);c.closePath()});
  // la tête
  fp(x,'#ffe3d4',c=>c.ellipse(cx,hy,R,R*.95,0,0,7));
  if(back){fp(x,'#f3c34e',c=>c.ellipse(cx,hy-R*.02,R*1.06,R*1.02,0,0,7));fp(x,'#d9a43a',c=>{c.ellipse(cx+R*.55,hy-R*.6,R*.16,R*.08,-.5,0,7)})}
  else{fp(x,'#f3c34e',c=>{c.moveTo(cx-R*1.08,hy+R*.9);c.quadraticCurveTo(cx-R*1.25,hy-R*1.25,cx,hy-R*1.08);c.quadraticCurveTo(cx+R*1.25,hy-R*1.25,cx+R*1.08,hy+R*.9);c.lineTo(cx+R*.82,hy+R*.95);c.quadraticCurveTo(cx+R*.85,hy-R*.1,cx+R*.6,hy-R*.35);
      for(let k=0;k<5;k++){const u=cx+R*.6-k*R*.3;c.quadraticCurveTo(u-R*.12,hy-R*.1,u-R*.3,hy-R*.38)}c.quadraticCurveTo(cx-R*.85,hy-R*.1,cx-R*.82,hy+R*.95);c.closePath()});
    fp(x,'#ffd27a',c=>{c.rect(cx-R*.78,hy-R*.62,R*.32,R*.07)});
    if(eyes==='closed'){x.strokeStyle='#2a1a2a';x.lineWidth=R*.08;x.lineCap='round';[-1,1].forEach(k=>{x.beginPath();x.arc(cx+k*R*.36,hy+R*.12,R*.15,.3,Math.PI-.3);x.stroke()})}
    else[-1,1].forEach(k=>{fp(x,'#1d2a5a',c=>c.ellipse(cx+k*R*.36,hy+R*.15,R*.12,R*.18,0,0,7));fp(x,'#fff',c=>c.arc(cx+k*R*.36-R*.04,hy+R*.08,R*.05,0,7))});
    [-1,1].forEach(k=>fp(x,'rgba(255,140,150,.55)',c=>c.ellipse(cx+k*R*.62,hy+R*.42,R*.15,R*.08,0,0,7)));x.strokeStyle='#8a3a3a';x.lineWidth=R*.06;x.beginPath();x.moveTo(cx-R*.08,hy+R*.55);x.lineTo(cx+R*.08,hy+R*.55);x.stroke()}
  return{hl,hr}}
