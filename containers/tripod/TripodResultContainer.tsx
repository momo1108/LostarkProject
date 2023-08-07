import TripodResultBlock from "@/components/tripod/bodycomponent/TripodResultBlock";
import TripodResultContext from "@/contexts/TripodResultContext";
import { TripodPageStatus, TripodResType } from "@/types/TripodType";
import { useState, useEffect, useCallback, useMemo, useContext } from "react";

type TripodResultContainerProps = {
  responseData: TripodResType[];
  pageStatus: TripodPageStatus;
};
const TripodResultContainer: React.FC<TripodResultContainerProps> = ({
  responseData,
  pageStatus,
}) => {
  return (
    <TripodResultContext.Provider value={{ responseData, pageStatus }}>
      <TripodResultBlock />
    </TripodResultContext.Provider>
  );
};

export default TripodResultContainer;
