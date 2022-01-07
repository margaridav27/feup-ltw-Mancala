const AGAINST_HUMAN_LOCAL = 0;
const AGAINST_HUMAN_SERVER = 1;
const AGAINST_BOT = 2;

var gameMode = AGAINST_HUMAN_LOCAL;
var game = { mancala: undefined, size: 0, seeds: 0, players: [], level: 0 };

const invalidMove = (player) => `${player}, you are not allowed to make that move!`;
const notYourTurn = (player) => `${player}, you must wait for your turn to play!`;
const yourTurn = (player) => `Go ahead, ${player}, show us what you got and make your move!`;
const waiting = (player) => `Welcome to Mancala, ${player}. Please just wait for someone to join.`;
const joined = (player1, player2) =>
  `We have a join! ${player1} and ${player2}, are you both ready? Let the game begin!`;
const winner = (player) => `It looks like we have our winner. Congratulations, ${player}!`;
const waiver = (player) => `Oh no... ${player} gave up!`;

/**
 * shows a specific message on the info panel
 * @param message message to be shown
 */
function showMessage(message) {
  document.getElementById('info').innerText = message;
}

/**
 * updates both players score
 * @param score array with the score of each player
 */
function updateScore(score) {
  document.getElementById('score-1').innerText = score[0];
  document.getElementById('score-2').innerText = score[1];
}

/**
 * toggles game button between 'PLAY' and 'QUIT'
 */
function toggleGameButton() {
  let playButton = document.getElementById('game-btn');
  if (playButton.innerText === 'QUIT') playButton.innerText = 'PLAY';
  else playButton.innerText = 'QUIT';
}

/**
 * sets the initial number of seeds on each hole
 */
function setInitialSeeds() {
  game.seeds = parseInt(document.getElementById('seeds').value);
}

/**
 * sets the number of holes on each side
 */
function setBoardSize() {
  game.size = parseInt(document.getElementById('holes').value);
}

/**
 * sets the players to be the ones in the array given as parameter (when server mode)
 * or to be the ones in the settings area (when local mode)
 * @param players array with both players names (empty when local mode)
 */
function setPlayers(players = []) {
  if (players.length === 0) {
    const p1 = document.getElementById('name-1').value;
    const nameP1 = p1.length === 0 ? 'Player 1' : p1;
    const p2 = document.getElementById('name-2').value;
    const nameP2 = p1.length === 0 ? 'Player 2' : p2;
    game.players = [nameP1, nameP2];
  } else {
    game.players = players;
  }
}

/**
 * checks if bot mode is selected
 * @returns 0 if bot plays first, 1 if bot plays secondly, -1 if bot is not selected
 */
function checkAgainstBot() {
  if (document.getElementById('name-1').value === 'BOT') return 0;
  else if (document.getElementById('name-2').value === 'BOT') return 1;
  return -1;
}

/**
 * @param bot bot's turn
 * @returns level of difficulty selected
 */
function setBotLevel(bot) {
  if (bot === 0) {
    const radioBtn = document.querySelector('input[name="level-1"]:checked');
    if (radioBtn.id.match(/level-1/)) game.level = parseInt(radioBtn.value);
  } else if (bot === 1) {
    const radioBtn = document.querySelector('input[name="level-2"]:checked');
    if (radioBtn.id.match(/level-2/)) game.level = parseInt(radioBtn.value);
  }
}

/**
 * starts up a local game with mode player vs player
 */
function startAgainstHumanLocalGame() {
  setPlayers();

  setBoardSize();
  setInitialSeeds();
  const board = new Board(game.initial, game.size);
  setupBoardMoveHandlers(board.getCavities());

  game.mancala = new Mancala(board, game.players);

  toggleGameButton();
}

/**
 * starts up a server game (with mode player vs player)
 */
function startAgainstHumanServerGame() {
  setBoardSize();
  setInitialSeeds();
  const data = { size: game.size, seeds: game.seeds };

  Server.join(data).then(() => {
    showMessage(waiting(Server.user));
    Server.update();

    const board = new Board(seeds, size);
    const players = Object.keys(response.board.sides);
    mancala = new Mancala(board, players);
    setupBoardMoveHandlers(board.getCavities());
    showMessage(joined(players[0], players[1]));
  });
}

/**
 * starts up a (local) game with mode bot vs player, or vice versa
 */
function startAgainstBotGame() {
  setPlayers();

  setBotLevel(checkAgainstBot());

  setBoardSize();
  setInitialSeeds();
  const board = new Board(game.seeds, game.size);
  setupBoardMoveHandlers(board.getCavities());

  game.mancala = new Mancala(board, game.players, game.level);

  toggleGameButton();
}

/**
 * checks for game mode and calls the respective start function
 */
function startGame() {
  if (Server.user) gameMode = AGAINST_HUMAN_SERVER;
  else if (checkAgainstBot() < 0) gameMode = AGAINST_HUMAN_LOCAL;
  else gameMode = AGAINST_BOT;

  switch (gameMode) {
    case AGAINST_HUMAN_LOCAL:
      startAgainstHumanLocalGame();
      break;

    case AGAINST_HUMAN_SERVER:
      startAgainstHumanServerGame();
      break;

    case AGAINST_BOT:
      startAgainstBotGame();
      break;
  }
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

function convertMove(move, side) {
  const nrHoles = getBoardSize();
  if (side === 0) return Math.abs(move - nrHoles) - 1;
  else return move - (nrHoles + 1);
}

async function moveHandler(move) {
  let succeeded = true;

  switch (gameMode) {
    case AGAINST_BOT:
      succeeded = mancala.performMove(move);
      if (succeeded && mancala.isBotCurrentPlayer()) succeeded = await mancala.performBotMove();
      break;

    case AGAINST_HUMAN_LOCAL:
      succeeded = mancala.performMove(move);
      break;

    case AGAINST_HUMAN_SERVER:
      const side = mancala.getPlayers()[0] === Server.user ? 0 : 1;
      const moveToNotify = convertMove(move, side);
      Server.notify(moveToNotify).then((response) => {
        if (response.error) showMessage(notYourTurn(Server.user));
        else Server.update();
      });
      break;
  }

  if (!succeeded) endGame();
}

function resetGame() {
  // reset scores
  updateScore([0, 0]);

  toggleGameButton();

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
 *
 *
 *
 *
 * - desativar holes if bot
 */
