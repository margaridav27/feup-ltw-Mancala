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
    const holeWidth = vwToPx(((2 / 3) * 80) / this.nrHoles, totalWidth);
    const holeHeight = vhToPx((1 / 2) * 50, totalHeight);
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

    let value1 = document.createElement('span');
    value1.innerText = 0;
    wh1.appendChild(value1);

    let wh2 = document.createElement('div');
    wh2.className = 'wh';
    wh2.id = 'wh-2';

    let value2 = document.createElement('span');
    value2.innerText = 0;
    wh2.appendChild(value2);

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

        let value = document.createElement('span');
        value.innerText = this.nrSeeds;

        col.appendChild(value);
        r1.appendChild(col);
      }
    } else {
      let r2 = document.getElementById('row-2');

      for (let i = this.nrHoles * 2 - 1; i >= this.nrHoles; i--) {
        let col = document.createElement('div');
        col.id = `col-${i}`;
        col.className = 'col';

        let value = document.createElement('span');
        value.innerText = this.nrSeeds;

        col.appendChild(value);
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

        // seed dimensions
        seed.style.width = `${holeWidth / 10}px`;
        seed.style.height = seed.style.width;

        // position relatively to the hole
        const marginOfError = 30;
        const offsetX = random(marginOfError, holeWidth - marginOfError);
        seed.style.left = `${offsetX}px`;
        const offsetY = random(marginOfError, holeHeight - marginOfError);
        seed.style.top = `${offsetY}px`;

        // color
        const seedColor =
          this.seedsColorPalette[random(0, this.seedsColorPalette.length - 1)];
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

  updateBoardValues() {
    document.querySelector('#wh-1 span').innerText = this.warehouses[0];
    document.querySelector('#wh-2 span').innerText = this.warehouses[1];

    for (let i = 0; i < this.nrHoles * 2; i++)
      document.querySelector(`#col-${i} span`).innerText = this.holes[i];
  }

  updateBoardUponSowing(hid, pid) {
    // response to retrieve upon the sow completion
    let res = {
      lastSowingOnWarehouse: false,
      lastSowingOnHole: false,
      lastSowing: -1,
      score: -1,
    };

    // seeds and number of seeds to sow
    const seeds = document.querySelectorAll(`#col-${hid} .seed`);
    const nrSeeds = this.holes[hid];

    // empty the played hole
    this.holes[hid] = 0;
    const playedHole = document.getElementById(`col-${hid}`);
    seeds.forEach((seed) => playedHole.removeChild(seed));

    hid = (this.nrHoles * 2 + (hid - 1)) % (this.nrHoles * 2); // next hole
    let mightBeWarehouse = true; // determines if the next hole can be a warehouse or not

    for (let i = 0; i < nrSeeds; i++) {
      let lastSeed = i + 1 == nrSeeds;

      if (mightBeWarehouse && pid == 0 && hid == this.nrHoles * 2 - 1) {
        if (lastSeed)
          res = {
            lastSowingOnWarehouse: true,
            lastSowingOnHole: false,
          };

        this.warehouses[0]++;
        document.getElementById('wh-1').appendChild(seeds[i]);

        mightBeWarehouse = false;
      } else if (mightBeWarehouse && pid == 1 && hid == this.nrHoles - 1) {
        if (lastSeed)
          res = {
            lastSowingOnWarehouse: true,
            lastSowingOnHole: false,
          };

        this.warehouses[1]++;
        document.getElementById('wh-2').appendChild(seeds[i]);

        mightBeWarehouse = false;
      } else {
        if (lastSeed && this.holes[hid] == 0)
          res = {
            lastSowingOnWarehouse: false,
            lastSowingOnHole: true,
            lastSowing: hid,
          };

        this.holes[hid]++;
        document.getElementById(`col-${hid}`).appendChild(seeds[i]);

        hid = (this.nrHoles * 2 + (hid - 1)) % (this.nrHoles * 2);
        mightBeWarehouse = true;
      }
    }

    res.score = this.warehouses[pid];
    this.updateBoardValues();
    return res;
  }

  updateBoardUponCapture(hid, pid) {
    // capture seeds from own hole
    const hole = document.getElementById(`col-${hid}`);
    const holeSeeds = document.querySelectorAll(`#col-${hid} .seed`);
    this.holes[hid] = 0;
    holeSeeds.forEach((capturedSeed) => hole.removeChild(capturedSeed));

    // capture seeds from opposite hole
    const oppositeHoleId = this.nrHoles * 2 - 1 - hid;
    const oppositeHole = document.getElementById(`col-${oppositeHoleId}`);
    const oppositeHoleSeeds = document.querySelectorAll(
      `#col-${oppositeHoleId} .seed`
    );
    this.holes[oppositeHoleId] = 0;
    oppositeHoleSeeds.forEach((capturedSeed) =>
      oppositeHole.removeChild(capturedSeed)
    );

    // move the captured seeds to the warehouse
    this.warehouses[pid] += holeSeeds.length + oppositeHoleSeeds.length;
    const capturedSeeds = [...holeSeeds,...oppositeHoleSeeds];
    const warehouse = document.getElementById(`wh-${pid + 1}`);
    capturedSeeds.forEach((capturedSeed) =>
      warehouse.appendChild(capturedSeed)
    );

    this.updateBoardValues();
    return this.warehouses[pid];
  }

  updateBoardUponCleaning() {
    let wh1 = document.getElementById('wh-1');
    let wh2 = document.getElementById('wh-2');

    // move seeds from each hole to the correspondent warehouse
    for (let i = 0; i < this.nrHoles; i++) {
      this.warehouses[0] += this.holes[i];
      this.holes[i] = 0;

      const hole = document.getElementById(`#col-${hid}`);
      const seeds = document.querySelectorAll(`#col-${hid} .seed`);
      seeds.forEach((seed) => {
        hole.removeChild(seed);
        wh1.appendChild(seed);
      });
    }
    for (let i = this.nrHoles - 1; i < this.nrHoles * 2; i++) {
      this.warehouses[1] += this.holes[i];
      this.holes[i] = 0;

      const hole = document.getElementById(`#col-${hid}`);
      const seeds = document.querySelectorAll(`#col-${hid} .seed`);
      seeds.forEach((seed) => {
        hole.removeChild(seed);
        wh2.appendChild(seed);
      });
    }

    this.updateBoardValues();
    return this.warehouses;
  }
}
