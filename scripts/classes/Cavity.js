class Cavity {
  constructor(id, adjacent, side) {
    this.ID = id;
    this.adjacent = adjacent;

    this.initialNrSeeds = 0;
    this.seeds = [];

    this.side = side;
  }

  getID() {
    return this.ID;
  }

  getSide() {
    return this.side;
  }

  getInitialNrSeeds() {
    return this.initialNrSeeds;
  }

  getCurrentNrSeeds() {
    return this.seeds.length;
  }

  getSeeds() {
    return this.seeds;
  }

  getAdjacent() {
    return this.adjacent;
  }

  addSeed(seed) {
    this.seeds.push(seed);
  }
}
