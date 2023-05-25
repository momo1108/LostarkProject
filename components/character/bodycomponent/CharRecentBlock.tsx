import Delete from "@/components/icons/Delete";
import Empty from "@/components/icons/Empty";
import Favorite from "@/components/icons/Favorite";
import styles from "@/styles/character/Body.module.scss";
import { CharRecentBlockProps } from "@/types/CharacterType";

const CharRecentBlock: React.FC<CharRecentBlockProps> = ({ data, search }) => {
  return (
    <div className={styles.recentContainer}>
      {data.length ? (
        <ul className={styles.recentList}>
          {data.map((n, i) => {
            return (
              <li
                className={styles.recentListItem}
                key={`recentNames${i}`}
                onClick={() => {
                  search(n.name);
                }}
              >
                <Favorite className={styles.favoriteIcon} />
                <p className={styles.recentName}>{n.name}</p>
                <Delete className={styles.deleteIcon} />
              </li>
            );
          })}
        </ul>
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
