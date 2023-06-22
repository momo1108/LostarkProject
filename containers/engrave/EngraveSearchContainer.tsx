import EngraveSearchBlock from "@/components/engrave/bodycomponent/EngraveSearchBlock";
import EngraveService from "@/service/EngraveService";
import { AuctionItem } from "@/types/EngraveType";
import { Dispatch, SetStateAction } from "react";

type EngraveSearchContainerProps = {
  setCombinationList: Dispatch<SetStateAction<AuctionItem[][]>>;
};
const EngraveSearchContainer: React.FC<EngraveSearchContainerProps> = ({
  setCombinationList,
}) => {
  return <EngraveSearchBlock setCombinationList={setCombinationList} />;
};

export default EngraveSearchContainer;
