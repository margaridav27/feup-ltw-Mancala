class Game {
    constructor(board, players, level = 0) {
        this.level = level; /* default value of 0 player vs player case */
        this.board = board;
        this.players = players;
        this.score = [0,0];
        this.currentPlayer = 0; 
        this.finished = false;
        this.setValidMoves();
    }

    hasFinished() {
        return this.finished;
    }

    sowedInOwnHole(sowedHole) {
        if (sowedHole == -1) return false;

        const nrHoles = this.board.getNrHoles();
        if (this.currentPlayer == 0) 
            return sowedHole >= 0 && sowedHole < nrHoles;
        else 
            return sowedHole >= nrHoles && sowedHole < 2 * nrHoles;
    }

    sow(playedHole) {
        return this.board.updateBoardUponSowing(playedHole, this.currentPlayer);
    }

    capture(lastSowingedHole) {
       return this.board.updateBoardUponCapture(lastSowingedHole, this.currentPlayer);
    }

    setValidMoves() {
        if (!(this.board.setValidHoles(this.currentPlayer, (i) => { this.performPlay(i); }))) {
            //update message
            const info = document.getElementById("info");
            info.innerHTML = "Player " + this.players[this.currentPlayer] + " can't make any more moves";

            //end game
            this.endGame();
        }
    }

    setCurrentPlayer() {
        this.currentPlayer = Math.abs(this.currentPlayer - 1);
    }

    endGame() {
        this.score = this.board.updateBoardUponCleaning();
        this.updateScore(true);
        document.getElementById("row-1").classList.remove("curr-player");
        document.getElementById("row-2").classList.remove("curr-player");
        this.finished = true;
    }

    updateScore(totalScore) {
        if (totalScore) {
            const scoreP1 = document.getElementById("score-1");
            scoreP1.innerHTML = this.score[0];
            const scoreP2 = document.getElementById("score-2");
            scoreP2.innerHTML = this.score[1];
        }
        else {
            const score = document.getElementById("score-" + (this.currentPlayer + 1));
            score.innerHTML = this.score[this.currentPlayer];
        }
    }

    performPlay(playedHole) {

        let res = this.sow(playedHole);

        this.score[this.currentPlayer] = res.score;

        // last sowing did not occur on the current player's warehouse
        if (res.lastSowingOnWarehouse) console.log("Play Again!"); //because the player plays again
        // last sowing occured in one of the current player's holes
        else if (res.lastSowingOnHole && this.sowedInOwnHole(res.lastSowing)) {
            this.score[this.currentPlayer] = this.capture(res.lastSowing);
        }
        // swap players normally
        else this.setCurrentPlayer();

        this.updateScore();

        this.setValidMoves();

        /* 
        here we will check the AI level and act accordingly, i.e.,
            - if the AI level is =1, 
                we will automatically calculate the next move based on algorithm x
            - if the AI level is =2, 
                we will automatically calculate the next move based on algorithm y
            - if the AI level is =0 (player vs player) 
                we don't need to calculate the next move, just wait for the player to perfom it
        */
    }
}