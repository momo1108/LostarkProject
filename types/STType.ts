import { CharData } from "./ReducerType";

export type ArmorySTProps = {
  className: string;
  data: CharData;
};

export type RuneTooltipProps = {
  data: RuneTooltip;
};

export type SkillTooltipProps = {
  data: SkillTooltip;
};

export type RuneData = {
  Grade: string;
  Icon: string;
  Name: string;
  Tooltip: string;
};

export type TripodData = {
  Name: string;
  Tooltip: string;
  Icon: string;
  Tier: number;
  IsSelected: boolean;
  Slot: number;
  Level: number;
};

export type SkillData = {
  Icon: string;
  Level: number;
  Name: string;
  Rune: RuneData;
  Tooltip: string;
  SkillType: number; // 0 : 일반스킬, 1 : 초각성스킬, 100 : 각성기, 101 : 초각성기
  Tripods: TripodData[];
};

export type ArmotySkills = {};

export type Tripod = any;

export type RuneTooltip = any;
export type SkillTooltip = any;

export const tripodTierToColorMap: { [key: number]: string } = {
  0: "tier1Color",
  1: "tier2Color",
  2: "tier3Color",
};
