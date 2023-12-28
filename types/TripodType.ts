import { Menu } from "./GlobalType";

export type TripodPageProps = {
  menu: Menu[];
};

export type TripodPageStatus =
  | "INIT"
  | "DONE"
  | "LOADING_SKILL"
  | "SELECTING_SKILL"
  | "SELECTING_TRIPOD"
  | "SEARCHING"
  | "BEFORE_COPY"
  | "COPYING";

export type ButtonDivStatus = "AVAILABLE" | "SETTING_USAGE" | "SETTING_COST";
export type TotalStatus = "IncludeWithCost" | "IncludeWithoutCost" | "Exclude";

export type TripodReqType = {
  FirstOption: number;
  SecondOption: number;
  MinValue: number;
  MaxValue: number;
};

export type TripodResType = {
  Name: string;
  Icon: string;
  Tripods: ({
    Name: string;
    Icon: string;
    Tier: number;
    Possibility: {
      Before: boolean;
      After: boolean;
    };
    Price: {
      All: number[];
      Total: {
        Exclude: number;
        IncludeWithCost: number;
        IncludeWithoutCost: number;
      };
    };
  } | null)[];
};

// Value : 트포 api 검색 코드
export type FilteredSkillType = {
  Icon: string;
  Name: string;
  Value: number;
  Tripods: FilteredTripodType[];
  Tooltip: string;
};

export type ParsedFilteredSkillType = {
  Icon: string;
  Name: string;
  Value: number;
  Tripods: FilteredTripodType[];
  Tooltip: any;
};

export type FilteredTripodType = {
  Tier: number;
  Slot: number;
  Name: string;
  Icon: string;
  Value: number;
  IsSelected: boolean;
  Tooltip: string;
  Upgradable: boolean;
  Level: number;
};

/**
 * original skill type from Lostark OpenAPI
 */
export type SkillType = {
  Icon: string;
  IsAwakening: boolean;
  Level: number;
  Name: string;
  Rune: RuneType | null;
  Tripods: TripodType[];
  Tooltip: string;
  UsedTripods?: any[];
  Gems?: any[];
};

/**
 * original Rune type from Lostark OpenAPI
 */
export type RuneType = {
  Grade: string;
  Icon: string;
  Name: string;
  Tooltip: string;
};

/**
 * original Tripod type from Lostark OpenAPI
 */
export type TripodType = {
  Tier: number;
  Slot: number;
  Name: string;
  Icon: string;
  Level: number;
  IsSelected: boolean;
  Tooltip: string;
  Upgradable?: boolean;
};

export type tripodDataType = {
  버서커: FilteredSkillType;
  워로드: FilteredSkillType;
  디스트로이어: FilteredSkillType;
  홀리나이트: FilteredSkillType;
  슬레이어: FilteredSkillType;
  기공사: FilteredSkillType;
  배틀마스터: FilteredSkillType;
  인파이터: FilteredSkillType;
  창술사: FilteredSkillType;
  스트라이커: FilteredSkillType;
  데빌헌터: FilteredSkillType;
  블래스터: FilteredSkillType;
  스카우터: FilteredSkillType;
  호크아이: FilteredSkillType;
  건슬링어: FilteredSkillType;
  바드: FilteredSkillType;
  서머너: FilteredSkillType;
  소서리스: FilteredSkillType;
  아르카나: FilteredSkillType;
  데모닉: FilteredSkillType;
  리퍼: FilteredSkillType;
  블레이드: FilteredSkillType;
  소울이터: FilteredSkillType;
  기상술사: FilteredSkillType;
  도화가: FilteredSkillType;
};

export const tripodTierToStyleMap: {
  [key: string]: { [key: number]: string };
} = {
  color: {
    0: "tier1Color",
    1: "tier2Color",
    2: "tier3Color",
  },
  border: {
    0: "tier1Border",
    1: "tier2Border",
    2: "tier3Border",
  },
  backgroundLinear: {
    0: "tier1BackgroundLinear",
    1: "tier2BackgroundLinear",
    2: "tier3BackgroundLinear",
  },
  background: {
    0: "tier1Background",
    1: "tier2Background",
    2: "tier3Background",
  },
  stroke: {
    0: "tier1Stroke",
    1: "tier2Stroke",
    2: "tier3Stroke",
  },
  fill: {
    0: "tier1Fill",
    1: "tier2Fill",
    2: "tier3Fill",
  },
};

export const userList: { [key: string]: string[] } = {
  버서커: ["빈세로이", "버서커", "마스터Asia", "목연타"],
  워로드: ["한국", "국뽕박살러", "숯불바베큐치킨", "카아안"],
  디스트로이어: ["머리파괴장인", "살크업", "간즈"],
  홀리나이트: ["눕클", "근돼남", "인성터진범고래"],
  슬레이어: ["ZealSlayer", "마왕체나", "주노현디", "슬지우띠"],
  기공사: ["체나", "옴니머스", "격수", "초상"],
  배틀마스터: ["ZealsTwitch", "노돌리", "양지니", "필례"],
  인파이터: ["부먹펩시파인애플피자지코", "오구ZERO", "제로키나", "송희"],
  창술사: ["편지", "짹키창", "희네1", "하루노이"],
  스트라이커: ["항상그놈", "보라냥이집사8", "범군단장", "스커송형"],
  데빌헌터: ["괴물쥐", "교외오빠", "똘Ol", "화수"],
  블래스터: ["HBpencil", "상큼코끼리", "옛날딱지", "벵교수"],
  스카우터: ["추스", "오르티안", "엎어3호기", "애교머리장사장"],
  호크아이: ["이승건", "공룡", "꼬구마", "잼토"],
  건슬링어: ["티키케이", "에스더규팡맨", "뉴비", "레땅땅"],
  바드: ["성왕용", "응애애긔바드바드세요", "주다영", "아르데리나"],
  서머너: ["꺼억콩", "이거다내끄얏", "요정", "희히s0ng"],
  소서리스: ["원소술녀", "인사", "방울토마토라면", "땃쥐"],
  아르카나: ["킹쌈녀", "대머리의기초유전학", "toronge", "Rose아르"],
  데모닉: ["잔바스", "킴z", "림챌", "기술찡"],
  리퍼: ["설화희빈", "후탈", "펭또링", "포롱악마"],
  블레이드: ["그린대표", "쌍검", "에스더김우로", "휘린"],
  소울이터: ["금빛선짱", "죠니낫브", "낫뚜루휘뚜루마뚜루", "채상랑티브이"],
  기상술사: ["황득칠", "꽃비엘라", "뽀s0ng", "우비소녀체나"],
  도화가: ["도도", "도넛임당", "프레이Meyer", "베베초"],
  브레이커: ["모코코새싹브레이커", "이다", "보라냥이집사16", "Saintama"],
};
