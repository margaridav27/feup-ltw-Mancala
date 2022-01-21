function changeVisibility(panels) {
  panels.forEach((panel) => {
    document.querySelector(panel).classList.toggle('hidden');
  });
}

function disable(element) {
  element.style.pointerEvents = 'none';
}

function enable(element) {
  element.style.pointerEvents = 'auto';
}

function range(start, end) {
  const size = end - start;
  return [...Array(size).keys()].map((i) => i + start);
}

function random(lowerBound, upperBound) {
  return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
}

function vwToPx(vw, totalWidth) {
  return (vw * totalWidth) / 100;
}

function vhToPx(vh, totalHeight) {
  return (vh * totalHeight) / 100;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createWinnerPopUp() {
  let board = document.querySelector('body');

  let winner = document.createElement('div');
  winner.className = 'winner';
  winner.style.display = 'none';

  //dots
  let loader = document.createElement('div');
  loader.className = 'load-container';

  let dot1 = document.createElement('span');
  dot1.className = 'dot-element1';
  let dot2 = document.createElement('span');
  dot2.className = 'dot-element2';
  let dot3 = document.createElement('span');
  dot3.className = 'dot-element3';

  loader.appendChild(dot1);
  loader.appendChild(dot2);
  loader.appendChild(dot3);

  let winnerInfo = document.createElement('div');
  winnerInfo.className = 'winner-info';

  let closeAnchor = document.createElement('a');
  closeAnchor.className = 'close-btn';
  closeAnchor.addEventListener('click', () => {
    document.querySelector('.winner').style.display = 'none';
    resetGame();
    appState = DEFAULT.state;
  });

  let close = document.createElement('img');
  close.setAttribute('src', 'client/assets/close.png');
  close.setAttribute('width', '20px');
  closeAnchor.appendChild(close);

  let trophy = document.createElement('img');
  trophy.setAttribute('src', 'client/assets/winning.png');
  trophy.className = 'rotate';
  trophy.setAttribute('width', '100px');

  let text = document.createElement('span');
  text.className = 'winner-text';

  let recordsBtn = document.createElement('button');
  recordsBtn.id = 'winner-records';
  recordsBtn.innerText = 'Records';
  recordsBtn.addEventListener('click', () => {
    document.querySelector('.winner').style.display = 'none';
    document.getElementById('game-btn').innerText = 'PLAY';
    recordsClickHandler();
  });

  winnerInfo.appendChild(closeAnchor);
  winnerInfo.appendChild(trophy);
  winnerInfo.appendChild(text);
  winnerInfo.appendChild(recordsBtn);

  loader.appendChild(winnerInfo);

  winner.appendChild(loader);

  board.appendChild(winner);
}

async function dotAnimation() {
  await sleep(3000);
  document.querySelector('.dot-element1').style.display = 'none';
  document.querySelector('.dot-element2').style.display = 'none';
  document.querySelector('.dot-element3').style.display = 'none';
  document.querySelector('.winner-info').style.display = 'flex';
}

function createWaitingPopUp() {
  let board = document.querySelector('body');

  let waiting = document.createElement('div');
  waiting.className = 'waiting';
  waiting.style.display = 'none';

  let container = document.createElement('div');
  container.className = 'load-container-waiting';

  let waitingText = document.createElement('span');
  waitingText.innerHTML = 'Waiting for another player to join...';

  let loader = document.createElement('div');
  loader.className = 'loader';

  container.appendChild(waitingText);
  container.appendChild(loader);
  waiting.appendChild(container);
  board.appendChild(waiting);
}

function hideWaitingPopUp() {
  document.querySelector('.waiting').style.display = 'none';
}

function showWaitingPopUp() {
  document.querySelector('.waiting').style.display = '';
}

function progressBar(seconds) {
  let c = document.querySelector('#progress-bar');
  let cx = c.getContext('2d');
  let counter = 0;
  let add = c.width / (seconds * 2 ** 4);
  timer(seconds - 1, document.querySelector('#download-text'));
  incrementProgressBar(add, counter, c, cx);
}

function incrementProgressBar(add, counter, c, cx) {
  let interval = setInterval(function () {
    counter += add;

    cx.fillStyle = '#9B7957';
    cx.fillRect(0, 0, counter, c.height);

    if (counter == c.width) clearInterval(interval);
  }, 1000 / 2 ** 4);
}

function timer(duration, display) {
  let timer = duration,
    minutes,
    seconds;

  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  display.innerText = minutes + ':' + seconds;

  timer = duration - 1;
  let interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.innerText = minutes + ':' + seconds;

    if (--timer < 0) clearInterval(interval);
  }, 1000);
}

function loginErrorPopUp(message) {
  document.querySelector('.error-message').style.display = 'flex';
  document.querySelector('.error-message span').innerText = message;
}

function loginPopUpHandler() {
  document.querySelector('.error-message').style.display = 'none';
}
