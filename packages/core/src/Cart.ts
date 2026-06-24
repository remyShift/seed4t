import type { TBrick } from "./Brick";
import type { Catalog } from "./Catalog";

export class Cart {
  private roots: string[] = [];

  constructor(private readonly catalog: Catalog) {}

  add(brickName: string) {
    if (!this.catalog.find(brickName)) return;
    if (this.roots.includes(brickName)) return;

    this.roots.push(brickName);
  }

  remove(brickName: string) {
    if (!this.catalog.find(brickName)) return;
    if (!this.roots.includes(brickName)) return;

    this.roots = this.roots.filter((r) => r !== brickName);
  }

  get bricks(): TBrick[] {
    const all = this.roots.flatMap((r) => this.catalog.resolve(r));

    const seen = new Set<string>();
    return all.filter((brick) => {
      if (seen.has(brick.name)) return false;
      seen.add(brick.name);
      return true;
    });
  }
}
