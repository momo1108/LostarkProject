import styles from "@/styles/accessory/Body.module.scss";
import CategorySelect from "./optionitem/CategorySelect";
import { memo } from "react";
import TierSettingList from "./optionitem/TierSettingList";
import GradeSettingList from "./optionitem/GradeSettingList";
import LevelSelect from "./optionitem/LevelSelect";
import { AccessorySearchOption } from "@/types/EngraveType";
import RefiningOptionSelect from "./optionitem/RefiningOptionSelect";
import RefiningValueSelect from "./optionitem/RefiningValueSelect";
import RefiningValueDeleteButton from "./optionitem/RefiningValueDeleteButton";
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
        <RefiningOptionSelect option={option} optionIndex={optionIndex} />
        {option.accessoryRefiningEffectArray.length ? (
          <ul className="flex flex-col w-[220px] min-h-[68px] py-[3px] text-sm font-bold justify-end items-center border rounded">
            {option.accessoryRefiningEffectArray.map(
              (accessoryRefiningEffect, accessoryRefiningEffectIndex) => (
                <li
                  className="flex justify-between px-1 items-center"
                  key={`accessoryRefiningEffect_${accessoryRefiningEffect.effectName.name}`}
                >
                  <span className="w-24 truncate">
                    {accessoryRefiningEffect.effectName.name}
                  </span>
                  <RefiningValueSelect
                    option={option}
                    optionIndex={optionIndex}
                    effectIndex={accessoryRefiningEffectIndex}
                  />
                  <RefiningValueDeleteButton
                    optionIndex={optionIndex}
                    effectName={accessoryRefiningEffect.effectName.name}
                  />
                </li>
              )
            )}
          </ul>
        ) : (
          <p className="flex min-h-[68px] justify-center items-center w-[220px] text-sm font-bold border rounded">
            선택된 연마옵션이 없습니다.
          </p>
        )}
      </div>
      <OptionItemDeleteButton optionIndex={optionIndex} />
    </li>
  );
};

export default memo(OptionItem);
