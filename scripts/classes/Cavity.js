class Cavity {
  constructor(id, adjacent, side) {
    this.ID = id;
    this.adjacent = adjacent;

    this.initialNrSeeds = 0;
    this.seeds = [];

    this.blocked = false;

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

  getSeeds() {
    return this.seeds;
  }

  getAdjacent() {
    return this.adjacent;
  }

  setAdjacent(id) {
    this.adjacent = id;
  }

  isBlocked() {
    return this.blocked;
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }

  addSeed(seed) {
    this.seeds.push(seed);
  }

  addSeeds(seeds) {
    for (let seed of seeds) this.seeds.push(seed);
  }
}
