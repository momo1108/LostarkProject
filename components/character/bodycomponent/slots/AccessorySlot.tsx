import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/character/Body.module.scss";
import { AccessorySlotProps } from "@/types/EAAType";

const AccessorySlot: React.FC<AccessorySlotProps> = ({
  type,
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
        {["목걸이", "귀걸이", "반지"].includes(type)
          ? option
              ?.split("<BR>")
              .map((e, i) => <p key={`accOptions${i}`}>{e}</p>)
          : option}
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
