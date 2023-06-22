import EngraveResultContainer from "@/containers/engrave/EngraveResultContainer";
import EngraveSearchContainer from "@/containers/engrave/EngraveSearchContainer";
import styles from "@/styles/engrave/Body.module.scss";
import { AuctionItem } from "@/types/EngraveType";
import { nanumNeo } from "@/types/GlobalType";
import { useState } from "react";

export default function EngraveBody() {
  const [combinationList, setCombinationList] = useState<AuctionItem[][]>([]);
  return (
    <div className={`${styles.body} ${nanumNeo.className}`}>
      <EngraveSearchContainer setCombinationList={setCombinationList} />
      <EngraveResultContainer combinationList={combinationList} />
    </div>
  );
}
