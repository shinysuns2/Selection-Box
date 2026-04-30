const ADMIN_EMAIL = "ryan@playte.com";
const SUPABASE_URL = "https://nzvmiwfdpjpkamyisvoc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_84BLwfndOfmoVsgpy7Pr-Q_b5iBRqXS";
const LOCAL_KEY = "selection-box-local-v2";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const i18n = {
  ko: { appTitle: "Selection Box Planner", gamesTitle: "게임 목록", boxLabel: "박스", categoryLabel: "카테고리", playersLabel: "인원수", difficultyLabel: "난이도", selectedTitle: "선택 박스", usedLabel: "사용", remainingLabel: "남음", fillLabel: "채움률", recommendTitle: "추천 게임", promoTitle: "홍보 버튼 관리", adminLoginTitle: "관리자 로그인", adminPanelTitle: "관리자 패널", manageBoxTitle: "박스 관리", manageGameTitle: "게임 관리", all: "전체", allPlayers: "전체 인원", allDifficulty: "전체 난이도", add: "담기", overflowMsg: "남은 공간이 부족해서 담을 수 없습니다.", noRecommend: "추천 게임이 없습니다.", diff_beginner: "초보자", diff_intermediate: "중급자", diff_advanced: "고급자", resetFilters: "필터 초기화", exportImage: "이미지 생성", resetSelection: "박스 초기화", dragHintDesktop: "데스크탑에서는 게임 카드를 드래그해서 박스에 담을 수 있어요.", dragHintTouch: "게임 카드의 '담기' 버튼으로 박스에 추가할 수 있어요.", cancel: "취소", login: "로그인", sort_abc: "ABC순", sort_thickness: "두께순" },
  en: { appTitle: "Selection Box Planner", gamesTitle: "Games", boxLabel: "Box", categoryLabel: "Category", playersLabel: "Players", difficultyLabel: "Difficulty", selectedTitle: "Selected Box", usedLabel: "Used", remainingLabel: "Remaining", fillLabel: "Fill", recommendTitle: "Recommended Games", promoTitle: "Promo Button Admin", adminLoginTitle: "Admin Login", adminPanelTitle: "Admin Panel", manageBoxTitle: "Manage Boxes", manageGameTitle: "Manage Games", all: "All", allPlayers: "All players", allDifficulty: "All difficulties", add: "Add", overflowMsg: "Not enough remaining space to add this game.", noRecommend: "No recommended games.", diff_beginner: "Gateway", diff_intermediate: "Mid-weight", diff_advanced: "Heavy", resetFilters: "Reset filters", exportImage: "Export Image", resetSelection: "Clear Box", dragHintDesktop: "On desktop, drag game cards into the box.", dragHintTouch: "Use the Add button on each game card to place it in the box.", cancel: "Cancel", login: "Login", sort_abc: "A–Z", sort_thickness: "Thickness" },
  ja: { appTitle: "Selection Box Planner", gamesTitle: "ゲーム一覧", boxLabel: "ボックス", categoryLabel: "カテゴリ", playersLabel: "人数", difficultyLabel: "難易度", selectedTitle: "選択ボックス", usedLabel: "使用", remainingLabel: "残り", fillLabel: "充填率", recommendTitle: "おすすめゲーム", promoTitle: "プロモボタン管理", adminLoginTitle: "管理者ログイン", adminPanelTitle: "管理者パネル", manageBoxTitle: "ボックス管理", manageGameTitle: "ゲーム管理", all: "すべて", allPlayers: "すべての人数", allDifficulty: "すべての難易度", add: "追加", overflowMsg: "残り容量が足りないため追加できません。", noRecommend: "おすすめゲームがありません。", diff_beginner: "入門", diff_intermediate: "中量級", diff_advanced: "重量級", resetFilters: "絞り込み解除", exportImage: "画像を書き出し", resetSelection: "ボックス初期化", dragHintDesktop: "デスクトップではゲームカードをドラッグしてボックスに入れられます。", dragHintTouch: "各ゲームカードの追加ボタンでボックスに入れられます。", cancel: "キャンセル", login: "ログイン", sort_abc: "あいうえお順", sort_thickness: "厚み順" },
};

