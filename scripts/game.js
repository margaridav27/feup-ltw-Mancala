var gameState = undefined;
var mancala = undefined;

function setupPlayers() {
  // fetch players configurations
  let player1 = document.getElementById('name-1').value;
  let player2 = document.getElementById('name-2').value;
  let level = 0;

  // check player vs bot
  if (player1 === 'BOT') {
    const radioBtn = document.querySelector('input[name="level-1"]:checked');
    if (radioBtn.id.match(/level-1/)) level = parseInt(radioBtn.value);
  } else if (player2 === 'BOT') {
    const radioBtn = document.querySelector('input[name="level-2"]:checked');
    if (radioBtn.id.match(/level-2/)) level = parseInt(radioBtn.value);
  }

  if (player1.length === 0) player1 = 'Player 1';
  else if (player2.length === 1) player1 = 'Player 2';

  return {
    players: [player1, player2],
    level: level,
  };
}

function setupBoard() {
  // fetch board configurations
  const holes = parseInt(document.getElementById('holes').value);
  const seeds = parseInt(document.getElementById('seeds').value);
  return new Board(seeds, holes);
}

function setupBoardMoveHandlers(board) {
  for (cavity of board) {
    if (cavity instanceof Hole) {
      let cavityID = cavity.getID();
      let cavityElement = document.getElementById(`col-${cavityID}`);
      cavityElement.addEventListener('click', () => {
        moveHandler(cavityID);
      });
    }
  }
}

function moveHandler(move) {
  switch (gameState) {
    case 'PLAYING':
      //if (mancala.isBotCurrentPlayer()) mancala.performBot();
      let succeeded = mancala.performMove(move);
      //if (mancala.isBotCurrentPlayer()) mancala.performBot();
      if (!succeeded) {
        //mancala.endGame();
        endGame();
        gameState = 'DEFAULT';
      }
      break;
    default:
      break;
  }
}

function startGame() {
  let board = setupBoard();
  let players = setupPlayers().players;
  let level = setupPlayers().level;

  mancala = new Mancala(board, players, level);
  console.log(board.getBoard());
  setupBoardMoveHandlers(board.getBoard());

  let infoPanel = document.getElementsByClassName('info-panel');
  infoPanel.innerHTML = 'Let the game begin!';

  let playButton = document.getElementById('game-btn');
  playButton.innerHTML = 'QUIT';

  gameState = 'PLAYING';

  //if (mancala.isBotCurrentPlayer()) mancala.performBot();
}

function quitGame() {
  // reset scores
  const scoreP1 = document.getElementById('score-1');
  scoreP1.innerHTML = 0;
  const scoreP2 = document.getElementById('score-2');
  scoreP2.innerHTML = 0;

  let playButton = document.getElementById('game-btn');
  playButton.innerHTML = 'PLAY';

  let panels = ['.info-panel', '.board-panel', '.default-panel'];
  changeVisibility(panels);

  let menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach((button) => {
    enable(button);
  });

  mancala = undefined;
  gameState = undefined;
}

function endGame() {
  // reset scores
  const scoreP1 = document.getElementById('score-1');
  scoreP1.innerHTML = 0;
  const scoreP2 = document.getElementById('score-2');
  scoreP2.innerHTML = 0;

  let playButton = document.getElementById('game-btn');
  playButton.innerHTML = 'PLAY';

  let panels = ['.info-panel', '.board-panel', '.default-panel'];
  changeVisibility(panels);

  let menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach((button) => {
    enable(button);
  });

  mancala = undefined;
  gameState = undefined;
}
