import styles from "@/styles/character/Body.module.scss";
import { AccessorySlotProps } from "@/types/CharacterType";

const AccessorySlot: React.FC<AccessorySlotProps> = ({
  key,
  grade,
  iconUrl,
  qualityValue,
  showQuality,
}) => {
  return (
    <div key={key} className={`${styles.profileAccessorySlot} ${grade}`}>
      <img
        src={iconUrl}
        alt="로딩실패"
        className={styles.profileAccessoryIcon}
      />
      {showQuality ? (
        <div className={styles.profileAccessoryQualityBar}>
          <span className={styles.profileAccessoryQualityValue}>
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
      ) : (
        ""
      )}
    </div>
  );
};

export default AccessorySlot;
