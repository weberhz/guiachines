(() => {
  const texts = window.HSK_TEXTOS;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
  const vocab = new Map(window.HSK_DATA.vocabulary.map((v) => [v.hanzi, v]));
  // Significado: vem da lista de palavras; para palavras fora dela, da definição escrita em textos-data.js.
  const definitionOf = (w) => { const v = vocab.get(w.zh); if (v) return { meaning: v.meaning, pos: v.pos }; return w.meaning ? { meaning: w.meaning, pos: w.pos || "" } : null; };
  const lessons = [...new Set(texts.map((t) => t.lesson))];

  // Pinyin sobre cada caractere (ruby): alinha cada hanzi com a sílaba correspondente.
  const SYLLABLES = new Set("a ai an ang ao ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu ca cai can cang cao ce cen ceng cha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo ci cong cou cu cuan cui cun cuo da dai dan dang dao de dei den deng di dian diao die ding diu dong dou du duan dui dun duo e ei en er fa fan fang fei fen feng fo fou fu ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun ka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo la lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu lo long lou lu luan lun luo lü lüe ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu na nai nan nang nao ne nei nen neng ni nia nian niang niao nie nin ning niu nong nou nu nuan nun nuo nü nüe o ou pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun ran rang rao re rei ren reng ri rong rou ru ruan rui run ruo sa sai san sang sao se sei sen seng sha shai shan shang shao she shei shen sheng shi shou shu shua shuai shuan shuang shui shun shuo si song sou su suan sui sun suo ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo wa wai wan wang wei wen weng wo wu xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun ya yan yang yao ye yi yin ying yong you yu yuan yue yun za zai zan zang zao ze zei zen zeng zha zhai zhan zhang zhao zhe zhei zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo zi zong zou zu zuan zui zun zuo".split(" ").concat("r"));
  const TONE_MARKS = { "ā":["a",1],"á":["a",2],"ǎ":["a",3],"à":["a",4],"ē":["e",1],"é":["e",2],"ě":["e",3],"è":["e",4],"ī":["i",1],"í":["i",2],"ǐ":["i",3],"ì":["i",4],"ō":["o",1],"ó":["o",2],"ǒ":["o",3],"ò":["o",4],"ū":["u",1],"ú":["u",2],"ǔ":["u",3],"ù":["u",4],"ǖ":["ü",1],"ǘ":["ü",2],"ǚ":["ü",3],"ǜ":["ü",4] };
  const plainOf = (word) => [...word.toLowerCase()].map((c) => (TONE_MARKS[c] ? TONE_MARKS[c][0] : c)).join("");
  const splitSyllables = (word) => {
    const plain = plainOf(word);
    const walk = (start) => {
      if (start === plain.length) return [];
      for (let end = Math.min(plain.length, start + 6); end > start; end--) {
        if (!SYLLABLES.has(plain.slice(start, end))) continue;
        const rest = walk(end);
        if (rest) return [end, ...rest];
      }
      return null;
    };
    const ends = walk(0);
    if (!ends) return null;
    let start = 0;
    return ends.map((end) => { const piece = word.slice(start, end); start = end; return piece; });
  };
  // Pinyin sobre os caracteres sem alargar o texto: o <rt> fica posicionado sobre a palavra e a fonte dele é
  // reduzida só se a sílaba for mais larga que os caracteres (--n = nº de caracteres, --k = largura estimada do pinyin em em).
  const pyWidth = (annotation) => [...annotation].reduce((sum, c) => sum + (c === " " ? 0.28 : 0.55), 0);
  const ruby = (base, annotation) => `<ruby class="rb" style="--n:${[...base].length};--k:${pyWidth(annotation).toFixed(2)}">${escape(base)}<rt>${escape(annotation)}</rt></ruby>`;
  // Pontuação que segue uma palavra com pinyin fica colada a ela (não vai para o começo da linha seguinte).
  const isClosingPunct = (html) => /^[^\s\p{L}\p{N}]+$/u.test(html.replace(/&[#a-z0-9]+;/gi, ".")) && !/^[“‘（(《「『]/.test(html);
  const glue = (parts) => {
    const items = [];
    for (const part of parts) {
      const last = items[items.length - 1];
      if (last && last.head.startsWith("<ruby") && isClosingPunct(part)) last.tail.push(part);
      else items.push({ head: part, tail: [] });
    }
    return items.map((i) => (i.tail.length ? `<span class="rbw">${i.head}${i.tail.join("")}</span>` : i.head)).join("");
  };

  const readingCount = (n) => (n < 20 ? (n < 10 || n === 10 ? 1 : 2) : n % 10 === 0 ? 2 : 3); // nº de sílabas ao ler 0-99
  // Devolve o HTML com o pinyin de cada palavra sobre os seus caracteres (como no livro), ou null se hanzi e pinyin não casarem.
  const rubify = (zh, pinyin) => {
    const tokens = [...pinyin.matchAll(/[A-Za-zÀ-ɏüÜ]+/g)].map((m) => { const syl = splitSyllables(m[0]); return { text: m[0], syl: syl || [], ok: !!syl }; });
    const chars = [...zh]; const isHan = (c) => /\p{Script=Han}/u.test(c);
    const walk = (i, ti) => {
      if (i === chars.length) return ti === tokens.length ? [] : null;
      const ch = chars[i];
      if (isHan(ch)) {
        const tok = tokens[ti]; if (!tok || !tok.ok) return null;
        const n = tok.syl.length; const base = chars.slice(i, i + n);
        if (base.length < n || !base.every(isHan)) return null;
        const rest = walk(i + n, ti + 1); return rest && [ruby(base.join(""), tok.text), ...rest];
      }
      if (/[A-Za-z]/.test(ch)) {
        let j = i; while (j < chars.length && /[A-Za-z]/.test(chars[j])) j++;
        const run = chars.slice(i, j).join(""); let acc = "", k = ti;
        while (k < tokens.length && acc.length < run.length) acc += tokens[k++].text;
        if (acc.toLowerCase() !== run.toLowerCase()) return null;
        const rest = walk(j, k); return rest && [escape(run), ...rest];
      }
      if (/[0-9]/.test(ch)) {
        let j = i; while (j < chars.length && /[0-9]/.test(chars[j])) j++;
        const run = chars.slice(i, j).join("");
        const counts = run.length > 4 ? [run.length] : [...new Set([run.length <= 2 ? readingCount(Number(run)) : run.length, run.length])];
        for (const n of counts) {
          let k = ti, total = 0; while (k < tokens.length && total < n && tokens[k].ok) { total += tokens[k].syl.length; k++; }
          if (total !== n) continue;
          const part = tokens.slice(ti, k);
          const html = run.length > 4 ? (part.length === run.length && part.every((p) => p.syl.length === 1) ? [...run].map((d, x) => ruby(d, part[x].text)).join("") : null) : ruby(run, part.map((p) => p.text).join(" "));
          if (html === null) continue;
          const rest = walk(j, k); if (rest) return [html, ...rest];
        }
        return null;
      }
      const rest = walk(i + 1, ti); return rest && [escape(ch), ...rest];
    };
    const out = walk(0, 0);
    return out && glue(out);
  };

  const line = (l, speakers) => {
    const speaker = rubify(l.speaker, l.speakerPinyin); const body = rubify(l.zh, l.pinyin);
    return `<div class="dlg-line"><div class="dlg-speaker">${speaker ? `<b class="is-ruby" lang="zh-Hans">${speaker}</b>` : `<small>${escape(l.speakerPinyin)}</small><b lang="zh-Hans">${escape(l.speaker)}</b>`}</div><div class="dlg-body">${body ? `<p class="dlg-zh is-ruby" lang="zh-Hans">${body}</p>` : `<small class="dlg-pinyin">${escape(l.pinyin)}</small><p class="dlg-zh" lang="zh-Hans">${escape(l.zh)}</p>`}<p class="dlg-pt">${escape(l.pt)}</p></div></div>`;
  };
  const word = (w) => {
    const html = [...w.zh].length === 1 ? ruby(w.zh, w.pinyin) : rubify(w.zh, w.pinyin);
    const main = html ? `<b class="is-ruby" lang="zh-Hans">${html}</b>` : `<small>${escape(w.pinyin)}</small><b lang="zh-Hans">${escape(w.zh)}</b>`;
    const tag = w.note ? `<span class="word-tag">${escape(w.note)}</span>` : "";
    const def = definitionOf(w);
    if (!def) return `<li><span class="word-chip is-static">${main}${tag}</span></li>`;
    const meta = def.pos || tag ? `<span class="word-meta">${def.pos ? `<i>${escape(def.pos)}</i>` : ""}${tag}</span>` : "";
    return `<li><button class="word-chip" type="button" aria-expanded="false">${main}<span class="word-def" hidden><span class="word-meaning">${escape(def.meaning)}</span>${meta}</span></button></li>`;
  };
  // Imagens dos textos: images/X-Y.jpeg (X = lição, Y = texto). A lição 15, texto 2 tem duas imagens, com o nome da cidade embaixo.
  const imagesOf = (t) => (t.lesson === 15 && t.text === 2
    ? [{ src: "images/15-2-xian.jpeg", caption: "西安" }, { src: "images/15-2-beijing.jpeg", caption: "北京" }]
    : [{ src: `images/${t.lesson}-${t.text}.jpeg` }]);
  const figures = (t) => { const imgs = imagesOf(t); return `<div class="text-figures${imgs.length > 1 ? " is-multi" : ""}">${imgs.map((i) => `<figure class="text-figure"><div class="figure-box"><img src="${i.src}" alt="${escape(i.caption || t.scenePt)}" loading="lazy" decoding="async"></div>${i.caption ? `<figcaption lang="zh-Hans">${i.caption}</figcaption>` : ""}</figure>`).join("")}</div>`; };
  const card = (t) => { const speakers = [...new Set(t.lines.map((l) => l.speaker))]; return `<article class="text-card" id="texto-${t.lesson}-${t.text}"><div class="text-head"><span class="text-label">Texto ${t.text}</span><button class="audio-btn" type="button" data-audio="audios/${t.lesson}-${t.text}.mp3" aria-label="Ouvir áudio do texto"><svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg><svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4.5" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4.5" height="14" rx="1.2" fill="currentColor"/></svg><span class="audio-label">Ouvir</span></button></div><div class="text-scene"><p class="scene-zh" lang="zh-Hans">${escape(t.sceneZh)}</p><p class="scene-pt">${escape(t.scenePt)}</p></div>${figures(t)}<div class="text-dialogue">${t.lines.map((l) => line(l, speakers)).join("")}</div><div class="text-words"><div class="words-head"><h4>Palavras novas</h4><button class="text-button" type="button" data-words-toggle>Mostrar todos</button></div><ul>${t.words.map(word).join("")}</ul></div></article>`; };

  // Seletor de lições: grade de botões; ao escolher uma, só os textos dessa lição aparecem abaixo.
  const lessonHtml = (n) => {
    const items = texts.filter((t) => t.lesson === n); const i = lessons.indexOf(n); const prev = lessons[i - 1]; const next = lessons[i + 1];
    return `<div class="lesson-head"><h2>Lição ${n}</h2></div>${items.map(card).join("")}<nav class="lesson-pager" aria-label="Navegar entre lições">${prev ? `<button type="button" data-lesson="${prev}">← Lição ${prev}</button>` : "<span></span>"}${next ? `<button type="button" data-lesson="${next}">Lição ${next} →</button>` : "<span></span>"}</nav>`;
  };
  const grid = $("#lesson-grid"); const view = $("#lesson-view"); let current = null;
  grid.innerHTML = lessons.map((n) => `<button class="lesson-tile" type="button" data-lesson="${n}" aria-pressed="false">Lição ${n}</button>`).join("");
  // Áudio dos textos: arquivos em audios/X-Y.mp3 (X = lição, Y = texto). Só um áudio toca por vez.
  let audio = null; let audioBtn = null;
  const setAudioState = (btn, playing) => {
    btn.classList.toggle("is-playing", playing);
    btn.querySelector(".audio-label").textContent = playing ? "Pausar" : "Ouvir";
    btn.setAttribute("aria-label", playing ? "Pausar áudio" : "Ouvir áudio do texto");
  };
  const stopAudio = () => {
    const a = audio; const btn = audioBtn; audio = null; audioBtn = null;
    if (a) a.pause();
    if (btn) { btn.style.removeProperty("--p"); setAudioState(btn, false); }
  };
  const playAudio = (btn) => {
    if (audio && audioBtn === btn) { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); return; }
    stopAudio();
    const a = new Audio(btn.dataset.audio); audio = a; audioBtn = btn;
    a.addEventListener("play", () => setAudioState(btn, true));
    a.addEventListener("pause", () => setAudioState(btn, false));
    a.addEventListener("timeupdate", () => btn.style.setProperty("--p", a.duration ? `${(a.currentTime / a.duration * 100).toFixed(1)}%` : "0%"));
    a.addEventListener("ended", () => { btn.style.removeProperty("--p"); setAudioState(btn, false); });
    a.addEventListener("error", () => { btn.disabled = true; btn.querySelector(".audio-label").textContent = "Áudio indisponível"; if (audio === a) { audio = null; audioBtn = null; } });
    a.play().catch(() => {});
  };
  // Mostra uma lição por vez; sempre há uma lição selecionada.
  const showLesson = (n, { scroll = true } = {}) => {
    current = n; stopAudio();
    grid.querySelectorAll(".lesson-tile").forEach((tile) => tile.setAttribute("aria-pressed", String(Number(tile.dataset.lesson) === current)));
    grid.querySelector('.lesson-tile[aria-pressed="true"]')?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    view.innerHTML = lessonHtml(current);
    view.querySelectorAll(".text-figure img").forEach((img) => img.addEventListener("error", () => { const wrap = img.closest(".text-figures"); img.closest(".text-figure").remove(); if (!wrap.querySelector(".text-figure")) wrap.remove(); }));
    try { history.replaceState(null, "", `#licao-${current}`); } catch (e) {}
    if (scroll) view.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  $("#textos").addEventListener("click", (event) => {
    const pick = event.target.closest("[data-lesson]"); if (pick) { showLesson(Number(pick.dataset.lesson)); return; }
    const play = event.target.closest(".audio-btn"); if (play && !play.disabled) playAudio(play);
  });
  const openFromHash = () => {
    const m = location.hash.match(/^#(?:licao-(\d+)|texto-(\d+)-\d+)$/);
    const n = m ? Number(m[1] || m[2]) : null;
    if (n && lessons.includes(n)) { if (current !== n) showLesson(n, { scroll: false }); document.getElementById(location.hash.slice(1))?.scrollIntoView(); }
    else if (current === null) showLesson(lessons[0], { scroll: false });
  };
  openFromHash(); window.addEventListener("hashchange", openFromHash);
  // Palavras novas: clique abre/fecha o significado; o botão do cartão abre/fecha todos.
  const setChip = (chip, open) => { chip.setAttribute("aria-expanded", String(open)); chip.querySelector(".word-def").hidden = !open; };
  const syncAll = (card) => { const chips = [...card.querySelectorAll("button.word-chip")]; const all = chips.length > 0 && chips.every((c) => c.getAttribute("aria-expanded") === "true"); const button = card.querySelector("[data-words-toggle]"); button.dataset.state = all ? "open" : ""; button.textContent = all ? "Ocultar todos" : "Mostrar todos"; };
  $("#texts-list").addEventListener("click", (event) => {
    const chip = event.target.closest("button.word-chip");
    if (chip) { setChip(chip, chip.getAttribute("aria-expanded") !== "true"); syncAll(chip.closest(".text-card")); return; }
    const toggle = event.target.closest("[data-words-toggle]");
    if (toggle) { const card = toggle.closest(".text-card"); const open = toggle.dataset.state !== "open"; card.querySelectorAll("button.word-chip").forEach((c) => setChip(c, open)); syncAll(card); }
  });

  // Botões liga/desliga: pinyin (ligado) e tradução (desligada por padrão). A escolha fica salva no navegador.
  const section = $("#textos"); const pinyinSwitch = $("#toggle-pinyin"); const translationSwitch = $("#toggle-translation");
  let prefs = {}; try { prefs = JSON.parse(localStorage.getItem("hanzi-hsk-textos") || "{}"); } catch (e) {}
  pinyinSwitch.checked = prefs.pinyin !== false; translationSwitch.checked = prefs.translation === true;
  const applyView = () => {
    section.classList.toggle("hide-pinyin", !pinyinSwitch.checked); section.classList.toggle("hide-translation", !translationSwitch.checked);
    try { localStorage.setItem("hanzi-hsk-textos", JSON.stringify({ pinyin: pinyinSwitch.checked, translation: translationSwitch.checked })); } catch (e) {}
  };
  pinyinSwitch.addEventListener("change", applyView); translationSwitch.addEventListener("change", applyView); applyView();
})();
