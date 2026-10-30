import test from 'node:test';
import assert from 'node:assert/strict';
import {OPPONENTS,normalizeCareer,availableOpponents,canSelectOpponent,selectOpponent,recordOpponentVictory} from '../dist/opponents.js';
import {initialState,move,legalMoves} from '../dist/engine.js';
import {AI_LEVELS,chooseMove} from '../dist/ai.js';
import {validSession,advanceRound} from '../dist/session.js';
import {nextOpponent} from '../dist/rivals-ui.js';
import {puzzles} from '../dist/puzzles.js';

const result=(id='deniz',winner=0,target=1,wins=winner===null?[0,0]:winner===0?[1,0]:[0,1])=>({mode:'solo',opponentId:id,recorded:true,target,wins,state:{ended:true,winner}});
test('first launch starts with one very easy opponent; locked and corrupt choices cannot be selected',()=>{
 const c=normalizeCareer(null);assert.equal(c.selected,'deniz');assert.equal(availableOpponents(c).length,1);assert.equal(OPPONENTS[0].level,'beginner');
 assert.equal(selectOpponent(c,'lale'),c);assert.equal(selectOpponent(c,'missing'),c);
 for(const raw of [null,[],{cleared:['lale']},{version:1,cleared:['deniz','can'],selected:'lale'}]){const recovered=normalizeCareer(raw);assert(canSelectOpponent(recovered,recovered.selected));assert(recovered.cleared.length<=1);}
});
test('a victory unlocks exactly one next opponent and keeps the previous selection',()=>{
 const c=normalizeCareer(null),won=recordOpponentVictory(c,result());assert.deepEqual(won.cleared,['deniz']);assert.equal(won.selected,'deniz');assert.equal(availableOpponents(won).length,2);
 assert.equal(recordOpponentVictory(won,result()),won);assert.equal(nextOpponent(won,result()).id,'ece');assert.equal(canSelectOpponent(won,'can'),false);
});
test('loss, draw, local games, unfinished games, legacy games and unrecorded results never unlock',()=>{
 const c=normalizeCareer(null);for(const s of [result('deniz',1),result('deniz',null),{...result(),mode:'local'},{...result(),state:{ended:false,winner:0}},{...result(),recorded:false},{...result(),opponentId:undefined},result('lale')])assert.equal(recordOpponentVictory(c,s),c);
});
test('mini tournament requires two wins; the first round and a losing series do not advance',()=>{
 const c=normalizeCareer(null);assert.equal(recordOpponentVictory(c,result('deniz',0,2,[1,0])),c);assert.equal(nextOpponent(c,result('deniz',0,2,[1,0])),null);
 assert.equal(recordOpponentVictory(c,result('deniz',1,2,[1,2])),c);
 const won=recordOpponentVictory(c,result('deniz',0,2,[2,1]));assert.deepEqual(won.cleared,['deniz']);assert.equal(nextOpponent(won,result('deniz',0,2,[2,1])).id,'ece');
});
test('all six can be completed in order; old opponents stay selectable without farming skips',()=>{
 let c=normalizeCareer(null);for(const o of OPPONENTS){c=selectOpponent(c,o.id);c=recordOpponentVictory(c,result(o.id));c=normalizeCareer(JSON.parse(JSON.stringify(c)));}
 assert.equal(c.cleared.length,6);assert.equal(availableOpponents(c).length,6);assert.equal(nextOpponent(c,result('lale')),null);
 c=selectOpponent(c,'ece');assert.equal(c.selected,'ece');const afterLoss=recordOpponentVictory(c,result('ece',1));assert.deepEqual(afterLoss,c);
 const one=recordOpponentVictory(normalizeCareer(null),result());assert.equal(recordOpponentVictory(one,result()),one);assert.equal(availableOpponents(one).length,2);
});
test('named and legacy sessions survive save/restore while opponent difficulty cannot diverge',()=>{
 for(const o of OPPONENTS){const s={version:1,mode:'solo',opponentId:o.id,level:o.level,style:o.style,assisted:true,target:1,starter:0,round:1,names:['Sen',o.name],wins:[0,0],recorded:false,state:initialState(),history:[]};
 s.history.push({before:structuredClone(s.state),pit:3});s.state=move(s.state,3).state;assert(validSession(JSON.parse(JSON.stringify(s))));
 assert(!validSession({...s,names:['Sen','Başka rakip']}));assert(!validSession({...s,level:'unknown'}));assert(!validSession({...s,mode:'local'}));
 if(o.id==='deniz')assert(!validSession({...s,level:'hard'}));
 const legacy={...s,level:'medium'};delete legacy.opponentId;assert(validSession(legacy));
 }
});
test('rematch retains the chosen opponent and a completed mini-round remains resumable',()=>{
 const s={version:1,mode:'solo',opponentId:'ece',level:'novice',style:'balanced',assisted:true,target:2,starter:0,round:1,names:['Sen','Ece'],wins:[1,0],recorded:true,state:{ended:true,winner:0},history:[]};advanceRound(s);assert.equal(s.opponentId,'ece');assert.equal(s.level,'novice');assert.equal(s.starter,1);assert.equal(s.round,2);assert(validSession(s));
});
test('all six AI profiles produce legal moves without changing the board, including extra turns',()=>{
 let state=initialState(),seed=927;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
 for(let n=0;n<18&&!state.ended;n++){
 const before=structuredClone(state);for(const o of OPPONENTS){const r=chooseMove(state,o.level,o.style,rng);assert(legalMoves(state).includes(r.pit));assert.deepEqual(state,before);assert(r.nodes<=AI_LEVELS[o.level].budget+1);}
 const options=legalMoves(state);state=move(state,options[Math.floor(rng()*options.length)]).state;
 }
});
test('beginner mistakes can pass up an immediate win; master still takes it',()=>{
 const p=puzzles.find(p=>p.type==='finish'&&legalMoves(p.state).some(i=>!p.solutions.includes(i)));
 const options=legalMoves(p.state),wrong=options.findIndex(i=>!p.solutions.includes(i));let calls=0;
 const beginner=chooseMove(p.state,'beginner','balanced',()=>calls++===0?0:(wrong+.1)/options.length);
 assert(!p.solutions.includes(beginner.pit));assert(p.solutions.includes(chooseMove(p.state,'hard').pit));
});
