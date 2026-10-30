import {initialState,validState,legalMoves,move} from './engine.js';
export function validSession(s){
 if(!(s?.version===1&&['solo','local'].includes(s.mode)&&validState(s.state)&&['easy','medium','hard'].includes(s.level)&&['balanced','bold','defensive'].includes(s.style)&&typeof s.assisted==='boolean'&&[1,2].includes(s.target)&&[0,1].includes(s.starter)&&Number.isInteger(s.round)&&s.round>0&&typeof s.recorded==='boolean'&&Array.isArray(s.wins)&&s.wins.length===2&&s.wins.every(n=>Number.isInteger(n)&&n>=0&&n<=s.target)&&Array.isArray(s.names)&&s.names.length===2&&s.names.every(n=>typeof n==='string'&&n.length>0&&n.length<=24)&&Array.isArray(s.history)&&s.history.length<=2000))return false;
 let current=initialState(s.starter);
 for(const h of s.history){if(!h||!validState(h.before)||JSON.stringify(current)!==JSON.stringify(h.before)||!legalMoves(current).includes(h.pit))return false;current=move(current,h.pit).state;}
 return JSON.stringify(current)===JSON.stringify(s.state)&&(!s.recorded||s.state.ended);
}
// True only on the first settlement, so repeated rendering/resume cannot add wins.
export function settleRound(session){
 if(!session.state.ended||session.recorded)return false;
 session.recorded=true;
 if(session.state.winner!==null)session.wins[session.state.winner]++;
 return true;
}
export function advanceRound(session){
 if(!session.state.ended||!session.recorded)throw Error('Önce bu el tamamlanmalı.');
 const over=session.target===1||session.wins.some(n=>n>=session.target);
 if(over){session.wins=[0,0];session.round=1;}else session.round++;
 session.starter=1-session.starter;
 session.state=initialState(session.starter);
 session.history=[];session.recorded=false;
 return session;
}
