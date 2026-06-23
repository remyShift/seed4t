type TVersion = `${string}.${string}` | `${string}.${string}.${string}`;

export type TBrick = {
  name: string;
  version: TVersion;
  // url: string;
};

export function createBrick(name: string, version: TVersion): TBrick {
  return {
    name,
    version,
  };
}

export class CatalogBrick {
  constructor(
    public brick: TBrick,
    public dependant: TBrick | null,
  ) {}
}

export class CatalogBuilder {
  private readonly bricks: CatalogBrick[] = [];

  add(brickToAdd: TBrick): this {
    this.bricks.push(new CatalogBrick(brickToAdd, null));

    return this;
  }

  build(): Catalog {
    const dedupBricks = this.bricks.filter(
      (b, index) =>
        this.bricks.findIndex((b2) => b2.brick.name === b.brick.name) === index,
    );

    return new Catalog(dedupBricks);
  }

  addBrickWithDependencies(brickToAdd: TBrick, dependant: TBrick): this {
    this.bricks.push(new CatalogBrick(brickToAdd, dependant));
    return this;
  }
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

export class Cart {
  bricks: TBrick[] = [];

  constructor(private readonly catalog: Catalog) {}

  add(brickName: string) {
    const brickCatalog = this.catalog.find(brickName);

    if (!brickCatalog) {
      return;
    }

    this.bricks.push(brickCatalog.brick);

    if (brickCatalog.dependant) {
      this.bricks.push(brickCatalog.dependant);
    }
  }

  remove(brickName: string) {
    this.bricks = this.bricks.filter((x) => x.name !== brickName);
  }
}
