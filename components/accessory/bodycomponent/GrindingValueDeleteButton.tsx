import Delete from "@/components/icons/Delete";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import styles from "@/styles/accessory/Body.module.scss";
import {
  AccessorySearchOption,
  AccessoryUpgradeLevel,
} from "@/types/EngraveType";
import { useCallback } from "react";

const GrindingValueDeleteButton: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
  effectIndex: number;
}> = ({ option, optionIndex, effectIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback(() => {
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryGrindingEffectArray:
              accessorySearchOption.accessoryGrindingEffectArray.filter(
                (_, prevEffectIndex) => prevEffectIndex !== effectIndex
              ),
          };
        return accessorySearchOption;
      });
    });
  }, []);

  return (
    <button onClick={() => handleClick()}>
      <Delete size={16} color="#fff" width={1.5} />
    </button>
  );
};

export default GrindingValueDeleteButton;
