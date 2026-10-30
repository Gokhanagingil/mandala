// Visual steps are derived from engine snapshots; they never change game rules.
export const SPEEDS={
 slow:{lift:340,flight:620,land:170,transfer:260,result:800},
 normal:{lift:220,flight:400,land:120,transfer:200,result:650},
 fast:{lift:120,flight:200,land:65,transfer:120,result:400}
};
export function animationSteps(result){
 const steps=[];let previous=null,hand=result.path.length;
 for(const event of result.events){
  if(event.type==='lift')steps.push({type:'lift',from:event.pit,board:event.board.slice(),hand});
  if(event.type==='drop')steps.push({type:'drop',from:result.pit,to:event.pit,board:event.board.slice(),hand:--hand});
  if(event.type==='capture'||event.type==='sweep'){
   const to=event.player===0?6:13;
   const sources=event.type==='capture'?event.pits:Array.from({length:14},(_,i)=>i).filter(i=>i!==6&&i!==13&&previous[i]>event.board[i]);
   const b=previous.slice();
   for(const from of sources)while(b[from]>event.board[from]){
    b[from]--;const depart=b.slice();b[to]++;
    steps.push({type:'transfer',kind:event.type,from,to,depart,board:b.slice(),hand:0});
   }
  }
  previous=event.board;
 }
 return steps;
}
export function treasuryPoint(i,horizontal=false){
 if(horizontal)return {x:5+(i%16)*6,y:24+Math.floor(i/16)*26};
 return {x:[50,22,78][i%3]+(Math.floor(i/3)%2?3:-3),y:93-Math.floor(i/3)*5.45};
}
export function treasuryStones(n,pit){
 return Array.from({length:n},(_,i)=>{const a=treasuryPoint(i),b=treasuryPoint(i,true);return `<span class="stone treasury-stone ${(i+pit)%3===0?'amber':''}" style="--sx:${a.x}%;--sy:${a.y}%;--mx:${b.x}%;--my:${b.y}%;--rot:${(i*37+pit*23)%80-40}deg"></span>`;}).join('');
}
const flights=new Set();
export function cancelFlights(){for(const item of flights){item.animation.cancel();item.stone.remove();}flights.clear();document.querySelectorAll('.receiving').forEach(n=>n.classList.remove('receiving'));}
function well(index){return document.querySelector(index===6||index===13?`[data-store="${index}"]`:`[data-pit="${index}"]`);}
export async function flyStone(from,to,duration,ordinal=0){
 const board=document.querySelector('.board'),source=well(from),target=well(to);
 if(!board||!source||!target)return;
 document.querySelectorAll('.receiving').forEach(n=>n.classList.remove('receiving'));
 target.classList.add('receiving');
 const origin=board.getBoundingClientRect(),a=source.getBoundingClientRect();
 const bed=target.querySelector('.store-stones')||target,b=bed.getBoundingClientRect();
 const start={x:a.left+a.width/2-origin.left,y:a.top+a.height/2-origin.top};
 const point=to===6||to===13?treasuryPoint(ordinal,innerWidth<=480):{x:50,y:50};
 const end={x:b.left+b.width*point.x/100-origin.left,y:b.top+b.height*point.y/100-origin.top};
 const stone=document.createElement('span');stone.className=`stone flying-stone ${(ordinal+to)%3===0?'amber':''}`;stone.setAttribute('aria-hidden','true');
 stone.style.setProperty('--rot',`${ordinal*29%80-40}deg`);board.append(stone);
 if(!stone.animate){stone.remove();return;}
 const pose=(x,y,scale=1)=>`translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`;
 const animation=stone.animate([
  {transform:pose(start.x,start.y),opacity:.9},
  {transform:pose((start.x+end.x)/2,(start.y+end.y)/2-Math.min(48,Math.hypot(end.x-start.x,end.y-start.y)*.16+18),1.18),offset:.48,opacity:1},
  {transform:pose(end.x,end.y),opacity:1}
 ],{duration,easing:'cubic-bezier(.28,.1,.45,1)',fill:'forwards'});
 const item={stone,animation};flights.add(item);
 try{await Promise.race([animation.finished,new Promise(resolve=>setTimeout(resolve,duration+180))]);}catch{}finally{animation.cancel();stone.remove();flights.delete(item);}
}
