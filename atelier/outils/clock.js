(()=>{let t=1000;const rafQ=[];let tq=[];let tid=1;
performance.now=()=>t;const D0=Date.now();Date.now=()=>D0+t;
window.requestAnimationFrame=cb=>{rafQ.push(cb);return rafQ.length};window.cancelAnimationFrame=()=>{};
const rST=window.setTimeout.bind(window);
window.setTimeout=(f,ms=0,...a)=>{const id=tid++;tq.push({id,due:t+(ms||0),f,a});return id};
window.clearTimeout=id=>{tq=tq.filter(o=>o.id!==id)};
window.setInterval=(f,ms)=>{const id=tid++;const rep=()=>{tq.push({id,due:t+ms,f:()=>{f();rep()},a:[]})};rep();return id};
window.clearInterval=window.clearTimeout;
window.__step=(ms)=>{t+=ms;let guard=0;while(guard++<200){const due=tq.filter(o=>o.due<=t).sort((a,b)=>a.due-b.due);if(!due.length)break;const o=due[0];tq=tq.filter(x=>x!==o);try{o.f(...o.a)}catch(e){console.error(e)}}
 const q=rafQ.splice(0);q.forEach(cb=>{try{cb(t)}catch(e){console.error(e)}})};
})();
