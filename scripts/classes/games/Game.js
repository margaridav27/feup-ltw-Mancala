const waiting = (player) => `Welcome to Mancala, ${player}. Please just wait for someone to join.`;
const joined = (player1, player2, first) => `We have a join! ${player1} and ${player2}, are you both ready? ${first}, you go first!`;
const justStarted = (player) => `Welcome to Mancala! ${player}, you go first, show us what you got!`;
const yourTurn = (player) => `It's your turn to play, ${player}. Go ahead, make your move!`;
const notYourTurn = (player) => `${player}, you must wait for your turn to play!`;
const invalidMove = (player) => `${player}, you are not allowed to make that move!`;
const winner = (player) => `It looks like we have our winner. Congratulations, ${player}!`;
const waiver = (player) => `Oh no... ${player} gave up!`;

class Game {
  constructor() {
    this.size = parseInt(document.getElementById('holes').value);
    this.seeds = parseInt(document.getElementById('seeds').value);
    this.board = new Board(this.seeds, this.size);
    this.mancala = undefined;

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
