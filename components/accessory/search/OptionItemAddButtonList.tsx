import { useAccessorySearchActionContext } from "@/contexts/AccessoryContext";
import {
  AccessoryCategory,
  AccessoryGrade,
  AccessoryTier,
  AccessoryUpgradeLevel,
} from "@/types/EngraveType";
import { useCallback } from "react";

const OptionItemAddButtonList: React.FC = () => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback((accessoryCategory: AccessoryCategory) => {
    setAccessorySearchOptionArray((prev) => [
      ...prev,
      {
        accessoryCategory,
        accessoryGrade: "고대" as AccessoryGrade,
        accessoryTier: 4 as AccessoryTier,
        accessoryUpgradeLevel: 3 as AccessoryUpgradeLevel,
        accessoryQuality: 70,
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
