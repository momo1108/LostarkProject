import {
  useAccessorySearchActionContext,
  useAccessorySearchStaticContext,
} from "@/contexts/AccessoryContext";
import styles from "@/styles/accessory/Body.module.scss";
import { AccessoryGrade, AccessorySearchOption } from "@/types/EngraveType";
import { useCallback } from "react";

const GradeSettingList: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const { GRINDING_EFFECT_DATA } = useAccessorySearchStaticContext();

  const handleClick = useCallback((grade: AccessoryGrade) => {
    if (grade === option.accessoryGrade) return;
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryGrade: grade,
            accessoryGrindingEffectArray:
              accessorySearchOption.accessoryGrindingEffectArray.map(
                ({ effectName, effectValue }) => {
                  return {
                    effectName,
                    effectValue: {
                      ...effectValue,
                      valueArray:
                        GRINDING_EFFECT_DATA[effectName.name][
                          accessorySearchOption.accessoryTier
                        ][grade],
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
    <ol className={styles.gradeList}>
      {["유물", "고대"].map((grade) => (
        <li
          key={`tier_${grade}`}
          onClick={() => handleClick(grade as AccessoryGrade)}
        >
          <button
            className={
              grade === option.accessoryGrade ? "bg-white text-[#333]" : ""
            }
          >
            {grade}
          </button>
        </li>
      ))}
    </ol>
  );
};

export default GradeSettingList;
