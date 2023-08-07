import CharRecentBlock from "@/components/character/bodycomponent/CharRecentBlock";
import { RootState, SearchedData } from "@/types/ReducerType";
import { useSelector } from "react-redux";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useRouter } from "next/router";
import LostarkService from "@/service/LostarkService";

type CharRecentContainerProps = {
  searchedDataList: SearchedData[];
  setSearchedDataList: Dispatch<SetStateAction<SearchedData[]>>;
  like: (name: string) => void;
  remove: (name: string) => void;
};
const CharRecentContainer: React.FC<CharRecentContainerProps> = ({
  searchedDataList,
  like,
  remove,
  setSearchedDataList,
}) => {
  const router = useRouter();
  // const data = useSelector<RootState, SearchedData[]>(
  //   (state) => state.searched.data
  // );
  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  const updateSrc = useCallback(
    async (index: number) => {
      const profileData = await LostarkService.getCharacterProfile(
        searchedDataList[index].name
      );
      setSearchedDataList((e) => [
        ...e.slice(0, index),
        { ...e[index], img: profileData.CharacterImage },
        ...e.slice(index + 1),
      ]);
    },
    [searchedDataList, setSearchedDataList]
  );

  return (
    <CharRecentBlock
      {...{ searchedDataList, updateSrc, search, like, remove }}
    />
  );
};

export default CharRecentContainer;
