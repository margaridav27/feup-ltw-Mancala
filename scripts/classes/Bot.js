class Bot {
  static copyBoard(board) {
    let newBoard = new Board(board.getNrHoles(), board.getNrSeeds());

    newBoard.setHoles(Array.from(board.getHoles()));
    newBoard.setWarehouses(Array.from(board.getWarehouses()));

    return newBoard;
  }

  static updateBoardUponSowing1(board, hid, pid) {
    // response to retrieve upon the sow completion
    let res = {
      lastSowingOnWarehouse: false,
      lastSowingOnHole: false,
      lastSowing: -1,
      score: -1,
    };

    let holes = board.getHoles();
    let warehouses = board.getWarehouses();
    let nrHoles = board.getNrHoles();

    const seeds = holes[hid]; // number of seeds to sow
    holes[hid] = 0; // empty the played hole
    hid = (nrHoles * 2 + (hid - 1)) % (nrHoles * 2); // next hole
    let mightBeWarehouse = true; // determines if the next hole can be a warehouse or not

    for (let i = seeds; i > 0; i--) {
      let lastSeed = i - 1 == 0;

      if (mightBeWarehouse && pid == 0 && hid == nrHoles * 2 - 1) {
        warehouses[0]++;
        mightBeWarehouse = false;
        if (lastSeed)
          res = { lastSowingOnWarehouse: true, lastSowingOnHole: false };
      } else if (mightBeWarehouse && pid == 1 && hid == nrHoles - 1) {
        warehouses[1]++;
        mightBeWarehouse = false;
        if (lastSeed)
          res = { lastSowingOnWarehouse: true, lastSowingOnHole: false };
      } else {
        if (lastSeed && holes[hid] == 0)
          res = {
            lastSowingOnWarehouse: false,
            lastSowingOnHole: true,
            lastSowing: hid,
          };
        holes[hid]++;
        hid = (nrHoles * 2 + (hid - 1)) % (nrHoles * 2);
        mightBeWarehouse = true;
      }
    }

    res.score = warehouses[pid];
    return res;
  }

  static updateBoardUponCapture1(board, hid, pid) {
    // capture seeds from the opposite hole
    const oppositeHole = board.getNrHoles() * 2 - 1 - hid;
    board.getWarehouses()[pid] += board.getHoles()[oppositeHole] + board.getHoles()[hid];
    board.getHoles()[oppositeHole] = 0;
    board.getHoles()[hid] = 0;

    return board.getWarehouses()[pid];
  }

  static simulateMoveExecution(house, board, turn) {
    let move = { pointsMove: -1, boardMove: -1, playAgain: false, bestMoves: [] };

    //set up board
    const nrHoles = board.getNrHoles();

    let copyBoard = this.copyBoard(board);

    //sow
    let res = this.updateBoardUponSowing1(copyBoard, house, turn);

    //check if last hole was on bot's side and capture if true and hole was empty
    let ownEmptyHole = false;
    if (turn == 0)
      ownEmptyHole = res.lastSowing >= 0 && res.lastSowing < nrHoles;
    else if (turn == 1)
      ownEmptyHole = res.lastSowing >= nrHoles && res.lastSowing < 2 * nrHoles;

    if (res.lastSowingOnHole && ownEmptyHole) {
      this.updateBoardUponCapture1(copyBoard, res.lastSowing, turn);
      move.playAgain = true;
    } else if (res.lastSowingOnWarehouse) move.playAgain = true;

    move.pointsMove =
      copyBoard.getWarehouses()[turn] - board.getWarehouses()[turn];
    move.boardMove = copyBoard;

    return move;
  }

  static calculateBestMove(level, turn, board) {
    if (level == 1) {
      let validMoves = this.changePlayer(turn, board);
      return Math.floor(Math.random() * validMoves.length);
    }
    else if (level == 2) {
      const botPlay = this.simulateHolePlay(board, turn, 1);
      return botPlay;
    } 
    else if (level == 3) {
      const botPlay = this.simulateHolePlay(board, turn, 4);
      return botPlay;
    } 
  }

  static changePlayer(turn, board) {
    let validMovesOp = [];
    const holes = board.getHoles();
    const playersHoles = (turn == 0) ? Array.from({ length: board.getNrHoles() }, (x, i) => i) : Array.from({ length: board.getNrHoles() }, (x, i) => i + 4);
    for (let i = 0; i < playersHoles.length; i++) {
      if (holes[playersHoles[i]] != 0) {
        validMovesOp.push(playersHoles[i]);
      }
    }
    return validMovesOp;
  }

  static simulateHolePlay(board, turn, depth) {
    if (depth == 0) {
      return {boardMove: board, bestMoves: []};
    }

    let bestMoves = [];
    let lowestLoss = 1000;
    let boardMove, result, bestMove;
    let turnOp = Math.abs(turn - 1);

    let validMoves = this.changePlayer(turn, board);
    let validOpMoves = this.changePlayer(turnOp, board);

    if (validMoves == 0 || validOpMoves == 0) {
      return {bestMoves: [], boardMove:board};
    }

    for (let i = 0; i < validMoves.length; i++) {

      //simulate move
      result = this.simulateMoveExecution(validMoves[i], board, turn);

      //play again
      if (result.playAgain) {
        result = this.simulateHolePlay(result.boardMove, turn, depth);    
      }

      //oponnent move
      else {
        result = this.simulateHoleOpPlay(result.boardMove, turnOp, depth - 1);
      }

      let loss = (result.boardMove.getWarehouses()[turnOp] - board.getWarehouses()[turnOp]) - (result.boardMove.getWarehouses()[turn] - board.getWarehouses()[turn]);

      if ((loss < lowestLoss) || (loss == lowestLoss && result.boardMove.getWarehouses()[turn] > boardMove.getWarehouses()[turn])) {
        lowestLoss = loss;
        bestMove = validMoves[i]; 
        boardMove = result.boardMove;
        bestMoves = result.bestMoves;
      }
    }

    bestMoves.push(bestMove);
    return {bestMoves, boardMove};
  }

  static simulateHoleOpPlay(board, turn, depth) {
    if (depth == 0) {
      return {boardMove: board, bestMoves: []};
    }

    let boardMove, result;
    let turnOp = Math.abs(turn - 1);
    let biggestLoss = -100;

    let validMoves = this.changePlayer(turn, board);
    let validOpMoves = this.changePlayer(turnOp, board);

    if (validMoves == 0 || validOpMoves == 0) {
      return {boardMove: board, bestMoves: []};
    }

    for (let i = 0; i < validMoves.length; i++) {

      //simulate move
      result = this.simulateMoveExecution(validMoves[i], board, turn);

      //play again
      if (result.playAgain) {
        result = this.simulateHoleOpPlay(result.boardMove, turn, depth);
      }

      //bot move
      else {
        result = this.simulateHolePlay(result.boardMove, turnOp, depth - 1);

      }

      let loss = (result.boardMove.getWarehouses()[turn] - board.getWarehouses()[turn]) - (result.boardMove.getWarehouses()[turnOp] - board.getWarehouses()[turnOp]);

      if (loss > biggestLoss || (loss == biggestLoss && result.boardMove.getWarehouses()[turn] > boardMove.getWarehouses()[turn])) {
        biggestLoss = loss;
        boardMove = result.boardMove;
      }
    }

    return { biggestLoss, boardMove, bestMoves: [] };
  }
}
