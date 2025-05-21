import MyLoader from "@/components/custom/MyLoader";
import {
  AlertOctagon,
  Empty,
  List,
  MagnifyingGlass,
  Loader,
  Tripod,
} from "@/components/icons/Index";
import TripodResultContext from "@/contexts/TripodResultContext";
import useAlert from "@/hooks/useAlert";
import useClipboard from "@/hooks/useClipboard";
import styles from "@/styles/tripod/Body.module.scss";
import { TripodResType, tripodTierToStyleMap } from "@/types/TripodType";
import { Fragment, useContext, useEffect } from "react";
import { Tooltip } from "react-tooltip";

const TripodResultBlock: React.FC = () => {
  const {
    responseData,
    pageStatus,
    currentCase,
    totalCases,
    myTimer,
    buttonDivStatus,
    setButtonDivStatus,
    totalStatus,
    includePowderCost,
    totalCost,
    currentSkillTripodIndex,
    setCurrentSkillTripodIndex,
  } = useContext(TripodResultContext);
  const alert = useAlert();
  const { copyToClipboard } = useClipboard();

  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultHeader}>
        <p className={styles.totalPriceP}>총 골드예측 : {totalCost}</p>
        <div className={styles.resultButtonDiv}>
          <p className={styles.powderP}>
            <img width={30} src="/images/powderofsage.png" alt="" />
            <span>현자의 가루</span>
          </p>
          <button
            className={`${styles.powderButton} myButtons`}
            data-active={totalStatus !== "Exclude"}
            disabled={buttonDivStatus !== "AVAILABLE"}
            onClick={() => {
              setButtonDivStatus("SETTING_USAGE");
            }}
          >
            사용
          </button>
          <button
            className={`${styles.powderButton} myButtons`}
            data-active={includePowderCost}
            disabled={buttonDivStatus !== "AVAILABLE"}
            onClick={() => {
              setButtonDivStatus("SETTING_COST");
            }}
          >
            비용 포함
          </button>
          {/* <button>페온 값 포함</button> */}
        </div>
      </div>
      <div className={styles.resultBody}>
        <div className={styles.resultDiv}>
          <div className={styles.infoDiv}>
            <AlertOctagon size={16} color="#f44" />
            <span>매물 부족</span>
          </div>
          <div data-role="header" className={styles.skillHeader}>
            스킬
          </div>
          <div data-role="header">트라이포드</div>
          <div data-role="header">골드예측</div>
          <div data-role="header" className={styles.priceListDiv}></div>
          <div className={styles.gapItem} />
          <div
            data-role="header"
            className={`${styles.skillHeader} ${styles.secondHeader}`}
          >
            스킬
          </div>
          <div data-role="header" className={styles.secondHeader}>
            트라이포드
          </div>
          <div data-role="header" className={styles.secondHeader}>
            골드예측
          </div>
          <div data-role="header" className={styles.secondHeader}>
            매물 가격
          </div>
          <div className={styles.headerLine} />
          <div className={styles.gapItem} />
          <div className={styles.headerLine} data-sub={true} />
          {responseData.length ? (
            responseData.map((skill: TripodResType, skillIndex) => (
              <Fragment key={`result_skill_${skill.Name}`}>
                <div
                  className={styles.skillDescrDiv}
                  onClick={() => {
                    copyToClipboard(
                      skill.Name,
                      `스킬 이름 (${skill.Name}) 복사 완료`,
                      `에러 발생 : 스킬 이름 (${skill.Name}) 복사 실패`
                    );
                  }}
                >
                  <div className={styles.iconWrapper}>
                    <img src={skill.Icon} alt="" />
                  </div>
                  <p>{skill.Name}</p>
                </div>
                <div className={styles.tripodWrapper}>
                  {skill.Tripods.map((tripod, tripodIndex) =>
                    tripod ? (
                      <div
                        className={styles.tripodDiv}
                        key={`result_skill_${skill.Name}_tripod_${tripod.Name}`}
                        onClick={() => {
                          copyToClipboard(
                            tripod.Name,
                            `트라이포드 이름 (${tripod.Name}) 복사 완료`,
                            `에러 발생 : 트라이포드 이름 (${tripod.Name}) 복사 실패`
                          );
                        }}
                      >
                        <div
                          className={styles.tripodDescrDiv}
                          data-tier={tripod.Tier}
                        >
                          <img
                            className={styles.tripodIcon}
                            src={tripod.Icon}
                            alt=""
                          />
                          <p
                            className={`${
                              tripodTierToStyleMap.color[tripod.Tier]
                            } ${styles.tripodP}`}
                          >
                            <span title={tripod.Name}>{tripod.Name}</span>
                            <AlertOctagon
                              className={
                                tripod.Possibility[
                                  totalStatus === "Exclude" ? "Before" : "After"
                                ]
                                  ? "hidden"
                                  : ""
                              }
                              size={20}
                              color="#f44"
                            />
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={styles.tripodDiv}
                        key={`result_skill_${skill.Name}_emptyTripod_${tripodIndex}`}
                      >
                        <div
                          className={styles.tripodDescrDiv}
                          data-tier={tripodIndex}
                        >
                          <Empty
                            className={`${styles.emptyIcon} ${tripodTierToStyleMap.stroke[tripodIndex]}`}
                            width={2}
                          />
                          <p
                            className={tripodTierToStyleMap.color[tripodIndex]}
                          >
                            티어{tripodIndex + 1}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className={styles.totalPriceWrapper}>
                  {skill.Tripods.map((tripod, tripodIndex) =>
                    tripod ? (
                      <div
                        className={styles.totalPriceDiv}
                        key={`result_skill_${skill.Name}_tripod_${tripod.Name}_totalPrice`}
                      >
                        <img src="/images/gold.png" width={15} alt="" />
                        <p className={styles.goldP}>
                          {tripod.Price.Total[totalStatus]}
                        </p>
                      </div>
                    ) : (
                      <div
                        key={`result_skill_${skill.Name}_tripod_${tripodIndex}_emptyTotalPrice`}
                      ></div>
                    )
                  )}
                </div>
                <div className={styles.priceListWrapper}>
                  {skill.Tripods.map((tripod, tripodIndex) =>
                    tripod ? (
                      <ul
                        className={styles.tripodPriceList}
                        key={`result_skill_${skill.Name}_tripod_${tripod.Name}_list`}
                      >
                        {tripod.Price.All.length ? (
                          tripod.Price.All.slice(0, 10).map((bp, bpIndex) => (
                            <li
                              className={styles.tripodPriceItem}
                              key={`result_skill_${skill.Name}_tripod_${tripod.Name}_${bpIndex}`}
                            >
                              <img src="/images/gold.png" width={15} alt="" />
                              <span>{bp}</span>
                            </li>
                          ))
                        ) : (
                          <li className={styles.tripodPriceItem}>
                            <span>매물 없음</span>
                          </li>
                        )}
                        <li
                          className={styles.tripodPriceViewer}
                          data-tooltip-id="tripodPriceSummary"
                          onMouseEnter={() => {
                            setCurrentSkillTripodIndex([
                              skillIndex,
                              tripodIndex,
                            ]);
                          }}
                        >
                          <List size={20} />
                          <span>확인</span>
                        </li>
                      </ul>
                    ) : (
                      <div
                        key={`result_skill_${skill.Name}_emptyTripod_${tripodIndex}`}
                      ></div>
                    )
                  )}
                </div>
                <div className={styles.boundary} />
                {skillIndex > 0 && skillIndex % 2 ? (
                  <Fragment>
                    <div className={styles.separatedBoundary} />
                    <div className={styles.gapItem} />
                    <div className={styles.separatedBoundary} />
                  </Fragment>
                ) : (
                  <></>
                )}
                {skillIndex % 2 ? (
                  <></>
                ) : (
                  <div className={styles.gapItem}></div>
                )}
              </Fragment>
            ))
          ) : (
            <div className={styles.emptyDiv}>
              <div className={styles.iconWrapper}>
                <MagnifyingGlass
                  className={styles.mgIcon}
                  size={200}
                  color="none"
                  fill="#ddd"
                />
              </div>
              <p>현재 검색된 결과가 없습니다</p>
            </div>
          )}
        </div>
        <MyLoader
          className={styles.resultLoader}
          backgroundColor="#000e"
          display={pageStatus === "SEARCHING" ? "flex" : "none"}
        >
          <div className={styles.loaderWrapper}>
            <Loader
              className={styles.loaderIcon}
              width={6}
              progress={currentCase / totalCases}
              color="#4691f6"
            />
            <div className={styles.resultLoaderContent}>
              <Tripod className={styles.tripodIcon} size={200} />
              <p className={styles.processP}>
                검색 현황 : ( {currentCase} / {totalCases} )
              </p>
              <p className={styles.messageP}>트라이포드 매물을 검색중입니다.</p>
            </div>
            {myTimer > 0 ? (
              <div className={styles.timeoutDiv}>
                <p>
                  로스트아크에서 제공하는 트라이포드 검색은 1분에 100회까지로
                  제한되어 있습니다.
                </p>
                <p>다음 검색을 위해 대기 후 다시 시작합니다.</p>
                <p className={styles.timerP}>남은 시간 : {myTimer}초</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </MyLoader>
      </div>
      <Tooltip
        id="tripodPriceSummary"
        className={styles.tripodPriceSummaryTooltip}
        place="right"
        clickable={true}
      >
        <ul className={styles.summaryList}>
          <li>가격목록</li>
          {responseData[currentSkillTripodIndex[0]]?.Tripods[
            currentSkillTripodIndex[1]
          ] ? (
            responseData[currentSkillTripodIndex[0]].Tripods[
              currentSkillTripodIndex[1]
            ]!.Price.All.length ? (
              responseData[currentSkillTripodIndex[0]].Tripods[
                currentSkillTripodIndex[1]
              ]!.Price.All.map((bp, bpIndex) => (
                <li
                  className={styles.summaryItem}
                  key={`tooltip_price_${bpIndex}`}
                >
                  <img src="/images/gold.png" width={15} alt="" />
                  <span>{bp}</span>
                </li>
              ))
            ) : (
              <li className={styles.summaryItem}>
                <span>매물 없음</span>
              </li>
            )
          ) : (
            <li className={styles.summaryItem}>로딩중...</li>
          )}
        </ul>
      </Tooltip>
    </div>
  );
};

export default TripodResultBlock;
