import styles from "@/styles/character/Body.module.scss";
import { EquipmentSlotProps } from "@/types/CharacterType";

const EquipmentSlot: React.FC<EquipmentSlotProps> = ({
  grade,
  honing,
  iconUrl,
  qualityValue,
  contentSetter,
}) => {
  return (
    <div
      data-tooltip-id="equipmentTooltip"
      data-tooltip-delay-hide={300}
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
          className={`h-3 ${
            qualityValue < 30
              ? "bg-[#ffd200]"
              : qualityValue < 70
              ? "bg-[#61ce02]"
              : qualityValue < 90
              ? "bg-[#00B5FF]"
              : qualityValue < 100
              ? "bg-[#CE43FC]"
              : "bg-[#FE9600]"
          }`}
        ></p>
      </div>
    </div>
  );
};

export default EquipmentSlot;
