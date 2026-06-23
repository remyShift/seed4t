import { createBrick } from "./utils";
import { CatalogBuilder } from "../Catalog";

describe("Catalog", () => {
  it("should not have a Catalog with duplicates bricks", () => {
    const a = createBrick("a", "5.2.1");
    const b = createBrick("b", "5.2.1");
    const aa = createBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder();

    catalogBuilder.add(a).add(b).add(aa);

    expect(catalogBuilder.build().bricks).toEqual([a, b]);
  });
});
