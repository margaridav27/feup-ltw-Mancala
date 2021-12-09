class Game {
    constructor(board, players, level = 0) {
        this.level = level; /* default value of 0 player vs player case */
        this.board = board;
        this.players = players;
        this.score = [0,0];
        this.currentPlayer = 0; 
        this.setValidHoles();
    }

    // acho que não devíamos aceder assim ao board dentro da game - pensar em maneira de separar responsabilidades
    setValidHoles() {
        let holes = this.board.getHoles();
        const nrHoles = holes.length / 2;

        if (this.currentPlayer == 0) {
            document.getElementById("row-1").classList.add("curr-player");
            document.getElementById("row-2").classList.remove("curr-player");

            for (let i = 0; i < nrHoles; i++) {
                document.getElementById(`col-${i}`).onclick = () => { this.performPlay(i); };
                document.getElementById(`col-${i+nrHoles}`).onclick = () => {};
            }
        } else {
            document.getElementById("row-1").classList.remove("curr-player");
            document.getElementById("row-2").classList.add("curr-player");

            for (let i = 0; i < nrHoles; i++) {
                document.getElementById(`col-${i+nrHoles}`).onclick = () => { this.performPlay(i+nrHoles); };
                document.getElementById(`col-${i}`).onclick = () => {};
            }
        }
    }

    setCurrentPlayer() {
        if (this.currentPlayer == 0) this.currentPlayer = 1;
        else this.currentPlayer = 0;
    }

    isValidPlay(playedHole) {
        const holes = this.board.getNrHoles();
        return (this.currentPlayer === 0 && playedHole >= 0 && playedHole < (holes / 2)) ||
               (this.currentPlayer === 1 && playedHole >= (holes / 2) && playedHole < holes);
    }

    performPlay(playedHole) {
        this.board.updateBoard(playedHole);
        this.setCurrentPlayer();
        this.setValidHoles();
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