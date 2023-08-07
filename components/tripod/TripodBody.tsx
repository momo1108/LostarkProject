import TripodResultContainer from "@/containers/tripod/TripodResultContainer";
import TripodSearchContainer from "@/containers/tripod/TripodSearchContainer";
import styles from "@/styles/tripod/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import {
  FilteredSkillType,
  TripodPageStatus,
  TripodResType,
} from "@/types/TripodType";
import { useState } from "react";

const TripodBody: React.FC = () => {
  const [responseData, setResponseData] = useState<TripodResType[]>([]);
  const [pageStatus, setPageStatus] = useState<TripodPageStatus>("INIT");
  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <TripodSearchContainer
        {...{ setResponseData, pageStatus, setPageStatus }}
      />
      <TripodResultContainer {...{ responseData, pageStatus }} />
    </div>
  );
};

export default TripodBody;
