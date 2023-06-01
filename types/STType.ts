import { CharData } from "./ReducerType";

export type ArmorySTProps = {
  className: string;
  data: CharData;
};

export type RuneTooltipProps = {
  data: Rune;
};

export type SkillData = any;

export type Tripod = any;

export type Rune = any;

export const tripodTierToColorMap: { [key: number]: string } = {
  0: "#56a1df",
  1: "#81de62",
  2: "#cfcf70",
};
