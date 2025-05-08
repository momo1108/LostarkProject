import { Dispatch, RefObject, SetStateAction } from "react";
import { engravingIconMap } from "./GlobalType";

export const GRINDING_EFFECT_ETCOPTIONS_VALUE = 7 as const;
export const ACCESSORY_CATEGORY_CODES = {
  장신구: 200000,
  목걸이: 200010,
  귀걸이: 200020,
  반지: 200030,
  팔찌: 200040,
} as const;

export const GRINDING_EFFECT_VALUE_MAP = {
  "공격력 %": 45,
  "공격력 +": 53,
  낙인력: 44,
  "무기 공격력 %": 46,
  "무기 공격력 +": 54,
  "상태이상 공격 지속시간": 57,
  "세레나데, 신성, 조화 게이지 획득량 증가": 43,
  "아군 공격력 강화 효과": 51,
  "아군 피해량 강화 효과": 52,
  "적에게 주는 피해 증가": 42,
  "전투 중 생명력 회복량": 58,
  "최대 마나": 56,
  "최대 생명력": 55,
  "추가 피해": 41,
  "치명타 적중률": 49,
  "치명타 피해": 50,
  "파티원 보호막 효과": 48,
  "파티원 회복 효과": 47,
} as const;

export const ACCESSORY_GRINDINGEFFECT_MAP = {
  목걸이: [
    "공격력 +",
    "낙인력",
    "무기 공격력 +",
    "상태이상 공격 지속시간",
    "세레나데, 신성, 조화 게이지 획득량 증가",
    "적에게 주는 피해 증가",
    "전투 중 생명력 회복량",
    "최대 마나",
    "최대 생명력",
    "추가 피해",
  ],
  귀걸이: [
    "공격력 %",
    "공격력 +",
    "무기 공격력 %",
    "무기 공격력 +",
    "상태이상 공격 지속시간",
    "전투 중 생명력 회복량",
    "최대 마나",
    "최대 생명력",
    "파티원 보호막 효과",
    "파티원 회복 효과",
  ],
  반지: [
    "공격력 +",
    "무기 공격력 +",
    "상태이상 공격 지속시간",
    "아군 공격력 강화 효과",
    "아군 피해량 강화 효과",
    "전투 중 생명력 회복량",
    "최대 마나",
    "최대 생명력",
    "치명타 적중률",
    "치명타 피해",
  ],
} as const;

export type GrindingEffectKey =
  | "공격력 %"
  | "공격력 +"
  | "낙인력"
  | "무기 공격력 %"
  | "무기 공격력 +"
  | "상태이상 공격 지속시간"
  | "세레나데, 신성, 조화 게이지 획득량 증가"
  | "아군 공격력 강화 효과"
  | "아군 피해량 강화 효과"
  | "적에게 주는 피해 증가"
  | "전투 중 생명력 회복량"
  | "최대 마나"
  | "최대 생명력"
  | "추가 피해"
  | "치명타 적중률"
  | "치명타 피해"
  | "파티원 보호막 효과"
  | "파티원 회복 효과";

export type AccessoryGrade = "유물" | "고대";

export type AccessoryTier = 3 | 4;

export type AccessoryCategory = "목걸이" | "귀걸이" | "반지";

export type AccessoryUpgradeLevel = 0 | 1 | 2 | 3;

export type AccessoryTradeCount = 0 | 1 | 2;

export type GrindingEffectLevel = 0 | 1 | 2;

/**
 * 악세서리 검색을 위해 필요한 파라미터들을 저장하기 위한 타입입니다.
 * @property {@link AccessoryCategory} [accessoryCategory] 악세서리의 종류를 식별하기위한 파라미터입니다.
 * @property {@link AccessoryTier} [accessoryTier] 악세서리의 티어 파라미터입니다.
 * @property {@link AccessoryGrade} [accessoryGrade] 악세서리의 아이템 등급 파라미터입니다.
 * @property {@link AccessoryUpgradeLevel} [accessoryUpgradeLevel] 악세서리의 연마 횟수 파라미터입니다.
 * @property {@link AccessoryTradeCount} [accessoryTradeCount] 악세서리의 거래 횟수 파라미터입니다.
 * @property {{name: {@link GrindingEffectKey}; level: {@link GrindingEffectLevel};}[]} [accessoryGrindingEffectArray]  연마 효과 정보를 최대 3개까지 저장하는 배열 파라미터입니다.
 */
