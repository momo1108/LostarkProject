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
  key: string;
  grade: string;
  honing: string;
  iconUrl: string;
  qualityValue: number;
};

export type AccessorySlotProps = {
  key: string;
  grade: string;
  iconUrl: string;
  qualityValue: number;
  showQuality: boolean;
};
