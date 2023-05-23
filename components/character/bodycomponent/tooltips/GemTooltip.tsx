import styles from "@/styles/character/Body.module.scss";
import useApiTagParser from "@/hooks/useApiTagParser";
import { GemTooltipProps } from "@/types/EGCType";

const GemTooltip: React.FC<GemTooltipProps> = ({ data }) => {
  const { parseApiDataToHtmlString: parse } = useApiTagParser();
  return (
    <>
      <div>{parse(data.Name)}</div>
      <hr />
      <div className={styles.gemTooltipBody}>
        <div className={styles.iconDiv}>
          <img src={data.SkillIcon} alt="" />
        </div>
        <div className={styles.descrDiv}>
          <p>{data.Description[0]}</p>
          <p>{data.Description[1]}</p>
        </div>
      </div>
    </>
  );
};

export default GemTooltip;
