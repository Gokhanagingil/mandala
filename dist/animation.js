// Visual steps are derived from engine snapshots; they never change game rules.
export const SPEEDS={
 slow:{lift:650,hold:650,travel:340,flight:480,land:220,transfer:380,result:800},
 normal:{lift:430,hold:350,travel:230,flight:320,land:140,transfer:260,result:650},
 fast:{lift:250,hold:160,travel:140,flight:190,land:80,transfer:160,result:400}
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

const positions=[[36,35],[66,55],[35,69],[65,27],[50,48],[24,51],[73,76],[47,19],[22,24],[76,40],[51,80],[27,83]];
export function pitPoint(i,pit){
 const p=positions[(i+pit*3)%positions.length],layer=Math.floor(i/positions.length);
 return {x:p[0]+(layer%2?-3:0),y:p[1]-layer*3};
}
export function pitStones(n,pit){
 return Array.from({length:n},(_,i)=>{const p=pitPoint(i,pit);return `<span class="stone ${(i+pit)%3===0?'amber':''}" style="left:${p.x}%;top:${p.y}%;--rot:${(i*37+pit*23)%80-40}deg"></span>`;}).join('');
}
// Every lifted stone gets its own visible slot, even after a multi-lap move.
export function handLayout(n,small=false){
 const columns=Math.min(n,small?7:9),gap=small?18:27,rows=Math.ceil(n/columns)||0;
 return {width:Math.max(1,columns)*gap,height:Math.max(1,rows)*gap,points:Array.from({length:n},(_,i)=>({x:(i%columns-(columns-1)/2)*gap,y:(Math.floor(i/columns)-(rows-1)/2)*gap}))};
}

let activeMotion=null;
export function cancelFlights(){activeMotion?.dispose();activeMotion=null;}
export function createStoneMotion(){
 cancelFlights();
 const board=document.querySelector('.board'),animations=new Set(),floating=new Set();
 let hand=[],disposed=false;
 const label=document.createElement('span');label.className='hand-label';label.hidden=true;label.setAttribute('aria-hidden','true');board.append(label);
 const origin=document.createElement('span');origin.className='source-note';origin.hidden=true;origin.setAttribute('aria-hidden','true');board.append(origin);
 const well=i=>board.querySelector(i===6||i===13?`[data-store="${i}"]`:`[data-pit="${i}"]`);
 const bed=i=>well(i).querySelector(i===6||i===13?'.store-stones':'.stone-bed');
 const local=rect=>{const b=board.getBoundingClientRect();return {x:rect.left+rect.width/2-b.left-board.clientLeft,y:rect.top+rect.height/2-b.top-board.clientTop};};
 const pose=p=>`translate(-50%,-50%) rotate(var(--rot)) scale(${p.scaleX??p.scale},${p.scaleY??p.scale})`;
 const highlight=i=>{board.querySelectorAll('.receiving').forEach(n=>n.classList.remove('receiving'));well(i).classList.add('receiving');};
 function float(stone){
  const rect=stone.getBoundingClientRect(),point=local(rect);
  // Unrotated dimensions keep the same pebble size while it leaves the well.
  const item={stone,x:point.x,y:point.y,scale:1,width:stone.offsetWidth,height:stone.offsetHeight};
  stone.classList.remove('treasury-stone');stone.classList.add('carried-stone');
  Object.assign(stone.style,{left:`${item.x}px`,top:`${item.y}px`,width:`${item.width}px`,height:`${item.height}px`,transform:pose(item)});
  board.append(stone);floating.add(item);return item;
 }
 async function motion(item,to,duration){
  if(disposed)return;
  const start={left:`${item.x}px`,top:`${item.y}px`,transform:pose(item)},end={left:`${to.x}px`,top:`${to.y}px`,transform:pose(to)};
  if(item.stone.animate){
   const a=item.stone.animate([start,end],{duration,easing:'cubic-bezier(.3,0,.25,1)',fill:'forwards'});animations.add(a);
   let timer;
   try{await Promise.race([a.finished,new Promise(r=>{timer=setTimeout(r,duration+250);})]);}catch{}finally{clearTimeout(timer);if(!disposed)Object.assign(item.stone.style,end);a.cancel();animations.delete(a);}
  }else Object.assign(item.stone.style,end);
  Object.assign(item,to);
 }
 function hover(i){
  const layout=handLayout(hand.length,innerWidth<=480),rect=well(i).getBoundingClientRect(),p=local(rect);
  return {layout,x:Math.max(layout.width/2+10,Math.min(board.clientWidth-layout.width/2-10,p.x)),y:Math.max(layout.height/2+34,p.y-rect.height/2-layout.height/2-8)};
 }
 function handLabel(p,text){label.hidden=!text;label.textContent=text;label.style.left=`${p.x}px`;label.style.top=`${p.y-p.layout.height/2-21}px`;}
 async function carry(i,duration){
  const p=hover(i);handLabel(p,`Elde ${hand.length} taş`);highlight(i);
  await Promise.all(hand.map((item,j)=>motion(item,{x:p.x+p.layout.points[j].x,y:p.y+p.layout.points[j].y,scale:1.25},duration)));
 }
 function landing(i,item){
  const target=bed(i),p=i===6||i===13?treasuryPoint(target.children.length,innerWidth<=480):pitPoint(target.children.length,i),rect=target.getBoundingClientRect(),c=local(rect);
  const probe=document.createElement('span');probe.className=`stone ${i===6||i===13?'treasury-stone':''}`;probe.style.visibility='hidden';target.append(probe);
  const scaleX=probe.offsetWidth/item.width,scaleY=probe.offsetHeight/item.height;probe.remove();
  return {target,p,x:c.x+rect.width*(p.x/100-.5),y:c.y+rect.height*(p.y/100-.5),scaleX,scaleY};
 }
 function land(item,i,dest){
  if(disposed)return;
  const rotation=item.stone.style.getPropertyValue('--rot');
  item.stone.classList.remove('carried-stone','dropping-stone');item.stone.removeAttribute('style');item.stone.style.setProperty('--rot',rotation);
  if(i===6||i===13){item.stone.classList.add('treasury-stone');const a=treasuryPoint(dest.target.children.length),b=treasuryPoint(dest.target.children.length,true);for(const [k,v] of Object.entries({sx:a.x,sy:a.y,mx:b.x,my:b.y}))item.stone.style.setProperty(`--${k}`,`${v}%`);}
  else{item.stone.style.left=`${dest.p.x}%`;item.stone.style.top=`${dest.p.y}%`;}
  dest.target.append(item.stone);floating.delete(item);
 }
 function dispose(){
  disposed=true;for(const a of animations)a.cancel();animations.clear();for(const item of floating)item.stone.remove();floating.clear();hand=[];label.remove();origin.remove();board.querySelectorAll('.receiving,.source-well').forEach(el=>el.classList.remove('receiving','source-well'));
  if(activeMotion===api)activeMotion=null;
 }
 const api={
  async lift(from,count,duration,onLift){
   const source=bed(from),all=[...source.children],kept=all.length-count;
   // Detach the real pebbles, leaving the original first pebble in place.
   hand=all.slice(kept).map(float);well(from).classList.add('source-well');
   const p=local(well(from).getBoundingClientRect());origin.hidden=false;origin.textContent=kept?'1 taş kaldı':'Kuyu boş';origin.style.left=`${p.x}px`;origin.style.top=`${p.y+6}px`;
   onLift();await carry(from,duration);
  },
  async drop(to,travelDuration,dropDuration,onRelease){
   origin.hidden=true;await carry(to,travelDuration);if(disposed)return;
   const item=hand.shift(),dest=landing(to,item);item.stone.classList.add('dropping-stone');
   label.textContent=hand.length?`Elde ${hand.length} · 1 iniyor`:'Son taş iniyor';onRelease();
   await motion(item,{x:dest.x,y:dest.y,scale:1,scaleX:dest.scaleX,scaleY:dest.scaleY},dropDuration);land(item,to,dest);
   label.hidden=hand.length===0;if(hand.length)label.textContent=`Elde ${hand.length} taş`;
  },
  async transfer(from,to,duration,onRelease){
   const item=float(bed(from).lastElementChild),dest=landing(to,item);highlight(to);onRelease();item.stone.classList.add('dropping-stone');
   await motion(item,{x:(item.x+dest.x)/2,y:Math.min(item.y,dest.y)-30,scale:1.2},duration*.45);
   if(disposed)return;await motion(item,{x:dest.x,y:dest.y,scale:1,scaleX:dest.scaleX,scaleY:dest.scaleY},duration*.55);land(item,to,dest);
  },
  dispose
 };
 activeMotion=api;return api;
}

// Keep the actual colours and positions when controls are re-rendered after a move.
export function rememberPiles(){return [...document.querySelectorAll('.board-grid .stone-bed,.board-grid .store-stones')].map(el=>({count:el.children.length,html:el.innerHTML}));}
export function restorePiles(piles){const beds=[...document.querySelectorAll('.board-grid .stone-bed,.board-grid .store-stones')];if(beds.length===piles.length&&beds.every((el,i)=>el.children.length===piles[i].count))beds.forEach((el,i)=>{el.innerHTML=piles[i].html;});}
