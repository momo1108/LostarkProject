import { CharData } from "./ReducerType";

export type CharRecentBlockProps = {
  search: (name: string) => void;
  names: string[];
};

export type CharSearchBarProps = {
  search: (name: string) => void;
  loading: boolean;
  shrink: boolean;
};

export type CharMainInfoProps = {
  loading: boolean;
  data: CharData;
  render: boolean;
};

export type CharRecentContainerProps = {
  names: string[];
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
