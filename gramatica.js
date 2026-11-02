(() => {
  const { vocabulary, grammar, topics, uncategorized = [] } = window.HSK_DATA;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
  // Gramática: todas as estruturas na página, recolhidas; clique para expandir.
  // Estruturas com mais de uma forma (separadas por "|") viram linhas separadas.
  const patternHtml = (structure, labels = []) => { const forms = structure.split(/\s*\|\s*/).filter(Boolean); return `<div class="gv-pattern${forms.length > 1 ? " is-multi" : ""}"><span>${forms.length > 1 ? "Estruturas" : "Estrutura"}</span>${forms.map((form, i) => (labels[i] ? `<strong class="has-label"><small>${escape(labels[i])}</small>${escape(form)}</strong>` : `<strong>${escape(form)}</strong>`)).join("")}</div>`; };
  $("#grammar-list").innerHTML = grammar.map((g) => `<details class="gv-item"><summary><span class="gv-category">${escape(g.category)}</span><span class="gv-item-title">${escape(g.title)}</span></summary><div class="gv-body">${patternHtml(g.structure, g.labels)}<p class="gv-explanation">${escape(g.explanation)}</p><p class="gv-tip"><b>Dica</b>${escape(g.tip)}</p><h4 class="gv-examples-title">Exemplos</h4><div class="gv-examples">${g.examples.map((e) => `<div class="gv-example"><p class="gv-hanzi" lang="zh-Hans">${escape(e.hanzi)}</p><p class="gv-pinyin">${escape(e.pinyin)}</p><p class="gv-translation">${escape(e.translation)}</p>${e.note ? `<p class="gv-note">${escape(e.note)}</p>` : ""}</div>`).join("")}</div></div></details>`).join("");
  const setAll = (open) => document.querySelectorAll(".gv-item").forEach((item) => { item.open = open; });
  $("#grammar-expand").onclick = () => setAll(true);
  $("#grammar-collapse").onclick = () => setAll(false);
})();
