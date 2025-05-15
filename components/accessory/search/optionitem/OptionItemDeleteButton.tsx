import Close from "@/components/icons/Close";
import {
  useAccessorySearchActionContext,
  useAccessorySearchStaticContext,
} from "@/contexts/AccessoryContext";
import { AccessorySearchOption } from "@/types/EngraveType";
import { useCallback } from "react";

const OptionItemDeleteButton: React.FC<{
  optionIndex: number;
}> = ({ optionIndex }) => {
  const { accessorySearchOptionArrayRef } = useAccessorySearchStaticContext();
  const { setAccessorySearchOptionArray } = useAccessorySearchActionContext();
  const handleClick = useCallback(() => {
    if (accessorySearchOptionArrayRef.current.length <= 1) return;
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
