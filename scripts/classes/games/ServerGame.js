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
    this.server.notify(converted).then(() => this.server.update());
  }

  serverUpdateHandler(data) {
    if (!this.mancala) {
      this.showMessage(joined(game.players[0], game.players[1]));

      this.players = Object.keys(data.board.sides);
      this.mancala = new Mancala(this.board, this.players);

      this.turn = data.board.turn;
      this.showMessage(yourTurn(this.turn));
    } else {
      const converted = this.convertFromUpdate(data.pit);
      this.mancala.performMove(converted);

      this.turn = data.board.turn;
      this.showMessage(yourTurn(this.turn));
    }
  }

  startGame() {
    this.server.setEventSourceHandler((data) => this.serverUpdateHandler(data));
    const data = { size: this.size, seeds: this.seeds };
    this.server.join(data).then(() => this.server.update());
  }
}
