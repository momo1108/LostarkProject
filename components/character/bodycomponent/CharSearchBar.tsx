import { useRef } from "react";
import styles from "@/styles/character/Body.module.scss";
import { CharSearchBarProps } from "@/types/CharacterType";

const CharSearchBar: React.FC<CharSearchBarProps> = ({
  search,
  loading,
  shrink,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <div className={`${styles.searchDiv} ${shrink ? styles.shrinked : ""}`}>
      <input
        className={styles.searchInput}
        placeholder="검색하고 싶은 닉네임을 입력하세요"
        type="text"
        ref={nameRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") click();
        }}
      />
      <input
        type="button"
        className={styles.searchBtn}
        value="검색"
        onClick={click}
      />
    </div>
  );

  function click() {
    if (loading) {
      alert("아직 검색이 진행중입니다.");
      return;
    }
    const name = nameRef.current!.value;
    if (!name) {
      alert("닉네임을 입력하세요!");
      return;
    }
    search(name);
  }
};

export default CharSearchBar;
