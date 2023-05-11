import { PProps } from "@/types/CharacterType";

const P: React.FC<PProps> = ({ children, ...props }) => {
  return <p style={{ textAlign: props.ALIGN }}>{children}</p>;
};

export default P;
