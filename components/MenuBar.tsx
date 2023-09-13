import styles from "@/styles/MenuBar.module.scss";
import { MenuProps } from "@/types/GlobalType";
import Link from "next/link";
import { useRouter } from "next/router";
import { nanumNeo, roboto } from "@/types/GlobalType";
import { MenuIcons, MenuList } from "./icons/Index";
import { useState } from "react";

const MenuBar: React.FC<MenuProps> = ({ menu }) => {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className={`${styles.menuContainer} ${nanumNeo.className}`}>
      <div className={styles.homeDiv}>
        <Link href={"/"} className={`${styles.homeLink} ${roboto.className}`}>
          LOAPLE
        </Link>
      </div>
      <div className={styles.menuDiv}>
        {menu.map((m) => {
          // dragging 속성을 이용해 드래그중일땐 onclick을 비활성화하자.
          return (
            <Link
              key={m.id}
              href={m.url}
              className={`${styles.menuLink} ${
                router.route.split("/")[1] === m.url.split("/")[1]
                  ? styles.activeMenuLink
                  : ""
              }`}
            >
              <span>{m.title}</span>
              <MenuIcons size={30} type={m.id} width={2} />
            </Link>
          );
        })}
      </div>
      <div className={styles.subMenuDiv} data-show={show}>
        <button
          className={styles.menuListButton}
          onClick={() => {
            setShow((e) => !e);
          }}
        >
          <MenuList
            className={styles.listIcon}
            size={24}
            color="#eee"
            width={2}
          />
        </button>
        {menu.map((m) => {
          // dragging 속성을 이용해 드래그중일땐 onclick을 비활성화하자.
          return (
            <Link
              key={m.id}
              href={m.url}
              className={`${styles.menuLink} ${
                router.route.split("/")[1] === m.url.split("/")[1]
                  ? styles.activeMenuLink
                  : ""
              }`}
            >
              <MenuIcons size={35} type={m.id} width={1.4} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBar;
