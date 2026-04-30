const ADMIN_EMAIL = "ryan@playte.com";
const SUPABASE_URL = "https://nzvmiwfdpjpkamyisvoc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_84BLwfndOfmoVsgpy7Pr-Q_b5iBRqXS";
const LOCAL_KEY = "selection-box-local-v2";
const STORAGE_BUCKET = "images"; // ✅ 실제 버킷명으로 바꿔
const USE_ADMIN_BYPASS = true;   // ✅ true면 로그인 없이 관리자 진입

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
  boxes: [{ id: "b1", name: { ko: "기본 박스", en: "Default Box", ja: "基本ボックス" }, lengthCm: 29, imageUrl: "" }],
  categories: [],
  games: [],
  promoLinks: [{ name: "", url: "" }, { name: "", url: "" }, { name: "", url: "" }],
  selectedGameIds: [],
};

let state = loadState();
let editingGameId = null;

const el = (id) => document.getElementById(id);

function dedupeCategories(list) {
  const seen = new Set();
  return (list || []).filter((c) => {
    const key = [(c?.name?.ko || "").trim().toLowerCase(), (c?.name?.en || "").trim().toLowerCase(), (c?.name?.ja || "").trim().toLowerCase()].join("|");
    if (key === "||") return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function safeImageUrl(raw, fallback = "https://placehold.co/92x128?text=No+Image") {
  const v = String(raw || "").trim();
  if (!v) return fallback;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

async function uploadImageFile(file, folder) {
  if (!file) return "";
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: upErr } = await supabaseClient.storage.from(STORAGE_BUCKET).upload(filename, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (upErr) throw upErr;

  const { data } = supabaseClient.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
  return data?.publicUrl || "";
}

function text(key) { return i18n[state.lang]?.[key] ?? i18n.ko[key] ?? key; }
function nameOf(item) { return item?.name?.[state.lang] || item?.name?.ko || "-"; }
function difficultyTier(v) { const n = Number(v || 0); if (n <= 1) return "beginner"; if (n === 2) return "intermediate"; return "advanced"; }
function difficultyLabel(v) { return text(`diff_${difficultyTier(v)}`); }

function loadState() {
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    const loaded = { ...defaultState, ...local };
    loaded.selectedPlayers ||= "all";
    loaded.selectedDifficulty ||= "all";
    loaded.selectedCategory ||= "all";
    loaded.sortBy ||= "abc";
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
    })
  );
}

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

  state.categories = dedupeCategories(
    (catRes.data || []).map((c) => ({ id: c.id, name: { ko: c.name_ko, en: c.name_en, ja: c.name_ja } }))
  );

  state.boxes = (boxRes.data || []).map((b) => ({
    id: b.id,
    name: { ko: b.name_ko, en: b.name_en, ja: b.name_ja },
    lengthCm: Number(b.length_cm),
    imageUrl: b.image_url || "",
  }));

  state.games = (gameRes.data || []).map((g) => {
    const listImg = safeImageUrl(g.image_url);
    const boxImg = safeImageUrl(g.box_image_url || g.image_url, listImg);
    return {
      id: g.id,
      name: { ko: g.name_ko, en: g.name_en, ja: g.name_ja },
      lengthCm: Number(g.length_cm),
      categoryId: g.category_id,
      playersMin: Number(g.players_min),
      playersMax: Number(g.players_max),
      difficulty: Number(g.difficulty),
      imageUrl: listImg,
      boxImageUrl: boxImg,
    };
  });

  if (!state.boxes.find((b) => b.id === state.selectedBoxId)) {
    state.selectedBoxId = state.boxes[0]?.id || "b1";
  }

  state.selectedGameIds = state.selectedGameIds.filter((id) => state.games.some((g) => g.id === id));
  persist();
}

function selectedBox() { return state.boxes.find((b) => b.id === state.selectedBoxId) || state.boxes[0]; }
function selectedGames() { return state.selectedGameIds.map((id) => state.games.find((g) => g.id === id)).filter(Boolean); }
function calcUsed() { return selectedGames().reduce((sum, g) => sum + Number(g.lengthCm), 0); }
function canFitGame(game) { return Number(game.lengthCm) <= selectedBox().lengthCm - calcUsed() + 0.0001; }

