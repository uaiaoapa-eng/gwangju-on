/* ========== 광주ON — 데모 인터랙션 (모든 데이터는 브라우저 localStorage에만 저장) ========== */

/* ----- 모바일 메뉴 ----- */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') nav.classList.remove('open');
});

/* ----- 숫자 카운트업 (스크롤 진입 시) ----- */
const counters = document.querySelectorAll('[data-count]');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const target = +en.target.dataset.count;
    const dur = 1200, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      en.target.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('ko-KR');
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: .4 });
counters.forEach(el => io.observe(el));

/* ----- AI 민원 챗 데모 (키워드 매칭, 시연용) ----- */
const CHAT_RULES = [
  { kw: ['폐기물', '쓰레기', '버리'], dept: '자치구 청소행정과',
    a: '대형 폐기물은 <b>배출 스티커</b>를 구매해 부착 후, 지정 장소에 내놓으시면 됩니다.<br>① 자치구 홈페이지 또는 동 행정복지센터에서 신고 ② 수수료 납부(소파 기준 5,000원 내외) ③ 지정일에 문 앞 배출' },
  { kw: ['주정차', '주차', '불법 주'], dept: '자치구 교통지도과',
    a: '불법 주정차는 <b>안전신문고 앱</b>으로 신고할 수 있습니다.<br>① 앱에서 "불법주정차" 선택 ② 1분 간격 사진 2장 촬영 ③ 위치 확인 후 제출 — 별도 방문 없이 처리됩니다.' },
  { kw: ['월세', '청년', '주거'], dept: '광주시 청년정책과',
    a: '청년 월세 지원은 <b>만 19~39세 무주택 청년</b> 대상이며, 월 최대 20만 원까지 지원됩니다(소득 기준 있음).<br>신청: 복지로(bokjiro.go.kr) 또는 동 행정복지센터 방문.' },
  { kw: ['전입', '이사'], dept: '동 행정복지센터',
    a: '전입신고는 이사 후 <b>14일 이내</b>에 해야 합니다.<br>① 정부24(gov.kr)에서 온라인 신고(공동인증 필요) 또는 ② 새 주소지 행정복지센터 방문(신분증 지참). 자동차 주소 변경도 함께 처리됩니다.' },
  { kw: ['가로등', '조명', '고장'], dept: '자치구 도로과 · 시설관리공단',
    a: '가로등 고장은 <b>가로등 기둥의 관리번호</b>를 확인해 알려주시면 가장 빠릅니다.<br>안전신문고 앱 또는 120 콜센터로 접수하시면 통상 3일 내 보수됩니다. 접수를 도와드릴까요?' },
  { kw: ['보조금', '지원금', '수당'], dept: '광주시 사회복지과',
    a: '지원 대상 사업이 여러 가지가 있어요. <b>연령·가구 형태</b>를 알려주시면 받을 수 있는 보조금을 모두 찾아드립니다.<br>대표적으로 출산·양육수당, 청년수당, 어르신 교통지원이 있습니다.' },
];
const CHAT_FALLBACK = { dept: '민원 총괄 — 120 콜센터 연계',
  a: '해당 민원의 담당 부서를 찾고 있어요. 정식 서비스에서는 Claude가 민원 내용을 분석해 <b>부서 데이터베이스를 조회</b>한 뒤 정확한 절차를 안내합니다.<br>데모에서는 위의 버튼 예시(폐기물·주정차·월세·전입)를 눌러보세요. 🙂' };

const chatLog = document.getElementById('chatLog');
const chatForm = document.getElementById('chatForm');
const chatText = document.getElementById('chatText');

function addMsg(role, html) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.innerHTML = '<div class="bubble">' + html + '</div>';
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}
function botReply(q) {
  const rule = CHAT_RULES.find(r => r.kw.some(k => q.includes(k))) || CHAT_FALLBACK;
  const typing = addMsg('bot', '입력 중…');
  setTimeout(() => {
    typing.querySelector('.bubble').innerHTML =
      rule.a + '<span class="dept">📍 담당: ' + rule.dept + ' · 본 응답은 시연용입니다</span>';
    chatLog.scrollTop = chatLog.scrollHeight;
  }, 700);
}
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = chatText.value.trim();
  if (!q) return;
  addMsg('user', q.replace(/</g, '&lt;'));
  chatText.value = '';
  botReply(q);
});
document.getElementById('chatQuick').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  addMsg('user', btn.dataset.q);
  botReply(btn.dataset.q);
});

