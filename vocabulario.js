(() => {
  const { vocabulary, grammar, topics, uncategorized = [] } = window.HSK_DATA;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
  // Pinyin colorido por tom (lista de palavras): 1 vermelho, 2 laranja, 3 verde, 4 azul, neutro sem cor.
  const SYLLABLES = new Set("a ai an ang ao ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu ca cai can cang cao ce cen ceng cha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo ci cong cou cu cuan cui cun cuo da dai dan dang dao de dei den deng di dian diao die ding diu dong dou du duan dui dun duo e ei en er fa fan fang fei fen feng fo fou fu ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun ka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo la lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu lo long lou lu luan lun luo lü lüe ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu na nai nan nang nao ne nei nen neng ni nia nian niang niao nie nin ning niu nong nou nu nuan nun nuo nü nüe o ou pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun ran rang rao re rei ren reng ri rong rou ru ruan rui run ruo sa sai san sang sao se sei sen seng sha shai shan shang shao she shei shen sheng shi shou shu shua shuai shuan shuang shui shun shuo si song sou su suan sui sun suo ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo wa wai wan wang wei wen weng wo wu xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun ya yan yang yao ye yi yin ying yong you yu yuan yue yun za zai zan zang zao ze zei zen zeng zha zhai zhan zhang zhao zhe zhei zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo zi zong zou zu zuan zui zun zuo".split(" ").concat("r"));
  const TONE_MARKS = { "ā":["a",1],"á":["a",2],"ǎ":["a",3],"à":["a",4],"ē":["e",1],"é":["e",2],"ě":["e",3],"è":["e",4],"ī":["i",1],"í":["i",2],"ǐ":["i",3],"ì":["i",4],"ō":["o",1],"ó":["o",2],"ǒ":["o",3],"ò":["o",4],"ū":["u",1],"ú":["u",2],"ǔ":["u",3],"ù":["u",4],"ǖ":["ü",1],"ǘ":["ü",2],"ǚ":["ü",3],"ǜ":["ü",4] };
  const splitSyllables = (word) => {
    const plain = [...word.toLowerCase()].map((c) => (TONE_MARKS[c] ? TONE_MARKS[c][0] : c)).join("");
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
  const toneOf = (syllable) => { for (const c of syllable.toLowerCase()) if (TONE_MARKS[c]) return TONE_MARKS[c][1]; return 0; };
  const colorPinyin = (text) => String(text).split(/([^A-Za-zÀ-ɏüÜ]+)/).map((part) => {
    if (!part || !/[A-Za-zÀ-ɏ]/.test(part)) return escape(part);
    const pieces = splitSyllables(part);
    if (!pieces) return escape(part);
    return pieces.map((piece) => `<span class="py-t${toneOf(piece)}">${escape(piece)}</span>`).join("");
  }).join("");
  const normalize = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const saved = JSON.parse(localStorage.getItem("hanzi-hsk-progress") || "{}");
  const renderVocab = () => {
    const query = normalize($("#vocab-search").value); const pos = $("#pos-filter").value;
    let rows = vocabulary.filter((x) => (!query || normalize(`${x.hanzi} ${x.pinyin} ${x.meaning}`).includes(query)) && (pos === "all" || normalize(x.pos).includes(pos)));
    if ($("#order-filter").value === "random") rows = [...rows].sort(() => Math.random() - .5);
    if ($("#order-filter").value === "unlearned") rows = rows.filter((x) => !saved[x.id]);
    $("#vocab-body").innerHTML = rows.map((x) => `<tr><td>${x.id}</td><td class="hanzi-cell" lang="zh-Hans">${escape(x.hanzi)}</td><td class="pinyin">${colorPinyin(x.pinyin)}</td><td>${escape(x.meaning)}</td><td>${escape(x.pos)}</td><td><button class="examples-button" type="button" data-examples="${x.id}" aria-expanded="false" aria-controls="examples-${x.id}">Exemplos</button></td></tr><tr class="example-row" id="examples-${x.id}" hidden><td colspan="6"><div class="example-box">${x.examples.map((e) => `<div class="example-item"><p class="hanzi-example" lang="zh-Hans">${escape(e.hanzi)}</p><p class="pinyin-example">${escape(e.pinyin)}</p><p class="pt-example"><em>${escape(e.translation)}</em></p></div>`).join("")}</div></td></tr>`).join("");
    $("#table-count").textContent = `${rows.length} de 300 palavras exibidas`;
  };
  $("#vocab-body").addEventListener("click", (event) => { const button = event.target.closest("[data-examples]"); if (!button) return; const row = document.getElementById(`examples-${button.dataset.examples}`); const open = row.hidden; row.hidden = !open; button.setAttribute("aria-expanded", String(open)); button.textContent = open ? "Fechar" : "Exemplos"; });
  $("#tone-toggle").addEventListener("change", () => $("#vocab-body").closest(".table-wrap").classList.toggle("no-tone-colors", !$("#tone-toggle").checked));
  ["#vocab-search", "#pos-filter", "#order-filter"].forEach((id) => $(id).addEventListener(id === "#vocab-search" ? "input" : "change", renderVocab));
  renderVocab();
})();
