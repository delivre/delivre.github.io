const PAPER=!/plastique/.test(location.hash);let GLOSS=false;
// meilleure précision de profondeur sur mobile (évite les liserés qui scintillent)
camera.near=.6;camera.far=120;camera.updateProjectionMatrix();
/* ---------- reflets : un petit environnement lumineux pour que le plastique brille ---------- */
{const pm=new THREE.PMREMGenerator(renderer),env=new THREE.Scene();const g=new THREE.SphereGeometry(20,32,16);
 const c=document.createElement('canvas');c.width=16;c.height=256;const x=c.getContext('2d'),gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#fff6ee');gr.addColorStop(.45,'#c9b8ff');gr.addColorStop(1,'#1a1430');x.fillStyle=gr;x.fillRect(0,0,16,256);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;env.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide})));
 const panel=new THREE.Mesh(new THREE.PlaneGeometry(14,8),new THREE.MeshBasicMaterial({color:0xffffff}));panel.position.set(-6,12,6);panel.lookAt(0,0,0);env.add(panel);
 scene.environment=pm.fromScene(env,.04).texture}

/* ---------- lumière : une lampe douce en haut à gauche, un ciel violet, un contre-jour chaud ---------- */
const HEMI=new THREE.HemisphereLight(0xfff4ea,0x3a2a50,.55);scene.add(HEMI);
const sun=new THREE.DirectionalLight(0xfff1dc,1.9);sun.position.set(-8,16,9);sun.castShadow=true;sun.shadow.mapSize.set(LOW?1024:2048,LOW?1024:2048);sun.shadow.radius=6;sun.shadow.bias=-.0004;
Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:1,far:60});scene.add(sun);
const rim=new THREE.DirectionalLight(0xffc0e0,.45);rim.position.set(7,6,-10);scene.add(rim);
if(PAPER){// début de soirée : soleil orangé et rasant, longues ombres, contre-jour chaud qui fait briller les bords du papier
 sun.color.set(0xffb070);sun.intensity=2.3;sun.position.set(-15,6.5,5);sun.shadow.radius=4;HEMI.color.set(0xffd2a8);HEMI.groundColor.set(0x3a2846);HEMI.intensity=.5;rim.color.set(0xff9858);rim.intensity=1.0;rim.position.set(10,4,-12)}

/* ---------- matières : du plastique verni ---------- */
// le papier : une fibre fine, qui accroche la lumière rasante
const FIB=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#808080';x.fillRect(0,0,256,256);
 for(let i=0;i<5000;i++){const v=110+Math.random()*40|0;x.fillStyle=`rgb(${v},${v},${v})`;x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*2,1)}
 for(let i=0;i<260;i++){const v=Math.random()<.5?90:170;x.strokeStyle=`rgba(${v},${v},${v},.5)`;x.lineWidth=.6;x.beginPath();const px=Math.random()*256,py=Math.random()*256,a=Math.random()*6.3,l=4+Math.random()*10;x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t})();
const plastic=(color,o={})=>{if(!PAPER||GLOSS)return new THREE.MeshPhysicalMaterial(Object.assign({color:new THREE.Color(color).convertSRGBToLinear(),roughness:.38,metalness:0,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:.45},o));
 const c=new THREE.Color(color),h={};c.getHSL(h);c.setHSL(h.h,h.s*.78,Math.min(.92,h.l*.96+.02));const q=Object.assign({},o);delete q.clearcoat;delete q.clearcoatRoughness;delete q.metalness;delete q.roughness;delete q.envMapIntensity;
 return new THREE.MeshStandardMaterial(Object.assign({color:c.convertSRGBToLinear(),roughness:.93,metalness:0,flatShading:true,bumpMap:FIB,bumpScale:.012,envMapIntensity:.12},q))};
const M={lilac:plastic('#b9a6ff'),lilacD:plastic('#8f7be8'),pink:plastic('#ff8cc6'),gold:plastic('#ffcf5a',{metalness:.35,roughness:.3}),green:plastic('#3ed07a'),green2:plastic('#7fe04a'),aqua:plastic('#43d9cf'),
  white:plastic('#fbf8ff'),red:plastic('#f0414f'),yellow:plastic('#ffd23f'),brown:plastic('#b06a34',{roughness:.5}),skin:plastic('#f7bf9c',{roughness:.45,clearcoat:.6}),hair:plastic('#4a2c1c',{roughness:.42}),
  blue:plastic('#3b8cff'),jean:plastic('#3a5cc0'),black:plastic('#262a36'),cream:plastic('#fff1d6'),rock:plastic('#a99cf0',{roughness:.55,clearcoat:.4}),wood:plastic('#c9823e',{roughness:.55,clearcoat:.5})};
const mesh=(g,m,cast=true,recv=true)=>{const o=new THREE.Mesh(g,m);o.castShadow=cast;o.receiveShadow=recv;return o};
const at=(o,x,y,z)=>{o.position.set(x,y,z);return o};

