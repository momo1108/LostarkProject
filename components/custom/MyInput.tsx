import { CustomInputProps } from "@/types/CustomType";
import { forwardRef, ForwardedRef, ForwardRefRenderFunction } from "react";

const MyInput: ForwardRefRenderFunction<HTMLInputElement, CustomInputProps> = (
  { className = "", placeholder, onKeyEnter },
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <label>
      <div className="myInputDiv">
        <input
          className={`myInput ${className}`}
          type="text"
          spellCheck="false"
          ref={ref}
          onKeyDown={(event) => {
            if (event.code === "Enter" && onKeyEnter) onKeyEnter();
          }}
          required
        />
        <div className="placeholder">{placeholder}</div>
      </div>
    </label>
  );
};
export default forwardRef<HTMLInputElement, CustomInputProps>(MyInput);
