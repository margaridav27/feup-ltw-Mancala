const DEFAULT = { state: 0, panel: '.default-panel' };
const BOARD = { state: 1, panel: '.board-panel' };
const INFO = { state: 2, panel: '.info-panel' };
const INSTRUCTIONS = { state: 3, panel: '.instructions-panel' };
const SCORES = { state: 4, panel: '.records-panel.score-records' };
const GAMES = { state: 5, panel: '.records-panel.game-records' };
const SETTINGS = { state: 6, panel: '.settings-panel' };

var appState = DEFAULT.state;
var gameState = undefined;
var multiplayer = false;
var loggedIn = false;
var mancala = undefined;

window.onload = () => {
  setupEventHandlers();
};

function setupEventHandlers() {
  let logo = document.getElementById('logo');
  logo.addEventListener('click', () => {
    logoClickHandler();
  });

  let loginBtn = document.getElementById('login');
  loginBtn.addEventListener('click', () => {
    loginClickHandler();
  });

  let gameBtn = document.getElementById('game-btn');
  gameBtn.addEventListener('click', () => {
    gameClickHandler();
  });

  let instructionsBtn = document.getElementById('instructions-btn');
  instructionsBtn.addEventListener('click', () => {
    instructionsClickHandler();
  });

  let recordsBtn = document.getElementById('records-btn');
  recordsBtn.addEventListener('click', () => {
    recordsClickHandler();
  });

  let settingsBtn = document.getElementById('settings-btn');
  settingsBtn.addEventListener('click', () => {
    settingsClickHandler();
  });

  let botCheckbox1 = document.getElementById('bot-1');
  botCheckbox1.addEventListener('click', () => {
    botCheckHandler('1');
  });

  let botCheckbox2 = document.getElementById('bot-2');
  botCheckbox2.addEventListener('click', () => {
    botCheckHandler('2');
  });
}

function loginClickHandler() {
  let loginBtn = document.getElementById('login');
  let loginArea = document.querySelectorAll('.auth div');

  if (!loggedIn) {
    loginBtn.innerText = 'Logout';
    loginArea.forEach((field) => disable(field));

    const nick = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const data = { nick, pass };
    Server.register(data);

    loggedIn = true;
  } else {
    loginBtn.innerText = 'Login';
    loginArea.forEach((field) => enable(field));

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    loggedIn = false;
  }
}

function logoClickHandler() {
  let panels = [];
  let recordsButton = document.getElementById('records-btn');

  switch (appState) {
    case INSTRUCTIONS.state:
      panels.push(INSTRUCTIONS.panel);
      break;
    case GAMES.state:
      panels.push(GAMES.panel);
      recordsButton.innerText = 'RECORDS';
      GameHistory.cleanHistory();
      break;
    case SCORES.state:
      panels.push(SCORES.panel);
      recordsButton.innerText = 'RECORDS';
      GameHistory.cleanHistory();
      break;
    case SETTINGS.state:
      panels.push(SETTINGS.panel);
      break;
    case BOARD.state:
      return;
    default:
      break;
  }

  panels.push(DEFAULT.panel);
  changeVisibility(panels);
  appState = DEFAULT.state;
}

function gameClickHandler() {
  let panels = [];
  const prevAppState = appState;
  let recordsButton = document.getElementById('records-btn');

  switch (appState) {
    case BOARD.state:
      quitGame();
      appState = DEFAULT.state;
      break;
    case DEFAULT.state:
      panels.push(DEFAULT.panel);
      break;
    case INSTRUCTIONS.state:
      panels.push(INSTRUCTIONS.panel);
      break;
    case GAMES.state:
      panels.push(GAMES.panel);
      recordsButton.innerText = 'RECORDS';
      GameHistory.cleanHistory();
      break;
    case SCORES.state:
      panels.push(SCORES.panel);
      recordsButton.innerText = 'RECORDS';
      GameHistory.cleanHistory();
      break;
    case SETTINGS.state:
      panels.push(SETTINGS.panel);
      break;
    default:
      break;
  }

  if (prevAppState !== BOARD.state) {
    panels.push(INFO.panel);
    panels.push(BOARD.panel);

    let menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach((button) => {
      disable(button);
    });
    enable(menuButtons[0]); // now quit button

    changeVisibility(panels);
    appState = BOARD.state;

    if (Server.user) multiplayer = true;
    startGame();
  }
}

function instructionsClickHandler() {
  let panels = [];
  let recordsButton = document.getElementById('records-btn');

  switch (appState) {
    case DEFAULT.state:
      panels.push(DEFAULT.panel);
      break;
    case GAMES.state:
      panels.push(GAMES.panel);
      recordsButton.innerText = 'RECORDS';
      GameHistory.cleanHistory();
      break;
    case SCORES.state:
      panels.push(SCORES.panel);
      recordsButton.innerText = 'RECORDS';
      GameHistory.cleanHistory();
      break;
    case SETTINGS.state:
      panels.push(SETTINGS.panel);
      break;
    case BOARD.state:
      panels.push(DEFAULT.panel);
      break;
    case INSTRUCTIONS.state:
      return;
    default:
      break;
  }

  panels.push(INSTRUCTIONS.panel);
  changeVisibility(panels);
  appState = INSTRUCTIONS.state;
}

