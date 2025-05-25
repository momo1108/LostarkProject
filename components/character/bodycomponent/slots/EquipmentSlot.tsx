import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/character/Body.module.scss";
import { gradeClassMap } from "@/types/GlobalType";
import { ArmoryEquipmentType, EquipmentTooltip } from "@/types/LostarkApiType";

const EquipmentSlot: React.FC<{
  equipmentData: ArmoryEquipmentType & {
      Tooltip: EquipmentTooltip;
    };
  onMouseEnter: () => void;
}> = ({
  equipmentData,
  onMouseEnter,
}) => {
  const { bgClassMaker } = useCssHook();
  const honing = equipmentData.Name.split(" ")[0];
  const iconUrl = equipmentData.Icon;
  const grade = gradeClassMap[equipmentData.Grade];
  const qualityValue = (equipmentData.Tooltip.Element_001.value as Record<string, number>).qualityValue;
  
  return (
    <div
      data-tooltip-id="equipmentTooltip"
      onMouseEnter={onMouseEnter}
      className={`${styles.profileEquipmentSlot} ${grade}`}
    >
      <p
        className={`${styles.profileEquipmentHoning}${
          honing.startsWith("+") ? "" : " hidden"
        }`}
      >
        {honing}강
      </p>
      <img
        src={iconUrl}
        alt="로딩실패"
        className={styles.profileEquipmentIcon}
      />
      <div
        className={styles.profileEquipmentQualityBar}
      >
        <span className={styles.profileEquipmentQualityValue}>
          {qualityValue}
        </span>
        <p
          style={{
            width: `${qualityValue}%`,
          }}
          className={`h-3 ${bgClassMaker(qualityValue)}`}
        ></p>
      </div>
    </div>
  );
};

export default EquipmentSlot;