export type AccessorySearchOption = {
  /** {@link AccessoryCategory} 악세서리의 종류를 식별하기위한 파라미터입니다. */
  accessoryCategory: AccessoryCategory;

  /** {@link AccessoryTier} 악세서리의 티어 파라미터입니다. */
  accessoryTier: AccessoryTier;

  /** {@link AccessoryGrade} 악세서리의 아이템 등급 파라미터입니다. */
  accessoryGrade: AccessoryGrade;

  /** {@link AccessoryUpgradeLevel} 악세서리의 연마 횟수 파라미터입니다. */
  accessoryUpgradeLevel: AccessoryUpgradeLevel;

  /** {@link AccessoryTradeCount} 악세서리의 거래 횟수 파라미터입니다. */
  accessoryTradeCount: AccessoryTradeCount;

  accessoryGrindingEffectArray: {
    effectName: { name: GrindingEffectKey; value: number };
    effectValue: {
      level: GrindingEffectLevel;
      valueArray: GrindingEffectValue[];
    };
  }[];
};

export type GrindingEffectValue = {
  DisplayValue: string;
  Value: number;
  IsPercentage: boolean;
};

export type GrindingEffectGradeData = Record<
  AccessoryGrade,
  GrindingEffectValue[]
>;
export type GrindingEffectTierData = Record<
  AccessoryTier,
  GrindingEffectGradeData
>;
export type GrindingEffectData = Record<
  GrindingEffectKey,
  GrindingEffectTierData
>;

export type EngraveInfo = {
  name: string;
  level?: number;
  point?: number;
  enableInput?: boolean;
  inputValue?: string;
};

export type Combination = {
  data: number[][];
  sum: number;
  max: number;
  useless_count: number;
};

export const CASES_RELIC: number[][] = [
  [5, 3],
  [4, 3],
  [3, 3],
];

export const CASES_ANCIENT: number[][] = [
  [6, 3],
  [5, 3],
  [4, 3],
  [3, 3],
];

// export const CASES_RELIC: number[][] = [
//   [5, 3],
//   [4, 3],
//   [3, 5],
//   [3, 4],
//   [3, 3],
// ];

// export const CASES_ANCIENT: number[][] = [
//   [6, 3],
//   [5, 3],
//   [4, 3],
//   [3, 6],
//   [3, 5],
//   [3, 4],
//   [3, 3],
// ];

export type AccessoryInfo = {
  type: AccessoryType;
  quality: number;
  stat1: Stat;
  stat2: Stat;
  isOwned: boolean;
  engraveInfo: {
    engrave1: EngraveInfo;
    engrave2: EngraveInfo;
    negativeEngrave: EngraveInfo;
  };
};

enum AccessoryType {
  NECKLACE,
  EARRING,
  RING,
}

type Stat = {
  type: string;
  value: number;
};

export enum DropdownMode {
  TARGET,
  EQUIP,
  ABILITY_STONE,
  NONE,
}

export enum CheckMode {
  TARGET,
  EQUIP,
  ABILITY_STONE,
}

export enum AbilityInputMode {
  ENABLE,
  DISABLE,
  SAVE,
}

export const ENGRAVES = Object.keys(engravingIconMap)
  .filter((e: string) => !e.includes("감소"))
  .sort();

export const NEGATIVE_ENGRAVES = [
  {
    name: "공격력 감소",
    level: 0,
    inputValue: "0",
    enableInput: false,
  },
  {
    name: "공격속도 감소",
    level: 0,
    inputValue: "0",
    enableInput: false,
  },
  {
    name: "방어력 감소",
    level: 0,
    inputValue: "0",
    enableInput: false,
  },
  {
    name: "이동속도 감소",
    level: 0,
    inputValue: "0",
    enableInput: false,
  },
] as const;

export const engraveLevelColorMap: { [key: number]: string } = {
  0: "uncommon",
  1: "rare",
  2: "epic",
  3: "legendary",
};

