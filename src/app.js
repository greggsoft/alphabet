const LETTERS = [
  { letter: 'А', word: 'АРБУЗ', emoji: '🍉' },
  { letter: 'Б', word: 'БАНАН', emoji: '🍌' },
  { letter: 'В', word: 'ВОЛК', emoji: '🐺' },
  { letter: 'Г', word: 'ГРИБ', emoji: '🍄' },
  { letter: 'Д', word: 'ДОМ', emoji: '🏠' },
  { letter: 'Е', word: 'ЕНОТ', emoji: '🦝' },
  { letter: 'Ё', word: 'ЁЛКА', emoji: '🎄' },
  { letter: 'Ж', word: 'ЖИРАФ', emoji: '🦒' },
  { letter: 'З', word: 'ЗОНТ', emoji: '☂️' },
  { letter: 'И', word: 'ИНДЮК', emoji: '🦃' },
  { letter: 'Й', word: 'ЙОГУРТ', emoji: '🥛' },
  { letter: 'К', word: 'КОТ', emoji: '🐱' },
  { letter: 'Л', word: 'ЛИСА', emoji: '🦊' },
  { letter: 'М', word: 'МЯЧ', emoji: '⚽' },
  { letter: 'Н', word: 'НОГА', emoji: '🦵' },
  { letter: 'О', word: 'ОБЛАКО', emoji: '☁️' },
  { letter: 'П', word: 'ПИНГВИН', emoji: '🐧' },
  { letter: 'Р', word: 'РАДУГА', emoji: '🌈' },
  { letter: 'С', word: 'СЛОН', emoji: '🐘' },
  { letter: 'Т', word: 'ТИГР', emoji: '🐯' },
  { letter: 'У', word: 'УТКА', emoji: '🦆' },
  { letter: 'Ф', word: 'ФЛАМИНГО', emoji: '🦩' },
  { letter: 'Х', word: 'ХОМЯК', emoji: '🐹' },
  { letter: 'Ц', word: 'ЦВЕТОК', emoji: '🌸' },
  { letter: 'Ч', word: 'ЧЕРЕПАХА', emoji: '🐢' },
  { letter: 'Ш', word: 'ШЛЯПА', emoji: '🎩' },
  { letter: 'Щ', word: 'ЩЕНОК', emoji: '🐶' },
  { letter: 'Ъ', word: 'ОБЪЕЗД', emoji: '🚧' },
  { letter: 'Ы', word: 'МЫШЬ', emoji: '🐭' },
  { letter: 'Ь', word: 'КОНЬ', emoji: '🐴' },
  { letter: 'Э', word: 'ЭКРАН', emoji: '📺' },
  { letter: 'Ю', word: 'ЮЛА', emoji: '🌀' },
  { letter: 'Я', word: 'ЯБЛОКО', emoji: '🍎' },
];

const gameEl = document.getElementById('game');
const victoryEl = document.getElementById('victory');
const emojiEl = document.getElementById('emoji');
const wordEl = document.getElementById('word');
const choicesEl = document.getElementById('choices');
const scoreCorrectEl = document.getElementById('score-correct');
const scoreTotalEl = document.getElementById('score-total');
const restartBtn = document.getElementById('restart-btn');

let queue = [];
let currentItem = null;
let correctCount = 0;
let locked = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ru-RU';
  utt.rate = 0.85;
  speechSynthesis.speak(utt);
}

function startGame() {
  queue = shuffle([...LETTERS]);
  correctCount = 0;
  locked = false;
  scoreCorrectEl.textContent = '0';
  scoreTotalEl.textContent = LETTERS.length;
  victoryEl.classList.add('hidden');
  gameEl.classList.remove('hidden');
  nextQuestion();
}

function nextQuestion() {
  if (queue.length === 0) {
    showVictory();
    return;
  }
  locked = false;
  currentItem = queue.pop();
  renderQuestion();
}

function renderQuestion() {
  emojiEl.textContent = currentItem.emoji;

  // Highlight the first occurrence of the target letter in the word
  const word = currentItem.word;
  const idx = word.indexOf(currentItem.letter);
  if (idx === -1) {
    wordEl.textContent = word;
  } else {
    const before = word.slice(0, idx);
    const target = word[idx];
    const after = word.slice(idx + 1);
    wordEl.innerHTML = `${before}<span class="highlight">${target}</span>${after}`;
  }

  // Build 6 choices: 1 correct + 5 random unique others
  const others = LETTERS
    .filter(l => l.letter !== currentItem.letter)
    .map(l => l.letter);
  const shuffledOthers = shuffle(others).slice(0, 5);
  const options = shuffle([currentItem.letter, ...shuffledOthers]);

  choicesEl.innerHTML = '';
  options.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = letter;
    btn.addEventListener('click', () => handleChoice(btn, letter));
    choicesEl.appendChild(btn);
  });
}

function handleChoice(btn, letter) {
  if (locked) return;
  locked = true;

  if (letter === currentItem.letter) {
    btn.classList.add('correct');
    correctCount++;
    scoreCorrectEl.textContent = correctCount;
    speak(`Правильно. Буква "${currentItem.letter}", ${currentItem.word}`);
    setTimeout(nextQuestion, 3000);
  } else {
    btn.classList.add('wrong');
    speak(`Буква "${letter}"`);
    setTimeout(() => locked = false, 1000);
  }
}

function showVictory() {
  gameEl.classList.add('hidden');
  victoryEl.classList.remove('hidden');
  speak('Молодец! Ты знаешь все буквы!');
}

restartBtn.addEventListener('click', startGame);

startGame();
