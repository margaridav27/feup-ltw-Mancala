const DEFAULT = { state: 0, panel: '.default-panel' };
const BOARD = { state: 1, panel: '.board-panel' };
const INFO = { state: 2, panel: '.info-panel' };
const INSTRUCTIONS = { state: 3, panel: '.instructions-panel' };
const SCORES = { state: 4, panel: '.records-panel.score-records' };
const GAMES = { state: 5, panel: '.records-panel.game-records' };
const SETTINGS = { state: 6, panel: '.settings-panel' };

var appState = DEFAULT.state;
var loggedIn = false;
var game = undefined;
var server = undefined;

window.onload = () => {
  setupEventHandlers();
};

function setupEventHandlers() {
  let logo = document.getElementById('logo');
  logo.addEventListener('click', () => logoClickHandler());

  let loginBtn = document.getElementById('login');
  loginBtn.addEventListener('click', () => loginClickHandler());

  let gameBtn = document.getElementById('game-btn');
  gameBtn.addEventListener('click', () => gameClickHandler());

  let instructionsBtn = document.getElementById('instructions-btn');
  instructionsBtn.addEventListener('click', () => instructionsClickHandler());

  let recordsBtn = document.getElementById('records-btn');
  recordsBtn.addEventListener('click', () => recordsClickHandler());

  let settingsBtn = document.getElementById('settings-btn');
  settingsBtn.addEventListener('click', () => settingsClickHandler());

  let botCheckbox1 = document.getElementById('bot-1');
  botCheckbox1.addEventListener('click', () => botCheckHandler('1'));

  let botCheckbox2 = document.getElementById('bot-2');
  botCheckbox2.addEventListener('click', () => botCheckHandler('2'));

  let close = document.getElementById('error-popup');
  close.addEventListener('click', () => loginPopUpHandler());

  document.addEventListener('endGame', () => endGame());

  document.addEventListener('quitGame', () => quitGame());
}

function loginClickHandler() {
  let loginBtn = document.getElementById('login');
  let loginArea = document.querySelectorAll('.auth div');

  if (!loggedIn) {
    const nick = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const data = { nick, pass };
    server = new Server();
    server.register(data).then((response) => {
      if (response.error !== undefined) {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        if (response.error == 'User registered with a different password')
          alert('Wrong credentials. Please verify the username and password again.');
        else alert('Server is down. Please verify if you are connected');
      } else {
        loginBtn.innerText = 'Logout';
        loginArea.forEach((field) => disable(field));

        loggedIn = true;
      }
    });
  } else {
    loginBtn.innerText = 'Login';
    loginArea.forEach((field) => enable(field));

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    loggedIn = false;

    if (game) {
      server.leave();
      appState = DEFAULT.state;
      resetGame();
    }
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

  if (appState !== DEFAULT.state) {
    panels.push(DEFAULT.panel);
    changeVisibility(panels);
    appState = DEFAULT.state;
  }
}

function gameClickHandler() {
  console.log('app on play click', appState);
  let panels = [];
  const prevAppState = appState;

  let recordsButton = document.getElementById('records-btn');

  switch (appState) {
    case BOARD.state:
      if (game instanceof ServerGame) game.quitHandler();
      quitGame();

      //server = undefined;
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

    changeVisibility(panels);

    toggleGameButton();

    let menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach((button) => disable(button));

    let loginBtn = document.getElementById('login');
    if (loginBtn.innerText === 'Login') {
      disable(loginBtn);

      let loginArea = document.querySelectorAll('.auth div');
      loginArea.forEach((field) => disable(field));
    }

    enable(menuButtons[0]); // now quit button

    appState = BOARD.state;

    if (loggedIn) game = new ServerGame(server);
    else {
      const botTurn = checkAgainstBot();
      if (botTurn === -1) game = new LocalGame();
      else game = new BotGame(botTurn);
    }

    game.startGame();
  }

  console.log('app on play click after', appState);
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
      panels.push(INFO.panel);
      panels.push(BOARD.panel);

      let menuButtons = document.querySelectorAll('.menu-btn');
      menuButtons.forEach((button) => {
        enable(button);
      });

      let loginBtn = document.getElementById('login');
      if (loginBtn.innerText === 'Login') {
        enable(loginBtn);

        let loginArea = document.querySelectorAll('.auth div');
        loginArea.forEach((field) => enable(field));
      }
      break;
    default:
      break;
  }

  if (loggedIn) {
    server.ranking().then((response) => {
      GameHistory.cleanHistory();

      const rankingObj = response;
      GameHistory.renderServerGames(rankingObj);

      if (appState !== SCORES.state) panels.push(SCORES.panel);
      changeVisibility(panels);

      appState = SCORES.state;
    });
  } else {
    let recordsButton = document.getElementById('records-btn');

    if (appState === GAMES.state || appState === SCORES.state) {
      GameHistory.cleanHistory();

      if (appState === GAMES.state) {
        recordsButton.innerText = 'SCORE RECORDS';
        appState = SCORES.state;
        GameHistory.renderLocalScores();
      } else {
        recordsButton.innerText = 'GAME RECORDS';
        appState = GAMES.state;
        GameHistory.renderLocalGames();
      }

      panels.push(GAMES.panel);
      panels.push(SCORES.panel);
    } else {
      panels.push(GAMES.panel);
      recordsButton.innerText = 'GAME RECORDS';
      appState = GAMES.state;

      GameHistory.renderLocalGames();

      changeVisibility(panels);
    }
  }
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

function toggleGameButton() {
  let playButton = document.getElementById('game-btn');
  if (playButton.innerText === 'QUIT') playButton.innerText = 'PLAY';
  else playButton.innerText = 'QUIT';
}

function resetGame() {
  game = undefined;

  toggleGameButton();

  let panels = ['.info-panel', '.board-panel', '.default-panel'];
  panels.forEach((pan) => console.log(document.querySelector(pan).classList.value));
  changeVisibility(panels);
  panels.forEach((pan) => console.log(document.querySelector(pan).classList.value));

  let menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach((button) => {
    enable(button);
  });

  let loginBtn = document.getElementById('login');
  if (loginBtn.innerText === 'Login') {
    enable(loginBtn);

    let loginArea = document.querySelectorAll('.auth div');
    loginArea.forEach((field) => enable(field));
  }
}

function quitGame() {
  resetGame();
}

function endGame() {
  const mancala = game.getMancala();
  const players = mancala.getPlayers();
  const score = mancala.getScore();
  const winner = score[0] > score[1] ? players[0] : players[1];

  let menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach((button) => {
    enable(button);
  });

  if (!loggedIn) GameHistory.addGameToHistory({ players, score, winner });
}
