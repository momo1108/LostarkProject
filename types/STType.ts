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

export type SkillData = any;

export type Tripod = any;

export type RuneTooltip = any;
export type SkillTooltip = any;

export const tripodTierToColorMap: { [key: number]: string } = {
  0: "tier1Color",
  1: "tier2Color",
  2: "tier3Color",
};
