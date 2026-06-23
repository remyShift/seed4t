import type { TBrick } from "./Brick";
import { createBrick } from "./Brick";

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
});
