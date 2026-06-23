type Version = `${string}.${string}` | `${string}.${string}.${string}`;

export interface Brick {
  name: string;
  version: Version;
  // url: string;
}

export function createBrick(name: string, version: Version): Brick {
  return {
    name,
    version,
  };
}

export class CatalogBrick {
  constructor(
    public brick: Brick,
    public dependant: Brick | null,
  ) {}
}

export class CatalogBuilder {
  private bricks: CatalogBrick[] = [];

  add(brickToAdd: Brick): this {
    if (this.bricks.some((b) => b.brick.name === brickToAdd.name)) {
      return this;
    }
    this.bricks.push(new CatalogBrick(brickToAdd, null));
    return this;
  }

  build(): CatalogBrick[] {
    return this.bricks;
  }

  addBrickWithDependencies(brickToAdd: Brick, dependant: Brick): this {
    this.bricks.push(new CatalogBrick(brickToAdd, dependant));
    return this;
  }
}

export class Cart {
  bricks: Brick[] = [];

  constructor(private catalog: CatalogBrick[] = []) {}

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
