import type { TInputBrick } from "../Brick";

export function createBrick(
  name: string,
  version: string | undefined,
): TInputBrick {
  return {
    name,
    version,
  };
}
