import { gradeClassMap } from "@/types/GlobalType";
import useCssHook from "@/hooks/useBgClassMaker";
import { EquipmentTooltipProps } from "@/types/EAAType";
import { Tooltip } from "react-tooltip";
import { parseApiDataToHtmlString as parse } from "@/utils/apiParseUtils";
import { parseEquipmentTooltipData } from "@/utils/equipmentTooltipParseUtils";

const EquipmentTooltip: React.FC<EquipmentTooltipProps> = ({ data }) => {
  const { bgClassMaker } = useCssHook();

  if (!data)
    return (
      <Tooltip
        id="equipmentTooltip"
        className="tooltip"
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
    advancedHoningEffect,
    basicEffect,
    additionalEffect,
    transcendenceEffect,
    elixirEffect,
    elixirAdditionalEffect,
    siderealEffect,
    upgradeEffect,
  } = parseEquipmentTooltipData(data);

  return (
    <Tooltip
      id="equipmentTooltip"
      className="tooltip !text-[12px] !xs:text-[14px]"
      place="bottom"
      clickable={true}
    >
      <div>{parse(title)}</div>
      <hr />
      <div className="tooltipGradeDiv">
        <img className={gradeClassMap[data.Grade]} src={data.Icon} alt="" />
        <div className="tooltipGradeInfo">
          <p>{parse(equipmentPart)}</p>
          {qualityValue >= 0 ? (
            <div className="qualityDiv">
              {parse(qualityText)}
              &nbsp;
              <span>{qualityValue}</span>
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
        {advancedHoningEffect.level > 0 && (
          <div className="flex gap-2">
            <p className="text-[#A8EA6C]">[상급 재련]</p>
            <p>
              <span className="text-[#FFD200]">
                {advancedHoningEffect.level}
              </span>
              단계
            </p>
            {advancedHoningEffect.effectSum > 0 && (
              <p>
                기본 효과{" "}
                <span className="text-[#FFD200]">
                  +{advancedHoningEffect.effectSum}%
                </span>
              </p>
            )}
          </div>
        )}
        <div>
          {basicEffect ? (
            <>
              <p>{parse(basicEffect.title)}</p>
              <p>{parse(basicEffect.description)}</p>
            </>
          ) : (
            <></>
          )}
          {additionalEffect ? (
            <>
              <p>{parse(additionalEffect.title)}</p>
              <p>{parse(additionalEffect.description)}</p>
            </>
          ) : (
            <></>
          )}
        </div>
        {transcendenceEffect && (
          <div>
            <p>{parse(transcendenceEffect.title)}</p>
            {transcendenceEffect.descriptions.map((descr, i2) => (
              <p key={`EquipTooltipP${i2}`}>{parse(descr)}</p>
            ))}
          </div>
        )}
        {elixirEffect && (
          <div>
            <p>{parse(elixirEffect.title)}</p>
            {elixirEffect.descriptions.map((descr, i2) => (
              <p key={`EquipTooltipP${i2}`}>{parse(descr)}</p>
            ))}
          </div>
        )}
        {elixirAdditionalEffect && (
          <div>
            <p>{parse(elixirAdditionalEffect.title)}</p>
            {elixirAdditionalEffect.descriptions.map((descr, i2) => (
              <p key={`EquipTooltipP${i2}`}>{parse(descr)}</p>
            ))}
          </div>
        )}
        {siderealEffect && (
          <div>
            <p>{parse(siderealEffect.title)}</p>
            {siderealEffect.descriptions.map((descr, i2) => (
              <p key={`EquipTooltipP${i2}`}>{parse(descr)}</p>
            ))}
          </div>
        )}
        {upgradeEffect && (
          <div>
            <p>{parse(upgradeEffect.title)}</p>
            <p>{parse(upgradeEffect.description)}</p>
          </div>
        )}
      </div>
      {/* {elements.map((e: string) => {
        if (!data.Tooltip[`Element${e}`]) return "";
        else {
          if (data.Tooltip[`Element${e}`].type === "IndentStringGroup") {
            return (
              <div className="tooltipOuterDiv" key={`EquipTooltipDiv${e}`}>
                {Object.values(data.Tooltip[`Element${e}`].value).map(
                  (el: any, i1) => {
                    return (
                      <div key={`EquipTooltipDiv${e}_${i1}`}>
                        <p>{parse(el.topStr)}</p>
                        {Object.values(el.contentStr).map((el2: any, i2) => {
                          return (
                            <p key={`EquipTooltipP${e}_${i1}_${i2}`}>
                              {parse(el2.contentStr)}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </div>
            );
          } else if (data.Tooltip[`Element${e}`].type === "ItemPartBox") {
            return (
              <div className="tooltipOuterDiv" key={`EquipTooltipDiv${e}`}>
                {Object.values(data.Tooltip[`Element${e}`].value).map(
                  (el: any, i1) => {
                    return (
                      <div key={`EquipTooltipDiv${e}_${i1}`}>{parse(el)}</div>
                    );
                  }
                )}
              </div>
            );
          } else if (
            data.Tooltip[`Element${e}`].type === "SingleTextBox" &&
            data.Tooltip[`Element${e}`].value.includes("엘라")
          ) {
            return (
              <div key={`EquipTooltipDiv${e}`}>
                {parse(data.Tooltip[`Element${e}`].value)}
              </div>
            );
          }
        }
      })} */}
    </Tooltip>
  );
};

export default EquipmentTooltip;
/*
 # 고정
0 - NameTagBox
1 - ItemTitle
2~4 - 직업, 귀속, 거래회수
5 - 기본효과
6 - 추가효과

# 변동
7~
에스더 효과 - IndentStringGroup
- value
	- Element_000
		- topStr : 에스더 효과 타이틀("<FONT COLOR='#A9D0F5'>에스더 효과</FONT><FONT COLOR='#ff76e0'> [이난나]</FONT>")
		- contentStr
			- Element_000 - contentStr : 에스더효과

재료 경험치 - Progress (무쓸모)
엘릭서 효과 - IndentStringGroup
- value
	- Element_000
		- topStr : 엘릭서 효과 타이틀("<FONT SIZE='12' COLOR='#A9D0F5'>엘릭서 효과</FONT><br><font color='#91fe02'><FONT size='12'>지혜의 엘릭서</FONT></font>")
		- contentStr(map돌리기)
			- Element_000 - contentStr : 부여효과1
			- Element_001 - contentStr : 부여효과2


엘릭서 세트 효과 - IndentStringGroup
- value
	- Element_000
		- topStr 연성 추가 효과 타이틀("<FONT SIZE='12' COLOR='#A9D0F5'>연성 추가 효과</FONT><br><FONT SIZE='12' color='#91FE02'>선각자 (2단계)</FONT>")
		- contentStr(map돌리기)
			- Element_000 - contentStr : 1단계 효과
			- Element_001 - contentStr : 2단계 효과
			

장비 세트 효과 레벨 - ItemPartBox
- value
	- Element_000 : 세트 효과 레벨 타이틀
	- Element_001 : 세트 효과, 레벨


장비 세트 효과 - IndentStringGroup
- value
	- Element_000
		- topStr : 세트 타이틀
		- contentStr(map돌리기)
			- Element_000~5 - contentStr : 세트, 부위
	- Element_001
		- topStr : 2세트 효과 타이틀
		- contentStr
			- Element_000 - contentStr : 2세트 효과 설명
	- Element_002
		- topStr : 4세트 효과 타이틀
		- contentStr
			- Element_000 - contentStr : 4세트 효과 설명
	- Element_003
		- topStr : 6세트 효과 타이틀
		- contentStr
			- Element_000 - contentStr : 6세트 효과 설명

엘라 부여 여부 - SingleTextBox
	- value : 엘라부여여부 설명("<FONT COLOR='#E2C87A'><FONT SIZE='12'><FONT COLOR='#ffd200'>엘라 부여 완료</FONT></FONT></FONT>")

순인듯
 */
