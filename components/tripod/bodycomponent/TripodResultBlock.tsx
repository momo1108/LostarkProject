import MyLoader from "@/components/custom/MyLoader";
import {
  Empty,
  MagnifyingGlass,
  Spinner,
  Tripod,
} from "@/components/icons/Index";
import TripodResultContext from "@/contexts/TripodResultContext";
import styles from "@/styles/tripod/Body.module.scss";
import { TripodResType, tripodTierToStyleMap } from "@/types/TripodType";
import { Fragment, useContext, useEffect } from "react";

const TripodResultBlock: React.FC = () => {
  const {
    responseData,
    pageStatus,
    currentCase,
    totalCases,
    myTimer,
    buttonDivStatus,
    totalStatus,
  } = useContext(TripodResultContext);
  useEffect(() => {
    console.log(responseData);
  }, [responseData]);
  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultButtonDiv}>
        <button disabled={buttonDivStatus !== "AVAILABLE"}>
          현자의 가루 사용
        </button>
        <button disabled={buttonDivStatus !== "AVAILABLE"}>
          현자의 가루 비용 포함
        </button>
        {/* <button>페온 값 포함</button> */}
      </div>
      <div className={styles.resultDiv}>
        {responseData.length ? (
          <div className={styles.dataDiv}>
            {responseData.map((skill: TripodResType) => (
              <div
                className={styles.skillDiv}
                key={`result_skill_${skill.Name}`}
              >
                <div className={styles.skillDescrDiv}>
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
                            className={tripodTierToStyleMap.color[tripod.Tier]}
                          >
                            {tripod.Name}
                          </p>
                        </div>
                        <div className={styles.totalPriceDiv}>
                          <span>총</span>
                          <p className={styles.goldP}>
                            <img src="/images/gold.png" width={15} alt="" />
                            <span>{tripod.Price.Total[totalStatus]}</span>
                          </p>
                        </div>
                        <ul className={styles.tripodPriceList}>
                          {tripod.Price.All.map((bp, bpIndex) => (
                            <div
                              className={styles.tripodPriceItem}
                              key={`result_skill_${skill.Name}_tripod_${tripod.Name}_${bpIndex}`}
                            >
                              <img src="/images/gold.png" width={15} alt="" />
                              <span>{bp}</span>
                            </div>
                          ))}
                        </ul>
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
              </div>
            ))}
          </div>
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
        <MyLoader
          className={styles.resultLoader}
          backgroundColor="#000e"
          display={pageStatus === "SEARCHING" ? "flex" : "none"}
        >
          <Spinner
            size={400}
            width={6}
            progress={currentCase / totalCases}
            color="#4691f6"
          />
          <div className={styles.resultLoaderContent}>
            <Tripod className={styles.tripodIcon} size={200} />
            <p>
              검색 현황 : ( {currentCase} / {totalCases} )
            </p>
            <p>트라이포드 매물을 검색중입니다.</p>
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
        </MyLoader>
      </div>
    </div>
  );
};

export default TripodResultBlock;
