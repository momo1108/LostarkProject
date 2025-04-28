import styles from "@/styles/accessory/Body.module.scss";
import AccessoryCategorySettingDiv from "./AccessoryCategorySettingDiv";
import TierSettingList from "./TierSettingList";
import GradeSettingList from "./GradeSettingList";
import GrindingSettingDiv from "./GrindingSettingDiv";
import { AccessorySearchOption } from "@/types/EngraveType";
import { memo } from "react";

const AccessorySearchOptionItem: React.FC<{
  option: AccessorySearchOption;
  optionIndex: number;
}> = ({ option, optionIndex }) => {
  return (
    <li
      className={styles.singleAccessoryDiv}
      key={`${option.accessoryCategory}_${optionIndex}`}
    >
      <AccessoryCategorySettingDiv index={optionIndex} />
      <div className={styles.settingDiv}>
        <div className={styles.tierGradeDiv}>
          <TierSettingList />
          <GradeSettingList />
        </div>
        <GrindingSettingDiv index={optionIndex} />
        {/* <ol className={styles.engraveLevelList}>
                  {[1, 2, 3].map((level) => {
                    return (
                      <li
                        key={`engrave_${e.name}_level_${level}`}
                        className={
                          e.level === level
                            ? `${engraveLevelColorMap[level]}BgColor ${engraveLevelColorMap[level]}BorderColor`
                            : `${engraveLevelColorMap[level]}Color ${engraveLevelColorMap[level]}BorderColor`
                        }
                        onClick={() => {
                          setTargetEngraveLevel(i, level);
                        }}
                      >
                        {level}
                      </li>
                    );
                  })}
                </ol> */}
      </div>
    </li>
  );
};

export default memo(AccessorySearchOptionItem);
