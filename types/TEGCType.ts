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

export type GemData = any;

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
