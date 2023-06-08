import EngraveSearchBlock from "@/components/engrave/bodycomponent/EngraveSearchBlock";
import EngraveService from "@/service/EngraveService";

type EngraveSearchContainerProps = {};
const EngraveSearchContainer: React.FC = () => {
  const click = async () => {
    const res = await EngraveService.getAuctionItems({
      CategoryCode: 200020,
      EtcOptions: [
        {
          FirstOption: 2,
          SecondOption: 15,
          MinValue: 0,
        },
      ],
      ItemGrade: "고대",
      ItemGradeQuality: 50,
      ItemTier: 3,
      PageNo: 1,
      Sort: 1,
      SortCondition: 0,
    });
    console.log(res);
  };
  return <EngraveSearchBlock />;
};

export default EngraveSearchContainer;
