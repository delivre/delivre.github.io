/* ---------- marcher sans traverser les décors : une petite grille et un A* ---------- */
const inBoard=(x,z,m)=>Math.hypot(x,z)<RB-m;
const OBST=OBSTL;
const GC=.2,GX0=-RW,GZ0=-RD,NX=Math.ceil(2*RW/GC),NZ=Math.ceil(2*RD/GC),BLK=new Uint8Array(NX*NZ);
const cellXZ=(i,j)=>[GX0+(i+.5)*GC,GZ0+(j+.5)*GC];
for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const[x,z]=cellXZ(i,j);let b=!inBoard(x,z,.45)||inSea(x,z,.22)||((segD(x,z,NILEP)<.2||segD(x,z,DAMIETTA)<.16)&&Math.hypot(x-BRIDGE.x,z-BRIDGE.z)>.75);
  if(!b)for(const[ox,oz,r]of OBST)if(Math.hypot(x-ox,z-oz)<r+.13){b=true;break}BLK[j*NX+i]=b?1:0}
for(const s of [...SPOTS,SPOT5])for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const[x,z]=cellXZ(i,j);if(Math.hypot(x-s.x,z-s.z)<.4)BLK[j*NX+i]=0}
const toCell=(x,z)=>[Math.max(0,Math.min(NX-1,Math.floor((x-GX0)/GC))),Math.max(0,Math.min(NZ-1,Math.floor((z-GZ0)/GC)))];
function nearestFree(i,j){if(!BLK[j*NX+i])return[i,j];for(let r=1;r<20;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const a=i+di,b=j+dj;if(a>=0&&b>=0&&a<NX&&b<NZ&&!BLK[b*NX+a])return[a,b]}return[i,j]}
const losFree=(x0,z0,x1,z1)=>{const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/(GC*.5));for(let k=0;k<=n;k++){const[i,j]=toCell(lerp(x0,x1,k/n),lerp(z0,z1,k/n));if(BLK[j*NX+i])return false}return true};
function findPath(x0,z0,x1,z1){let[si,sj]=nearestFree(...toCell(x0,z0)),[ti,tj]=nearestFree(...toCell(x1,z1));const S=sj*NX+si,G=tj*NX+ti;
  const g=new Float32Array(NX*NZ).fill(1e9),from=new Int32Array(NX*NZ).fill(-1),open=[S];g[S]=0;const h=k=>Math.hypot(k%NX-ti,(k/NX|0)-tj);const closed=new Uint8Array(NX*NZ);
  while(open.length){let bi=0;for(let k=1;k<open.length;k++)if(g[open[k]]+h(open[k])<g[open[bi]]+h(open[bi]))bi=k;const c=open.splice(bi,1)[0];if(c===G)break;if(closed[c])continue;closed[c]=1;const ci=c%NX,cj=c/NX|0;
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const a=ci+di,b=cj+dj;if(a<0||b<0||a>=NX||b>=NZ)continue;const n=b*NX+a;if(BLK[n]||closed[n])continue;if(di&&dj&&(BLK[cj*NX+a]||BLK[b*NX+ci]))continue;
      const ng=g[c]+(di&&dj?1.414:1);if(ng<g[n]){g[n]=ng;from[n]=c;open.push(n)}}}
  if(from[G]<0&&G!==S)return[[x1,z1]];
  const cells=[];for(let k=G;k!==-1&&k!==S;k=from[k])cells.unshift(cellXZ(k%NX,k/NX|0));
  const end=BLK[toCell(x1,z1)[1]*NX+toCell(x1,z1)[0]]?cells[cells.length-1]||[x1,z1]:[x1,z1];cells.push(end);
  // lisser : garder seulement les points nécessaires
  const out=[];let cx=x0,cz=z0,k=0;while(k<cells.length){let far=k;for(let m=cells.length-1;m>k;m--)if(losFree(cx,cz,cells[m][0],cells[m][1])){far=m;break}out.push(cells[far]);[cx,cz]=cells[far];k=far+1}return out}
function goTo(x,z){const p=findPath(fig.position.x,fig.position.z,x,z);figState.path=p.slice(1);figState.tx=p[0][0];figState.tz=p[0][1]}
