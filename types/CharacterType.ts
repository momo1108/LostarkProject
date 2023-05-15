import { CharData } from "./ReducerType";

export type CharRecentBlockParams = {
  search: (name: string) => void;
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

export type EquipmentSlotProps = {
  grade: string;
  honing: string;
  iconUrl: string;
  qualityValue: number;
  contentSetter: React.Dispatch<React.SetStateAction<Object | undefined>>;
};

export type EquipmentTooltipProps = {
  data: any;
};

export type AccessoryTooltipProps = {
  data: any;
};

export type AccessorySlotProps = {
  grade: string;
  iconUrl: string;
  qualityValue: number;
  showQuality: boolean;
  option: string;
  contentSetter: React.Dispatch<React.SetStateAction<Object | undefined>>;
};

export type FontProps = {
  [key: string]: any;
};

export type PProps = {
  [key: string]: any;
};

export const equipmentOrder: { [key: string]: number } = {
  투구: 0,
  어깨: 1,
  상의: 2,
  하의: 3,
  장갑: 4,
  무기: 5,
};
export const accessoryOrder: { [key: string]: number } = {
  목걸이: 0,
  귀걸이: 1,
  반지: 2,
  팔찌: 3,
  "어빌리티 스톤": 4,
};

export const gradeClassMap: { [key: string]: string } = {
  전설: "legendaryBackground",
  유물: "relicsBackground",
  고대: "ancientBackground",
  에스더: "estherBackground",
};

export const optionShortner: Object = {
  치명: "치",
  특화: "특",
  신속: "신",
  숙련: "숙",
  제압: "제",
  인내: "인",
};
