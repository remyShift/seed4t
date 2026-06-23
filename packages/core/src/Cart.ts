import type { TBrick } from "./Brick";
import type { Catalog } from "./Catalog";

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
