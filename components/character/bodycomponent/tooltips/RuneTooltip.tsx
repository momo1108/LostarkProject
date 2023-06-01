import styles from "@/styles/character/Body.module.scss";
import useApiTagParser from "@/hooks/useApiTagParser";
import { RuneTooltipProps } from "@/types/STType";

const RuneTooltip: React.FC<RuneTooltipProps> = ({ data }) => {
  const { parseApiDataToHtmlString: parse } = useApiTagParser();

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
