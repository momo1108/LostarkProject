import {
  useAccessorySearchActionContext,
  useAccessorySearchStaticContext,
} from "@/contexts/accessory/AccessorySearchContext";
import styles from "@/styles/accessory/Body.module.scss";
import { AccessorySearchOption, AccessoryTier } from "@/types/EngraveType";
import { useCallback } from "react";

const TierSettingList: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback((tier: AccessoryTier) => {
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryTier: tier,
          };
        return accessorySearchOption;
      });
    });
  }, []);

  return (
    <ol className={styles.tierList}>
      {[3, 4].map((tier) => (
        <li key={`tier_${tier}`} onClick={() => {}}>
          <button
            className={
              tier === option.accessoryTier ? "bg-white text-[#333]" : ""
            }
            onClick={() => handleClick(tier as AccessoryTier)}
          >
            {tier}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default TierSettingList;
