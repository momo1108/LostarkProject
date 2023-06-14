import Delete from "@/components/icons/Delete";
import Empty from "@/components/icons/Empty";
import Favorite from "@/components/icons/Favorite";
import styles from "@/styles/character/Body.module.scss";
import { CharRecentBlockProps } from "@/types/CharacterType";
import Image from "next/image";

const CharRecentBlock: React.FC<CharRecentBlockProps> = ({
  searchedDataList,
  search,
  like,
  remove,
}) => {
  // const { dispatchWrapper } = useReduxDispatchWrapper();
  // console.log(searchedDataList);
  return (
    <div className={styles.recentContainer}>
      {searchedDataList.length ? (
        <>
          <h3 className={styles.recentTitle}>검색 기록</h3>
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
                      width={270}
                      height={312.5}
                    />
                  </li>
                );
              })}
          </ul>
        </>
      ) : (
        <>
          <p className={styles.iconBox}>
            <Empty className={styles.emptyIcon} />
          </p>
          <span>최근 검색 기록이 없습니다!</span>
        </>
      )}
    </div>
  );
};

export default CharRecentBlock;
