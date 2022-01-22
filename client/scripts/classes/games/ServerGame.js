class ServerGame extends Game {
  constructor(server) {
    super();

    this.server = server;
    this.players = [];
    this.turn = '';

    this.timeout = 20000;
    this.timeoutId = undefined;
    this.intervalId = undefined;
    this.timerId = undefined;
  }

  setTimeout() {
    this.timeoutId = setTimeout(() => {}, this.timeout);
  }

  clearTimeout() {
    if (this.timeoutId !== undefined) clearTimeout(this.timeoutId);

    if (this.timerId !== undefined) clearInterval(this.timerId);
    if (this.intervalId !== undefined) clearInterval(this.intervalId);
  }

  resetTimeout() {
    this.clearTimeout(this.timeoutId);
    this.setTimeout();

    let ids = progressBar(this.timeout / 1000, this.intervalId);
    this.intervalId = ids.barId;
    this.timerId = ids.timerId;
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

  gameStartHandler(data) {
    this.players = Object.keys(data.board.sides);
    this.turn = data.board.turn;
    this.mancala = new Mancala(this.board, this.players);

    this.showMessage(joined(this.players[0], this.players[1], this.players[0]));
    hideWaitingPopUp();

    this.resetTimeout();
  }

  gameOverHandler() {
    showCanvas();

    this.clearTimeout();

    this.server.leave();
    this.server.closeEventSource();

    document.dispatchEvent(new Event('endGame'));
  }

  giveUpHandler(data) {
    showCanvas();

    this.clearTimeout();

    this.server.leave();
    this.server.closeEventSource();
    
    let w; // winner
    let q; // quiter
    if (data !== undefined) {
      w = data.winner;
      q = this.players[0] === w ? this.players[1] : this.players[0];
    } else {
      q = this.server.getUser();
      w = this.players[0] === q ? this.players[1] : this.players[0];
    }

    if (q === this.server.getUser()) document.dispatchEvent(new Event('quitGame'));
    else {
      document.querySelector('.winner').style.display = '';
      document.querySelector('.winner-text').innerText = waiver(q) + '\n' + winner(w);
      dotAnimation();
    }
  }

  notJoinedHandler() {
    showCanvas();

    this.clearTimeout();

    this.server.leave();
    this.server.closeEventSource();

    hideWaitingPopUp();

    document.dispatchEvent(new Event('quitGame'));
  }

  movePerformanceHandler(data) {
    const status = this.mancala.performMove(data.pit);
    this.turn = data.board.turn;

    this.showMessage(status.message);
    document.querySelector('.winner-text').innerText = winner(data.winner);

    this.resetTimeout();
  }

  serverUpdateHandler(data) {
    if (this.mancala === undefined) {
      if (data.winner !== undefined) this.notJoinedHandler();
      else {
        this.gameStartHandler(data);
        showCanvas();
      }
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
      this.setTimeout(() => {});
    });

    this.timerId = timer(this.timeout/1000 -1, document.querySelector('.waiting .time'));
    showWaitingPopUp();
  }
}
