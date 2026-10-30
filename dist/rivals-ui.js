import {OPPONENTS,opponentById,availableOpponents,canSelectOpponent,matchFinished} from './opponents.js';

export function portrait(o){
 const i=OPPONENTS.indexOf(o),skin=['#e8b994','#d7a178','#d6ab8b','#e9be9f','#b88363','#ecc6a7'][i];
 const hair=['M26 43V34Q26 12 50 15Q72 14 74 38L65 32L59 24Q48 38 26 43','M22 61V35Q22 12 49 12Q78 12 78 42V67L65 61V33Q40 42 32 33V61Z','M26 38Q22 17 48 14L69 17L76 31L61 29L55 24L47 32Z','M24 55V32Q29 11 51 14Q77 15 76 40L69 60L65 33Q45 22 32 38L32 59Z','M26 37Q24 17 46 16Q65 12 73 34L59 27L34 29Z','M20 61V35Q21 11 49 12Q78 11 79 36V65L65 60L66 32Q42 42 31 32V63Z'][i];
 return `<svg class="rival-portrait" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="49" fill="${o.color}"/><path d="M14 94Q15 72 36 70H64Q85 74 87 94" fill="#294d44"/><path d="M42 61V74Q50 83 58 74V61" fill="${skin}"/><ellipse cx="50" cy="44" rx="23" ry="28" fill="${skin}"/><path d="${hair}" fill="${i===5?'#67615c':'#49392e'}"/><path d="M39 45H41M59 45H61" stroke="#49392e" stroke-width="3" stroke-linecap="round"/><path d="M44 57Q50 61 56 57" fill="none" stroke="#8c5846" stroke-width="2" stroke-linecap="round"/>${i===4?'<path d="M29 42H45V51H31ZM55 42H71L69 51H55ZM45 45H55" fill="none" stroke="#37483f" stroke-width="2"/>':''}<path d="M35 74L50 85L65 74" fill="none" stroke="#f0dfbd" stroke-width="2"/><circle cx="82" cy="19" r="5" fill="#fff8dc" opacity=".65"/></svg>`;
}
export function opponentSetup(career){
 const o=opponentById(career.selected),n=availableOpponents(career).length;
 return `<section class="rival-setup" aria-label="Bilgisayar rakibin"><div class="rival-path-heading"><strong>Rakiplerin yolu</strong><span>${n} / 6 rakip açık</span></div><button class="selected-rival" data-action="opponents" aria-label="Rakip seç. Seçili: ${o.name}, ${o.difficulty}">${portrait(o)}<span class="rival-summary"><span class="rival-rank">${OPPONENTS.indexOf(o)+1}. masa · ${o.difficulty}</span><strong>${o.name}</strong><em>“${o.quote}”</em><span class="rival-change">Rakibini seç <span aria-hidden="true">↗</span></span></span></button><div class="rival-path" aria-hidden="true">${OPPONENTS.map((r,i)=>`<span class="${career.cleared.includes(r.id)?'cleared':i<n?'open':''} ${r.id===o.id?'current':''}">${career.cleared.includes(r.id)?'✓':i+1}</span>`).join('')}</div><p class="rival-path-note">${career.cleared.length===6?'Bütün masaları tamamladın. Favori rakibini seç, yeniden oyna.':'Maç kazan, sıradaki rakibi aç. Önceki rakiplere her zaman dönebilirsin.'}</p></section>`;
}
export function rivalCards(career){return `<p class="rivals-intro">Çok kolay bir masadan ustalığa doğru. Bir rakibi yenince sıradaki açılır; açtığın rakipler sende kalır. Mini turnuvada iki galibiyetle seriyi tamamla.</p><div class="rival-grid">${OPPONENTS.map((o,i)=>{const open=canSelectOpponent(career,o.id),cleared=career.cleared.includes(o.id),selected=career.selected===o.id;return `<button class="rival-card ${open?'':'locked'} ${selected?'chosen':''}" data-action="select-opponent" data-id="${o.id}" ${open?'':'disabled'} aria-pressed="${selected}"><span class="rival-card-top">${portrait(o)}<span><span class="rival-rank">${i+1}. masa · ${o.difficulty}</span><strong>${o.name}</strong><small>${o.title}</small></span></span><span class="rival-description">${o.description}</span><span class="rival-card-status">${!open?`◇ Açmak için ${OPPONENTS[i-1].name} karşısında kazan`:selected?'● Seçili rakibin':cleared?'✓ Yenildi · tekrar oyna':'Masaya otur →'}</span></button>`;}).join('')}</div><p class="rivals-footnote">Kaybetmek ilerlemeni silmez. Seçimin ve açılan rakipler bu tarayıcıda saklanır.</p>`;}
export function nextOpponent(career,s){
 if(!s.opponentId||!matchFinished(s)||(s.target===1?s.state.winner!==0:s.wins[0]<s.target))return null;
 const next=OPPONENTS[OPPONENTS.findIndex(o=>o.id===s.opponentId)+1];
 return next&&canSelectOpponent(career,next.id)?next:null;
}
export function rivalResult(career,s){
 if(!s.opponentId||!matchFinished(s))return '';
 const next=nextOpponent(career,s);
 if(next)return `<div class="rival-promotion">${portrait(next)}<div><strong>Bir sonraki masa hazır.</strong><p>${next.name} · ${next.difficulty}<br>Hazırsan geç; istersen aynı rakiple devam et.</p></div></div>`;
 if(career.cleared.length===6)return '<div class="rival-promotion"><div><strong>Altı masa, kocaman bir yolculuk.</strong><p>Bütün rakipleri yendin. Favori rakibinle yeniden buluşabilirsin.</p></div></div>';
 return `<p class="rival-reassurance">${s.state.winner===null?'Güzel mücadele! Sıradaki rakibi açmak için maçı kazan.':'İlerlemen güvende. İstersen yeniden dene; zor geldiyse daha önceki bir rakiple çalış.'}</p>`;
}
