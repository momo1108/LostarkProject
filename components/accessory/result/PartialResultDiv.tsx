import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/accessory/Body.module.scss";
import useClipboard from "@/hooks/useClipboard";
import { useAccessorySearchSelectorContext } from "@/contexts/accessory/AccessorySearchContext";
import { gradeClassMap } from "@/types/GlobalType";
import List from "@/components/icons/List";
import { AuctionItemSearchResult } from "@/types/LostarkApiType";
import { useState, useRef } from "react";
import MyInput from "@/components/custom/MyInput";

const PartialResultDiv: React.FC<{
  partialResult: AuctionItemSearchResult;
}> = ({ partialResult }) => {
  const { bgClassMaker } = useCssHook();
  const { copyToClipboard } = useClipboard();

  const statRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  const handleClickFilter = () => {
    const statFilterValue = parseInt(statRef.current?.value || "0");
    const hpFilterValue = parseInt(hpRef.current?.value || "0");

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

    setFilteredResult({ ...partialResult, Items: hpFilteredItems });
  };

  const [filteredResult, setFilteredResult] =
    useState<AuctionItemSearchResult>(partialResult);

  return (
    <div className={styles.singleResultDiv}>
      <div className="flex p-2 mr-auto border-b items-end gap-x-4 font-bold text-lg">
        <h5>필터</h5>
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
      </div>
      <ul className={`${styles.singleResultList} hideScroll`}>
        {filteredResult.Items.map((accessoryResult, accessoryIndex) => (
          <li
            className={styles.accessoryItem}
            key={`filteredItem_${accessoryResult.Name}_${accessoryResult.GradeQuality}_${accessoryResult.AuctionInfo.EndDate}_${accessoryIndex}`}
          >
            <div className="flex gap-2 items-center">
              <img
                width={54}
                src={accessoryResult.Icon.replace(
                  "/EFUI_IconAtlas/efui_iconatlas",
                  "/efui_iconatlas"
                )}
                className={gradeClassMap[accessoryResult.Grade]}
                alt=""
              />
              <div className="flex flex-col justify-center text-sm">
                <p
                  className="cursor-pointer hover:font-bold hover:bg-[#fff2] truncate"
                  onClick={() => {
                    copyToClipboard(
                      accessoryResult.Name,
                      `"${accessoryResult.Name}" 악세서리 이름 복사완료`
                    );
                  }}
                >
                  {accessoryResult.Name}
                </p>
                <p className="text-xs">품질 : {accessoryResult.GradeQuality}</p>
                <div className="w-[110px] bg-[#fff2]">
                  <p
                    style={{
                      width: `${accessoryResult.GradeQuality}%`,
                    }}
                    className={`h-2 ${bgClassMaker(
                      accessoryResult.GradeQuality
                    )}`}
                  ></p>
                </div>
                <p className="text-xs mt-[2px]">
                  구매 후{" "}
                  <span className={styles.countSpan}>
                    {accessoryResult.AuctionInfo.TradeAllowCount}회
                  </span>{" "}
                  거래 가능
                </p>
              </div>
            </div>
            <div className={styles.optionDiv}>
              <div className={styles.engraveDiv}>
                {accessoryResult.Options.filter(
                  (option) => option.Type === "ACCESSORY_UPGRADE"
                ).map((option) => {
                  return (
                    <div
                      className="flex gap-1 justify-start"
                      key={`option_${option.OptionName}`}
                    >
                      <div
                        className={
                          "flex max-w-32 cursor-pointer hover:font-bold hover:bg-[#fff2]"
                        }
                        onClick={() => {
                          copyToClipboard(
                            option.OptionName,
                            `"${option.OptionName}" 연마 효과 이름 복사완료`
                          );
                        }}
                      >
                        [
                        <p className="max-w-[80px] truncate">
                          {option.OptionName}
                        </p>
                        ]
                      </div>
                      <p>+{option.Value}</p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.statDiv}>
                {accessoryResult.Options.filter(
                  (option) =>
                    option.Type === 5 &&
                    ["힘", "체력"].includes(option.OptionName)
                ).map((option) => {
                  return (
                    <p key={`option_${option.OptionName}`}>
                      <span
                        className={styles.statNameSpan}
                        onClick={() => {
                          copyToClipboard(
                            option.OptionName,
                            `"${option.OptionName}" 기본 효과 이름 복사완료`
                          );
                        }}
                      >
                        [{option.OptionName}]
                      </span>{" "}
                      +{option.Value}
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
                  {new Intl.NumberFormat().format(
                    accessoryResult.AuctionInfo.BidStartPrice
                  )}
                </span>
              </p>
              <p className={styles.costP}>
                <span>즉시구매가</span>{" "}
                <img width={15} src="/images/gold.png" alt="" />
                <span className={styles.costSpan}>
                  {new Intl.NumberFormat().format(
                    accessoryResult.AuctionInfo.BuyPrice
                  )}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartialResultDiv;
