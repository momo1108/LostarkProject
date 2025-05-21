import { parseApiDataToHtmlString as parse } from "@/utils/apiParseUtils";
import { RuneTooltipProps } from "@/types/STType";

const RuneTooltip: React.FC<RuneTooltipProps> = ({ data }) => {
  // console.log(data);

  return (
    <>
      <div>{parse(data.Element_000.value)}</div>
      <hr />
      <div>
        <p>{parse(data.Element_002.value.Element_000)}</p>
        <p>{parse(data.Element_002.value.Element_001)}</p>
      </div>
    </>
  );
};

export default RuneTooltip;
