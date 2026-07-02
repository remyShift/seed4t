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

const mockResolvedVersion: TVersion = "5.2.1";
export const mockResolver = {
  resolve: (_name: string, _version?: TVersion) => mockResolvedVersion,
};
