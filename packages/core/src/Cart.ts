import type { TBrick } from "./Brick";
import type { Catalog } from "./Catalog";

export class Cart {
  bricks: TBrick[] = [];

  constructor(private readonly catalog: Catalog) {}

  add(brickName: string) {
    const resolved = this.catalog.resolve(brickName);

    for (const brick of resolved) {
      if (!this.bricks.some((b) => b.name === brick.name)) {
        this.bricks.push(brick);
      }
    }
  }

  remove(brickName: string) {
    this.bricks = this.bricks.filter((x) => x.name !== brickName);
  }
}
