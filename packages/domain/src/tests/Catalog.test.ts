import { createBrick } from "./utils";
import { CatalogBuilder } from "../Catalog";

describe("Catalog", () => {
  it("should not have a Catalog with duplicates bricks", () => {
    const a = createBrick("a", "5.2.1");
    const b = createBrick("b", "5.2.1");
    const aDup = createBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder();

    catalogBuilder.add(a).add(b).add(aDup);

    expect(catalogBuilder.build().bricks).toEqual([a, b]);
  });

  it("should resolve a dependency to its catalog version", () => {
    const bV2 = createBrick("b", "2.0.0");
    const a = createBrick("a", "5.0.0");

    const catalog = new CatalogBuilder().add(bV2).add(a, ["b"]).build();

    expect(catalog.resolve("a")).toContainEqual(bV2);
  });

  it("should throw when a dependency is not in the catalog", () => {
    const a = createBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder().add(a, ["b"]);

    expect(() => catalogBuilder.build()).toThrow(
      'Unknown dependency "b" required by "a"',
    );
  });
});
