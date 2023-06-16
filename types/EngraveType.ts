import { engravingIconMap } from "./TEGCType";

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

export const CASES: number[][] = [
  [6, 3],
  [5, 3],
  [4, 3],
  [3, 6],
  [3, 5],
  [3, 4],
  [3, 3],
];

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
  type: "치명" | "특화" | "신속" | "제압" | "인내" | "숙련";
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
];

export const NEGATIVE_ENGRAVES_POINT: { [key: string]: number } = {
  "공격력 감소": 0,
  "공격속도 감소": 0,
  "방어력 감소": 0,
  "이동속도 감소": 0,
};

export type AuctionItemSearchReq = {
  CategoryCode: number;
  EtcOptions: EtcOption[];
  ItemGrade: string;
  ItemGradeQuality: number;
  ItemTier: number;
  PageNo: number;
  Sort: Sort;
  SortCondition: SortCondition;
};
export type EtcOption = {
  FirstOption?: number | null;
  SecondOption?: number | null;
  MinValue?: number | null;
  MaxValue?: number | null;
};

export type AuctionItemSearchResult = {
  PageNo: number;
  PageSize: number;
  TotalCount: number;
  Items: AuctionItem[];
};

type AuctionItem = {
  Name: string;
  Grade: string;
  Tier: number;
  Level: number | null;
  Icon: string;
  GradeQuality: number;
  AuctionInfo: {
    StartPrice: number;
    BuyPrice: number;
    BidPrice: number;
    EndDate: string;
    BidCount: number;
    BidStartPrice: number;
    IsCompetitive: boolean;
    TradeAllowCount: number;
  };
  Options: AuctionOption[];
};

type AuctionOption = {
  Type: string;
  OptionName: string;
  OptionNameTripod: string;
  Value: number;
  IsPenalty: boolean;
  ClassName: string | null;
};

enum Sort {
  BIDSTART_PRICE,
  BUY_PRICE,
  EXPIREDATE,
  ITEM_GRADE,
  ITEM_LEVEL,
  ITEM_QUALITY,
}

enum SortCondition {
  ASC,
  DESC,
}

export const engraveLevelColorMap: { [key: number]: string } = {
  0: "uncommon",
  1: "rare",
  2: "epic",
  3: "legendary",
};

