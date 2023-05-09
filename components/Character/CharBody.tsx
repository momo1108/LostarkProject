import CharMainInfoContainer from "@/containers/character/CharMainInfoContainer";
import CharRecentContainer from "@/containers/character/CharRecentContainer";
import CharSearchContainer from "@/containers/character/CharSearchContainer";
import styles from "@/styles/character/Body.module.scss";
import { useRouter } from "next/router";

export default function CharBody() {
  const router = useRouter();
  const searched = "name" in router.query;
  return (
    <div className={`${styles.container} ${styles.searched}`}>
      <CharSearchContainer />
      {searched ? <CharMainInfoContainer /> : <CharRecentContainer />}
    </div>
  );
}
