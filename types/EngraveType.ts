import { Dispatch, RefObject, SetStateAction } from "react";
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

export type AuctionItem = {
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

export type AuctionOption = {
  Type: string;
  OptionName: string;
  OptionNameTripod: string;
  Value: number;
  IsPenalty: boolean;
  ClassName: string | null;
};

export type MarketItemSearchReq = {
  Sort: Sort;
  CategoryCode: number;
  CharacterClass: string;
  ItemTier: number | null;
  ItemGrade: string;
  ItemName: string;
  PageNo: number;
  SortCondition: SortCondition;
};

export type MarketItemSearchResult = {
  PageNo: number;
  PageSize: number;
  TotalCount: number;
  Items: MarketItem[];
};

export type MarketItem = {
  Id: number;
  Name: string;
  Grade: string;
  Icon: string;
  BundleCount: number;
  TradeRemainCount: number;
  YDayAvgPrice: number;
  RecentPrice: number;
  CurrentMinPrice: number;
};

type Sort =
  | "BIDSTART_PRICE"
  | "BUY_PRICE"
  | "EXPIREDATE"
  | "ITEM_GRADE"
  | "ITEM_LEVEL"
  | "ITEM_QUALITY"
  | "GRADE"
  | "YDAY_AVG_PRICE"
  | "RECENT_PRICE"
  | "CURRENT_MIN_PRICE";

type SortCondition = "ASC" | "DESC";

export const engraveLevelColorMap: { [key: number]: string } = {
  0: "uncommon",
  1: "rare",
  2: "epic",
  3: "legendary",
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

// export type EngraveSearchBlockProps = {
//   setCombinationList: Dispatch<SetStateAction<AuctionItem[][]>>;
//   setPageStatus: Dispatch<SetStateAction<number>>;
//   dropdownMode: DropdownMode;
//   setDropdownMode: Dispatch<SetStateAction<DropdownMode>>;
//   saveSetting: () => void;
//   loadSetting: () => void;
//   preventBlur: boolean;
//   setPreventBlur: Dispatch<SetStateAction<boolean>>;
//   targetEngraveRef: RefObject<HTMLInputElement>;
//   searchValue: string;
//   setSearchValue: Dispatch<SetStateAction<string>>;
//   engraveSearchList: string[];
//   targetList: EngraveInfo[];
//   setTargetList: Dispatch<SetStateAction<EngraveInfo[]>>;
//   equipList: EngraveInfo[];
//   setEquipList: Dispatch<SetStateAction<EngraveInfo[]>>;
//   abilityList: EngraveInfo[];
//   setAbilityList: Dispatch<SetStateAction<EngraveInfo[]>>;
//   setTargetEngraveLevel: (i: number, level: number) => void;
//   setEquipEngraveLevel: (i: number, level: number) => void;
//   setAbilityEngravePoint: (i: number, point: number) => void;
//   setAbilityInput: (i: number, mode: AbilityInputMode) => void;
//   negativeEngrave: EngraveInfo;
//   setNegativeEngrave: Dispatch<SetStateAction<EngraveInfo>>;
//   setNegativeAbilityInput: (mode: AbilityInputMode) => void;
//   accessoryList: {
//     getter: AccessoryInfo[];
//     setter: Dispatch<SetStateAction<AccessoryInfo>>[];
//   };
//   searchSetting: () => Promise<void>;
//   currentCase: number;
//   totalCases: number;
//   myTimer: number;
//   progress: number;
//   check: (name: string, mode: CheckMode) => void;
// };
