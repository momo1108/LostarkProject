import { FontProps } from "@/types/CharacterType";
import { useEffect } from "react";

const FONT: React.FC<FontProps> = ({ children, ...props }) => {
  useEffect(() => {
    console.log(props, children);
  }, []);
  return (
    <span
      style={{
        color: props.COLOR,
        fontSize: parseInt(props.SIZE),
      }}
    >
      {children}
    </span>
  );
};

export default FONT;
