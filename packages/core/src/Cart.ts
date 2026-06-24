import type { TBrick } from "./Brick";
import type { Catalog } from "./Catalog";

export class Cart {
  private roots: string[] = [];

  constructor(private readonly catalog: Catalog) {}

  add(brickName: string) {
    const resolved = this.catalog.resolve(brickName);
    if (resolved.length === 0) return;
    if (this.roots.includes(brickName)) return;

    this.roots.push(brickName);
  }

  remove(brickName: string) {
    const resolved = this.catalog.resolve(brickName);
    if (resolved.length === 0) return;
    if (!this.roots.includes(brickName)) return;

    this.roots = this.roots.filter((r) => r !== brickName);
  }

  get bricks(): TBrick[] {
    return this.roots.flatMap((r) => this.catalog.resolve(r));
  }
}
