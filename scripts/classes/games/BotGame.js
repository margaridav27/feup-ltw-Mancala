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
    let hasFinished = this.mancala.performMove(move).hasFinished;
    if (hasFinished) {
      document.querySelector('.winner-text').innerText = winner(this.mancala.getWinner());
      document.dispatchEvent(new Event('endGame'));
    }

    if (this.mancala.isBotCurrentPlayer()) hasFinished = await this.mancala.performBotMove();
    if (hasFinished) {
      document.querySelector('.winner-text').innerText = winner(this.mancala.getWinner());
      document.dispatchEvent(new Event('endGame'));
    }
  }

  async startGame() {
    this.mancala = new Mancala(this.board, this.players, this.level);
    this.showMessage(justStarted(this.players[0]));
    if (this.mancala.isBotCurrentPlayer()) {
      let hasFinished = await this.mancala.performBotMove();
      if (hasFinished) {
        document.querySelector('.winner-text').innerText = winner(this.mancala.getWinner());
        document.dispatchEvent(new Event('endGame'));
      };
    }
  }
}
