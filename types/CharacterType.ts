import { CharData, SearchedData } from "./ReducerType";

export type CharRecentBlockProps = {
  search: (name: string) => void;
  searchedDataList: SearchedData[];
  like: (name: string) => void;
  remove: (name: string) => void;
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

export type CharMainInfoBlockProps = {
  loading: boolean;
  data: CharData;
  render: boolean;
};

export const gradeClassMap: { [key: string]: string } = {
  일반: "normalBackground",
  고급: "uncommonBackground",
  희귀: "rareBackground",
  영웅: "epicBackground",
  전설: "legendaryBackground",
  유물: "relicBackground",
  고대: "ancientBackground",
  에스더: "siderealBackground",
};

export type InfoMenu = {
  names: string[];
  activeMenu: number;
};
