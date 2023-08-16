import {
  ButtonDivStatus,
  TotalStatus,
  TripodPageStatus,
  TripodResType,
} from "@/types/TripodType";
import { Dispatch, SetStateAction, createContext } from "react";

type TripodResultContextType = {
  responseData: TripodResType[];
  pageStatus: TripodPageStatus;
  currentCase: number;
  totalCases: number;
  myTimer: number;
  buttonDivStatus: ButtonDivStatus;
  setButtonDivStatus: Dispatch<SetStateAction<ButtonDivStatus>>;
  totalStatus: TotalStatus;
  totalCost: number;
  currentSkillTripodIndex: [number, number];
  setCurrentSkillTripodIndex: Dispatch<SetStateAction<[number, number]>>;
  copyName: (type: string, name: string) => void;
  includePowderCost: boolean;
};
const TripodResultContext = createContext<TripodResultContextType>({
  responseData: [],
  pageStatus: "INIT",
  currentCase: 0,
  totalCases: 1,
  myTimer: 0,
  buttonDivStatus: "AVAILABLE",
  setButtonDivStatus: () => {},
  totalStatus: "Exclude",
  totalCost: 0,
  currentSkillTripodIndex: [0, 0],
  setCurrentSkillTripodIndex: () => {},
  copyName: () => {},
  includePowderCost: false,
});

export default TripodResultContext;
