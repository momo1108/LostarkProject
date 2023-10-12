import EngraveResultBlock from "@/components/engrave/bodycomponent/EngraveResultBlock";
import { AuctionItem } from "@/types/LostarkApiType";

type EngraveResultContainerProps = {
  combinationList: AuctionItem[][];
  pageStatus: number;
  progress: number;
  totalCases: number;
  currentCase: number;
  myTimer: number;
  copyToClipboard: (text: string) => void;
};
const EngraveResultContainer: React.FC<EngraveResultContainerProps> = ({
  combinationList,
  pageStatus,
  progress,
  totalCases,
  currentCase,
  myTimer,
  copyToClipboard,
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
        copyToClipboard,
      }}
    />
  );
};

export default EngraveResultContainer;
