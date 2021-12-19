class Bot {
  simulateMoveExecution(house, board) {
    let res = {pointsMove: -1, boardMove: -1};
    let currentHole = house;
    let holes = board.getHoles();
    const seeds = holes[house];
    const nrHoles = this.board.getNrHoles();
    holes[house] = 0;
    currentHole++;
    for (let i = seeds; i > 0; i--) {
      let lastSeed = (i - 1 == 0);
      
      holes[currentHole]++;
      currentHole = ((nrHoles * 2) + (currentHole - 1)) % (nrHoles * 2);
    
      if (lastSeed && holes[currentHole] == 0) 
      res = { lastSowingOnWarehouse: false, lastSowingOnHole: true, lastSowing: hid, };
      
    }

    return res;
  }
            
            // return true;
        
    //  if (this.isValidMove(playedHole)) {
    //   let res = this.sow(playedHole);

    //   this.score[this.currentPlayer] = res.score;
    //   this.updateScore();

    //   if (res.lastSowingOnHole && this.sowedInOwnHole(res.lastSowing))   // last sowing occured in one of the current player's holes
    //       this.score[this.currentPlayer] = this.capture(res.lastSowing);
    //   else if (!res.lastSowingOnWarehouse)                               // last sowing did not occur in the current player's warehouse
    //       this.setCurrentPlayer();                                       // swap players normally
                                                          
    //   if (!this.setValidMoves()) 
    //       this.endGame();
    // }
  
  
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

  calculateBestMoveRec(level, currentLevel, turn, bestMove, pointsBestMove, board, boardBestMove) {
    const nrHoles = board.getNrHoles();
    const validMoves = turn == 0 ? range(0, nrHoles) : range(nrHoles, nrHoles * 2);

    for (move in validMoves) {
      const result = simulateMoveExecution(move, board, turn);

      if (result.pointsMove > pointsBestMove) {
        bestMove = move;
        pointsBestMove = result.pointsMove;
        boardBestMove = result.boardMove;
      }
    }

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
