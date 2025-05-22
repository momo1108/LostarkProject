import { gradeClassMap } from "@/types/GlobalType";
import { ArmoryEquipmentType, EquipmentTooltip } from "@/types/LostarkApiType";
import parse, { domToReact } from "html-react-parser";

const stylePatterns = {
  fontSize: /style='font-size:[0-9]+"/g,
  color: /style='color:#[0-9A-Za-z]+"/g,
  textAlign: /style='text-align:[A-Z]+"/g,
};

export const parseApiDataToHtmlString = (
  html: string
): ReturnType<typeof domToReact> => {
  let checker: string = html;
  html = html.toUpperCase();

  // 아바타 성향 관련 전처리
  if (html.startsWith("|")) html = html.slice(1);
  html = html.replace(/&TDC_SMART|&TDC_COURAGE|&TDC_CHARM|&TDC_KIND/g, "");
  html = html.trim();

  html = html.replace(/['"]/g, `"`);
  html = html.replace(/FONT/g, "span");
  html = html.replace(/P/g, "p");
  html = html.replace(/ALIGN="/g, "style='text-align:");
  html = html.replace(/COLOR=""/g, "");
  html = html.replace(/COLOR="/g, "style='color:");
  html = html.replace(/SIZE="/g, "style='font-size:");
  let ex = stylePatterns.fontSize.exec(html);
  while (ex) {
    html =
      html.substring(0, ex.index + ex[0].length - 1) +
      "px;'" +
      html.substring(ex.index + ex[0].length);
    ex = stylePatterns.fontSize.exec(html);
  }

  ex = stylePatterns.color.exec(html);
  while (ex) {
    html =
      html.substring(0, ex.index + ex[0].length - 1) +
      ";'" +
      html.substring(ex.index + ex[0].length);
    ex = stylePatterns.color.exec(html);
  }

  ex = stylePatterns.textAlign.exec(html);
  while (ex) {
    html =
      html.substring(0, ex.index + ex[0].length - 1) +
      ";'" +
      html.substring(ex.index + ex[0].length);
    ex = stylePatterns.textAlign.exec(html);
  }

  html = html.toLowerCase();
  html = html.replace(
    /src="[a-zA-z]+transcendence_grade"/g,
    `src="/images/transcendence.png" style="display:inline-block;"`
  );
  html = html.replace(
    /src="[a-zA-z]+locked"/g,
    `src="/images/option_locked.png" style="display:inline-block;"`
  );
  html = html.replace(
    /src="[a-zA-z]+changeable"/g,
    `src="/images/option_changeable.png" style="display:inline-block;"`
  );
  // FONT태그에 스타일 2개인 경우
  html = html.replace(/;'\sstyle='/g, "; ");
  if (checker === "fefbweiufbwaueifbawiufb") {
    console.log(checker);
    console.log(html);
  }
  return parse(html);
};

export const parseAccessorySlotData = (
  accessoryData: ArmoryEquipmentType & {
    Tooltip: Record<
      string,
      { type: string; value: string | Record<string, number | string> }
    >;
  }
) => {
  const type = accessoryData.Type;
  const grade = gradeClassMap[accessoryData.Grade];
  const iconUrl = accessoryData.Icon;
  const qualityValue = (
    accessoryData.Tooltip.Element_001.value as Record<string, string | number>
  ).qualityValue as number;
  const showQuality = !(
    accessoryData.Type == "팔찌" || accessoryData.Type == "어빌리티 스톤"
  );
  let option = "";
  if (accessoryData.Type === "팔찌") {
    option = accessoryData.Tooltip.Element_006.value as string;
  } else {
    if (accessoryData.Tooltip.Element_005.type === "ItemPartBox") {
      option = (
        accessoryData.Tooltip.Element_005.value as Record<string, string>
      ).Element_001 as string;
    }
  }
  return {
    type,
    grade,
    iconUrl,
    qualityValue,
    showQuality,
    option,
  };
};

/**
 * 상급 재련 텍스트에서 강화 단계와 기본 효과 합산을 추출합니다.
 */
function parseAdvancedHoningText(rawText: string): {
  level: number;
  effectSum: number;
} {
  if (!rawText) {
    return { level: 0, effectSum: 0 };
  }

  // 1. 모든 HTML 태그 제거 (대소문자 무시)
  const plainText = rawText.replace(/<[^>]+>/gi, "");

  // 2. 줄바꿈 및 공백 정리
  const normalized = plainText.replace(/\s+/g, " ").trim();
  console.log(normalized);

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

export const parseEquipmentTooltipData = (
  equipmentData: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  }
) => {
  const { Type: type, Tooltip: tooltip } = equipmentData;

  const title = tooltip.Element_000.value as string;
  const equipmentPart = (tooltip.Element_001.value as Record<string, string>)
    .leftStr0;
  const qualityText = (tooltip.Element_001.value as Record<string, string>)
    .leftStr1;
  const qualityValue = (tooltip.Element_001.value as Record<string, number>)
    .qualityValue;
  const itemLevelText = (tooltip.Element_001.value as Record<string, string>)
    .leftStr2;

  const advancedHoning_rawText =
    (Object.values(tooltip).find(
      ({ type, value }) =>
        type === "SingleTextBox" &&
        typeof value === "string" &&
        value.includes("상급 재련")
    )?.value as string) || "";

  const advancedHoningEffect = parseAdvancedHoningText(advancedHoning_rawText);

  const basicEffect_original =
    Object.values(tooltip).find(
      ({ type, value }) =>
        type === "ItemPartBox" &&
        typeof value === "object" &&
        value !== null &&
        (value as Record<string, string>).Element_000.includes("기본 효과")
    )?.value || null;

  const basicEffect = {
    title: (basicEffect_original as Record<string, string>)
      .Element_000 as string,
    option: (basicEffect_original as Record<string, string>)
      .Element_001 as string,
  };

  const additionalEffect_original =
    Object.values(tooltip).find(
      ({ type, value }) =>
        type === "ItemPartBox" &&
        typeof value === "object" &&
        value !== null &&
        (value as Record<string, string>).Element_000.includes("추가 효과")
    )?.value || null;

  const additionalEffect = {
    title: (additionalEffect_original as Record<string, string>)
      .Element_000 as string,
    option: (additionalEffect_original as Record<string, string>)
      .Element_001 as string,
  };

  const upgradeEffect_original =
    Object.values(tooltip).find(
      ({ type, value }) =>
        type === "ItemPartBox" &&
        typeof value === "object" &&
        value !== null &&
        (value as Record<string, string>).Element_000.includes(
          "[장비 업그레이드 효과]"
        )
    )?.value || null;

  const upgradeEffect = {
    title: (upgradeEffect_original as Record<string, string>)
      .Element_000 as string,
    option: (upgradeEffect_original as Record<string, string>)
      .Element_001 as string,
  };

  switch (type) {
    case "무기":
      break;
    case "상의":
      break;
    case "하의":
      break;
    case "장갑":
      break;
    case "어깨":
      break;
    default:
      break;
  }

  return {
    title,
    equipmentPart,
    qualityText,
    qualityValue,
    itemLevelText,
    advancedHoningEffect,
    basicEffect,
    additionalEffect,
    upgradeEffect,
  };
};

export const parseEngravingPoint = (
  html: string
): ReturnType<typeof domToReact> => {
  const point: number = parseInt(html.replace(/<[^>]+>/g, "").slice(11));
  const color: string =
    point >= 12
      ? "#fe9600"
      : point >= 9
      ? "#ce43fc"
      : point >= 6
      ? "#00b5ff"
      : "#61ce02";

  return parse(`<span style="color:${color};">+${point}</span>`);
};

export const parseEngravingPointNumber = (html: string): number => {
  const point: number = parseInt(html.replace(/<[^>]+>/g, "").slice(11));
  const color: string =
    point >= 12
      ? "#fe9600"
      : point >= 9
      ? "#ce43fc"
      : point >= 6
      ? "#00b5ff"
      : "#61ce02";

  return point;
};

export const parseGemName = (html: string): [string, number] => {
  const info: string[] = html.replace(/<[^>]+>/g, "").split(" ");
  return [
    info[0].slice(0, info[0].length - 2) + info[1][0],
    info[1][0] === "멸" ? 0 : 1,
  ];
};

export const parseSkillPoint = (
  point: number
): ReturnType<typeof domToReact> => {
  const color: string =
    point >= 10 ? "#fe9600" : point >= 7 ? "#ce43fc" : "#00b5ff";

  return parse(
    `<span style="color:${color}; font-weight:800; font-size:13px;">${point}</span>`
  );
};

export const parseTextformat = (text: string): string => {
  const openPattern = /<textformat[\w\s\d='-]+>/g;
  const closePattern = /<\/textformat.+/g;
  const emptyFontPattern = /<font>\s+<\/font>/g;
  text = text.replace(openPattern, "");
  text = text.replace(closePattern, "");
  text = text.replace(emptyFontPattern, "");
  return text;
};
