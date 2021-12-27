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
    let move = { pointsMove: -1, boardMove: -1, playAgain: false };

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

  static simulateHolePlay(
    playersHoles,
    board,
    points,
    pointsBestMove,
    bestMove,
    boardBestMove,
    turn
  ) {
    let pointsPlay = 0;
    let result, resultRec;
    let bestMoves = [],
      validMoves = [];
    const holes = board.getHoles();
    for (let i = 0; i < playersHoles.length; i++) {
      if (holes[playersHoles[i]] != 0) {
        validMoves.push(playersHoles[i]);
      }
    }

    for (let i = 0; i < validMoves.length; i++) {
      pointsPlay = points;

      //simulate move
      result = this.simulateMoveExecution(validMoves[i], board, turn);
      pointsPlay += result.pointsMove;

      //play again
      if (result.playAgain && validMoves.length > 1) {
        resultRec = this.simulateHolePlay(
          playersHoles,
          result.boardMove,
          pointsPlay,
          pointsBestMove,
          -1,
          boardBestMove,
          turn
        );
        pointsPlay = resultRec.pointsBestMove;
        bestMoves = bestMoves.concat(resultRec.bestMoves);
      }

      //save higher score
      if (pointsPlay > pointsBestMove) {
        pointsBestMove = pointsPlay;
        bestMove = validMoves[i];
        boardBestMove = result.boardMove;
      }
    }

    bestMoves.push(bestMove);
    return { pointsBestMove, bestMoves, boardBestMove };
  }

  static calculateBestMove(level, turn, board) {
    const nrHoles = board.getNrHoles();

    //iniciate arrays with the index of the respective side
    const playersHoles =
      turn == 0
        ? Array.from({ length: nrHoles }, (x, i) => i)
        : Array.from({ length: nrHoles }, (x, i) => i + 4);
    let validMoves = [];

    const bestPlay = this.simulateHolePlay(
      playersHoles,
      board,
      0,
      -1,
      -1,
      board,
      turn
    );

    if (level == 1) {
      return Math.floor(Math.random() * validMoves.length);
    } else if (level == 2) {
      return bestPlay.bestMoves;
    } else if (level == 3) {
      //parte de ver as joadas do adeversário(??)
      //outra forma era fazer o que se faz no level 1 e nesse ser 50% maior pontuação ou index random
    }
  }

  static anticipateOpponentsBestMove(turn, board) {
    let pointsBestMove = 0;
    let bestMove = -1;
    let boardBestMove = board;
    const validMoves =
      turn == 0 ? range(0, nrHoles) : range(nrHoles, nrHoles * 2);

    for (move in validMoves) {
      const result = simulateMoveExecution(holes[i], board, turn);

      if (result.pointsMove > pointsBestMove) {
        bestMove = move;
        pointsBestMove = result.pointsMove;
        boardBestMove = result.boardMove;
      }
    }

    return { bestMove: bestMove, boardBestMove: boardBestMove };
  }
}

/*
CalcularMelhorJogada(nível, board) {
  
  calcularMelhorJogadaRec(nível, 1, -1, 0, board, boardApósMelhorJogada) // passamos-lhe o primeiro nível e a cada chamada recursiva ele vai incrementar o nível atual
    
  return melhorJogada
}

calcularMelhorJogadaRec(nível, nívelAtual, melhorJogada, pontosMelhorJogada, board, boardApósMelhorJogada) {

  // -------------------  simular todas as jogadas do computador ------------------- 
  for i, i = hid de um hole que representa jogada válida {
    {pontosObtidosComJogada, boardApósJogada} <- simularJogada(i)

    if pontosObtidosComJogada >= pontosMelhorJogada {
      melhorJogada <- i
      pontosMelhorJogada <- pontosObtidosComJogada 
      boardApósMelhorJogada <- boardApósJogada
    }
  }

  if nívelAtual == nível { // já percorreu o nível de profundidade indicado
    return {melhorJogada, pontosMelhorJogada}
  } 
	
  // ------------------- simular todas as jogadas do jogador após melhor jogada do nível ------------------- 

  pontosMelhorJogadaOponente <- 0
  melhorJogadaOponente <- -1
  boardApósMelhorJogadaOponente <- boardApósMelhorJogada 

  for i, i = hid de um hole que representa jogada válida {
    {pontosObtidosComJogadaOponente, boardApósJogadaOponente} <- simularJogada(i, boardApósMelhorJogada)

    if pontosObtidosComJogadaOponente >= pontosMelhorJogadaOponente {
      melhorJogadaOponente <- i
      pontosMelhorJogadaOponente <- pontosObtidosComJogada 
      boardApósMelhorJogadaOponente <- boardApósJogada
    }    
  }

  calcularMelhorJogadaRec(nível, nívelAtual+1, melhorJogada, pontosMelhorJogada, boardApósMelhorJogadaOponente)
}

simularJogada(i, board) {

  // algoritmo semelhante ao do perform perform play 

  return {pontosObtidosComJogada, boardApósJogada} // nr de seeds com que a wh do jogador fica

}*/
