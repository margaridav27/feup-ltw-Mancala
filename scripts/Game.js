class Game {
    constructor(board, players, level = 0) {
        this.level = level; /* default value of 0 player vs player case */
        this.board = board;
        this.players = players;
        this.score = [0,0];
        this.currentPlayer = 0; 
        this.setValidMoves();
    }

    sowedInOwnWarehouse(sowedWarehouse) { 
        return this.currentPlayer == sowedWarehouse; 
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
        return this.board.updateBoardUponSowing(playedHole);
    }

    capture(lastSowingedHole) {
       this.board.updateBoardUponCapture(lastSowingedHole);
    }

    setValidMoves() {
        if (this.currentPlayer == 0) 
            this.board.setValidHoles(0, (i) => { this.performPlay(i); });
        else 
            this.board.setValidHoles(1, (i) => { this.performPlay(i); });
    }

    setCurrentPlayer() {
        this.currentPlayer = this.currentPlayer == 0 ? 1 : 0;
    }

    performPlay(playedHole) {
        let res = this.sow(playedHole);
        console.log(res);

        // last sowing did not occur on the current player's warehouse
        if (!(res.lastSowingOnWarehouse && this.sowedInOwnWarehouse(res.lastSowing))) 
            this.setCurrentPlayer();
        // last sowing occured in one of the current player's holes
        else if (res.lastSowingOnHole && this.sowedInOwnHole(res.lastSowing)) 
            this.capture(res.lastSowing);

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