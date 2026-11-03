/* ---------- musique : « Snowfall » de Scott Buckley (CC-BY 4.0), intégrée dans la page ----------
   La musique passe par le même circuit WebAudio que les effets (un gain dédié) : le volume réagit partout,
   et « remettre le son » relance toujours la lecture et le contexte audio. */
const MUS={el:null,g:null,vol:.85};const musVol=()=>MUS.vol*SND.vm*SND.vm;
function audioWake(){if(SND.ctx&&SND.ctx.state!=='running'){try{SND.ctx.resume()}catch(_){}}}
function musicStart(){if(MUS.el||!window.MUSIC_SRC)return;sndInit();try{const a=new Audio(MUSIC_SRC);a.loop=true;a.preload='auto';MUS.el=a;
  if(SND.ctx){try{const src=SND.ctx.createMediaElementSource(a);MUS.g=SND.ctx.createGain();MUS.g.gain.value=0;src.connect(MUS.g).connect(SND.ctx.destination);a.volume=1}catch(_){MUS.g=null}}
  if(!MUS.g)a.volume=0;
  if(SND.on){audioWake();a.play().catch(()=>{})}
  if(MUS.g){const t=SND.ctx.currentTime;MUS.g.gain.setValueAtTime(0,t);MUS.g.gain.linearRampToValueAtTime(musVol(),t+4)}
  else{const t0=performance.now();const fade=()=>{const k=Math.min(1,(performance.now()-t0)/4000);if(MUS.el)MUS.el.volume=Math.min(1,musVol()*k);if(k<1)requestAnimationFrame(fade)};fade()}}catch(_){}}
function musicSync(){if(!MUS.el)return;if(SND.on){audioWake();if(MUS.el.paused)MUS.el.play().catch(()=>{});volSync(true)}else MUS.el.pause()}
document.addEventListener('visibilitychange',()=>{if(!MUS.el)return;if(document.hidden)MUS.el.pause();else musicSync()});
document.addEventListener('pointerdown',()=>{audioWake();if(SND.on&&MUS.el&&MUS.el.paused&&!document.hidden)MUS.el.play().catch(()=>{})},true);
function volSync(quiet){if(MUS.g){const t=SND.ctx.currentTime;MUS.g.gain.cancelScheduledValues(t);MUS.g.gain.setTargetAtTime(musVol(),t,.08)}else if(MUS.el)MUS.el.volume=Math.min(1,musVol());
  if(SND.fx)SND.fx.gain.value=SND.ve;if(!quiet)try{localStorage.setItem('nfox-vol',JSON.stringify([SND.vm,SND.ve]))}catch(_){}}
