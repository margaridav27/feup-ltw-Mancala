class Mancala {
  constructor(board, players, level = 0) {
    this.board = board;

    this.level = level;

    this.players = players;
    this.currentPlayer = 0;
    this.score = [0, 0];
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
      for (let cavity of this.board.getBoard()) {
        if (cavity.getSide() === this.currentPlayer) cavity.unblock();
        else cavity.block();
      }
    }

    // check if the player that has just played emptied his whole side
    let canContinue = !this.board.isSideEmpty(prevPlayer);
    if (!canContinue) {
      // cleaning phase
      this.board.getBoard().forEach((cavity) => {
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

    this.board.performMoveResponse(sow, capture, cleaning);

    return canContinue;
  }
}
