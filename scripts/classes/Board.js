class Board {
    constructor(seeds, holes) {
        this.nrSeeds = seeds;    // holds the number of seeds on each hole
        this.nrHoles = holes;    // holds the number of holes on each side
        this.warehouses = [0,0]; // both warehouses are initially empty
        this.holes = Array(this.nrHoles * 2).fill(this.nrSeeds);
    }

    getNrHoles() { return this.nrHoles; }

    getHoles() { return this.holes; }
    
    setValidHoles(rid) {
        const nrHoles = this.nrHoles;
        let validHoles = false;

        if (rid == 0) {
            for (let i = 0; i < nrHoles; i++) {
                let c1 = parseInt(i);
                let c2 = c1 + parseInt(nrHoles);

                if (this.holes[c1] == 0) {
                    document.getElementById(`col-${c1}`).classList.remove("curr-player");
                } else {
                    document.getElementById(`col-${c1}`).classList.add("curr-player");
                    validHoles = true;
                }

                document.getElementById(`col-${c2}`).classList.remove("curr-player");
            }
        } else {
            for (let i = 0; i < nrHoles; i++) {
                let c1 = parseInt(i);
                let c2 = c1 + parseInt(nrHoles);
                
                if (this.holes[c2] == 0) {
                    document.getElementById(`col-${c2}`).classList.remove("curr-player");
                }
                else {
                    document.getElementById(`col-${c2}`).classList.add("curr-player");
                    validHoles = true;
                }

                document.getElementById(`col-${c1}`).classList.remove("curr-player");
            }
        }

        return validHoles;
    }

    renderBoard() { 
        let board = document.querySelector(".board-panel");
        document.getElementById("board-panel").innerHTML = '';

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

    updateBoardUponSowing(hid, pid) {
        // response to retrieve upon the sow completion
        let res = { lastSowingOnWarehouse: false, lastSowingOnHole: false, lastSowing: -1, score: -1};         

        const seeds = this.holes[hid];                               // number of seeds to sow
        this.holes[hid] = 0;                                         // empty the played hole
        hid = ((this.nrHoles * 2) + (hid - 1)) % (this.nrHoles * 2); // next hole
        let mightBeWarehouse = true;                                 // determines if the next hole can be a warehouse or not
    
        for (let i = seeds; i > 0; i--) {
            let lastSeed = (i - 1 == 0);

            if (mightBeWarehouse && pid == 0 && hid == this.nrHoles * 2 - 1) {
                this.warehouses[0]++;
                mightBeWarehouse = false;
                if (lastSeed)
                    res = { lastSowingOnWarehouse: true, lastSowingOnHole: false };

            } else if (mightBeWarehouse && pid == 1 && hid == this.nrHoles - 1) { 
                this.warehouses[1]++;
                mightBeWarehouse = false;
                if (lastSeed)
                    res = { lastSowingOnWarehouse: true, lastSowingOnHole: false };

            } else { 
                this.holes[hid]++;
                hid = ((this.nrHoles * 2) + (hid - 1)) % (this.nrHoles * 2); 
                mightBeWarehouse = true; 
                if (lastSeed && this.holes[hid] == 0) 
                    res = { lastSowingOnWarehouse: false, lastSowingOnHole: true, lastSowing: hid, };
            } 
        }

        // render updated board
        this.updateBoard();

        res.score = this.warehouses[pid];
        return res;
    }

    updateBoardUponCapture(hid, pid) {
        // capture seeds from the opposite hole
        const oppositeHole = this.nrHoles * 2 - 1 - hid  
        this.warehouses[pid] += this.holes[oppositeHole] + this.holes[hid];
        this.holes[oppositeHole] = 0;
        this.holes[hid] = 0;

        // render updated board
        this.updateBoard();

        return this.warehouses[pid];
    }

    updateBoardUponCleaning() {
        //clean the holes from both sides to the respective warehouse
        for (let i = 0; i < this.nrHoles; i++) {
            this.warehouses[0] += this.holes[i];
            this.holes[i] = 0;
        }
        for (let i = this.nrHoles - 1; i < this.nrHoles * 2; i++) {
            this.warehouses[1] += this.holes[i];
            this.holes[i] = 0;
        }

        // render updated board
        this.updateBoard();   
        
        return this.warehouses;
    }
}