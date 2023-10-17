import CharRecentBlock from "@/components/character/bodycomponent/CharRecentBlock";
import { RootState, SearchedData } from "@/types/ReducerType";
import { useSelector } from "react-redux";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useRouter } from "next/router";
import LostarkService from "@/service/LostarkService";
import useAlert from "@/hooks/useAlert";

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
  const alert = useAlert();
  // const data = useSelector<RootState, SearchedData[]>(
  //   (state) => state.searched.data
  // );
  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  const updateSrc = useCallback(
    async (index: number) => {
      try {
        const { data } = await LostarkService.getCharacterProfile(
          searchedDataList[index].name
        );
        setSearchedDataList((e) => [
          ...e.slice(0, index),
          {
            ...e[index],
            img: data.CharacterImage,
            level: parseInt(data.ItemMaxLevel.replace(",", "")),
          },
          ...e.slice(index + 1),
        ]);
      } catch (err) {
        console.error(err);
        alert.error(
          `"${searchedDataList[index].name}" 캐릭터의 이미지 갱신 실패`
        );
      }
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
