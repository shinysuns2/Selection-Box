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
    noFitRecommend: "남은 공간에 들어가는 추천 게임이 없습니다.",
    noRecommend: "추천 게임이 없습니다.",
    diff_beginner: "초보자",
    diff_intermediate: "중급자",
    diff_advanced: "고급자",
    resetFilters: "필터 초기화",
    exportImage: "이미지 생성",
    resetSelection: "박스 초기화",
    cancel: "취소",
    login: "로그인",
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
    noFitRecommend: "No recommended games fit in the remaining space.",
    noRecommend: "No recommended games.",
    diff_beginner: "Gateway",
    diff_intermediate: "Mid-weight",
    diff_advanced: "Heavy",
    resetFilters: "Reset filters",
    exportImage: "Export Image",
    resetSelection: "Clear Box",
    cancel: "Cancel",
    login: "Login",
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
    noFitRecommend: "残り容量に収まるおすすめゲームがありません。",
    noRecommend: "おすすめゲームがありません。",
    diff_beginner: "入門",
    diff_intermediate: "中量級",
    diff_advanced: "重量級",
    resetFilters: "絞り込み解除",
    exportImage: "画像を書き出し",
    resetSelection: "ボックス初期化",
    cancel: "キャンセル",
    login: "ログイン",
  },
};

const defaultState = {
  lang: "ko",
  dark: false,
  selectedBoxId: "b1",
  selectedCategory: "all",
  selectedPlayers: "all",
  selectedDifficulty: "all",
  boxes: [
    {
      id: "b1",
      name: { ko: "기본 박스", en: "Default Box", ja: "基本ボックス" },
      lengthCm: 29,
      imageUrl: "",
    },
  ],
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
      lengthCm: 4.2,
      categoryId: "c1",
      playersMin: 2,
      playersMax: 4,
      difficulty: 4,
      imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=300&q=60",
      boxImageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=300&q=60",
    },
    {
      id: "g2",
      name: { ko: "파티 큐브", en: "Party Cube", ja: "パーティーキューブ" },
      lengthCm: 2.8,
      categoryId: "c2",
      playersMin: 3,
      playersMax: 8,
      difficulty: 2,
      imageUrl: "https://images.unsplash.com/photo-1603732551681-8f8f8e3b6f7f?auto=format&fit=crop&w=300&q=60",
      boxImageUrl: "https://images.unsplash.com/photo-1603732551681-8f8f8e3b6f7f?auto=format&fit=crop&w=300&q=60",
    },
    {
      id: "g3",
      name: { ko: "패밀리 트립", en: "Family Trip", ja: "ファミリートリップ" },
      lengthCm: 3.6,
      categoryId: "c3",
      playersMin: 2,
      playersMax: 5,
      difficulty: 3,
      imageUrl: "https://images.unsplash.com/photo-1529480780361-c8cb81eb5735?auto=format&fit=crop&w=300&q=60",
      boxImageUrl: "https://images.unsplash.com/photo-1529480780361-c8cb81eb5735?auto=format&fit=crop&w=300&q=60",
    },
  ],
  compat: [
    { from: "g1", to: "g3", score: 1.5 },
    { from: "g2", to: "g3", score: 1.2 },
    { from: "g3", to: "g1", score: 1.1 },
  ],
  selectedGameIds: [],
};

let state = loadState();
let editingBoxId = null;
let editingGameId = null;
let gamesRenderCount = Number.MAX_SAFE_INTEGER;
let draggingGameId = null;

