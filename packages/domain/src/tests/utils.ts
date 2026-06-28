import type { TInputBrick, TVersion } from "../Brick";

export function createInputBrick(
  name: string,
  version: TVersion | undefined,
): TInputBrick {
  return {
    name,
    version,
  };
}
