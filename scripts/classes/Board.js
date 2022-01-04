class Board {
  constructor(seeds, holes) {
    this.board = [];
    this.nrHoles = holes;

    this.initBoardSide(0, seeds);
    this.initBoardSide(1, seeds);

    this.boardDisplayer = new BoardDisplayer(this.nrHoles, this.board);
    this.boardDisplayer.display();
  }

  initBoardSide(side, seeds) {
    const warehouseID = side === 0 ? this.nrHoles : this.nrHoles * 2 + 1;

    let i = side === 0 ? 0 : this.nrHoles + 1;
    for (; i < warehouseID; i++) {
      const adjacentID = (i + 1) % (this.nrHoles * 2 + 2);
      const oppositeID = (this.nrHoles * 2 - i) % (this.nrHoles * 2 + 1);

      let hole = new Hole(i, adjacentID, oppositeID, warehouseID, side, seeds);
      if (side === 1) hole.block();
      this.board.push(hole);
    }

    const adjacentID = (warehouseID + 1) % (this.nrHoles * 2 + 2);

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
