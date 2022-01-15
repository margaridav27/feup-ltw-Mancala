const waiting = (player) => `Welcome to Mancala, ${player}. Please just wait for someone to join.`;
const joined = (player1, player2, first) =>
  `We have a join! ${player1} and ${player2}, are you both ready? ${first}, you go first!`;

//turn
const justStarted = (player) =>
  `Welcome to Mancala!\n ${player}, you go first, show us what you got! ${String.fromCodePoint(
    128526
  )}`;
const yourTurn = (player) =>
  `It's your turn to play, ${player}. Go ahead, make your move! ${String.fromCodePoint(128518)}`;
const playAgain = (player) =>
  `It's your turn to play again, ${player}. Go ahead, make your move! ${String.fromCodePoint(
    128516
  )}`;
const switchTurn = (player) =>
  `It's ${player}'s turn. Show us what you got! ${String.fromCodePoint(128518)}`;
const notYourTurn = (player) => `${player}, you must wait for your turn to play!`;

//wrong move
const invalidSide = (player) =>
  `${player}, that's not your side, don't be a cheater! ${String.fromCodePoint(129324)}`;
const invalidSideZeroSeeds = (player) =>
  `${player}, that's not your side, don't be a cheater ${String.fromCodePoint(
    128545
  )}...\nBut if you are, at least play a hole with seeds ${String.fromCodePoint(128521)}`;
const zeroSeeds = (player) =>
  `Oh no ${String.fromCodePoint(
    128557
  )}, no seeds in that hole...\n Please select another hole, ${player}`;

//end game
const gameOver = () => `Game over!\n And the winner is ${String.fromCodePoint(129345)}`;
const winner = (player) => `Congratulations, ${player}! You are the best!`;
const tie = `Oh well, it's a tie, but nice job!`;
const waiver = (player) => `Oh no... ${player} gave up!`;

class Game {
  constructor() {
    this.size = parseInt(document.getElementById('holes').value);
    this.seeds = parseInt(document.getElementById('seeds').value);
    this.board = new Board(this.seeds, this.size);
    this.mancala = undefined;
    document.getElementById('score-1').innerText = 0;
    document.getElementById('score-2').innerText = 0;
    this.setMoveHandlers();
  }

  getMancala() {
    return this.mancala;
  }

  setMoveHandlers() {
    let cavities = this.board.getCavities();
    for (let cavity of cavities) {
      if (cavity instanceof Hole) {
        const id = cavity.getID();
        document.getElementById(`col-${id}`).addEventListener('click', () => this.moveHandler(id));
      }
    }
  }

  updateScore(score) {
    document.getElementById('score-1').innerText = score[0];
    document.getElementById('score-2').innerText = score[1];
  }

  showMessage(message) {
    document.getElementById('info').innerText = message;
  }
}
