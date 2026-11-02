const game$ = (selector) => document.querySelector(selector);
const modeCopy = {
  initial: { badge: 'Modo 1 · inicial', title: 'Qual é a inicial?', instruction: 'Ouça a gravação e escolha a inicial correta.' },
  final: { badge: 'Modo 2 · final', title: 'Qual é a final?', instruction: 'Ouça a gravação e escolha a terminação correta.' },
  tone: { badge: 'Modo 3 · tom', title: 'Qual é o tom?', instruction: 'A sílaba é a mesma nas quatro opções. Escolha o tom que você ouviu.' },
  write: { badge: 'Modo 4 · escreva', title: 'Qual é a sílaba?', instruction: 'Digite a combinação de inicial + final. Não é necessário indicar o tom.' },
  'write-tone': { badge: 'Modo 5 · escreva + tom', title: 'Sílaba e tom', instruction: 'Digite a sílaba e depois escolha o tom correto.' }
};
const gameState = { mode: 'initial', current: null, selectedTone: null, answered: false, correct: 0, total: 0, audio: null };
const random = (items) => items[Math.floor(Math.random() * items.length)];
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const labelInitial = (initial) => initial || 'sem inicial';

function plainPool() { return PinyinData.all().filter((item) => item.tone >= 1 && item.tone <= 4); }
function makeItem(base, tone) {
  const item = PinyinData.bases().find((entry) => entry.base === base);
  return { ...item, tone, text: PinyinData.toned(base, tone) };
}
function fourTonePool() { return PinyinData.bases().filter((item) => [1, 2, 3, 4].every((tone) => item.tones.includes(tone))); }
function choices(values, correct, count = 4) {
  const unique = [...new Set(values)];
  return shuffle([correct, ...shuffle(unique.filter((value) => value !== correct)).slice(0, Math.min(count - 1, unique.length - 1))]);
}

function updateGameHeader() {
  const copy = modeCopy[gameState.mode];
  game$('#game-badge').textContent = copy.badge;
  game$('#game-title').textContent = copy.title;
  game$('#game-instruction').textContent = copy.instruction;
  game$('#game-score').textContent = `${gameState.correct} ${gameState.correct === 1 ? 'acerto' : 'acertos'} de ${gameState.total}`;
}

function renderQuestion() {
  const target = gameState.current;
  let content = '';
  if (gameState.mode === 'initial') {
    const current = target.initial || '∅';
    const answers = choices(plainPool().map((item) => item.initial || '∅'), current);
    content = `<div class="answer-grid">${answers.map((answer) => `<button class="answer-button" type="button" data-answer="${answer}">${answer === '∅' ? 'sem inicial' : answer}</button>`).join('')}</div>`;
  } else if (gameState.mode === 'final') {
    const answers = choices(plainPool().map((item) => item.final), target.final);
    content = `<div class="answer-grid">${answers.map((answer) => `<button class="answer-button" type="button" data-answer="${answer}">${answer}</button>`).join('')}</div>`;
  } else if (gameState.mode === 'tone') {
    content = `<div class="tone-options">${[1, 2, 3, 4].map((tone) => `<button class="tone-option ${PinyinData.toneClass(tone)}" type="button" data-answer-tone="${tone}"><b>${PinyinData.toned(target.base, tone)}</b><small>${PinyinData.toneNames[tone]}</small></button>`).join('')}</div>`;
  } else {
    const tonePicker = gameState.mode === 'write-tone' ? `<fieldset class="tone-picker" id="tone-picker"><legend>Qual é o tom?</legend><div>${[1, 2, 3, 4].map((tone) => `<button class="tone-pick ${PinyinData.toneClass(tone)}" type="button" data-select-tone="${tone}" aria-pressed="false"><b>${tone}</b><span>${PinyinData.toneNames[tone]}</span></button>`).join('')}</div></fieldset>` : '';
    content = `<form class="type-answer" id="type-answer"><label for="syllable-answer">Sua resposta <input id="syllable-answer" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Ex.: shi ou lü" /></label>${tonePicker}<button class="check-button" type="submit">Verificar resposta</button></form>`;
  }
  game$('#game-area').innerHTML = content;
  game$('#game-feedback').className = 'game-feedback';
  game$('#game-feedback').innerHTML = '';
  if (gameState.mode === 'write' || gameState.mode === 'write-tone') game$('#syllable-answer').focus();
}

