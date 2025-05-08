import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import Earring from "@/components/icons/Earring";
import Necklace from "@/components/icons/Necklace";
import Ring2 from "@/components/icons/Ring2";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import {
  ACCESSORY_CATEGORY_CODES,
  AccessoryCategory,
  AccessorySearchOption,
} from "@/types/EngraveType";

const CategorySelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();

  const options = ["목걸이", "귀걸이", "반지"].map((category) => ({
    label: category,
    value: ACCESSORY_CATEGORY_CODES[category as AccessoryCategory],
  }));
  const onSelect = (selectedOption: { label: string; value: number }) => {
    if (selectedOption.label === option.accessoryCategory) return;
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryCategory: selectedOption.label as AccessoryCategory,
            accessoryGrindingEffectArray: [],
          };
        return accessorySearchOption;
      });
    });
  };
  const defaultOptionIndex = {
    목걸이: 0,
    귀걸이: 1,
    반지: 2,
  };

  return (
    <div className={styles.accessoryCategorySettingDiv}>
      {option.accessoryCategory === "목걸이" ? (
        <Necklace fill="#fff" />
      ) : option.accessoryCategory === "귀걸이" ? (
        <Earring fill="#fff" fill2="#fff" />
      ) : (
        <Ring2 fill="#fff" fill2="#fff" />
      )}
      <MySelect
        className={styles.accessoryCategorySelect}
        defaultSelectedIndex={defaultOptionIndex[option.accessoryCategory]}
        width={80}
        height={40}
        options={options}
        onSelect={onSelect}
      />
    </div>
  );
};

export default CategorySelect;
