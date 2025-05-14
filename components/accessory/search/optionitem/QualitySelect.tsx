import MySelect from "@/components/custom/MySelect";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import styles from "@/styles/accessory/Body.module.scss";
import {
  AccessorySearchOption,
  AccessoryUpgradeLevel,
} from "@/types/EngraveType";

const QualitySelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const qualityOptionsArray = [
    { label: "70", value: 70 },
    { label: "80", value: 80 },
    { label: "90", value: 90 },
    { label: "100", value: 100 },
  ];

  const onSelect = (selectedOption: { label: string; value: number }) => {
    if (selectedOption.value === option.accessoryQuality) return;
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryQuality: selectedOption.value,
          };
        return accessorySearchOption;
      });
    });
  };

  return (
    <MySelect
      className={styles.qualitySelect}
      width={50}
      height={40}
      defaultSelectedIndex={qualityOptionsArray.findIndex(
        (qualityOption) => qualityOption.value === option.accessoryQuality
      )}
      options={qualityOptionsArray}
      onSelect={onSelect}
    />
  );
};

export default QualitySelect;
