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
  반지: 3,
  팔찌: 5,
  "어빌리티 스톤": 6,
};
export const emptyEquipmentBackgroundMap: { [key: number]: string } = {
  0: "profileEmptyHelm",
  1: "profileEmptyShoulders",
  2: "profileEmptyChestpiece",
  3: "profileEmptyPants",
  4: "profileEmptyGloves",
  5: "profileEmptyWeapon",
};
export const emptyAccessoryBackgroundMap: { [key: number]: string } = {
  0: "profileEmptyNecklace",
  1: "profileEmptyEarring",
  2: "profileEmptyEarring",
  3: "profileEmptyRing",
  4: "profileEmptyRing",
  5: "profileEmptyBracelet",
  6: "profileEmptyAbilityStone",
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

export const optionShortner: Object = {
  치명: "치",
  특화: "특",
  신속: "신",
  숙련: "숙",
  제압: "제",
  인내: "인",
};
