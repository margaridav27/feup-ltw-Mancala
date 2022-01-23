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

  let container = document.createElement('div');
  container.className = 'container';

  //dots
  let loader = document.createElement('div');
  loader.className = 'load-container';

  loader.innerHTML = `
    <div class="loader-dot">
      <span class="dot dot-1"></span>
      <span class="dot dot-2"></span>
      <span class="dot dot-3"></span>
    </div> `

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

  let textContainer = document.createElement('div');
  let text = document.createElement('span');
  text.className = 'winner-text';
  textContainer.appendChild(text);

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
  winnerInfo.appendChild(textContainer);
  winnerInfo.appendChild(recordsBtn);

  container.appendChild(loader);
  container.appendChild(winnerInfo);

  winner.appendChild(container);

  board.appendChild(winner);
}

async function dotAnimation() {
  await sleep(3000);
  document.querySelector('.dot.dot-1').style.display = 'none';
  document.querySelector('.dot.dot-2').style.display = 'none';
  document.querySelector('.dot.dot-3').style.display = 'none';
  document.querySelector('.winner-info').style.display = 'flex';
}

function createWaitingPopUp() {
  let board = document.querySelector('body');

  let waiting = document.createElement('div');
  waiting.className = 'waiting';
  waiting.style.display = 'none';

  let closeAnchor = document.createElement('a');
  closeAnchor.className = 'close-btn';
  closeAnchor.addEventListener('click', () => {
    //game.notJoinedHandler();
    this.server.leave();
    document.querySelector('.waiting').style.display = 'none';
    appState = DEFAULT.state;
  });

  let close = document.createElement('img');
  close.setAttribute('src', 'client/assets/close.png');
  close.setAttribute('width', '20px');
  closeAnchor.appendChild(close);


  let container = document.createElement('div');
  container.className = 'load-container-waiting';

  let waitingText = document.createElement('span');
  waitingText.innerText = 'Waiting for another player to join...';

  let loaderTime = document.createElement('div');
  loaderTime.className = 'loader-time-container';

  let loader = document.createElement('div');
  loader.className = 'loader';

  let time = document.createElement('span');
  time.className = 'time';

  loaderTime.append(loader);
  loaderTime.appendChild(time);

  container.appendChild(closeAnchor);
  container.appendChild(waitingText);
  container.appendChild(loaderTime);
  waiting.appendChild(container);
  board.appendChild(waiting);
}

function hideWaitingPopUp() {
  document.querySelector('.waiting').style.display = 'none';
}

function showWaitingPopUp() {
  document.querySelector('.waiting').style.display = '';
}

function toggleCanvas() {
  changeVisibility([".time-text", ".progress-bar"]);
}

function progressBar(seconds, interval) {
  if (interval) clearInterval(interval);

  let c = document.querySelector('.progress-bar');
  let cx = c.getContext('2d');
  let counter = 0;
  let add = c.width / (seconds * 2 ** 4);

  let timerId = timer(seconds - 1, document.querySelector('.time-text'));

  cx.fillStyle = '#E6CCB2';
  cx.fillRect(0, 0, c.width, c.height);

  let barId = incrementProgressBar(add, counter, c, cx);
  return {timerId, barId};
}

function incrementProgressBar(add, counter, c, cx) {
  return setInterval(function () {
    counter += add;

    cx.fillStyle = '#9B7957';
    cx.fillRect(0, 0, counter, c.height);
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

  return setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.innerText = minutes + ':' + seconds;
    timer--;
  }, 1000);
}

function loginErrorPopUp(message) {
  document.querySelector('.error-message').style.display = 'flex';
  document.querySelector('.error-message span').innerText = message;
}

function loginPopUpHandler() {
  document.querySelector('.error-message').style.display = 'none';
}
