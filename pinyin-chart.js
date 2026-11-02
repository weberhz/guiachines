const chart$ = (selector) => document.querySelector(selector);
const chartState = { initial: 'all', search: '', audio: null, playing: null };

const chartInitialLabel = (initial) => initial || 'sem inicial';
const chartNormalise = (value) => PinyinData.normalizeForAnswer(value);

function renderInitialFilter() {
  const available = new Set(PinyinData.bases().map((item) => item.initial));
  const options = [{ value: 'all', label: 'Todas' }, ...PinyinData.initials.filter((initial) => available.has(initial)).map((initial) => ({ value: initial || 'none', label: initial || '∅' }))];
  chart$('#initial-filter').innerHTML = options.map(({ value, label }) => `<button type="button" class="${chartState.initial === value ? 'is-active' : ''}" data-initial="${value}" aria-pressed="${chartState.initial === value}">${label}</button>`).join('');
}

function chartButton(item, tone) {
  if (!item.tones.includes(tone)) return '<span class="no-sound" aria-label="Gravação indisponível">—</span>';
  const text = PinyinData.toned(item.base, tone);
  return `<button class="sound-chip ${PinyinData.toneClass(tone)}" type="button" data-base="${item.base}" data-tone="${tone}" aria-label="Ouvir ${text}, ${PinyinData.toneNames[tone]}"><span>${text}</span><small>▶</small></button>`;
}

function renderChart() {
  const search = chartNormalise(chartState.search);
  const syllables = PinyinData.bases().filter((item) => {
    const matchesInitial = chartState.initial === 'all' || (chartState.initial === 'none' ? !item.initial : item.initial === chartState.initial);
    const matchesSearch = !search || chartNormalise(item.display).includes(search);
    return matchesInitial && matchesSearch;
  });
  chart$('#chart-body').innerHTML = syllables.map((item) => `<tr><td><span class="initial-token">${item.initial || '—'}</span></td><td><span class="final-token">${item.final}</span></td>${[1, 2, 3, 4, 5].map((tone) => `<td>${chartButton(item, tone)}</td>`).join('')}</tr>`).join('');
  const sounds = syllables.reduce((total, item) => total + item.tones.length, 0);
  chart$('#chart-result').textContent = `${syllables.length} sílabas-base · ${sounds} gravações exibidas${chartState.initial !== 'all' ? ` · inicial: ${chartInitialLabel(chartState.initial === 'none' ? '' : chartState.initial)}` : ''}`;
}

function setNowPlaying(item, tone, status = 'playing') {
  const panel = chart$('#now-playing');
  const text = PinyinData.toned(item.base, tone);
  panel.classList.toggle('is-playing', status === 'playing');
  panel.innerHTML = `<span class="now-playing__sound" aria-hidden="true">${status === 'error' ? '!' : '♪'}</span><span><b>${status === 'error' ? 'Não foi possível iniciar o áudio' : `Tocando ${text}`}</b><small>${status === 'error' ? 'Verifique se a pasta assets/pinyin está junto desta página.' : `${chartInitialLabel(item.initial)} + ${item.final} · ${PinyinData.toneNames[tone]}`}</small></span>`;
}

function playSyllable(base, tone, button) {
  const item = PinyinData.bases().find((entry) => entry.base === base);
  if (!item) return;
  if (chartState.audio) { chartState.audio.pause(); chartState.audio.currentTime = 0; }
  document.querySelectorAll('.sound-chip.is-playing').forEach((chip) => chip.classList.remove('is-playing'));
  button.classList.add('is-playing');
  const audio = new Audio(PinyinData.audioPath(base, tone));
  chartState.audio = audio;
  chartState.playing = button;
  setNowPlaying(item, tone);
  audio.addEventListener('ended', () => { button.classList.remove('is-playing'); chart$('#now-playing').classList.remove('is-playing'); });
  audio.addEventListener('error', () => { button.classList.remove('is-playing'); setNowPlaying(item, tone, 'error'); });
  audio.play().catch(() => { button.classList.remove('is-playing'); setNowPlaying(item, tone, 'error'); });
}

function bindChartEvents() {
  chart$('#chart-search').addEventListener('input', (event) => { chartState.search = event.target.value; renderChart(); });
  chart$('#initial-filter').addEventListener('click', (event) => {
    const button = event.target.closest('[data-initial]');
    if (!button) return;
    chartState.initial = button.dataset.initial;
    renderInitialFilter(); renderChart();
  });
  chart$('#chart-body').addEventListener('click', (event) => {
    const button = event.target.closest('.sound-chip');
    if (button) playSyllable(button.dataset.base, Number(button.dataset.tone), button);
  });
}

chart$('#base-count').textContent = PinyinData.bases().length;
chart$('#sound-count').textContent = PinyinData.all().length;
renderInitialFilter(); renderChart(); bindChartEvents();
