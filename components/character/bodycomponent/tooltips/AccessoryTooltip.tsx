import { gradeClassMap } from "@/types/GlobalType";
import useApiTagParser from "@/hooks/useApiTagParser";
import useCssHook from "@/hooks/useBgClassMaker";
import { AccessoryTooltipProps } from "@/types/EAAType";

const AccessoryTooltip: React.FC<AccessoryTooltipProps> = ({ data }) => {
  const { parseApiDataToHtmlString: parse } = useApiTagParser();
  const { bgClassMaker } = useCssHook();
  const elements = [
    "_007",
    "_008",
    "_009",
    "_010",
    "_011",
    "_012",
    "_013",
    "_014",
    "_015",
    "_016",
    "_017",
  ];
  return (
    <>
      <div>{parse(data.Tooltip.Element_000.value)}</div>
      <hr />
      <div className="tooltipGradeDiv">
        <img className={gradeClassMap[data.Grade]} src={data.Icon} alt="" />
        <div className="tooltipGradeInfo">
          <p>{parse(data.Tooltip.Element_001.value.leftStr0)}</p>
          {["목걸이", "귀걸이", "반지"].includes(data.Type) ? (
            <div className="qualityDiv">
              {parse(data.Tooltip.Element_001.value.leftStr1)}
              &nbsp;
              <span style={{ fontSize: 14 }}>
                {data.Tooltip.Element_001.value.qualityValue}
              </span>
              <div>
                <div
                  style={{
                    width: `${data.Tooltip.Element_001.value.qualityValue}%`,
                  }}
                  className={`h-3 ${bgClassMaker(
                    data.Tooltip.Element_001.value.qualityValue
                  )}`}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          <p>{parse(data.Tooltip.Element_001.value.leftStr2)} </p>
        </div>
      </div>
      <hr />
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
      )}
    </>
  );
};

export default AccessoryTooltip;
/*
# 팔찌
## 고정
0 - NameTagBox
1 - ItemTitle
- value
  - leftStr0, leftStr2
2~3 - 귀속, 거래회수
4 - 팔찌 효과
- value
  - Element_000~1 : 기본효과텍스트
5 - 효과부여가능회수
6 - 획득처

# 목걸이, 귀걸이, 반지
## 고정
0 - NameTagBox
1 - ItemTitle
2~3 - 귀속, 거래회수
4 - 기본 효과 힘/민/지 - ItemPartBox
- value
  - Element_000~1 : 텍스트
5 - 추가 효과 치/특/신 - ItemPartBox
- value
  - Element_000~1 : 텍스트
## 변동
6 - 각인 효과 - IndentStringGroup
- value
  - Element_000
    - topStr : 무작위 각인효과 타이틀("<FONT SIZE='12' COLOR='#A9D0F5'>무작위 각인 효과</FONT>")
    - contentStr
      - Element_000~2 - contentStr : 각인효과
7 - 품질 업그레이드 불가 타이틀 - SingleTextBox
8 - 획득처 - SingleTextBox

익스프레스 이벤트 캐릭의 경우 각인 지원기능때문에, 각인이 없는 악세서리가 제공됨.
따라서 6이 IndentStringGroup인지 체크 -> 이벤트 전용 악세서리 판정.

# 어빌리티 스톤
## 고정
0 - NameTagBox
1 - ItemTitle
- value
  - leftStr0, leftStr2
2~3 - 귀속, 거래회수
4 - 기본 효과
- value
  - Element_000~1 : 기본효과텍스트
## 변동
5~
세공 단계 보너스 - ItemPartBox
- value
  - Element_000~1 : 보너스 텍스트
각인 효과 - IndentStringGroup
- value
  - Element_000
    - topStr : 무작위 각인효과 타이틀("<FONT SIZE='12' COLOR='#A9D0F5'>무작위 각인 효과</FONT>")
    - contentStr
      - Element_000~2 - contentStr : 각인효과
아이템 스토리 - SingleTextBox
판매불가 - SingleTextBox
획득처 - SingleTextBox

익스프레스 이벤트 캐릭의 경우 각인 지원기능때문에, 세공 단계 보너스와 각인 효과가 생략되는 어빌리티 스톤이 제공됨.
따라서 5가 ItemPartBox인지 체크 -> IndentStringGroup 인지 체크 -> 이벤트 전용 어빌리티 스톤 판정.
 */
