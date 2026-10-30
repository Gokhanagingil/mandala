import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,move,legalMoves} from '../dist/engine.js';
import {validSession,settleRound,advanceRound} from '../dist/session.js';
const make=()=>({version:1,state:initialState(),mode:'local',level:'medium',style:'balanced',assisted:true,target:2,wins:[0,0],starter:0,round:1,names:['Ayşe','Deniz'],history:[],recorded:false});
function play(s,pit){s.history.push({before:s.state,pit});s.state=move(s.state,pit).state;}
function finish(s){let n=0;while(!s.state.ended&&n++<500){const p=legalMoves(s.state);play(s,p[n%p.length]);}assert(s.state.ended);settleRound(s);}
test('save/restore preserves two-player turns and exact board history',()=>{const s=make();play(s,0);assert.equal(s.state.turn,1);const saved=JSON.parse(JSON.stringify(s));assert(validSession(saved));assert.deepEqual(saved,s);});
test('resume preserves an extra turn and a pending computer turn',()=>{const s=make();s.mode='solo';play(s,3);assert.equal(s.state.turn,0);assert(validSession(s));play(s,0);assert.equal(s.state.turn,1);assert(validSession(s));});
test('malformed, divergent and reordered save history is rejected',()=>{const s=make();play(s,0);assert(validSession(s));const bad=structuredClone(s);bad.state.board[1]--;bad.state.board[2]++;assert(!validSession(bad));assert(!validSession({...s,recorded:true}));assert(!validSession({...s,names:['',null]}));assert(!validSession({...s,history:[{before:initialState(),pit:8}]}));});
test('one finished round is counted exactly once',()=>{const s=make();finish(s);const wins=[...s.wins];assert.equal(settleRound(s),false);assert.deepEqual(s.wins,wins);assert(validSession(s));});
test('mini tournament alternates first player through completion and rematch',()=>{const s=make();for(let i=0;i<8;i++){const starter=s.starter;finish(s);const wins=s.wins.slice(),round=s.round,over=wins.some(n=>n>=2);advanceRound(s);assert.equal(s.starter,1-starter);assert.equal(s.round,over?1:round+1);assert.deepEqual(s.wins,over?[0,0]:wins);assert.equal(s.state.moves,0);assert(validSession(s));}});
test('draw awards no victory and next round changes first player',()=>{const s=make();s.state={board:[0,0,0,0,0,0,24,0,0,0,0,0,0,24],turn:1,ended:true,winner:null,moves:30};settleRound(s);assert.deepEqual(s.wins,[0,0]);advanceRound(s);assert.equal(s.starter,1);assert.equal(s.round,2);});
test('unfinished round cannot be advanced or scored',()=>{const s=make();assert.equal(settleRound(s),false);assert.throws(()=>advanceRound(s));});
