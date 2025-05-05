import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import styles from "@/styles/accessory/Body.module.scss";
import {
  AccessorySearchOption,
  AccessoryUpgradeLevel,
} from "@/types/EngraveType";
import { useCallback } from "react";

const LevelSettingList: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback((level: AccessoryUpgradeLevel) => {
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryUpgradeLevel: level,
          };
        return accessorySearchOption;
      });
    });
  }, []);

  return (
    <ol className={styles.levelList}>
      {[0, 1, 2, 3].map((level) => (
        <li key={`level_${level}`} onClick={() => {}}>
          <button
            className={
              level === option.accessoryUpgradeLevel
                ? "bg-white text-[#333]"
                : ""
            }
            onClick={() => handleClick(level as AccessoryUpgradeLevel)}
          >
            {level}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default LevelSettingList;
