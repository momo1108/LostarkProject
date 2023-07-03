import EngraveSearchBlock from "@/components/engrave/bodycomponent/EngraveSearchBlock";
import EngraveService from "@/service/EngraveService";
import { AuctionItem } from "@/types/EngraveType";
import { Dispatch, SetStateAction } from "react";

type EngraveSearchContainerProps = {
  pageStatus: number;
  combinationList: AuctionItem[][];
  setCombinationList: Dispatch<SetStateAction<AuctionItem[][]>>;
  setPageStatus: Dispatch<SetStateAction<number>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setTotalCases: Dispatch<SetStateAction<number>>;
  setCurrentCase: Dispatch<SetStateAction<number>>;
  setMyTimer: Dispatch<SetStateAction<number>>;
};
const EngraveSearchContainer: React.FC<EngraveSearchContainerProps> = ({
  pageStatus,
  combinationList,
  setCombinationList,
  setPageStatus,
  setProgress,
  setTotalCases,
  setCurrentCase,
  setMyTimer,
}) => {
  return (
    <EngraveSearchBlock
      {...{
        pageStatus,
        combinationList,
        setPageStatus,
        setCombinationList,
        setProgress,
        setTotalCases,
        setCurrentCase,
        setMyTimer,
      }}
    />
  );
};

export default EngraveSearchContainer;
