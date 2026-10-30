// The order is the learning path; ids also belong to saved games, so keep them stable.
export const OPPONENTS=Object.freeze([
 {id:'deniz',name:'Deniz',title:'İlk masa arkadaşı',difficulty:'Çok kolay',level:'beginner',style:'balanced',color:'#78a48d',quote:'Birlikte keşfedelim.',description:'Yeni başlıyor. Fırsatları sık sık kaçırır; taşların yolunu öğrenmek için rahat bir eşlikçi.'},
 {id:'ece',name:'Ece',title:'Meraklı oyuncu',difficulty:'Kolay',level:'novice',style:'balanced',color:'#c7a86c',quote:'Son taş nereye düşer?',description:'Basit fırsatları görmeye başlar ama bazen gözünden kaçırır. Küçük hesaplarını dene.'},
 {id:'can',name:'Can',title:'Fırsat avcısı',difficulty:'Kolay +',level:'easy',style:'balanced',color:'#bc8b73',quote:'Bir hamle daha, neden olmasın?',description:'Ek sıra ve yakalama fırsatlarını kollar. Son taşının yerini düşünmek işe yarar.'},
 {id:'ada',name:'Ada',title:'Plan kuran',difficulty:'Orta',level:'steady',style:'balanced',color:'#8d9eae',quote:'Sen oynarken ben de düşünüyorum.',description:'Karşı hamleni hesaba katar. Yalnız kazancını değil, açık bıraktığın kuyuları da izle.'},
 {id:'bora',name:'Bora',title:'İnce hesapçı',difficulty:'Zor',level:'medium',style:'balanced',color:'#9a9270',quote:'Küçük bir kuyu, büyük bir fırsat.',description:'Birkaç hamle ilerisini tartar. Dağıtımın sonunda oluşacak tahtayı hayal etmeyi dene.'},
 {id:'lale',name:'Lale',title:'Masanın ustası',difficulty:'Usta',level:'hard',style:'balanced',color:'#9d879f',quote:'Her taşın bir zamanı var.',description:'En derin hesabı yapar. Ek sıraları ve el sonunu birlikte düşünmeni ister.'}
].map(Object.freeze));
export const opponentById=id=>OPPONENTS.find(o=>o.id===id);
export function normalizeCareer(raw){
 const cleared=[];
 if(raw?.version===1&&Array.isArray(raw.cleared))for(const o of OPPONENTS){if(!raw.cleared.includes(o.id))break;cleared.push(o.id);}
 const available=OPPONENTS.slice(0,Math.min(OPPONENTS.length,cleared.length+1));
 return {version:1,cleared,selected:available.some(o=>o.id===raw?.selected)?raw.selected:available[0].id};
}
export const availableOpponents=career=>OPPONENTS.slice(0,Math.min(OPPONENTS.length,career.cleared.length+1));
export const canSelectOpponent=(career,id)=>availableOpponents(career).some(o=>o.id===id);
export function selectOpponent(career,id){return canSelectOpponent(career,id)?{...career,selected:id}:career;}
export const matchFinished=s=>s.state.ended&&(s.target===1||s.wins.some(n=>n>=s.target));
// A tournament unlock requires the whole match, never just its first round.
// Only the frontier can advance. Replaying an older opponent cannot skip anyone.
export function recordOpponentVictory(career,s){
 if(s.mode!=='solo'||!s.recorded||!matchFinished(s)||(s.target===1?s.state.winner!==0:s.wins[0]<s.target))return career;
 const next=OPPONENTS[career.cleared.length];
 if(!next||s.opponentId!==next.id)return career;
 return {...career,cleared:[...career.cleared,next.id]};
}