const el = (id) => document.getElementById(id);

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
    loaded.selectedPlayers = loaded.selectedPlayers || "all";
    loaded.selectedDifficulty = loaded.selectedDifficulty || "all";
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
      selectedGameIds: state.selectedGameIds,
    })
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = async () => {
      const raw = String(reader.result || "");
      if (!file.type?.startsWith("image/")) return resolve(raw);

      try {
        const img = new Image();
        img.onload = () => {
          const maxSide = 1200;
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL("image/webp", 0.8);
          resolve(compressed || raw);
        };
        img.onerror = () => resolve(raw);
        img.src = raw;
      } catch {
        resolve(raw);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function text(key) {
  return i18n[state.lang]?.[key] ?? i18n.ko[key] ?? key;
}

function nameOf(item) {
  return item?.name?.[state.lang] || item?.name?.ko || "-";
}

function difficultyTier(value) {
  const n = Number(value || 0);
  if (n <= 1) return "beginner";
  if (n === 2) return "intermediate";
  return "advanced";
}

function difficultyLabel(value) {
  return text(`diff_${difficultyTier(value)}`);
}

function raiseIfError(error, fallback) {
  if (!error) return;
  const msg = error.message ? `${fallback}\n${error.message}` : fallback;
  alert(msg);
  throw error;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
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
  const { data: categories } = catRes;
  const { data: boxes } = boxRes;
  const { data: games } = gameRes;

  if (categories?.length) {
    const mapped = categories.map((c) => ({
      id: c.id,
      name: { ko: c.name_ko, en: c.name_en, ja: c.name_ja },
    }));
    const deduped = [];
    const seen = new Set();
    for (const c of mapped) {
      const key = `${(c.name?.en || "").trim().toLowerCase()}|${(c.name?.ko || "").trim()}|${(c.name?.ja || "").trim()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(c);
    }
    const hasMisc = deduped.some((c) => {
      const ko = c.name?.ko || "";
      const en = c.name?.en || "";
      const ja = c.name?.ja || "";
      return ko.includes("기타") || /other|misc/i.test(en) || ja.includes("その他");
    });
    if (!hasMisc) {
      deduped.push({ id: "c11-misc", name: { ko: "기타", en: "Other / Misc", ja: "その他" } });
    }
    state.categories = deduped;
  }
  if (boxes?.length) {
    state.boxes = boxes.map((b) => ({
      id: b.id,
      name: { ko: b.name_ko, en: b.name_en, ja: b.name_ja },
      lengthCm: Number(b.length_cm),
      imageUrl: b.image_url || "",
    }));
  }
  if (games?.length) {
    state.games = games.map((g) => ({
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

  if (!state.boxes.find((b) => b.id === state.selectedBoxId)) {
    state.selectedBoxId = state.boxes[0]?.id || defaultState.selectedBoxId;
  }
  state.selectedGameIds = state.selectedGameIds.filter((id) => state.games.some((g) => g.id === id));
  persist();
}

function selectedBox() {
  return state.boxes.find((b) => b.id === state.selectedBoxId) || state.boxes[0];
}

function selectedGames() {
  return state.selectedGameIds
    .map((id) => state.games.find((g) => g.id === id))
    .filter(Boolean);
}

function calcUsed() {
  return selectedGames().reduce((sum, g) => sum + Number(g.lengthCm), 0);
}

function renderStaticText() {
  [
    "appTitle","gamesTitle","boxLabel","categoryLabel","selectedTitle",
    "playersLabel","difficultyLabel","usedLabel","remainingLabel","fillLabel","recommendTitle",
    "adminLoginTitle","adminPanelTitle","manageBoxTitle","manageGameTitle"
  ].forEach((k) => (el(k).textContent = text(k)));
  el("selectedTitle").textContent = "Selection Box";
  el("cancelBtn").textContent = text("cancel");
  el("loginBtn").textContent = text("login");
  el("resetFiltersBtn").textContent = text("resetFilters");
  el("exportImageBtn").textContent = text("exportImage");
  el("resetSelectionBtn").textContent = text("resetSelection");
  const diffOpts = el("gameDifficulty")?.options;
  if (diffOpts?.length >= 3) {
    diffOpts[0].textContent = text("diff_beginner");
    diffOpts[1].textContent = text("diff_intermediate");
    diffOpts[2].textContent = text("diff_advanced");
  }
}

function renderSelectors() {
  const boxSel = el("boxSelect");
  boxSel.innerHTML = state.boxes
    .map((b) => `<option value="${b.id}">${nameOf(b)} (${b.lengthCm}cm)</option>`)
    .join("");
  boxSel.value = selectedBox().id;

  const catSel = el("categorySelect");
  catSel.innerHTML = [`<option value="all">${text("all")}</option>`]
    .concat(state.categories.map((c) => `<option value="${c.id}">${nameOf(c)}</option>`))
    .join("");
  catSel.value = state.selectedCategory;

  const playersSel = el("playersSelect");
  playersSel.innerHTML = [`<option value="all">${text("allPlayers")}</option>`]
    .concat([
      `<option value="1">1</option>`,
      `<option value="2">2</option>`,
      `<option value="3">3</option>`,
      `<option value="4">4</option>`,
      `<option value="5">5</option>`,
      `<option value="6plus">6+</option>`,
    ])
    .join("");
  playersSel.value = state.selectedPlayers;

  const diffSel = el("difficultySelect");
  diffSel.innerHTML = [`<option value="all">${text("allDifficulty")}</option>`]
    .concat([
      `<option value="beginner">${text("diff_beginner")}</option>`,
      `<option value="intermediate">${text("diff_intermediate")}</option>`,
      `<option value="advanced">${text("diff_advanced")}</option>`,
    ])
    .join("");
  diffSel.value = state.selectedDifficulty;

  el("gameCategory").innerHTML = state.categories
    .map((c) => `<option value="${c.id}">${nameOf(c)}</option>`)
    .join("");
}

function renderGames() {
  const q = el("searchInput").value?.trim().toLowerCase() || "";
  const list = state.games.filter((g) => {
    const categoryOk = state.selectedCategory === "all" || g.categoryId === state.selectedCategory;
    const playersOk =
      state.selectedPlayers === "all" ||
      (state.selectedPlayers === "6plus"
        ? Number(g.playersMax) >= 6
        : Number(g.playersMin) <= Number(state.selectedPlayers) &&
          Number(state.selectedPlayers) <= Number(g.playersMax));
    const difficultyOk =
      state.selectedDifficulty === "all" || state.selectedDifficulty === difficultyTier(g.difficulty);
    const nameOk = Object.values(g.name).some((n) => n.toLowerCase().includes(q));
    return categoryOk && playersOk && difficultyOk && nameOk;
  });
  const visible = list.slice(0, gamesRenderCount);

  el("gamesList").innerHTML = list
    .map(
      (g) => `<article class="card" data-game-id="${g.id}" draggable="true">
        <img src="${g.imageUrl}" alt="${nameOf(g)}" loading="lazy" decoding="async" />
        <div class="meta">
          <div>${nameOf(g)}</div>
          <small>${g.lengthCm}cm · ${nameOf(state.categories.find((c) => c.id === g.categoryId))} · ${g.playersMin}~${g.playersMax}p · ${difficultyLabel(g.difficulty)}</small>
        </div>
        <button class="btn add-btn" data-id="${g.id}">${text("add")}</button>
      </article>`
    )
    .join("");
}

function renderBox() {
  const box = selectedBox();
  const used = calcUsed();
  const remain = box.lengthCm - used;
  const fill = Math.max(0, Math.min(100, (used / box.lengthCm) * 100));

  const hasImage = Boolean(box.imageUrl);
  const hasSelectedGames = selectedGames().length > 0;
  el("boxImage").style.display = hasImage ? "block" : "none";
  el("boxPlaceholder").style.display = hasImage || hasSelectedGames ? "none" : "flex";
  if (hasImage) el("boxImage").src = box.imageUrl;
  el("usedValue").textContent = `${used.toFixed(1)}cm / ${box.lengthCm}cm`;
  el("remainingValue").textContent = `${remain.toFixed(1)}cm`;
  el("fillValue").textContent = `${fill.toFixed(0)}%`;
  el("progressBar").style.width = `${fill}%`;
  el("progressBar").style.background = remain < 0 ? "#ef4444" : "linear-gradient(90deg,#5a67d8,#6aa6ff)";

  el("selectedList").innerHTML = selectedGames()
    .map((g, i) => `<span class="chip">${nameOf(g)} (${g.lengthCm}cm) <button data-remove-idx="${i}">×</button></span>`)
    .join("");

  const filledHtml = selectedGames()
    .map(
      (g) => {
        const widthPct = (Number(g.lengthCm) / box.lengthCm) * 100;
        return `<figure class="plug-item" title="${nameOf(g)} (${g.lengthCm}cm)" style="width:${widthPct}%; flex:0 0 ${widthPct}%; background-image:url('${g.boxImageUrl || g.imageUrl}')"></figure>`;
      }
    )
    .join("");
  const emptyPct = Math.max(0, (remain / box.lengthCm) * 100);
  const emptyHtml = emptyPct > 0.01 ? `<div class="empty-slot" style="width:${emptyPct}%; flex:0 0 ${emptyPct}%"></div>` : "";
  el("dropZone").innerHTML = `${filledHtml}${emptyHtml}`;
}

function recommendGames() {
  const box = selectedBox();
  const picked = selectedGames();
  const pickedIds = new Set(picked.map((g) => g.id));
  const remain = box.lengthCm - calcUsed();
  const pickedCats = new Set(picked.map((g) => g.categoryId).filter(Boolean));
  const pickedDifficultyTiers = new Set(picked.map((g) => difficultyTier(g.difficulty)));
  const pickedPlayerCenters = picked.map((g) => Math.round((Number(g.playersMin) + Number(g.playersMax)) / 2));

  return state.games
    .filter((g) => !pickedIds.has(g.id))
    .filter((g) => remain >= Number(g.lengthCm))
    .map((g) => {
      const remainAfter = remain - Number(g.lengthCm);
      const fitGap = Math.max(0, remainAfter); // 두께 조건 통과 후 tie-break

      const hasPicked = picked.length > 0;
      const difficultyScore = !hasPicked ? 0 : pickedDifficultyTiers.has(difficultyTier(g.difficulty)) ? 50 : 25;
      const mechanismScore = !hasPicked ? 0 : pickedCats.has(g.categoryId) ? 50 : 0;

      const candidateCenter = Math.round((Number(g.playersMin) + Number(g.playersMax)) / 2);
      const playerDiff = !hasPicked
        ? Infinity
        : Math.min(...pickedPlayerCenters.map((v) => Math.abs(v - candidateCenter)));
      const playerScore = !hasPicked ? 0 : playerDiff === 0 ? 50 : playerDiff === 1 ? 25 : 0;

      const totalScore = difficultyScore + mechanismScore + playerScore;

      return {
        game: g,
        totalScore,
        fitGap,
        difficultyScore,
        mechanismScore,
        playerScore,
      };
    })
    .sort((a, b) =>
      b.totalScore - a.totalScore ||
      a.fitGap - b.fitGap
    )
    .slice(0, 5);
}

function renderRecommend() {
  const box = selectedBox();
  if (!box || selectedGames().length === 0) {
    el("recommendList").innerHTML = `<p class="recommend-empty">${text("noRecommend")}</p>`;
    return;
  }
  const items = recommendGames();
  if (!items.length) {
    el("recommendList").innerHTML = `<p class="recommend-empty">${text("noRecommend")}</p>`;
    return;
  }
  el("recommendList").innerHTML = items
    .map(({ game }) => `<article class="card" data-game-id="${game.id}" draggable="true">
      <img src="${game.imageUrl}" alt="${nameOf(game)}" loading="lazy" decoding="async" />
      <div class="meta">
        <div>${nameOf(game)}</div>
      </div>
      <button class="btn add-btn" data-id="${game.id}">${text("add")}</button>
    </article>`)
    .join("");
}

function renderAdminLists() {
  el("boxAdminList").innerHTML = state.boxes.map((b) => `
    <article class="card">
      <div>${nameOf(b)} (${b.lengthCm}cm)</div>
      <button class="btn ghost" data-edit-box="${b.id}">수정</button>
      <button class="btn ghost" data-del-box="${b.id}">삭제</button>
    </article>
  `).join("");

  el("gameAdminList").innerHTML = state.games.map((g) => `
    <article class="card">
      <div>${nameOf(g)} (${g.lengthCm}cm · ${g.playersMin}~${g.playersMax}p · ${difficultyLabel(g.difficulty)})</div>
      <button class="btn ghost" data-edit-game="${g.id}">수정</button>
      <button class="btn ghost" data-del-game="${g.id}">삭제</button>
    </article>
  `).join("");
}

function animateToBox(imgSrc, fromEl) {
  const fly = document.createElement("img");
  fly.src = imgSrc;
  fly.className = "fly";
  document.body.appendChild(fly);

  const from = fromEl.getBoundingClientRect();
  const to = el("dropZone").getBoundingClientRect();
  const boxVisual = el("boxVisual");

  fly.style.left = `${from.left}px`;
  fly.style.top = `${from.top}px`;
  fly.style.width = `${from.width || 52}px`;
  fly.style.height = `${from.height || 52}px`;
  fly.style.opacity = "0.95";
  fly.style.filter = "saturate(1.05)";
  requestAnimationFrame(() => {
    const dx = to.left - from.left + 8;
    const dy = to.top - from.top + 8;
    fly.style.transform = `translate(${dx}px, ${dy}px) scale(0.9)`;
    fly.style.opacity = "0.12";
    fly.style.filter = "saturate(0.9) blur(0.3px)";
  });
  setTimeout(() => boxVisual.classList.add("box-hit"), 235);
  setTimeout(() => boxVisual.classList.remove("box-hit"), 470);
  setTimeout(() => fly.remove(), 360);
}

function addGame(id, sourceEl) {
  const game = state.games.find((g) => g.id === id);
  if (!game) return;
  const box = selectedBox();
  const nextUsed = calcUsed() + Number(game.lengthCm);
  if (nextUsed - box.lengthCm > 0.0001) {
    alert(text("overflowMsg"));
    return;
  }
  state.selectedGameIds.push(id);
  if (sourceEl) animateToBox(game.imageUrl, sourceEl);
  persist();
  render();
}

function render() {
  document.documentElement.classList.toggle("dark", state.dark);
  el("languageSelect").value = state.lang;
  renderStaticText();
  renderSelectors();
  renderGames();
  renderBox();
  renderRecommend();
  renderAdminLists();
}

function bind() {
  let searchTimer = null;
  const desktopDragEnabled = window.matchMedia("(pointer: fine) and (min-width: 1025px)").matches;

  const resetGamePaging = () => {};

  el("languageSelect").addEventListener("change", (e) => {
    state.lang = e.target.value;
    persist();
    render();
  });

  el("themeToggle").addEventListener("click", () => {
    state.dark = !state.dark;
    persist();
    render();
  });

  el("boxSelect").addEventListener("change", (e) => {
    state.selectedBoxId = e.target.value;
    state.selectedGameIds = [];
    persist();
    render();
  });

  el("categorySelect").addEventListener("change", (e) => {
    state.selectedCategory = e.target.value;
    resetGamePaging();
    persist();
    renderGames();
  });

  el("playersSelect").addEventListener("change", (e) => {
    state.selectedPlayers = e.target.value;
    resetGamePaging();
    persist();
    renderGames();
  });

  el("difficultySelect").addEventListener("change", (e) => {
    state.selectedDifficulty = e.target.value;
    resetGamePaging();
    persist();
    renderGames();
  });

  el("searchInput").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      resetGamePaging();
      renderGames();
    }, 120);
  });

  el("resetFiltersBtn").addEventListener("click", () => {
    el("searchInput").value = "";
    state.selectedCategory = "all";
    state.selectedPlayers = "all";
    state.selectedDifficulty = "all";
    persist();
    render();
  });

  el("resetSelectionBtn").addEventListener("click", () => {
    state.selectedGameIds = [];
    persist();
    render();
  });

  el("exportImageBtn").addEventListener("click", async () => {
    const target = el("exportBoxArea");
    if (!target || !window.html2canvas) {
      alert("이미지 캡처 기능을 불러오지 못했습니다.");
      return;
    }
    const btn = el("exportImageBtn");
    const prev = btn.textContent;
    btn.disabled = true;
    btn.textContent = state.lang === "ko" ? "생성중..." : "Exporting...";
    try {
      const dpr = window.devicePixelRatio || 1;
      const exportScale = Math.min(4, Math.max(2.5, dpr * 2));
      const canvas = await window.html2canvas(target, {
        backgroundColor: null,
        scale: exportScale,
        useCORS: true,
        onclone: (doc) => {
          const cloneTarget = doc.getElementById("exportBoxArea");
          cloneTarget?.classList.add("export-static");
        },
      });
      const link = document.createElement("a");
      link.download = `selection-box-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      btn.disabled = false;
      btn.textContent = prev;
    }
  });

  if (desktopDragEnabled) {
    document.body.addEventListener("dragstart", (e) => {
      const card = e.target.closest(".card[data-game-id]");
      if (!card) return;
      draggingGameId = card.dataset.gameId;
      e.dataTransfer?.setData("text/plain", draggingGameId || "");
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "copy";
      el("boxVisual")?.classList.add("box-hit");
    });

    document.body.addEventListener("dragend", () => {
      draggingGameId = null;
      el("boxVisual")?.classList.remove("box-hit");
    });

    const dropZone = el("dropZone");
    dropZone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    });
    dropZone?.addEventListener("drop", (e) => {
      e.preventDefault();
      const droppedId = e.dataTransfer?.getData("text/plain") || draggingGameId;
      if (!droppedId) return;
      addGame(droppedId);
      draggingGameId = null;
      el("boxVisual")?.classList.remove("box-hit");
    });
  }

  document.body.addEventListener("click", async (e) => {
    const addBtn = e.target.closest(".add-btn");
    if (addBtn) {
      const card = addBtn.closest(".card");
      const img = card?.querySelector("img");
      addGame(addBtn.dataset.id, img || addBtn);
      return;
    }

    const rm = e.target.closest("[data-remove-idx]");
    if (rm) {
      const idx = Number(rm.dataset.removeIdx);
      state.selectedGameIds.splice(idx, 1);
      persist();
      render();
      return;
    }

    const delBox = e.target.closest("[data-del-box]");
    if (delBox) {
      const { error } = await supabaseClient.from("boxes").delete().eq("id", delBox.dataset.delBox);
      raiseIfError(error, "박스 삭제 실패");
      await fetchSharedData();
      state.selectedBoxId = state.boxes[0]?.id || defaultState.selectedBoxId;
      persist();
      render();
      return;
    }

    const delGame = e.target.closest("[data-del-game]");
    if (delGame) {
      const { error } = await supabaseClient.from("games").delete().eq("id", delGame.dataset.delGame);
      raiseIfError(error, "게임 삭제 실패");
      await fetchSharedData();
      persist();
      render();
      return;
    }

    const editBox = e.target.closest("[data-edit-box]");
    if (editBox) {
      const box = state.boxes.find((b) => b.id === editBox.dataset.editBox);
      if (!box) return;
      editingBoxId = box.id;
      el("boxNameKo").value = box.name.ko || "";
      el("boxNameEn").value = box.name.en || "";
      el("boxNameJa").value = box.name.ja || "";
      el("boxLength").value = box.lengthCm;
      el("boxImageUrl").value = box.imageUrl || "";
      return;
    }

    const editGame = e.target.closest("[data-edit-game]");
    if (editGame) {
      const game = state.games.find((g) => g.id === editGame.dataset.editGame);
      if (!game) return;
      editingGameId = game.id;
      el("gameNameKo").value = game.name.ko || "";
      el("gameNameEn").value = game.name.en || "";
      el("gameNameJa").value = game.name.ja || "";
      el("gameLength").value = game.lengthCm;
      el("gameImageUrl").value = game.imageUrl || "";
      el("gameBoxImageUrl").value = game.boxImageUrl || "";
      el("gamePlayersMin").value = game.playersMin || 1;
      el("gamePlayersMax").value = game.playersMax || 1;
      const tier = difficultyTier(game.difficulty);
      el("gameDifficulty").value = tier === "beginner" ? "1" : tier === "intermediate" ? "2" : "3";
      if (game.categoryId) el("gameCategory").value = game.categoryId;
    }
  });

  const dialog = el("adminDialog");
  el("adminBtn").addEventListener("click", () => dialog.showModal());

  el("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = el("adminPassword").value;
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    if (!error) {
      el("adminPanel").hidden = false;
      el("adminLoginForm").hidden = true;
    } else {
      alert(`로그인 실패: ${error.message || "어드민 비밀번호를 확인해주세요."}`);
    }
  });

  el("logoutBtn").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    el("adminPanel").hidden = true;
    el("adminLoginForm").hidden = false;
    el("adminPassword").value = "";
  });

  el("boxForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = el("boxImageFile").files?.[0];
    const fileImage = await fileToDataUrl(file);
    const urlImage = el("boxImageUrl").value.trim();
    const imageUrl = fileImage || urlImage;

    const payload = {
      name_ko: el("boxNameKo").value,
      name_en: el("boxNameEn").value,
      name_ja: el("boxNameJa").value,
      length_cm: Number(el("boxLength").value),
      image_url: imageUrl || null,
      is_active: true,
    };
    const { error } = editingBoxId
      ? await supabaseClient.from("boxes").update(payload).eq("id", editingBoxId)
      : await supabaseClient.from("boxes").insert(payload);
    raiseIfError(error, editingBoxId ? "박스 수정 실패" : "박스 추가 실패");
    await fetchSharedData();
    persist();
    editingBoxId = null;
    e.target.reset();
    render();
  });

  el("gameForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = el("gameImageFile").files?.[0];
    const fileImage = await fileToDataUrl(file);
    const urlImage = el("gameImageUrl").value.trim();
    const listImageUrl = fileImage || urlImage;
    if (!listImageUrl) {
      alert("게임 이미지 파일 업로드 또는 URL 입력이 필요합니다.");
      return;
    }
    const boxFile = el("gameBoxImageFile").files?.[0];
    const boxFileImage = await fileToDataUrl(boxFile);
    const boxUrlImage = el("gameBoxImageUrl").value.trim();
    const boxImageUrl = boxFileImage || boxUrlImage || listImageUrl;

    const rawCategoryId = el("gameCategory").value;
    const categoryId = isUuid(rawCategoryId) ? rawCategoryId : null;
    if (!categoryId) {
      console.warn("Category UUID missing. Saving game without category_id.");
    }

    const payload = {
      name_ko: el("gameNameKo").value,
      name_en: el("gameNameEn").value,
      name_ja: el("gameNameJa").value,
      length_cm: Number(el("gameLength").value),
      category_id: categoryId,
      players_min: Number(el("gamePlayersMin").value),
      players_max: Number(el("gamePlayersMax").value),
      difficulty: Number(el("gameDifficulty").value),
      image_url: listImageUrl,
      box_image_url: boxImageUrl,
      is_active: true,
    };
    const { error } = editingGameId
      ? await supabaseClient.from("games").update(payload).eq("id", editingGameId)
      : await supabaseClient.from("games").insert(payload);
    if (error?.message?.includes("box_image_url")) {
      alert("Supabase games 테이블에 box_image_url 컬럼을 추가해주세요. SQL: alter table public.games add column if not exists box_image_url text;");
    }
    raiseIfError(error, editingGameId ? "게임 수정 실패" : "게임 추가 실패");
    await fetchSharedData();
    persist();
    editingGameId = null;
    e.target.reset();
    render();
  });
}

async function init() {
  bind();
  await fetchSharedData();
  render();
}

init();
