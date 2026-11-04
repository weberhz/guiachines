/* Evita que o pinyin de uma palavra invada a vizinha: cada palavra (.rb) é alargada até caber o seu pinyin (.rt). */
(() => {
  const range = document.createRange();
  const fit = () => {
    const items = [...document.querySelectorAll(".rb")];
    items.forEach((rb) => { rb.style.minWidth = ""; });                       // largura natural
    const needed = items.map((rb) => {                                         // mede o pinyin
      const rt = rb.querySelector(":scope > .rt"); if (!rt) return 0;
      range.selectNodeContents(rt); return Math.ceil(range.getBoundingClientRect().width);
    });
    items.forEach((rb, i) => { if (needed[i] && needed[i] + 2 > rb.offsetWidth) rb.style.minWidth = needed[i] + 4 + "px"; });
  };
  let queued = false;
  const schedule = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fit(); }); };
  new MutationObserver(schedule).observe(document.getElementById("textos") || document.body, { childList: true, subtree: true });
  window.addEventListener("resize", schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();
})();
