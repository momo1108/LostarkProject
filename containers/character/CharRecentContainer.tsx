import CharRecentBlock from "@/components/character/bodycomponent/CharRecentBlock";
import { RootState, SearchedData } from "@/types/ReducerType";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useRouter } from "next/router";
import useReduxDispatchWrapper from "@/hooks/useReduxDispatchWrapper";
import { success } from "@/redux/modules/searched";

type CharRecentContainerProps = {
  setPointer: (value: React.SetStateAction<boolean>) => void;
};
const CharRecentContainer: React.FC<CharRecentContainerProps> = ({
  setPointer,
}) => {
  const router = useRouter();
  const { dispatchWrapper } = useReduxDispatchWrapper();
  const data = useSelector<RootState, SearchedData[]>(
    (state) => state.searched.data
  );
  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  return (
    <CharRecentBlock data={data} search={search} setPointer={setPointer} />
  );
};

export default CharRecentContainer;
