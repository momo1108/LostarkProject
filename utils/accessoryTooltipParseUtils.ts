import {
  ArmoryEquipmentType,
  EquipmentTooltip,
  EquipmentTooltipValue,
} from "@/types/LostarkApiType";
import {
  removeAllTagFromRawText,
  removeSizeFromFontTag,
} from "./apiParseUtils";
import {
  AccessoryGrade,
  AccessoryTier,
  RefiningEffectData,
  RefiningEffectKey,
} from "@/types/EngraveType";
import REFINING_EFFECT_DATA from "@/data/refiningEffectOptions.json";

const SHORTENED_ENGRAVE_NAME_MAP: Record<string, string> = {
  각성: "각성",
  강령술: "강령술",
  "강화 방패": "강화방패",
  "결투의 대가": "결대",
  구슬동자: "구슬동자",
  "굳은 의지": "굳은의지",
  "급소 타격": "급소타격",
  "기습의 대가": "기습대가",
  긴급구조: "긴급구조",
  "달인의 저력": "달인저력",
  돌격대장: "돌격대장",
  "마나 효율 증가": "마효증",
  "마나의 흐름": "마나흐름",
  바리케이드: "바리",
  "번개의 분노": "번개분노",
  "부러진 뼈": "부러진뼈",
  "분쇄의 주먹": "분쇄주먹",
  불굴: "불굴",
  선수필승: "선수필승",
  속전속결: "속전속결",
  "슈퍼 차지": "슈퍼차지",
  승부사: "승부사",
  "시선 집중": "시선집중",
  실드관통: "실드관통",
  아드레날린: "아드",
  "안정된 상태": "안상",
  "약자 무시": "약자무시",
  "에테르 포식자": "에포",
  "여신의 가호": "여신가호",
  "예리한 둔기": "예둔",
  원한: "원한",
  "위기 모면": "위기모면",
  "저주받은 인형": "저받",
  전문의: "전문의",
  "정기 흡수": "정기흡수",
  "정밀 단도": "정밀단도",
  "중갑 착용": "중갑착용",
  "질량 증가": "질량증가",
  "최대 마나 증가": "최마증가",
  추진력: "추진력",
  "타격의 대가": "타대",
  "탈출의 명수": "탈출명수",
  "폭발물 전문가": "폭발전문",
};

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
};

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
};

export const parseRefiningEffect = (
  accessoryData: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  },
  characterClassName: string
) => {
  const tooltip: EquipmentTooltip = accessoryData.Tooltip;

  const partInfo = JSON.parse(
    removeAllTagFromRawText(JSON.stringify(tooltip.Element_001.value))
  ) as Record<string, string | number>;

  // console.log(partInfo);

  const gradeText = partInfo.leftStr0 as string;
  const tierText = partInfo.leftStr2 as string;

  const grade = gradeText.split(" ")[0] as AccessoryGrade;
  const tier = parseInt(tierText.split(" ")[2]) as AccessoryTier;
  // console.log(grade);
  // console.log(tier);

  const refiningEffect = parseItemPartBox(tooltip, "연마 효과");
  if (!refiningEffect) return null;

  const splitText = refiningEffect.description.split("<BR>");

  // 2. 줄바꿈 및 공백 정리
  const normalizedSplitPlainText = splitText.map((text) =>
    removeAllTagFromRawText(text)
  );

  // console.log(normalizedSplitPlainText);

  // 3. 연마 효과 이름 / 수치 로 분리
  const parsedRefiningEffect = normalizedSplitPlainText.map((text) => {
    let [name, displayValue] = text.split("+").map((el) => el.trim());

    // 공격력, 무기 공격력 옵션만 수치 혹은 퍼센티지 두가지로 나뉘기 때문에 이를 name 에 적용
    if (name.startsWith("공격력")) {
      if (displayValue.endsWith("%")) name = "공격력 %";
      else name = "공격력 +";
    } else if (name.startsWith("무기 공격력")) {
      if (displayValue.endsWith("%")) name = "무기 공격력 %";
      else name = "무기 공격력 +";
    }

    // console.log(name);
    // console.log(displayValue);

    // REFINING_EFFECT_DATA 데이터와 캐릭터 정보 openAPI 데이터의 키값이 일치하지 않는 경우의 패턴을 찾아서 처리
    // ex. 적에게 주는 피해 <=> 적에게 주는 피해 증가
    const singleRefiningEffectData =
      (REFINING_EFFECT_DATA as RefiningEffectData)[name as RefiningEffectKey] ||
      (REFINING_EFFECT_DATA as RefiningEffectData)[
        `${name} 증가` as RefiningEffectKey
      ];

    const optionLevel = singleRefiningEffectData[tier][grade].findIndex(
      (el) => el.DisplayValue === displayValue
    );

    return {
      name,
      displayValue,
      optionLevel,
    };
  });

  // 4. 악세서리에 부여된 옵션 중 유효 옵션만 필터링(딜러/서포터 클래스를 구분하기 위해 characterClassName 사용)
  const validEffectNamesForDps = [
    "공격력 %",
    "공격력 +",
    "무기 공격력 %",
    "무기 공격력 +",
    "추가 피해",
    "적에게 주는 피해",
    "치명타 피해",
    "치명타 적중률",
  ];
  const validEffectNamesForSupport = [
    "무기 공격력 %",
    "무기 공격력 +",
    "낙인력",
    "세레나데, 신앙, 조화 게이지 획득량 증가",
    "아군 공격력 강화 효과",
    "아군 피해량 강화 효과",
    "파티원 보호막 효과",
    "파티원 회복 효과",
  ];

  const validParsedRefiningEffect = parsedRefiningEffect.filter((el) =>
    (["바드", "홀리나이트", "도화가"].includes(characterClassName)
      ? validEffectNamesForSupport
      : validEffectNamesForDps
    ).includes(el.name)
  );

  // 5. 악세서리 슬롯 컴포넌트에서 출력하기 위해 약어로 변환
  const shortenedNameMap: Record<string, string> = {
    "공격력 %": "공%",
    "공격력 +": "공+",
    "무기 공격력 %": "무공%",
    "무기 공격력 +": "무공+",
    "추가 피해": "추피",
    "적에게 주는 피해": "적주피",
    "치명타 피해": "치피",
    "치명타 적중률": "치적",
    낙인력: "낙인력",
    "세레나데, 신앙, 조화 게이지 획득량 증가": "아덴",
    "아군 공격력 강화 효과": "아공강",
    "아군 피해량 강화 효과": "아피강",
    "파티원 보호막 효과": "보호막",
    "파티원 회복 효과": "회복",
  };

  const validParsedRefiningEffectWithShortenedName =
    validParsedRefiningEffect.map((el) => ({
      ...el,
      shortenedName: shortenedNameMap[el.name],
    }));

  return validParsedRefiningEffectWithShortenedName;
};

