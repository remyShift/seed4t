import type { TBrick } from "./Brick";

export class CatalogBrick {
  constructor(
    public brick: TBrick,
    public dependencies: TBrick[] | null,
  ) {}
}

export class CatalogBuilder {
  private readonly bricks: CatalogBrick[] = [];

  add(brickToAdd: TBrick, dependencies?: TBrick[]): this {
    if (dependencies) {
      this.bricks.push(new CatalogBrick(brickToAdd, dependencies));
    } else {
      this.bricks.push(new CatalogBrick(brickToAdd, null));
    }

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

export class Catalog {
  constructor(private readonly entries: CatalogBrick[]) {}

  get bricks(): TBrick[] {
    return this.entries.map((e) => e.brick);
  }

  find(name: string): CatalogBrick | undefined {
    return this.entries.find((e) => e.brick.name === name);
  }

  resolve(name: string): TBrick[] {
    const visited = new Set<string>();
    const result: TBrick[] = [];

    const visit = (brick: TBrick) => {
      if (visited.has(brick.name)) return;
      visited.add(brick.name);

      result.push(brick);

      const entry = this.find(brick.name);

      for (const dependencie of entry?.dependencies ?? []) {
        visit(dependencie);
      }
    };

    const start = this.find(name);
    if (start) {
      visit(start.brick);
    }

    return result;
  }
}
