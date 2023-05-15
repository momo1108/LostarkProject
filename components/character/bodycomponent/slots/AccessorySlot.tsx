import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/character/Body.module.scss";
import { AccessorySlotProps } from "@/types/CharacterType";

const AccessorySlot: React.FC<AccessorySlotProps> = ({
  grade,
  iconUrl,
  qualityValue,
  showQuality,
  option,
  contentSetter,
}) => {
  const { bgClassMaker } = useCssHook();
  return (
    <div
      data-tooltip-id="accessoryTooltip"
      onMouseEnter={contentSetter}
      className={`${styles.profileAccessorySlot} ${grade}`}
    >
      <div
        className={`${showQuality ? styles.profileAccessoryOption : "hidden"}`}
      >
        {option?.split("<BR>").map((e, i) => (
          <p key={`accOptions${i}`}>{e.substring(0, 1) + e.substring(2)}</p>
        ))}
      </div>
      <img
        src={iconUrl}
        alt="로딩실패"
        className={styles.profileAccessoryIcon}
      />
      <div
        className={`${
          showQuality ? styles.profileAccessoryQualityBar : "hidden"
        }`}
      >
        <span className={styles.profileAccessoryQualityValue}>
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

export default AccessorySlot;
