const ADMIN_EMAIL = "ryan@playte.com";
const SUPABASE_URL = "https://nzvmiwfdpjpkamyisvoc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_84BLwfndOfmoVsgpy7Pr-Q_b5iBRqXS";
const LOCAL_KEY = "selection-box-local-v2";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const i18n = {
  ko: {
    appTitle: "Selection Box Planner",
    gamesTitle: "게임 목록",
    boxLabel: "박스",
    categoryLabel: "카테고리",
    playersLabel: "인원수",
    difficultyLabel: "난이도",
    selectedTitle: "선택 박스",
    usedLabel: "사용",
    remainingLabel: "남음",
    fillLabel: "채움률",
    recommendTitle: "추천 게임",
    promoTitle: "홍보 버튼 관리",
    adminLoginTitle: "관리자 로그인",
    adminPanelTitle: "관리자 패널",
    manageBoxTitle: "박스 관리",
    manageGameTitle: "게임 관리",
    all: "전체",
    allPlayers: "전체 인원",
    allDifficulty: "전체 난이도",
    add: "담기",
    full: "초과됨",
    overflowMsg: "남은 공간이 부족해서 담을 수 없습니다.",
    noRecommend: "추천 게임이 없습니다.",
    diff_beginner: "초보자",
    diff_intermediate: "중급자",
    diff_advanced: "고급자",
    resetFilters: "필터 초기화",
    exportImage: "이미지 생성",
    resetSelection: "박스 초기화",
    dragHintDesktop: "데스크탑에서는 게임 카드를 드래그해서 박스에 담을 수 있어요.",
    dragHintTouch: "게임 카드의 '담기' 버튼으로 박스에 추가할 수 있어요.",
    cancel: "취소",
    login: "로그인",
    sort_abc: "ABC순",
    sort_thickness: "두께순",
  },
  en: {
    appTitle: "Selection Box Planner",
    gamesTitle: "Games",
    boxLabel: "Box",
    categoryLabel: "Category",
    playersLabel: "Players",
    difficultyLabel: "Difficulty",
    selectedTitle: "Selected Box",
    usedLabel: "Used",
    remainingLabel: "Remaining",
    fillLabel: "Fill",
    recommendTitle: "Recommended Games",
    promoTitle: "Promo Button Admin",
    adminLoginTitle: "Admin Login",
    adminPanelTitle: "Admin Panel",
    manageBoxTitle: "Manage Boxes",
    manageGameTitle: "Manage Games",
    all: "All",
    allPlayers: "All players",
    allDifficulty: "All difficulties",
    add: "Add",
    full: "Overflow",
    overflowMsg: "Not enough remaining space to add this game.",
    noRecommend: "No recommended games.",
    diff_beginner: "Gateway",
    diff_intermediate: "Mid-weight",
    diff_advanced: "Heavy",
    resetFilters: "Reset filters",
    exportImage: "Export Image",
    resetSelection: "Clear Box",
    dragHintDesktop: "On desktop, drag game cards into the box.",
    dragHintTouch: "Use the Add button on each game card to place it in the box.",
    cancel: "Cancel",
    login: "Login",
    sort_abc: "A–Z",
    sort_thickness: "Thickness",
  },
  ja: {
    appTitle: "Selection Box Planner",
    gamesTitle: "ゲーム一覧",
    boxLabel: "ボックス",
    categoryLabel: "カテゴリ",
    playersLabel: "人数",
    difficultyLabel: "難易度",
    selectedTitle: "選択ボックス",
    usedLabel: "使用",
    remainingLabel: "残り",
    fillLabel: "充填率",
    recommendTitle: "おすすめゲーム",
    promoTitle: "プロモボタン管理",
    adminLoginTitle: "管理者ログイン",
    adminPanelTitle: "管理者パネル",
    manageBoxTitle: "ボックス管理",
    manageGameTitle: "ゲーム管理",
    all: "すべて",
    allPlayers: "すべての人数",
    allDifficulty: "すべての難易度",
    add: "追加",
    full: "超過",
    overflowMsg: "残り容量が足りないため追加できません。",
    noRecommend: "おすすめゲームがありません。",
    diff_beginner: "入門",
    diff_intermediate: "中量級",
    diff_advanced: "重量級",
    resetFilters: "絞り込み解除",
    exportImage: "画像を書き出し",
    resetSelection: "ボックス初期化",
    dragHintDesktop: "デスクトップではゲームカードをドラッグしてボックスに入れられます。",
    dragHintTouch: "各ゲームカードの追加ボタンでボックスに入れられます。",
    cancel: "キャンセル",
    login: "ログイン",
    sort_abc: "あいうえお順",
    sort_thickness: "厚み順",
  },
};

