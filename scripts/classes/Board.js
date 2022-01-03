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
    //[3,5,10,1,2,9,1,1] 

    this.warehouses = [0, 0]; // both warehouses are initially empty
  }

  setHoles(holes) {
    this.holes = holes;
  }

  setWarehouses(warehouses) {
    this.warehouses = warehouses;
  }

  getNrHoles() {
    return this.nrHoles;
  }

  getNrSeeds() {
    return this.nrSeeds;
  }

  getHoles() {
    return this.holes;
  }

  getWarehouses() {
    return this.warehouses;
  }

  getBoardDimensions() {
    const totalWidth = window.innerWidth;
    const totalHeight = window.innerHeight;
    const boardWidth = Math.floor(vwToPx(80, totalWidth));
    const boardHeight = Math.floor(vhToPx(50, totalHeight));
    return { w: boardWidth, h: boardHeight };
  }

  getHoleDimensions() {
    const boardDimensions = this.getBoardDimensions();
    const holeWidth = Math.floor(((2 / 3) * boardDimensions.w) / this.nrHoles);
    const holeHeight = Math.floor((1 / 2) * boardDimensions.h);
    return { w: holeWidth, h: holeHeight };
  }

  getWarehouseDimensions() {
    const boardDimensions = this.getBoardDimensions();
    const whWidth = Math.floor((1 / 6) * boardDimensions.w);
    const whHeight = Math.floor(boardDimensions.h);
    return { w: whWidth, h: whHeight };
  }

  getHoleTopLeftOffsets(hid) {
    const holeDimensions = this.getHoleDimensions();
    const whDimensions = this.getWarehouseDimensions();
    let holeOffset = hid < this.nrHoles ? hid : hid - this.nrHoles;
    let leftOffset = whDimensions.w + holeOffset * holeDimensions.w;
    let topOffset = holeOffset == hid ? 0 : holeDimensions.h;
    return { l: leftOffset, t: topOffset };
  }

  getSeedTopLeftOffsets(seed) {
    return {
      t: Math.floor(parseInt(seed.style.top.slice(0, -2))),
      l: Math.floor(parseInt(seed.style.left.slice(0, -2))),
    };
  }

  isEmpty(turn) {
    let validMovesOp = [];
    const playersHoles = (turn == 0) ? Array.from({ length: this.nrHoles }, (x, i) => i) : Array.from({ length: this.nrHoles }, (x, i) => i + 4);
    for (let i = 0; i < playersHoles.length; i++) {
      if (this.holes[playersHoles[i]] != 0) {
        validMovesOp.push(playersHoles[i]);
      }
    }
    return validMovesOp == 0;
  }

  // async setValidHoles(rid) {
  //   const nrHoles = this.nrHoles;
  //   let validHoles = false;

  //   if (this.isEmpty(0) || this.isEmpty(1)) return false;

  //   if (rid == 0) {
  //     for (let i = 0; i < nrHoles; i++) {
  //       let c1 = parseInt(i);
  //       let c2 = c1 + parseInt(nrHoles);

  //       // syncing
  //       let nrSeeds = document.querySelectorAll(`#col-${c1} .seed`).length;
  //       while (nrSeeds != this.holes[c1]) {
  //         await sleep(5).then(() => {
  //           nrSeeds = document.querySelectorAll(`#col-${c1} .seed`).length;
  //         });
  //       }

  //       if (nrSeeds == 0) {
  //         document.getElementById(`col-${c1}`).classList.remove('curr-player');
  //       } else {
  //         document.getElementById(`col-${c1}`).classList.add('curr-player');
  //         validHoles = true;
  //       }

  //       document.getElementById(`col-${c2}`).classList.remove('curr-player');
  //     }
  //   } else {
  //     for (let i = 0; i < nrHoles; i++) {
  //       let c1 = parseInt(i);
  //       let c2 = c1 + parseInt(nrHoles);

  //       // syncing
  //       let nrSeeds = document.querySelectorAll(`#col-${c2} .seed`).length;
  //       while (nrSeeds != this.holes[c2]) {
  //         await sleep(5).then(() => {
  //           nrSeeds = document.querySelectorAll(`#col-${c2} .seed`).length;
  //         });
  //       }

  //       if (nrSeeds == 0) {
  //         document.getElementById(`col-${c2}`).classList.remove('curr-player');
  //       } else {
  //         document.getElementById(`col-${c2}`).classList.add('curr-player');
  //         validHoles = true;
  //       }

  //       document.getElementById(`col-${c1}`).classList.remove('curr-player');
  //     }
  //   }
    

  //   return validHoles;
  // }

  async setValidHoles(rid) {
    const nrHoles = this.nrHoles;
    let row1IsEmpty = true;
    let row0IsEmpty = true;

    for (let i = 0; i < nrHoles; i++) {
      let c1 = parseInt(i);
      let c2 = c1 + parseInt(nrHoles);

      // syncing
      let nrSeedsRow0 = document.querySelectorAll(`#col-${c1} .seed`).length;
      let nrSeedsRow1 = document.querySelectorAll(`#col-${c2} .seed`).length;
      while (nrSeedsRow0 != this.holes[c1] || nrSeedsRow1 != this.holes[c2]) {
        await sleep(5).then(() => {
          nrSeedsRow0 = document.querySelectorAll(`#col-${c1} .seed`).length;
          nrSeedsRow1 = document.querySelectorAll(`#col-${c2} .seed`).length;
        });
      }

      if (nrSeedsRow0 !== 0) row0IsEmpty = false;
      if (nrSeedsRow1 !== 0) row1IsEmpty = false;

      switch (rid) {
        case 0:
          if (nrSeedsRow0 == 0) 
            document.getElementById(`col-${c1}`).classList.remove('curr-player');
          else 
            document.getElementById(`col-${c1}`).classList.add('curr-player');
          document.getElementById(`col-${c2}`).classList.remove('curr-player');
          break;
        case 1:
          if (nrSeedsRow1 == 0) 
            document.getElementById(`col-${c2}`).classList.remove('curr-player');
          else 
            document.getElementById(`col-${c2}`).classList.add('curr-player');
          document.getElementById(`col-${c1}`).classList.remove('curr-player');
          break;
      }
    }

    // returns false if one of the rows is empty, i.e. the game is not in conditions to proceed
    return !(row0IsEmpty || row1IsEmpty);
  }

  updateBoardValues() {
    console.log('upadtando boardxi values');
    document.querySelector('#wh-1 span').innerText = this.warehouses[0];
    document.querySelector('#wh-2 span').innerText = this.warehouses[1];

    for (let i = 0; i < this.nrHoles * 2; i++)
      document.querySelector(`#col-${i} span`).innerText = this.holes[i];
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

  updateBoardUponSowing(hid, pid) {
    // response to retrieve upon the sow completion
    let res = {
      lastSowingOnWarehouse: false,
      lastSowingOnHole: false,
      lastSowing: -1,
      score: -1,
    };

    const fromhid = hid;

    // seeds and number of seeds to sow
    const seeds = document.querySelectorAll(`#col-${hid} .seed`);
    const nrSeeds = this.holes[hid];

    // empty the played hole
    this.holes[hid] = 0;

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
        this.moveSeed(seeds[i].id, fromhid, -1);

        mightBeWarehouse = false;
      } else if (mightBeWarehouse && pid == 1 && hid == this.nrHoles - 1) {
        if (lastSeed)
          res = {
            lastSowingOnWarehouse: true,
            lastSowingOnHole: false,
          };

        this.warehouses[1]++;
        this.moveSeed(seeds[i].id, fromhid, -2);

        mightBeWarehouse = false;
      } else {
        if (lastSeed && this.holes[hid] == 0)
          res = {
            lastSowingOnWarehouse: false,
            lastSowingOnHole: true,
            lastSowing: hid,
          };

        this.holes[hid]++;
        this.moveSeed(seeds[i].id, fromhid, hid);

        hid = (this.nrHoles * 2 + (hid - 1)) % (this.nrHoles * 2);
        mightBeWarehouse = true;
      }
    }

    this.updateBoardValues();
    res.score = this.warehouses[pid];
    return res;
  }

  async updateBoardUponCapture(hid, pid) {
    // capture seeds from own hole
    let holeSeeds = document.querySelectorAll(`#col-${hid} .seed`);

    // syncing
    while (holeSeeds.length != this.holes[hid]) {
      await sleep(5).then(() => {
        holeSeeds = document.querySelectorAll(`#col-${hid} .seed`);
      });
    }

    // capture seeds from opposite hole
    const oppositeHoleId = this.nrHoles * 2 - 1 - hid;
    let oppositeHoleSeeds = document.querySelectorAll(
      `#col-${oppositeHoleId} .seed`
    );

    // syncing
    while (oppositeHoleSeeds.length != this.holes[oppositeHoleId]) {
      await sleep(5).then(() => {
        oppositeHoleSeeds = document.querySelectorAll(
          `#col-${oppositeHoleId} .seed`
        );
      });
    }

    this.holes[hid] = 0;
    this.holes[oppositeHoleId] = 0;
    this.warehouses[pid] += holeSeeds.length + oppositeHoleSeeds.length;

    let whId = pid == 0 ? -1 : -2;
    holeSeeds.forEach((seed) => {
      this.moveSeed(seed.id, hid, whId);
    });
    oppositeHoleSeeds.forEach((seed) => {
      this.moveSeed(seed.id, oppositeHoleId, whId);
    });

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

      const hole = document.getElementById(`#col-${i}`);
      const seeds = document.querySelectorAll(`#col-${i} .seed`);
      seeds.forEach((seed) => {
        hole.removeChild(seed);
        wh1.appendChild(seed);
      });
    }
    for (let i = this.nrHoles - 1; i < this.nrHoles * 2; i++) {
      this.warehouses[1] += this.holes[i];
      this.holes[i] = 0;

      const hole = document.getElementById(`#col-${i}`);
      const seeds = document.querySelectorAll(`#col-${i} .seed`);
      seeds.forEach((seed) => {
        hole.removeChild(seed);
        wh2.appendChild(seed);
      });
    }

    this.updateBoardValues();
    return this.warehouses;
  }

  equalPosition(pos1, pos2) {
    return pos1[0] == pos2[0] && pos1[1] == pos2[1];
  }

  async moveSeed(sid, fromid, toid) {
    let from = document.getElementById(`col-${fromid}`);

    let to;
    if (toid < 0) to = document.getElementById(`wh-${Math.abs(toid)}`);
    else to = document.getElementById(`col-${toid}`);

    let seed = document.getElementById(sid);
    let board = document.getElementById('board-panel');

    // removes seed from the origin and transfers it to the board, to the same position visually
    from.removeChild(seed);

    const fromPos = this.getHoleTopLeftOffsets(fromid);
    const originalSeedPos = this.getSeedTopLeftOffsets(seed);

    seed.style.top = `${fromPos.t + originalSeedPos.t}px`;
    seed.style.left = `${fromPos.l + originalSeedPos.l}px`;
    board.appendChild(seed);

    let toPos;
    if (toid < 0) {
      // destination is a warehouse
      if (toid == -1) toPos = { t: 0, l: 0 };
      else
        toPos = {
          t: 0,
          l: this.getBoardDimensions().w - this.getWarehouseDimensions().w,
        };
    } else toPos = this.getHoleTopLeftOffsets(toid);

    // bezier curve values
    let currSeedPos = this.getSeedTopLeftOffsets(seed);
    let P1 = [currSeedPos.l, currSeedPos.t];
    const P4 = [toPos.l + originalSeedPos.l, toPos.t + originalSeedPos.t];
    const R1 = [0, 1];
    const R4 = [0, -1];
    let t = 0;

    // moves seed along the board, from origin to destination
    while (!this.equalPosition(P1, P4)) {
      t += 0.1;
      seed.style.left = `${
        (2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1) * P1[0] +
        (-2 * Math.pow(t, 3) + 3 * Math.pow(t, 2)) * P4[0] +
        (Math.pow(t, 3) - 2 * Math.pow(t, 2) + t) *
          R1[0] *
          (Math.pow(t, 3) - Math.pow(t, 2)) *
          R4[0]
      }px`;
      seed.style.top = `${
        (2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1) * P1[1] +
        (-2 * Math.pow(t, 3) + 3 * Math.pow(t, 2)) * P4[1] +
        (Math.pow(t, 3) - 2 * Math.pow(t, 2) + t) *
          R1[1] *
          (Math.pow(t, 3) - Math.pow(t, 2)) *
          R4[1]
      }px`;

      currSeedPos = this.getSeedTopLeftOffsets(seed);
      P1 = [currSeedPos.l, currSeedPos.t];

      await sleep(20);
    }

    // removes seed from the board and transfers it to the destination
    board.removeChild(seed);

    seed.style.top = `${originalSeedPos.t}px`;
    seed.style.left = `${originalSeedPos.l}px`;
    to.appendChild(seed);
  }
}
