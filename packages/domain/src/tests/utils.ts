import type { TBrick, TVersion } from "../Brick";

export function createBrick(name: string, version: TVersion): TBrick {
  return {
    name,
    version,
  };
}
