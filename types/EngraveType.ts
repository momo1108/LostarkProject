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
  1: "rare",
  2: "epic",
  3: "legendary",
};
