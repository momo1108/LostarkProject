import {
  useAccessorySearchActionContext,
  useAccessorySearchStaticContext,
} from "@/contexts/AccessoryContext";
import styles from "@/styles/accessory/Body.module.scss";
import { AccessorySearchOption, AccessoryTier } from "@/types/EngraveType";
import { useCallback } from "react";

const TierSettingList: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const { GRINDING_EFFECT_DATA } = useAccessorySearchStaticContext();

  const handleClick = useCallback((tier: AccessoryTier) => {
    if (tier === option.accessoryTier) return;
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryTier: tier,
            accessoryGrindingEffectArray:
              accessorySearchOption.accessoryGrindingEffectArray.map(
                ({ effectName, effectValue }) => {
                  return {
                    effectName,
                    effectValue: {
                      ...effectValue,
                      valueArray:
                        GRINDING_EFFECT_DATA[effectName.name][tier][
                          accessorySearchOption.accessoryGrade
                        ],
                    },
                  };
                }
              ),
          };
        return accessorySearchOption;
      });
    });
  }, []);

  return (
    <ol className={styles.tierList}>
      {[3, 4].map((tier) => (
        <li
          key={`tier_${tier}`}
          onClick={() => handleClick(tier as AccessoryTier)}
        >
          <button
            className={
              tier === option.accessoryTier ? "bg-white text-[#333]" : ""
            }
          >
            {tier}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default TierSettingList;
