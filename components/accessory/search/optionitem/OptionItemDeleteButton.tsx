import Close from "@/components/icons/Close";
import { useAccessorySearchActionContext } from "@/contexts/accessory/AccessorySearchContext";
import { AccessorySearchOption } from "@/types/EngraveType";
import { useCallback } from "react";

const OptionItemDeleteButton: React.FC<{
  optionIndex: number;
}> = ({ optionIndex }) => {
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback(() => {
    setAccessorySearchOptionArray((prev) => {
      return prev.filter((_, index) => index !== optionIndex);
    });
  }, []);

  return (
    <button onClick={() => handleClick()}>
      <Close size={48} color="#fff" width={1} />
    </button>
  );
};

export default OptionItemDeleteButton;
