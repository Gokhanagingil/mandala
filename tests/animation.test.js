import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,move} from '../dist/engine.js';
import {animationSteps,treasuryStones,treasuryPoint} from '../dist/animation.js';
import {puzzles} from '../dist/puzzles.js';
const total=b=>b.reduce((a,b)=>a+b,0);
test('sowing sequence has one arrival for each stone, in rule-engine order',()=>{
 const result=move(initialState(),3,true),steps=animationSteps(result);
 assert.deepEqual(steps.filter(s=>s.type==='drop').map(s=>s.to),[4,5,6]);
 assert.deepEqual(steps.map(s=>s.hand),[3,2,1,0]);
 for(const s of steps)assert.equal(total(s.board)+s.hand,48);
 assert.deepEqual(steps.at(-1).board,result.state.board);
});
test('capture and end-of-game transfer each stone once without changing final scores',()=>{
 for(const p of puzzles){for(const pit of p.solutions){const result=move(p.state,pit,true),steps=animationSteps(result);for(const s of steps){assert.equal(total(s.board)+s.hand,48);if(s.type==='transfer'){assert.equal(total(s.depart),47);assert.equal(s.board[s.to],s.depart[s.to]+1);assert.equal(s.board[s.from],s.depart[s.from]);}}assert.deepEqual(steps.at(-1).board,result.state.board);assert.equal(steps.filter(s=>s.type==='transfer').length,result.captured+result.swept);}}
});
test('treasuries render all stones, including a 48-stone end position, inside both orientations',()=>{
 for(const n of [0,1,8,24,48])assert.equal((treasuryStones(n,6).match(/class="stone /g)||[]).length,n);
 for(let i=0;i<48;i++)for(const horizontal of [false,true]){const p=treasuryPoint(i,horizontal);assert(p.x>0&&p.x<100&&p.y>0&&p.y<100);}
});
