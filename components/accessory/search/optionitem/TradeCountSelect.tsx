import MySelect from "@/components/custom/MySelect";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import styles from "@/styles/accessory/Body.module.scss";
import {
  AccessorySearchOption,
  AccessoryTradeCount,
} from "@/types/EngraveType";

const TradeCountSelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const tradeCountOptionsArray = [
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
  ];

  const onSelect = (selectedOption: { label: string; value: number }) => {
    if (selectedOption.value === option.accessoryTradeCount) return;
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryTradeCount: selectedOption.value as AccessoryTradeCount,
          };
        return accessorySearchOption;
      });
    });
  };

  return (
    <MySelect
      className={styles.tradeCountSelect}
      width={50}
      height={40}
      defaultSelectedIndex={option.accessoryTradeCount}
      options={tradeCountOptionsArray}
      onSelect={onSelect}
    />
  );
};

export default TradeCountSelect;
