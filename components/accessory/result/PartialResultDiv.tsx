import styles from "@/styles/accessory/Body.module.scss";
import { AuctionItemSearchResult } from "@/types/LostarkApiType";
import { useState, useRef } from "react";
import MyInput from "@/components/custom/MyInput";
import Filter from "@/components/icons/Filter";
import PartialResultList from "./PartialResultList";

const PartialResultDiv: React.FC<{
  partialResult: AuctionItemSearchResult;
}> = ({ partialResult }) => {
  const statRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);
  const tradeCountRef = useRef<HTMLInputElement>(null);

  const handleClickFilter = () => {
    const statFilterValue = parseInt(statRef.current?.value || "0");
    const hpFilterValue = parseInt(hpRef.current?.value || "0");
    const tradeCountFilterValue = parseInt(tradeCountRef.current?.value || "0");

    const statFilteredItems = partialResult.Items.filter((item) => {
      const accessoryStatValue =
        item.Options.find((option) => option.OptionName === "힘")?.Value || 0;
      return accessoryStatValue >= statFilterValue;
    });
    const hpFilteredItems = statFilteredItems.filter((item) => {
      const accessoryHpValue =
        item.Options.find((option) => option.OptionName === "체력")?.Value || 0;
      return accessoryHpValue >= hpFilterValue;
    });
    const tradeCountFilteredItems = hpFilteredItems.filter((item) => {
      const tradeCountValue = item.AuctionInfo.TradeAllowCount;
      return tradeCountValue >= tradeCountFilterValue;
    });

    setFilteredResult({ ...partialResult, Items: tradeCountFilteredItems });
  };

  const handleClickReset = () => {
    setFilteredResult(partialResult);
    statRef.current!.value = "";
    hpRef.current!.value = "";
    tradeCountRef.current!.value = "";
  };

  const [filteredResult, setFilteredResult] =
    useState<AuctionItemSearchResult>(partialResult);

  return (
    <div className={styles.singleResultDiv}>
      <div className="flex flex-wrap gap-y-2 sm:flex-nowrap pb-2 xs:p-2 mr-auto items-end gap-x-4 font-bold text-lg">
        <h5 className="hidden sm:flex items-center gap-1">
          <Filter size={20} />
          필터
        </h5>
        <div className="flex gap-2">
          <MyInput
            className="!w-20"
            placeholder="힘/민/지"
            ref={statRef}
            type="number"
            min={0}
            max={99999}
            onKeyEnter={handleClickFilter}
          />
          <MyInput
            className="!w-[72px]"
            placeholder="체력"
            ref={hpRef}
            type="number"
            min={0}
            max={9999}
            onKeyEnter={handleClickFilter}
          />
          <MyInput
            className="!w-20"
            placeholder="거래횟수"
            ref={tradeCountRef}
            type="number"
            min={0}
            max={2}
            onKeyEnter={handleClickFilter}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="myButtons !text-sm !px-2 !py-1"
            onClick={handleClickFilter}
          >
            적용
          </button>
          <button
            className="myButtons !text-sm !px-2 !py-1"
            onClick={handleClickReset}
          >
            초기화
          </button>
        </div>
      </div>
      <PartialResultList filteredResult={filteredResult} />
    </div>
  );
};

export default PartialResultDiv;
