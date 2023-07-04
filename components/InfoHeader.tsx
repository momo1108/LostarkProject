import styles from "@/styles/info/Page.module.scss";
import { InfoPage, roboto } from "@/types/GlobalType";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const InfoHeader: React.FC<{ pages: InfoPage[] }> = ({ pages }) => {
  const [load, setLoad] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <div className={`${styles.menuContainer}`}>
      <div className={styles.homeDiv}>
        <Link
          href={"/info"}
          className={`${styles.homeLink} ${roboto.className}`}
        >
          LOAPLE INFO
        </Link>
      </div>
      <h2 className={styles.infoHeaderTitle}>안내 페이지 목록</h2>
      <div className={styles.infoLinkDiv}>
        {pages.map((e) => {
          return (
            <Link
              data-selected={router.asPath.split("/")[2] === e.url}
              className={styles.infoLink}
              key={e.id}
              href={`/info/${e.url}`}
            >
              {e.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default InfoHeader;
