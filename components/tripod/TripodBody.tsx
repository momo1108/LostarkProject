import TripodResultContainer from "@/containers/tripod/TripodResultContainer";
import TripodSearchContainer from "@/containers/tripod/TripodSearchContainer";
import styles from "@/styles/tripod/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import { FilteredSkillType, TripodResType } from "@/types/TripodType";
import { useState } from "react";

const TripodBody: React.FC = () => {
  const [reponseData, setResponseData] = useState<TripodResType[]>([]);
  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <TripodSearchContainer setResponseData={setResponseData} />
      <TripodResultContainer responseData={reponseData} />
    </div>
  );
};

export default TripodBody;
