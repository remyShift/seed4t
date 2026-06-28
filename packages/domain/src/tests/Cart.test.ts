import { createInputBrick } from "./utils";
import { CatalogBuilder } from "../Catalog";
import { Cart } from "../Cart";
import type { TVersion } from "@/Brick";

describe("Cart", () => {
  it("should allow user to add brick", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(a).build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toEqual([a]);
  });

  it("should allow user to add and remove brick", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };

    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(a).add(b).build();

    const cart = new Cart(catalog);
    cart.add("a");
    cart.add("b");
    cart.remove("a");

    expect(cart.bricks).toEqual([b]);
  });

  it("should have 2 bricks when adding one that depends on another", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const b = createInputBrick("b", "5.2.1");
    const a = createInputBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(b).add(a, ["b"]).build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toHaveLength(2);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b]));
  });

  it("should add a brick only once even if added multiple times", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(a).build();

    const cart = new Cart(catalog);
    cart.add("a");
    cart.add("a");

    expect(cart.bricks).toEqual([a]);
  });

  it("should have 3 bricks when adding one that depends on 2 others", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");
    const c = createInputBrick("c", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(b).add(c).add(a, ["b", "c"]).build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toHaveLength(3);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b, c]));
  });

  it("should have 3 bricks when adding one that depends on another that itself depends on a third", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");
    const c = createInputBrick("c", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(c).add(b, ["c"]).add(a, ["b"]).build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toHaveLength(3);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b, c]));
  });

  it("should have 4 bricks when adding multiple bricks that depend on the same one", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");
    const c = createInputBrick("c", "5.2.1");
    const d = createInputBrick("d", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder
      .add(d)
      .add(c, ["d"])
      .add(b, ["d"])
      .add(a, ["b", "c"])
      .build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toHaveLength(4);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b, c, d]));
  });

  it("should not loop forever on a cycle", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(b, ["a"]).add(a, ["b"]).build();

    const cart = new Cart(catalog);
    cart.add("a");

    expect(cart.bricks).toHaveLength(2);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b]));
  });

  it("should remove a brick and its dependencies", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");
    const c = createInputBrick("c", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(b).add(a, ["b"]).add(c).build();

    const cart = new Cart(catalog);
    cart.add("a");
    cart.add("c");

    expect(cart.bricks).toHaveLength(3);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b, c]));

    cart.remove("a");

    expect(cart.bricks).toEqual([c]);
  });

  it("should remove a brick but keep its dependencies that are shared with another brick", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");
    const c = createInputBrick("c", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(b).add(a, ["b"]).add(c, ["b"]).build();

    const cart = new Cart(catalog);
    cart.add("a");
    cart.add("c");

    expect(cart.bricks).toHaveLength(3);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b, c]));

    cart.remove("a");

    expect(cart.bricks).toHaveLength(2);
    expect(cart.bricks).toEqual(expect.arrayContaining([b, c]));
  });

  it("should ignore remove for a brick that is only a transitive dependency", () => {
    const resolvedVersion: TVersion = "5.2.1";
    const mockResolver = {
      resolve: (_name: string, _version?: TVersion) => resolvedVersion,
    };
    const a = createInputBrick("a", "5.2.1");
    const b = createInputBrick("b", "5.2.1");

    const catalogBuilder = new CatalogBuilder(mockResolver);
    const catalog = catalogBuilder.add(b).add(a, ["b"]).build();

    const cart = new Cart(catalog);
    cart.add("a");
    cart.remove("b");

    expect(cart.bricks).toHaveLength(2);
    expect(cart.bricks).toEqual(expect.arrayContaining([a, b]));
  });
});
