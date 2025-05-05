import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import { AccessoryCategory } from "@/types/EngraveType";
import { useCallback } from "react";

const OptionItemAddButtonList: React.FC = () => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback((accessoryCategory: AccessoryCategory) => {
    setAccessorySearchOptionArray((prev) => [
      ...prev,
      {
        accessoryCategory,
        accessoryGrade: "고대",
        accessoryTier: 4,
        accessoryUpgradeLevel: 3,
        accessoryGrindingEffectArray: [],
      },
    ]);
  }, []);

  return (
    <ul className="flex gap-2">
      {["목걸이", "귀걸이", "반지"].map((accessoryCategory, index) => (
        <li key={`add_${accessoryCategory}`}>
          <button
            className="myButtons !text-sm"
            onClick={() => handleClick(accessoryCategory as AccessoryCategory)}
          >
            {accessoryCategory}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default OptionItemAddButtonList;
