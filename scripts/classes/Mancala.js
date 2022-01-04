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
    return (
      cavity instanceof Warehouse && cavity.getSide() != this.currentPlayer
    );
  }

  /**
   * determines if the last sowing occured in current player's own warehouse
   * what will determine if he's playing again or not
   */
  sowedLastOwnWarehouse(cavity) {
    return (
      cavity instanceof Warehouse && cavity.getSide() === this.currentPlayer
    );
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
      sow.push({
        sid: seed.getID(),
        from: playedHole.getID(),
        to: nextCavity.getID(),
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
          from: playedHole.getID(),
          to: toHole.getID(),
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
          to: destWarehouse.getID(),
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
              to: destWarehouse.getID(),
            });
          });
        }
      });
    }

    this.board.performMoveResponse(sow, capture, cleaning);

    return canContinue;
  }
}

/*
 0 1 2 3 4
 w h h h h
 h h h h w
 9 8 7 6 5
*/
// Seed
// - id
// - positionInHole { offsetX, offsetY }
// - positionInBoard { offsetX, offsetY }

// Warehouse
// - id
// - adjacent
// - seeds = 0
// - positionInBoard { offsetX, offsetY }

// Hole extends Warehouse
// - opposite
// - seeds = nr seeds

// Board
// - 2x nr holes + 2

// Mancala
// - 2 players
// - board

// perform play (move)

// let playedHole = getCavityByID (move)
// if (playedHole.isBlocked())  return false

// let seeds = playedHole.empty()
// let prevCavity = playedHole
// let wasEmpty = false
// for seed of seeds
//    let nextCavity = prevCavity.getAdjacent()
//    wasEmpty = nextCavity.getNrSeeds() == 0
//    transferSeedTo(nextCavity)
//    prevCavity = nextCavity

// // move ended up in his own warehouse -> play again
// if (prevCavity instanceof Warehouse && prevCavity.getRow() == currentPlayer)
//    ;

// // move ended up in one of his empty holes -> capture & play again
// else if (wasEmpty && prevCavity.getRow() == currentPlayer)
//     let ownSeeds = prevCavity.empty()
//     let opponentSeeds = prevCavity.getOpposite().empty()
//     let capturedSeeds = [..ownSeeds..opponentSeeds]
//     transferSeedsTo(prevCavity.getWarehouse())

// // swap players
// else
//     if (currentPlayer == 0) currentPlayer = 1
//     else currentPlayer = 0
//     swapBlockedHoles() // board method

/* class Mancala {
  constructor(board, players, level = 0) {
    this.level = level; // default value of 0 player vs player case
    this.board = board;
    this.players = players;
    this.score = [0, 0];
    this.currentPlayer = 0;
    this.finished = false;
    this.setValidMoves();
  }

  getPlayers() {
    return this.players;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getScore() {
    return this.score;
  }

  hasFinished() {
    return this.finished;
  }

  setCurrentPlayer() {
    this.currentPlayer = Math.abs(this.currentPlayer - 1);
  }

  setFinished() {
    document.getElementById('row-1').classList.remove('curr-player');
    document.getElementById('row-2').classList.remove('curr-player');
    this.finished = true;
  }

  setValidMoves() {
    this.showTurn();
    let validMoves = -1;

    if (!this.hasFinished()) {
      // validMoves = 
      this.board.setValidHoles(this.currentPlayer).then(res => {
        validMoves = res;
        console.log(validMoves);
      });
      // while (validMoves == -1) {
      //   await sleep(5).then(() => {
      //   console.log("waiting");
      // }
      console.log(validMoves);
      console.log("valid: ", validMoves);
      console.log("player:", this.currentPlayer);
      console.log(" ");
      if (!validMoves) {
        console.log("Entrei");
        const info = document.getElementById('info');
        info.innerHTML =
          'Player ' +
          this.players[this.currentPlayer] +
          " can't make any more moves";
      }
    }

    return validMoves;
  }

  isBotCurrentPlayer() {
    return this.level > 0 && this.players[this.currentPlayer] == 'BOT';
  }

  sowedInOwnHole(sowedHole) {
    if (sowedHole == -1) return false;

    const nrHoles = this.board.getNrHoles();
    if (this.currentPlayer == 0) return sowedHole >= 0 && sowedHole < nrHoles;
    else return sowedHole >= nrHoles && sowedHole < 2 * nrHoles;
  }

  sow(playedHole) {
    return this.board.updateBoardUponSowing(playedHole, this.currentPlayer);
  }

  capture(lastSowedHole) {
    return this.board.updateBoardUponCapture(lastSowedHole, this.currentPlayer);
  }

  endGame() {
    console.log("endGame");
    this.score = this.board.updateBoardUponCleaning();
    this.updateScore(true);
    this.setFinished();
  }

  updateScore(totalScore) {
    if (totalScore) {
      const scoreP1 = document.getElementById('score-1');
      scoreP1.innerHTML = this.score[0];
      const scoreP2 = document.getElementById('score-2');
      scoreP2.innerHTML = this.score[1];
    } else {
      const score = document.getElementById(`score-${this.currentPlayer + 1}`);
      score.innerHTML = this.score[this.currentPlayer];
    }
  }

  showTurn() {
    const info = document.getElementById('info');
    if (
      info.innerHTML ==
      `It's ${this.players[this.currentPlayer]}'s turn. Make your move.`
    )
      info.innerHTML = `Play again, ${this.players[this.currentPlayer]}.`;
    else
      info.innerHTML = `It's ${
        this.players[this.currentPlayer]
      }'s turn. Make your move.`;
  }

  isValidMove(playedHole) {
    const nrHoles = this.board.getNrHoles();
    return (
      (this.currentPlayer == 0 && playedHole >= 0 && playedHole < nrHoles) ||
      (this.currentPlayer == 1 &&
        playedHole >= nrHoles &&
        playedHole < nrHoles * 2)
    );
  }

  isEmpty(turn) {
    let validMovesOp = [];
    let nrHoles = this.board.getNrHoles();
    let holes = this.board.getHoles();
    const playersHoles = (turn == 0) ? Array.from({ length: nrHoles }, (x, i) => i) : Array.from({ length: nrHoles }, (x, i) => i + 4);
    for (let i = 0; i < playersHoles.length; i++) {
      if (holes[playersHoles[i]] != 0) {
        validMovesOp.push(playersHoles[i]);
      }
    }
    return validMovesOp == 0;
  }

  performMove(playedHole) {
    if (!this.isValidMove(playedHole)) return true;

    let res = this.sow(playedHole);
    
    this.score[this.currentPlayer] = res.score;
    this.updateScore();

    if (res.lastSowingOnHole && this.sowedInOwnHole(res.lastSowing))
      this.score[this.currentPlayer] = this.capture(res.lastSowing);
    else if (!res.lastSowingOnWarehouse) this.setCurrentPlayer();

    console.log(this.isEmpty(0), this.isEmpty(1));
    if (this.isEmpty(0) || this.isEmpty(1)) {
      this.endGame();
      return false;
    }
    this.setValidMoves();

    return true;
  }

  async performBot() {
    let succeeded = false;
    let bot = Bot.calculateBestMove(this.level, this.currentPlayer, this.board);
    for (let i = bot.bestMoves.length - 1; i >= 0; i--) {
      await sleep(2000);
      console.log("playing", bot.bestMoves, bot.bestMoves[i]);
      succeeded = this.performMove(bot.bestMoves[i]);
    }
    return succeeded;
  }
} */
