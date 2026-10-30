// Produce a replay-valid position one human move before winning against Deniz.
import {mkdirSync,writeFileSync} from 'node:fs';
import {initialState,move} from '../dist/engine.js';
import {chooseMove} from '../dist/ai.js';
import {validSession} from '../dist/session.js';
let fixture;
for(let seed=1;seed<=20&&!fixture;seed++){
 let n=seed;const random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);
 let state=initialState(),history=[];
 for(let turn=0;turn<400&&!state.ended;turn++){
  const before=state,pit=chooseMove(state,state.turn===0?'medium':'beginner','balanced',random).pit;
  state=move(state,pit).state;
  if(state.ended&&state.winner===0&&before.turn===0){
   const session={version:1,state:before,mode:'solo',level:'beginner',style:'balanced',
    assisted:true,target:1,wins:[0,0],starter:0,round:1,names:['Sen','Deniz'],
    history,recorded:false,opponentId:'deniz'};
   if(!validSession(session))throw Error('Invalid Android fixture');
   fixture={session,pit};break;
  }
  history.push({before,pit});
 }
}
if(!fixture)throw Error('Could not find a human winning finish');
mkdirSync('android/app/src/androidTest/assets',{recursive:true});
writeFileSync('android/app/src/androidTest/assets/winning-position.json',JSON.stringify(fixture));
console.log('Android fixture: valid replay with',fixture.session.history.length,'moves');
