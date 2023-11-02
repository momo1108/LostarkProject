import { Delete, Empty, Favorite } from "@/components/icons/Index";
import CharacterContext from "@/contexts/CharacterContext";
import styles from "@/styles/character/Body.module.scss";
import { CharRecentBlockProps } from "@/types/CharacterType";
import { useContext } from "react";
import Image from "next/image";

const CharRecentBlock: React.FC<CharRecentBlockProps> = ({
  updateSrc,
  search,
  like,
  remove,
}) => {
  const { searchedDataList } = useContext(CharacterContext);

  return (
    <div className={styles.recentContainer}>
      {searchedDataList.length ? (
        <>
          <h3 className={styles.recentTitle}>검색 기록 ( 최대 10개 )</h3>
          <ul className={styles.recentList}>
            {searchedDataList
              .sort((a, b) => b.like - a.like)
              .map((n, i) => {
                return (
                  <li
                    className={styles.recentListItem}
                    key={`recentNames${i}`}
                    onClick={() => {
                      search(n.name);
                    }}
                  >
                    <div className={styles.recentItemHeader}>
                      <span>{n.name}</span>
                      <div className={styles.recentIconDiv}>
                        <Favorite
                          onClick={(event) => {
                            event.stopPropagation();
                            like(n.name);
                          }}
                          color={n.like < 0 ? "#aaa" : "#ef4444"}
                          fill={n.like < 0 ? "none" : "#ef4444"}
                        />
                        <Delete
                          onClick={(event) => {
                            event.stopPropagation();
                            remove(n.name);
                          }}
                          color="#aaa"
                        />
                      </div>
                    </div>
                    <div className={styles.recentItemHeader}>
                      <span>Lv. {n.level}</span>
                      <span>
                        {n.class}@{n.server}
                      </span>
                    </div>
                    <Image
                      src={n.img}
                      alt="캐릭터 이미지"
                      className={styles.charImg}
                      width={270}
                      height={312.5}
                      onError={() => {
                        updateSrc(i);
                      }}
                    />
                  </li>
                );
              })}
          </ul>
        </>
      ) : (
        <>
          <p className={styles.emptyIconBox}>
            <Empty className={styles.emptyIcon} />
          </p>
          <span className={styles.emptyMsg}>최근 검색 기록이 없습니다!</span>
        </>
      )}
    </div>
  );
};

export default CharRecentBlock;
