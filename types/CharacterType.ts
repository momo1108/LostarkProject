import { CharData } from "./ReducerType";

export type CharRecentBlockParams = {
  names: string[];
};

export type CharSearchBarParams = {
  search: (name: string) => void;
  loading: boolean;
  shrink: boolean;
};

export type CharMainInfoParams = {
  data: CharData;
  render: boolean;
};

export type CharRecentContainerParams = {
  names: string[];
};
