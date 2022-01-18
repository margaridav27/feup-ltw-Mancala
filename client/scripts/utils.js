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
  let board = document.querySelector('.board-panel');

  let waiting = document.createElement('div');
  waiting.className = 'waiting';
  waiting.style.display = 'none';

  let container = document.createElement('div');
  container.className = 'load-container';

  let loader = document.createElement('div');
  loader.className = 'loader';

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

function timeBar(seconds) {
  var c = document.querySelector('#progressBar');
  var cx = c.getContext('2d');
  var counter = 0;
  var add = c.width / (seconds * 2 ** 4);
  timer(seconds - 1, document.querySelector('#download-text'));
  incrementTimeBar(add, counter, c, cx);
}

function incrementTimeBar(add, counter, c, cx) {
  var interval = setInterval(function () {
    counter += add;

    cx.fillStyle = '#9B7957';
    cx.fillRect(0, 0, counter, c.height);

    if (counter == c.width) clearInterval(interval);
  }, 1000 / 2 ** 4);
}

function timer(duration, display) {
  var timer = duration,
    minutes,
    seconds;

  minutes = parseInt(timer / 60, 10);
  seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  display.innerText = minutes + ':' + seconds;

  timer = duration - 1;
  var interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.innerText = minutes + ':' + seconds;

    if (--timer < 0) clearInterval(interval);
  }, 1000);
}

//deixar estar aqui para uns testes

// function drawImage(img,x,y,r,sx,sy, cx){
//   sx=sx||0;
//   sy=sy||0;
//   r=(r*Math.PI/180)||0;
//   var cr = Math.cos(r);
//   var sr = Math.sin(r);
//   cx.setTransform(cr,sr,-sr,cr,x-(cr*sx-sr*sy),y-(sr*sx+cr*sy));
//   cx.drawImage(img,0,0);
// }

// function render(cx, r, img){
//   window.requestAnimationFrame(function() {
//     render(cx, r, img);
//   });
//   // requestAnimationFrame(render);

//   cx.setTransform(1, 0, 0, 1, 0, 0);
//   cx.clearRect(0,0,400,400);

//   drawImage(img,100,100,r++,img.width/2,img.height/2,cx);
// }

// function canvasSpin() {
//   var r = 1;
//   var c = document.getElementById('logoCanvas');
//   var cx = c.getContext('2d');

//   var img = document.createElement('img');
//   img.onload = function(){
//     render(cx, r, img);
//   }
//   img.src = "client/assets/mancala.png";
//   console.log(img.style.width)
//   img.style.width = "1px";
//   i.disable;
// }

// canvasSpin();