export type EngraveModalData = {
  targetList: EngraveInfo[];
  equipList: EngraveInfo[];
  abilityList: EngraveInfo[];
  negativeEngrave: EngraveInfo;
  accessoryList: AccessoryInfo[];
};

export type EngravePreset = {
  name: string;
  descr: {
    engrave: string; // ex."원예저타아피 333331"
    stat: string; // ex."치특"
  };
  data: string;
};

export type EngravePresetWithParsedData = {
  name: string;
  descr: {
    engrave: string; // ex."원예저타아피 333331"
    stat: string; // ex."치특"
  };
  data: EngraveModalData;
};

// ear_diff, ring_diff 의 true/false 여부에 따른 list
export const accessoryOrderMap: { [key: number]: number[][] } = {
  0: [
    [0, 1, 2, 3, 4],
    [0, 1, 3, 2, 4],
    [0, 1, 3, 4, 2],
    [0, 3, 1, 2, 4],
    [0, 3, 1, 4, 2],
    [0, 3, 4, 1, 2],
    [1, 0, 2, 3, 4],
    [1, 0, 3, 2, 4],
    [1, 0, 3, 4, 2],
    [3, 0, 1, 2, 4],
    [3, 0, 1, 4, 2],
    [3, 0, 4, 1, 2],
    [1, 2, 0, 3, 4],
    [1, 3, 0, 2, 4],
    [1, 3, 0, 4, 2],
    [3, 1, 0, 2, 4],
    [3, 1, 0, 4, 2],
    [3, 4, 0, 1, 2],
    [1, 2, 3, 0, 4],
    [1, 3, 2, 0, 4],
    [1, 3, 4, 0, 2],
    [3, 1, 2, 0, 4],
    [3, 1, 4, 0, 2],
    [3, 4, 1, 0, 2],
    [1, 2, 3, 4, 0],
    [1, 3, 2, 4, 0],
    [1, 3, 4, 2, 0],
    [3, 1, 2, 4, 0],
    [3, 1, 4, 2, 0],
    [3, 4, 1, 2, 0],
  ],
  1: [
    [0, 1, 2, 3, 4],
    [0, 1, 2, 4, 3],
    [0, 1, 3, 2, 4],
    [0, 1, 4, 2, 3],
    [0, 1, 3, 4, 2],
    [0, 1, 4, 3, 2],
    [0, 3, 1, 2, 4],
    [0, 4, 1, 2, 3],
    [0, 3, 1, 4, 2],
    [0, 4, 1, 3, 2],
    [0, 3, 4, 1, 2],
    [0, 4, 3, 1, 2],
    [1, 0, 2, 3, 4],
    [1, 0, 2, 4, 3],
    [1, 0, 3, 2, 4],
    [1, 0, 4, 2, 3],
    [1, 0, 3, 4, 2],
    [1, 0, 4, 3, 2],
    [3, 0, 1, 2, 4],
    [4, 0, 1, 2, 3],
    [3, 0, 1, 4, 2],
    [4, 0, 1, 3, 2],
    [3, 0, 4, 1, 2],
    [4, 0, 3, 1, 2],
    [1, 2, 0, 3, 4],
    [1, 2, 0, 4, 3],
    [1, 3, 0, 2, 4],
    [1, 4, 0, 2, 3],
    [1, 3, 0, 4, 2],
    [1, 4, 0, 3, 2],
    [3, 1, 0, 2, 4],
    [4, 1, 0, 2, 3],
    [3, 1, 0, 4, 2],
    [4, 1, 0, 3, 2],
    [3, 4, 0, 1, 2],
    [4, 3, 0, 1, 2],
    [1, 2, 3, 0, 4],
    [1, 2, 4, 0, 3],
    [1, 3, 2, 0, 4],
    [1, 4, 2, 0, 3],
    [1, 3, 4, 0, 2],
    [1, 4, 3, 0, 2],
    [3, 1, 2, 0, 4],
    [4, 1, 2, 0, 3],
    [3, 1, 4, 0, 2],
    [4, 1, 3, 0, 2],
    [3, 4, 1, 0, 2],
    [4, 3, 1, 0, 2],
    [1, 2, 3, 4, 0],
    [1, 2, 4, 3, 0],
    [1, 3, 2, 4, 0],
    [1, 4, 2, 3, 0],
    [1, 3, 4, 2, 0],
    [1, 4, 3, 2, 0],
    [3, 1, 2, 4, 0],
    [4, 1, 2, 3, 0],
    [3, 1, 4, 2, 0],
    [4, 1, 3, 2, 0],
    [3, 4, 1, 2, 0],
    [4, 3, 1, 2, 0],
  ],
  2: [
    [0, 1, 2, 3, 4],
    [0, 1, 3, 2, 4],
    [0, 1, 3, 4, 2],
    [0, 2, 1, 3, 4],
    [0, 3, 1, 2, 4],
    [0, 3, 1, 4, 2],
    [0, 2, 3, 1, 4],
    [0, 3, 2, 1, 4],
    [0, 3, 4, 1, 2],
    [0, 2, 3, 4, 1],
    [0, 3, 2, 4, 1],
    [0, 3, 4, 2, 1],
    [1, 0, 2, 3, 4],
    [1, 0, 3, 2, 4],
    [1, 0, 3, 4, 2],
    [2, 0, 1, 3, 4],
    [3, 0, 1, 2, 4],
    [3, 0, 1, 4, 2],
    [2, 0, 3, 1, 4],
    [3, 0, 2, 1, 4],
    [3, 0, 4, 1, 2],
    [2, 0, 3, 4, 1],
    [3, 0, 2, 4, 1],
    [3, 0, 4, 2, 1],
    [1, 2, 0, 3, 4],
    [1, 3, 0, 2, 4],
    [1, 3, 0, 4, 2],
    [2, 1, 0, 3, 4],
    [3, 1, 0, 2, 4],
    [3, 1, 0, 4, 2],
    [2, 3, 0, 1, 4],
    [3, 2, 0, 1, 4],
    [3, 4, 0, 1, 2],
    [2, 3, 0, 4, 1],
    [3, 2, 0, 4, 1],
    [3, 4, 0, 2, 1],
    [1, 2, 3, 0, 4],
    [1, 3, 2, 0, 4],
    [1, 3, 4, 0, 2],
    [2, 1, 3, 0, 4],
    [3, 1, 2, 0, 4],
    [3, 1, 4, 0, 2],
    [2, 3, 1, 0, 4],
    [3, 2, 1, 0, 4],
    [3, 4, 1, 0, 2],
    [2, 3, 4, 0, 1],
    [3, 2, 4, 0, 1],
    [3, 4, 2, 0, 1],
    [1, 2, 3, 4, 0],
    [1, 3, 2, 4, 0],
    [1, 3, 4, 2, 0],
    [2, 1, 3, 4, 0],
    [3, 1, 2, 4, 0],
    [3, 1, 4, 2, 0],
    [2, 3, 1, 4, 0],
    [3, 2, 1, 4, 0],
    [3, 4, 1, 2, 0],
    [2, 3, 4, 1, 0],
    [3, 2, 4, 1, 0],
    [3, 4, 2, 1, 0],
  ],
  3: [
    [0, 1, 2, 3, 4],
    [0, 1, 2, 4, 3],
    [0, 1, 3, 2, 4],
    [0, 1, 4, 2, 3],
    [0, 1, 3, 4, 2],
    [0, 1, 4, 3, 2],
    [0, 2, 1, 3, 4],
    [0, 2, 1, 4, 3],
    [0, 3, 1, 2, 4],
    [0, 4, 1, 2, 3],
    [0, 3, 1, 4, 2],
    [0, 4, 1, 3, 2],
    [0, 2, 3, 1, 4],
    [0, 2, 4, 1, 3],
    [0, 3, 2, 1, 4],
    [0, 4, 2, 1, 3],
    [0, 3, 4, 1, 2],
    [0, 4, 3, 1, 2],
    [0, 2, 3, 4, 1],
    [0, 2, 4, 3, 1],
    [0, 3, 2, 4, 1],
    [0, 4, 2, 3, 1],
    [0, 3, 4, 2, 1],
    [0, 4, 3, 2, 1],
    [1, 0, 2, 3, 4],
    [1, 0, 2, 4, 3],
    [1, 0, 3, 2, 4],
    [1, 0, 4, 2, 3],
    [1, 0, 3, 4, 2],
    [1, 0, 4, 3, 2],
    [2, 0, 1, 3, 4],
    [2, 0, 1, 4, 3],
    [3, 0, 1, 2, 4],
    [4, 0, 1, 2, 3],
    [3, 0, 1, 4, 2],
    [4, 0, 1, 3, 2],
    [2, 0, 3, 1, 4],
    [2, 0, 4, 1, 3],
    [3, 0, 2, 1, 4],
    [4, 0, 2, 1, 3],
    [3, 0, 4, 1, 2],
    [4, 0, 3, 1, 2],
    [2, 0, 3, 4, 1],
    [2, 0, 4, 3, 1],
    [3, 0, 2, 4, 1],
    [4, 0, 2, 3, 1],
    [3, 0, 4, 2, 1],
    [4, 0, 3, 2, 1],
    [1, 2, 0, 3, 4],
    [1, 2, 0, 4, 3],
    [1, 3, 0, 2, 4],
    [1, 4, 0, 2, 3],
    [1, 3, 0, 4, 2],
    [1, 4, 0, 3, 2],
    [2, 1, 0, 3, 4],
    [2, 1, 0, 4, 3],
    [3, 1, 0, 2, 4],
    [4, 1, 0, 2, 3],
    [3, 1, 0, 4, 2],
    [4, 1, 0, 3, 2],
    [2, 3, 0, 1, 4],
    [2, 4, 0, 1, 3],
    [3, 2, 0, 1, 4],
    [4, 2, 0, 1, 3],
    [3, 4, 0, 1, 2],
    [4, 3, 0, 1, 2],
    [2, 3, 0, 4, 1],
    [2, 4, 0, 3, 1],
    [3, 2, 0, 4, 1],
    [4, 2, 0, 3, 1],
    [3, 4, 0, 2, 1],
    [4, 3, 0, 2, 1],
    [1, 2, 3, 0, 4],
    [1, 2, 4, 0, 3],
    [1, 3, 2, 0, 4],
    [1, 4, 2, 0, 3],
    [1, 3, 4, 0, 2],
    [1, 4, 3, 0, 2],
    [2, 1, 3, 0, 4],
    [2, 1, 4, 0, 3],
    [3, 1, 2, 0, 4],
    [4, 1, 2, 0, 3],
    [3, 1, 4, 0, 2],
    [4, 1, 3, 0, 2],
    [2, 3, 1, 0, 4],
    [2, 4, 1, 0, 3],
    [3, 2, 1, 0, 4],
    [4, 2, 1, 0, 3],
    [3, 4, 1, 0, 2],
    [4, 3, 1, 0, 2],
    [2, 3, 4, 0, 1],
    [2, 4, 3, 0, 1],
    [3, 2, 4, 0, 1],
    [4, 2, 3, 0, 1],
    [3, 4, 2, 0, 1],
    [4, 3, 2, 0, 1],
    [1, 2, 3, 4, 0],
    [1, 2, 4, 3, 0],
    [1, 3, 2, 4, 0],
    [1, 4, 2, 3, 0],
    [1, 3, 4, 2, 0],
    [1, 4, 3, 2, 0],
    [2, 1, 3, 4, 0],
    [2, 1, 4, 3, 0],
    [3, 1, 2, 4, 0],
    [4, 1, 2, 3, 0],
    [3, 1, 4, 2, 0],
    [4, 1, 3, 2, 0],
    [2, 3, 1, 4, 0],
    [2, 4, 1, 3, 0],
    [3, 2, 1, 4, 0],
    [4, 2, 1, 3, 0],
    [3, 4, 1, 2, 0],
    [4, 3, 1, 2, 0],
    [2, 3, 4, 1, 0],
    [2, 4, 3, 1, 0],
    [3, 2, 4, 1, 0],
    [4, 2, 3, 1, 0],
    [3, 4, 2, 1, 0],
    [4, 3, 2, 1, 0],
  ],
};
