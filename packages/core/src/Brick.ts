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
    if (this.bricks.some((b) => b.brick.name === brickToAdd.name)) {
      return this;
    }
    this.bricks.push(new CatalogBrick(brickToAdd, null));
    return this;
  }

  build(): CatalogBrick[] {
    return this.bricks;
  }

  addBrickWithDependencies(brickToAdd: TBrick, dependant: TBrick): this {
    this.bricks.push(new CatalogBrick(brickToAdd, dependant));
    return this;
  }
}

export class Cart {
  bricks: TBrick[] = [];

  constructor(private readonly catalog: CatalogBrick[] = []) {}

  add(brickName: string) {
    const brickCatalog = this.catalog.find((b) => b.brick.name === brickName);

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
