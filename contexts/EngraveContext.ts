import {
  AbilityInputMode,
  AccessoryInfo,
  CheckMode,
  Combination,
  DropdownMode,
  EngraveInfo,
} from "@/types/EngraveType";
import { AuctionItem } from "@/types/LostarkApiType";
import { createContext } from "react";
import { Dispatch, SetStateAction, RefObject } from "react";

type EngraveContextType = {
  apiShine: boolean;
  negativeEngrave: EngraveInfo;
  setNegativeEngrave: Dispatch<SetStateAction<EngraveInfo>>;
  targetList: EngraveInfo[];
  setTargetList: Dispatch<SetStateAction<EngraveInfo[]>>;
  equipList: EngraveInfo[];
  setEquipList: Dispatch<SetStateAction<EngraveInfo[]>>;
  abilityList: EngraveInfo[];
  setAbilityList: Dispatch<SetStateAction<EngraveInfo[]>>;
  necklaceState: AccessoryInfo;
  setNecklaceState: Dispatch<SetStateAction<AccessoryInfo>>;
  earringState1: AccessoryInfo;
  setEarringState1: Dispatch<SetStateAction<AccessoryInfo>>;
  earringState2: AccessoryInfo;
  setEarringState2: Dispatch<SetStateAction<AccessoryInfo>>;
  ringState1: AccessoryInfo;
  setRingState1: Dispatch<SetStateAction<AccessoryInfo>>;
  ringState2: AccessoryInfo;
  setRingState2: Dispatch<SetStateAction<AccessoryInfo>>;
  answer: Combination[];
  tmp: number[][];
  tmp_info: { name: string; point: number }[];
  myWorker: any;
  setMyWorker: Dispatch<SetStateAction<any>>;
  usingWebWorker: [boolean, number];
  setUsingWebWorker: Dispatch<SetStateAction<[boolean, number]>>;
  accessoryList: {
    getter: AccessoryInfo[];
    setter: Dispatch<SetStateAction<AccessoryInfo>>[];
  };
  resultObject: {
    [key: number]: AuctionItem[];
  };
  statFilterValue: {
    [key: string]: number;
  };
  setStatFilterValue: Dispatch<
    SetStateAction<{
      [key: string]: number;
    }>
  >;
  otherFilterValue: {
    [key: string]: number;
  };
  setOtherFilterValue: Dispatch<
    SetStateAction<{
      [key: string]: number;
    }>
  >;
  saveModalIsOpen: boolean;
  setSaveModalIsOpen: Dispatch<SetStateAction<boolean>>;
  loadModalIsOpen: boolean;
  setLoadModalIsOpen: Dispatch<SetStateAction<boolean>>;
  dropdownMode: DropdownMode;
  setDropdownMode: Dispatch<SetStateAction<DropdownMode>>;
  dropdownSelector: number;
  setDropdownSelector: Dispatch<SetStateAction<number>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  preventBlur: boolean;
  setPreventBlur: Dispatch<SetStateAction<boolean>>;
  engraveSearchList: string[];
  targetEngraveRef: RefObject<HTMLInputElement>;
  dropdownRef: RefObject<HTMLUListElement>;
  check: (name: string, mode: CheckMode) => void;
  setTargetEngraveLevel: (i: number, level: number) => void;
  setEquipEngraveLevel: (i: number, level: number) => void;
  setAbilityEngravePoint: (i: number, point: number) => void;
  setAbilityInput: (i: number, mode: AbilityInputMode) => void;
  setNegativeAbilityInput: (mode: AbilityInputMode) => void;
  saveSetting: () => void;
  searchSetting: () => Promise<void>;
  pickTwo: (
    input: {
      name: string;
      point: number;
    }[],
    count: number,
    point_sum: number,
    need_count: number
  ) => void;
  applyFilter: () => void;
};
const EngraveContext = createContext<EngraveContextType>({
  apiShine: false,
  negativeEngrave: {
    name: "감소 효과 선택",
    point: 0,
    enableInput: false,
    inputValue: "0",
  },
  setNegativeEngrave: () => {},
  targetList: [],
  setTargetList: () => {},
  equipList: [],
  setEquipList: () => {},
  abilityList: [],
  setAbilityList: () => {},
  necklaceState: {
    type: 0,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  },
  setNecklaceState: () => {},
  earringState1: {
    type: 1,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  },
  setEarringState1: () => {},
  earringState2: {
    type: 1,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  },
  setEarringState2: () => {},
  ringState1: {
    type: 2,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  },
  setRingState1: () => {},
  ringState2: {
    type: 2,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  },
  setRingState2: () => {},
  answer: [],
  tmp: [],
  tmp_info: [],
  myWorker: null,
  setMyWorker: () => {},
  usingWebWorker: [false, 0],
  setUsingWebWorker: () => {},
  accessoryList: { getter: [], setter: [] },
  resultObject: {},
  statFilterValue: {},
  setStatFilterValue: () => {},
  otherFilterValue: {},
  setOtherFilterValue: () => {},
  saveModalIsOpen: false,
  setSaveModalIsOpen: () => {},
  loadModalIsOpen: false,
  setLoadModalIsOpen: () => {},
  dropdownMode: 3,
  setDropdownMode: () => {},
  dropdownSelector: 0,
  setDropdownSelector: () => {},
  searchValue: "",
  setSearchValue: () => {},
  preventBlur: false,
  setPreventBlur: () => {},
  engraveSearchList: [],
  targetEngraveRef: { current: null },
  dropdownRef: { current: null },
  check: () => {},
  setTargetEngraveLevel: () => {},
  setEquipEngraveLevel: () => {},
  setAbilityEngravePoint: () => {},
  setAbilityInput: () => {},
  setNegativeAbilityInput: () => {},
  saveSetting: () => {},
  searchSetting: async () => {},
  pickTwo: () => {},
  applyFilter: () => {},
});

export default EngraveContext;
