import styles from "@/styles/accessory/Body.module.scss";
import MySelect from "@/components/custom/MySelect";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import {
  ACCESSORY_GRINDINGEFFECT_MAP,
  GRINDING_EFFECT_VALUE_MAP,
} from "@/types/EngraveType";
import { useCallback } from "react";

const GrindingSettingDiv: React.FC<{ index: number }> = ({ index }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const grindingEffects = ACCESSORY_GRINDINGEFFECT_MAP["목걸이"];
  const optionsArray = grindingEffects.map((grindingEffect) => ({
    label: grindingEffect,
    value: GRINDING_EFFECT_VALUE_MAP[grindingEffect],
  }));
  const handleSelect = useCallback(
    (option: { label: string; value: number }) => {
      setAccessorySearchOptionArray((array) => {
        return array.map(
          (accessorySearchOption, accessorySearchOptionIndex) => {
            if (accessorySearchOptionIndex === index)
              accessorySearchOption.grindingEffectOptionValue = option.value;
            return accessorySearchOption;
          }
        );
      });
    },
    []
  );

  return (
    <div className={styles.grindingDiv}>
      <MySelect
        className={styles.grindingOptionSelect}
        width={180}
        height={40}
        defaultSelectedIndex={0}
        options={optionsArray}
        onSelect={handleSelect}
      />
      {/* handleSelect 로 전체 악세서리 검색 세팅 정보를 업데이트 하도록 하고,
         여기에는 MySelect 로 선택된 연마정보에 따른 Value 들을 선택할 수 있게 구현  */}
    </div>
  );
};

export default GrindingSettingDiv;
