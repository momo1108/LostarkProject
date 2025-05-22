/*
Engraving, Gem, Card 를 위한 타입파일
*/

import { CharData } from "./ReducerType";

export type ArmoryTEGCProps = {
  data: CharData;
  className: string;
};

export type GemTooltipProps = {
  data: GemData;
};

export type GemSkillData = {
  /** 보석의 효과에 대한 설명
   * @example ["피해 44.00% 증가", "지원 효과 10.00 % 증가"]
   */
  Description: string[];
  /** 보석이 장착된 슬롯 번호(0 ~ 10) */
  GemSlot: number;
  Icon: string;
  Name: string;
  /** 보석의 효과
   * @example "기본 공격력 1.20% 증가"
   */
  Option: string;
  Tooltip: string;
};

export type GemData = {
  /** 보석의 등급(일반, 고급, 희귀, 영웅, 전설, 유물, 고대) */
  Grade: string;
  Icon: string;
  Level: number;
  Name: string;
  /** 보석이 장착된 슬롯 번호(0 ~ 10) */
  Slot: number;
  Tooltip: string;
};

export type ArmoryGem = {
  Effects: {
    Description: string;
    Skills: GemSkillData[];
  };
  Gems: GemData[];
};

export type StatData = any;

export type TendencyData = any;

export const tendencyImageMap: { [key: string]: string } = {
  지성: "/images/tendency1.png",
  담력: "/images/tendency2.png",
  매력: "/images/tendency3.png",
  친절: "/images/tendency4.png",
};

export const gradeCardBackgroundMap: { [key: string]: string } = {
  일반: "common",
  고급: "uncommon",
  희귀: "rare",
  영웅: "epic",
  전설: "legendary",
  유물: "legendary",
};

export const engravingLevelColorMap: { [key: string]: string } = {
  "3": "#fe9600",
  "2": "#ce43fc",
  "1": "#00b5ff",
  "3d": "#de7600",
  "2d": "#ae23dc",
  "1d": "#0095df",
};
