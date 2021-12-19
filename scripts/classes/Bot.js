class Bot {
  constructor() {

  }

  // simula jogada para calcular pontos que poderão ser obtidos com ela
  simulateMoveExecution() {
    
  }

  // antecipa melhor jogada do oponente
  anticipateOpponentsBestMove() {
    
  }

  // calcula melhor jogada - main function
  calculateBestMove() {
    
  }

  // calcula melhor jogada - recursive function
  calculateBestMoveRec() {
    
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

}
*/