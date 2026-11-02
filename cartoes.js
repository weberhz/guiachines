(() => {
  const { vocabulary, grammar, topics, uncategorized = [] } = window.HSK_DATA;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
  const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} };
  const saved = load("hanzi-hsk-progress", {});
  const srs = load("hanzi-hsk-srs", {});
  const persist = () => { save("hanzi-hsk-progress", saved); save("hanzi-hsk-srs", srs); };
  const DAY = 86400000;
  // Marcações antigas viram agendamentos (uma vez), para não perder o progresso.
  Object.entries(saved).forEach(([id, rating]) => { if (!srs[id]) srs[id] = { ease: 2.5, lapses: 0, ...({ again: { interval: 0, reps: 0, due: Date.now() }, learning: { interval: 1, reps: 1, due: Date.now() + DAY }, know: { interval: 3, reps: 2, due: Date.now() + 3 * DAY } }[rating] || { interval: 0, reps: 0, due: Date.now() }) }; });
  // Repetição espaçada (estilo SM-2): Rever = voltar em 10 min; Aprendendo = intervalo curto; Já sei = intervalo cresce com a facilidade.
  const schedule = (state, rating) => {
    const c = { interval: 0, ease: 2.5, reps: 0, lapses: 0, due: 0, ...state };
    if (rating === "again") { if (c.reps > 0) c.lapses += 1; c.reps = 0; c.interval = 0; c.ease = Math.max(1.3, c.ease - 0.2); c.due = Date.now() + 10 * 60000; return c; }
    if (rating === "learning") { c.interval = c.reps === 0 ? 1 : Math.max(1, Math.round(c.interval * 1.2)); c.ease = Math.max(1.3, c.ease - 0.15); }
    else { c.interval = c.reps === 0 ? 2 : c.reps === 1 ? 6 : Math.round(c.interval * c.ease); c.ease += 0.05; }
    c.interval = Math.min(365, c.interval); c.reps += 1; c.due = Date.now() + c.interval * DAY; return c;
  };
  // O sistema de repetição espaçada fica por trás: a ordem do baralho prioriza palavras vencidas, depois novas, depois as que ainda não vencem.
  const smartOrder = () => { const now = Date.now(); const rank = (item) => (!srs[item.id] ? 1 : srs[item.id].due <= now ? 0 : 2); return [...vocabulary].sort((a, b) => rank(a) - rank(b) || (rank(a) === 1 ? a.id - b.id : srs[a.id].due - srs[b.id].due)); };
  let deck = smartOrder(); let cardIndex = 0; let flipped = false; let sampled = false; let filter = "all"; let showExamples = false;
  const FILTERS = { all: "Todas as palavras", again: "Rever", learning: "Aprendendo", review: "Rever + Aprendendo", unmarked: "Ainda não marcadas", know: "Já sei" };
  const inFilter = (key, item) => key === "all" || (key === "review" ? ["again", "learning"].includes(saved[item.id]) : key === "unmarked" ? !saved[item.id] : saved[item.id] === key);
  const pool = (key) => (key === "all" ? smartOrder() : vocabulary.filter((item) => inFilter(key, item)));
  const note = (text = "") => { $("#deck-note").textContent = text; };
  const emptyNote = (key) => note(`Nenhuma palavra em "${FILTERS[key]}" ainda. Marque palavras com os botões abaixo do cartão.`);
  const refreshFilterOptions = () => [...$("#deck-filter").options].forEach((option) => { option.textContent = option.value === "all" ? FILTERS.all : `${FILTERS[option.value]} (${pool(option.value).length})`; });
  const setDeck = (key, items, isSampled) => { filter = key; deck = items; cardIndex = 0; sampled = isSampled; flipped = false; showExamples = false; $("#deck-filter").value = key; renderCard(); };
  const card = $("#flashcard");
  const renderCard = () => {
    const item = deck[cardIndex]; if (!item) return;
    const mode = $("#card-mode").value; const reverse = mode === "meaning"; const withPinyin = mode === "hanzi-pinyin";
    $("#card-hanzi").textContent = reverse ? item.meaning : item.hanzi;
    $("#card-hanzi").lang = reverse ? "pt-BR" : "zh-Hans";
    $("#card-meaning").textContent = reverse ? item.hanzi : item.meaning;
    $("#card-front-pinyin").textContent = withPinyin ? item.pinyin : "";
    $("#card-front-label").textContent = reverse ? "PORTUGUÊS" : withPinyin ? "CHINÊS + PINYIN" : "CHINÊS";
    $("#card-pinyin").textContent = withPinyin ? "" : item.pinyin;
    $("#card-back-label").textContent = reverse ? "CHINÊS" : "SIGNIFICADO";
    $("#card-count").textContent = `${cardIndex + 1} / ${deck.length} · palavra #${item.id}`;
    $("#deck-label").textContent = filter === "all" && !sampled ? "Baralho: todas as 300 palavras do nível 1" : `Baralho: ${deck.length} ${deck.length === 1 ? "palavra" : "palavras"}${filter === "all" ? "" : " · " + FILTERS[filter]}${sampled ? " · sorteadas" : ""}`;
    if (!flipped) showExamples = false;
    $("#card-context").innerHTML = flipped ? `<button class="outline-button" id="toggle-examples" type="button" aria-expanded="${showExamples}">${showExamples ? "Ocultar exemplos" : "Ver exemplos"}</button>${showExamples ? `<p class="card-example-title">Frases de exemplo</p>${item.examples.map((x) => `<div class="card-example"><strong lang="zh-Hans">${escape(x.hanzi)}</strong><span>${escape(x.pinyin)}</span><small>${escape(x.translation)}</small></div>`).join("")}` : ""}` : "";
    card.classList.toggle("is-flipped", flipped);
    const count = (key) => Object.values(saved).filter((value) => value === key).length;
    $("#progress-copy").textContent = `${Object.keys(saved).length} de ${vocabulary.length} palavras marcadas · ${count("again")} para rever · ${count("learning")} aprendendo · ${count("know")} já sei`;
    refreshFilterOptions();
      };
  const move = (step) => { cardIndex = (cardIndex + step + deck.length) % deck.length; flipped = false; showExamples = false; renderCard(); };
  card.addEventListener("click", () => { flipped = !flipped; renderCard(); });
  $("#card-context").addEventListener("click", (event) => { if (event.target.closest("#toggle-examples")) { showExamples = !showExamples; renderCard(); } });
  $("#prev-card").onclick = () => move(-1); $("#next-card").onclick = () => move(1);
  $("#card-mode").addEventListener("change", renderCard);
  $("#study-words").onclick = () => { const input = $("#study-count"); const key = $("#deck-filter").value; const items = pool(key); if (!items.length) { emptyNote(key); return; } const count = Math.min(items.length, Math.max(1, parseInt(input.value, 10) || 20)); input.value = count; note(); setDeck(key, [...items].sort(() => Math.random() - .5).slice(0, count), true); };
  $("#deck-filter").addEventListener("change", () => { const key = $("#deck-filter").value; const items = pool(key); if (!items.length) { $("#deck-filter").value = filter; emptyNote(key); return; } note(); setDeck(key, items, false); });
  $("#study-count").addEventListener("keydown", (event) => { if (event.key === "Enter") $("#study-words").click(); });
  $("#all-deck").onclick = () => { note(); setDeck("all", smartOrder(), false); };
  $("#shuffle-deck").onclick = () => { deck.sort(() => Math.random() - .5); cardIndex = 0; flipped = false; renderCard(); };
  $("#clear-progress").onclick = () => { [saved, srs].forEach((store) => Object.keys(store).forEach((key) => delete store[key])); persist(); note(); if (filter !== "all") setDeck("all", smartOrder(), false); else renderCard(); };
  document.querySelectorAll("[data-rating]").forEach((button) => button.onclick = () => {
    const item = deck[cardIndex]; const rating = button.dataset.rating;
    srs[item.id] = schedule(srs[item.id], rating); saved[item.id] = rating; persist();
    if (filter !== "all" && !inFilter(filter, item)) {
      deck.splice(cardIndex, 1);
      if (!deck.length) { setDeck("all", smartOrder(), false); note("Você terminou este grupo! Voltamos para todas as palavras."); return; }
      cardIndex %= deck.length; flipped = false; showExamples = false; renderCard(); return;
    }
    if (filter === "all" && rating === "again" && deck.length > 1) {
      deck.splice(cardIndex, 1); deck.splice(Math.min(deck.length, cardIndex + 5), 0, item);
      if (deck[cardIndex] === item) cardIndex = (cardIndex + 1) % deck.length;
      flipped = false; showExamples = false; renderCard(); return;
    }
    move(1);
  });
  $("#download-csv").onclick = () => { const body = vocabulary.map((x) => [x.id,x.hanzi,x.pinyin,x.meaning,x.pos].map((v) => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["Nº,Chinês,Pinyin,Português,Classe\n" + body], {type:"text/csv;charset=utf-8"})); a.download = "vocabulario-hsk-1.csv"; a.click(); URL.revokeObjectURL(a.href); };
  renderCard();
})();
