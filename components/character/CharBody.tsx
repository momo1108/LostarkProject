import CharMainInfoContainer from "@/containers/character/CharMainInfoContainer";
import CharRecentContainer from "@/containers/character/CharRecentContainer";
import CharSearchContainer from "@/containers/character/CharSearchContainer";
import useReduxDispatchWrapper from "@/hooks/useReduxDispatchWrapper";
import { save, success } from "@/redux/modules/searched";
import styles from "@/styles/character/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import { CharData, RootState } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function CharBody() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { dispatchWrapper } = useReduxDispatchWrapper();
  const [pointer, setPointer] = useState<boolean>(false);
  const searched = "name" in router.query;
  const recentData = useSelector((state: RootState) => state.searched.data);

  const data = useSelector<RootState, CharData>(
    (state) => state.character.data
  );

  // 검색 시 유효한 검색건에 대하여 검색기록 저장.
  useEffect(() => {
    if (data.ArmoryProfile && data.ArmoryProfile.CharacterImage) {
      setPointer(true);
      dispatchWrapper(save, data);
    }
  }, [data]);
  // 검색기록이 변경되었을 때, pointer 로 이중 체크 후 localStorage에 저장.
  useEffect(() => {
    if (pointer) {
      setPointer(false);
      localStorage.setItem("recent_search", JSON.stringify(recentData));
      while (
        JSON.parse(localStorage.getItem("recent_search")!).length !==
        recentData.length
      ) {
        localStorage.setItem("recent_search", JSON.stringify(recentData));
      }
    }
  }, [recentData]);

  useEffect(() => {
    const recent_search = localStorage.getItem("recent_search");
    if (recent_search) {
      dispatchWrapper(success, JSON.parse(recent_search));
    }
  }, [dispatch]);

  return (
    <div
      className={`${styles.container} ${styles.searched} ${nanumNeo.className}`}
    >
      <CharSearchContainer />
      {searched ? (
        <CharMainInfoContainer />
      ) : (
        <CharRecentContainer setPointer={setPointer} />
      )}
    </div>
  );
}
