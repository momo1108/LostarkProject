/*
Equipment, Accessory, Avatar 를 위한 타입파일
*/

import { CharData } from "./ReducerType";

export type ArmoryEAAProps = {
  data: CharData;
  equipment: any;
  accessory: any;
  avatar: any;
  setEquipmentTooltipContent: React.Dispatch<
    React.SetStateAction<Object | undefined>
  >;
  setAccessoryTooltipContent: React.Dispatch<
    React.SetStateAction<Object | undefined>
  >;
  setAvatarTooltipContent: React.Dispatch<
    React.SetStateAction<Object | undefined>
  >;
};

export type EquipmentSlotProps = {
  grade: string;
  honing: string;
  iconUrl: string;
  showQuality: boolean;
  qualityValue: number;
  contentSetter: React.Dispatch<React.SetStateAction<Object | undefined>>;
};

export type AccessorySlotProps = {
  grade: string;
  iconUrl: string;
  qualityValue: number;
  showQuality: boolean;
  option: string;
  contentSetter: React.Dispatch<React.SetStateAction<Object | undefined>>;
};

export type AvatarSlotProps = {
  grade: string;
  iconUrl: string;
  contentSetter: React.Dispatch<React.SetStateAction<Object | undefined>>;
};

export type EquipmentTooltipProps = {
  data: any;
};

export type AccessoryTooltipProps = {
  data: any;
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
export const avatarOrder: { [key: string]: number } = {
  "무기 아바타": 0,
  "악기 아바타": 2,
  "이동 효과 아바타": 3,
  "머리 아바타": 4,
  "얼굴1 아바타": 6,
  "얼굴2 아바타": 7,
  "상의 아바타": 8,
  "하의 아바타": 10,
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
export const emptyAvatarBackgroundMap: { [key: number]: string } = {
  0: "profileEmptyWeaponAvatar",
  1: "profileEmptyWeaponAvatar",
  2: "profileEmptyInstrumentAvatar",
  3: "profileEmptyMovementAvatar",
  4: "profileEmptyHeadAvatar",
  5: "profileEmptyHeadAvatar",
  6: "profileEmptyFace1Avatar",
  7: "profileEmptyFace2Avatar",
  8: "profileEmptyChestpieceAvatar",
  9: "profileEmptyChestpieceAvatar",
  10: "profileEmptyPantsAvatar",
  11: "profileEmptyPantsAvatar",
};

export const optionShortner: Object = {
  치명: "치",
  특화: "특",
  신속: "신",
  숙련: "숙",
  제압: "제",
  인내: "인",
};