function renderSelectors() {
  if (el("boxSelect")) {
    el("boxSelect").innerHTML = state.boxes.map((b) => `<option value="${b.id}">${nameOf(b)} (${b.lengthCm}cm)</option>`).join("");
    el("boxSelect").value = selectedBox()?.id || "";
  }

  if (el("categorySelect")) {
    el("categorySelect").innerHTML = [
      `<option value="all">${text("all")}</option>`,
      ...state.categories.map((c) => `<option value="${c.id}">${nameOf(c)}</option>`),
    ].join("");
    el("categorySelect").value = state.selectedCategory;
  }

  if (el("playersSelect")) {
    el("playersSelect").innerHTML = [
      `<option value="all">${text("allPlayers")}</option>`,
      `<option value="1">1</option>`,
      `<option value="2">2</option>`,
      `<option value="3">3</option>`,
      `<option value="4">4</option>`,
      `<option value="5">5</option>`,
      `<option value="6plus">6+</option>`,
    ].join("");
    el("playersSelect").value = state.selectedPlayers;
  }

  if (el("difficultySelect")) {
    el("difficultySelect").innerHTML = [
      `<option value="all">${text("allDifficulty")}</option>`,
      `<option value="beginner">${text("diff_beginner")}</option>`,
      `<option value="intermediate">${text("diff_intermediate")}</option>`,
      `<option value="advanced">${text("diff_advanced")}</option>`,
    ].join("");
    el("difficultySelect").value = state.selectedDifficulty;
  }

  if (el("gameCategory")) {
    el("gameCategory").innerHTML = state.categories.map((c) => `<option value="${c.id}">${nameOf(c)}</option>`).join("");
  }
}

function renderGames() {
  const q = el("searchInput")?.value?.trim().toLowerCase() || "";

  const list = state.games.filter((g) => {
    const categoryOk = state.selectedCategory === "all" || g.categoryId === state.selectedCategory;
    const playersOk = state.selectedPlayers === "all" ||
      (state.selectedPlayers === "6plus"
        ? Number(g.playersMax) >= 6
        : Number(g.playersMin) <= Number(state.selectedPlayers) && Number(state.selectedPlayers) <= Number(g.playersMax));
    const diffOk = state.selectedDifficulty === "all" || state.selectedDifficulty === difficultyTier(g.difficulty);
    const nameOk = Object.values(g.name || {}).some((n) => String(n || "").toLowerCase().includes(q));
    return categoryOk && playersOk && diffOk && nameOk && canFitGame(g);
  });

  list.sort((a, b) => (state.sortBy === "thickness" ? Number(a.lengthCm) - Number(b.lengthCm) : 0) ||
    nameOf(a).localeCompare(nameOf(b), undefined, { sensitivity: "base" }));

  if (el("gamesList")) {
    el("gamesList").innerHTML = list.map((g) => `
      <article class="card" data-game-id="${g.id}" draggable="true">
        <img
          src="${safeImageUrl(g.imageUrl)}"
          alt="${nameOf(g)}"
          loading="lazy"
          decoding="async"
          onerror="this.onerror=null;this.src='https://placehold.co/92x128?text=No+Image';"
        />
        <div class="meta">
          <div>${nameOf(g)}</div>
          <small>${g.lengthCm}cm · ${nameOf(state.categories.find((c) => c.id === g.categoryId))} · ${g.playersMin}~${g.playersMax}p · ${difficultyLabel(g.difficulty)}</small>
        </div>
        <button class="btn add-btn" data-id="${g.id}">${text("add")}</button>
      </article>
    `).join("");
  }
}

