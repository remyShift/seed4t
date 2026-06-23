import type { TBrick } from "./Brick";

export class CatalogBrick {
  constructor(
    public brick: TBrick,
    public dependant: TBrick | null,
  ) {}
}

export class Catalog {
  constructor(private readonly entries: CatalogBrick[]) {}

  get bricks(): TBrick[] {
    return this.entries.map((e) => e.brick);
  }

  find(name: string): CatalogBrick | undefined {
    return this.entries.find((e) => e.brick.name === name);
  }
}

export class CatalogBuilder {
  private readonly bricks: CatalogBrick[] = [];

  add(brickToAdd: TBrick): this {
    this.bricks.push(new CatalogBrick(brickToAdd, null));

    return this;
  }

  addBrickWithDependencies(brickToAdd: TBrick, dependant: TBrick): this {
    this.bricks.push(new CatalogBrick(brickToAdd, dependant));

    return this;
  }

  build(): Catalog {
    const dedupBricks = this.bricks.filter(
      (b, index) =>
        this.bricks.findIndex((b2) => b2.brick.name === b.brick.name) === index,
    );

    return new Catalog(dedupBricks);
  }
}
