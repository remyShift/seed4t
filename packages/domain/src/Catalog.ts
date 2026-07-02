import type { TInputBrick, TResolvedBrick, TVersion } from "./Brick";
import { uniqueBy } from "./uniqueBy";

export interface IVersionResolver {
  resolve: (brickName: string, version?: TVersion) => TVersion;
}

export class CatalogBrick {
  constructor(
    public brick: TResolvedBrick,
    public dependencies: string[],
  ) {}
}

export class CatalogBuilder {
  private readonly bricks: CatalogBrick[] = [];

  constructor(private readonly resolver: IVersionResolver) {}

  add(brickToAdd: TInputBrick, dependencies: string[] = []): this {
    const resolvedBrick = this.resolveBrick(brickToAdd);

    this.bricks.push(new CatalogBrick(resolvedBrick, dependencies));
    return this;
  }

  build(): Catalog {
    const entries = uniqueBy(this.bricks, (b) => b.brick.name);
    const names = new Set(entries.map((e) => e.brick.name));

    const allDeps = entries.flatMap((e) =>
      e.dependencies.map((dep) => ({ dep, owner: e.brick.name })),
    );

    for (const { dep, owner } of allDeps) {
      if (!names.has(dep))
        throw new Error(`Unknown dependency "${dep}" required by "${owner}"`);
    }

    return new Catalog(entries);
  }

  private resolveBrick(brickToAdd: TInputBrick): TResolvedBrick {
    const resolvedVersion = this.resolver.resolve(
      brickToAdd.name,
      brickToAdd.version,
    );

    const resolvedBrick: TResolvedBrick = {
      ...brickToAdd,
      version: resolvedVersion,
    };
    return resolvedBrick;
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