function renderBox() {
  const box = selectedBox();
  if (!box) return;

  const used = calcUsed();
  const remain = box.lengthCm - used;
  const fill = Math.max(0, Math.min(100, (used / box.lengthCm) * 100));

  if (el("usedValue")) el("usedValue").textContent = `${used.toFixed(1)}cm / ${box.lengthCm}cm`;
  if (el("remainingValue")) el("remainingValue").textContent = `${remain.toFixed(1)}cm`;
  if (el("fillValue")) el("fillValue").textContent = `${fill.toFixed(0)}%`;

  if (el("progressBar")) {
    el("progressBar").style.width = `${fill}%`;
    el("progressBar").style.background = remain < 0 ? "#ef4444" : "linear-gradient(90deg,#5a67d8,#6aa6ff)";
  }

  if (el("selectedList")) {
    el("selectedList").innerHTML = selectedGames()
      .map((g, i) => `<span class="chip">${nameOf(g)} (${g.lengthCm}cm) <button data-remove-idx="${i}">×</button></span>`)
      .join("");
  }

  const filledHtml = selectedGames().map((g) => {
    const widthPct = (Number(g.lengthCm) / box.lengthCm) * 100;
    return `<figure class="plug-item" style="width:${widthPct}%;flex:0 0 ${widthPct}%;background-image:url('${safeImageUrl(g.boxImageUrl || g.imageUrl)}')"></figure>`;
  }).join("");

  const emptyPct = Math.max(0, (remain / box.lengthCm) * 100);
  if (el("dropZone")) {
    el("dropZone").innerHTML = `${filledHtml}${emptyPct > 0.01 ? `<div class="empty-slot" style="width:${emptyPct}%;flex:0 0 ${emptyPct}%"></div>` : ""}`;
  }
}

function addGame(id) {
  const game = state.games.find((g) => g.id === id);
  if (!game) return;
  if (!canFitGame(game)) return alert(text("overflowMsg"));
  state.selectedGameIds.push(id);
  persist();
  render();
}

function renderAdminLists() {
  if (el("gameAdminList")) {
    el("gameAdminList").innerHTML = state.games.map((g) => `
      <article class="card">
        <div>${nameOf(g)} (${g.lengthCm}cm · ${g.playersMin}~${g.playersMax}p · ${difficultyLabel(g.difficulty)})</div>
        <button class="btn ghost" data-edit-game="${g.id}">수정</button>
        <button class="btn ghost" data-del-game="${g.id}">삭제</button>
      </article>
    `).join("");
  }
}

function render() {
  if (el("languageSelect")) el("languageSelect").value = state.lang;
  if (el("sortSelect")) el("sortSelect").value = state.sortBy || "abc";
  renderSelectors();
  renderGames();
  renderBox();
  renderAdminLists();
}

function bindAdminOpen() {
  const dialog = el("adminDialog");
  el("adminBtn")?.addEventListener("click", () => {
    dialog?.showModal();
    if (USE_ADMIN_BYPASS) {
      if (el("adminPanel")) el("adminPanel").hidden = false;
      if (el("adminLoginForm")) el("adminLoginForm").hidden = true;
    }
  });
  el("cancelBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    dialog?.close("cancel");
  });

  if (!USE_ADMIN_BYPASS) {
    el("adminLoginForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: el("adminPassword").value,
      });
      if (!error) {
        el("adminPanel").hidden = false;
        el("adminLoginForm").hidden = true;
      } else {
        alert(`로그인 실패: ${error.message || "비밀번호 확인"}`);
      }
    });
  }
}

