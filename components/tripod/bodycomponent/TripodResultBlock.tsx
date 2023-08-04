import TripodResultContext from "@/contexts/TripodResultContext";
import styles from "@/styles/tripod/Body.module.scss";
import { TripodResType } from "@/types/TripodType";
import { Fragment, useContext, useEffect } from "react";

const TripodResultBlock: React.FC = () => {
  const { responseData } = useContext(TripodResultContext);
  useEffect(() => {
    console.log(responseData);
  }, [responseData]);
  return (
    <div className={styles.resultContainer}>
      <p>hello</p>
      <h3>this is body</h3>
      {responseData ? (
        responseData.length ? (
          <div>
            {responseData.map((res: TripodResType) => (
              <p>{res.Name}</p>
            ))}
          </div>
        ) : (
          <div>비었당</div>
        )
      ) : (
        <div>로딩중</div>
      )}
    </div>
  );
};

export default TripodResultBlock;
