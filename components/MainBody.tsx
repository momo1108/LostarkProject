import styles from "@/styles/main/MainBody.module.scss";
import { MainBodyProps, nanumNeo } from "@/types/GlobalType";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MenuIcons from "./icons/MenuIcons";

const MainBody: React.FC<MainBodyProps> = ({ menu }) => {
  const [selectedMenu, setSelectedMenu] = useState<number>(-1);
  const [load, setLoad] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setIsActive(true);
    }, 2500);
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
        {isActive && (
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
        )}
      </ul>
      <div className={`${styles.smallCube} ${nanumNeo.className}`}>
        {menu.map((m, i) => {
          return (
            <Link
              href={m.url}
              className={`${styles.cardItem} ${
                selectedMenu === i ? styles.selectedMenu : ""
              } ${load ? styles.showUs : ""}`}
              key={`cardItem_${i}`}
              onMouseEnter={() => {
                setSelectedMenu(i);
              }}
              onMouseLeave={() => {
                setSelectedMenu(-1);
              }}
            >
              <div className={styles.cardItemHeader}>
                <div className={styles.cardItemHeaderContent}>
                  <MenuIcons
                    color="#444"
                    size={20}
                    width={m.strokeWidth + 0.5}
                    className={styles.menuIcon}
                    type={m.id}
                  />
                  <p className={styles.cardItemTitle}>{m.title}</p>
                </div>
              </div>
              <div className={styles.cardItemDescr}>{m.desc}</div>
            </Link>
          );
        })}
        <div className={`${styles.smFront} ${styles.smWall}`}>
          <p>로아플</p>
          <p>메뉴상자</p>
        </div>
        <div className={`${styles.smBack} ${styles.smWall}`}></div>
        <div className={`${styles.smLeft} ${styles.smWall}`}></div>
        <div className={`${styles.smRight} ${styles.smWall}`}></div>
        <div className={`${styles.xsFront} ${styles.xsWall}`}>
          <p>로아플</p>
          <p>메뉴상자</p>
        </div>
        <div className={`${styles.xsBack} ${styles.xsWall}`}></div>
        <div className={`${styles.xsLeft} ${styles.xsWall}`}></div>
        <div className={`${styles.xsRight} ${styles.xsWall}`}></div>
      </div>
    </div>
  );
};

export default MainBody;
