export type CharState = {
  data: CharData;
  names: string[];
  loading: boolean;
  error: Error | null;
};

export type CharData = {
  data: any;
  name: string;
};

export type RootState = {
  character: CharState;
};
