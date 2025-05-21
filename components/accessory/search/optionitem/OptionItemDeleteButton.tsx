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
    <button
      className="myButtons shrink-0 xs:w-16 lg:w-20 3xl:w-[102px] justify-center"
      onClick={() => handleClick()}
    >
      삭제
    </button>
  );
};

export default OptionItemDeleteButton;
