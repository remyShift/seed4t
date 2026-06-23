type TVersion = `${string}.${string}` | `${string}.${string}.${string}`;

export type TBrick = {
  name: string;
  version: TVersion;
  // url: string;
};

export function createBrick(name: string, version: TVersion): TBrick {
  return {
    name,
    version,
  };
}
