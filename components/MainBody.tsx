import styles from "@/styles/MainBody.module.scss";
import { MainBodyProps } from "@/types/GlobalType";
import { Menu } from "@/types/GlobalType";
import Link from "next/link";
import { useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import MenuIcons from "./icons/MenuIcons";

const MainBody: React.FC<MainBodyProps> = ({ menu }) => {
  const [selectedMenu, setSelectedMenu] = useState<number>(-1);

  return (
    <div className={styles.container}>
      <ul className={styles.cardList}>
        {menu.map((m, i) => {
          return (
            <li
              className={`${styles.cardItem} ${
                selectedMenu === i ? styles.selectedMenu : ""
              }`}
              key={`cardItem_${i}`}
            >
              {m.title}
            </li>
          );
        })}
        <div className={styles.cardListWrapper}>
          {menu.map((m, i) => {
            return (
              <div
                className={`${styles.cardItemWrapper} ${
                  selectedMenu === i ? styles.selectedMenu : ""
                }`}
                key={`cardItemWrapper_${i}`}
                onMouseEnter={() => {
                  setSelectedMenu(i);
                }}
                onMouseLeave={() => {
                  setSelectedMenu(-1);
                }}
              ></div>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default MainBody;
