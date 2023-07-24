import TripodSearchContainer from "@/containers/tripod/TripodSearchContainer";
import styles from "@/styles/tripod/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import { FilteredSkillType } from "@/types/TripodType";

type test = {
  classSkillsetData: FilteredSkillType[];
};
const TripodBody: React.FC<test> = ({ classSkillsetData }) => {
  // console.log(classSkillsetData);
  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <TripodSearchContainer />
      {/* <TripodResultContainer
      /> */}
    </div>
  );
};

export default TripodBody;
