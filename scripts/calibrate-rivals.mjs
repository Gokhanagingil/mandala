// Seeded head-to-head evidence, not a promise of human win rates.
import {initialState,move,legalMoves,storeOf} from '../dist/engine.js';
import {chooseMove} from '../dist/ai.js';
import {OPPONENTS} from '../dist/opponents.js';
const games=24;
function random(seed){return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);}
for(const o of OPPONENTS){
 let won=0,draw=0,margin=0,moves=0;
 for(let g=0;g<games;g++){
  const side=g%2,rng=random(8901+Math.floor(g/2)*131),reference=random(4401+Math.floor(g/2)*61),opening=random(71+Math.floor(g/2)*17);
  let state=initialState();
  // Same paired opening seeds, each profile plays both board sides.
  for(let n=0;n<4;n++){const pits=legalMoves(state);state=move(state,pits[Math.floor(opening()*pits.length)]).state;}
  while(!state.ended&&state.moves<500){const candidate=state.turn===side;const r=chooseMove(state,candidate?o.level:'easy','balanced',candidate?rng:reference);state=move(state,r.pit).state;}
  if(!state.ended)throw Error('Unfinished benchmark game');
  if(state.winner===side)won++;else if(state.winner===null)draw++;
  margin+=state.board[storeOf(side)]-state.board[storeOf(1-side)];moves+=state.moves;
 }
 console.log(JSON.stringify({opponent:o.name,level:o.level,games,won,draw,lost:games-won-draw,pointsPercent:Math.round((won+draw*.5)/games*100),meanStoneMargin:Number((margin/games).toFixed(1)),moves}));
}
