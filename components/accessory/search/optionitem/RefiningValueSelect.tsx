import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import { useAccessorySearchActionContext } from "@/contexts/AccessoryContext";
import {
  AccessorySearchOption,
  RefiningEffectLevel,
} from "@/types/EngraveType";
import { useCallback } from "react";

const RefiningValueSelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
  effectIndex: number;
}> = ({ option, optionIndex, effectIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();

  const refiningValueOptionsArray = option.accessoryRefiningEffectArray[
    effectIndex
  ].effectValue.valueArray.map(({ DisplayValue }, effectValueIndex) => ({
    label: DisplayValue,
    value: effectValueIndex,
  }));

  const onSelect = useCallback(
    (selectedOption: { label: string; value: number }) => {
      if (
        selectedOption.value ===
        option.accessoryRefiningEffectArray[effectIndex].effectValue.level
      )
        return;
      setAccessorySearchOptionArray((prev) => {
        return prev.map((accessorySearchOption, accessorySearchOptionIndex) => {
          if (accessorySearchOptionIndex === optionIndex)
            return {
              ...accessorySearchOption,
              accessoryRefiningEffectArray:
                accessorySearchOption.accessoryRefiningEffectArray.map(
                  (prevEffect, prevEffectIndex) => {
                    if (prevEffectIndex === effectIndex)
                      return {
                        ...prevEffect,
                        effectValue: {
                          ...prevEffect.effectValue,
                          level: selectedOption.value as RefiningEffectLevel,
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
      className={styles.refiningValueSelect}
      width={60}
      height={20}
      defaultSelectedIndex={
        option.accessoryRefiningEffectArray[effectIndex].effectValue.level
      }
      options={refiningValueOptionsArray}
      onSelect={onSelect}
    />
  );
};

export default RefiningValueSelect;
