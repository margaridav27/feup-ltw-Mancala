class BoardDisplayer {
  constructor(data) {
    this.nrHolesEachSide = data.holes.length / 2;
    this.boardDimensions = this.getBoardDimensions();
    this.warehouseDimensions = this.getWarehouseDimensions();
    this.holeDimensions = this.getHoleDimensions();

    this.nameP1 = data.players[0];
    this.nameP2 = data.players[1];

    this.constructWarehouseAndRows();
    this.constructHoles(data.holes);
    this.constructSeeds(data.seeds);
  }

  /* -------------------- DIMENSIONS & POSITIONS -------------------- */
  getBoardDimensions() {
    const totalWidth = window.innerWidth;
    const totalHeight = window.innerHeight;
    const boardWidth = Math.floor(vwToPx(80, totalWidth));
    const boardHeight = Math.floor(vhToPx(50, totalHeight));
    return { w: boardWidth, h: boardHeight };
  }

  getHoleDimensions() {
    const boardWidth = this.boardDimensions.w;
    const boardHeight = this.boardDimensions.h;
    const holeWidth = Math.floor(((2 / 3) * boardWidth) / this.nrHolesEachSide);
    const holeHeight = Math.floor((1 / 2) * boardHeight);
    return { w: holeWidth, h: holeHeight };
  }

  getWarehouseDimensions() {
    const boardWidth = this.boardDimensions.w;
    const boardHeight = this.boardDimensions.h;
    const whWidth = Math.floor((1 / 6) * boardWidth);
    const whHeight = Math.floor(boardHeight);
    return { w: whWidth, h: whHeight };
  }

  getHoleTopLeftOffsets(hid) {
    const warehouseWidth = this.warehouseDimensions.w;
    const holeWidth = this.holeDimensions.w;
    const holeHeight = this.holeDimensions.h;
    let leftOffset = warehouseWidth + holeWidth * (Math.abs(hid - this.nrHolesEachSide) - 1);
    let topOffset = hid < this.nrHolesEachSide ? 0 : holeHeight;
    return { l: leftOffset, t: topOffset };
  }

  getSeedTopLeftOffsets(seed) {
    return {
      t: Math.floor(parseInt(seed.style.top.slice(0, -2))),
      l: Math.floor(parseInt(seed.style.left.slice(0, -2))),
    };
  }

  equalPosition(pos1, pos2) {
    return pos1[0] == pos2[0] && pos1[1] == pos2[1];
  }

  /* -------------------- CONSTRUCTORS -------------------- */
  constructWarehouseAndRows() {
    let board = document.querySelector('.board-panel');
    document.getElementById('board-panel').innerHTML = '';

    // warehouses
    let warehouse0 = document.createElement('div');
    warehouse0.className = 'wh';
    warehouse0.id = 'wh-0';
    let value0 = document.createElement('span');
    value0.innerText = 0;
    warehouse0.appendChild(value0);

    let warehouse1 = document.createElement('div');
    warehouse1.className = 'wh';
    warehouse1.id = 'wh-1';
    let value1 = document.createElement('span');
    value1.innerText = 0;
    warehouse1.appendChild(value1);

    // rows
    let row0 = document.createElement('div');
    row0.className = 'row';
    row0.id = 'row-0';

    let row1 = document.createElement('div');
    row1.className = 'row';
    row1.id = 'row-1';

    board.appendChild(warehouse0);
    board.appendChild(row0);
    board.appendChild(row1);
    board.appendChild(warehouse1);
  }

  constructHoles(holes) {
    let row0 = [];
    let row1 = [];
    holes.forEach((hole) => {
      if (hole.rid === 0) row0.push(hole);
      else row1.push(hole);
    });

    // e.g. row0 w/ 4 holes => 3 | 2 | 1 | 0 (hence the reverse)
    let row0Element = document.getElementById('row-0');
    row0.reverse().forEach((hole) => {
      let holeElement = document.createElement('div');
      holeElement.id = `col-${hole.hid}`;
      holeElement.className = 'col';

      let value = document.createElement('span');
      value.innerText = hole.value;

      holeElement.appendChild(value);
      row0Element.appendChild(holeElement);

      if (!hole.blocked) holeElement.classList.add('curr-player');
    });

    // e.g. row1 w/ 4 holes => 5 | 6 | 7 | 8
    let row1Element = document.getElementById('row-1');
    row1.forEach((hole) => {
      let holeElement = document.createElement('div');
      holeElement.id = `col-${hole.hid}`;
      holeElement.className = 'col';

      let value = document.createElement('span');
      value.innerText = hole.value;

      holeElement.appendChild(value);
      row1Element.appendChild(holeElement);

      if (!hole.blocked) holeElement.classList.add('curr-player');
    });
  }

  constructSeeds(seeds) {
    const seedsColorPalette = ['#ffca3a', '#8ac926', '#1982c4', '#ff9f1c', '#ffffff'];

    const holeWidth = this.holeDimensions.w;
    const holeHeight = this.holeDimensions.h;

    seeds.forEach((seed) => {
      let holeElement = document.getElementById(`col-${seed.hid}`);
      let seedElement = document.createElement('div');
      seedElement.id = `seed-${seed.sid}`;
      seedElement.className = 'seed';

      // seed dimensions
      seedElement.style.width = `${holeWidth / 10}px`;
      seedElement.style.height = seedElement.style.width;

      // position relatively to the hole
      const marginOfError = 30;
      const offsetLeft = random(marginOfError, holeWidth - marginOfError);
      const offsetTop = random(marginOfError, holeHeight - marginOfError);
      seedElement.style.left = `${offsetLeft}px`;
      seedElement.style.top = `${offsetTop}px`;

      // color
      const seedColor = seedsColorPalette[random(0, seedsColorPalette.length - 1)];
      seedElement.style.backgroundColor = seedColor;

      holeElement.appendChild(seedElement);
    });
  }

  /* -------------------- VISUAL UPDATES -------------------- */
  updateStatus(warehouses, holes, score, turn) {
    warehouses.forEach((warehouse) => {
      document.querySelector(`#wh-${warehouse.wid} span`).innerText = warehouse.value;
    });

    holes.forEach((hole) => {
      document.querySelector(`#col-${hole.hid} span`).innerText = hole.value;
      if (hole.blocked) document.getElementById(`col-${hole.hid}`).classList.remove('curr-player');
      else document.getElementById(`col-${hole.hid}`).classList.add('curr-player');
    });

    document.getElementById('score-1').innerText = score[0];
    document.getElementById('score-2').innerText = score[1];

    const info = document.getElementById('info');
    info.innerText = turn === 0 ? 
      `It's ${this.nameP1}'s turn. Make your move.` : 
      `It's ${this.nameP2}'s turn. Make your move.`;
  }

  executePhases(sow, capture, cleaning) {
    this.animation(sow).then(() => {
      console.log('finished sow animation');
      if (capture.length === 0) return;
      this.animation(capture).then(() => {
        console.log('finished capture animation');
        if (cleaning.length === 0) return;
        this.animation(cleaning).then(console.log('finished capture animation'));
      });
    });
  }

  async animation(moves) {
    for (let move of moves) {
      let board = document.getElementById('board-panel');

      let from = document.getElementById(`col-${move.from}`);

      let to;
      if (move.to < 0) {
        move.to = Math.abs(move.to) - 1;
        to = document.getElementById(`wh-${move.to}`);
      } else {
        to = document.getElementById(`col-${move.to}`);
      }

      let seed = document.getElementById(`seed-${move.sid}`);

      const fromPos = this.getHoleTopLeftOffsets(move.from);
      const originalSeedPos = this.getSeedTopLeftOffsets(seed);

      seed.style.top = `${fromPos.t + originalSeedPos.t}px`;
      seed.style.left = `${fromPos.l + originalSeedPos.l}px`;

      // removes seed from the origin and transfers it to the board, to the same position visually
      from.removeChild(seed);

      board.appendChild(seed);

      let toPos;
      if (move.to < 0) {
        // destination is a warehouse
        if (move.to == -1) toPos = { t: 0, l: 0 };
        else
          toPos = {
            t: 0,
            l: this.getBoardDimensions().w - this.getWarehouseDimensions().w,
          };
      } else toPos = this.getHoleTopLeftOffsets(move.to);

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
          (Math.pow(t, 3) - 2 * Math.pow(t, 2) + t) * R1[0] * (Math.pow(t, 3) - Math.pow(t, 2)) * R4[0]
        }px`;
        seed.style.top = `${
          (2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1) * P1[1] +
          (-2 * Math.pow(t, 3) + 3 * Math.pow(t, 2)) * P4[1] +
          (Math.pow(t, 3) - 2 * Math.pow(t, 2) + t) * R1[1] * (Math.pow(t, 3) - Math.pow(t, 2)) * R4[1]
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

  update(data) {
    this.updateStatus(data.status.warehouses, 
                      data.status.holes, 
                      data.status.score, 
                      data.status.turn);

    this.executePhases(data.sow, 
                       data.capture, 
                       data.cleaning);
  }
}
