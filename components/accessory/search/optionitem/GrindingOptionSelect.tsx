import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import {
  useAccessorySearchActionContext,
  useAccessorySearchStaticContext,
} from "@/contexts/accessory/AccessorySearchContext";
import {
  ACCESSORY_GRINDINGEFFECT_MAP,
  AccessorySearchOption,
  AccessoryUpgradeLevel,
  GRINDING_EFFECT_VALUE_MAP,
  GrindingEffectKey,
} from "@/types/EngraveType";
import { useCallback } from "react";
import useAlert from "@/hooks/useAlert";

const GrindingOptionSelect: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const { GRINDING_EFFECT_DATA } = useAccessorySearchStaticContext();
  const alert = useAlert();

  const grindingEffects =
    ACCESSORY_GRINDINGEFFECT_MAP[option.accessoryCategory];
  const categoryOptionsArray = grindingEffects
    .filter(
      (grindingEffect) =>
        !option.accessoryGrindingEffectArray.find(
          (accessoryGrindingEffect) =>
            accessoryGrindingEffect.effectName.name === grindingEffect
        )
    )
    .map((grindingEffect) => ({
      label: grindingEffect,
      value: GRINDING_EFFECT_VALUE_MAP[grindingEffect],
    }));

  /**
   * isSelectDone 을 원래는 handleSelectGrindingEffect 메서드 내에서 정의했으나,
   * option 객체의 값이 함수가 맨 처음 정의될 당시의 값으로 고정되는 문제가 발생.
   * 이는 클로저의 기본 동작에 의한 문제로 판단됨.
   */
  const isSelectDone = option.accessoryGrindingEffectArray.length >= 3;
  const onSelect = useCallback(
    (selectedOption: { label: string; value: number }) => {
      if (!isSelectDone) {
        setAccessorySearchOptionArray((prev) => {
          return prev.map(
            (accessorySearchOption, accessorySearchOptionIndex) => {
              if (accessorySearchOptionIndex === optionIndex)
                return {
                  ...accessorySearchOption,
                  accessoryGrindingEffectArray: [
                    ...accessorySearchOption.accessoryGrindingEffectArray,
                    {
                      effectName: {
                        name: selectedOption.label as GrindingEffectKey,
                        value:
                          GRINDING_EFFECT_VALUE_MAP[
                            selectedOption.label as GrindingEffectKey
                          ],
                      },
                      effectValue: {
                        level: 2,
                        valueArray:
                          GRINDING_EFFECT_DATA[
                            selectedOption.label as GrindingEffectKey
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
      className={styles.grindingOptionSelect}
      width={180}
      height={40}
      placeholder="옵션 선택"
      options={categoryOptionsArray}
      onSelect={onSelect}
    />
  );
};

export default GrindingOptionSelect;
