import { createBrick } from "./utilTest";
import { CatalogBuilder } from "../Catalog";
import { Cart } from "../Cart";

describe("Cart", () => {
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
