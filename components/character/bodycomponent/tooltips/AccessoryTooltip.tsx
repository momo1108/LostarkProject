import { gradeClassMap } from "@/types/GlobalType";
import useCssHook from "@/hooks/useBgClassMaker";
import { parseApiDataToHtmlString as parse } from "@/utils/apiParseUtils";
import { parseAccessoryTooltipData } from "@/utils/accessoryTooltipParseUtils";
import { Tooltip } from "react-tooltip";
import { ArmoryEquipmentType, EquipmentTooltip } from "@/types/LostarkApiType";

const AccessoryTooltip: React.FC<{
  data: ArmoryEquipmentType & {
    Tooltip: EquipmentTooltip;
  };
}> = ({ data }) => {
  const { bgClassMaker } = useCssHook();

  if (!data)
    return (
      <Tooltip
        id="accessoryTooltip"
        className="tooltip accessoryTooltip"
        place="bottom"
        clickable={true}
      >
        "Loading..."
      </Tooltip>
    );

  const {
    title,
    equipmentPart,
    qualityText,
    qualityValue,
    itemLevelText,
    basicEffect,
    refiningEffect,
    braceletEffect,
    abilityStoneFacetingEffect,
    abilityStoneEngraveEffect,
    arkPassivePointEffect,
  } = parseAccessoryTooltipData(data);

  return (
    <Tooltip
      id="accessoryTooltip"
      className="tooltip !text-[12px] !xs:text-[14px]"
      place="bottom"
      clickable={true}
      offset={0}
    >
      <div>{parse(title)}</div>
      <hr />
      <div className="tooltipGradeDiv">
        <img className={gradeClassMap[data.Grade]} src={data.Icon} alt="" />
        <div className="tooltipGradeInfo">
          <p>{parse(equipmentPart)}</p>
          {qualityText ? (
            <div className="qualityDiv">
              {parse(qualityText)}
              &nbsp;
              <span style={{ fontSize: 14 }}>{qualityValue}</span>
              <div>
                <div
                  style={{
                    width: `${qualityValue}%`,
                  }}
                  className={`h-3 ${bgClassMaker(qualityValue)}`}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          <p>{parse(itemLevelText)} </p>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-3">
        {basicEffect && (
          <div>
            <p>{parse(basicEffect.title)}</p>
            <p>{parse(basicEffect.description)}</p>
          </div>
        )}
        {refiningEffect && (
          <div className="">
            <p>{parse(refiningEffect.title)}</p>
            <p className="flex flex-col">{parse(refiningEffect.description)}</p>
          </div>
        )}
        {braceletEffect && (
          <div>
            <p>{parse(braceletEffect.title)}</p>
            <p>{parse(braceletEffect.description)}</p>
          </div>
        )}
        {abilityStoneFacetingEffect && (
          <div>
            <p>{parse(abilityStoneFacetingEffect.title)}</p>
            <p>{parse(abilityStoneFacetingEffect.description)}</p>
          </div>
        )}
        {abilityStoneEngraveEffect && (
          <div>
            <p>{parse(abilityStoneEngraveEffect.title)}</p>
            {abilityStoneEngraveEffect.descriptions.map(
              (descr, engraveIndex) => (
                <p key={`EquipTooltipP${engraveIndex}`}>{parse(descr)}</p>
              )
            )}
          </div>
        )}
        {arkPassivePointEffect && (
          <div>
            <p>{parse(arkPassivePointEffect.title)}</p>
            <p>{parse(arkPassivePointEffect.description)}</p>
          </div>
        )}
      </div>
      {/* <hr />
      <div className="tooltipOptionDiv">
        {data.Tooltip.Element_004?.type === "ItemPartBox" ? (
          <>
            <p>{parse(data.Tooltip.Element_004.value.Element_000)}</p>
            <p>{parse(data.Tooltip.Element_004.value.Element_001)}</p>
          </>
        ) : (
          <></>
        )}
        {["목걸이", "귀걸이", "반지"].includes(data.Type) ? (
          <>
            {data.Tooltip.Element_005?.type === "ItemPartBox" ? (
              <div className="my-3">
                <p>{parse(data.Tooltip.Element_005.value.Element_000)}</p>
                <p>{parse(data.Tooltip.Element_005.value.Element_001)}</p>
              </div>
            ) : (
              <></>
            )}
            {data.Tooltip.Element_006?.type === "ItemPartBox" ? (
              <>
                <p>{parse(data.Tooltip.Element_006.value.Element_000)}</p>
                <p>{parse(data.Tooltip.Element_006.value.Element_001)}</p>
              </>
            ) : data.Tooltip.Element_006.type === "IndentStringGroup" ? (
              <div>
                {parse(data.Tooltip.Element_006.value.Element_000.topStr)}
                {Object.values(
                  data.Tooltip.Element_006.value.Element_000.contentStr
                ).map((el: any, i1) => {
                  return (
                    <p key={`accessoryEngraving${i1}`}>
                      {parse(el.contentStr)}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="text-[#4691f6]">
                이벤트 캐릭터 전용 {data.Type}입니다.
              </div>
            )}
            {data.Tooltip.Element_007?.type === "ItemPartBox" ? (
              <>
                <p>{parse(data.Tooltip.Element_007.value.Element_000)}</p>
                <p>{parse(data.Tooltip.Element_007.value.Element_001)}</p>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {data.Type === "어빌리티 스톤" ? (
        <>
          {data.Tooltip.Element_005.type === "ItemPartBox" ? (
            <>
              <div>
                {Object.values(data.Tooltip.Element_005.value).map(
                  (el: any, i1) => {
                    return (
                      <p key={`abilityStoneExtraOption${i1}`}>{parse(el)}</p>
                    );
                  }
                )}
              </div>
              <div>
                {parse(data.Tooltip.Element_006.value.Element_000.topStr)}
                {Object.values(
                  data.Tooltip.Element_006.value.Element_000.contentStr
                ).map((el: any, i1) => {
                  return (
                    <p key={`abilityStoneEngraving${i1}`}>
                      {parse(el.contentStr)}
                    </p>
                  );
                })}
              </div>
            </>
          ) : data.Tooltip.Element_005.type === "IndentStringGroup" ? (
            <div>
              {parse(data.Tooltip.Element_005.value.Element_000.topStr)}
              {Object.values(
                data.Tooltip.Element_005.value.Element_000.contentStr
              ).map((el: any, i1) => {
                return (
                  <p key={`abilityStoneEngraving${i1}`}>
                    {parse(el.contentStr)}
                  </p>
                );
              })}
            </div>
          ) : (
            <div>
              <p className="text-[#4691f6]">
                이벤트 캐릭터 전용 어빌리티 스톤입니다.
              </p>
            </div>
          )}
        </>
      ) : (
        <></>
      )} */}
    </Tooltip>
  );
};

export default AccessoryTooltip;
/*
# 모든 악세 고정 옵션
Element_000 - NameTagBox
Element_001 - ItemTitle
- value
  - leftStr0, leftStr2
Element_002~Element_003 - 귀속, 거래회수

# 팔찌
Element_004 - 팔찌 효과
- value
  - Element_000~1 : 기본효과텍스트
Element_005 - 공백(prev. 부여 횟수) - IndentStringGroup
Element_006 - 부여 횟수 - SingleTextBox
  - value : 효과부여가능회수
Element_007 - 아크 패시브 포인트 - ItemPartBox
  - value
    - Element_000 : 텍스트("<FONT COLOR='#A9D0F5'>아크 패시브 포인트 효과</FONT>")
    - Element_001 : 포인트("도약 +18")
Element_008 - 획득처 - SingleTextBox
  - value : 획득처

# 목걸이, 귀걸이, 반지
## 고정
Element_004 - 기본 효과 힘/민/지 - ItemPartBox
- value
  - Element_000~1 : 텍스트
Element_005 - 연마 효과(prev. 치특신 특성) - ItemPartBox (주의. 연마 안하거나 옛날 악세인 경우 생략되므로, 순서가 한칸씩 당겨짐)
- value
  - Element_000~1 : 텍스트
## 변동
Element_006 - 공백(prev. 각인 효과) - IndentStringGroup
- (prev)value
  - Element_000
    - topStr : 무작위 각인효과 타이틀("<FONT SIZE='12' COLOR='#A9D0F5'>무작위 각인 효과</FONT>")
    - contentStr
      - Element_000~2 - contentStr : 각인효과
Element_007 - 아크 패시브 포인트 효과 - ItemPartBox
- value
  - Element_000 : 텍스트("<FONT COLOR='#A9D0F5'>아크 패시브 포인트 효과</FONT>")
  - Element_001 : 포인트("깨달음 +13")
Element_008 - 획득처 - SingleTextBox
- value : 텍스트("<Font color='#5FD3F1'>[카제로스 레이드] 1막 : 대지를 부수는 업화의 궤적 - 하드</font><BR><Font color='#5FD3F1'>[카제로스 레이드] 2막 : 부유하는 악몽의 진혼곡 - 하드</font><BR><Font color='#5FD3F1'>[카제로스 레이드] 3막 : 칠흑, 폭풍의 밤</font><BR><Font color='#5FD3F1'>그 외에 획득처가 더 존재합니다.</FONT>")

익스프레스 이벤트 캐릭의 경우 각인 지원기능때문에, 각인이 없는 악세서리가 제공됨.
따라서 6이 IndentStringGroup인지 체크 -> 이벤트 전용 악세서리 판정.

# 어빌리티 스톤
## 고정
Element_004 - 기본 효과
- value
  - Element_000~1 : 기본효과텍스트
## 변동
Element_005 - 세공 단계 보너스 - ItemPartBox
  - value
    - Element_000~1 : 보너스 텍스트
Element_006 - 각인 효과 - IndentStringGroup
  - value
    - Element_000
      - topStr : 무작위 각인효과 타이틀("<FONT SIZE='12' COLOR='#A9D0F5'>무작위 각인 효과</FONT>")
      - contentStr
        - Element_000 - contentStr : 각인효과1
        - Element_001 - contentStr : 각인효과2
        - Element_002 - contentStr : 페널티각인효과1
Element_007 - 공백 - IndentStringGroup
Element_008 - 아이템 스토리 - SingleTextBox
Element_009 - 판매불가 - SingleTextBox
Element_010 - 획득처 - SingleTextBox

익스프레스 이벤트 캐릭의 경우 각인 지원기능때문에, 세공 단계 보너스와 각인 효과가 생략되는 어빌리티 스톤이 제공됨.
따라서 5가 ItemPartBox인지 체크 -> IndentStringGroup 인지 체크 -> 이벤트 전용 어빌리티 스톤 판정.
 */
