const joined = (player1, player2, first) => `We have a join! ${player1} and ${player2}, are you both ready? ${first}, you go first!`;

//turn
const justStarted = (player) => `Welcome to Mancala!\n ${player}, you go first, show us what you got! ${String.fromCodePoint(128526)}`;
const yourTurn = (player) => `It's your turn to play, ${player}. Go ahead, make your move! ${String.fromCodePoint(128518)}`;
const playAgain = (player) => `It's your turn to play again, ${player}. Go ahead, make your move! ${String.fromCodePoint(128516)}`;
const switchTurn = (player) => `It's ${player}'s turn. Show us what you got! ${String.fromCodePoint(128518)}`;
const notYourTurn = (player) => `${player}, you must wait for your turn to play!`;

// wrong move
const invalidSide = (player) => `${player}, that's not your side, don't be a cheater! ${String.fromCodePoint(129324)}`;
const invalidSideZeroSeeds = (player) => `${player}, that's not your side, don't be a cheater ${String.fromCodePoint(128545)}!\nBut, if you are, be a smart one and don't play on an empty hole... ${String.fromCodePoint(128521)}`;
const zeroSeeds = (player) => `Ooops ${String.fromCodePoint(128557)}, it looks like that hole is empty...\n Please choose another one, ${player}.`;

//end game
const gameOver = `Game over!\n And the winner is ${String.fromCodePoint(129345)}`;
const tie = `Oh well, it's a tie, but nice job!`;
const winner = (player) => `Congratulations, ${player}! You are the best!`;
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

  finishedHandler() {
    let winnerSection = document.querySelector('.winner-text');

    if (this.mancala.getWinner()) winnerSection.innerText = winner(this.mancala.getWinner());
    else winnerSection.innerText = tie; 

    document.dispatchEvent(new Event('endGame'));
  }
}
