import styles from "@/styles/character/Body.module.scss";
import { gradeClassMap } from "@/types/GlobalType";
import useApiTagParser from "@/hooks/useApiTagParser";
import { EquipmentTooltipProps } from "@/types/EAAType";

const AvatarTooltip: React.FC<EquipmentTooltipProps> = ({ data }) => {
  const { parseApiDataToHtmlString: parse } = useApiTagParser();

  return (
    <>
      <div>{parse(data.Tooltip.Element_000.value)}</div>
      <hr />
      <div className={styles.tooltipGradeDiv}>
        <img className={gradeClassMap[data.Grade]} src={data.Icon} alt="" />
        <div className={styles.tooltipGradeInfo}>
          <p>{parse(data.Tooltip.Element_001.value.leftStr0)}</p>
        </div>
      </div>
      <hr />
      <div>
        {data.Tooltip.Element_003.type === "MultiTextBox" ? (
          <p className={styles.tooltipTradeParagraph}>
            {parse(data.Tooltip.Element_002.value)}
            <span>{parse(data.Tooltip.Element_003.value)}</span>
          </p>
        ) : (
          <>
            <p>{parse(data.Tooltip.Element_002.value)}</p>
            <p className={styles.tooltipTradeParagraph}>
              {parse(data.Tooltip.Element_003.value)}{" "}
              {parse(data.Tooltip.Element_004.value)}
            </p>
          </>
        )}
      </div>
      <hr />
      {[4, 5, 6, 7, 8, 9].map((e: number) => {
        const tmp = data.Tooltip[`Element_00${e}`];
        if (!tmp) return;

        if (tmp.type === "SingleTextBox")
          return <div key={`avatarTooltipDiv${e}`}>{parse(tmp.value)}</div>;
        else if (tmp.type === "ItemPartBox") {
          return (
            <div key={`avatarTooltipDiv${e}`}>
              {Object.values(tmp.value).map((e: any) => {
                return <p key={`avatarTooltipInnerP${e}`}>{parse(e)}</p>;
              })}
            </div>
          );
        } else if (tmp.type === "SymbolString") {
          return (
            <div key={`avatarTooltipDiv${e}`}>
              <p>{parse(tmp.value.titleStr)}</p>
              <p>{parse(tmp.value.contentStr)}</p>
            </div>
          );
        }
      })}
    </>
  );
};

export default AvatarTooltip;
/*
 # 고정
0 - NameTagBox : 이름
- value
1 - ItemTitle : 등급
- value - leftStr0
2 - 직업

# 변동
3~
귀속여부/거래가능회수 - SingleTextBox
-value

거래가능(오른쪽정렬) - MultiTextBox
- value

덧입기 알림 - SingleTextBox
- value

기본 효과 - ItemPartBox
- value
  - Element_000~1(map돌리기) : 효과 및 수치

성향 - SymbolString
- value
  - titleStr : 성향 타이틀
	- contentStr : 수치

불가 여부 - SingleTextBox
- value
*/
