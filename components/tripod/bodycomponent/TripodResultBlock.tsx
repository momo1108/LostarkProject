import { Empty, MagnifyingGlass } from "@/components/icons/Index";
import TripodResultContext from "@/contexts/TripodResultContext";
import styles from "@/styles/tripod/Body.module.scss";
import { TripodResType, tripodTierToStyleMap } from "@/types/TripodType";
import { Fragment, useContext, useEffect } from "react";

const TripodResultBlock: React.FC = () => {
  const { responseData, pageStatus } = useContext(TripodResultContext);
  useEffect(() => {
    console.log(responseData);
  }, [responseData]);
  return (
    <div className={styles.resultContainer}>
      {pageStatus === "SEARCHING" ? (
        <div className={styles.searchingDiv}>로딩중</div>
      ) : (
        <div className={styles.resultDiv}>
          <button>현자의 가루 사용</button>
          <button>현자의 가루 비용 포함</button>
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
                          <div className={styles.tripodDescrDiv}>
                            <img
                              className={styles.tripodIcon}
                              src={tripod.Icon}
                              alt=""
                            />
                            <p
                              className={
                                tripodTierToStyleMap.color[tripod.Tier]
                              }
                            >
                              {tripod.Name}
                            </p>
                          </div>
                          <ul className={styles.tripodPriceList}>
                            {tripod.BuyPrice.map((bp, bpIndex) => (
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
                        <div className={styles.tripodDiv}>
                          <div className={styles.tripodDescrDiv}>
                            <Empty
                              className={`${styles.emptyIcon} ${tripodTierToStyleMap.stroke[tripodIndex]}`}
                              width={2}
                            />
                            <p
                              className={
                                tripodTierToStyleMap.color[tripodIndex]
                              }
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
        </div>
      )}
    </div>
  );
};

export default TripodResultBlock;
