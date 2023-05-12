import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/character/Body.module.scss";
import { EquipmentSlotProps } from "@/types/CharacterType";

const EquipmentSlot: React.FC<EquipmentSlotProps> = ({
  grade,
  honing,
  iconUrl,
  qualityValue,
  contentSetter,
}) => {
  const { bgClassMaker } = useCssHook();
  return (
    <div
      data-tooltip-id="equipmentTooltip"
      onMouseEnter={contentSetter}
      className={`${styles.profileEquipmentSlot} ${grade}`}
    >
      <p className={styles.profileEquipmentHoning}>{honing}강</p>
      <img
        src={iconUrl}
        alt="로딩실패"
        className={styles.profileEquipmentIcon}
      />
      <div className={styles.profileEquipmentQualityBar}>
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
