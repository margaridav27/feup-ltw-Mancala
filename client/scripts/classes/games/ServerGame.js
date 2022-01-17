class ServerGame extends Game {
  constructor(server) {
    super();

    this.server = server;
    this.players = [];
    this.turn = '';

    document.addEventListener('quitGame', () => this.quitHandler.bind(this));
  }

  checkSide(move, side) {
    const nick = server.getUser();
    if (side === 0 && move >= this.size) {
      this.showMessage(invalidSide(nick));
      return false;
    } else if (side === 1 && (move <= this.size || move > this.size * 2)) {
      this.showMessage(invalidSide(nick));
      return false;
    }
    return true;
  }

  async moveHandler(move) {
    const nick = server.getUser();
    if (this.turn === nick && this.checkSide(move, nick)) this.server.notify(move);
    else if (this.turn !== nick) this.showMessage(notYourTurn(this.players[opponentSide]));
  }

  quitHandler() {
    this.server.leave();
    this.showMessage(waiver(this.server.getUser()));
  }

  serverUpdateHandler(data) {
    if (!this.mancala) {
      // was waiting to be joined
      this.players = Object.keys(data.board.sides);
      this.turn = data.board.turn;
      this.mancala = new Mancala(this.board, this.players);
      this.showMessage(joined(this.players[0], this.players[1], this.players[0]));
    } else {
      // the game was already occuring
      if (data.winner) {
        this.server.closeEventSource();

        if (this.mancala.hasFinished()) {
          if (data.winner === '') this.showMessage(tie);
          else this.showMessage(gameOver);
          document.dispatchEvent(new Event('endGame'));
        } else {
          this.showMessage(waiver(data.winner));
          document.dispatchEvent(new Event('quitGame'));
        }
      } else {
        // server sent a move update
        const status = this.mancala.performMove(data.pit);
        this.turn = data.board.turn;
        this.showMessage(status.message);
        //if (status.hasFinished) document.dispatchEvent(new Event('endGame'));
      }
    }
  }

  startGame() {
    const data = { size: this.size, seeds: this.seeds };
    const nick = this.server.getUser();
    this.server.join(data).then(() => this.server.update(this.serverUpdateHandler.bind(this)));
    this.showMessage(waiting(nick));
  }
}
