import styles from "@/styles/MainBody.module.scss";
import { MainProps } from "@/types/MainPageType";
import { Menu } from "@/types/MenuType";
import Link from "next/link";
import { useEffect, useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import MenuIcons from "./icons/MenuIcons";

const MainBody: React.FC<MainProps> = ({ menu }) => {
  const hexPerLines = useWindowSize();
  const [alignedMenu, setAlignedMenu] = useState<Menu[][]>([]);
  console.log(menu);
  useEffect(() => {
    if (hexPerLines >= 2) {
      let lineIndex = 0,
        maxMenuPerLine = hexPerLines;
      const menuArr: Menu[][] = [[]];
      for (let i = 0; i < menu.length; i++) {
        menuArr[lineIndex].push(menu[i]);
        if (
          menuArr[lineIndex].length >= maxMenuPerLine &&
          i < menu.length - 1
        ) {
          lineIndex++;
          menuArr.push([]);
          if (lineIndex % 2 === 0) maxMenuPerLine = hexPerLines;
          else maxMenuPerLine = hexPerLines - 1;
        }
      }
      // 만약 마지막 line이 꽉 차지 않고 개수가 애매한 경우 빈 육각형을 하나 추가.
      if (menuArr[lineIndex].length % 2 !== maxMenuPerLine % 2) {
        menuArr[lineIndex].push({
          id: 999,
          title: "dummy",
          desc: "dummy",
          url: "dummy",
          strokeWidth: 1,
        });
      }
      setAlignedMenu(menuArr);
    }
  }, [hexPerLines]);

  return (
    <div className={styles.container}>
      {alignedMenu.map((line, lineIndex) => {
        return (
          <div className={styles.lineDiv} key={`line${lineIndex}`}>
            {line.map((m: Menu) => {
              return m.id === 999 ? (
                <div className={styles.dummyLink} key="dummyMenu">
                  <p></p>
                </div>
              ) : (
                <Link
                  href={m.url}
                  key={`menuHex${m.id}`}
                  className={styles.menuLink}
                >
                  <div className={styles.menuDiv}>
                    <p className={styles.menuContent}>
                      <MenuIcons
                        width={m.strokeWidth}
                        className={styles.menuIcon}
                        type={m.id}
                      />
                      {m.title}
                    </p>
                    {/* 정육각형 비율 3.4641 : 4 */}
                    <div className={styles.innerHex}>
                      <div className={styles.innerHexChild}></div>
                      <div className={styles.innerHexChild}></div>
                      <div className={styles.innerHexChild}></div>
                    </div>
                    <div className={styles.outerHex}>
                      <div className={styles.outerHexChild}></div>
                      <div className={styles.outerHexChild}></div>
                      <div className={styles.outerHexChild}></div>
                    </div>
                    <svg
                      className={styles.menuSvg}
                      viewBox="0 0 173.20508075688772 200"
                      height="200"
                      width="173.20508075688772"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                        fill="#333"
                      ></path>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MainBody;
