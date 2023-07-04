import styles from "@/styles/info/Page.module.scss";
import { InfoPage, nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { GetStaticProps } from "next";
import DataService from "@/service/DataService";
import InfoHeader from "@/components/InfoHeader";
import Link from "next/link";

const InfoIndex: React.FC<{ pages: InfoPage[] }> = ({ pages }) => {
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <div className={styles.indexWrapper}>
        <h1 className={styles.indexTitle}>LOAPLE INFO - 로아플 안내 페이지</h1>
        <h2 className={styles.indexTitle2}>안내 페이지 목록</h2>
        <div className={styles.indexBody}>
          {pages.map((e) => {
            return (
              <Link
                key={e.id}
                href={`/info/${e.url}`}
                className={styles.infoCard}
              >
                <p className={styles.cardTitle}>{e.title}</p>
                <hr />
                <p className={styles.cardDescr}>{e.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </Page>
  );
};

export default InfoIndex;

export async function getStaticProps() {
  try {
    const pages = await DataService.getInfoPageList();
    return {
      props: {
        pages,
      },
    };
  } catch (error: any) {
    return {
      props: {
        pages: [],
      },
    };
  }
}
