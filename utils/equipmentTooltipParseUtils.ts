import {
  ArmoryEquipmentType,
  EquipmentTooltip,
  EquipmentTooltipValue,
} from "@/types/LostarkApiType";
import { removeSizeFromFontTag } from "./apiParseUtils";

/**
 * 장비의 툴팁에 사용될 유틸 함수들을 정의합니다.
 */

const findTooltipValue = <T>(
  tooltip: EquipmentTooltip,
  condition: (entry: { type: string; value: EquipmentTooltipValue }) => boolean
): T | null => {
  const found = Object.values(tooltip).find(condition);
  return found ? (found.value as T) : null;
}

/**
 * 상급 재련 텍스트에서 강화 단계와 기본 효과 합산을 추출합니다.
 */
const parseAdvancedHoningText = (tooltip: EquipmentTooltip): {
  level: number;
  effectSum: number;
} => {
  const advancedHoning_rawText =
    findTooltipValue<string>(
      tooltip,
      ({ type, value }) =>
        type === "SingleTextBox" &&
        typeof value === "string" &&
        value.includes("상급 재련")
    ) ?? "";

  if (!advancedHoning_rawText) {
    return { level: 0, effectSum: 0 };
  }

  // 1. 모든 HTML 태그 제거 (대소문자 무시)
  const plainText = advancedHoning_rawText.replace(/<[^>]+>/gi, "");

  // 2. 줄바꿈 및 공백 정리
  const normalized = plainText.replace(/\s+/g, " ").trim();

  // 3. "숫자 + 단계" 찾기 (최초 1회만)
  const levelMatch = normalized.match(/(\d+)\s*단계/);
  const level = levelMatch ? parseInt(levelMatch[1], 10) : 0;

  // 4. "기본 효과 +숫자%" 패턴 전부 추출
  const effectRegex = /기본 효과\s*\+([\d.]+)%/g;
  let match;
  let effectSum = 0;

  while ((match = effectRegex.exec(normalized)) !== null) {
    const value = match[1];
    effectSum += parseFloat(value);
  }

  return { level, effectSum };
}

const parseItemPartBox = (tooltip: EquipmentTooltip, keyword: string) => {
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

type IndentStringGroupElementValue = {
  Element_000: {
    contentStr: Record<string, Record<string, string>>;
    topStr: string;
  };
};

const parseIndentStringGroup = (
  tooltip: EquipmentTooltip,
  keyword: string,
  cleanElixir = false
) => {
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

export const parseEquipmentTooltipData = (
  equipmentData: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  }
) => {
  console.log(equipmentData);
  const tooltip: EquipmentTooltip = JSON.parse(
    removeSizeFromFontTag(JSON.stringify(equipmentData.Tooltip))
  );

  const title = tooltip.Element_000.value as string;
  const partInfo = tooltip.Element_001.value as Record<string, any>;

  return {
    title,
    equipmentPart: partInfo.leftStr0 as string,
    qualityText: partInfo.leftStr1 as string,
    qualityValue: partInfo.qualityValue as number,
    itemLevelText: partInfo.leftStr2 as string,
    advancedHoningEffect: parseAdvancedHoningText(tooltip),
    basicEffect: parseItemPartBox(tooltip, "기본 효과"),
    additionalEffect: parseItemPartBox(tooltip, "추가 효과"),
    upgradeEffect: parseItemPartBox(tooltip, "[장비 업그레이드 효과]"),
    transcendenceEffect: parseIndentStringGroup(tooltip, "[초월]"),
    elixirEffect: parseIndentStringGroup(tooltip, "[엘릭서]", true),
    elixirAdditionalEffect: parseIndentStringGroup(tooltip, "연성 추가 효과"),
    siderealEffect: parseIndentStringGroup(tooltip, "에스더 효과"),
  };
};
