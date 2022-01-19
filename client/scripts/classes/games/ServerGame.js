class ServerGame extends Game {
  constructor(server) {
    super();

    this.server = server;
    this.players = [];
    this.turn = '';

    //document.addEventListener('quitGame', () => this.quitHandler.bind(this));
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
      if (this.turn === nick && this.checkSide(move, nick)) this.server.notify(move);
      else if (this.turn !== nick) this.showMessage(notYourTurn(this.players[opponentSide]));
    } else {
      this.showMessage(moveWhileWaiting);
    }
  }

  quitHandler() {
    this.server.leave();
    //console.log("quitig");
    // dispatchEvent(new Event('quitGame'));
  }

  serverUpdateHandler(data) {
    if (!this.mancala) {
      // was waiting to be joined
      this.players = Object.keys(data.board.sides);
      this.turn = data.board.turn;
      this.mancala = new Mancala(this.board, this.players);
      this.showMessage(joined(this.players[0], this.players[1], this.players[0]));
      hideWaitingPopUp();
    } else {
      // the game was already occuring
      if (data.pit !== undefined) {
        const status = this.mancala.performMove(data.pit);
        this.turn = data.board.turn;
        //this.showMessage(status.message);
        document.querySelector('.winner-text').innerText = winner(data.winner);
        // this.showMessage(winner(data.winner));
        console.log('got in here before');
        if (data.winner !== undefined) {
          console.log('got in here');
          //if (data.winner === '') this.showMessage(tie);
          //else this.showMessage(gameOver);
          this.server.leave();
          this.server.closeEventSource();
          document.dispatchEvent(new Event('endGame'));
        }
      } else {
        if (data.winner === this.server.getUser()) this.server.leave();
        //this.server.leave();
        this.server.closeEventSource();

        let quiter = this.players[0] == data.winner ? this.players[1] : this.players[0];

        document.querySelector('.winner').style.display = '';
        dotAnimation();
        document.querySelector('.winner-text').innerText =
          waiver(quiter) + '\n' + winner(data.winner);
        // document.dispatchEvent(new Event('endGame'));
      }
    }
  }

  startGame() {
    const data = { size: this.size, seeds: this.seeds };
    const nick = this.server.getUser();
    this.server.join(data).then(() => {
      console.log('UPDATING');
      server.update(this.serverUpdateHandler.bind(this));
    });
    this.showMessage(waiting(nick));
    showWaitingPopUp();
  }
}
