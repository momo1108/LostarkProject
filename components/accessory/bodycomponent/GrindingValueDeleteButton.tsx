import Close from "@/components/icons/Close";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import { AccessorySearchOption } from "@/types/EngraveType";
import { useCallback } from "react";

const GrindingValueDeleteButton: React.FC<{
  optionIndex: number;
  effectName: string;
}> = ({ optionIndex, effectName }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback(() => {
    setAccessorySearchOptionArray((prev) => {
      return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
        if (accessorySearchOptionIndex === optionIndex)
          return {
            ...accessorySearchOption,
            accessoryGrindingEffectArray:
              accessorySearchOption.accessoryGrindingEffectArray.filter(
                (effect) => effect.effectName.name !== effectName
              ),
          };
        return accessorySearchOption;
      });
    });
  }, []);

  return (
    <button onClick={() => handleClick()}>
      <Close size={16} color="#fff" width={1.5} />
    </button>
  );
};

export default GrindingValueDeleteButton;
