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
import OptionItemDeleteButton from "./OptionItemDeleteButton";

const AccessorySearchOptionItem: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  return (
    <li className={styles.singleAccessoryDiv}>
      <AccessoryCategorySettingDiv option={option} optionIndex={optionIndex} />
      <div className="flex items-end gap-4">
        <div className={styles.tierGradeDiv}>
          <TierSettingList option={option} optionIndex={optionIndex} />
          <GradeSettingList option={option} optionIndex={optionIndex} />
        </div>
        <div className={styles.grindingDiv}>
          <LevelSettingList option={option} optionIndex={optionIndex} />
          {/* 드롭다운에 헤더로는 "연마효과 선택" 이라 써놓고 설정해놓은 연마 횟수를 초과하지 않도록 드롭다운 선택시마다 배열 요소 추가 */}
          <div className="flex gap-4">
            <GrindingOptionSelect option={option} optionIndex={optionIndex} />
            {option.accessoryGrindingEffectArray.length ? (
              <ul className="flex flex-col w-[220px] py-[3px] text-sm font-bold justify-end items-center border rounded">
                {option.accessoryGrindingEffectArray.map(
                  (accessoryGrindingEffect, accessoryGrindingEffectIndex) => (
                    <li
                      className="flex justify-between px-1 items-center"
                      key={`accessoryGrindingEffect_${accessoryGrindingEffect.effectName.name}`}
                    >
                      <span className="w-24 truncate">
                        {accessoryGrindingEffect.effectName.name}
                      </span>
                      <GrindingValueSelect
                        option={option}
                        optionIndex={optionIndex}
                        effectIndex={accessoryGrindingEffectIndex}
                      />
                      <GrindingValueDeleteButton
                        optionIndex={optionIndex}
                        effectName={accessoryGrindingEffect.effectName.name}
                      />
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="flex justify-center items-center w-[220px] text-sm font-bold border rounded">
                선택된 연마옵션이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
      <OptionItemDeleteButton optionIndex={optionIndex} />
    </li>
  );
};

export default memo(AccessorySearchOptionItem);
