export type CharState = {
  data: CharData;
  names: string[];
  loading: boolean;
  error: Error | null;
};

export type CharData = any;

export type RootState = {
  character: CharState;
};
