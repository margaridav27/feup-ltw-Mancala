class LocalGame extends Game {
  constructor() {
    super();

    this.setPlayers();
  }

  setPlayers() {
    const p1 = document.getElementById('name-1').value;
    const nameP1 = p1.length === 0 ? 'Player 1' : p1;
    const p2 = document.getElementById('name-2').value;
    const nameP2 = p1.length === 0 ? 'Player 2' : p2;
    this.players = [nameP1, nameP2];
  }

  // TODO: handle end game in different way
  moveHandler(move) {
    const hasFinished = this.mancala.performMove(move);
    if (hasFinished) return;
  }

  startGame() {
    this.mancala = new Mancala(this.board);
  }
}
