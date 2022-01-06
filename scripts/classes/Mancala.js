class Mancala {
  constructor(board, players, level = 0) {
    this.board = board;

    this.level = level;

    this.players = players;
    this.currentPlayer = 0;
    this.score = [0, 0];
  }

  getPlayers() {
    return this.players;
  }

  getScore() {
    return this.score;
  }

  updateScore() {
    this.score[0] = this.board.getWarehouseBySide(0).getCurrentNrSeeds();
    this.score[1] = this.board.getWarehouseBySide(1).getCurrentNrSeeds();
  }

  /**
   * determines if the player is about to sow on his opponent's warehouse, what is forbidden
   */
  sowIsForbidden(cavity) {
    return cavity instanceof Warehouse && cavity.getSide() != this.currentPlayer;
  }

  /**
   * determines if the last sowing occured in current player's own warehouse
   * what will determine if he's playing again or not
   */
  sowedLastOwnWarehouse(cavity) {
    return cavity instanceof Warehouse && cavity.getSide() === this.currentPlayer;
  }

  /*
   * determines if the last sowing occured in current player's own board side
   * what will determine if he's playing again or not
   */
  sowedLastOwnSide(empty, cavity) {
    return empty && cavity.getSide() === this.currentPlayer;
  }

  /**
   * performs a move, which may include one to three phases - sow, capture & cleaning
   * on each phase, is made the register, following a specific format, of all the moves
   * the said register format allows the effective communication between the board and his displayer
   */
  performMove(move) {
    // arrays to retrieve to the board after the move performance so he can pass to the displayer
    let sow = [];
    let capture = [];
    let cleaning = [];

    let playedHole = this.board.getCavityByID(move);

    // move not allowed, nothing bad happens, just return
    if (playedHole.isBlocked()) return true;

    let seeds = playedHole.empty();
    let prevCavity = playedHole;
    let wasEmpty = false;

    // sow phase
    for (let seed of seeds) {
      let nextCavity = this.board.getCavityByID(prevCavity.getAdjacent());

      if (this.sowIsForbidden(nextCavity)) {
        let nextCavityDup = this.board.getCavityByID(nextCavity.getAdjacent());
        nextCavity = nextCavityDup;
      }

      if (nextCavity instanceof Hole) wasEmpty = nextCavity.isEmpty();

      this.board.transferSeedTo(seed, nextCavity);

      // register sow move
      let toID = nextCavity.getID();
      if (nextCavity instanceof Warehouse) {
        if (nextCavity.getID() === this.board.getNrHolesEachSide()) toID = -1;
        else toID = -2;
      }
      sow.push({
        sid: seed.getID(),
        from: playedHole.getID(),
        to: toID,
      });

      prevCavity = nextCavity;
    }

    let prevPlayer = this.currentPlayer;

    if (this.sowedLastOwnWarehouse(prevCavity)) {
      // nothing happens
    } else if (this.sowedLastOwnSide(wasEmpty, prevCavity)) {
      // capture phase
      let destWarehouse = this.board.getCavityByID(prevCavity.getWarehouse());
      let oppositeHole = this.board.getCavityByID(prevCavity.getOpposite());

      // transfer own seeds to destination warehouse
      let ownSeeds = prevCavity.empty();
      ownSeeds.forEach((seed) => {
        this.board.transferSeedTo(seed, destWarehouse);

        // register capture move
        capture.push({
          sid: seed.getID(),
          from: prevCavity.getID(),
          to: destWarehouse.getID() === this.board.getNrHolesEachSide() ? -1 : 2,
        });
      });

      // transfer opponent's seeds to destination warehouse
      let opponentSeeds = oppositeHole.empty();
      opponentSeeds.forEach((seed) => {
        this.board.transferSeedTo(seed, destWarehouse);

        // register capture move
        capture.push({
          sid: seed.getID(),
          from: oppositeHole.getID(),
          to: destWarehouse.getID() === this.board.getNrHolesEachSide() ? -1 : -2,
        });
      });
    } else {
      // swap players normally
      if (this.currentPlayer === 0) this.currentPlayer = 1;
      else this.currentPlayer = 0;

      // block the cavities that don't belong to the now current player's board side
      for (let cavity of this.board.getCavities()) {
        if (cavity.getSide() === this.currentPlayer) cavity.unblock();
        else cavity.block();
      }
    }

    // check if the game has conditions to continue
    let canContinue = !(
      this.board.isSideEmpty(prevPlayer) && this.board.isSideEmpty(this.currentPlayer)
    );
    if (!canContinue) {
      // cleaning phase
      this.board.getCavities().forEach((cavity) => {
        if (cavity instanceof Hole) {
          let destWarehouse = this.board.getCavityByID(cavity.getWarehouse());

          cavity.getSeeds().forEach((seed) => {
            this.board.transferSeedTo(seed, destWarehouse);

            // register cleaning move
            cleaning.push({
              sid: seed.getID(),
              from: cavity.getID(),
              to: destWarehouse.getID() === this.board.getNrHolesEachSide() ? -1 : -2,
            });
          });
        }
      });
    }

    this.updateScore();
    this.board.performMoveResponse(sow, capture, cleaning, this.score, this.currentPlayer);

    return canContinue;
  }

  /**
   * check if the bot is the current player
   * meaning a move (at least) will occur automatically, without human intervention
   */
  isBotCurrentPlayer() {
    return this.level > 0 && this.players[this.currentPlayer] === 'BOT';
  }

  /**
   * assemble data following a specific format to send to the bot so he can proceed to make his calculations
   */
  assembleDataForBot() {
    let botSide = [];
    let opponentSide = [];

    this.board.getCavities().forEach((cavity) => {
      if (cavity instanceof Hole) {
        let hole = {
          hid: cavity.getID(),
          value: cavity.getCurrentNrSeeds(),
        };
        if (cavity.getSide() === this.currentPlayer) botSide.push(hole);
        else opponentSide.push(hole);
      }
    });

    return {
      turn: this.currentPlayer,
      level: this.level,
      nrHoles: this.board.getNrHolesEachSide(),
      botSide: botSide.reverse(),
      opponentSide: opponentSide.reverse(),
    };
  }

  async performBotMove() {
    let data = this.assembleDataForBot();
    let response = Bot.calculateBestMove(data);

    let succeeded = false;
    for (let i = response.bestMoves.length - 1; i >= 0; i--) {
      await sleep(2000);

      const move = response.bestMoves[i];
      succeeded = this.performMove(move);
    }

    return succeeded;
  }
}
