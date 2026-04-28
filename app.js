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
