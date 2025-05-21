import styles from "@/styles/accessory/Body.module.scss";
import CategorySelect from "./optionitem/CategorySelect";
import { memo } from "react";
import TierSettingList from "./optionitem/TierSettingList";
import GradeSettingList from "./optionitem/GradeSettingList";
import LevelSelect from "./optionitem/LevelSelect";
import { AccessorySearchOption } from "@/types/EngraveType";
import GrindingOptionSelect from "./optionitem/GrindingOptionSelect";
import GrindingValueSelect from "./optionitem/GrindingValueSelect";
import GrindingValueDeleteButton from "./optionitem/GrindingValueDeleteButton";
import OptionItemDeleteButton from "./optionitem/OptionItemDeleteButton";
import QualitySelect from "./optionitem/QualitySelect";

const OptionItem: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  return (
    <li className={styles.optionItem}>
      <div className="flex flex-wrap justify-center xs:justify-start items-center text-lg gap-y-2 gap-x-4">
        <CategorySelect option={option} optionIndex={optionIndex} />
        <div className={styles.tierGradeDiv}>
          <TierSettingList option={option} optionIndex={optionIndex} />
          <GradeSettingList option={option} optionIndex={optionIndex} />
        </div>
        <div className={styles.levelQualityDiv}>
          <LevelSelect option={option} optionIndex={optionIndex} />
          <QualitySelect option={option} optionIndex={optionIndex} />
        </div>
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
      <OptionItemDeleteButton optionIndex={optionIndex} />
    </li>
  );
};

export default memo(OptionItem);
