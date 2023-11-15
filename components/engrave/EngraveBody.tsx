import EngraveResultContainer from "@/containers/engrave/EngraveResultContainer";
import EngraveSearchContainer from "@/containers/engrave/EngraveSearchContainer";
import styles from "@/styles/engrave/Body.module.scss";
import { AuctionItem } from "@/types/LostarkApiType";
import { nanumNeo } from "@/types/GlobalType";
import { useCallback, useEffect, useState } from "react";
import useAlert from "@/hooks/useAlert";

export default function EngraveBody() {
  const alert = useAlert();
  // 0 : 초기, 1 : 검색 완료, 2 : 악세 검색 중, 3 : 악세 필터링 중
  const [pageStatus, setPageStatus] = useState<number>(0);
  const [combinationList, setCombinationList] = useState<AuctionItem[][]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [totalCases, setTotalCases] = useState<number>(1);
  const [currentCase, setCurrentCase] = useState<number>(0);
  const [myTimer, setMyTimer] = useState<number>(0);

  const [myClipboard, setMyClipboard] = useState<Clipboard>();
  useEffect(() => {
    setMyClipboard(window.navigator.clipboard);
  }, []);
  const copyToClipboard = useCallback(
    (text: string) => {
      try {
        myClipboard!
          .writeText(text)
          .then(() => {
            alert.success("복사가 완료됐습니다.");
          })
          .catch((err) => {
            alert.info("복사를 실패했습니다.");
            console.log(err);
          });
      } catch (error: any) {
        console.log(error);
      }
    },
    [myClipboard]
  );

  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <EngraveSearchContainer
        {...{
          pageStatus,
          combinationList,
          setPageStatus,
          setCombinationList,
          setProgress,
          setTotalCases,
          setCurrentCase,
          setMyTimer,
        }}
      />
      <EngraveResultContainer
        {...{
          pageStatus,
          combinationList,
          progress,
          totalCases,
          currentCase,
          myTimer,
          copyToClipboard,
        }}
      />
    </div>
  );
}
