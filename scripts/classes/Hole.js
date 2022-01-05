class Hole extends Cavity {
  constructor(id, adjacent, opposite, warehouse, side, seeds) {
    super(id, adjacent, side);

    this.opposite = opposite;
    this.warehouse = warehouse;

    this.initialNrSeeds = seeds;
    this.seeds = [];
    for (let i = 0; i < seeds; i++) this.seeds.push(new Seed(id * seeds + i));
  }

  getOpposite() {
    return this.opposite;
  }

  getWarehouse() {
    return this.warehouse;
  }

  getSeeds() {
    return this.seeds;
  }

  isEmpty() {
    return this.seeds.length === 0;
  }

  empty() {
    let copySeeds = [...this.seeds];
    this.seeds = [];
    return copySeeds;
  }
}
