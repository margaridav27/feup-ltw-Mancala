class ServerGame extends Game {
  constructor(server) {
    super();

    this.server = server;
    this.players = [];
    this.turn = '';
  }

  getTurnSide() {
    return this.turn === this.mancala.getPlayers()[0] ? 0 : 1;
  }

  checkSide(move, side) {
    if (side === 0 && move >= this.size) {
      this.showMessage(invalidSide(this.server.getUser()));
      return false;
    } else if (side === 1 && (move <= this.size || move > this.size * 2)) {
      this.showMessage(invalidSide(this.server.getUser()));
      return false;
    }
    return true;
  }

  convertToNotify(move) {
    const side = this.getTurnSide();
    return side === 0 ? move : move - game.size - 1;
  }

  convertFromUpdate(move) {
    const side = this.getTurnSide();
    return side === 0 ? move : move + game.size + 1;
  }

  async moveHandler(move) {
    const converted = this.convertToNotify(move);
    const opponentSide = Math.abs(this.getTurnSide() - 1);
    console.log(this.turn);
    if (this.turn === this.server.getUser() && this.checkSide(move, this.getTurnSide()))
      this.server.notify(converted).then(() => this.server.update());
    else if (this.turn !== this.server.getUser())
      this.showMessage(notYourTurn(this.players[opponentSide]));
  }

  // TODO: verify event dispatch and handle winner update in different way
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
        // server sent a winner update
        this.showMessage(gameOver());
        document.dispatchEvent(new Event('endGame'));
      } else {
        // server sent a move update
        const converted = this.convertFromUpdate(data.pit);
        const status = this.mancala.performMove(converted);
        this.turn = data.board.turn;
        this.showMessage(status.message);
        if (status.hasFinished) document.dispatchEvent(new Event('endGame'));
      }
    }
  }

  startGame() {
    this.server.setEventSourceHandler((data) => this.serverUpdateHandler(data));
    const data = { size: this.size, seeds: this.seeds };
    this.server.join(data).then(() => this.server.update());
    this.showMessage(waiting(this.server.getUser()));
  }
}
