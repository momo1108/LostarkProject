import useApiTagParser from "@/hooks/useApiTagParser";
import { GemTooltipProps } from "@/types/TEGCType";

const GemTooltip: React.FC<GemTooltipProps> = ({ data }) => {
  const { parseApiDataToHtmlString: parse } = useApiTagParser();
  return (
    <>
      <div>{parse(data.Name)}</div>
      <hr />
      <div className="gemTooltipBody">
        <div className="iconDiv">
          <img src={data.SkillIcon} alt="" />
        </div>
        <div className="descrDiv">
          <p>{data.Description[0]}</p>
          <p>{data.Description[1]}</p>
        </div>
      </div>
    </>
  );
};

export default GemTooltip;
