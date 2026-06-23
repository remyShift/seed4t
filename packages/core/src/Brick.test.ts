import type { TBrick } from "./Brick";
import { createBrick, CatalogBuilder, Cart } from "./Brick";

describe("Brick", () => {
  it("Should create a Brick", () => {
    const created = createBrick("Express", "5.2.1");

    const express: TBrick = {
      name: "Express",
      version: "5.2.1",
    };

    expect(created).toEqual(express);
  });

  // version test, version should be an array of multiple versions
  // and when creating a brick without precising the version,
  // it should default to "latest" // highest version

  /* eslint-disable vitest/no-commented-out-tests */
  // it("should not have a Catalog with duplicates bricks", () => {
  //   const a = createBrick("a", "5.2.1");
  //   const b = createBrick("b", "5.2.1");
  //   const aa = createBrick("a", "5.2.1");

  //   const catalogBuilder = new CatalogBuilder();

  //   catalogBuilder.add(a).add(b).add(aa);

  //   expect(catalogBuilder.build()).toEqual([a, b]);
  // });
  /* eslint-enable vitest/no-commented-out-tests */

  it("should allow user to add brick", () => {
    const a = createBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder();
    const catalog = catalogBuilder.add(a).build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toEqual([a]);
  });

  it("should allow user to add and remove brick", () => {
    const a = createBrick("a", "5.2.1");
    const b = createBrick("b", "5.2.1");

    const catalogBuilder = new CatalogBuilder();
    const catalog = catalogBuilder.add(a).add(b).build();

    const cart = new Cart(catalog);
    cart.add("a");
    cart.add("b");
    cart.remove("a");

    expect(cart.bricks).toEqual([b]);
  });

  it("should add 2 bricks when adding one that depends on another", () => {
    const b = createBrick("b", "5.2.1");
    const a = createBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder();
    const catalog = catalogBuilder.addBrickWithDependencies(a, b).build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toEqual([a, b]);
  });
});
