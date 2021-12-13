class Board {
    constructor(seeds, holes) {
        this.nrSeeds = seeds; // holds the number of seeds on each hole
        this.nrHoles = holes; // holds the number of holes on each side
        this.holes = Array(this.nrHoles * 2).fill(this.nrSeeds);
        this.warehouses = [0,0]; // both warehouses are initially empty
    }

    getNrHoles() { return this.nrHoles; }

    getHoles() { return this.holes; }
    
    setValidHoles(rid, clickHandler) {
        const nrHoles = this.nrHoles;

        if (rid == 0) {
            document.getElementById("row-1").classList.add("curr-player");
            document.getElementById("row-2").classList.remove("curr-player");

            for (let i = 0; i < nrHoles; i++) {
                let c1 = parseInt(i);
                let c2 = c1 + parseInt(nrHoles);
                
                document.getElementById(`col-${c1}`).onclick = () => { clickHandler(c1); };
                document.getElementById(`col-${c2}`).onclick = undefined;
            }
        } else {
            document.getElementById("row-1").classList.remove("curr-player");
            document.getElementById("row-2").classList.add("curr-player");

            for (let i = 0; i < nrHoles; i++) {
                let c1 = parseInt(i);
                let c2 = c1 + parseInt(nrHoles);

                document.getElementById(`col-${c1}`).onclick = undefined;
                document.getElementById(`col-${c2}`).onclick = () => { clickHandler(c2); }
            }
        }
    }

    renderBoard() { 
        let board = document.querySelector(".board-panel");
        board.className = "board-panel"; // make board visible

        // warehouses
        let wh1 = document.createElement("div");
        wh1.className = "wh";
        wh1.id = "wh-1";
        wh1.innerText = "wh1 : 0 seeds";

        let wh2 = document.createElement("div");
        wh2.className = "wh";
        wh2.id = "wh-2";
        wh2.innerText = "wh2 : 0 seeds";

        // rows
        let r1 = document.createElement("div");
        r1.className = "row"; //starts with player 1 as current player
        r1.id = "row-1";

        let r2 = document.createElement("div");
        r2.className = "row";
        r2.id = "row-2";

        board.appendChild(wh1);
        board.appendChild(r1);
        board.appendChild(r2);
        board.appendChild(wh2);

        // columns (holes)
        for (let i = 0; i < this.nrHoles; i++) {
            let col = document.createElement("div");
            col.id = `col-${i}`;
            col.className = "col";
            col.innerText = `col ${i} : ${this.nrSeeds} seeds`; 
            r1.appendChild(col);
        }
            
        for (let i = this.nrHoles - 1; i >= 0; i--) {
            let c = parseInt(i) + parseInt(this.nrSeeds);

            let col = document.createElement("div");
            col.id = `col-${c}`;
            col.className = "col";
            col.innerText = `col ${c} : ${this.nrSeeds} seeds`; 
            r2.appendChild(col);
        }
    }

    updateBoard() {
        document.getElementById("wh-1").innerText = `wh1 : ${this.warehouses[0]} seeds`;
        document.getElementById("wh-2").innerText = `wh2 : ${this.warehouses[1]} seeds`;

        for (let i = 0; i < (this.nrHoles * 2); i++) 
            document.getElementById(`col-${i}`).innerText = `col ${i} : ${this.holes[`${i}`]} seeds`;
    }

    updateBoardUponSowing(hid) {
        let res = { lastSowingOnWarehouse: false,
                    lastSowingOnHole: false, 
                    lastSowing: -1 };         // response to retrieve upon the sow completion

        const seeds = this.holes[hid];        // number of seeds to sow
        let mightBeWarehouse = true;          // determines if the next hole can be a warehouse or not
        this.holes[hid] = 0;                  // empty the played hole
        hid = (hid + 1) % (this.nrHoles * 2); // next hole
        
        console.log("played hole:",hid)
        console.log("total nr of seeds to sow:",seeds)

        for (let i = seeds; i > 0; i--) {
            let lastSeed = (i - 1 == 0);
            console.log("is last seed",lastSeed,"nr of seeds",this.holes[hid]);

            if (mightBeWarehouse && hid == 0) {
                if (lastSeed)
                    res = { lastSowingOnWarehouse: true, 
                            lastSowingOnHole: false, 
                            lastSowing: 0 };

                this.warehouses[0]++;
                mightBeWarehouse = false;

            } else if (mightBeWarehouse && hid == this.nrHoles) {
                if (lastSeed)
                    res = { lastSowingOnWarehouse: true, 
                            lastSowingOnHole: false, 
                            lastSowing: 1 };

                this.warehouses[1]++;
                mightBeWarehouse = false;

            } else { 
                if (lastSeed && this.holes[hid] == 0)
                    res = { lastSowingOnWarehouse: false, 
                            lastSowingOnHole: true, 
                            lastSowing: hid };
                
                this.holes[hid]++;
                hid = (++hid) % (this.nrHoles * 2); 
                mightBeWarehouse = true; 
            } 
        }

        // render updated board
        this.updateBoard();
        return res;
    }

    updateBoardUponCapture(hid) {
        console.log("capture!!!")
        // capture seeds from the opposite hole
        const oppositeHole = this.nrHoles * 2 - 1 - hid  
        this.board[hid] += this.board[oppositeHole];
        this.board[oppositeHole] = 0;

        // move captured seeds into the correspondent player's wh
        if (hid >= 0 && hid < this.nrHoles) { 
            this.warehouses[0] += this.board[hid];
            this.board[hid] = 0;
        } else {
            this.warehouses[1] += this.board[hid];
            this.board[hid] = 0;
        }

        // render updated board
        this.updateBoard();
    }
}