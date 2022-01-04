class Board {
  constructor(seeds, holes) {
    this.board = [];

    this.initBoardSide(0, holes, seeds);
    this.initBoardSide(1, holes, seeds);

    this.boardDisplayer = this.setupDisplayer();
  }

  setupDisplayer() {
    let holes = [];
    let seeds = [];

    this.board.forEach((cavity) => {
      if (cavity instanceof Hole) {
        // hole data
        holes.push({
          hid: cavity.getID(),
          rid: cavity.getSide(),
          value: cavity.getInitialNrSeeds(),
          blocked: cavity.isBlocked(),
        });

        // hole's seeds data
        cavity.getSeeds().forEach((seed) => {
          seeds.push({
            sid: seed.getID(),
            hid: cavity.getID(),
          });
        });
      }
    });

    return new BoardDisplayer({ holes, seeds });
  }

  initBoardSide(side, holes, seeds) {
    const warehouseID = side === 0 ? holes : holes * 2 + 1;

    let i = side === 0 ? 0 : holes + 1;
    for (; i < warehouseID; i++) {
      const adjacentID = (i + 1) % (holes * 2 + 2);
      const oppositeID = (holes * 2 - i) % (holes * 2 + 1);

      let hole = new Hole(i, adjacentID, oppositeID, warehouseID, side, seeds);
      if (side === 1) hole.block();
      this.board.push(hole);
    }

    const adjacentID = (warehouseID + 1) % (holes * 2 + 2);

    let warehouse = new Warehouse(warehouseID, adjacentID, side);
    if (side === 1) warehouse.block();
    this.board.push(warehouse);
  }

  getBoard() {
    return this.board;
  }

  getCavityByID(id) {
    for (let cavity of this.board) {
      if (cavity.getID() === id) return cavity;
    }
  }

  transferSeedTo(seed, toCavity) {
    toCavity.addSeed(seed);
  }

  transferSeedsTo(seeds, toCavity) {
    toCavity.addSeeds(seeds);
  }

  isSideEmpty(side) {
    for (let cavity of this.board) {
      if (
        cavity instanceof Hole &&
        cavity.getSide() === side &&
        !cavity.isEmpty()
      )
        return false;
    }
    return true;
  }
}