function bind() {
  bindAdminOpen();

  el("boxSelect")?.addEventListener("change", (e) => { state.selectedBoxId = e.target.value; state.selectedGameIds = []; persist(); render(); });
  el("categorySelect")?.addEventListener("change", (e) => { state.selectedCategory = e.target.value; persist(); renderGames(); });
  el("playersSelect")?.addEventListener("change", (e) => { state.selectedPlayers = e.target.value; persist(); renderGames(); });
  el("difficultySelect")?.addEventListener("change", (e) => { state.selectedDifficulty = e.target.value; persist(); renderGames(); });
  el("sortSelect")?.addEventListener("change", (e) => { state.sortBy = e.target.value || "abc"; persist(); renderGames(); });

  el("searchInput")?.addEventListener("input", () => renderGames());

  document.body.addEventListener("click", async (e) => {
    const addBtn = e.target.closest(".add-btn");
    if (addBtn) return addGame(addBtn.dataset.id);

    const rm = e.target.closest("[data-remove-idx]");
    if (rm) {
      state.selectedGameIds.splice(Number(rm.dataset.removeIdx), 1);
      persist();
      render();
      return;
    }

    const editGame = e.target.closest("[data-edit-game]");
    if (editGame) {
      const g = state.games.find((x) => x.id === editGame.dataset.editGame);
      if (!g) return;
      editingGameId = g.id;
      el("gameNameKo").value = g.name?.ko || "";
      el("gameNameEn").value = g.name?.en || "";
      el("gameNameJa").value = g.name?.ja || "";
      el("gameLength").value = Number(g.lengthCm) || "";
      el("gameImageUrl").value = g.imageUrl || "";
      el("gameBoxImageUrl").value = g.boxImageUrl || "";
      el("gamePlayersMin").value = Number(g.playersMin) || "";
      el("gamePlayersMax").value = Number(g.playersMax) || "";
      el("gameDifficulty").value = String(Number(g.difficulty) || 2);
      el("gameCategory").value = g.categoryId || "";
      return;
    }

    const delGame = e.target.closest("[data-del-game]");
    if (delGame) {
      const { error } = await supabaseClient.from("games").delete().eq("id", delGame.dataset.delGame);
      raiseIfError(error, "게임 삭제 실패");
      await fetchSharedData();
      render();
      return;
    }
  });

  el("gameForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const minPlayers = Number(el("gamePlayersMin").value);
    const maxPlayers = Number(el("gamePlayersMax").value);
    const lengthCm = Number(el("gameLength").value);
    if (!Number.isFinite(lengthCm) || lengthCm <= 0) return alert("length cm를 올바르게 입력해주세요.");
    if (!Number.isFinite(minPlayers) || !Number.isFinite(maxPlayers)) return alert("min/max players를 입력해주세요.");
    if (minPlayers > maxPlayers) return alert("min players는 max players보다 클 수 없습니다.");

    const existing = state.games.find((x) => x.id === editingGameId);
    const listInput = el("gameImageUrl").value.trim();
    const boxInput = el("gameBoxImageUrl").value.trim();

    const listFile = el("gameImageFile")?.files?.[0] || null;
    const boxFile = el("gameBoxImageFile")?.files?.[0] || null;

    let uploadedListUrl = "";
    let uploadedBoxUrl = "";
    try {
      if (listFile) uploadedListUrl = await uploadImageFile(listFile, "game-list");
      if (boxFile) uploadedBoxUrl = await uploadImageFile(boxFile, "game-box");
    } catch (err) {
      alert(`이미지 업로드 실패\n${err.message || err}`);
      return;
    }

    const payload = {
      name_ko: el("gameNameKo").value.trim(),
      name_en: el("gameNameEn").value.trim(),
      name_ja: el("gameNameJa").value.trim(),
      length_cm: lengthCm,
      image_url: uploadedListUrl || listInput || existing?.imageUrl || "",
      box_image_url: uploadedBoxUrl || boxInput || uploadedListUrl || listInput || existing?.boxImageUrl || existing?.imageUrl || "",
      players_min: minPlayers,
      players_max: maxPlayers,
      difficulty: Number(el("gameDifficulty").value),
      category_id: el("gameCategory").value,
      is_active: true,
    };

    const { error } = editingGameId
      ? await supabaseClient.from("games").update(payload).eq("id", editingGameId)
      : await supabaseClient.from("games").insert(payload);

    raiseIfError(error, "게임 저장 실패");
    editingGameId = null;
    e.target.reset();
    await fetchSharedData();
    render();
    alert("게임 저장 완료");
  });
}

async function init() {
  bind();
  render();
  try {
    await fetchSharedData();
  } catch (error) {
    console.warn("Shared data fetch failed", error);
  }
  render();
}

init();
