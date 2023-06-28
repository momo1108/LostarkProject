import MyLoader from "@/components/custom/MyLoader";
import Dots from "@/components/icons/Dots";
import {
  Box,
  Earring,
  Gear,
  Necklace,
  Ring2,
  Skip,
  Spinner,
  Triangle,
} from "@/components/icons/Index";
import MagnifyingGlass from "@/components/icons/MagnifyingGlass";
import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/engrave/Body.module.scss";
import { AuctionItem } from "@/types/EngraveType";
import { gradeClassMap } from "@/types/GlobalType";
import { useMemo, useState } from "react";

type EngraveResultBlockProps = {
  combinationList: AuctionItem[][];
  pageStatus: number;
  progress: number;
  totalCases: number;
  currentCase: number;
  myTimer: number;
};
const EngraveResultBlock: React.FC<EngraveResultBlockProps> = ({
  combinationList,
  pageStatus,
  progress,
  totalCases,
  currentCase,
  myTimer,
}) => {
  const { bgClassMaker } = useCssHook();
  const initialStat = {
    치명: 0,
    특화: 0,
    신속: 0,
    제압: 0,
    인내: 0,
    숙련: 0,
  };
  const [resultPage, setResultPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const combinationInfo = useMemo(() => {
    return combinationList.map((combination) => {
      return combination.reduce(
        (prev: { cost: number; stat: { [key: string]: number } }, cur) => {
          cur.Options.forEach((option) => {
            if (option.Type === "STAT")
              prev.stat[option.OptionName] += option.Value;
          });
          return {
            cost: prev.cost + cur.AuctionInfo.BuyPrice,
            stat: prev.stat,
          };
        },
        { cost: 0, stat: { ...initialStat } }
      );
    });
  }, [combinationList]);

  return (
    <div className={styles.resultContainer}>
      <h3 className={styles.resultHeader}>
        <p>검색 결과</p>
        {combinationList.length ? (
          <div className={styles.resultPageDiv}>
            <p className={styles.resultPageP}>
              ( {resultPage * pageSize + 1} ~ {(resultPage + 1) * pageSize} /{" "}
              {combinationList.length} )
            </p>
            <button
              onClick={() => {
                setResultPage(0);
              }}
            >
              <Skip size={30} className={styles.skipButtonIcon} rotate={180} />
            </button>
            <button
              onClick={() => {
                setResultPage((e) => (e > 0 ? e - 1 : e));
              }}
            >
              <Triangle
                width={1}
                size={30}
                className={styles.nextButtonIcon}
                rotate={-90}
              />
            </button>
            <button
              onClick={() => {
                setResultPage((e) =>
                  e + 1 < Math.floor(combinationList.length / pageSize)
                    ? e + 1
                    : e
                );
              }}
            >
              <Triangle
                width={1}
                size={30}
                className={styles.nextButtonIcon}
                rotate={90}
              />
            </button>
            <button
              onClick={() => {
                setResultPage(
                  Math.floor(combinationList.length / pageSize) - 1
                );
              }}
            >
              <Skip size={30} className={styles.skipButtonIcon} />
            </button>
          </div>
        ) : (
          ""
        )}
      </h3>
      <div className={styles.resultBodyWrapper}>
        {pageStatus === 1 ? (
          combinationList.length ? (
            <div className={`hideScroll ${styles.resultBody}`}>
              {combinationList
                .slice(resultPage * pageSize, (resultPage + 1) * pageSize)
                .map((e, i) => (
                  <div
                    className={styles.combinationDiv}
                    key={`combination_${i}`}
                  >
                    <h4 className={styles.combinationHeader}>
                      <div className={styles.totalCostDiv}>
                        <p>Set{resultPage * pageSize + i + 1}</p>
                        <div className={styles.totalCostInfoDiv}>
                          <img src="/images/gold.png" alt="" />
                          <span className={styles.totalCost}>
                            {combinationInfo[resultPage * pageSize + i].cost}
                          </span>
                        </div>
                      </div>
                      <div className={styles.totalStatDiv}>
                        {Object.entries(
                          combinationInfo[resultPage * pageSize + i].stat
                        )
                          .sort((a, b) => b[1] - a[1])
                          .filter((statInfo) => statInfo[1] > 0)
                          .map((statInfo, statIndex) => {
                            return (
                              <p
                                className={styles.totalStat}
                                key={`combination_${i}_stat_${statIndex}`}
                              >
                                <span className={styles.statEmoji}>✨</span>
                                {statInfo[0]} : {statInfo[1]}
                              </p>
                            );
                          })}
                      </div>
                    </h4>
                    <div className={styles.combinationBody}>
                      {e.map((e2, i2) => (
                        <div
                          className={styles.combinationItemDiv}
                          key={`combination_${i}_item_${i2}`}
                        >
                          <div className={styles.titleDiv}>
                            <img
                              width={54}
                              src={e2.Icon.replace(
                                "/EFUI_IconAtlas/efui_iconatlas",
                                "/efui_iconatlas"
                              )}
                              className={gradeClassMap[e2.Grade]}
                              alt=""
                            />
                            <div className={styles.titleInfoDiv}>
                              <p className={styles.nameP}>{e2.Name}</p>
                              <p className={styles.qualityP}>
                                품질 : {e2.GradeQuality}
                              </p>
                              <div className={styles.qualityBarDiv}>
                                <p
                                  style={{
                                    width: `${e2.GradeQuality}%`,
                                  }}
                                  className={`h-2 ${bgClassMaker(
                                    e2.GradeQuality
                                  )}`}
                                ></p>
                              </div>
                              <p className={styles.tradeP}>
                                구매 후{" "}
                                <span className={styles.countSpan}>
                                  {e2.AuctionInfo.TradeAllowCount}회
                                </span>{" "}
                                거래 가능
                              </p>
                            </div>
                          </div>
                          <div className={styles.optionDiv}>
                            <div className={styles.engraveDiv}>
                              {e2.Options.filter(
                                (option) =>
                                  option.Type === "ABILITY_ENGRAVE" &&
                                  !option.IsPenalty
                              ).map((option, i3) => {
                                return (
                                  <p
                                    key={`combination_${i}_item_${i2}_eng_${i3}`}
                                  >
                                    [{option.OptionName}] +{option.Value}
                                  </p>
                                );
                              })}
                              <p className={styles.negativeP}>
                                [
                                {
                                  e2.Options.find(
                                    (option) =>
                                      option.Type === "ABILITY_ENGRAVE" &&
                                      option.IsPenalty
                                  )?.OptionName
                                }
                                ] +
                                {
                                  e2.Options.find(
                                    (option) =>
                                      option.Type === "ABILITY_ENGRAVE" &&
                                      option.IsPenalty
                                  )?.Value
                                }
                              </p>
                            </div>
                            <div className={styles.statDiv}>
                              {e2.Options.filter(
                                (option) => option.Type === "STAT"
                              ).map((option, i3) => {
                                return (
                                  <p
                                    key={`combination_${i}_item_${i2}_stat_${i3}`}
                                  >
                                    [{option.OptionName}] +{option.Value}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                          <div className={styles.costDiv}>
                            <p className={styles.costP}>
                              <span>최소입찰가</span>{" "}
                              <img width={15} src="/images/gold.png" alt="" />
                              <span className={styles.costSpan}>
                                {e2.AuctionInfo.BidStartPrice}
                              </span>
                            </p>
                            <p className={styles.costP}>
                              <span>즉시구매가</span>{" "}
                              <img width={15} src="/images/gold.png" alt="" />
                              <span className={styles.costSpan}>
                                {e2.AuctionInfo.BuyPrice}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div>검색 결과가 없습니다.</div>
          )
        ) : (
          <div className={styles.emptyResultBody}>
            <div className={styles.iconWrapper}>
              <MagnifyingGlass
                className={styles.mgIcon}
                size={200}
                color="none"
                fill="#ddd"
              />
            </div>
            <p>검색이 완료되면 결과가 출력됩니다.</p>
          </div>
        )}
        <MyLoader
          backgroundColor="#000e"
          hide={pageStatus < 2}
          className={styles.resultLoader}
        >
          <div className={styles.presentationSection}>
            <div className={styles.apiSearch}>
              <Spinner
                size={400}
                width={6}
                progress={currentCase / totalCases}
                color="#4691f6"
              />
              <MagnifyingGlass
                className={`${styles.magnifyingGlass} ${
                  pageStatus === 2 ? styles.floatingRound : ""
                }`}
                size={180}
                color="none"
                fill={pageStatus >= 2 ? "#4691f6" : "#666"}
              />
            </div>
            <div className={styles.dotsWrapper}>
              <Dots
                color="#4691f6"
                fill="#4691f6"
                className={styles.dots}
                size={600}
              />
            </div>
            <div className={styles.findCombination}>
              <Spinner
                size={400}
                width={6}
                progress={progress}
                color="#4691f6"
              />
              <Ring2
                className={pageStatus === 3 ? styles.ring : "hidden"}
                size={45}
                fill={pageStatus === 3 ? "#4691f6" : "#666"}
                fill2={pageStatus === 3 ? "#4691f6" : "#666"}
              />
              <Necklace
                className={pageStatus === 3 ? styles.necklace : "hidden"}
                size={45}
                fill={pageStatus === 3 ? "#4691f6" : "#666"}
              />
              <Earring
                className={pageStatus === 3 ? styles.earring : "hidden"}
                size={45}
                fill={pageStatus === 3 ? "#4691f6" : "#666"}
                fill2={pageStatus === 3 ? "#4691f6" : "#666"}
              />
              <Box
                className={styles.emptyBox}
                size={300}
                width={1}
                color={pageStatus === 3 ? "#4691f6" : "#666"}
              />
              <div className={styles.gearLargeWrapper}>
                <Gear
                  className={`${styles.gearLarge} ${
                    pageStatus === 3 ? styles.gearAnimate : ""
                  }`}
                  size={55}
                  color="none"
                  fill={pageStatus === 3 ? "#4691f6" : "#666"}
                />
              </div>
              <div className={styles.gearSmallWrapper}>
                <Gear
                  className={`${styles.gearSmall} ${
                    pageStatus === 3 ? styles.gearAnimate : ""
                  }`}
                  size={40}
                  color="none"
                  fill={pageStatus === 3 ? "#4691f6" : "#666"}
                />
              </div>
            </div>
          </div>
          <div className={styles.descriptionSection}>
            {pageStatus === 2 ? (
              <div className={styles.searchDiv}>
                <p>
                  검색 현황 : ( {currentCase} / {totalCases} )
                </p>
                <p>악세서리 매물을 검색중입니다.</p>
                {myTimer > 0 ? (
                  <div className={styles.timeoutDiv}>
                    <p>
                      로스트아크에서 제공하는 악세서리 검색은 1분에 100회까지로
                      제한되어 있습니다.
                    </p>
                    <p>다음 검색을 위해 대기 후 다시 시작합니다.</p>
                    <p className={styles.timerP}>남은 시간 : {myTimer}초</p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className={styles.findDiv}>
                <p>조합 현황 : {Math.ceil((progress * 1000) / 10)}%</p>
                <p>최저가 악세서리 조합을 찾고있습니다.</p>
              </div>
            )}
          </div>
        </MyLoader>
      </div>
    </div>
  );
};

export default EngraveResultBlock;
