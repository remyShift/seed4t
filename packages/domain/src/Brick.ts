// export type TVersion = `${string}.${string}` | `${string}.${string}.${string}`;

export type TInputBrick = {
  name: string;
  version?: string;
};

export type TResolvedBrick = Omit<TInputBrick, "version"> & {
  version: string;
};
