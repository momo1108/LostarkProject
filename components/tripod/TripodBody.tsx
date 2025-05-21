import TripodResultContainer from "@/containers/tripod/TripodResultContainer";
import TripodSearchContainer from "@/containers/tripod/TripodSearchContainer";
import { useStateWithRef } from "@/hooks/useStateWithRef";
import styles from "@/styles/tripod/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import { TripodPageStatus, TripodResType } from "@/types/TripodType";
import { useState, useEffect } from "react";

const TripodBody: React.FC = () => {
  const [responseData, setResponseData] = useState<TripodResType[]>([]);
  const [pageStatus, setPageStatus, pageStatusRef] =
    useStateWithRef<TripodPageStatus>("INIT");
  const [currentCase, setCurrentCase] = useState<number>(0);
  const [totalCases, setTotalCases] = useState<number>(1);
  const [myTimer, setMyTimer] = useState<number>(0);
  let timer: NodeJS.Timer | null = null;
  useEffect(() => {
    if (myTimer > 60 && !timer) {
      timer = setInterval(() => {
        setMyTimer((e) => e - 1);
      }, 1000);
    }
    if (myTimer < 0) {
      clearInterval(timer!);
      timer = null;
    }
  }, [myTimer, timer]);
  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <TripodSearchContainer
        {...{
          setResponseData,
          pageStatus,
          pageStatusRef,
          setPageStatus,
          setCurrentCase,
          setTotalCases,
          setMyTimer,
        }}
      />
      <TripodResultContainer
        {...{
          responseData,
          pageStatus,
          pageStatusRef,
          currentCase,
          totalCases,
          myTimer,
        }}
      />
    </div>
  );
};

export default TripodBody;
