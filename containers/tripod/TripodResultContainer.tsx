import TripodResultBlock from "@/components/tripod/bodycomponent/TripodResultBlock";
import TripodResultContext from "@/contexts/TripodResultContext";
import { TripodResType } from "@/types/TripodType";
import { useState, useEffect, useCallback, useMemo, useContext } from "react";

type TripodResultContainerProps = {
  responseData: TripodResType[];
};
const TripodResultContainer: React.FC<TripodResultContainerProps> = ({
  responseData,
}) => {
  return (
    <TripodResultContext.Provider value={{ responseData }}>
      <TripodResultBlock />
    </TripodResultContext.Provider>
  );
};

export default TripodResultContainer;