function recordsClickHandler() {
  let panels = [];

  switch (appState) {
    case DEFAULT.state:
      panels.push(DEFAULT.panel);
      break;
    case INSTRUCTIONS.state:
      panels.push(INSTRUCTIONS.panel);
      break;
    case SETTINGS.state:
      panels.push(SETTINGS.panel);
      break;
    case BOARD.state:
      panels.push(DEFAULT.panel);
      break;
    default:
      break;
  }

  let recordsButton = document.getElementById('records-btn');
  if (appState === GAMES.state || appState === SCORES.state) {
    if (appState === GAMES.state) {
      recordsButton.innerText = 'SCORE RECORDS';
      appState = SCORES.state;
    } else {
      recordsButton.innerText = 'GAME RECORDS';
      appState = GAMES.state;
    }

    panels.push(GAMES.panel);
    panels.push(SCORES.panel);

    GameHistory.cleanHistory();
    GameHistory.renderLocalScores();
  } else {
    panels.push(GAMES.panel);
    recordsButton.innerText = 'GAME RECORDS';
    appState = GAMES.state;

    GameHistory.renderLocalGames();
  }

  changeVisibility(panels);
}

function settingsClickHandler() {
  let panels = [];
  let recordsButton = document.getElementById('records-btn');

  switch (appState) {
    case DEFAULT.state:
      panels.push(DEFAULT.panel);
      break;
    case INSTRUCTIONS.state:
      panels.push(INSTRUCTIONS.panel);
      break;
    case GAMES.state:
      panels.push(GAMES.panel);
      recordsButton.innerText = 'RECORDS';
      break;
    case SCORES.state:
      panels.push(SCORES.panel);
      recordsButton.innerText = 'RECORDS';
      break;
    case BOARD.state:
      panels.push(DEFAULT.panel);
      break;
    case SETTINGS.state:
      return;
    default:
      break;
  }

  panels.push(SETTINGS.panel);
  changeVisibility(panels);
  appState = SETTINGS.state;
}

/* --------------------------------------------- */

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

async function moveHandler(move) {
  let succeeded = true;
  if (gameState === 'PLAYING') {
    if (multiplayer) {
      Server.notify(move).then(() => {
        Server.update();
      })
    } else {
      succeeded = mancala.performMove(move);
      if (succeeded && mancala.isBotCurrentPlayer()) succeeded = await mancala.performBotMove();
    }
    /*
      if multiplayer
        - click handler é clicked -> mandar notify
        - analisar a resposta 
            -> if { }, tudo ok 
               -> pedir update -> perform move com o move recebido
               -> atualizamos na info de quem é a vez de jogar

            -> if error
               -> mostramos na info que jogou na vez errada

    */
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

  let infoPanel = document.getElementById('info');
  let playButton = document.getElementById('game-btn');

  if (multiplayer) {
    const data = {
      size: (board.getCavities().length - 2) / 2,
      seeds: board.getCavities()[0].getInitialNrSeeds(),
    };

    Server.join(data)
      .then(() => {
        infoPanel.innerText = `Hi there ${Server.user}! Please wait for someone to join the game.`;
        playButton.innerText = 'QUIT';
        gameState = 'PLAYING';
      })
      .then(() => {
        Server.update().then(() => {
          infoPanel.innerText = `Great news ${Server.user}! You have been joined. Let the game begin!`;
        });
      });
  } else {
    infoPanel.innerText = 'Let the game begin!';
    playButton.innerText = 'QUIT';
    gameState = 'PLAYING';

    if (mancala.isBotCurrentPlayer()) mancala.performBotMove();
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
  info.innerText =
    score[0] > score[1]
      ? `Game over! Congratulations ${players[0]}, you won!.`
      : `Game over! Congratulations ${players[1]}, you won!.`;
  await sleep(5000);
  GameHistory.addGameToHistory({ players, score });
  resetGame();
}




/**
 * to list
 * - pensar em maneira de estruturar o codigo
 *      - p.ex. tipo de jogo 
 * 
 * - se for com server
 * - 1º valores do nr de holes e nr de seeds
 * - 2º mandar join
 * - 3º receber resposta do join
 * - 4º pedir update e receber resposta com o board e turn
 * - 5º set do nome dos players com players[0] com o nome do jogador da turn
 * - 6º new Mancala com os valores certos
 * 
 * - on click num hole
 * - mandar notify e receber resposta
 * - se não for erro, pedir update e perform move com jogada que foi efetuada
 */
