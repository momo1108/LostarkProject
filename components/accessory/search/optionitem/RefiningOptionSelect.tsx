import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import {
  useAccessorySearchActionContext,
  useAccessorySearchStaticContext,
} from "@/contexts/AccessoryContext";
import {
  ACCESSORY_REFININGEFFECT_MAP,
  AccessorySearchOption,
  REFINING_EFFECT_VALUE_MAP,
  RefiningEffectKey,
} from "@/types/EngraveType";
import { useCallback } from "react";
import useAlert from "@/hooks/useAlert";

const RefiningOptionSelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const { REFINING_EFFECT_DATA } = useAccessorySearchStaticContext();
  const alert = useAlert();

  const refiningEffects =
    ACCESSORY_REFININGEFFECT_MAP[option.accessoryCategory];
  const categoryOptionsArray = (refiningEffects as unknown as string[])
    .filter(
      (refiningEffect) =>
        !option.accessoryRefiningEffectArray.find(
          (accessoryRefiningEffect) =>
            accessoryRefiningEffect.effectName.name === refiningEffect
        )
    )
    .map((refiningEffect) => ({
      label: refiningEffect,
      value: REFINING_EFFECT_VALUE_MAP[refiningEffect as RefiningEffectKey],
    }));

  /**
   * isSelectDone 을 원래는 onSelect 메서드 내에서 정의했으나,
   * option 객체의 값이 함수가 맨 처음 정의될 당시의 값으로 고정되는 문제가 발생.
   * 이는 클로저의 기본 동작에 의한 문제로 판단됨.
   */
  const isSelectDone = option.accessoryRefiningEffectArray.length >= 3;
  const onSelect = useCallback(
    (selectedOption: { label: string; value: number }) => {
      if (!isSelectDone) {
        setAccessorySearchOptionArray((prev) => {
          return prev.map(
            (accessorySearchOption, accessorySearchOptionIndex) => {
              if (accessorySearchOptionIndex === optionIndex)
                return {
                  ...accessorySearchOption,
                  accessoryRefiningEffectArray: [
                    ...accessorySearchOption.accessoryRefiningEffectArray,
                    {
                      effectName: {
                        name: selectedOption.label as RefiningEffectKey,
                        value:
                          REFINING_EFFECT_VALUE_MAP[
                            selectedOption.label as RefiningEffectKey
                          ],
                      },
                      effectValue: {
                        level: 2,
                        valueArray:
                          REFINING_EFFECT_DATA[
                            selectedOption.label as RefiningEffectKey
                          ][accessorySearchOption.accessoryTier][
                            accessorySearchOption.accessoryGrade
                          ],
                      },
                    },
                  ],
                };
              return accessorySearchOption;
            }
          );
        });
      } else {
        alert.error("연마 효과는 최대 3개입니다.");
      }
    },
    [isSelectDone]
  );

  return (
    <MySelect
      className={styles.refiningOptionSelect}
      width={180}
      height={40}
      placeholder="옵션 선택"
      options={categoryOptionsArray}
      onSelect={onSelect}
    />
  );
};

export default RefiningOptionSelect;
