import styles from "@/styles/character/Body.module.scss";
import useApiTagParser from "@/hooks/useApiTagParser";
import { SkillTooltipProps } from "@/types/STType";

const SkillTooltip: React.FC<SkillTooltipProps> = ({ data }) => {
  const { parseApiDataToHtmlString: parse } = useApiTagParser();
  // console.log(data);

  return (
    <>
      <div>
        <p className={styles.skillTitle}>{data.Element_000.value}</p>
      </div>
      <hr />
      <div className={styles.skillEl1}>
        <img width={50} src={data.Element_001.value.slotData.iconPath} alt="" />
        <div className={styles.skillType}>
          <p className={styles.skillTypeDetail}>
            {parse(data.Element_001.value.name)}
            {parse(data.Element_001.value.level)}
          </p>
          <p className={styles.skillCooltime}>
            {parse(data.Element_001.value.leftText)}
          </p>
        </div>
      </div>
      <hr />
      <div className={styles.skillDescr}>
        <p className={styles.skillLevel}>{data.Element_003.value}</p>
        {data.Element_004.type === "MultiTextBox" ? (
          <>
            <p>{data.Element_004.value.replace("|", "")}</p>
            <p>{parse(data.Element_005.value)}</p>
          </>
        ) : (
          <p>{parse(data.Element_004.value)}</p>
        )}
      </div>
    </>
  );
};

export default SkillTooltip;
/*
 # 고정
0 - NameTagBox : 이름
- value
1 - CommonSkillTitle : 쿨감, 스킬 종류
- value - leftText(2:1), level(1:2), name(1:1)
2 - MultiTextBox : PVE,...
- value
3 - SingleTextBox : 스킬 레벨
- value

# 변동
4~
마나소모 - MultiTextBox
- value

각성의돌소모(각성기) - SingleTextBox
-value

스킬설명 - SingleTextBox
-value


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
