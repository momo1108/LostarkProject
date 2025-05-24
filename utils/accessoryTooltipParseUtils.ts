import {
  ArmoryEquipmentType,
  EquipmentTooltip,
  EquipmentTooltipValue,
} from "@/types/LostarkApiType";

type IndentStringGroupElementValue = {
  Element_000: {
    contentStr: Record<string, Record<string, string>>;
    topStr: string;
  };
};

/**
 * 장비의 툴팁에 사용될 유틸 함수들을 정의합니다.
 */

function findTooltipValue<T>(
  tooltip: EquipmentTooltip,
  condition: (entry: { type: string; value: EquipmentTooltipValue }) => boolean
): T | null {
  const found = Object.values(tooltip).find(condition);
  return found ? (found.value as T) : null;
}

function parseItemPartBox(tooltip: EquipmentTooltip, keyword: string) {
  const value = findTooltipValue<Record<string, string>>(
    tooltip,
    ({ type, value }) =>
      type === "ItemPartBox" &&
      typeof value === "object" &&
      (value as Record<string, string>)?.Element_000?.includes(keyword)
  );
  return value
    ? { title: value.Element_000, description: value.Element_001 }
    : null;
}

function parseIndentStringGroup(
  tooltip: EquipmentTooltip,
  keyword: string,
  cleanElixir = false
) {
  const data = findTooltipValue<IndentStringGroupElementValue>(
    tooltip,
    ({ type, value }) =>
      type === "IndentStringGroup" &&
      typeof value === "object" &&
      (value as IndentStringGroupElementValue)?.Element_000?.topStr?.includes(
        keyword
      )
  )?.Element_000;

  if (!data) return null;

  return {
    title: data.topStr,
    descriptions: Object.values(data.contentStr).map((el) =>
      cleanElixir
        ? el.contentStr.replace(/<BR>['|"].+활성화 시,.+추가 효과 발동/, "")
        : el.contentStr
    ),
  };
}

/**
 * font 태그에서 size 속성만 제거하고 남은 속성들을 유지합니다.
 */
function removeSizeFromFontTag(rawText: string): string {
  return rawText.replace(/size\s*=\s*['"]\d+['"]/gi, "");
}

export const parseAccessoryTooltipData = (
  accessoryData: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  }
) => {
  const tooltip: EquipmentTooltip = JSON.parse(
    removeSizeFromFontTag(JSON.stringify(accessoryData.Tooltip))
  );

  const title = tooltip.Element_000.value as string;
  const partInfo = tooltip.Element_001.value as Record<string, any>;

  return {
    title,
    equipmentPart: partInfo.leftStr0,
    qualityText: partInfo.leftStr1,
    qualityValue: partInfo.qualityValue,
    itemLevelText: partInfo.leftStr2,
  };
};
