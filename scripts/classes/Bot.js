class Bot {
  copyBoard(board) {
    let nrSeeds = 0;
    let nrHoles = 0;
    for (let i = 0; i < board.getNrSeeds(); i++)
      nrSeeds++;
    for (let i = 0; i < board.getNrHoles(); i++)
      nrHoles++;

    let newBoard = new Board(nrSeeds, nrHoles);
    let holes = [];
    holes = Array.from(board.getHoles());
    let warehouses = [];
    warehouses = Array.from(board.getWarehouses());

    newBoard.setHoles(holes);
    newBoard.setWarehouses(warehouses);
    return newBoard
  }
  simulateMoveExecution(house, board, turn) {
    let move = {pointsMove: -1, boardMove: -1, playAgain: false};

    //set up board
    const nrHoles = board.getNrHoles();
    // const nrSeeds = board.getNrSeeds();
    let copyBoard = this.copyBoard(board);
    // let copyBoard = new Board(copyBoard1.nrSeeds, copyBoard1.nrHoles);
    // const holes = board.getHoles();
    // const warehouses = board.getWarehouses(); 
    // copyBoard.setHoles(copyBoard1.holes);
    // copyBoard.setWarehouses(copyBoard1.warehouses);

    //sow
    let res = copyBoard.updateBoardUponSowing(house, turn)

    //check if last hole was on bot's side and capture if true and hole was empty
    let ownEmptyHole = false;
    if (turn == 0) ownEmptyHole = res.lastSowing >= 0 && res.lastSowing < nrHoles

    else if (turn == 1) ownEmptyHole = res.lastSowing >= nrHoles && res.lastSowing < 2 * nrHoles

    if (res.lastSowingOnHole && ownEmptyHole) {
      copyBoard.updateBoardUponCapture(res.lastSowing, turn);
      move.playAgain = true;  
    }   
    // let poits1 = copyBoard.getWarehouses[turn];
    // let points2 = v;
    move.pointsMove = copyBoard.getWarehouses()[turn] - board.getWarehouses()[turn];
    move.boardMove = copyBoard;
   
    return move;
  }
  

  
  anticipateOpponentsBestMove(turn, board) {
    let pointsBestMove = 0;
    let bestMove = -1;
    let boardBestMove = board;
    const validMoves = turn == 0 ? range(0, nrHoles) : range(nrHoles, nrHoles * 2);

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

  simulateHolePlay(validMoves, board, pointsPlay, pointsBestMove, bestMove, boardBestMove, turn) {

    let result = { playAgain: true};

    for (let i = 0; i < validMoves.length; i++) {
      if (holes[validMoves[i]] != 0) {
        result = this.simulateMoveExecution(validMoves[i], board, turn);
        pointsPlay += result.pointsMove;
        if (result.playAgain) {
          this.simulateHolePlay(validMoves, result.boardMove, pointsPlay);
        }
      }
      if (result.pointsMove > pointsBestMove) {
        pointsBestMove = result.pointsMove;
        bestMove = validMoves[i];
        boardBestMove = result.boardMove;
      }
    }
    return {pointsBestMove, bestMove, boardBestMove}
  }

  calculateBestMoveRec(level, currentLevel, turn, bestMove, pointsBestMove, board, boardBestMove) {
    const nrHoles = board.getNrHoles();
    const validMoves = turn == 0 ? range(0, nrHoles) : range(nrHoles, nrHoles * 2);
    const holes = board.getHoles();
    
    this.simulateHolePlay(validMoves, board, 0, 0, -1, board, turn);
    // let result = { playAgain: true};

    // for (move in validMoves) {
    //   if (holes[move] != 0) {
        
    //     result = simulateMoveExecution(move, board, turn);

    //     holes = result.boardMove.getHoles();
    //   }

    // }

    // if (result.pointsMove > pointsBestMove) {
    //   bestMove = move;
    //   pointsBestMove = result.pointsMove;
    //   boardBestMove = result.boardMove;
    // }



    if (currentLevel == level) 
      return { bestMove: bestMove, boardBestMove: boardBestMove };

    const opponentsTurn = turn == 0 ? 1 : 0;
    const opponentResult = this.anticipateOpponentsBestMove(opponentsTurn, boardBestMove)
    
    calculateBestMoveRec(level, currentLevel++, turn, bestMove, pointsBestMove, opponentResult.boardBestMove, boardBestMove);
  }
 
  calculateBestMove(level, turn, board) {
    return this.calculateBestMoveRec(level, turn, 1, -1, board, board);
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
