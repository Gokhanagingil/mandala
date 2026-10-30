import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,legalMoves,move,validState,opposite} from '../dist/engine.js';
import {chooseMove} from '../dist/ai.js';
import {puzzles} from '../dist/puzzles.js';
function position(pits,turn=0){const board=Array(14).fill(0);for(const [i,n] of Object.entries(pits))board[i]=n;board[13]+=48-board.reduce((a,b)=>a+b,0);return {board,turn,ended:false,winner:null,moves:0};}
test('48 stones, six legal opening choices on both sides',()=>{for(const p of [0,1]){const s=initialState(p);assert(validState(s));assert.equal(legalMoves(s).length,6);}});
test('opening keeps one stone in source and distributes three',()=>{const s=initialState();const r=move(s,0,true);assert.deepEqual(r.state.board.slice(0,6),[1,5,5,5,4,4]);assert.deepEqual(r.path,[1,2,3]);assert.equal(s.board[0],4);assert.equal(r.state.turn,1);});
test('single stone leaves the source, own home gives another turn',()=>{const r=move(position({0:3,5:1,7:4}),5);assert.equal(r.state.board[5],0);assert.equal(r.state.board[6],1);assert(r.extra);assert.equal(r.state.turn,0);});
test('opening pit 4 reaches home and grants another move',()=>{assert(move(initialState(),3).extra);});
test('opponent home is skipped over a full lap',()=>{const s=position({0:20,1:2,7:2});const r=move(s,0);assert(!r.path.includes(13));assert.equal(r.path.length,19);assert.equal(r.state.board[13],s.board[13]);});
test('last stone makes opponent count even, only that pit captured',()=>{const r=move(position({0:2,5:3,7:3,8:2}),5);assert.equal(r.captureKind,'even');assert.equal(r.captured,4);assert.equal(r.state.board[7],0);assert.equal(r.state.board[8],2);assert.equal(r.state.board[6],5);});
test('odd enemy count is not captured',()=>{const r=move(position({0:2,5:3,7:2,8:2}),5);assert.equal(r.captured,0);assert.equal(r.state.board[7],3);});
test('empty own pit captures its new stone and opposite stones',()=>{const r=move(position({0:1,2:2,7:3,11:5}),0);assert.equal(r.captureKind,'opposite');assert.equal(r.captured,6);assert.equal(r.state.board[1],0);assert.equal(r.state.board[11],0);});
test('empty opposite means single landing stone stays put',()=>{const r=move(position({0:1,2:2,7:3}),0);assert.equal(r.captured,0);assert.equal(r.state.board[1],1);});
test('empty side takes remaining enemy stones, before extra turn',()=>{const r=move(position({5:1,7:5,8:4,6:20}),5);assert(r.state.ended);assert(!r.extra);assert.equal(r.swept,9);assert.equal(r.state.board[6],30);assert.equal(r.state.winner,0);assert(validState(r.state));});
test('capturing last enemy pit makes enemy the empty-side collector',()=>{const r=move(position({0:4,5:3,7:3,6:10}),5);assert.equal(r.sweepPlayer,1);assert.equal(r.swept,5);assert(r.state.ended);});
test('24–24 ends in a draw',()=>{const r=move(position({5:1,7:1,6:22}),5);assert.equal(r.state.board[6],24);assert.equal(r.state.board[13],24);assert.equal(r.state.winner,null);});
test('illegal pits, stores, empty pits and ended boards are rejected',()=>{for(const pit of [-1,6,7,13,14,1.1])assert.throws(()=>move(initialState(),pit));assert.throws(()=>move(position({1:2,7:1}),0));const s=move(position({5:1,7:2}),5).state;assert.throws(()=>move(s,0));});
test('saved state validation rejects corrupt or unfinished terminal states',()=>{assert(!validState({...initialState(),board:Array(14).fill(4)}));assert(!validState({...initialState(),turn:2}));assert(!validState({...initialState(),ended:true}));});
// Independent ring implementation compares legal trajectories, not just fixtures.
function reference(s,pit){
 const b=s.board.slice(),p=s.turn,own=p===0?[0,1,2,3,4,5]:[7,8,9,10,11,12],enemy=p===0?[7,8,9,10,11,12]:[0,1,2,3,4,5],home=p?13:6;
 const ring=p?[7,8,9,10,11,12,13,0,1,2,3,4,5]:[0,1,2,3,4,5,6,7,8,9,10,11,12];
 const n=b[pit];b[pit]=0;let slot=ring.indexOf(pit)+(n===1?1:0),last;
 for(let k=0;k<n;k++){last=ring[(slot+k)%13];b[last]++;}
 if(enemy.includes(last)&&b[last]%2===0){b[home]+=b[last];b[last]=0;}
 else if(own.includes(last)&&b[last]===1&&b[12-last]){b[home]+=b[last]+b[12-last];b[last]=b[12-last]=0;}
 let ended=false;
 for(const [ids,other,h] of [[own,enemy,home],[enemy,own,p?6:13]])if(ids.every(i=>!b[i])){for(const i of other){b[h]+=b[i];b[i]=0;}ended=true;break;}
 return {board:b,turn:!ended&&last===home?p:1-p,ended};
}
test('400 random games agree with independent rules and conserve every stone',()=>{
 let seed=19;const rnd=()=>((seed=Math.imul(seed,1664525)+1013904223)>>>0)/4294967296;
 let checked=0;for(let game=0;game<400;game++){let s=initialState(game%2);for(let k=0;k<300&&!s.ended;k++){const legal=legalMoves(s),pit=legal[Math.floor(rnd()*legal.length)],r=move(s,pit),ref=reference(s,pit);assert.deepEqual(r.state.board,ref.board);assert.equal(r.state.turn,ref.turn);assert.equal(r.state.ended,ref.ended);assert(validState(r.state));s=r.state;checked++;}assert(s.ended);}assert(checked>10000);
});
test('side rotation preserves capture, turn and score',()=>{const rotate=s=>({...s,board:[...s.board.slice(7),...s.board.slice(0,7)],turn:1-s.turn,winner:s.winner===null?null:1-s.winner});let s=initialState();for(let n=0;n<70&&!s.ended;n++){for(const p of legalMoves(s)){const r=move(s,p),rr=move(rotate(s),(p+7)%14);assert.deepEqual(rotate(r.state),rr.state);}s=move(s,legalMoves(s)[n%legalMoves(s).length]).state;}});
test('every puzzle is reachable and has exactly its advertised solutions',()=>{
 assert.equal(puzzles.length,18);for(const p of puzzles){let s=initialState();for(const pit of p.proof)s=move(s,pit).state;assert.deepEqual(s,p.state);assert(validState(s));const successes=legalMoves(s).filter(i=>{const r=move(s,i);return p.type==='extra'?r.extra:p.type==='even'?r.captureKind==='even'&&r.captured>=6:p.type==='opposite'?r.captureKind==='opposite'&&r.captured>=6:p.type==='best'?r.gain===p.target:r.state.ended&&r.state.winner===0;});assert.deepEqual(successes,p.solutions);assert.equal(successes.length,1);}
});
test('computer chooses a legal move at each difficulty and does not mutate',()=>{for(const level of ['easy','medium','hard']){const s=initialState(1),before=JSON.stringify(s),r=chooseMove(s,level,'balanced',()=>0);assert(legalMoves(s).includes(r.pit));assert.equal(JSON.stringify(s),before);assert(r.nodes<=65001);}});
test('hard computer finds immediate winning finish',()=>{for(const p of puzzles.filter(p=>p.type==='finish')){const r=chooseMove(p.state,'hard','balanced',()=>0);assert.equal(move(p.state,r.pit).state.winner,0);}});
test('computer returns no move on terminal positions',()=>{assert.equal(chooseMove(move(position({5:1,7:2}),5).state).pit,null);});
