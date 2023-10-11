import styles from "@/styles/MainBody.module.scss";
import { MainBodyProps, nanumNeo } from "@/types/GlobalType";
import Link from "next/link";
import { useEffect, useState } from "react";
import MenuIcons from "./icons/MenuIcons";

const MainBody: React.FC<MainBodyProps> = ({ menu }) => {
  const [selectedMenu, setSelectedMenu] = useState<number>(-1);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <div className={styles.container}>
      <ul className={`${styles.cardList} ${nanumNeo.className}`}>
        {menu.map((m, i) => {
          return (
            <li
              className={`${styles.cardItem} ${
                selectedMenu === i ? styles.selectedMenu : ""
              } ${load ? styles.showUs : ""}`}
              key={`cardItem_${i}`}
            >
              <div className={styles.cardItemFront}>
                <MenuIcons
                  color="#AF9363"
                  size={80}
                  width={m.strokeWidth}
                  className={styles.menuIcon}
                  type={m.id}
                />
                <p className={styles.cardItemTitle}>{m.title}</p>
              </div>
              <div className={styles.cardItemBack}>
                <p className={styles.cardItemTitle}>{m.title}</p>
                <p className={styles.cardItemDesc}>{m.desc}</p>
              </div>
            </li>
          );
        })}
        <div className={styles.cardListWrapper}>
          {menu.map((m, i) => {
            return (
              <Link
                href={m.url}
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
              ></Link>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default MainBody;
