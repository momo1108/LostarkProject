import EngraveResultBlock from "@/components/engrave/bodycomponent/EngraveResultBlock";
import styles from "@/styles/engrave/Body.module.scss";
import { AuctionItem } from "@/types/EngraveType";

type EngraveResultContainerProps = {
  combinationList: AuctionItem[][];
};
const EngraveResultContainer: React.FC<EngraveResultContainerProps> = ({
  combinationList,
}) => {
  return <EngraveResultBlock combinationList={combinationList} />;
};

export default EngraveResultContainer;
