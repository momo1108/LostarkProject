import ApiKeyInput from "@/components/ApiKeyInput";
import { Meteor, TriangleSpinner } from "@/components/icons/Index";
import TripodContext from "@/contexts/TripodContext";
import useApiTagParser from "@/hooks/useApiTagParser";
import styles from "@/styles/tripod/Body.module.scss";
import { classDetailMap, classImageMap } from "@/types/GlobalType";
import {
  FilteredTripodType,
  ParsedFilteredSkillType,
  tripodTierToStyleMap,
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
    selectingSkill,
    selectingTripod,
    selectedSkillIndex,
    setSelectedSkillIndex,
    selectSkill,
    selectTripod,
    resetSelectedSkills,
    resetAllTripods,
    resetSelectedTripod,
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
                      setRootClass(rc);
                      setSubClass(classDetailMap[rc][0]);
                    }}
                    disabled={loadingSkillset || selectingSkill}
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
                    disabled={loadingSkillset || selectingSkill}
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
                <span className={styles.classSpan}>
                  스킬목록 ( {subClass} )
                </span>
              </p>
              <button
                className={`myButtons ${styles.resetBtn}`}
                onClick={resetSelectedSkills}
                disabled={selectingSkill}
              >
                선택 초기화
              </button>
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
                        disabled={selectingSkill}
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
            <p>
              선택한 스킬{" "}
              <span className={styles.numSpan}>{selectedData.length}</span> /{" "}
              <span className={styles.numSpan}>{tripodData.length}</span>
            </p>
            <div className={styles.buttonDiv}>
              <button
                className={`myButtons ${styles.resetBtn}`}
                onClick={resetAllTripods}
                disabled={selectingSkill || selectingTripod}
              >
                전체 스킬 초기화
              </button>
              <button
                className={`myButtons ${styles.resetBtn}`}
                onClick={resetSelectedTripod}
                disabled={selectingSkill || selectingTripod}
              >
                현재 스킬 초기화
              </button>
            </div>
          </div>
          <div className={styles.settingBody}>
            <div className={`${styles.selectedSkillsDiv} hideScroll`}>
              <div className={styles.gridDiv}>
                {selectedData.map(
                  (e: ParsedFilteredSkillType, index: number) => {
                    return (
                      <button
                        className={`${styles.selectSkillBtn} ${
                          index === selectedSkillIndex ? styles.selected : ""
                        }`}
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
                            <button
                              className={styles.singleTripodBtn}
                              key={`tripod_tier${tier}_${index}`}
                              onClick={() => {
                                selectTripod(tier, tp.Name, 0);
                              }}
                              disabled={selectingTripod}
                            >
                              <div
                                className={styles.iconDiv}
                                data-selected={tp.IsSelected}
                                data-tier={tier}
                              >
                                <Image
                                  className={styles.tripodIcon}
                                  width={0}
                                  height={0}
                                  src={tp.Icon}
                                  alt=""
                                  placeholder="blur"
                                  blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8awwAAfMBEp+j3nwAAAAASUVORK5CYII="
                                  unoptimized
                                />
                              </div>
                              <p
                                className={
                                  tp.IsSelected
                                    ? tripodTierToStyleMap.color[tier]
                                    : ""
                                }
                              >
                                {tp.Name}
                              </p>
                              {tp.Upgradable ? (
                                <div className={styles.upgradableDiv}>
                                  <div
                                    tabIndex={0}
                                    data-active={tp.Level === 4}
                                    className={`${styles.levelBtn} ${
                                      tp.IsSelected
                                        ? `${tripodTierToStyleMap.color[tier]} ${tripodTierToStyleMap.border[tier]}`
                                        : "border-[#333]"
                                    } ${
                                      tp.IsSelected && tp.Level === 4
                                        ? tripodTierToStyleMap.background[tier]
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      if (selectingTripod) return;
                                      e.stopPropagation();
                                      selectTripod(tier, tp.Name, 4);
                                    }}
                                  >
                                    Lv. 4
                                  </div>
                                  <div
                                    tabIndex={0}
                                    data-active={
                                      tp.IsSelected && tp.Level === 5
                                    }
                                    className={`${styles.levelBtn} ${
                                      tp.IsSelected
                                        ? `${tripodTierToStyleMap.color[tier]} ${tripodTierToStyleMap.border[tier]}`
                                        : "border-[#333]"
                                    } ${
                                      tp.IsSelected && tp.Level === 5
                                        ? tripodTierToStyleMap.background[tier]
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      if (selectingTripod) return;
                                      e.stopPropagation();
                                      selectTripod(tier, tp.Name, 5);
                                    }}
                                  >
                                    Lv. 5
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.unupgradableDiv}>
                                  1렙트포
                                </div>
                              )}
                            </button>
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
