import Close from "@/components/icons/Close";
import { useAccessorySearchActionContext } from "@/contexts/AccessoryContext";
import { useCallback } from "react";

const RefiningValueDeleteButton: React.FC<{
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
            accessoryRefiningEffectArray:
              accessorySearchOption.accessoryRefiningEffectArray.filter(
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

export default RefiningValueDeleteButton;