export const parseAbilityStoneEffect = (
  abilityStoneData: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  }
) => {
  const tooltip: EquipmentTooltip = JSON.parse(
    removeAllTagFromRawText(JSON.stringify(abilityStoneData.Tooltip))
  );
  const engraveEffect = parseIndentStringGroup(tooltip, "각인 효과");
  if (!engraveEffect) return null;

  const unusedEffectNames = [
    "공격력 감소",
    "공격속도 감소",
    "방어력 감소",
    "이동속도 감소",
    "레벨 보너스",
  ];

  engraveEffect.descriptions = engraveEffect.descriptions.filter(
    (el) =>
      !unusedEffectNames.some((unusedEffectName) =>
        el.includes(unusedEffectName)
      )
  );

  const validEngraves = engraveEffect.descriptions.map((effect) => {
    const [name, level] = effect
      .replace(/[\[\]]/g, "")
      .split("Lv.")
      .map((el) => el.trim());

    let parsedLevel;
    switch (level) {
      case "0":
        parsedLevel = 0;
        break;
      case "1":
        parsedLevel = 6;
        break;
      case "2":
        parsedLevel = 7;
        break;
      case "3":
        parsedLevel = 9;
        break;
      case "4":
        parsedLevel = 10;
        break;
    }

    return {
      name: SHORTENED_ENGRAVE_NAME_MAP[name],
      level: parsedLevel,
    };
  });

  // console.log(validEngraves);

  return validEngraves;
};

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

  const basicEffect = parseItemPartBox(tooltip, "기본 효과");

  const refiningEffect = parseItemPartBox(tooltip, "연마 효과");
  if (refiningEffect) {
    refiningEffect.description = refiningEffect.description
      .toLowerCase()
      .replace(/<img[^>]*>/gi, "")
      .split("<br>")
      .map((el) => `<span>${el.trim()}</span>`)
      .join("");
  }

  const braceletEffect = parseItemPartBox(tooltip, "팔찌 효과");

  const abilityStoneFacetingEffect = parseItemPartBox(
    tooltip,
    "세공 단계 보너스"
  );

  const abilityStoneEngraveEffect = parseIndentStringGroup(
    tooltip,
    "무작위 각인 효과"
  );

  const arkPassivePointEffect = parseItemPartBox(
    tooltip,
    "아크 패시브 포인트 효과"
  );

  return {
    title,
    equipmentPart: partInfo.leftStr0 as string,
    qualityText: (partInfo.leftStr1 as string) || null,
    qualityValue: partInfo.qualityValue as number,
    itemLevelText: partInfo.leftStr2 as string,
    basicEffect,
    refiningEffect,
    braceletEffect,
    abilityStoneFacetingEffect,
    abilityStoneEngraveEffect,
    arkPassivePointEffect,
  };
};
