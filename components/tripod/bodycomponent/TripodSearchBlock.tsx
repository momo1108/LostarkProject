import ApiKeyInput from "@/components/ApiKeyInput";
import { Meteor, TriangleSpinner } from "@/components/icons/Index";
import TripodContext from "@/contexts/TripodContext";
import useApiTagParser from "@/hooks/useApiTagParser";
import styles from "@/styles/tripod/Body.module.scss";
import { classDetailMap, classImageMap } from "@/types/GlobalType";
import { ParsedFilteredSkillType } from "@/types/TripodType";
import { useContext } from "react";

const TripodSearchBlock: React.FC = () => {
  const {
    rootClassList,
    rootClass,
    setRootClass,
    subClass,
    setSubClass,
    tripodData,
    selectedIndex,
    selectedData,
    loadingTripod,
    selectingTripod,
    selectSkill,
  } = useContext(TripodContext);
  const { parseApiDataToHtmlString: parse } = useApiTagParser();

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
                    disabled={loadingTripod}
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
                    disabled={loadingTripod}
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
      <div className={styles.settingSkillsetDiv}>
        {loadingTripod ? (
          <div className={styles.loadingTripodDiv}>
            <TriangleSpinner className={styles.loadingSvg} />
            <p className={styles.loadingP}>트라이포드 정보를 로딩중입니다.</p>
          </div>
        ) : (
          <div className={`${styles.selectingSkillDiv} hideScroll`}>
            <h3 className={styles.skillsDivHeader}>
              <p className={styles.headerP}>
                <span className={styles.classSpan}>클래스({subClass})</span> -
                스킬 선택 ({" "}
                {selectedIndex.reduce(
                  (prev: number, cur: boolean) => prev + (cur ? 1 : 0),
                  0
                )}{" "}
                / {tripodData.length} )
              </p>
            </h3>
            {tripodData.length ? (
              <div className={`${styles.skillsDiv} hideScroll`}>
                {tripodData.map(
                  (data: ParsedFilteredSkillType, index: number) => {
                    return (
                      <button
                        className={`${styles.skillBtn} ${
                          selectedIndex[index]
                            ? styles.selected
                            : styles.notSelected
                        }`}
                        key={`${subClass}_skill_${data.Name}`}
                        onClick={() => {
                          selectSkill(index);
                        }}
                        disabled={selectingTripod}
                      >
                        <div className={styles.iconDiv}>
                          <img src={data.Icon} alt="" />
                        </div>
                        <p className={styles.nameP}>{data.Name}</p>
                      </button>
                    );
                  }
                )}
              </div>
            ) : (
              <div className={styles.emptySkillDiv}>
                <Meteor size={250} fill="#422" />
                <p>클래스 "{subClass}" 의 스킬정보를 불러오지 못했습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.settingTripodDiv}>
        <div className={`${styles.selectedSkillsDiv} hideScroll`}>
          <div className={styles.gridDiv}>
            {selectedData.map((e: ParsedFilteredSkillType) => {
              return (
                <button
                  className={styles.selectSkillBtn}
                  key={`selectedSkill_${e.Name}`}
                >
                  <div className={styles.skillIconDiv}>
                    <img className={styles.skillIcon} src={e.Icon} alt="스킬" />
                  </div>
                  <div className={styles.skillDescrDiv}>
                    <p className={styles.typeP}>
                      {parse(e.Tooltip.Element_001.value.name)}
                    </p>
                    <p className={styles.nameP}>{e.Name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className={styles.selectedSkillTripodDiv}>
          {/* img에 filter: grayscale(1.0) 으로 흑백전환 */}
        </div>
      </div>
    </div>
  );
};

export default TripodSearchBlock;
