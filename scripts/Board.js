class Board {
    constructor(seeds, holes) {
        this.nrSeeds = seeds; // holds the number of seeds on each hole
        this.nrHoles = holes; // holds the number of holes on each side
        this.holes = Array(this.nrHoles * 2).fill(this.nrSeeds);
        this.warehouses = [0,0]; // both warehouses are initially empty
    }

    getNrHoles() { return this.nrHoles; }

    getHoles() { return this.holes; }
    
    setValidHoles(rowid, clickHandler) {
        const nrHoles = this.nrHoles;

        if (rowid == 0) {
            document.getElementById("row-1").classList.add("curr-player");
            document.getElementById("row-2").classList.remove("curr-player");

            for (let i = 0; i < nrHoles; i++) {
                let c1 = parseInt(i);
                let c2 = parseInt(i) + parseInt(nrHoles);

                document.getElementById(`col-${c1}`).onclick = () => { clickHandler(i); };
                document.getElementById(`col-${c2}`).onclick = undefined;

                console.log(document.getElementById(`col-${c1}`).onclick)
            }
        } else {
            document.getElementById("row-1").classList.remove("curr-player");
            document.getElementById("row-2").classList.add("curr-player");

            for (let i = 0; i < nrHoles; i++) {
                let c1 = parseInt(i);
                let c2 = parseInt(i) + parseInt(nrHoles);

                document.getElementById(`col-${c1}`).onclick = undefined;
                document.getElementById(`col-${c2}`).onclick = () => { clickHandler(i); }
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
            col.className = "col";
            col.id = `col-${i}`;
            col.innerText = `col ${i} : ${this.nrSeeds} seeds`; 
            r1.appendChild(col);
        }
            
        for (let i = this.nrHoles - 1; i >= 0; i--) {
            let col = document.createElement("div");
            col.className = "col";
            col.id = `col-${i+4}`;
            col.innerText = `col ${i+4} : ${this.nrSeeds} seeds`; 
            r2.appendChild(col);
        }
    }

    #updateBoard() {
        document.getElementById("wh-1").innerText = `wh1 : ${this.warehouses[0]} seeds`;
        document.getElementById("wh-2").innerText = `wh2 : ${this.warehouses[1]} seeds`;

        for (let i = 0; i < (this.nrHoles * 2); i++) 
            document.getElementById(`col-${i}`).innerText = `col ${i} : ${this.holes[`${i}`]} seeds`;
    }

    updateBoard(playedHole) {
        const seeds = this.holes[playedHole];
        let mightBeWarehouse = true; // determines if the next hole can be a warehouse or not
        this.holes[playedHole] = 0; // empty the played hole
        playedHole = (playedHole + 1) % (this.nrHoles * 2); // next hole

        for (let i = seeds; i > 0; i--) {
            if (mightBeWarehouse && playedHole == 0) {
                this.warehouses[0]++;
                mightBeWarehouse = false;
            } else if (mightBeWarehouse && playedHole == this.nrHoles) {
                this.warehouses[1]++;
                mightBeWarehouse = false;
            } else { 
                this.holes[playedHole]++;
                playedHole = (++playedHole) % (this.nrHoles * 2); 
                mightBeWarehouse = true; 
            } 
        }

        // render updated elements
        this.#updateBoard();
    }
}