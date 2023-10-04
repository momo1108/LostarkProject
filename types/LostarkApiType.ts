export type ArmoryProfileType = {
  CharacterImage: string;
  ExpeditionLevel: number;
  PvpGradeName: string;
  TownLevel: number;
  default: null;
  TownName: string;
  Title: string;
  GuildMemberGrade: string;
  GuildName: string;
  UsingSkillPoint: number;
  TotalSkillPoint: number;
  Stats: Stat[];
  Tendencies: Tendency[];
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
};

export type ArmoryEquipmentType = {
  Grade: string;
  Icon: string;
  Name: string;
  Tooltip: string;
  Type: string;
};

export type ArmoryEngravingType = {
  Effects: EngravingEffectType[];
  Engravings: EngravingType[];
};

export type EngravingEffectType = {
  Description: string;
  Icon: string;
  Name: string;
};

export type EngravingType = {
  Slot: number;
  Name: string;
  Icon: string;
  Tooltip: any;
};

export type Stat = {
  Type: string;
  Value: string;
  Tooltip: string[];
};

export type Tendency = {
  Type: string;
  Point: number;
  MaxPoint: number;
};

export type AuctionItemSearchReq = {
  CategoryCode?: number;
  EtcOptions?: EtcOption[];
  ItemGrade?: string;
  ItemGradeQuality?: number;
  ItemTier?: number;
  PageNo?: number;
  Sort?: Sort;
  SortCondition?: SortCondition;
  SkillOptions?: {
    FirstOption?: number;
    SecondOption?: number;
    MinValue?: number;
    MaxValue?: number;
  }[];
  CharacterClass?: string;
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
