import { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/character/Body.module.scss";
import { CharSearchBarProps } from "@/types/CharacterType";
import { Delete, Favorite } from "@/components/icons/Index";

const CharSearchBar: React.FC<CharSearchBarProps> = ({
  search,
  loading,
  shrink,
  like,
  remove,
  searchedDataList,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownVisibility, setDropdownVisibility] = useState<boolean>(false);

  const click = useCallback(() => {
    if (loading) {
      alert("아직 검색이 진행중입니다.");
      return;
    }
    const name = nameRef.current!.value;
    // console.log(name);
    if (!name) {
      alert("닉네임을 입력하세요!");
      return;
    }
    search(name);
    divRef.current?.blur();
    nameRef.current!.blur();
    buttonRef.current!.blur();
    dropdownRef.current!.scrollTop = 0;
  }, [
    loading,
    nameRef.current,
    divRef.current,
    buttonRef.current,
    dropdownRef.current,
  ]);

  return (
    <div
      className={`${styles.searchDiv} ${shrink ? styles.shrinked : ""}`}
      onFocus={() => setDropdownVisibility(true)}
      onBlur={() => setDropdownVisibility(false)}
    >
      <div className={styles.searchInputWrapper} ref={divRef} tabIndex={0}>
        <input
          className={styles.searchInput}
          placeholder="닉네임을 입력하세요"
          type="text"
          ref={nameRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") click();
          }}
        />
        <div
          className={`${styles.dropdown} hideScroll${
            shrink && dropdownVisibility ? " flex" : " hidden"
          }`}
          ref={dropdownRef}
        >
          <h4 className={styles.dropdownTitle}>검색 기록 ( 최대 10개 )</h4>
          {searchedDataList
            .sort((a, b) => b.like - a.like)
            .map((e) => {
              return (
                <a
                  key={`dropdown${e.name}`}
                  className={styles.dropdownItem}
                  onClick={() => {
                    nameRef.current!.value = e.name;
                    click();
                  }}
                >
                  <Favorite
                    size={18}
                    onClick={(event) => {
                      event.stopPropagation();
                      like(e.name);
                    }}
                    color={e.like < 0 ? "#aaa" : "#ef4444"}
                    fill={e.like < 0 ? "none" : "#ef4444"}
                  />
                  <span className={styles.dropdownNameSpan}>{e.name}</span>
                  <Delete
                    className={styles.deleteIcon}
                    onClick={(event) => {
                      event.stopPropagation();
                      remove(e.name);
                    }}
                    color="#aaa"
                    width={2}
                  />
                </a>
              );
            })}
        </div>
      </div>
      <input
        type="button"
        ref={buttonRef}
        className={styles.searchButton}
        value="검색"
        onClick={click}
      />
    </div>
  );
};

export default CharSearchBar;
