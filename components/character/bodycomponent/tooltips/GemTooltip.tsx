import { parseApiDataToHtmlString as parse } from "@/utils/apiParseUtils";
import { GemTooltipProps } from "@/types/TEGCType";

const GemTooltip: React.FC<GemTooltipProps> = ({ data }) => {
  return (
    <>
      <div>{parse(data.Name)}</div>
      <hr />
      <div className="gemTooltipBody">
        {/* <div className="iconDiv">
          <img src={data.SkillIcon} alt="" />
        </div>
        <div className="descrDiv">
          <p>{data.Description[0]}</p>
          <p>{data.Description[1]}</p>
        </div> */}
      </div>
    </>
  );
};

export default GemTooltip;
