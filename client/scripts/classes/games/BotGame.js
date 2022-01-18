class BotGame extends Game {
  constructor(botTurn) {
    super();

    this.setLevel(botTurn);
    this.setPlayers(botTurn);
  }

  setLevel(botTurn) {
    if (botTurn === 0) {
      const radioBtn = document.querySelector('input[name="level-1"]:checked');
      if (radioBtn.id.match(/level-1/)) this.level = parseInt(radioBtn.value);
    } else if (botTurn === 1) {
      const radioBtn = document.querySelector('input[name="level-2"]:checked');
      if (radioBtn.id.match(/level-2/)) this.level = parseInt(radioBtn.value);
    }
  }

  setPlayers(botTurn) {
    if (botTurn === 0) {
      const p2 = document.getElementById('name-2').value;
      const nameP2 = p2.length === 0 ? 'Player 2' : p2;
      this.players = ['BOT', nameP2];
    } else if (botTurn === 1) {
      const p1 = document.getElementById('name-1').value;
      const nameP1 = p1.length === 0 ? 'Player 1' : p1;
      this.players = [nameP1, 'BOT'];
    }
  }

  async moveHandler(move) {
    if (this.mancala.isBotCurrentPlayer()) return;

    let status = this.mancala.performMove(move);
    this.showMessage(status.message);

    if (status.hasFinished) {
      this.finishedHandler();
    }

    if (this.mancala.isBotCurrentPlayer()) {
      status = await this.mancala.performBotMove();
      this.showMessage(status.message);
    }

    if (status.hasFinished) {
      this.finishedHandler();
    }
  }

  async startGame() {
    this.mancala = new Mancala(this.board, this.players, this.level);
    this.showMessage(justStarted(this.players[0]));
    if (this.mancala.isBotCurrentPlayer()) {
      const status = await this.mancala.performBotMove();
      this.showMessage(status.message);
      // if (status.hasFinished) {
      //   document.querySelector('.winner-text').innerText = winner(this.mancala.getWinner());
      //   document.dispatchEvent(new Event('endGame'));
      // }
    }
  }
}
