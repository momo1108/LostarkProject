export type CharState = {
  data: CharData;
  loading: boolean;
  error: Error | null;
};

export type CharData = any;

export type SearchedState = {
  data: SearchedData[];
  loading: boolean;
  error: Error | null;
};

export type SearchedData = {
  name: string;
  like: boolean;
  level: number;
  class: string;
  img: string;
  server: string;
};

export type RootState = {
  character: CharState;
  searched: SearchedState;
};
