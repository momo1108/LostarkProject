import { useAccessorySearchSelectorContext } from "@/contexts/AccessoryContext";
import OptionItem from "./OptionItem";

const OptionList: React.FC = () => {
  const { accessorySearchOptionArray } = useAccessorySearchSelectorContext();

  return (
    <ul className="max-h-[520px] hideScroll !overflow-y-scroll">
      {accessorySearchOptionArray.map((option, optionIndex) => {
        return (
          // 초기 로딩시에 skeleton 출력하도록 수정하자.(초기에 컨텍스트가 초기화되기까지 MySelect 의 텍스트가 비어있음)
          // ***** 각자의 li 는 자체적으로 하나의 악세서리에 대해서만 상태관리를 하고, 최종적으로 검색이 실행될때 모든 악세서리 상태를 통합하여 검색?
          <OptionItem
            key={`${option.accessoryCategory}_${option.accessoryGrade}_${option.accessoryTier}_${optionIndex}`}
            option={option}
            optionIndex={optionIndex}
          />
        );
      })}
    </ul>
  );
};

export default OptionList;
