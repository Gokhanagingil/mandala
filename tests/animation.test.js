import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,move} from '../dist/engine.js';
import {animationSteps,treasuryStones,treasuryPoint,pitStones,handLayout} from '../dist/animation.js';
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
test('no stones disappear from crowded pits or lifted groups',()=>{
 for(let n=1;n<=48;n++){
  assert.equal((pitStones(n,0).match(/class="stone /g)||[]).length,n);
  for(const small of [false,true]){
   const layout=handLayout(n,small);
   assert.equal(layout.points.length,n);
   assert.equal(new Set(layout.points.map(p=>`${p.x},${p.y}`)).size,n);
   assert(layout.width<=(small?126:243));
   for(const p of layout.points)assert(Math.abs(p.x)<layout.width/2&&Math.abs(p.y)<layout.height/2);
  }
 }
});
test('single stones and full laps retain every stone in the visible timeline',()=>{
 for(const [count,pit] of [[1,0],[15,0],[26,7]]){
  const state=initialState(pit===7?1:0);state.board=Array(14).fill(0);state.board[pit]=count;state.board[pit===7?0:7]=48-count;
  const result=move(state,pit,true),steps=animationSteps(result),lift=steps[0];
  assert.equal(lift.board[pit],count===1?0:1);
  assert.equal(lift.hand,count===1?1:count-1);
  for(const step of steps)assert.equal(total(step.board)+step.hand,48);
  assert.deepEqual(steps.at(-1).board,result.state.board);
 }
});
