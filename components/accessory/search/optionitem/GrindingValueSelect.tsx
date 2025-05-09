import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import {
  AccessorySearchOption,
  GrindingEffectLevel,
} from "@/types/EngraveType";
import { useCallback } from "react";

const GrindingValueSelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
  effectIndex: number;
}> = ({ option, optionIndex, effectIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();

  const grindingValueOptionsArray = option.accessoryGrindingEffectArray[
    effectIndex
  ].effectValue.valueArray.map(({ DisplayValue }, effectValueIndex) => ({
    label: DisplayValue,
    value: effectValueIndex,
  }));

  const onSelect = useCallback(
    (selectedOption: { label: string; value: number }) => {
      if (
        selectedOption.value ===
        option.accessoryGrindingEffectArray[effectIndex].effectValue.level
      )
        return;
      setAccessorySearchOptionArray((prev) => {
        return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
          if (accessorySearchOptionIndex === optionIndex)
            return {
              ...accessorySearchOption,
              accessoryGrindingEffectArray:
                accessorySearchOption.accessoryGrindingEffectArray.map(
                  (prevEffect, prevEffectIndex) => {
                    if (prevEffectIndex === effectIndex)
                      return {
                        ...prevEffect,
                        effectValue: {
                          ...prevEffect.effectValue,
                          level: selectedOption.value as GrindingEffectLevel,
                        },
                      };
                    return prevEffect;
                  }
                ),
            };
          return accessorySearchOption;
        });
      });
    },
    [option, optionIndex, effectIndex]
  );

  return (
    <MySelect
      className={styles.grindingValueSelect}
      width={60}
      height={20}
      defaultSelectedIndex={
        option.accessoryGrindingEffectArray[effectIndex].effectValue.level
      }
      options={grindingValueOptionsArray}
      onSelect={onSelect}
    />
  );
};

export default GrindingValueSelect;
