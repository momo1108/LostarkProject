import CharMainInfoContainer from "@/containers/character/CharMainInfoContainer";
import CharRecentContainer from "@/containers/character/CharRecentContainer";
import CharSearchContainer from "@/containers/character/CharSearchContainer";
import CharacterContext from "@/contexts/CharacterContext";
import styles from "@/styles/character/Body.module.scss";
import { CharacterPageStatus } from "@/types/CharacterType";
import { nanumNeo } from "@/types/GlobalType";
import { CharData, SearchedData } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function CharBody() {
  const router = useRouter();
  const searched = "name" in router.query;

  const [searchedDataList, setSearchedDataList] = useState<SearchedData[]>([]);
  const [loadSDL, setLoadSDL] = useState<boolean>(false);

  const checker = useCallback((state: SearchedData[], data: CharData) => {
    if (!data.ArmoryProfile) return state;
    let duplicate: boolean = false;
    const level = parseInt(data.ArmoryProfile.ItemAvgLevel.replace(",", ""));
    let tmp: SearchedData[] = state.map((e: SearchedData) => {
      if (e.name === data.ArmoryProfile.CharacterName) {
        duplicate = true;
        return {
          ...e,
          level,
          img: data.ArmoryProfile.CharacterImage,
          timestamp: Date.now(),
        };
      } else return e;
    });
    let index = tmp.findLastIndex((e) => e.like > 0);
    // console.log(index, duplicate);
    if (index < 0) {
      if (!duplicate)
        tmp.push({
          name: data.ArmoryProfile.CharacterName,
          level,
          class: data.ArmoryProfile.CharacterClassName,
          img: data.ArmoryProfile.CharacterImage,
          like: -1,
          server: data.ArmoryProfile.ServerName,
          timestamp: Date.now(),
        });
      tmp.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      let likeArray = tmp.slice(0, index + 1);
      let notLikeArray = tmp.slice(index + 1);
      if (!duplicate)
        notLikeArray.push({
          name: data.ArmoryProfile.CharacterName,
          level,
          class: data.ArmoryProfile.CharacterClassName,
          img: data.ArmoryProfile.CharacterImage,
          like: -1,
          server: data.ArmoryProfile.ServerName,
          timestamp: Date.now(),
        });
      notLikeArray.sort((a, b) => b.timestamp - a.timestamp);
      tmp = [...likeArray, ...notLikeArray];
    }
    return tmp.slice(0, 10);
  }, []);

  useEffect(() => {
    const initData = localStorage.getItem("recentSearch");
    if (initData) setSearchedDataList(JSON.parse(initData));
  }, []);

  useEffect(() => {
    // console.log(searchedDataList);
    if (loadSDL)
      localStorage.setItem("recentSearch", JSON.stringify(searchedDataList));
    if (!loadSDL) setLoadSDL(true);
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
      let tmp = searchedDataList.map((e: SearchedData) => {
        if (e.name === name) {
          e.timestamp = Date.now();
          if (e.like < 0) {
            e.like = Date.now();
          } else {
            e.like = -1;
          }
        }
        return e;
      });
      let index = tmp.findIndex((e) => e.like > 0);
      if (index < 0) {
        tmp.sort((a, b) => b.timestamp - a.timestamp);
      } else {
        let likeArray = tmp.slice(0, index + 1);
        let notLikeArray = tmp.slice(index + 1);
        notLikeArray.sort((a, b) => b.timestamp - a.timestamp);
        tmp = [...likeArray, ...notLikeArray];
      }
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

  const [pageStatus, setPageStatus] = useState<CharacterPageStatus>("INIT");
  const [characterProfile, setCharacterProfile] = useState<any>({});

  return (
    <CharacterContext.Provider
      value={{
        pageStatus,
        setPageStatus,
        characterProfile,
        setCharacterProfile,
      }}
    >
      <div className={`${styles.container} ${nanumNeo.className}`}>
        <CharSearchContainer {...{ searchedDataList, like, remove }} />
        {searched ? (
          <CharMainInfoContainer push={push} />
        ) : (
          <CharRecentContainer
            {...{ searchedDataList, setSearchedDataList, like, remove }}
          />
        )}
      </div>
    </CharacterContext.Provider>
  );
}
