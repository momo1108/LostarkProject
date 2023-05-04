import styles from "@/styles/character/Body.module.scss";
import { CharRecentBlockParams } from "@/types/CharacterType";

const CharRecentBlock: React.FC<CharRecentBlockParams> = ({ names }) => {
  return (
    <div className={styles.recentContainer}>
      {names.length ? (
        <ul className={styles.recentList}>
          {names.map((n, i) => {
            return (
              <li className={styles.recentListItem} key={`recentNames${i}`}>
                <svg
                  className={styles.favoriteIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <p className={styles.recentName}>{n}</p>
                <svg
                  className={styles.deleteIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </li>
            );
          })}
        </ul>
      ) : (
        <>
          <p className={styles.iconBox}>
            <svg
              className={styles.emptyIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="300"
              height="300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#bbb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </p>
          <span>최근 검색 기록이 없습니다!</span>
        </>
      )}
    </div>
  );
};

export default CharRecentBlock;
