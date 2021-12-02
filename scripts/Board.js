class Board {
    constructor(seeds, holes) {
        this.nrSeeds = seeds; // holds the number of seeds on each hole
        this.nrHoles = holes; // holds the number of holes on each side

        this.warehouses = [0,0]; // both warehouses are initially empty
        this.holes = Array(this.nrHoles * 2).fill(this.nrSeeds);

        // html elements
        this.htmlWarehouses = document.querySelectorAll(".board panel .wh"); 
        this.htmlHoles = document.querySelectorAll(".board-panel .row .col");
    }
   
    // TODO: put seeds
    renderBoard() { 
        let board = document.querySelector(".board-panel");
        board.className = "board-panel"; // make board visible

        // warehouses
        let wh1 = document.createElement("div");
        wh1.className = "wh";
        wh1.id = "wh-1";

        let wh2 = document.createElement("div");
        wh2.className = "wh";
        wh2.id = "wh-2";

        // rows
        let r1 = document.createElement("div");
        r1.className = "row curr-player"; //starts with player 1 as current player
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
            r1.appendChild(col);
        }
            
        for (let i = 0; i < this.nrHoles; i++) {
            let col = document.createElement("div");
            col.className = "col";
            col.id = `col-${i+4}`;
            r2.appendChild(col);
        }
    }

    // TODO: represent seeds correctly, not just with text
    updateBoard() {
        this.htmlWarehouses[0].innerText = this.warehouses[0];
        this.htmlWarehouses[0].innerText = this.warehouses[0];

        for (let i = 0; i < (this.nrHoles * 2); i++) 
            this.htmlHoles[i].innerText = this.holes[i];
    }
}