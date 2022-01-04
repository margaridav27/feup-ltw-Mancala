class BoardDisplayer {
  constructor(data) {
    this.boardDimensions = this.getBoardDimensions();
    this.warehouseDimensions = this.getWarehouseDimensions();
    this.holeDimensions = this.getHoleDimensions(data.holes.length / 2);

    this.constructWarehouseAndRows();
    this.constructHoles(data.holes);
    this.constructSeeds(data.seeds);
  }

  getBoardDimensions() {
    const totalWidth = window.innerWidth;
    const totalHeight = window.innerHeight;
    const boardWidth = Math.floor(vwToPx(80, totalWidth));
    const boardHeight = Math.floor(vhToPx(50, totalHeight));
    return { w: boardWidth, h: boardHeight };
  }

  getHoleDimensions(nrHoles) {
    const boardWidth = this.boardDimensions.w;
    const boardHeight = this.boardDimensions.h;
    const holeWidth = Math.floor(((2 / 3) * boardWidth) / nrHoles);
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
    const seedsColorPalette = [
      '#ffca3a',
      '#8ac926',
      '#1982c4',
      '#ff9f1c',
      '#ffffff',
    ];

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
      const seedColor =
        seedsColorPalette[random(0, seedsColorPalette.length - 1)];
      seedElement.style.backgroundColor = seedColor;

      holeElement.appendChild(seedElement);
    });
  }

  update() {
    for (let wh of this.warehouses) {
      const whid = wh.getSide();
      document.querySelector(`#wh-${whid} span`).innerText =
        wh.getSeeds().length;
    }

    for (let hole of this.holes) {
      const hid = hole.getID();
      document.querySelector(`#col-${hid} span`).innerText =
        hole.getSeeds().length;
    }

    this.setActiveHoles();
  }
}
