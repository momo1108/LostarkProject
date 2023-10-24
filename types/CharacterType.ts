import { CharData, SearchedData } from "./ReducerType";

export type CharRecentBlockProps = {
  search: (name: string) => void;
  searchedDataList: SearchedData[];
  like: (name: string) => void;
  remove: (name: string) => void;
  updateSrc: (index: number) => void;
  data?: SearchedData[];
};

export type CharSearchBarProps = {
  search: (name: string) => void;
  loading: boolean;
  shrink: boolean;
  searchedDataList: SearchedData[];
  like: (name: string) => void;
  remove: (name: string) => void;
};

export type CharacterPageStatus =
  | "SEARCHING"
  | "DONE"
  | "NODATA"
  | "ERROR"
  | "TOOMANYREQUESTS"
  | "INIT";

export type CharMainInfoBlockProps = {
  loading: boolean;
  data: CharData;
  render: boolean;
};

export type InfoMenu = {
  names: string[];
  activeMenu: number;
};
