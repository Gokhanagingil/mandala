import {legalMoves,move,pitsOf,storeOf} from './engine.js';
const LEVELS={easy:{depth:2,budget:900},medium:{depth:5,budget:14000},hard:{depth:9,budget:65000}};
function evaluate(s,root,style) {
  const diff=s.board[storeOf(root)]-s.board[storeOf(1-root)];
  if(s.ended) return diff===0?0:Math.sign(diff)*10000+diff*20;
  const total=p=>pitsOf(p).reduce((n,i)=>n+s.board[i],0);
  const mobility=p=>pitsOf(p).filter(i=>s.board[i]>0).length;
  let value=diff*22+(total(root)-total(1-root))*.35;
  const mobilityWeight=style==='defensive'?2.8:style==='bold'?.4:1.2;
  value+=(mobility(root)-mobility(1-root))*mobilityWeight;
  const extras=p=>pitsOf(p).filter(i=>s.board[i]>0&&((s.board[i]===1?1:s.board[i]-1)%(13))===(storeOf(p)-i+14)%14).length;
  value+=(extras(root)-extras(1-root))*(style==='bold'?4:2);
  return value+(s.turn===root?1:-1);
}
export function chooseMove(state,level='medium',style='balanced',random=Math.random) {
  const options=legalMoves(state); if(!options.length) return {pit:null,nodes:0,depth:0};
  const wins=options.map(pit=>({pit,result:move(state,pit)})).filter(x=>x.result.state.ended&&x.result.state.winner===state.turn);
  if(wins.length){wins.sort((a,b)=>b.result.gain-a.result.gain);return {pit:wins[0].pit,nodes:0,depth:1,value:10000};}
  const limits=LEVELS[level]||LEVELS.medium,root=state.turn;
  let nodes=0,aborted=false,completedDepth=0;
  let ranked=options.map(pit=>({pit,value:evaluate(move(state,pit).state,root,style)})).sort((a,b)=>b.value-a.value);
  function search(s,depth,alpha,beta) {
    if(++nodes>limits.budget){aborted=true;return evaluate(s,root,style);}
    if(!depth||s.ended) return evaluate(s,root,style);
    const maximizing=s.turn===root;
    let best=maximizing?-Infinity:Infinity;
    const children=legalMoves(s).map(p=>move(s,p)).sort((a,b)=>b.gain-a.gain || Number(b.extra)-Number(a.extra));
    for(const child of children) {
      const v=search(child.state,depth-1,alpha,beta);
      if(aborted) return best===Infinity||best===-Infinity?v:best;
      best=maximizing?Math.max(best,v):Math.min(best,v);
      if(maximizing) alpha=Math.max(alpha,best); else beta=Math.min(beta,best);
      if(beta<=alpha) break;
    }
    return best;
  }
  for(let depth=1;depth<=limits.depth;depth++) {
    const attempt=[];
    for(const item of ranked) {attempt.push({pit:item.pit,value:search(move(state,item.pit).state,depth-1,-Infinity,Infinity)});if(aborted)break;}
    if(aborted)break;
    ranked=attempt.sort((a,b)=>b.value-a.value);completedDepth=depth;
  }
  // Easy occasionally chooses a close alternative; never changes the actual board or rules.
  const near=ranked.filter(r=>r.value>=ranked[0].value-(level==='easy'?60:0.01));
  const selected=near[Math.min(near.length-1,Math.floor(random()*near.length))];
  return {pit:selected.pit,nodes,depth:completedDepth,value:selected.value};
}
