import ApiKeyInput from "@/components/ApiKeyInput";
import { TriangleSpinner } from "@/components/icons/Index";
import TripodContext from "@/contexts/TripodContext";
import styles from "@/styles/tripod/Body.module.scss";
import { classDetailMap, classImageMap } from "@/types/GlobalType";
import { FilteredSkillType } from "@/types/TripodType";
import { useContext } from "react";

const TripodSearchBlock: React.FC = () => {
  const {
    rootClassList,
    rootClass,
    setRootClass,
    subClass,
    setSubClass,
    tripodData,
    loadingTripod,
  } = useContext(TripodContext);

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
                      if (loadingTripod) {
                        alert(
                          "이미 다른 클래스의 정보를 검색 중입니다.\n검색이 완료된 후 다시 시도해주세요."
                        );
                        return;
                      }
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
                      if (loadingTripod) {
                        alert(
                          "이미 다른 클래스의 정보를 검색 중입니다.\n검색이 완료된 후 다시 시도해주세요."
                        );
                        return;
                      }
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
      <div className={styles.settingTripodDiv}>
        {loadingTripod ? (
          <div className={styles.loadingTripodDiv}>
            <TriangleSpinner className={styles.loadingSvg} />
            <p className={styles.loadingP}>트라이포드 정보를 로딩중입니다.</p>
          </div>
        ) : (
          <div className={styles.skillsDiv}>
            <h3 className={styles.skillsDivHeader}>
              <span className={styles.classSpan}>클래스({subClass})</span> -
              스킬 선택
            </h3>
            {tripodData.map((data: FilteredSkillType) => {
              return (
                <button
                  className={styles.skillBtn}
                  key={`${subClass}_skill_${data.Name}`}
                >
                  <div className={styles.iconDiv}>
                    <img src={data.Icon} alt="" />
                  </div>
                  <p className={styles.nameP}>{data.Name}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripodSearchBlock;
