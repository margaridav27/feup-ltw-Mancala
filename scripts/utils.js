function changeVisibility(panels) {
  panels.forEach((panel) => {
    document.querySelector(panel).classList.toggle('hide-panel');
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
  let board = document.querySelector('.board-panel');

  let winner = document.createElement('div');
  winner.className = 'winner';
  winner.style.display = 'none';


  let loader = document.createElement('div');
  loader.className = 'loader';

  //dots
  let dot1 = document.createElement('span');
  dot1.className = 'loader__element1';

  let dot2 = document.createElement('span');
  dot2.className = 'loader__element2';

  let dot3 = document.createElement('span');
  dot3.className = 'loader__element3';
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
  close.setAttribute('src', 'assets/close.png');
  close.setAttribute('width', '20px');

  closeAnchor.appendChild(close);

  let trophy = document.createElement('img');
  trophy.setAttribute('src', 'assets/winning.png');
  trophy.className = 'rotate';
  trophy.setAttribute('width', '100px');


  let text = document.createElement('span');
  text.className = 'winner-text';
  text.innerText = 'Congratulations cenas!! You are the winner';

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
  document.querySelector('.loader__element1').style.display = 'none';
  document.querySelector('.loader__element2').style.display = 'none';
  document.querySelector('.loader__element3').style.display = 'none';
  document.querySelector('.winner-info').style.display = 'flex';

}

{/* <div class="board-panel hide-panel" id="board-panel">
<div class="winner">
  <div class="loader">
    <span class="loader__element hide-panel"></span>
    <span class="loader__element hide-panel"></span>
    <span class="loader__element hide-panel"></span>
    <div class="winner-info">
      <a class="close-btn"><img src="assets/close.png" width="20px"></a>
      <img src="assets/winning.png" class="rotate" width="100px"/>
      <span>Congratulations cenas!! You are the winner</span>
      <button id="winner-records">Records</button>
    </div>
  </div>

</div>
</div> */}