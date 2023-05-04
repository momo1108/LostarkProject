import CharRecentContainer from "@/containers/character/CharRecentContainer";
import CharSearchContainer from "@/containers/character/CharSearchContainer";
import styles from "@/styles/character/Body.module.scss";

export default function CharBody() {
  return (
    <div className={styles.container}>
      <CharSearchContainer />
      <CharRecentContainer />
    </div>
  );
}
