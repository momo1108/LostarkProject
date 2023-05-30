import CharRecentBlock from "@/components/character/bodycomponent/CharRecentBlock";
import { RootState, SearchedData } from "@/types/ReducerType";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useRouter } from "next/router";

type CharRecentContainerProps = {
  searchedDataList: SearchedData[];
  like: (name: string) => void;
  remove: (name: string) => void;
};
const CharRecentContainer: React.FC<CharRecentContainerProps> = ({
  searchedDataList,
  like,
  remove,
}) => {
  const router = useRouter();
  // const data = useSelector<RootState, SearchedData[]>(
  //   (state) => state.searched.data
  // );
  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  return <CharRecentBlock {...{ searchedDataList, search, like, remove }} />;
};

export default CharRecentContainer;
