import CharMainInfoContainer from "@/containers/character/CharMainInfoContainer";
import CharRecentContainer from "@/containers/character/CharRecentContainer";
import CharSearchContainer from "@/containers/character/CharSearchContainer";
import styles from "@/styles/character/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import { CharData, RootState, SearchedData } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function CharBody() {
  const router = useRouter();
  const searched = "name" in router.query;

  const [searchedDataList, setSearchedDataList] = useState<SearchedData[]>([]);
  const [loadSDL, setLoadSDL] = useState<boolean>(false);

  const checker = useCallback((state: SearchedData[], data: CharData) => {
    if (!data.ArmoryProfile) return state;
    let duplicate: boolean = false;
    const level = parseInt(data.ArmoryProfile.ItemAvgLevel.replace(",", ""));
    const tmp = state.map((e: SearchedData) => {
      if (e.name === data.ArmoryProfile.CharacterName) {
        duplicate = true;
        return {
          ...e,
          level,
        };
      } else return e;
    });
    return duplicate
      ? tmp
      : [
          ...tmp,
          {
            name: data.ArmoryProfile.CharacterName,
            level,
            class: data.ArmoryProfile.CharacterClassName,
            img: data.ArmoryProfile.CharacterImage,
            like: -1,
            server: data.ArmoryProfile.ServerName,
          },
        ];
  }, []);

  useEffect(() => {
    const initData = localStorage.getItem("recent_search");
    if (initData) setSearchedDataList(JSON.parse(initData));
    setLoadSDL(true);
  }, []);

  useEffect(() => {
    if (loadSDL)
      localStorage.setItem("recent_search", JSON.stringify(searchedDataList));
  }, [searchedDataList]);

  const push = useCallback(
    (data: SearchedData) => {
      setSearchedDataList(checker(searchedDataList, data));
    },
    [searchedDataList]
  );

  const like = useCallback(
    (name: string) => {
      console.log(name);
      const tmp = searchedDataList.map((e: SearchedData) => {
        if (e.name === name) e.like < 0 ? (e.like = Date.now()) : (e.like = -1);
        return e;
      });
      console.log(searchedDataList);
      setSearchedDataList(tmp);
    },
    [searchedDataList]
  );

  const remove = useCallback(
    (name: string) => {
      const index = searchedDataList.findIndex(
        (e: SearchedData) => e.name === name
      );
      setSearchedDataList([
        ...searchedDataList.slice(0, index),
        ...searchedDataList.slice(index + 1),
      ]);
    },
    [searchedDataList]
  );

  /*
  2023-05-30 Redux가 아닌 State 사용을 고려해서 리팩토링
  */
  // const dispatch = useDispatch();
  // const { dispatchWrapper } = useReduxDispatchWrapper();
  // const [pointer, setPointer] = useState<boolean>(false);
  // const recentData = useSelector((state: RootState) => state.searched.data);
  // const data = useSelector<RootState, CharData>(
  //   (state) => state.character.data
  // );

  // // 검색 시 유효한 검색건에 대하여 검색기록 저장.
  // useEffect(() => {
  //   if (data.ArmoryProfile && data.ArmoryProfile.CharacterImage) {
  //     setPointer(true);
  //     dispatchWrapper(save, data);
  //   }
  // }, [data]);
  // // 검색기록이 변경되었을 때, pointer 로 이중 체크 후 localStorage에 저장.
  // useEffect(() => {
  //   if (pointer) {
  //     setPointer(false);
  //     localStorage.setItem("recent_search", JSON.stringify(recentData));
  //     while (
  //       JSON.parse(localStorage.getItem("recent_search")!).length !==
  //       recentData.length
  //     ) {
  //       localStorage.setItem("recent_search", JSON.stringify(recentData));
  //     }
  //   }
  // }, [recentData]);

  // useEffect(() => {
  //   const recent_search = localStorage.getItem("recent_search");
  //   if (recent_search) {
  //     dispatchWrapper(success, JSON.parse(recent_search));
  //   }
  // }, [dispatch]);

  return (
    <div
      className={`${styles.container} ${styles.searched} ${nanumNeo.className}`}
    >
      <CharSearchContainer {...{ searchedDataList, like, remove }} />
      {searched ? (
        <CharMainInfoContainer push={push} />
      ) : (
        <CharRecentContainer {...{ searchedDataList, like, remove }} />
      )}
    </div>
  );
}
