import {
  ButtonDivStatus,
  TotalStatus,
  TripodPageStatus,
  TripodResType,
} from "@/types/TripodType";
import { createContext } from "react";

type TripodResultContextType = {
  responseData: TripodResType[];
  pageStatus: TripodPageStatus;
  currentCase: number;
  totalCases: number;
  myTimer: number;
  buttonDivStatus: ButtonDivStatus;
  totalStatus: TotalStatus;
};
const TripodResultContext = createContext<TripodResultContextType>({
  responseData: [],
  pageStatus: "INIT",
  currentCase: 0,
  totalCases: 1,
  myTimer: 0,
  buttonDivStatus: "AVAILABLE",
  totalStatus: "Exclude",
});

export default TripodResultContext;