const defaultState = {
  lang: "ko",
  dark: false,
  selectedBoxId: "b1",
  selectedCategory: "all",
  selectedPlayers: "all",
  selectedDifficulty: "all",
  sortBy: "abc",
  checkedCategoryIds: [],
  boxes: [{ id: "b1", name: { ko: "기본 박스", en: "Default Box", ja: "基本ボックス" }, lengthCm: 29, imageUrl: "" }],
  categories: [
    { id: "c1", name: { ko: "트릭테이킹", en: "Trick-taking", ja: "トリックテイキング" } },
    { id: "c2", name: { ko: "클라이밍", en: "Ladder Climbing", ja: "クライミング" } },
    { id: "c3", name: { ko: "푸시 유어 럭", en: "Push Your Luck", ja: "プッシュユアラック" } },
    { id: "c4", name: { ko: "주사위 굴림", en: "Dice Rolling", ja: "ダイスロール" } },
    { id: "c5", name: { ko: "추리", en: "Deduction", ja: "推理" } },
    { id: "c6", name: { ko: "경매/입찰", en: "Auction / Bidding", ja: "オークション／入札" } },
    { id: "c7", name: { ko: "영향력 다수결", en: "Area Majority / Influence", ja: "エリアマジョリティ／影響力" } },
    { id: "c8", name: { ko: "셋 컬렉션", en: "Set Collection", ja: "セットコレクション" } },
    { id: "c9", name: { ko: "패턴 인식/매칭", en: "Pattern Recognition / Matching", ja: "パターン認識／マッチング" } },
    { id: "c10", name: { ko: "타일 배치/그리드 이동", en: "Tile Placement / Grid Movement", ja: "タイル配置／グリッド移動" } },
    { id: "c11", name: { ko: "기타", en: "Other / Misc", ja: "その他" } },
  ],
  games: [
    {
      id: "g1",
      name: { ko: "은하 전략", en: "Galaxy Tactics", ja: "銀河タクティクス" },
      lengthCm: 4.2, categoryId: "c1", playersMin: 2, playersMax: 4, difficulty: 4,
      imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=300&q=60",
      boxImageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=300&q=60",
    },
    {
      id: "g2",
      name: { ko: "파티 큐브", en: "Party Cube", ja: "パーティーキューブ" },
      lengthCm: 2.8, categoryId: "c2", playersMin: 3, playersMax: 8, difficulty: 2,
      imageUrl: "https://images.unsplash.com/photo-1603732551681-8f8f8e3b6f7f?auto=format&fit=crop&w=300&q=60",
      boxImageUrl: "https://images.unsplash.com/photo-1603732551681-8f8f8e3b6f7f?auto=format&fit=crop&w=300&q=60",
    },
    {
      id: "g3",
      name: { ko: "패밀리 트립", en: "Family Trip", ja: "ファミリートリップ" },
      lengthCm: 3.6, categoryId: "c3", playersMin: 2, playersMax: 5, difficulty: 3,
      imageUrl: "https://images.unsplash.com/photo-1529480780361-c8cb81eb5735?auto=format&fit=crop&w=300&q=60",
      boxImageUrl: "https://images.unsplash.com/photo-1529480780361-c8cb81eb5735?auto=format&fit=crop&w=300&q=60",
    },
  ],
  promoLinks: [{ name: "", url: "" }, { name: "", url: "" }, { name: "", url: "" }],
  selectedGameIds: [],
};

let state = loadState();
let draggingGameId = null;
const el = (id) => document.getElementById(id);

