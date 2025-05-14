import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/accessory/Body.module.scss";
import useClipboard from "@/hooks/useClipboard";
import { gradeClassMap } from "@/types/GlobalType";
import { AuctionItemSearchResult } from "@/types/LostarkApiType";
import { useEffect, useRef } from "react";

const PartialResultList: React.FC<{
  filteredResult: AuctionItemSearchResult;
}> = ({ filteredResult }) => {
  const { copyToClipboard } = useClipboard();
  const { bgClassMaker } = useCssHook();
  const partialResultListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = partialResultListRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // 수직 스크롤을 가로 스크롤로 변환
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <ul
      ref={partialResultListRef}
      className={`${styles.singleResultList} hideScroll`}
    >
      {filteredResult.Items.length ? (
        filteredResult.Items.map((accessoryResult, accessoryIndex) => (
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
                  const displayValue = `${option.Value}${
                    option.IsValuePercentage ? "%" : ""
                  }`;
                  return (
                    <div
                      className="flex gap-1 justify-start"
                      key={`option_${option.OptionName}_${
                        option.IsValuePercentage ? "percentage" : "value"
                      }`}
                    >
                      <div
                        className={
                          "flex max-w-36 cursor-pointer hover:font-bold hover:bg-[#fff2]"
                        }
                        onClick={() => {
                          copyToClipboard(
                            option.OptionName,
                            `"${option.OptionName}" 연마 효과 이름 복사완료`
                          );
                        }}
                      >
                        [
                        <p className="max-w-[72px] truncate">
                          {option.OptionName}
                        </p>
                        ]
                      </div>
                      <p>+{displayValue}</p>
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
                    <div
                      className="flex gap-1"
                      key={`option_${option.OptionName}`}
                    >
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
                      </span>
                      <span>+{option.Value}</span>
                    </div>
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
        ))
      ) : (
        <li className="flex justify-center items-center w-60 h-40 mb-2 border border-[#333] rounded">
          검색 결과가 없습니다.
        </li>
      )}
    </ul>
  );
};

export default PartialResultList;
