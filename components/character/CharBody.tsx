import CharMainInfoContainer from "@/containers/character/CharMainInfoContainer";
import CharRecentContainer from "@/containers/character/CharRecentContainer";
import CharSearchContainer from "@/containers/character/CharSearchContainer";
import { init, save } from "@/redux/modules/searched";
import styles from "@/styles/character/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import { CharState, RootState } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function CharBody() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [pointer, setPointer] = useState<boolean>(false);
  const searched = "name" in router.query;
  const recentData = useSelector((state: RootState) => state.searched.data);

  const { data } = useSelector<RootState, CharState>(
    (state) => state.character
  );

  useEffect(() => {
    if (data.ArmoryProfile && data.ArmoryProfile.CharacterImage) {
      setPointer(true);
      dispatch(save(data));
    }
  }, [data]);
  useEffect(() => {
    if (recentData.length && pointer) {
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
      dispatch(init(JSON.parse(recent_search)));
    }
  }, [dispatch]);

  return (
    <div
      className={`${styles.container} ${styles.searched} ${nanumNeo.className}`}
    >
      <CharSearchContainer />
      {searched ? <CharMainInfoContainer /> : <CharRecentContainer />}
    </div>
  );
}