/* ----- 시민 제안 (localStorage) ----- */
const GOAL = 100;
const SEED_PROPOSALS = [
  { id: 's1', cat: '교통', title: '상무지구 ↔ 금호지구 자전거 도로 연결', body: '끊겨 있는 자전거 도로를 연결하면 출퇴근 자전거 이용이 크게 늘어날 것입니다.', likes: 87 },
  { id: 's2', cat: '문화·관광', title: '충장로 금요 야시장 정례화', body: '지난 축제 때 반응이 좋았던 야시장을 매주 금요일 정례 운영하면 원도심 상권에 활력이 생깁니다.', likes: 64 },
  { id: 's3', cat: '환경', title: '푸른길 공원 반려견 놀이터 조성', body: '남구 푸른길 공원 유휴 부지에 반려견 놀이터를 만들어 주세요.', likes: 41 },
];
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
};
let proposals = store.get('gjon_proposals', SEED_PROPOSALS);
let myLikes = store.get('gjon_likes', []);
const proposalList = document.getElementById('proposalList');

function renderProposals() {
  proposalList.innerHTML = proposals
    .slice().sort((a, b) => b.likes - a.likes)
    .map(p => {
      const pct = Math.min(100, Math.round(p.likes / GOAL * 100));
      const liked = myLikes.includes(p.id);
      const answered = p.likes >= GOAL;
      return `<div class="card proposal">
        <div class="p-main">
          <span class="p-cat ${answered ? 'answered' : ''}">${answered ? '🏛️ 부서 답변 대기' : p.cat}</span>
          <h4>${p.title}</h4>
          <p>${p.body}</p>
          <div class="p-progress"><i style="width:${pct}%"></i></div>
        </div>
        <button class="like-btn ${liked ? 'liked' : ''}" data-id="${p.id}" aria-label="공감하기">
          ${liked ? '✓ 공감' : '🤍 공감'}<br>${p.likes}/${GOAL}
        </button>
      </div>`;
    }).join('');
}
proposalList.addEventListener('click', e => {
  const btn = e.target.closest('.like-btn');
  if (!btn) return;
  const id = btn.dataset.id;
  const p = proposals.find(x => x.id === id);
  if (myLikes.includes(id)) { myLikes = myLikes.filter(x => x !== id); p.likes--; }
  else { myLikes.push(id); p.likes++; }
  store.set('gjon_proposals', proposals);
  store.set('gjon_likes', myLikes);
  renderProposals();
});
document.getElementById('proposalForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('pTitle').value.trim();
  const body = document.getElementById('pBody').value.trim();
  if (!title || !body) return;
  proposals.push({ id: 'p' + Math.random().toString(36).slice(2, 9), cat: document.getElementById('pCat').value, title, body, likes: 1 });
  store.set('gjon_proposals', proposals);
  e.target.reset();
  renderProposals();
  document.getElementById('proposalList').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
renderProposals();

/* ----- 정책 라이브 투표 (localStorage) ----- */
const VOTE_OPTIONS = [
  { id: 'v1', label: '🚸 통학로 · 보행 안전 개선', base: 1842 },
  { id: 'v2', label: '🌳 도심 공원 · 녹지 확충', base: 1517 },
  { id: 'v3', label: '🚌 대중교통 노선 · 배차 개선', base: 1290 },
  { id: 'v4', label: '🎭 청년 문화공간 조성', base: 968 },
];
let extraVotes = store.get('gjon_votes', {});      // {optionId: n}
let myVote = store.get('gjon_myvote', null);
const voteOptionsEl = document.getElementById('voteOptions');
const voteMeta = document.getElementById('voteMeta');

function renderVote() {
  const counts = VOTE_OPTIONS.map(o => o.base + (extraVotes[o.id] || 0));
  const total = counts.reduce((a, b) => a + b, 0);
  voteOptionsEl.innerHTML = VOTE_OPTIONS.map((o, i) => {
    const pct = (counts[i] / total * 100).toFixed(1);
    return `<div class="vote-option ${myVote === o.id ? 'voted-mine' : ''}" data-id="${o.id}" role="button" tabindex="0">
      <div class="vote-bar" style="width:${pct}%"></div>
      <div class="vo-head"><span>${o.label}${myVote === o.id ? ' · 내 투표 ✓' : ''}</span><span class="vo-pct">${pct}% (${counts[i].toLocaleString()}표)</span></div>
    </div>`;
  }).join('');
  voteMeta.textContent = myVote
    ? `총 ${total.toLocaleString()}표 · 다른 항목을 누르면 투표를 변경할 수 있습니다 (데모)`
    : `총 ${total.toLocaleString()}표 · 항목을 눌러 투표하세요 (1인 1표)`;
}
function castVote(id) {
  if (myVote === id) return;
  if (myVote) extraVotes[myVote] = (extraVotes[myVote] || 0) - 1;
  extraVotes[id] = (extraVotes[id] || 0) + 1;
  myVote = id;
  store.set('gjon_votes', extraVotes);
  store.set('gjon_myvote', myVote);
  renderVote();
}
voteOptionsEl.addEventListener('click', e => {
  const opt = e.target.closest('.vote-option');
  if (opt) castVote(opt.dataset.id);
});
voteOptionsEl.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const opt = e.target.closest('.vote-option');
  if (opt) { e.preventDefault(); castVote(opt.dataset.id); }
});
renderVote();
