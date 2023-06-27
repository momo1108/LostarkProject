import EngraveResultBlock from "@/components/engrave/bodycomponent/EngraveResultBlock";
import styles from "@/styles/engrave/Body.module.scss";
import { AuctionItem } from "@/types/EngraveType";

type EngraveResultContainerProps = {
  combinationList: AuctionItem[][];
  pageStatus: number;
  progress: number;
  totalCases: number;
  currentCase: number;
  myTimer: number;
};
const EngraveResultContainer: React.FC<EngraveResultContainerProps> = ({
  combinationList,
  pageStatus,
  progress,
  totalCases,
  currentCase,
  myTimer,
}) => {
  return (
    <EngraveResultBlock
      {...{
        combinationList,
        pageStatus,
        progress,
        totalCases,
        currentCase,
        myTimer,
      }}
    />
  );
};

export default EngraveResultContainer;
