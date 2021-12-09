class Game {
    constructor(board, players, level = 0) {
        this.level = level; /* default value of 0 player vs player case */
        this.board = board;
        this.players = players;
        this.score = [0,0];
        this.currentPlayer = 0; 
    }

    isValidPlay(playedHole) {
        const holes = this.board.getNrHoles();
        return (this.currentPlayer === 0 && playedHole >= 0 && playedHole < (holes / 2)) ||
               (this.currentPlayer === 1 && playedHole >= (holes / 2) && playedHole < holes);
    }

    performPlay(playedHole) {
        this.board.updateBoard(playedHole);
    }

    /* game logic - player vs player */
    standard() {
    }

    /* game logic - player vs pc (level 1) */
    AILevel1() {
    }

    /* game logic - player vs pc (level 2) */
    AILevel2() {
    }

    start() {
        if (this.level === 0) standard();
        else if (this.level === 1) AILevel1();
        else if (this.level === 2) AILevel2();
    }
}