import styles from "@/styles/accessory/Body.module.scss";
import AccessoryCategorySettingDiv from "./AccessoryCategorySettingDiv";
import TierSettingList from "./TierSettingList";
import GradeSettingList from "./GradeSettingList";
import { memo } from "react";
import { AccessorySearchOption } from "@/types/EngraveType";
import GrindingOptionSelect from "./GrindingOptionSelect";
import GrindingValueSelect from "./GrindingValueSelect";
import LevelSettingList from "./LevelSettingList";
import GrindingValueDeleteButton from "./GrindingValueDeleteButton";

const AccessorySearchOptionItem: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  return (
    <li className={styles.singleAccessoryDiv}>
      <AccessoryCategorySettingDiv option={option} optionIndex={optionIndex} />
      <div className={styles.settingDiv}>
        <div className={styles.tierGradeDiv}>
          <TierSettingList option={option} optionIndex={optionIndex} />
          <GradeSettingList option={option} optionIndex={optionIndex} />
        </div>
        <div className={styles.grindingDiv}>
          <LevelSettingList option={option} optionIndex={optionIndex} />
          {/* 드롭다운에 헤더로는 "연마효과 선택" 이라 써놓고 설정해놓은 연마 횟수를 초과하지 않도록 드롭다운 선택시마다 배열 요소 추가 */}
          <div className="flex gap-4">
            <GrindingOptionSelect option={option} optionIndex={optionIndex} />
            <ul className="flex flex-col text-sm font-bold justify-end">
              {option.accessoryGrindingEffectArray.map(
                (accessoryGrindingEffect, accessoryGrindingEffectIndex) => (
                  <li className="flex items-center">
                    <span className="w-24 truncate">
                      {accessoryGrindingEffect.effectName.name}
                    </span>
                    <GrindingValueSelect
                      option={option}
                      optionIndex={optionIndex}
                      effectIndex={accessoryGrindingEffectIndex}
                    />
                    <GrindingValueDeleteButton
                      option={option}
                      optionIndex={optionIndex}
                      effectIndex={accessoryGrindingEffectIndex}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};

export default memo(AccessorySearchOptionItem);
