import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/character/Body.module.scss";
import { AvatarSlotProps } from "@/types/EAAType";

const AvatarSlot: React.FC<AvatarSlotProps> = ({
  grade,
  iconUrl,
  contentSetter,
}) => {
  return (
    <div
      data-tooltip-id="avatarTooltip"
      onMouseEnter={contentSetter}
      className={`${styles.profileAvatarSlot} ${grade}`}
    >
      <img src={iconUrl} alt="로딩실패" className={styles.profileAvatarIcon} />
    </div>
  );
};

export default AvatarSlot;
