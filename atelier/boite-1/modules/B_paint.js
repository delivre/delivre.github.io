const rnd=(a=0,b=1)=>a+Math.random()*(b-a);
const hsl=(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`;
function canvasTex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}return t}
function hslOf(hex){const o={};new THREE.Color(hex).getHSL(o);return [o.h*360,o.s*100,o.l*100]}
// un coup de pinceau : une tache allongée + quelques poils plus clairs ou plus sombres
function dab(x,cx,cy,len,wid,ang,h,s,l,a){x.save();x.translate(cx,cy);x.rotate(ang);
  x.fillStyle=hsl(h,s,l,a*.75);x.beginPath();x.ellipse(0,0,len/2,wid/2,0,0,7);x.fill();
  x.lineCap='round';const n=3+(wid/4|0);for(let i=0;i<n;i++){const o=(i/(n-1)-.5)*wid*.85;x.strokeStyle=hsl(h+rnd(-5,5),s,l+rnd(-9,9),a*.7);x.lineWidth=Math.max(1,wid/n*.8);
    x.beginPath();x.moveTo(-len/2*rnd(.55,.95),o);x.quadraticCurveTo(0,o+rnd(-wid*.2,wid*.2),len/2*rnd(.55,.95),o+rnd(-wid*.1,wid*.1));x.stroke()}
  x.restore()}
function blob(x,cx,cy,r,col){const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col);g.addColorStop(1,col.replace(/[\d.]+\)$/,'0)'));x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()}
function leafTex(hex,pine){const [H,S,L]=hslOf(hex);return canvasTex(512,256,(x,W,Hh)=>{
  const g=x.createLinearGradient(0,0,0,Hh);g.addColorStop(0,hsl(H-12,S,Math.min(88,L+16)));g.addColorStop(.55,hsl(H,S,L));g.addColorStop(1,hsl(H+12,S*.8,L-20));x.fillStyle=g;x.fillRect(0,0,W,Hh);
  for(let i=0;i<2200;i++){const cy=rnd(0,Hh),t=cy/Hh,cx=rnd(0,W);
    if(pine)dab(x,cx,cy,rnd(16,28),rnd(4,7),Math.PI/2+rnd(-.35,.35),H+rnd(-10,10),S*.9,L+18-t*38+rnd(-6,6),rnd(.35,.6));
    else{dab(x,cx,cy,rnd(10,20),rnd(6,10),rnd(-1,1),H+rnd(-12,12)-(1-t)*10,S*rnd(.8,1),L+20-t*40+rnd(-6,6),rnd(.35,.6))}}
  for(let i=0;i<120;i++){const cx=rnd(0,W),cy=rnd(0,Hh*.35);x.fillStyle=hsl(55,90,92,.5);x.beginPath();x.ellipse(cx,cy,rnd(3,6),rnd(1.5,3),rnd(0,3),0,7);x.fill()}})}

// --- rochers : pierre lilas mouchetée ---
const PAINT=[];
const painted=(hex,map,o={})=>{const m=plastic(hex,Object.assign({clearcoatRoughness:.22},o));PAINT.push({m,map,plain:m.color.clone()});return m};
let PAINTED=true;function applyPaint(){PAINT.forEach(p=>{p.m.map=PAINTED?p.map:null;p.m.color.copy(PAINTED?new THREE.Color(1,1,1):p.plain);p.m.needsUpdate=true})}
