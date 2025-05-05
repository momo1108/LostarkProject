import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import {
  useAccessorySearchActionContext,
  useAccessorySearchStaticContext,
} from "@/contexts/accessory/AccessorySearchContext";
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

  const handleSelectGrindingEffectValue = useCallback(
    (selectedOption: { label: string; value: number }) => {
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
                          level: selectedOption.value as GrindingEffectLevel,
                          valueArray: prevEffect.effectValue.valueArray,
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
    []
  );

  return (
    <MySelect
      className={styles.grindingValueSelect}
      width={60}
      height={20}
      defaultSelectedIndex={
        option.accessoryGrindingEffectArray[effectIndex].effectValue.level
      }
      options={option.accessoryGrindingEffectArray[
        effectIndex
      ].effectValue.valueArray.map(({ DisplayValue }, effectValueIndex) => ({
        label: DisplayValue,
        value: effectValueIndex,
      }))}
      onSelect={handleSelectGrindingEffectValue}
    />
  );
};

export default GrindingValueSelect;