function newQuestion() {
  if (gameState.mode === 'tone') {
    const base = random(fourTonePool());
    gameState.current = makeItem(base.base, random([1, 2, 3, 4]));
  } else {
    gameState.current = random(plainPool());
  }
  gameState.selectedTone = null;
  gameState.answered = false;
  renderQuestion(); updateGameHeader();
}

function playCurrent() {
  if (!gameState.current) return;
  if (gameState.audio) { gameState.audio.pause(); gameState.audio.currentTime = 0; }
  const audio = new Audio(PinyinData.audioPath(gameState.current.base, gameState.current.tone));
  gameState.audio = audio;
  const button = game$('#listen-button');
  button.classList.add('is-playing');
  button.querySelector('span').textContent = '❚❚';
  const finish = () => { button.classList.remove('is-playing'); button.querySelector('span').textContent = '▶'; };
  audio.addEventListener('ended', finish); audio.addEventListener('error', finish);
  audio.play().catch(finish);
}

function showNeed(text) {
  const feedback = game$('#game-feedback');
  feedback.className = 'game-feedback is-hint';
  feedback.textContent = text;
}

function resolve(correct) {
  if (gameState.answered) return;
  gameState.answered = true;
  gameState.total += 1;
  if (correct) gameState.correct += 1;
  document.querySelectorAll('#game-area button, #game-area input').forEach((element) => { element.disabled = true; });
  const item = gameState.current;
  const structure = `${labelInitial(item.initial)} + ${item.final}`;
  const feedback = game$('#game-feedback');
  feedback.className = `game-feedback ${correct ? 'is-correct' : 'is-wrong'}`;
  feedback.innerHTML = `<div><b>${correct ? 'Isso!' : 'Quase lá.'}</b><span>A resposta é <strong class="${PinyinData.toneClass(item.tone)}">${item.text}</strong> — ${structure}, ${PinyinData.toneNames[item.tone]}.</span></div><button class="next-button" type="button" data-next>Próxima gravação →</button>`;
  updateGameHeader();
}

function selectTone(tone, button) {
  if (gameState.answered) return;
  gameState.selectedTone = tone;
  document.querySelectorAll('[data-select-tone]').forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
}

function setMode(mode) {
  gameState.mode = mode; gameState.correct = 0; gameState.total = 0;
  document.querySelectorAll('[data-mode]').forEach((button) => button.classList.toggle('is-active', button.dataset.mode === mode));
  newQuestion();
}

function bindGameEvents() {
  game$('#mode-grid').addEventListener('click', (event) => { const button = event.target.closest('[data-mode]'); if (button) setMode(button.dataset.mode); });
  game$('#listen-button').addEventListener('click', playCurrent);
  game$('#game-area').addEventListener('click', (event) => {
    const answer = event.target.closest('[data-answer]');
    const toneAnswer = event.target.closest('[data-answer-tone]');
    const tonePick = event.target.closest('[data-select-tone]');
    const next = event.target.closest('[data-next]');
    if (answer) { const expected = gameState.mode === 'initial' ? (gameState.current.initial || '∅') : gameState.current.final; resolve(answer.dataset.answer === expected); }
    if (toneAnswer) resolve(Number(toneAnswer.dataset.answerTone) === gameState.current.tone);
    if (tonePick) selectTone(Number(tonePick.dataset.selectTone), tonePick);
    if (next) newQuestion();
  });
  game$('#game-area').addEventListener('submit', (event) => {
    event.preventDefault();
    const answer = game$('#syllable-answer').value;
    if (!answer.trim()) { showNeed('Digite a sílaba antes de verificar.'); return; }
    if (gameState.mode === 'write-tone' && !gameState.selectedTone) { showNeed('Agora selecione um tom para completar a resposta.'); return; }
    const syllableCorrect = PinyinData.sameBase(answer, gameState.current.base);
    const toneCorrect = gameState.mode === 'write-tone' ? gameState.selectedTone === gameState.current.tone : true;
    resolve(syllableCorrect && toneCorrect);
  });
}

bindGameEvents(); newQuestion();
