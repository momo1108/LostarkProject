import { CustomInputProps } from "@/types/CustomType";
import { forwardRef, ForwardedRef, ForwardRefRenderFunction } from "react";

const MyInput: ForwardRefRenderFunction<HTMLInputElement, CustomInputProps> = (
  {
    className = "",
    placeholder,
    type = "text",
    min = 0,
    max = 999999,
    onKeyEnter,
  },
  ref: ForwardedRef<HTMLInputElement>
) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const value = event.target.value;
      const parsedValue = parseInt(value);
      if (parsedValue < min) event.target.value = min.toString();
      if (parsedValue > max) event.target.value = max.toString();
    }
  };
  return (
    <label>
      <div className="myInputDiv">
        <input
          className={`myInput ${className}`}
          type={type}
          spellCheck="false"
          ref={ref}
          onKeyDown={(event) => {
            if (event.code === "Enter" && onKeyEnter) onKeyEnter();
          }}
          {...(type === "number" ? { min, max } : {})}
          required
          onChange={handleChange}
        />
        <div className="placeholder">{placeholder}</div>
      </div>
    </label>
  );
};
export default forwardRef<HTMLInputElement, CustomInputProps>(MyInput);
