import ApiKeyInput from "@/components/ApiKeyInput";
import TripodContext from "@/contexts/TripodContext";
import styles from "@/styles/tripod/Body.module.scss";
import { classDetailMap } from "@/types/GlobalType";
import { useContext, useEffect } from "react";

const TripodSearchBlock: React.FC = () => {
  const { rootClassList, rootClass, setRootClass, subClass, setSubClass } =
    useContext(TripodContext);
  return (
    <div className={styles.searchContainer}>
      <ApiKeyInput shine={false} />
      <div className={styles.settingClassDiv}>
        <div className={styles.classWrapper}>
          <h4 className={styles.rootClassSmallTitle}>상위 클래스</h4>
          <h4 className={styles.rootClassLargeTitle}>상위 클래스</h4>
          <ul className={styles.rootClassList}>
            {rootClassList.map((rc: string) => {
              return (
                <li className={styles.rootClassItem}>
                  <button
                    className={`${styles.rootClassBtn} ${
                      rootClass === rc ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setRootClass(rc);
                      setSubClass(classDetailMap[rc][0]);
                    }}
                  >
                    {rc}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.classWrapper}>
          <h4 className={styles.subClassSmallTitle}>하위 클래스</h4>
          <h4 className={styles.subClassLargeTitle}>하위 클래스</h4>
          <ul className={styles.subClassList}>
            {classDetailMap[rootClass].map((sc: string) => {
              return (
                <li className={styles.subClassItem}>
                  <button
                    className={`${styles.subClassBtn} ${
                      subClass === sc ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setSubClass(sc);
                    }}
                  >
                    {sc}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={styles.settingTripodDiv}></div>
    </div>
  );
};

export default TripodSearchBlock;
