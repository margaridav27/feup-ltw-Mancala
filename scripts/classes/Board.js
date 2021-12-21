class Board {
  constructor(seeds, holes) {
    this.nrSeeds = seeds; // number of seeds on each hole
    this.seedsColorPalette = [
      '#ffca3a',
      '#8ac926',
      '#1982c4',
      '#ff9f1c',
      '#ffffff',
    ];

    this.nrHoles = holes; // number of holes on each side
    this.holes = Array(this.nrHoles * 2).fill(this.nrSeeds);

    this.warehouses = [0, 0]; // both warehouses are initially empty
  }

  getNrHoles() {
    return this.nrHoles;
  }

  getHoles() {
    return this.holes;
  }

  getHoleDimensions() {
    /*  board -> width = 80vw | height = 50vh
        warehouse -> width = 1/6 * 80vw | height = 50vh (each)
        hole -> width = (2/3 * 80vw) / nrHoles | height = 1/2 * 50vh (each)
    */

    const totalWidth = window.innerWidth;
    const totalHeight = window.innerHeight;
    const marginOfError = 30; // due to the margins etc
    const holeWidth = vwToPx(((2 / 3) * 80) / this.nrHoles, totalWidth) - marginOfError;
    const holeHeight = vhToPx((1 / 2) * 50, totalHeight) - marginOfError;
    return { w: holeWidth, h: holeHeight };
  }

  setValidHoles(rid) {
    const nrHoles = this.nrHoles;
    let validHoles = false;

    if (rid == 0) {
      for (let i = 0; i < nrHoles; i++) {
        let c1 = parseInt(i);
        let c2 = c1 + parseInt(nrHoles);

        if (this.holes[c1] == 0) {
          document.getElementById(`col-${c1}`).classList.remove('curr-player');
        } else {
          document.getElementById(`col-${c1}`).classList.add('curr-player');
          validHoles = true;
        }

        document.getElementById(`col-${c2}`).classList.remove('curr-player');
      }
    } else {
      for (let i = 0; i < nrHoles; i++) {
        let c1 = parseInt(i);
        let c2 = c1 + parseInt(nrHoles);

        if (this.holes[c2] == 0) {
          document.getElementById(`col-${c2}`).classList.remove('curr-player');
        } else {
          document.getElementById(`col-${c2}`).classList.add('curr-player');
          validHoles = true;
        }

        document.getElementById(`col-${c1}`).classList.remove('curr-player');
      }
    }

    return validHoles;
  }

  renderWarehousesAndRows() {
    let board = document.querySelector('.board-panel');
    document.getElementById('board-panel').innerHTML = '';

    // warehouses
    let wh1 = document.createElement('div');
    wh1.className = 'wh';
    wh1.id = 'wh-1';
    wh1.innerText = '0';

    let wh2 = document.createElement('div');
    wh2.className = 'wh';
    wh2.id = 'wh-2';
    wh2.innerText = '0';

    // rows
    let r1 = document.createElement('div');
    r1.className = 'row';
    r1.id = 'row-1';

    let r2 = document.createElement('div');
    r2.className = 'row';
    r2.id = 'row-2';

    board.appendChild(wh1);
    board.appendChild(r1);
    board.appendChild(r2);
    board.appendChild(wh2);
  }

  renderRowHoles(rid) {
    if (rid == 1) {
      let r1 = document.getElementById('row-1');

      for (let i = 0; i < this.nrHoles; i++) {
        let col = document.createElement('div');
        col.id = `col-${i}`;
        col.className = 'col';
        col.innerText = this.nrSeeds;
        r1.appendChild(col);
      }
    } else {
      let r2 = document.getElementById('row-2');

      for (let i = this.nrHoles * 2 - 1; i >= this.nrHoles; i--) {
        let col = document.createElement('div');
        col.id = `col-${i}`;
        col.className = 'col';
        col.innerText = this.nrSeeds;
        r2.appendChild(col);
      }
    }
  }

  renderSeeds() {
    const holeWidth = this.getHoleDimensions().w;
    const holeHeight = this.getHoleDimensions().h;

    let holes = document.querySelectorAll('.col');
    holes.forEach((hole) => {
      let id = parseInt(hole.id.substring(4)); // the id of a col has the format col-<id>

      for (let i = 0; i < this.nrSeeds; i++) {
        let seed = document.createElement('div');
        seed.className = 'seed';
        seed.id = `seed-${id * this.nrSeeds + i}`;

        // position relatively to the hole
        const offsetX = random(30, holeWidth);
        seed.style.left = `${offsetX}px`;
        const offsetY = random(30, holeHeight);
        seed.style.top = `${offsetY}px`;

        // color
        const seedColor = this.seedsColorPalette[random(0, this.seedsColorPalette.length - 1)];
        seed.style.backgroundColor = seedColor;

        hole.appendChild(seed);
      }
    });
  }

  renderBoard() {
    this.renderWarehousesAndRows();
    this.renderRowHoles(1);
    this.renderRowHoles(2);
    this.renderSeeds();
  }

  updateBoard() {
    document.getElementById('wh-1').innerText = this.warehouses[0];
    document.getElementById('wh-2').innerText = this.warehouses[1];

    for (let i = 0; i < this.nrHoles * 2; i++)
      document.getElementById(`col-${i}`).innerText = this.holes[i];
  }

  updateBoardUponSowing(hid, pid) {
    // response to retrieve upon the sow completion
    let res = {
      lastSowingOnWarehouse: false,
      lastSowingOnHole: false,
      lastSowing: -1,
      score: -1,
    };

    const seeds = this.holes[hid]; // number of seeds to sow
    this.holes[hid] = 0; // empty the played hole
    hid = (this.nrHoles * 2 + (hid - 1)) % (this.nrHoles * 2); // next hole
    let mightBeWarehouse = true; // determines if the next hole can be a warehouse or not

    for (let i = seeds; i > 0; i--) {
      let lastSeed = i - 1 == 0;

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
        hid = (this.nrHoles * 2 + (hid - 1)) % (this.nrHoles * 2);
        mightBeWarehouse = true;
        if (lastSeed && this.holes[hid] == 0)
          res = {
            lastSowingOnWarehouse: false,
            lastSowingOnHole: true,
            lastSowing: hid,
          };
      }
    }

    // render updated board
    this.updateBoard();

    res.score = this.warehouses[pid];
    return res;
  }

  updateBoardUponCapture(hid, pid) {
    // capture seeds from the opposite hole
    const oppositeHole = this.nrHoles * 2 - 1 - hid;
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
