import { createInputBrick } from "./utils";
import { CatalogBuilder } from "../Catalog";
import type { TVersion } from "../Brick";
import { mockResolver } from "./utils";

describe("Catalog", () => {
  describe("add", () => {
    it("should not have a Catalog with duplicates bricks", () => {
      const a = createInputBrick("a", "5.2.1");
      const b = createInputBrick("b", "5.2.1");
      const aDup = createInputBrick("a", "5.2.1");

      const catalogBuilder = new CatalogBuilder(mockResolver);

      catalogBuilder.add(a).add(b).add(aDup);

      expect(catalogBuilder.build().bricks).toEqual([a, b]);
    });

    it("should throw when a dependency is not in the catalog", () => {
      const a = createInputBrick("a", "5.2.1");

      const catalogBuilder = new CatalogBuilder(mockResolver).add(a, ["b"]);

      expect(() => catalogBuilder.build()).toThrow(
        'Unknown dependency "b" required by "a"',
      );
    });
  });

  describe("resolve version", () => {
    it("should resolve a dependency to its catalog version if it exist", () => {
      const a = createInputBrick("a", "5.2.1");

      const catalog = new CatalogBuilder(mockResolver).add(a).build();

      expect(catalog.resolve("a")).toEqual([{ name: "a", version: "5.2.1" }]);
    });

    it("should resolve to the latest concrete version by the resolver when not provided", () => {
      const returnedVersion: TVersion = "19.0.0";
      const resolver = { resolve: (_name: string) => returnedVersion };
      const catalog = new CatalogBuilder(resolver)
        .add({ name: "react" })
        .build();

      expect(catalog.resolve("react")).toEqual([
        { name: "react", version: "19.0.0" },
      ]);
    });

    it("should resolve to the highest version when version provided have a carret", () => {
      const returnedVersion: TVersion = "1.7.0";
      const resolver = {
        resolve: (_brickName: string, _version?: TVersion) => returnedVersion,
      };
      const catalog = new CatalogBuilder(resolver)
        .add({ name: "a", version: "^1.0.0" })
        .build();

      expect(catalog.resolve("a")).toEqual([{ name: "a", version: "1.7.0" }]);
    });
  });
});
