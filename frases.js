(() => {
  const { vocabulary, grammar, topics, uncategorized = [] } = window.HSK_DATA;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
  let activeTopic = "Todos"; let shown = 15;
  const allCount = Object.values(topics).flat().length + uncategorized.length;
  const topicEntries = () => activeTopic === "Todos" ? [...Object.values(topics).flat(), ...uncategorized] : topics[activeTopic];
  const renderTopics = () => {
    const entries = topicEntries();
    $("#topic-tabs").innerHTML = ["Todos", ...Object.keys(topics)].map((topic) => `<button class="${topic === activeTopic ? "is-active" : ""}" type="button" data-topic="${escape(topic)}">${escape(topic)}${topic === "Todos" ? ` (${allCount})` : ` (${topics[topic].length})`}</button>`).join("");
    $("#sentences-grid").innerHTML = entries.slice(0, shown).map((e) => `<article class="sentence-card"><p class="sentence-word">${escape(e.word)}</p><b lang="zh-Hans">${escape(e.hanzi)}</b><span>${escape(e.pinyin)}</span><small>${escape(e.translation)}</small></article>`).join("") + (shown < entries.length ? `<button class="show-more" id="show-more" type="button">Mostrar mais frases (${entries.length - shown} restantes)</button>` : "");
    document.querySelectorAll("[data-topic]").forEach((button) => button.onclick = () => { activeTopic = button.dataset.topic; shown = 15; renderTopics(); });
    $("#show-more")?.addEventListener("click", () => { shown += 30; renderTopics(); });
  };
  renderTopics();
})();
