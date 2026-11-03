/* ---------- l'effet miniature : flou horizontal + vertical, bande nette mobile ---------- */
const KUWA={uniforms:{tDiffuse:{value:null},res:{value:new THREE.Vector2(1,1)},st:{value:1},T:{value:0}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 res;uniform float st;varying vec2 vUv;
 vec4 q(vec2 o,vec2 px){vec3 m=vec3(0.),s=vec3(0.);for(int j=0;j<3;j++)for(int i=0;i<3;i++){vec3 c=texture2D(tDiffuse,vUv+vec2(float(i)*o.x,float(j)*o.y)*px).rgb;m+=c;s+=c*c;}m/=9.;s=abs(s/9.-m*m);return vec4(m,s.r+s.g+s.b);}
 float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec2 px=st/res;vec4 a=q(vec2(-1.,-1.),px),b=q(vec2(1.,-1.),px),c=q(vec2(-1.,1.),px),d=q(vec2(1.,1.),px);
  vec4 r=a;if(b.w<r.w)r=b;if(c.w<r.w)r=c;if(d.w<r.w)r=d;
  float g=hash(floor(vUv*res/(st*1.5)))*.05-.025;float f=hash(floor(vUv*res/(st*6.)))*.03-.015;
  float lu=dot(r.rgb,vec3(.3,.59,.11));gl_FragColor=vec4(r.rgb+(g+f)*smoothstep(.05,.3,lu),1.);}`};
let composer,hPass,vPass,kPass;
function setupPost(){composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,camera));kPass=new THREE.ShaderPass(KUWA);
  hPass=new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);vPass=new THREE.ShaderPass(THREE.VerticalTiltShiftShader);[hPass,vPass].forEach(p=>{p.material.fragmentShader=p.material.fragmentShader.replace(/abs\(\s*r\s*-\s*vUv\.y\s*\)/g,'max(0.0,abs(r - vUv.y)-0.08)');p.material.needsUpdate=true});composer.addPass(hPass);composer.addPass(vPass);
  if(PAPER){// un voile de papier calque sur les bords flous : la profondeur devient de la brume de papier
   const HZ={uniforms:{tDiffuse:{value:null},r:vPass.uniforms.r},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform sampler2D tDiffuse;uniform float r;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);float k=smoothstep(.18,.55,abs(r-vUv.y))*.24;gl_FragColor=vec4(mix(c.rgb,vec3(.96,.92,.84),k),c.a);}'};
   composer.addPass(new THREE.ShaderPass(HZ))}}
setupPost();
const stage=$('stage');let SW=1,SH=1;
function resize(){const rc=stage.getBoundingClientRect(),w=Math.max(1,Math.round(rc.width)),h=Math.max(1,Math.round(rc.height));SW=w;SH=h;renderer.setSize(w,h,false);composer.setSize(w,h);const pr=renderer.getPixelRatio();kPass.uniforms.res.value.set(w*pr,h*pr);kPass.uniforms.st.value=Math.max(1,pr*.9);camera.aspect=w/h;camera.updateProjectionMatrix()}
addEventListener('resize',resize);if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);resize();
