import {writeFileSync} from 'node:fs';
import {initialState,legalMoves,move} from '../dist/engine.js';
let seed=81723; const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const pools={extra:[],even:[],opposite:[],best:[],finish:[]},seen=new Set();
for(let game=0;game<450;game++) {
 let s=initialState(),proof=[];
 for(let t=0;t<160&&!s.ended;t++) {
  const legal=legalMoves(s),results=legal.map(i=>move(s,i));
  if(s.turn===0&&legal.length>=3&&!seen.has(s.board.join(','))) {
   seen.add(s.board.join(','));
   const best=Math.max(...results.map(r=>r.gain));
   const predicates={extra:r=>r.extra,even:r=>r.captureKind==='even'&&r.captured>=6,opposite:r=>r.captureKind==='opposite'&&r.captured>=6,best:r=>r.gain===best,finish:r=>r.state.ended&&r.state.winner===0};
   for(const [type,predicate] of Object.entries(predicates)) {
    const solutions=results.filter(predicate).map(r=>r.pit);
    if(solutions.length===1&&(type!=='best'||best>=8)&&pools[type].length<180)
     pools[type].push({state:s,solutions,proof:[...proof],type,target: type==='best'?best:6});
   }
  }
  const pit=legal[Math.floor(random()*legal.length)];proof.push(pit);s=move(s,pit).state;
 }
}
const order=['extra','extra','even','opposite','even','opposite','best','extra','even','best','opposite','best','finish','best','finish','opposite','best','finish'];
const used=new Set();
const puzzles=order.map((type,i)=>{
 const pool=pools[type];
 const item=pool.find(p=>!used.has(p.state.board.join(','))&&(i>1||p.state.moves<15))||pool.find(p=>!used.has(p.state.board.join(',')));
 if(!item)throw Error('Missing puzzle '+type);used.add(item.state.board.join(','));
 return {...item,id:i+1,title:{extra:'Sıra yine sende',even:'Çiftin gücü',opposite:'Karşı kıyı',best:'Bir hamle, büyük kazanç',finish:'Son sözü söyle'}[type],goal:{extra:'Bu hamlede bir oynama hakkı daha kazan.',even:'Çiftleme kuralıyla en az 6 taş yakala.',opposite:'Boş kuyu kuralıyla en az 6 taş yakala.',best:`Tek hamlede ${item.target} taşı hazinene ekle.`,finish:'Bu hamlede eli bitir ve kazan.'}[type]};
});
writeFileSync(new URL('../dist/puzzles.js',import.meta.url),'// Reachable positions, reproducibly generated; all solutions checked in tests.\nexport const puzzles = '+JSON.stringify(puzzles)+';\n');
console.log(`Generated ${puzzles.length} reachable puzzles.`);
