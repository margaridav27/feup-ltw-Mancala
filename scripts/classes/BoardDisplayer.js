class BoardDisplayer {
  constructor(nrHoles, board) {
    this.nrHoles = nrHoles;
    this.board = board;
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

  constructWarehouseAndRows() {
    let board = document.querySelector('.board-panel');
    document.getElementById('board-panel').innerHTML = '';

    // warehouses
    let wh0 = document.createElement('div');
    wh0.className = 'wh';
    wh0.id = 'wh-0';

    let value0 = document.createElement('span');
    value0.innerText = 0;
    wh0.appendChild(value0);

    let wh1 = document.createElement('div');
    wh1.className = 'wh';
    wh1.id = 'wh-1';

    let value1 = document.createElement('span');
    value1.innerText = 0;
    wh1.appendChild(value1);

    // rows
    let r0 = document.createElement('div');
    r0.className = 'row';
    r0.id = 'row-0';

    let r1 = document.createElement('div');
    r1.className = 'row';
    r1.id = 'row-1';

    board.appendChild(wh0);
    board.appendChild(r0);
    board.appendChild(r1);
    board.appendChild(wh1);
  }

  constructHoles(rid, holes) {
    if (rid === 0) {
      let row = document.getElementById('row-0');

      // e.g. row 0 hole indexes when nr holes is 4 => 3 | 2 | 1 | 0
      for (let i = holes.length - 1; i >= 0; i--) {
        const hid = holes[i].getID();
        const nrSeeds = holes[i].getInitialNrSeeds();

        let holeElement = document.createElement('div');
        holeElement.id = `col-${hid}`;
        holeElement.className = 'col';

        let value = document.createElement('span');
        value.innerText = nrSeeds;

        holeElement.appendChild(value);
        row.appendChild(holeElement);
      }
    } else {
      let row = document.getElementById('row-1');

      // e.g. row 1 hole indexes when nr holes is 4 => 5 | 6 | 7 | 8
      for (let i = 0; i < holes.length; i++) {
        const hid = holes[i].getID();
        const nrSeeds = holes[i].getInitialNrSeeds();

        let holeElement = document.createElement('div');
        holeElement.id = `col-${hid}`;
        holeElement.className = 'col';

        let value = document.createElement('span');
        value.innerText = nrSeeds;

        holeElement.appendChild(value);
        row.appendChild(holeElement);
      }
    }
  }

  constructSeeds(hid, seeds) {
    let seedsColorPalette = ['#ffca3a', '#8ac926', '#1982c4', '#ff9f1c', '#ffffff'];

    const holeWidth = this.getHoleDimensions().w;
    const holeHeight = this.getHoleDimensions().h;

    let hole = document.getElementById(`col-${hid}`);
    seeds.forEach((seed) => {
      const sid = seed.getID();

      let seedElement = document.createElement('div');
      seedElement.id = `seed-${sid}`;
      seedElement.className = 'seed';

      // seed dimensions
      seedElement.style.width = `${holeWidth / 10}px`;
      seedElement.style.height = seedElement.style.width;

      // position relatively to the hole
      const marginOfError = 30;
      const offsetX = random(marginOfError, holeWidth - marginOfError);
      seedElement.style.left = `${offsetX}px`;
      const offsetY = random(marginOfError, holeHeight - marginOfError);
      seedElement.style.top = `${offsetY}px`;

      // color
      const seedColor = seedsColorPalette[random(0, seedsColorPalette.length - 1)];
      seedElement.style.backgroundColor = seedColor;

      hole.appendChild(seedElement);
    });
  }

  display() {
    this.constructWarehouseAndRows();

    let row0Holes = [];
    for (let cavity of this.board) {
      if (cavity instanceof Hole && cavity.getSide() === 0)
        row0Holes.push(cavity);
    }
    this.constructHoles(0, row0Holes);

    let row1Holes = [];
    for (let cavity of this.board) {
      if (cavity instanceof Hole && cavity.getSide() === 1)
        row1Holes.push(cavity);
    }
    this.constructHoles(1, row1Holes);

    for (let cavity of this.board) {
      if (cavity instanceof Hole)
        this.constructSeeds(cavity.getID(), cavity.getSeeds());
    }
  }
}
