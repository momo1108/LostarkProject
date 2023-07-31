import ApiKeyInput from "@/components/ApiKeyInput";
import { Meteor, TriangleSpinner } from "@/components/icons/Index";
import TripodContext from "@/contexts/TripodContext";
import useApiTagParser from "@/hooks/useApiTagParser";
import styles from "@/styles/tripod/Body.module.scss";
import { classDetailMap, classImageMap } from "@/types/GlobalType";
import {
  FilteredTripodType,
  ParsedFilteredSkillType,
} from "@/types/TripodType";
import Image from "next/image";
import { Fragment, useContext } from "react";

const TripodSearchBlock: React.FC = () => {
  const {
    rootClassList,
    rootClass,
    setRootClass,
    subClass,
    setSubClass,
    tripodData,
    selectedSkills,
    selectedData,
    loadingSkillset,
    selectingTripod,
    selectSkill,
    selectedSkillIndex,
    setSelectedSkillIndex,
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
                      if (loadingSkillset) {
                        alert(
                          "이미 다른 클래스의 정보를 검색 중입니다.\n검색이 완료된 후 다시 시도해주세요."
                        );
                        return;
                      }
                      setRootClass(rc);
                      setSubClass(classDetailMap[rc][0]);
                    }}
                    disabled={loadingSkillset}
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
                      if (loadingSkillset) {
                        alert(
                          "이미 다른 클래스의 정보를 검색 중입니다.\n검색이 완료된 후 다시 시도해주세요."
                        );
                        return;
                      }
                      setSubClass(sc);
                    }}
                    disabled={loadingSkillset}
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
        {loadingSkillset ? (
          <div className={styles.loadingSkillsetDiv}>
            <TriangleSpinner className={styles.loadingSvg} />
            <p className={styles.loadingP}>트라이포드 정보를 로딩중입니다.</p>
          </div>
        ) : (
          <div className={`${styles.selectingSkillDiv} hideScroll`}>
            <h3 className={styles.skillsDivHeader}>
              <p className={styles.headerP}>
                <span className={styles.classSpan}>클래스({subClass})</span> -
                스킬 선택 ({" "}
                {selectedSkills.reduce(
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
                          selectedSkills[index]
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
                <Meteor size={250} fill="#222" />
                <p>클래스 "{subClass}" 의 스킬정보를 불러오지 못했습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.settingTripodDiv}>
        <div className={styles.settingWrapper}>
          <div className={styles.settingHeader}>
            <p>트라이포드 세팅</p>
            <p>
              설정한 스킬 <span className={styles.numSpan}>1</span> /{" "}
              <span className={styles.numSpan}>{selectedData.length}</span>
            </p>
          </div>
          <div className={styles.settingBody}>
            <div className={`${styles.selectedSkillsDiv} hideScroll`}>
              <div className={styles.gridDiv}>
                {selectedData.map(
                  (e: ParsedFilteredSkillType, index: number) => {
                    return (
                      <button
                        className={styles.selectSkillBtn}
                        key={`selectedSkill_${e.Name}`}
                        onClick={() => {
                          setSelectedSkillIndex(index);
                        }}
                      >
                        <div className={styles.skillIconDiv}>
                          <img
                            className={styles.skillIcon}
                            src={e.Icon}
                            alt="스킬"
                          />
                        </div>
                        <div className={styles.skillDescrDiv}>
                          <p className={styles.typeP}>
                            {parse(e.Tooltip.Element_001.value.name)}
                          </p>
                          <p className={styles.nameP}>{e.Name}</p>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
            <div className={styles.selectedSkillTripodDiv}>
              {/* img에 filter: grayscale(1.0) 으로 흑백전환 */}
              {selectedData.length ? (
                <div className={styles.tripodContentDiv}>
                  <p className={styles.tripodHeader}>
                    {selectedData[selectedSkillIndex].Name}
                  </p>
                  {[0, 1, 2].map((tier) => (
                    <Fragment key={`tripod_tier${tier}`}>
                      <div className={styles.headerLine} data-tier={tier}>
                        <hr />
                        <hr />
                      </div>
                      <div className={styles.tripodTierContentDiv}>
                        {selectedData[selectedSkillIndex].Tripods.filter(
                          (tp: FilteredTripodType) => tp.Tier === tier
                        ).map((tp: FilteredTripodType, index: number) => {
                          return (
                            <div
                              className={styles.singleTripodDiv}
                              key={`tripod_tier${tier}_${index}`}
                            >
                              <div className={styles.iconDiv}>
                                <Image
                                  width={0}
                                  height={0}
                                  src={tp.Icon}
                                  alt=""
                                  placeholder="blur"
                                  blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8awwAAfMBEp+j3nwAAAAASUVORK5CYII="
                                  unoptimized
                                />
                              </div>
                              <p>{tp.Name}</p>
                            </div>
                          );
                        })}
                      </div>
                    </Fragment>
                  ))}
                </div>
              ) : (
                <div>스킬을 선택해주세요.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripodSearchBlock;
