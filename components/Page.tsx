import { PageProps } from "@/types/GlobalType";
import { CharState, RootState } from "@/types/ReducerType";
import { useSelector } from "react-redux";

const Page: React.FC<PageProps> = ({ children, className }) => {
  const { error } = useSelector<RootState, CharState>(
    (state) => state.character
  );

  return <div className={className}>{children}</div>;
};

export default Page;
