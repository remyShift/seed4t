import type { TInputBrick, TResolvedBrick } from "./Brick";
import { uniqueBy } from "./uniqueBy";

export interface IResolver {
  latest: (brickName: string) => string;
}

export class CatalogBrick {
  constructor(
    public brick: TResolvedBrick,
    public dependencies: string[],
  ) {}
}

export class CatalogBuilder {
  private readonly bricks: CatalogBrick[] = [];

  constructor(private readonly resolver?: IResolver) {}

  add(brickToAdd: TInputBrick, dependencies: string[] = []): this {
    let resolvedVersion: string;

    if (!brickToAdd.version) {
      if (!this.resolver)
        throw new Error(
          `No version specified for brick "${brickToAdd.name}" and no resolver available`,
        );

      resolvedVersion = this.resolver.latest(brickToAdd.name);
    } else {
      resolvedVersion = brickToAdd.version;
    }

    const resolvedBrick: TResolvedBrick = {
      ...brickToAdd,
      version: resolvedVersion,
    };

    this.bricks.push(new CatalogBrick(resolvedBrick, dependencies));
    return this;
  }

  build(): Catalog {
    const entries = uniqueBy(this.bricks, (b) => b.brick.name);
    const names = new Set(entries.map((e) => e.brick.name));

    for (const entry of entries) {
      for (const dependency of entry.dependencies) {
        if (!names.has(dependency)) {
          throw new Error(
            `Unknown dependency "${dependency}" required by "${entry.brick.name}"`,
          );
        }
      }
    }

    return new Catalog(entries);
  }
}

export class Catalog {
  constructor(private readonly entries: CatalogBrick[]) {}

  get bricks(): TResolvedBrick[] {
    return this.entries.map((e) => e.brick);
  }

  find(name: string): CatalogBrick | undefined {
    return this.entries.find((e) => e.brick.name === name);
  }

  resolve(name: string): TResolvedBrick[] {
    const visited = new Set<string>();
    const result: TResolvedBrick[] = [];

    const visit = (entry: CatalogBrick) => {
      if (visited.has(entry.brick.name)) return;
      visited.add(entry.brick.name);

      result.push(entry.brick);

      for (const dependencyName of entry.dependencies) {
        const dependency = this.find(dependencyName);
        if (dependency) {
          visit(dependency);
        }
      }
    };

    const start = this.find(name);
    if (start) {
      visit(start);
    }

    return result;
  }
}
