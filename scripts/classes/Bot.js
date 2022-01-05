class Bot {

  static updateBoardUponSowing(board, hid, pid, nrHoles) {
    // response to retrieve upon the sow completion
    let res = {
      lastSowingOnWarehouse: false,
      lastSowingOnHole: false,
      lastSowing: -1,
      score: -1,
    };

    const seeds = board.holes[hid].value; // number of seeds to sow
    board.holes[hid].value = 0; // empty the played hole
    hid = (nrHoles * 2 + (hid - 1)) % (nrHoles * 2); // next hole

    let mightBeWarehouse = true; // determines if the next hole can be a warehouse or not

    for (let i = seeds; i > 0; i--) {
      let lastSeed = i - 1 == 0;

      if (mightBeWarehouse && pid == 0 && hid == nrHoles * 2 - 1) {
        board.warehouses[0]++;
        mightBeWarehouse = false;
        if (lastSeed) res = { lastSowingOnWarehouse: true, lastSowingOnHole: false };
      } else if (mightBeWarehouse && pid == 1 && hid == nrHoles - 1) {
        board.warehouses[1]++;
        mightBeWarehouse = false;
        if (lastSeed) res = { lastSowingOnWarehouse: true, lastSowingOnHole: false };
      } else {
        if (lastSeed && board.holes[hid].value == 0)
          res = {
            lastSowingOnWarehouse: false,
            lastSowingOnHole: true,
            lastSowing: hid,
          };
        board.holes[hid].value++;
        hid = (nrHoles * 2 + (hid - 1)) % (nrHoles * 2);
        mightBeWarehouse = true;
      }
    }

    res.score = board.warehouses[pid];
    return res;
  }

  static updateBoardUponCapture(board, hid, pid, nrHoles) {
    // capture seeds from the opposite hole
    const oppositeHole = nrHoles * 2 - 1 - hid;
    board.warehouses[pid] += board.holes[oppositeHole].value + board.holes[hid].value;
    board.holes[oppositeHole].value = 0;
    board.holes[hid].value = 0;
  }

  static simulateMoveExecution(house, turn, board, nrHoles) {
    let move = { pointsMove: -1, boardMove: -1, playAgain: false, bestMoves: [] };

    let copyBoard = { holes: JSON.parse(JSON.stringify(board.holes)), warehouses: Array.from(board.warehouses) };

    //sow
    let res = this.updateBoardUponSowing(copyBoard, house, turn, nrHoles);

    //check if last hole was on bot's side and capture if true and hole was empty
    let ownEmptyHole = false;
    if (turn == 0) ownEmptyHole = res.lastSowing >= 0 && res.lastSowing < nrHoles;
    else if (turn == 1) ownEmptyHole = res.lastSowing >= nrHoles && res.lastSowing < 2 * nrHoles;

    if (res.lastSowingOnHole && ownEmptyHole) {
      this.updateBoardUponCapture(copyBoard, res.lastSowing, turn, nrHoles);
      move.playAgain = true;
    } else if (res.lastSowingOnWarehouse) move.playAgain = true;

    move.pointsMove = copyBoard.warehouses[turn] - board.warehouses[turn];
    move.boardMove = copyBoard;

    return move;
  }

  static parseHoles(data) {
    if (data.turn == 0) {
      return [...data.botSide, ...data.opponentSide];
    } else return [...data.opponentSide, ...data.botSide];
  }

  static calculateBestMove(data) {
    //turn, level, nrHoles, botSide, opponentSide,
    let holes = this.parseHoles(data);
    if (data.level == 1) {
      let validMoves = this.checkValidHoles(data.turn, holes, data.nrHoles);
      let i = Math.floor(Math.random() * validMoves.length);
      return {bestMoves : [holes[validMoves[i]].hid]};
    } else if (data.level == 2) {
      const botPlay = this.simulateHolePlay({ holes, warehouses: [0, 0] }, data.turn, data.nrHoles, 1);
      return botPlay;
    } else if (data.level == 3) {
      const botPlay = this.simulateHolePlay({ holes, warehouses: [0, 0] }, data.turn, data.nrHoles, 4);
      return botPlay;
    }
  }

  static checkValidHoles(turn, holes, nrHoles) {
    let validMovesOp = [];
    const playersHoles = turn == 0 ? Array.from({ length: nrHoles }, (x, i) => i) : Array.from({ length: nrHoles }, (x, i) => i + (nrHoles));
    for (let i = 0; i < playersHoles.length; i++) {
      if (holes[playersHoles[i]].value != 0) {
        validMovesOp.push(playersHoles[i]);
      }
    }
    return validMovesOp;
  }

  static simulateHolePlay(board, turn, nrHoles, depth) {
    if (depth == 0) {
      return { boardMove: board, bestMoves: [] };
    }

    let bestMoves = [];
    let lowestLoss = 1000;
    let boardMove, result, bestMove;
    let turnOp = Math.abs(turn - 1);

    let validMoves = this.checkValidHoles(turn, board.holes, nrHoles);
    let validOpMoves = this.checkValidHoles(turnOp, board.holes, nrHoles);

    if (validMoves == 0 || validOpMoves == 0) {
      return { bestMoves: [], boardMove: board };
    }

    for (let i = 0; i < validMoves.length; i++) {
      //simulate move
      result = this.simulateMoveExecution(validMoves[i], turn, board, nrHoles);

      //play again
      if (result.playAgain) {
        result = this.simulateHolePlay(result.boardMove, turn, nrHoles, depth);
      }

      //oponnent move
      else {
        result = this.simulateHoleOpPlay(result.boardMove, turnOp, nrHoles, depth - 1);
      }

      let loss = result.boardMove.warehouses[turnOp] - board.warehouses[turnOp] - (result.boardMove.warehouses[turn] - board.warehouses[turn]);

      if (loss < lowestLoss || (loss == lowestLoss && result.boardMove.warehouses[turn] > boardMove.warehouses[turn])) {
        lowestLoss = loss;
        bestMove = board.holes[validMoves[i]].hid;
        boardMove = result.boardMove;
        bestMoves = result.bestMoves;
      }
    }

    bestMoves.push(bestMove);
    return { bestMoves, boardMove };
  }

  static simulateHoleOpPlay(board, turn, nrHoles, depth) {
    if (depth == 0) {
      return { boardMove: board, bestMoves: [] };
    }

    let boardMove, result;
    let turnOp = Math.abs(turn - 1);
    let biggestLoss = -100;

    let validMoves = this.checkValidHoles(turn, board.holes, nrHoles);
    let validOpMoves = this.checkValidHoles(turnOp, board.holes, nrHoles);

    if (validMoves == 0 || validOpMoves == 0) {
      return { boardMove: board, bestMoves: [] };
    }

    for (let i = 0; i < validMoves.length; i++) {
      //simulate move
      result = this.simulateMoveExecution(validMoves[i], turn, board, nrHoles);

      //play again
      if (result.playAgain) {
        result = this.simulateHoleOpPlay(result.boardMove, turn, nrHoles, depth);
      }

      //bot move
      else {
        result = this.simulateHolePlay(result.boardMove, turnOp, nrHoles, depth - 1);
      }

      let loss = result.boardMove.warehouses[turn] - board.warehouses[turn] - (result.boardMove.warehouses[turnOp] - board.warehouses[turnOp]);

      if (loss > biggestLoss || (loss == biggestLoss && result.boardMove.warehouses[turn] > boardMove.warehouses[turn])) {
        biggestLoss = loss;
        boardMove = result.boardMove;
      }
    }

    return { biggestLoss, boardMove, bestMoves: [] };
  }
}
