export type TVersion = `${string}.${string}` | `${string}.${string}.${string}`;

export type TBrick = {
  name: string;
  version: TVersion;
  // url: string;
};
