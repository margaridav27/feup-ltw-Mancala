class Game {
    constructor(board, players, level = 0) {
        this.level = level; /* default value of 0 player vs player case */
        this.board = board;
        this.players = players;
        this.score = [0,0];
        this.currentPlayer = 0; 
        this.setValidMoves();
    }

    setValidMoves() {
        if (this.currentPlayer == 0) 
            this.board.setValidHoles(0, (i) => { this.performPlay(i); });
        else 
            this.board.setValidHoles(1, (i) => { this.performPlay(i); });
    }

    setCurrentPlayer() {
        if (this.currentPlayer == 0) 
            this.currentPlayer = 1;
        else 
            this.currentPlayer = 0;
    }

    performPlay(playedHole) {
        console.log(playedHole)
        this.board.updateBoard(playedHole);
        this.setCurrentPlayer();
        this.setValidMoves();
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