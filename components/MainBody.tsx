import styles from "@/styles/main/MainBody.module.scss";
import { MainBodyProps, nanumNeo } from "@/types/GlobalType";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MenuIcons from "./icons/MenuIcons";
import Image from "next/image";

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
        <Image
          width={896}
          height={658}
          quality={100}
          className={`${styles.cardBackground} ${load ? styles.showUs : ""}`}
          src="/images/test4.png"
          alt="cardBackground"
        />
      </ul>
      <div
        className={`${styles.smCube} ${nanumNeo.className} ${
          load ? styles.showUs : ""
        }`}
      >
        {menu.map((m, i) => {
          return (
            <Link
              href={m.url}
              className={`${styles.cardItem} ${
                selectedMenu === i ? styles.selectedMenu : ""
              } ${load ? styles.showUs : ""}`}
              key={`cardItem_${i}`}
              onMouseEnter={() => {
                if (isActive) setSelectedMenu(i);
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
        <div className={styles.smFront}>
          <p>로아플</p>
          <p>메뉴상자</p>
        </div>
        <div className={styles.smBack}></div>
        <div className={styles.smLeft}></div>
        <div className={styles.smRight}></div>
      </div>
      <div
        className={`${styles.xsCube} ${nanumNeo.className} ${
          load ? styles.showUs : ""
        }`}
      >
        {menu.map((m, i) => {
          return (
            <Link
              href={isActive ? m.url : ""}
              className={`${styles.cardItem} ${
                selectedMenu === i ? styles.selectedMenu : ""
              } ${load ? styles.showUs : ""}`}
              key={`cardItem_${i}`}
              onMouseEnter={() => {
                if (isActive) setSelectedMenu(i);
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
        <div className={styles.xsFront}>
          <p>로아플</p>
          <p>메뉴상자</p>
        </div>
        <div className={styles.xsBack}></div>
        <div className={styles.xsLeft}></div>
        <div className={styles.xsRight}></div>
      </div>
    </div>
  );
};

export default MainBody;
