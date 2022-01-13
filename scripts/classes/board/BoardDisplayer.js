class BoardDisplayer {
  constructor(data) {
    this.nrHolesEachSide = data.holes.length / 2;
    this.boardDimensions = this.getBoardDimensions();
    this.warehouseDimensions = this.getWarehouseDimensions();
    this.holeDimensions = this.getHoleDimensions();

    this.constructWarehouseAndRows();
    this.constructHoles(data.holes);
    this.constructSeeds(data.seeds);
    createWinnerPopUp();
    createWaitingPopUp();
    //showWaitingPopUp();
  }

  getBoardDimensions() {
    const totalWidth = window.innerWidth;
    const totalHeight = window.innerHeight;
    const boardWidth = Math.floor(vwToPx(80, totalWidth));
    const boardHeight = Math.floor(vhToPx(50, totalHeight));
    return { w: boardWidth, h: boardHeight };
  }

  getWarehouseDimensions() {
    const warehouseWidth = Math.floor((1 / 6) * this.boardDimensions.w);
    const warehouseHeight = this.boardDimensions.h;
    return { w: warehouseWidth, h: warehouseHeight };
  }

  getHoleDimensions() {
    const holeWidth = Math.floor(((2 / 3) * this.boardDimensions.w) / this.nrHolesEachSide);
    const holeHeight = Math.floor((1 / 2) * this.boardDimensions.h);
    return { w: holeWidth, h: holeHeight };
  }

  positionSeedRandomlyInHole(seed) {
    const marginOfError = 30;
    const seedRadius = this.holeDimensions.w / 14;
    const holeCentered = {
      l: Math.floor(this.holeDimensions.w / 2 - seedRadius),
      t: Math.floor(this.holeDimensions.h / 2 - seedRadius),
    };
    const maxDelta = {
      l: holeCentered.l - marginOfError,
      t: holeCentered.t - marginOfError,
    };
    const offset = {
      l: random(-maxDelta.l, maxDelta.l),
      t: random(-maxDelta.t, maxDelta.t),
    };
    seed.style.left = `${holeCentered.l + offset.l}px`;
    seed.style.top = `${holeCentered.t + offset.t}px`;
  }

  positionSeedRandomlyInWarehouse(seed) {
    const marginOfError = 30;
    const seedRadius = this.holeDimensions.w / 14;
    const warehouseCentered = {
      l: Math.floor(this.warehouseDimensions.w / 2 - seedRadius),
      t: Math.floor(this.warehouseDimensions.h / 2 - seedRadius),
    };
    const maxDelta = {
      l: warehouseCentered.l - marginOfError,
      t: warehouseCentered.t - marginOfError,
    };
    const offset = {
      l: random(-maxDelta.l, maxDelta.l),
      t: random(-maxDelta.t, maxDelta.t),
    };
    seed.style.left = `${warehouseCentered.l + offset.l}px`;
    seed.style.top = `${warehouseCentered.t + offset.t}px`;
  }

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
    const seedsColorPalette = ['#ffcb3d', '#9cff00', '#1aa7ff', '#ff980c', '#ffffff'];

    seeds.forEach((seed) => {
      let holeElement = document.getElementById(`col-${seed.hid}`);
      let seedElement = document.createElement('div');
      seedElement.id = `seed-${seed.sid}`;
      seedElement.className = 'seed';

      const seedColor = seedsColorPalette[random(0, seedsColorPalette.length - 1)];

      // seed dimensions
      seedElement.style.width = `${this.holeDimensions.w / 7}px`;
      seedElement.style.height = seedElement.style.width;
      seedElement.style.background = `radial-gradient(circle at 60% 20%, ${seedColor}, rgb(36 36 36) 100%, #000000 100%)`;
      
      // position relatively to the hole
      this.positionSeedRandomlyInHole(seedElement);

      // color
      //seedElement.style.backgroundColor = seedColor;

      holeElement.appendChild(seedElement);
    });
  }

  updateStatus(warehouses, holes, score) {
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
  }

  updateFinalStatus(warehouses, holes, score) {
    holes.forEach((hole) => {
      document.querySelector(`#col-${hole.hid} span`).innerText = 0;
      document.getElementById(`col-${hole.hid}`).classList.remove('curr-player');
    });

    warehouses.forEach((warehouse) => {
      document.querySelector(`#wh-${warehouse.wid} span`).innerText = warehouse.value;
    });

    document.getElementById('score-1').innerText = score[0];
    document.getElementById('score-2').innerText = score[1];
  }

  executePhases(sow, capture, cleaning, status) {
    if (status.finished) {
      this.moveSeeds(sow)
        .then(() => this.moveSeeds(capture))
        .then(() => this.updateFinalStatus(status.warehouses, status.holes, status.score))
        .then(() => this.moveSeeds(cleaning))
        .then(() => (document.querySelector('.winner').style.display = ''))
        .then(() => dotAnimation());
    } else {
      this.moveSeeds(sow)
        .then(() => this.moveSeeds(capture))
        .then(() => this.moveSeeds(cleaning))
        .then(() => this.updateStatus(status.warehouses, status.holes, status.score));
    }
  }

  async moveSeeds(moves) {
    for (let move of moves) {
      let seed = document.getElementById(`seed-${move.sid}`);

      let from = document.getElementById(`col-${move.from}`);
      from.removeChild(seed);

      let to;
      if (move.to < 0) {
        to = document.getElementById(`wh-${Math.abs(move.to) - 1}`);
        to.appendChild(seed);
        this.positionSeedRandomlyInWarehouse(seed);
      } else {
        to = document.getElementById(`col-${move.to}`);
        to.appendChild(seed);
        this.positionSeedRandomlyInHole(seed);
      }

      await sleep(150);
    }
  }

  update(data) {
    this.executePhases(data.sow, data.capture, data.cleaning, data.status);
  }
}
