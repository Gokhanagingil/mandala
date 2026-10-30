// Turkish Mangala. Bottom: 0..5, home 6. Top: 7..12, home 13.
export const storeOf = player => player === 0 ? 6 : 13;
export const pitsOf = player => player === 0 ? [0,1,2,3,4,5] : [7,8,9,10,11,12];
export const owns = (player, pit) => pitsOf(player).includes(pit);
export const opposite = pit => 12 - pit;
export function initialState(turn = 0) {
  return {board: [4,4,4,4,4,4,0,4,4,4,4,4,4,0], turn, ended: false, winner: null, moves: 0};
}
export function validState(s) {
  if (!s || !Array.isArray(s.board) || s.board.length !== 14 || ![0,1].includes(s.turn) ||
      !Number.isSafeInteger(s.moves) || s.moves < 0 || typeof s.ended !== 'boolean' ||
      s.board.some(n => !Number.isSafeInteger(n) || n < 0 || n > 48) || s.board.reduce((a,b)=>a+b,0) !== 48) return false;
  const empty = [0,1].map(p=>pitsOf(p).every(i=>s.board[i]===0));
  if (s.ended) return empty.every(Boolean) && s.winner === (s.board[6] === s.board[13] ? null : s.board[6] > s.board[13] ? 0 : 1);
  return !empty.some(Boolean) && s.winner === null;
}
export function legalMoves(state) {
  return state.ended ? [] : pitsOf(state.turn).filter(i => state.board[i] > 0);
}
export function move(state, pit, trace = false) {
  if (!Number.isInteger(pit) || !legalMoves(state).includes(pit)) throw new Error('Bu kuyudan hamle yapılamaz.');
  const player = state.turn, board = state.board.slice(), home = storeOf(player);
  let stones = board[pit], cursor = pit;
  const events = [], path = [];
  const emit = (type, data = {}) => {if (trace) events.push({type, ...data, board:board.slice()});};
  board[pit] = stones === 1 ? 0 : 1;
  stones -= stones === 1 ? 0 : 1;
  emit('lift', {pit});
  while (stones > 0) {
    cursor = (cursor + 1) % 14;
    if (cursor === storeOf(1-player)) continue;
    board[cursor]++; stones--; path.push(cursor); emit('drop', {pit:cursor});
  }
  let captured = 0, captureKind = null;
  const capturePits = [];
  if (owns(1-player,cursor) && board[cursor] % 2 === 0) {
    captured=board[cursor]; captureKind='even'; capturePits.push(cursor);
  } else if (owns(player,cursor) && board[cursor] === 1 && board[opposite(cursor)] > 0) {
    captured=board[cursor]+board[opposite(cursor)]; captureKind='opposite'; capturePits.push(cursor,opposite(cursor));
  }
  if (captured) {for (const i of capturePits) board[i]=0; board[home]+=captured; emit('capture',{pits:capturePits,player,count:captured});}
  let ended=false, winner=null, swept=0, sweepPlayer=null;
  for (const p of [0,1]) {
    if (pitsOf(p).every(i=>board[i]===0)) {
      ended=true; sweepPlayer=p;
      for (const i of pitsOf(1-p)) {swept+=board[i];board[i]=0;}
      board[storeOf(p)]+=swept;
      emit('sweep',{player:p,count:swept});
      winner=board[6]===board[13]?null:board[6]>board[13]?0:1;
      break;
    }
  }
  const extra = !ended && cursor===home;
  const next={board,turn:extra?player:1-player,ended,winner,moves:state.moves+1};
  return {state:next,player,pit,last:cursor,path,captured,captureKind,capturePits,extra,swept,sweepPlayer,gain:board[home]-state.board[home],events};
}
export function explain(result) {
  const bits=[];
  if(result.captureKind==='even') bits.push(`Rakip kuyudaki sayı çift oldu; ${result.captured} taş hazinene geçti.`);
  if(result.captureKind==='opposite') bits.push(`Son taş boş kuyuna düştü; karşı kuyu ile birlikte ${result.captured} taş topladın.`);
  if(result.extra) bits.push('Son taş hazinene düştü. Bir hamle daha senin!');
  if(result.swept) bits.push(`Kuyularını ilk boşaltan oyuncu kalan ${result.swept} taşı da aldı.`);
  if(!bits.length) bits.push(result.state.ended?'Taşlar toplandı. El tamamlandı.':'Taşlar dağıtıldı. Sıra diğer oyuncuda.');
  return bits.join(' ');
}
