type TRangedVersion = `^${string}.${string}` | `^${string}.${string}.${string}`;
type TExplicitVersion = `${string}.${string}` | `${string}.${string}.${string}`;

export type TVersion = TRangedVersion | TExplicitVersion;

export type TInputBrick = {
  name: string;
  version?: TVersion;
};

export type TResolvedBrick = Omit<TInputBrick, "version"> & {
  version: TVersion;
};
