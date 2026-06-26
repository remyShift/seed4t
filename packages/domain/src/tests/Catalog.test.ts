import { createBrick } from "./utils";
import { CatalogBuilder } from "../Catalog";

describe("Catalog", () => {
  describe("add", () => {
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

  describe("resolve version", () => {
    it('should resolve a brick added without a version defaults to "latest"', () => {
      const catalog = new CatalogBuilder().add({ name: "react" }).build();
      expect(catalog.resolve("react")).toEqual([
        { name: "react", version: "latest" },
      ]);
    });
  });
});
