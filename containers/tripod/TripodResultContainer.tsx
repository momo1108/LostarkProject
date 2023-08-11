import TripodResultBlock from "@/components/tripod/bodycomponent/TripodResultBlock";
import TripodResultContext from "@/contexts/TripodResultContext";
import {
  ButtonDivStatus,
  TotalStatus,
  TripodPageStatus,
  TripodResType,
} from "@/types/TripodType";
import { useState, useEffect, useCallback, useMemo, useContext } from "react";

type TripodResultContainerProps = {
  responseData: TripodResType[];
  pageStatus: TripodPageStatus;
  currentCase: number;
  totalCases: number;
  myTimer: number;
};
const TripodResultContainer: React.FC<TripodResultContainerProps> = ({
  responseData,
  pageStatus,
  currentCase,
  totalCases,
  myTimer,
}) => {
  const [usePowder, setUsePowder] = useState<boolean>(false);
  const [includePowderCost, setIncludePowderCost] = useState<boolean>(false);
  const [buttonDivStatus, setButtonDivStatus] =
    useState<ButtonDivStatus>("AVAILABLE");
  const [currentSkillTripodIndex, setCurrentSkillTripodIndex] = useState<
    [number, number]
  >([0, 0]);

  // onclick event로 state를 setting으로 변경 -> flag를 반대로 setting -> state가 available로 변경
  useEffect(() => {
    // console.log(buttonDivStatus);
    if (buttonDivStatus === "SETTING_USAGE") setUsePowder((e) => !e);
    else if (buttonDivStatus === "SETTING_COST")
      setIncludePowderCost((e) => !e);
  }, [buttonDivStatus]);
  useEffect(() => {
    setButtonDivStatus("AVAILABLE");
  }, [usePowder, includePowderCost]);

  const totalStatus: TotalStatus = useMemo(() => {
    if (usePowder) {
      return includePowderCost ? "IncludeWithCost" : "IncludeWithoutCost";
    } else return "Exclude";
  }, [usePowder, includePowderCost]);

  const totalCost: number = useMemo(() => {
    return responseData.reduce(
      (skillCost: number, curSkill) =>
        skillCost +
        curSkill.Tripods.reduce(
          (tripodCost: number, curTripod) =>
            tripodCost + (curTripod ? curTripod.Price.Total[totalStatus] : 0),
          0
        ),
      0
    );
  }, [responseData, totalStatus]);

  return (
    <TripodResultContext.Provider
      value={{
        responseData,
        pageStatus,
        currentCase,
        totalCases,
        myTimer,
        buttonDivStatus,
        setButtonDivStatus,
        totalStatus,
        totalCost,
        currentSkillTripodIndex,
        setCurrentSkillTripodIndex,
      }}
    >
      <TripodResultBlock />
    </TripodResultContext.Provider>
  );
};

export default TripodResultContainer;