const defaultState = { lang: "ko", dark: false, selectedBoxId: "b1", selectedCategory: "all", selectedPlayers: "all", selectedDifficulty: "all", sortBy: "abc", boxes: [{ id: "b1", name: { ko: "기본 박스", en: "Default Box", ja: "基本ボックス" }, lengthCm: 29, imageUrl: "" }], categories: [{ id: "c1", name: { ko: "트릭테이킹", en: "Trick-taking", ja: "トリックテイキング" } }, { id: "c2", name: { ko: "클라이밍", en: "Ladder Climbing", ja: "クライミング" } }, { id: "c3", name: { ko: "푸시 유어 럭", en: "Push Your Luck", ja: "プッシュユアラック" } }], games: [], promoLinks: [{ name: "", url: "" }, { name: "", url: "" }, { name: "", url: "" }], selectedGameIds: [] };

let state = loadState();
const el = (id) => document.getElementById(id);
const dedupeCategories = (list) => { const seen = new Set(); return (list || []).filter((c) => { const key = String(c.id || "").trim(); if (seen.has(key)) return false; seen.add(key); return true; }); };

function loadState() { try { const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}"); const loaded = { ...defaultState, ...local }; loaded.selectedCategory ||= "all"; loaded.selectedPlayers ||= "all"; loaded.selectedDifficulty ||= "all"; loaded.sortBy ||= "abc"; loaded.categories = dedupeCategories(loaded.categories || []); return loaded; } catch { return structuredClone(defaultState); } }
function persist() { localStorage.setItem(LOCAL_KEY, JSON.stringify({ lang: state.lang, dark: state.dark, selectedBoxId: state.selectedBoxId, selectedCategory: state.selectedCategory, selectedPlayers: state.selectedPlayers, selectedDifficulty: state.selectedDifficulty, sortBy: state.sortBy, selectedGameIds: state.selectedGameIds })); }
function text(key) { return i18n[state.lang]?.[key] ?? i18n.ko[key] ?? key; }
function nameOf(item) { return item?.name?.[state.lang] || item?.name?.ko || "-"; }
function difficultyTier(v) { const n = Number(v || 0); if (n <= 1) return "beginner"; if (n === 2) return "intermediate"; return "advanced"; }
function difficultyLabel(v) { return text(`diff_${difficultyTier(v)}`); }
function selectedBox() { return state.boxes.find((b) => b.id === state.selectedBoxId) || state.boxes[0]; }
function selectedGames() { return state.selectedGameIds.map((id) => state.games.find((g) => g.id === id)).filter(Boolean); }
function calcUsed() { return selectedGames().reduce((sum, g) => sum + Number(g.lengthCm), 0); }
function canFitGame(game) { return Number(game.lengthCm) <= selectedBox().lengthCm - calcUsed() + 0.0001; }

function renderSelectors() {
  el("boxSelect").innerHTML = state.boxes.map((b) => `<option value="${b.id}">${nameOf(b)} (${b.lengthCm}cm)</option>`).join("");
  el("boxSelect").value = selectedBox().id;
  el("categorySelect").innerHTML = [`<option value="all">${text("all")}</option>`, ...state.categories.map((c) => `<option value="${c.id}">${nameOf(c)}</option>`)].join("");
  el("categorySelect").value = state.selectedCategory;
}

function renderGames() {
  const q = el("searchInput")?.value?.trim().toLowerCase() || "";
  const list = state.games.filter((g) => {
    const playersOk = state.selectedPlayers === "all" || (state.selectedPlayers === "6plus" ? Number(g.playersMax) >= 6 : Number(g.playersMin) <= Number(state.selectedPlayers) && Number(state.selectedPlayers) <= Number(g.playersMax));
    const difficultyOk = state.selectedDifficulty === "all" || state.selectedDifficulty === difficultyTier(g.difficulty);
    const nameOk = Object.values(g.name).some((n) => n.toLowerCase().includes(q));
    const fitOk = canFitGame(g);
    const categoryOk = state.selectedCategory === "all" || g.categoryId === state.selectedCategory;
    return playersOk && difficultyOk && nameOk && fitOk && categoryOk;
  });
  const listEl = el("gamesList");
  listEl.innerHTML = list.map((g) => `<article class="card"><img src="${g.imageUrl}" alt="${nameOf(g)}" /><div class="meta"><div>${nameOf(g)}</div><small>${g.lengthCm}cm · ${difficultyLabel(g.difficulty)}</small></div><button class="btn add-btn" data-id="${g.id}">${text("add")}</button></article>`).join("");
}

function render() { renderSelectors(); renderGames(); }
function bind() {
  el("categorySelect")?.addEventListener("change", (e) => { state.selectedCategory = e.target.value; persist(); renderGames(); });
  el("resetFiltersBtn")?.addEventListener("click", () => { if (el("searchInput")) el("searchInput").value = ""; state.selectedCategory = "all"; state.selectedPlayers = "all"; state.selectedDifficulty = "all"; persist(); render(); });
}
bind();
render();
