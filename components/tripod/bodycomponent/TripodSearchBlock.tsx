import ApiKeyInput from "@/components/ApiKeyInput";
import {
  Copy,
  MenuIcons,
  Meteor,
  TriangleSpinner,
  Tripod,
} from "@/components/icons/Index";
import TripodCopyModal from "@/components/modal/TripodCopyModal";
import TripodSearchContext from "@/contexts/TripodSearchContext";
import { parseApiDataToHtmlString as parse } from "@/utils/apiParseUtils";
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
    apiShine,
    copyModalIsOpen,
    setCopyModalIsOpen,
    rootClassList,
    rootClass,
    setRootClass,
    subClass,
    setSubClass,
    tripodData,
    selectedSkills,
    selectedData,
    selectedSkillIndex,
    setSelectedSkillIndex,
    selectSkill,
    selectTripod,
    resetSelectedSkills,
    resetAllTripods,
    resetSelectedTripod,
    minimizeSelector,
    setMinimizeSelector,
    searchTripod,
    pageStatus,
  } = useContext(TripodSearchContext);

  return (
    <div className={styles.searchContainer}>
      <ApiKeyInput />
      <TripodCopyModal
        isOpen={copyModalIsOpen}
        closeFunc={() => {
          setCopyModalIsOpen(false);
        }}
        data=""
      />
      <div className={styles.copySettingDiv}>
        <button
          className={`${styles.copyButton} myButtons`}
          onClick={() => {
            setCopyModalIsOpen(true);
          }}
        >
          <Copy size={20} fill="#eee" />
          <span>캐릭터 세팅 복사</span>
        </button>
      </div>
      <div className={styles.settingClassDiv}>
        <div className={styles.classWrapper}>
          <h4 className={styles.rootClassSmallTitle}>상위 클래스</h4>
          <h4 className={styles.rootClassLargeTitle}>상위 클래스</h4>
          <ul className={styles.rootClassList}>
            {rootClassList.map((rc: string) => {
              return (
                <li key={`rootClass_${rc}`} className={styles.rootClassItem}>
                  <button
                    className={`${styles.rootClassButton} ${
                      rootClass === rc ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setRootClass(rc);
                      setSubClass(classDetailMap[rc][0]);
                    }}
                    disabled={pageStatus !== "DONE"}
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
                    className={`${styles.subClassButton} ${
                      subClass === sc ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setSubClass(sc);
                    }}
                    disabled={pageStatus !== "DONE"}
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
        {pageStatus === "LOADING_SKILL" ? (
          <div className={styles.loadingSkillsetDiv}>
            <TriangleSpinner className="triangleSpinner" />
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
                className={`myButtons ${styles.resetButton}`}
                onClick={resetSelectedSkills}
                disabled={pageStatus !== "DONE"}
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
                        className={`${styles.skillButton} ${
                          selectedSkills[index]
                            ? styles.selected
                            : styles.notSelected
                        }`}
                        key={`${subClass}_skill_${data.Name}`}
                        onClick={() => {
                          selectSkill(index);
                        }}
                        disabled={pageStatus !== "DONE"}
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
        <div
          className={styles.settingWrapper}
          data-minimize={minimizeSelector}
          data-selected={selectedData.length >= 1}
        >
          <div className={styles.settingHeader}>
            <p>
              선택한 스킬{" "}
              <span className={styles.numSpan}>{selectedData.length}</span> /{" "}
              <span className={styles.numSpan}>{tripodData.length}</span>
            </p>
            <div className={styles.buttonDiv}>
              <button
                className={`myButtons ${styles.resetButton}`}
                onClick={resetAllTripods}
                disabled={pageStatus !== "DONE"}
              >
                전체 스킬 초기화
              </button>
              <button
                className={`myButtons ${styles.resetButton}`}
                onClick={resetSelectedTripod}
                disabled={pageStatus !== "DONE"}
              >
                현재 스킬 초기화
              </button>
              <button
                className={`myButtons ${styles.minimizeButton}`}
                onClick={() => {
                  setMinimizeSelector((e: boolean) => !e);
                }}
              >
                {minimizeSelector ? "+" : "―"}
              </button>
            </div>
          </div>
          <div className={styles.settingBody}>
            <h4 className={styles.settingTitle}>스킬 선택</h4>
            <div className={`${styles.selectedSkillsDiv} hideScroll`}>
              {selectedData.length ? (
                <div className={styles.gridDiv}>
                  {selectedData.map(
                    (e: ParsedFilteredSkillType, index: number) => {
                      return (
                        <button
                          className={`${styles.selectSkillButton} ${
                            index === selectedSkillIndex ? styles.selected : ""
                          }`}
                          key={`selectedSkill_${e.Name}`}
                          onClick={() => {
                            setSelectedSkillIndex(index);
                          }}
                        >
                          <div
                            data-selected={index === selectedSkillIndex}
                            className={styles.skillIconDiv}
                          >
                            <img
                              className={styles.skillIcon}
                              src={e.Icon}
                              alt="스킬"
                            />
                            <p className={styles.nameP}>{e.Name}</p>
                            <div className={styles.previewDiv}>
                              <Tripod size={14} />
                              {e.Tripods.filter((tp) => tp.IsSelected).map(
                                (tp) => (
                                  <span
                                    className={`${styles.levelSpan} ${
                                      tripodTierToStyleMap.color[tp.Tier]
                                    }`}
                                    key={`preview_${e.Name}_${tp.Name}_small`}
                                  >
                                    {tp.Upgradable ? tp.Level : 1}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                          <div className={styles.skillDescrDiv}>
                            <div className={styles.typeDiv}>
                              <p className={styles.typeP}>
                                {parse(e.Tooltip.Element_001.value.name)}
                              </p>
                              <div className={styles.previewDiv}>
                                <Tripod size={14} />
                                {e.Tripods.filter((tp) => tp.IsSelected).map(
                                  (tp) => (
                                    <span
                                      className={`${styles.levelSpan} ${
                                        tripodTierToStyleMap.color[tp.Tier]
                                      }`}
                                      key={`preview_${e.Name}_${tp.Name}`}
                                    >
                                      {tp.Upgradable ? tp.Level : 1}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                            <p className={styles.nameP}>{e.Name}</p>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className={styles.emptySkillDiv}>
                  <Meteor className={styles.icon} fill="#222" />
                  <p className={styles.messageP}>스킬을 선택해주세요</p>
                </div>
              )}
            </div>
            <h4 className={styles.settingTitle}>트라이포드 선택</h4>
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
                              className={styles.singleTripodButton}
                              key={`tripod_tier${tier}_${index}`}
                              onClick={() => {
                                selectTripod(tier, tp.Name, 0);
                              }}
                              disabled={pageStatus !== "DONE"}
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
                                className={`${styles.nameP} ${
                                  tp.IsSelected
                                    ? tripodTierToStyleMap.color[tier]
                                    : ""
                                }`}
                              >
                                {tp.Name}
                              </p>
                              {tp.Upgradable ? (
                                <div className={styles.upgradableDiv}>
                                  <div
                                    tabIndex={0}
                                    data-active={tp.Level === 4}
                                    className={`${styles.levelButton} ${
                                      tp.IsSelected
                                        ? `${tripodTierToStyleMap.color[tier]} ${tripodTierToStyleMap.border[tier]}`
                                        : "border-[#333]"
                                    } ${
                                      tp.IsSelected && tp.Level === 4
                                        ? tripodTierToStyleMap.backgroundLinear[
                                            tier
                                          ]
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      if (pageStatus !== "DONE") return;
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
                                    className={`${styles.levelButton} ${
                                      tp.IsSelected
                                        ? `${tripodTierToStyleMap.color[tier]} ${tripodTierToStyleMap.border[tier]}`
                                        : "border-[#333]"
                                    } ${
                                      tp.IsSelected && tp.Level === 5
                                        ? tripodTierToStyleMap.backgroundLinear[
                                            tier
                                          ]
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      if (pageStatus !== "DONE") return;
                                      e.stopPropagation();
                                      selectTripod(tier, tp.Name, 5);
                                    }}
                                  >
                                    Lv. 5
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.unupgradableDiv}>
                                  Lv. 1
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
                <div className={styles.emptyTripodDiv}>
                  <MenuIcons className={styles.icon} type={2} />
                  <p className={styles.messageP}>스킬을 선택해주세요</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.searchDiv}>
          <button
            className={styles.searchButton}
            onClick={searchTripod}
            disabled={pageStatus !== "DONE"}
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripodSearchBlock;