function dedupeCategories(list) {
  const seen = new Set();
  return (list || []).filter((c) => {
    const key = String(c.id || "").trim() || `${c.name?.en || ""}|${c.name?.ko || ""}|${c.name?.ja || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function loadState() {
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    const loaded = { ...defaultState, ...local };
    loaded.games = (loaded.games || []).map((g) => ({
      ...g,
      playersMin: Number(g.playersMin ?? 1),
      playersMax: Number(g.playersMax ?? Math.max(2, g.playersMin ?? 2)),
      difficulty: Number(g.difficulty ?? 3),
      boxImageUrl: g.boxImageUrl || g.imageUrl,
    }));
    loaded.boxes = (loaded.boxes || []).map((b) => ({ ...b, imageUrl: b.imageUrl || "" }));
    loaded.selectedPlayers ||= "all";
    loaded.selectedDifficulty ||= "all";
    loaded.sortBy ||= "abc";
    loaded.checkedCategoryIds ||= [];
    loaded.promoLinks = (loaded.promoLinks || defaultState.promoLinks).slice(0, 3);
    loaded.categories = dedupeCategories(loaded.categories || []);
    return loaded;
  } catch {
    return structuredClone(defaultState);
  }
}

function persist() {
  localStorage.setItem(
    LOCAL_KEY,
    JSON.stringify({
      lang: state.lang,
      dark: state.dark,
      selectedBoxId: state.selectedBoxId,
      selectedCategory: state.selectedCategory,
      selectedPlayers: state.selectedPlayers,
      selectedDifficulty: state.selectedDifficulty,
      sortBy: state.sortBy,
      selectedGameIds: state.selectedGameIds,
      checkedCategoryIds: state.checkedCategoryIds,
    })
  );
}

async function fetchPromoLinks() {
  const { data, error } = await supabaseClient
    .from("promo_links")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true })
    .limit(3);
  if (error) return;
  const links = (data || []).map((r) => ({ id: r.id, name: r.name || "", url: r.url || "" }));
  while (links.length < 3) links.push({ name: "", url: "" });
  state.promoLinks = links.slice(0, 3);
}

function text(key) { return i18n[state.lang]?.[key] ?? i18n.ko[key] ?? key; }
function nameOf(item) { return item?.name?.[state.lang] || item?.name?.ko || "-"; }
function difficultyTier(v) { const n = Number(v || 0); if (n <= 1) return "beginner"; if (n === 2) return "intermediate"; return "advanced"; }
function difficultyLabel(v) { return text(`diff_${difficultyTier(v)}`); }
function normalizeUrl(raw) { const v = String(raw || "").trim(); if (!v) return ""; return /^https?:\/\//i.test(v) ? v : `https://${v}`; }

function raiseIfError(error, fallback) {
  if (!error) return;
  alert(error.message ? `${fallback}\n${error.message}` : fallback);
  throw error;
}

async function fetchSharedData() {
  const [catRes, boxRes, gameRes] = await Promise.all([
    supabaseClient.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
    supabaseClient.from("boxes").select("*").eq("is_active", true).order("created_at", { ascending: true }),
    supabaseClient.from("games").select("*").eq("is_active", true).order("created_at", { ascending: true }),
  ]);
  raiseIfError(catRes.error, "카테고리 로딩 실패");
  raiseIfError(boxRes.error, "박스 로딩 실패");
  raiseIfError(gameRes.error, "게임 로딩 실패");

  if (catRes.data?.length) {
    state.categories = dedupeCategories(
      catRes.data.map((c) => ({ id: c.id, name: { ko: c.name_ko, en: c.name_en, ja: c.name_ja } }))
    );
  }
  if (boxRes.data?.length) {
    state.boxes = boxRes.data.map((b) => ({ id: b.id, name: { ko: b.name_ko, en: b.name_en, ja: b.name_ja }, lengthCm: Number(b.length_cm), imageUrl: b.image_url || "" }));
  }
  if (gameRes.data?.length) {
    state.games = gameRes.data.map((g) => ({
      id: g.id,
      name: { ko: g.name_ko, en: g.name_en, ja: g.name_ja },
      lengthCm: Number(g.length_cm),
      categoryId: g.category_id,
      playersMin: Number(g.players_min),
      playersMax: Number(g.players_max),
      difficulty: Number(g.difficulty),
      imageUrl: g.image_url,
      boxImageUrl: g.box_image_url || g.image_url,
    }));
  }

  if (!state.boxes.find((b) => b.id === state.selectedBoxId)) state.selectedBoxId = state.boxes[0]?.id || "b1";
  state.selectedGameIds = state.selectedGameIds.filter((id) => state.games.some((g) => g.id === id));

  await fetchPromoLinks();
  persist();
}

function selectedBox() { return state.boxes.find((b) => b.id === state.selectedBoxId) || state.boxes[0]; }
function selectedGames() { return state.selectedGameIds.map((id) => state.games.find((g) => g.id === id)).filter(Boolean); }
function calcUsed() { return selectedGames().reduce((sum, g) => sum + Number(g.lengthCm), 0); }
function canFitGame(game) { return Number(game.lengthCm) <= selectedBox().lengthCm - calcUsed() + 0.0001; }

function renderStaticText() {
  ["appTitle","gamesTitle","boxLabel","categoryLabel","selectedTitle","playersLabel","difficultyLabel","usedLabel","remainingLabel","fillLabel","recommendTitle","adminLoginTitle","adminPanelTitle","manageBoxTitle","manageGameTitle","promoTitle"]
    .forEach((k) => { const n = el(k); if (n) n.textContent = text(k); });

  if (el("cancelBtn")) el("cancelBtn").textContent = text("cancel");
  if (el("loginBtn")) el("loginBtn").textContent = text("login");
  if (el("resetFiltersBtn")) el("resetFiltersBtn").textContent = text("resetFilters");
  if (el("exportImageBtn")) el("exportImageBtn").textContent = text("exportImage");
  if (el("resetSelectionBtn")) el("resetSelectionBtn").textContent = text("resetSelection");

  const sortSel = el("sortSelect");
  if (sortSel?.options?.length >= 2) {
    sortSel.options[0].textContent = text("sort_abc");
    sortSel.options[1].textContent = text("sort_thickness");
  }

  const hint = el("dragHint");
  if (hint) hint.textContent = text(window.matchMedia("(pointer: fine) and (min-width: 1025px)").matches ? "dragHintDesktop" : "dragHintTouch");
}

function renderCategoryChecks() {
  const wrap = el("categoryChecks");
  if (!wrap) return;
  const categories = dedupeCategories(state.categories);

  wrap.innerHTML = categories.map((c) => `
    <label class="check-item">
      <input type="checkbox" data-cat-check="${c.id}" ${state.checkedCategoryIds.includes(c.id) ? "checked" : ""} />
      <span>${nameOf(c)}</span>
    </label>
  `).join("");
}

function renderPromoLinks() {
  const links = Array.from({ length: 3 }, (_, i) => {
    const it = state.promoLinks?.[i] || {};
    const url = normalizeUrl(it.url);
    const name = (it.name || "").trim() || (() => {
      try { return new URL(url).hostname.replace(/^www\./, "") || `Link ${i + 1}`; }
      catch { return `Link ${i + 1}`; }
    })();
    return { name, url, enabled: !!url };
  });

  const target = el("promoLinks");
  if (!target) return;
  target.innerHTML = links.map((it) =>
    it.enabled
      ? `<a class="promo-link-btn" href="${it.url}" target="_blank" rel="noopener noreferrer">${it.name}</a>`
      : `<a class="promo-link-btn" href="#" aria-disabled="true" style="opacity:.5;pointer-events:none;">${it.name}</a>`
  ).join("");
}

function renderSelectors() {
  const boxSelect = el("boxSelect");
  if (boxSelect) {
    boxSelect.innerHTML = state.boxes.map((b) => `<option value="${b.id}">${nameOf(b)} (${b.lengthCm}cm)</option>`).join("");
    boxSelect.value = selectedBox().id;
  }

  const playersSelect = el("playersSelect");
  if (playersSelect) {
    playersSelect.innerHTML = [`<option value="all">${text("allPlayers")}</option>`,`<option value="1">1</option>`,`<option value="2">2</option>`,`<option value="3">3</option>`,`<option value="4">4</option>`,`<option value="5">5</option>`,`<option value="6plus">6+</option>`].join("");
    playersSelect.value = state.selectedPlayers;
  }

  const diffSelect = el("difficultySelect");
  if (diffSelect) {
    diffSelect.innerHTML = [`<option value="all">${text("allDifficulty")}</option>`,`<option value="beginner">${text("diff_beginner")}</option>`,`<option value="intermediate">${text("diff_intermediate")}</option>`,`<option value="advanced">${text("diff_advanced")}</option>`].join("");
    diffSelect.value = state.selectedDifficulty;
  }

  const gameCategory = el("gameCategory");
  if (gameCategory) gameCategory.innerHTML = dedupeCategories(state.categories).map((c) => `<option value="${c.id}">${nameOf(c)}</option>`).join("");

  renderCategoryChecks();
}

function renderGames() {
  const q = el("searchInput")?.value?.trim().toLowerCase() || "";

  const list = state.games.filter((g) => {
    const playersOk =
      state.selectedPlayers === "all" ||
      (state.selectedPlayers === "6plus"
        ? Number(g.playersMax) >= 6
        : Number(g.playersMin) <= Number(state.selectedPlayers) && Number(state.selectedPlayers) <= Number(g.playersMax));

    const difficultyOk = state.selectedDifficulty === "all" || state.selectedDifficulty === difficultyTier(g.difficulty);
    const nameOk = Object.values(g.name).some((n) => n.toLowerCase().includes(q));
    const fitOk = canFitGame(g);

    // ✅ category OR
    const categoryOrOk =
      state.checkedCategoryIds.length === 0 ||
      state.checkedCategoryIds.includes(g.categoryId);

    return playersOk && difficultyOk && nameOk && fitOk && categoryOrOk;
  });

  list.sort((a, b) => {
    if (state.sortBy === "thickness") {
      const d = Number(a.lengthCm) - Number(b.lengthCm);
      if (d !== 0) return d;
    }
    return nameOf(a).localeCompare(nameOf(b), undefined, { sensitivity: "base" });
  });

  const listEl = el("gamesList");
  if (!listEl) return;
  listEl.innerHTML = list.map((g) => `<article class="card" data-game-id="${g.id}" draggable="true">
    <img src="${g.imageUrl}" alt="${nameOf(g)}" loading="lazy" decoding="async" />
    <div class="meta">
      <div>${nameOf(g)}</div>
      <small>${g.lengthCm}cm · ${nameOf(state.categories.find((c) => c.id === g.categoryId))} · ${g.playersMin}~${g.playersMax}p · ${difficultyLabel(g.difficulty)}</small>
    </div>
    <button class="btn add-btn" data-id="${g.id}">${text("add")}</button>
  </article>`).join("");
}

function renderBox() {
  const box = selectedBox();
  const used = calcUsed();
  const remain = box.lengthCm - used;
  const fill = Math.max(0, Math.min(100, (used / box.lengthCm) * 100));
  const hasImage = !!box.imageUrl;
  const hasSelected = selectedGames().length > 0;

  if (el("boxImage")) {
    el("boxImage").style.display = hasImage ? "block" : "none";
    if (hasImage) el("boxImage").src = box.imageUrl;
  }
  if (el("boxPlaceholder")) el("boxPlaceholder").style.display = hasImage || hasSelected ? "none" : "flex";

  if (el("usedValue")) el("usedValue").textContent = `${used.toFixed(1)}cm / ${box.lengthCm}cm`;
  if (el("remainingValue")) el("remainingValue").textContent = `${remain.toFixed(1)}cm`;
  if (el("fillValue")) el("fillValue").textContent = `${fill.toFixed(0)}%`;

  if (el("progressBar")) {
    el("progressBar").style.width = `${fill}%`;
    el("progressBar").style.background = remain < 0 ? "#ef4444" : "linear-gradient(90deg,#5a67d8,#6aa6ff)";
  }

  if (el("selectedList")) {
    el("selectedList").innerHTML = selectedGames().map((g, i) => `<span class="chip">${nameOf(g)} (${g.lengthCm}cm) <button data-remove-idx="${i}">×</button></span>`).join("");
  }

  const filledHtml = selectedGames().map((g) => {
    const widthPct = (Number(g.lengthCm) / box.lengthCm) * 100;
    return `<figure class="plug-item" title="${nameOf(g)} (${g.lengthCm}cm)" style="width:${widthPct}%; flex:0 0 ${widthPct}%; background-image:url('${g.boxImageUrl || g.imageUrl}')"></figure>`;
  }).join("");
  const emptyPct = Math.max(0, (remain / box.lengthCm) * 100);
  if (el("dropZone")) {
    el("dropZone").innerHTML = `${filledHtml}${emptyPct > 0.01 ? `<div class="empty-slot" style="width:${emptyPct}%; flex:0 0 ${emptyPct}%"></div>` : ""}`;
  }
}

function recommendGames() {
  const picked = selectedGames();
  const pickedIds = new Set(picked.map((g) => g.id));
  const remain = selectedBox().lengthCm - calcUsed();
  const pickedCats = new Set(picked.map((g) => g.categoryId).filter(Boolean));
  const pickedTiers = new Set(picked.map((g) => difficultyTier(g.difficulty)));
  const centers = picked.map((g) => Math.round((Number(g.playersMin) + Number(g.playersMax)) / 2));

  return state.games
    .filter((g) => !pickedIds.has(g.id))
    .filter((g) => remain >= Number(g.lengthCm))
    .map((g) => {
      const difficultyScore = picked.length ? (pickedTiers.has(difficultyTier(g.difficulty)) ? 50 : 25) : 0;
      const mechanismScore = picked.length ? (pickedCats.has(g.categoryId) ? 50 : 0) : 0;
      const center = Math.round((Number(g.playersMin) + Number(g.playersMax)) / 2);
      const playerDiff = picked.length ? Math.min(...centers.map((v) => Math.abs(v - center))) : Infinity;
      const playerScore = picked.length ? (playerDiff === 0 ? 50 : playerDiff === 1 ? 25 : 0) : 0;
      return { game: g, totalScore: difficultyScore + mechanismScore + playerScore, fitGap: Math.max(0, remain - Number(g.lengthCm)) };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.fitGap - b.fitGap)
    .slice(0, 3);
}

function renderRecommend() {
  const target = el("recommendList");
  if (!target) return;
  if (!selectedBox() || selectedGames().length === 0) {
    target.innerHTML = `<p class="recommend-empty">${text("noRecommend")}</p>`;
    return;
  }
  const items = recommendGames();
  if (!items.length) {
    target.innerHTML = `<p class="recommend-empty">${text("noRecommend")}</p>`;
    return;
  }
  target.innerHTML = items.map(({ game }) => `<article class="card" data-game-id="${game.id}" draggable="true">
    <img src="${game.imageUrl}" alt="${nameOf(game)}" loading="lazy" decoding="async" />
    <div class="meta"><div>${nameOf(game)}</div></div>
    <button class="btn add-btn" data-id="${game.id}">${text("add")}</button>
  </article>`).join("");
}

function addGame(id) {
  const game = state.games.find((g) => g.id === id);
  if (!game) return;
  if (!canFitGame(game)) return alert(text("overflowMsg"));
  state.selectedGameIds.push(id);
  persist();
  render();
}

function render() {
  document.documentElement.classList.toggle("dark", state.dark);
  if (el("languageSelect")) el("languageSelect").value = state.lang;
  if (el("sortSelect")) el("sortSelect").value = state.sortBy || "abc";
  renderStaticText();
  renderSelectors();
  renderGames();
  renderBox();
  renderRecommend();
  renderPromoLinks();
}

function toggleInArray(arr, value, checked) {
  const set = new Set(arr);
  if (checked) set.add(value); else set.delete(value);
  return [...set];
}

function bind() {
  let searchTimer = null;

  el("languageSelect")?.addEventListener("change", (e) => { state.lang = e.target.value; persist(); render(); });
  el("themeToggle")?.addEventListener("click", () => { state.dark = !state.dark; persist(); render(); });
  el("sortSelect")?.addEventListener("change", (e) => { state.sortBy = e.target.value || "abc"; persist(); renderGames(); });
  el("boxSelect")?.addEventListener("change", (e) => { state.selectedBoxId = e.target.value; state.selectedGameIds = []; persist(); render(); });
  el("playersSelect")?.addEventListener("change", (e) => { state.selectedPlayers = e.target.value; persist(); renderGames(); });
  el("difficultySelect")?.addEventListener("change", (e) => { state.selectedDifficulty = e.target.value; persist(); renderGames(); });

  document.body.addEventListener("change", (e) => {
    const cat = e.target.closest("[data-cat-check]");
    if (!cat) return;
    state.checkedCategoryIds = toggleInArray(state.checkedCategoryIds, cat.getAttribute("data-cat-check"), cat.checked);
    persist();
    renderGames();
  });

  el("searchInput")?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderGames(), 120);
  });

  el("resetFiltersBtn")?.addEventListener("click", () => {
    if (el("searchInput")) el("searchInput").value = "";
    state.selectedPlayers = "all";
    state.selectedDifficulty = "all";
    state.checkedCategoryIds = [];
    persist();
    render();
  });

  el("resetSelectionBtn")?.addEventListener("click", () => { state.selectedGameIds = []; persist(); render(); });

  document.body.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-btn");
    if (addBtn) { addGame(addBtn.dataset.id); return; }

    const rm = e.target.closest("[data-remove-idx]");
    if (rm) {
      state.selectedGameIds.splice(Number(rm.dataset.removeIdx), 1);
      persist();
      render();
    }
  });

  const dialog = el("adminDialog");
  el("adminBtn")?.addEventListener("click", () => dialog?.showModal());
  el("cancelBtn")?.addEventListener("click", (e) => { e.preventDefault(); dialog?.close("cancel"); });
}

async function init() {
  bind();
  render();
  try { await fetchSharedData(); } catch (error) { console.warn("Shared data fetch failed, using local/default data.", error); }
  render();
}
init();
