import { ParsedFilteredSkillType, TripodPageStatus } from "@/types/TripodType";
import { createContext } from "react";
import { Dispatch, SetStateAction } from "react";

type TripodSearchContextType = {
  apiShine: boolean;
  copyModalIsOpen: boolean;
  setCopyModalIsOpen: Dispatch<SetStateAction<boolean>>;
  rootClassList: string[];
  rootClass: string;
  setRootClass: Dispatch<SetStateAction<string>>;
  subClass: string;
  setSubClass: Dispatch<SetStateAction<string>>;
  tripodData: ParsedFilteredSkillType[];
  selectedSkills: boolean[];
  selectedSkillIndex: number;
  setSelectedSkillIndex: Dispatch<SetStateAction<number>>;
  selectedData: ParsedFilteredSkillType[];
  selectSkill: (i: number) => void;
  selectTripod: (tier: number, name: string, level: number) => void;
  resetSelectedSkills: () => void;
  resetAllTripods: () => void;
  resetSelectedTripod: () => void;
  minimizeSelector: boolean;
  setMinimizeSelector: Dispatch<SetStateAction<boolean>>;
  searchTripod: () => Promise<void>;
  pageStatus: TripodPageStatus;
};

const TripodSearchContext = createContext<TripodSearchContextType>({
  apiShine: false,
  copyModalIsOpen: false,
  setCopyModalIsOpen: () => {},
  rootClassList: [],
  rootClass: "",
  setRootClass: () => {},
  subClass: "",
  setSubClass: () => {},
  tripodData: [],
  selectedSkills: [],
  selectedSkillIndex: 0,
  setSelectedSkillIndex: () => {},
  selectedData: [],
  selectSkill: () => {},
  selectTripod: () => {},
  resetSelectedSkills: () => {},
  resetAllTripods: () => {},
  resetSelectedTripod: () => {},
  minimizeSelector: false,
  setMinimizeSelector: () => {},
  searchTripod: async () => {},
  pageStatus: "INIT",
});

export default TripodSearchContext;
