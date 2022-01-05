var gameState = undefined;
var mancala = undefined;

function setupGame() {
  // -------------------- PLAYERS --------------------
  let player1 = document.getElementById('name-1').value;
  if (player1.length === 0) player1 = 'Player 1';

  let player2 = document.getElementById('name-2').value;
  if (player2.length === 0) player2 = 'Player 2';

  const players = [player1, player2];

  // -------------------- LEVELS --------------------
  let level = 0;

  if (player1 === 'BOT') {
    const radioBtn = document.querySelector('input[name="level-1"]:checked');
    if (radioBtn.id.match(/level-1/)) level = parseInt(radioBtn.value);
  } else if (player2 === 'BOT') {
    const radioBtn = document.querySelector('input[name="level-2"]:checked');
    if (radioBtn.id.match(/level-2/)) level = parseInt(radioBtn.value);
  }

  // -------------------- BOARD --------------------
  const holes = parseInt(document.getElementById('holes').value);
  const seeds = parseInt(document.getElementById('seeds').value);
  let board = new Board(seeds, holes, players);

  return {
    players,
    level,
    board,
  };
}

function setupBoardMoveHandlers(board) {
  for (let cavity of board) {
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
  if (gameState === 'PLAYING') {
    let succeeded = mancala.performMove(move);
    console.log("out", mancala.isBotCurrentPlayer(), succeeded)
    while (mancala.isBotCurrentPlayer() && succeeded) {
      console.log('bot turn');
      console.log(mancala.assembleDataForBot());
      //maggy se for preciso qd o bot joga outra vez mando um de cada fez e faço os calculos again, vai é ser menos eficiente
      succeeded = mancala.performBotMove();
      console.log(mancala.isBotCurrentPlayer(), succeeded)
    }

    if (!succeeded) {
      endGame();
      gameState = 'DEFAULT';
    }
  }
}

function startGame() {
  let gameData = setupGame();
  let board = gameData.board;
  let players = gameData.players;
  let level = gameData.level;

  mancala = new Mancala(board, players, level);
  setupBoardMoveHandlers(board.getCavities());

  let infoPanel = document.getElementsByClassName('info-panel');
  infoPanel.innerHTML = 'Let the game begin!';

  let playButton = document.getElementById('game-btn');
  playButton.innerHTML = 'QUIT';

  gameState = 'PLAYING';

  while (mancala.isBotCurrentPlayer()) {
    mancala.performBotMove();
    console.log('bot turn');
    console.log(mancala.assembleDataForBot());
  }
}

function resetGame() {
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

// TODO: ecrã de quit
function quitGame() {
  resetGame();
}

// TODO: ecrã de fim de jogo
async function endGame() {
  const players = mancala.getPlayers();
  const score = mancala.getScore();
  const info = document.getElementById('info');
    info.innerText = (score[0] > score[1]) ? 
      `Game over! Congratulations ${players[0]}, you won!.` : 
      `Game over! Congratulations ${players[1]}, you won!.`;
  await sleep(5000);
  GameHistory.addGameToHistory({ players, score });
  resetGame();
}
