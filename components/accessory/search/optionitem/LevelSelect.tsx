import MySelect from "@/components/custom/MySelect";
import { useAccessorySearchActionContext } from "@/contexts/AccessoryContext";
import styles from "@/styles/accessory/Body.module.scss";
import {
  AccessorySearchOption,
  AccessoryUpgradeLevel,
} from "@/types/EngraveType";

const LevelSelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const levelOptionsArray = [
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
  ];

  const onSelect = (selectedOption: { label: string; value: number }) => {
    if (selectedOption.value === option.accessoryUpgradeLevel) return;
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryUpgradeLevel:
              selectedOption.value as AccessoryUpgradeLevel,
          };
        return accessorySearchOption;
      });
    });
  };

  return (
    <MySelect
      className={styles.levelSelect}
      width={50}
      height={40}
      defaultSelectedIndex={option.accessoryUpgradeLevel}
      options={levelOptionsArray}
      onSelect={onSelect}
    />
  );
};

export default LevelSelect;