// ear_diff, ring_diff 의 true/false 여부에 따른 list
export const accessoryOrderMap: { [key: number]: number[][] } = {
  0: [
    [1, 2, 3, 4, 5],
    [1, 2, 4, 3, 5],
    [1, 2, 4, 5, 3],
    [1, 4, 2, 3, 5],
    [1, 4, 2, 5, 3],
    [1, 4, 5, 2, 3],
    [2, 1, 3, 4, 5],
    [2, 1, 4, 3, 5],
    [2, 1, 4, 5, 3],
    [4, 1, 2, 3, 5],
    [4, 1, 2, 5, 3],
    [4, 1, 5, 2, 3],
    [2, 3, 1, 4, 5],
    [2, 4, 1, 3, 5],
    [2, 4, 1, 5, 3],
    [4, 2, 1, 3, 5],
    [4, 2, 1, 5, 3],
    [4, 5, 1, 2, 3],
    [2, 3, 4, 1, 5],
    [2, 4, 3, 1, 5],
    [2, 4, 5, 1, 3],
    [4, 2, 3, 1, 5],
    [4, 2, 5, 1, 3],
    [4, 5, 2, 1, 3],
    [2, 3, 4, 5, 1],
    [2, 4, 3, 5, 1],
    [2, 4, 5, 3, 1],
    [4, 2, 3, 5, 1],
    [4, 2, 5, 3, 1],
    [4, 5, 2, 3, 1],
  ],
  1: [
    [1, 2, 3, 4, 5],
    [1, 2, 3, 5, 4],
    [1, 2, 4, 3, 5],
    [1, 2, 5, 3, 4],
    [1, 2, 4, 5, 3],
    [1, 2, 5, 4, 3],
    [1, 4, 2, 3, 5],
    [1, 5, 2, 3, 4],
    [1, 4, 2, 5, 3],
    [1, 5, 2, 4, 3],
    [1, 4, 5, 2, 3],
    [1, 5, 4, 2, 3],
    [2, 1, 3, 4, 5],
    [2, 1, 3, 5, 4],
    [2, 1, 4, 3, 5],
    [2, 1, 5, 3, 4],
    [2, 1, 4, 5, 3],
    [2, 1, 5, 4, 3],
    [4, 1, 2, 3, 5],
    [5, 1, 2, 3, 4],
    [4, 1, 2, 5, 3],
    [5, 1, 2, 4, 3],
    [4, 1, 5, 2, 3],
    [5, 1, 4, 2, 3],
    [2, 3, 1, 4, 5],
    [2, 3, 1, 5, 4],
    [2, 4, 1, 3, 5],
    [2, 5, 1, 3, 4],
    [2, 4, 1, 5, 3],
    [2, 5, 1, 4, 3],
    [4, 2, 1, 3, 5],
    [5, 2, 1, 3, 4],
    [4, 2, 1, 5, 3],
    [5, 2, 1, 4, 3],
    [4, 5, 1, 2, 3],
    [5, 4, 1, 2, 3],
    [2, 3, 4, 1, 5],
    [2, 3, 5, 1, 4],
    [2, 4, 3, 1, 5],
    [2, 5, 3, 1, 4],
    [2, 4, 5, 1, 3],
    [2, 5, 4, 1, 3],
    [4, 2, 3, 1, 5],
    [5, 2, 3, 1, 4],
    [4, 2, 5, 1, 3],
    [5, 2, 4, 1, 3],
    [4, 5, 2, 1, 3],
    [5, 4, 2, 1, 3],
    [2, 3, 4, 5, 1],
    [2, 3, 5, 4, 1],
    [2, 4, 3, 5, 1],
    [2, 5, 3, 4, 1],
    [2, 4, 5, 3, 1],
    [2, 5, 4, 3, 1],
    [4, 2, 3, 5, 1],
    [5, 2, 3, 4, 1],
    [4, 2, 5, 3, 1],
    [5, 2, 4, 3, 1],
    [4, 5, 2, 3, 1],
    [5, 4, 2, 3, 1],
  ],
  2: [
    [1, 2, 3, 4, 5],
    [1, 2, 4, 3, 5],
    [1, 2, 4, 5, 3],
    [1, 3, 2, 4, 5],
    [1, 4, 2, 3, 5],
    [1, 4, 2, 5, 3],
    [1, 3, 4, 2, 5],
    [1, 4, 3, 2, 5],
    [1, 4, 5, 2, 3],
    [1, 3, 4, 5, 2],
    [1, 4, 3, 5, 2],
    [1, 4, 5, 3, 2],
    [2, 1, 3, 4, 5],
    [2, 1, 4, 3, 5],
    [2, 1, 4, 5, 3],
    [3, 1, 2, 4, 5],
    [4, 1, 2, 3, 5],
    [4, 1, 2, 5, 3],
    [3, 1, 4, 2, 5],
    [4, 1, 3, 2, 5],
    [4, 1, 5, 2, 3],
    [3, 1, 4, 5, 2],
    [4, 1, 3, 5, 2],
    [4, 1, 5, 3, 2],
    [2, 3, 1, 4, 5],
    [2, 4, 1, 3, 5],
    [2, 4, 1, 5, 3],
    [3, 2, 1, 4, 5],
    [4, 2, 1, 3, 5],
    [4, 2, 1, 5, 3],
    [3, 4, 1, 2, 5],
    [4, 3, 1, 2, 5],
    [4, 5, 1, 2, 3],
    [3, 4, 1, 5, 2],
    [4, 3, 1, 5, 2],
    [4, 5, 1, 3, 2],
    [2, 3, 4, 1, 5],
    [2, 4, 3, 1, 5],
    [2, 4, 5, 1, 3],
    [3, 2, 4, 1, 5],
    [4, 2, 3, 1, 5],
    [4, 2, 5, 1, 3],
    [3, 4, 2, 1, 5],
    [4, 3, 2, 1, 5],
    [4, 5, 2, 1, 3],
    [3, 4, 5, 1, 2],
    [4, 3, 5, 1, 2],
    [4, 5, 3, 1, 2],
    [2, 3, 4, 5, 1],
    [2, 4, 3, 5, 1],
    [2, 4, 5, 3, 1],
    [3, 2, 4, 5, 1],
    [4, 2, 3, 5, 1],
    [4, 2, 5, 3, 1],
    [3, 4, 2, 5, 1],
    [4, 3, 2, 5, 1],
    [4, 5, 2, 3, 1],
    [3, 4, 5, 2, 1],
    [4, 3, 5, 2, 1],
    [4, 5, 3, 2, 1],
  ],
  3: [
    [1, 2, 3, 4, 5],
    [1, 2, 3, 5, 4],
    [1, 2, 4, 3, 5],
    [1, 2, 5, 3, 4],
    [1, 2, 4, 5, 3],
    [1, 2, 5, 4, 3],
    [1, 3, 2, 4, 5],
    [1, 3, 2, 5, 4],
    [1, 4, 2, 3, 5],
    [1, 5, 2, 3, 4],
    [1, 4, 2, 5, 3],
    [1, 5, 2, 4, 3],
    [1, 3, 4, 2, 5],
    [1, 3, 5, 2, 4],
    [1, 4, 3, 2, 5],
    [1, 5, 3, 2, 4],
    [1, 4, 5, 2, 3],
    [1, 5, 4, 2, 3],
    [1, 3, 4, 5, 2],
    [1, 3, 5, 4, 2],
    [1, 4, 3, 5, 2],
    [1, 5, 3, 4, 2],
    [1, 4, 5, 3, 2],
    [1, 5, 4, 3, 2],
    [2, 1, 3, 4, 5],
    [2, 1, 3, 5, 4],
    [2, 1, 4, 3, 5],
    [2, 1, 5, 3, 4],
    [2, 1, 4, 5, 3],
    [2, 1, 5, 4, 3],
    [3, 1, 2, 4, 5],
    [3, 1, 2, 5, 4],
    [4, 1, 2, 3, 5],
    [5, 1, 2, 3, 4],
    [4, 1, 2, 5, 3],
    [5, 1, 2, 4, 3],
    [3, 1, 4, 2, 5],
    [3, 1, 5, 2, 4],
    [4, 1, 3, 2, 5],
    [5, 1, 3, 2, 4],
    [4, 1, 5, 2, 3],
    [5, 1, 4, 2, 3],
    [3, 1, 4, 5, 2],
    [3, 1, 5, 4, 2],
    [4, 1, 3, 5, 2],
    [5, 1, 3, 4, 2],
    [4, 1, 5, 3, 2],
    [5, 1, 4, 3, 2],
    [2, 3, 1, 4, 5],
    [2, 3, 1, 5, 4],
    [2, 4, 1, 3, 5],
    [2, 5, 1, 3, 4],
    [2, 4, 1, 5, 3],
    [2, 5, 1, 4, 3],
    [3, 2, 1, 4, 5],
    [3, 2, 1, 5, 4],
    [4, 2, 1, 3, 5],
    [5, 2, 1, 3, 4],
    [4, 2, 1, 5, 3],
    [5, 2, 1, 4, 3],
    [3, 4, 1, 2, 5],
    [3, 5, 1, 2, 4],
    [4, 3, 1, 2, 5],
    [5, 3, 1, 2, 4],
    [4, 5, 1, 2, 3],
    [5, 4, 1, 2, 3],
    [3, 4, 1, 5, 2],
    [3, 5, 1, 4, 2],
    [4, 3, 1, 5, 2],
    [5, 3, 1, 4, 2],
    [4, 5, 1, 3, 2],
    [5, 4, 1, 3, 2],
    [2, 3, 4, 1, 5],
    [2, 3, 5, 1, 4],
    [2, 4, 3, 1, 5],
    [2, 5, 3, 1, 4],
    [2, 4, 5, 1, 3],
    [2, 5, 4, 1, 3],
    [3, 2, 4, 1, 5],
    [3, 2, 5, 1, 4],
    [4, 2, 3, 1, 5],
    [5, 2, 3, 1, 4],
    [4, 2, 5, 1, 3],
    [5, 2, 4, 1, 3],
    [3, 4, 2, 1, 5],
    [3, 5, 2, 1, 4],
    [4, 3, 2, 1, 5],
    [5, 3, 2, 1, 4],
    [4, 5, 2, 1, 3],
    [5, 4, 2, 1, 3],
    [3, 4, 5, 1, 2],
    [3, 5, 4, 1, 2],
    [4, 3, 5, 1, 2],
    [5, 3, 4, 1, 2],
    [4, 5, 3, 1, 2],
    [5, 4, 3, 1, 2],
    [2, 3, 4, 5, 1],
    [2, 3, 5, 4, 1],
    [2, 4, 3, 5, 1],
    [2, 5, 3, 4, 1],
    [2, 4, 5, 3, 1],
    [2, 5, 4, 3, 1],
    [3, 2, 4, 5, 1],
    [3, 2, 5, 4, 1],
    [4, 2, 3, 5, 1],
    [5, 2, 3, 4, 1],
    [4, 2, 5, 3, 1],
    [5, 2, 4, 3, 1],
    [3, 4, 2, 5, 1],
    [3, 5, 2, 4, 1],
    [4, 3, 2, 5, 1],
    [5, 3, 2, 4, 1],
    [4, 5, 2, 3, 1],
    [5, 4, 2, 3, 1],
    [3, 4, 5, 2, 1],
    [3, 5, 4, 2, 1],
    [4, 3, 5, 2, 1],
    [5, 3, 4, 2, 1],
    [4, 5, 3, 2, 1],
    [5, 4, 3, 2, 1],
  ],
};
