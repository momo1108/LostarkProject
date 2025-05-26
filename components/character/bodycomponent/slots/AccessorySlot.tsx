import useCssHook from "@/hooks/useBgClassMaker";
import styles from "@/styles/character/Body.module.scss";
import { ArmoryEquipmentType, EquipmentTooltip } from "@/types/LostarkApiType";
import {
  parseAccessoryTooltipData,
  parseAbilityStoneEffect,
  parseRefiningEffect,
} from "@/utils/accessoryTooltipParseUtils";
import { gradeClassMap } from "@/types/GlobalType";

const AccessorySlot: React.FC<{
  accessoryData: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  };
  characterClassName: string;
  onMouseEnter: () => void;
}> = ({ accessoryData, characterClassName, onMouseEnter }) => {
  const { bgClassMaker } = useCssHook();
  const { qualityText, qualityValue } =
    parseAccessoryTooltipData(accessoryData);
  const parsedRefiningEffect = parseRefiningEffect(
    accessoryData,
    characterClassName
  );
  const refiningEffectTextColors = ["rareColor", "epicColor", "legendaryColor"];
  const parsedAbilityStoneEffect =
    accessoryData.Type === "어빌리티 스톤"
      ? parseAbilityStoneEffect(accessoryData)
      : null;

  return (
    <div
      data-tooltip-id="accessoryTooltip"
      className={`${styles.profileAccessorySlot} ${
        gradeClassMap[accessoryData.Grade]
      }`}
      onMouseEnter={onMouseEnter}
    >
      {accessoryData.Type !== "팔찌" && (
        <div className={styles.profileAccessoryOption}>
          {parsedRefiningEffect?.map((el) => (
            <p key={el.name} className="flex justify-between items-center">
              <span
                className={`${
                  refiningEffectTextColors[el.optionLevel]
                } font-bold`}
              >
                {["하", "중", "상"][el.optionLevel]}
              </span>
              <span>{el.shortenedName}</span>
            </p>
          ))}
          {parsedAbilityStoneEffect?.map((el) => (
            <p key={el.name} className="flex justify-between items-center">
              <span className="font-bold">{el.level}</span>
              <span>{el.name}</span>
            </p>
          ))}
        </div>
      )}
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
