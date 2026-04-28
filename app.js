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
    { id: "c1", name: { ko: "전략", en: "Strategy", ja: "戦略" } },
    { id: "c2", name: { ko: "파티", en: "Party", ja: "パーティー" } },
    { id: "c3", name: { ko: "가족", en: "Family", ja: "ファミリー" } },
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
    reader.onload = () => resolve(String(reader.result || ""));
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

function raiseIfError(error, fallback) {
  if (!error) return;
  const msg = error.message ? `${fallback}\n${error.message}` : fallback;
  alert(msg);
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
  const { data: categories } = catRes;
  const { data: boxes } = boxRes;
  const { data: games } = gameRes;

  if (categories?.length) {
    state.categories = categories.map((c) => ({
      id: c.id,
      name: { ko: c.name_ko, en: c.name_en, ja: c.name_ja },
    }));
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

  const playersSet = [...new Set(state.games.map((g) => `${g.playersMin}-${g.playersMax}`))];
  const playersSel = el("playersSelect");
  playersSel.innerHTML = [`<option value="all">${text("allPlayers")}</option>`]
    .concat(playersSet.map((v) => `<option value="${v}">${v.replace("-", "~")}인</option>`))
    .join("");
  playersSel.value = state.selectedPlayers;

  const diffSel = el("difficultySelect");
  diffSel.innerHTML = [`<option value="all">${text("allDifficulty")}</option>`]
    .concat([1, 2, 3, 4, 5].map((d) => `<option value="${d}">${text("difficultyLabel")} ${d}</option>`))
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
      state.selectedPlayers === "all" || `${g.playersMin}-${g.playersMax}` === state.selectedPlayers;
    const difficultyOk =
      state.selectedDifficulty === "all" || Number(state.selectedDifficulty) === Number(g.difficulty);
    const nameOk = Object.values(g.name).some((n) => n.toLowerCase().includes(q));
    return categoryOk && playersOk && difficultyOk && nameOk;
  });

  el("gamesList").innerHTML = list
    .map(
      (g) => `<article class="card" data-game-id="${g.id}">
        <img src="${g.imageUrl}" alt="${nameOf(g)}" />
        <div class="meta">
          <div>${nameOf(g)}</div>
          <small>${g.lengthCm}cm · ${nameOf(state.categories.find((c) => c.id === g.categoryId))} · ${g.playersMin}~${g.playersMax}p · Lv.${g.difficulty}</small>
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
  el("boxImage").style.display = hasImage ? "block" : "none";
  el("boxPlaceholder").style.display = hasImage ? "none" : "flex";
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
    .map((g) => {
      const widthPct = (Number(g.lengthCm) / box.lengthCm) * 100;
      return `<figure class="plug-item" title="${nameOf(g)} (${g.lengthCm}cm)" style="width:${widthPct}%; flex:0 0 ${widthPct}%; background-image:url('${g.imageUrl}')"></figure>`;
    })
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
  const pickedCats = picked.map((g) => g.categoryId);

  return state.games
    .filter((g) => !pickedIds.has(g.id))
    .filter((g) => remain >= Number(g.lengthCm))
    .map((g) => {
      const fitScore = remain >= g.lengthCm ? 2 + Math.max(0, 1 - (remain - g.lengthCm) / box.lengthCm) : -3;
      const catScore = pickedCats.includes(g.categoryId) ? 1.5 : 0.2;
      const compScore = picked.reduce((s, p) => {
        const hit = state.compat.find((c) => c.from === p.id && c.to === g.id);
        return s + (hit?.score || 0);
      }, 0);
      return { game: g, score: fitScore + catScore + compScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function renderRecommend() {
  const items = recommendGames();
  if (!items.length) {
    el("recommendList").innerHTML = `<article class="card"><div class="meta"><small>${text("noFitRecommend")}</small></div></article>`;
    return;
  }
  el("recommendList").innerHTML = items
    .map(({ game, score }) => `<article class="card">
      <img src="${game.imageUrl}" alt="${nameOf(game)}" />
      <div class="meta">
        <div>${nameOf(game)}</div>
        <small>${game.lengthCm}cm · ${game.playersMin}~${game.playersMax}p · Lv.${game.difficulty} · score ${score.toFixed(2)}</small>
      </div>
      <button class="btn add-btn" data-id="${game.id}">${text("add")}</button>
    </article>`)
    .join("");
}

function renderAdminLists() {
  el("boxAdminList").innerHTML = state.boxes.map((b) => `
    <article class="card">
      <div>${nameOf(b)} (${b.lengthCm}cm)</div>
      <button class="btn ghost" data-del-box="${b.id}">삭제</button>
    </article>
  `).join("");

  el("gameAdminList").innerHTML = state.games.map((g) => `
    <article class="card">
      <div>${nameOf(g)} (${g.lengthCm}cm · ${g.playersMin}~${g.playersMax}p · Lv.${g.difficulty})</div>
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
  const to = el("boxVisual").getBoundingClientRect();

  fly.style.left = `${from.left}px`;
  fly.style.top = `${from.top}px`;
  requestAnimationFrame(() => {
    fly.style.transform = `translate(${to.left - from.left + 10}px, ${to.top - from.top + 10}px) scale(0.35)`;
    fly.style.opacity = "0.2";
  });
  setTimeout(() => fly.remove(), 380);
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
    persist();
    renderGames();
  });

  el("playersSelect").addEventListener("change", (e) => {
    state.selectedPlayers = e.target.value;
    persist();
    renderGames();
  });

  el("difficultySelect").addEventListener("change", (e) => {
    state.selectedDifficulty = e.target.value;
    persist();
    renderGames();
  });

  el("searchInput").addEventListener("input", renderGames);

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

    const { error } = await supabaseClient.from("boxes").insert({
      name_ko: el("boxNameKo").value,
      name_en: el("boxNameEn").value,
      name_ja: el("boxNameJa").value,
      length_cm: Number(el("boxLength").value),
      image_url: imageUrl || null,
      is_active: true,
    });
    raiseIfError(error, "박스 추가 실패");
    await fetchSharedData();
    persist();
    e.target.reset();
    render();
  });

  el("gameForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = el("gameImageFile").files?.[0];
    const fileImage = await fileToDataUrl(file);
    const urlImage = el("gameImageUrl").value.trim();
    const imageUrl = fileImage || urlImage;
    if (!imageUrl) {
      alert("게임 이미지 파일 업로드 또는 URL 입력이 필요합니다.");
      return;
    }

    const { error } = await supabaseClient.from("games").insert({
      name_ko: el("gameNameKo").value,
      name_en: el("gameNameEn").value,
      name_ja: el("gameNameJa").value,
      length_cm: Number(el("gameLength").value),
      category_id: el("gameCategory").value,
      players_min: Number(el("gamePlayersMin").value),
      players_max: Number(el("gamePlayersMax").value),
      difficulty: Number(el("gameDifficulty").value),
      image_url: imageUrl,
      is_active: true,
    });
    raiseIfError(error, "게임 추가 실패");
    await fetchSharedData();
    persist();
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
