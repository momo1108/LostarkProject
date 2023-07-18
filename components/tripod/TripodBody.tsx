import TripodSearchContainer from "@/containers/tripod/TripodSearchContainer";
import styles from "@/styles/tripod/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";

export default function TripodBody() {
  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <TripodSearchContainer />
      {/* <TripodResultContainer
      /> */}
    </div>
  );
}
