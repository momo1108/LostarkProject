import styles from "@/styles/character/Body.module.scss";
import { gradeClassMap } from "@/types/GlobalType";
import useApiTagParser from "@/hooks/useApiTagParser";
import useCssHook from "@/hooks/useBgClassMaker";
import { EquipmentTooltipProps } from "@/types/EAAType";

const EquipmentTooltip: React.FC<EquipmentTooltipProps> = ({ data }) => {
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
      <div className={styles.tooltipGradeDiv}>
        <img className={gradeClassMap[data.Grade]} src={data.Icon} alt="" />
        <div className={styles.tooltipGradeInfo}>
          <p>{parse(data.Tooltip.Element_001.value.leftStr0)}</p>
          {data.Tooltip.Element_001.value.qualityValue >= 0 ? (
            <div className={styles.qualityDiv}>
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
      <div className={styles.tooltipOptionDiv}>
        {data.Tooltip.Element_005?.type === "ItemPartBox" ? (
          <>
            <p>{parse(data.Tooltip.Element_005.value.Element_000)}</p>
            <p>{parse(data.Tooltip.Element_005.value.Element_001)}</p>
          </>
        ) : (
          <></>
        )}
        {data.Tooltip.Element_006?.type === "ItemPartBox" ? (
          <>
            <p>{parse(data.Tooltip.Element_006.value.Element_000)}</p>
            <p>{parse(data.Tooltip.Element_006.value.Element_001)}</p>
          </>
        ) : (
          <></>
        )}
        {data.Tooltip.Element_007?.type === "ItemPartBox" ? (
          <>
            <p>{parse(data.Tooltip.Element_007.value.Element_000)}</p>
            <p>{parse(data.Tooltip.Element_007.value.Element_001)}</p>
          </>
        ) : (
          <></>
        )}
      </div>
      {elements.map((e: string) => {
        if (!data.Tooltip[`Element${e}`]) return "";
        else {
          if (data.Tooltip[`Element${e}`].type === "IndentStringGroup") {
            return (
              <div
                className={styles.tooltipOuterDiv}
                key={`EquipTooltipDiv${e}`}
              >
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
              <div
                className={styles.tooltipOuterDiv}
                key={`EquipTooltipDiv${e}`}
              >
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
      })}
    </>
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
