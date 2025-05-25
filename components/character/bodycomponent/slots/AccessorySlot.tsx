import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/character/Body.module.scss";
import AccessoryTooltip from "../tooltips/AccessoryTooltip";
import { ArmoryEquipmentType, EquipmentTooltip } from "@/types/LostarkApiType";
import { parseAccessoryTooltipData, parseRefiningEffect } from "@/utils/accessoryTooltipParseUtils";
import { gradeClassMap } from "@/types/GlobalType";

const AccessorySlot: React.FC<{accessoryData: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  }, characterClassName: string, onMouseEnter: () => void}> = ({
  accessoryData,
  characterClassName,
  onMouseEnter
}) => {
  const { bgClassMaker } = useCssHook();
  const {qualityText, qualityValue} = parseAccessoryTooltipData(accessoryData);
  const parsedRefiningEffect = parseRefiningEffect(accessoryData, characterClassName);
  
  return (
    <div
      data-tooltip-id="accessoryTooltip"
      className={`${styles.profileAccessorySlot} ${gradeClassMap[accessoryData.Grade]}`}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={accessoryData.Icon}
        alt="로딩실패"
        className={styles.profileAccessoryIcon}
      />
      <div
        className={`${
          qualityText ? styles.profileAccessoryQualityBar : "hidden"
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
