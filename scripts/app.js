const DEFAULT = { state: 0, panel: '.default-panel' };
const BOARD = { state: 1, panel: '.board-panel' };
const INFO = { state: 2, panel: '.info-panel' };
const INSTRUCTIONS = { state: 3, panel: '.instructions-panel' };
const SCORES = { state: 4, panel: '.records-panel.score-records' };
const GAMES = { state: 5, panel: '.records-panel.game-records' };
const SETTINGS = { state: 6, panel: '.settings-panel' };

var appState = DEFAULT.state;
var loggedIn = false;

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
    loggedIn = true;
  } else {
    loginBtn.innerText = 'Login';
    loginArea.forEach((field) => enable(field));
    document.getElementById('username').innerText = '';
    document.getElementById('password').innerText = '';
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
      return;
    default:
      break;
  }

  let recordsButton = document.getElementById('records-btn');
  if (appState === GAMES.state || appState === SCORES.state) {
    if (appState === GAMES.state) {
      recordsButton.innerText === 'SCORE RECORDS';
      appState = SCORES.state;
    } else {
      recordsButton.innerText === 'GAME RECORDS';
      appState = GAMES.state;
    }

    panels.push(GAMES.panel);
    panels.push(SCORES.panel);

    GameHistory.cleanHistory();
    GameHistory.renderLocalScores();
  } else {
    panels.push(GAMES.panel);
    appState = GAMES.state;

    GameHistory.renderLocalScores();
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
      return;
    default:
      break;
  }

  panels.push(SETTINGS.panel);
  changeVisibility(panels);
  appState = SETTINGS.state;
}
