import CharRecentContainer from "@/containers/Character/CharRecentContainer";
import CharSearchContainer from "@/containers/Character/CharSearchContainer";
import styles from "@/styles/character/Body.module.scss";

export default function CharBody() {
  return (
    <div className={styles.container}>
      <CharSearchContainer />
      <CharRecentContainer />
    </div>
  );
}
