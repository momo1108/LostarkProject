import ApiKeyInput from "@/components/ApiKeyInput";
import TripodContext from "@/contexts/TripodContext";
import styles from "@/styles/tripod/Body.module.scss";
import { classDetailMap, classImageMap } from "@/types/GlobalType";
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
                <li key={`rootClass_${rc}`} className={styles.rootClassItem}>
                  <button
                    className={`${styles.rootClassBtn} ${
                      rootClass === rc ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setRootClass(rc);
                      setSubClass(classDetailMap[rc][0]);
                    }}
                  >
                    <img
                      className={styles.rootClassImg}
                      src={`/images/${classImageMap[rc]}`}
                      alt=""
                    />
                    <p>{rc}</p>
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
                <li key={`subClass_${sc}`} className={styles.subClassItem}>
                  <button
                    className={`${styles.subClassBtn} ${
                      subClass === sc ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setSubClass(sc);
                    }}
                  >
                    <img
                      className={styles.subClassImg}
                      src={`/images/${classImageMap[sc]}`}
                      alt=""
                    />
                    <p>{sc}</p>
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
