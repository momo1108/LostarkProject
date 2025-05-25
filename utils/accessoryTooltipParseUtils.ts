import {
  ArmoryEquipmentType,
  EquipmentTooltip,
  EquipmentTooltipValue,
} from "@/types/LostarkApiType";
import { removeAllTagFromRawText, removeSizeFromFontTag } from "./apiParseUtils";
import { AccessoryGrade, AccessoryTier, RefiningEffectData, RefiningEffectKey } from "@/types/EngraveType";
import REFINING_EFFECT_DATA from "@/data/refiningEffectOptions.json";

type IndentStringGroupElementValue = {
  Element_000: {
    contentStr: Record<string, Record<string, string>>;
    topStr: string;
  };
};

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

export const parseRefiningEffect = (accessoryData: ArmoryEquipmentType & {
  Tooltip: EquipmentTooltip;
}, characterClassName:string) => {
  const tooltip: EquipmentTooltip = JSON.parse(
    removeAllTagFromRawText(JSON.stringify(accessoryData.Tooltip))
  );

  const partInfo = tooltip.Element_001.value as Record<string, string | number>;

  const gradeText = (partInfo.leftStr0 as string);
  const tierText = (partInfo.leftStr2 as string);

  const grade = gradeText.split(" ")[0] as AccessoryGrade;
  const tier = parseInt(tierText.split(" ")[2]) as AccessoryTier;

  const refiningEffect = parseItemPartBox(tooltip, "연마 효과");
  if (!refiningEffect) return null;

  const splitText = refiningEffect.description.split("<BR>");


  // 2. 줄바꿈 및 공백 정리
  const normalizedSplitPlainText = splitText.map((text) => removeAllTagFromRawText(text));

  // 3. 연마 효과 이름 / 수치 로 분리
  const parsedRefiningEffect = normalizedSplitPlainText.map((text) => {
    let [name, displayValue] = text.split("+").map((el) => el.trim());

    // 공격력, 무기 공격력 옵션만 수치 혹은 퍼센티지 두가지로 나뉘기 때문에 이를 name 에 적용
    if (name.startsWith('공격력')) {
      if (displayValue.endsWith('%')) name = '공격력 %';
      else name = '공격력 +';
    } else if (name.startsWith('무기 공격력')) {
      if (displayValue.endsWith('%')) name = '무기 공격력 %';
      else name = '무기 공격력 +';
    }

    // REFINING_EFFECT_DATA 데이터와 캐릭터 정보 openAPI 데이터의 키값이 일치하지 않는 경우의 패턴을 찾아서 처리
    // ex. 적에게 주는 피해 <=> 적에게 주는 피해 증가
    const singleRefiningEffectData = (REFINING_EFFECT_DATA as RefiningEffectData)[name as RefiningEffectKey] || (REFINING_EFFECT_DATA as RefiningEffectData)[`${name} 증가` as RefiningEffectKey];

    const optionLevel = singleRefiningEffectData[tier][grade].findIndex((el) => el.DisplayValue === displayValue);

    return {
      name,
      displayValue,
      optionLevel,
    }
  })

  const validEffectNamesForDps = ['공격력 %', '공격력 +', '무기 공격력 %', '무기 공격력 +', '추가 피해', '적에게 주는 피해', '치명타 피해', '치명타 적중률'];
  const validEffectNamesForSupport = ['무기 공격력 %', '무기 공격력 +','낙인력', '세레나데, 신앙, 조화 게이지 획득량 증가', '아군 공격력 강화 효과', '아군 피해량 강화 효과', '파티원 보호막 효과', '파티원 회복 효과'];
  
  return parsedRefiningEffect.filter((el) => (['바드', '홀리나이트', '도화가'].includes(characterClassName) ?validEffectNamesForSupport : validEffectNamesForDps).includes(el.name));
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
  const partInfo = tooltip.Element_001.value as Record<string, string | number>;

  const refiningEffect = parseItemPartBox(tooltip, "연마 효과");

  return {
    title,
    equipmentPart: partInfo.leftStr0 as string,
    qualityText: partInfo.leftStr1 as string || null,
    qualityValue: partInfo.qualityValue as number,
    itemLevelText: partInfo.leftStr2 as string,
    basicEffect: parseItemPartBox(tooltip, "기본 효과"),
    refiningEffect,
    
  };
};
