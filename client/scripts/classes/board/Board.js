class Board {
  constructor(seeds, holes) {
    this.cavities = [];

    this.initBoardSide(0, holes, seeds);
    this.initBoardSide(1, holes, seeds);

    this.boardDisplayer = this.setupDisplayer();
  }

  /**
   * setups a board displayer to display, visually, all the moves that occur during the game
   * the communication between the board and its displayer relies on the send of data following a specific format
   * this method starts this communication by sending the necessary data to render the board for the first time
   */
  setupDisplayer() {
    let holes = [];
    let seeds = [];

    this.cavities.forEach((cavity) => {
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
      this.cavities.push(hole);
    }

    const adjacentID = (warehouseID + 1) % (holes * 2 + 2);

    let warehouse = new Warehouse(warehouseID, adjacentID, side);
    this.cavities.push(warehouse);
  }

  getCavities() {
    return this.cavities;
  }

  getCavityByID(id) {
    return this.cavities.find((cavity) => cavity.getID() === id);
  }

  getWarehouseBySide(side) {
    return this.cavities.find((cavity) => cavity instanceof Warehouse && cavity.getSide() === side);
  }

  getNrHolesEachSide() {
    return (this.cavities.length - 2) / 2;
  }

  isSideTotallyEmpty(side) {
    for (let cavity of this.cavities) {
      if (cavity instanceof Hole && cavity.getSide() === side && !cavity.isEmpty()) return false;
    }
    return true;
  }

  isThereAnySideTotallyEmpty() {
    return this.isSideTotallyEmpty(0) || this.isSideTotallyEmpty(1);
  }

  transferSeedTo(seed, toCavity) {
    toCavity.addSeed(seed);
  }

  performMoveResponse(sow, capture, cleaning, score, turn, finished) {
    let warehouses = [];
    let holes = [];

    this.cavities.forEach((cavity) => {
      if (cavity instanceof Warehouse) {
        warehouses.push({
          wid: cavity.getID() === this.getNrHolesEachSide() ? 0 : 1,
          value: cavity.getCurrentNrSeeds(),
        });
      } else {
        holes.push({
          hid: cavity.getID(),
          value: cavity.getCurrentNrSeeds(),
          blocked: cavity.isBlocked() || cavity.isEmpty(),
        });
      }
    });

    this.boardDisplayer.update({
      sow,
      capture,
      cleaning,
      status: {
        warehouses,
        holes,
        score,
        turn,
        finished,
      },
    });
  }
}
