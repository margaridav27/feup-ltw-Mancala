class ServerGame extends Game {
  constructor(server) {
    super();

    this.server = server;
    this.players = [];
    this.turn = '';

    this.timeout = 20000;
    this.timeoutId = undefined;
  }

  setTimeout(callback) {
    console.log('set timeout');
    this.timeoutId = setTimeout(callback, this.timeout);
  }

  clearTimeout() {
    console.log('clear timeout');
    if (this.timeoutId !== undefined) clearTimeout(this.timeoutId);
  }

  resetTimeout(callback) {
    console.log('reset clear');
    this.clearTimeout(this.timeoutId);
    this.setTimeout(callback);
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
    if (this.mancala) {
      const nick = server.getUser();
      if (this.turn === nick) {
        if (this.checkSide(move, nick)) this.server.notify(move);
        else {
          if (this.board.cavities[move].seeds.length > 0) this.showMessage(invalidSide(nick));
          else this.showMessage(invalidSideZeroSeeds(nick));
        }
      } else this.showMessage(notYourTurn(nick));
    }
  }

  quitHandler() {
    this.server.leave();
  }

  gameStartHandler(data) {
    this.players = Object.keys(data.board.sides);
    this.turn = data.board.turn;
    this.mancala = new Mancala(this.board, this.players);

    this.showMessage(joined(this.players[0], this.players[1], this.players[0]));
    hideWaitingPopUp();

    this.resetTimeout(() => {
      console.log('reached timeout while waiting for first move');
    });
  }

  gameOverHandler() {
    this.server.leave();
    this.server.closeEventSource();
    this.clearTimeout();
    document.dispatchEvent(new Event('endGame'));
  }

  giveUpHandler(data) {
    this.server.leave();
    this.server.closeEventSource();
    this.clearTimeout();

    let quiter = this.players[0] === data.winner ? this.players[1] : this.players[0];
    document.querySelector('.winner').style.display = '';
    dotAnimation();
    document.querySelector('.winner-text').innerText = waiver(quiter) + '\n' + winner(data.winner);
  }

  notJoinedHandler() {
    console.log('not joined handler => sending leave');

    this.server.leave();
    this.server.closeEventSource();
    this.clearTimeout();
    hideWaitingPopUp();
    document.dispatchEvent(new Event('quitGame'));
  }

  movePerformanceHandler(data) {
    const status = this.mancala.performMove(data.pit);
    this.turn = data.board.turn;

    this.showMessage(status.message);
    document.querySelector('.winner-text').innerText = winner(data.winner);

    this.resetTimeout(() => {
      console.log('reached timeout while waiting for', data.board.turn, 'to make a move');
    });
  }

  serverUpdateHandler(data) {
    if (this.mancala === undefined) {
      console.log(data);
      if (data.winner !== undefined) this.notJoinedHandler();
      else this.gameStartHandler(data);
    } else {
      if (data.pit !== undefined) {
        this.movePerformanceHandler(data);
        if (data.winner !== undefined) this.gameOverHandler(data);
      } else this.giveUpHandler(data);
    }
  }

  startGame() {
    const data = { size: this.size, seeds: this.seeds };

    this.server.join(data).then(() => {
      server.update(this.serverUpdateHandler.bind(this));

      this.setTimeout(() => {
        console.log('reached timeout on queue');
      });
    });

    showWaitingPopUp();
  }
}
