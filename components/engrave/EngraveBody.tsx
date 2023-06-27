import EngraveResultContainer from "@/containers/engrave/EngraveResultContainer";
import EngraveSearchContainer from "@/containers/engrave/EngraveSearchContainer";
import styles from "@/styles/engrave/Body.module.scss";
import { AuctionItem } from "@/types/EngraveType";
import { nanumNeo } from "@/types/GlobalType";
import { useState } from "react";

export default function EngraveBody() {
  // 0 : 초기, 1 : 검색 완료, 2 : 악세 검색 중, 3 : 악세 필터링 중
  const [pageStatus, setPageStatus] = useState<number>(0);
  const [combinationList, setCombinationList] = useState<AuctionItem[][]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [totalCases, setTotalCases] = useState<number>(1);
  const [currentCase, setCurrentCase] = useState<number>(0);
  const [myTimer, setMyTimer] = useState<number>(0);
  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <EngraveSearchContainer
        {...{
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
        }}
      />
    </div>
  );
}
