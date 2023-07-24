import styles from "@/styles/MainPage.module.scss";
import MainHeader from "@/components/MainHeader";
import MainBody from "@/components/MainBody";
import { MainProps } from "@/types/GlobalType";
import DataService from "@/service/DataService";
import { roboto } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const Home: React.FC<MainProps> = ({ menu }) => {
  const router = useRouter();
  let adminKey: string = "";

  return (
    <>
      <NextSeo
        title="로아플, Loaple, 로스트아크 도우미, Lostark Helper"
        description="로스트아크 도구모음. 로아플은 세계에서 가장 작은 로스트아크 웹서비스로, 혼자 야무지게 만든 웹서비스입니다."
      />
      <Page
        className={`${styles.container} ${roboto.className}`}
        onKeyDown={(event) => {
          adminKey += event.key;
          if (adminKey === process.env.NEXT_PUBLIC_ADMIN_KEY)
            router.push("/rhksflwk");
        }}
      >
        <MainHeader />
        <MainBody menu={menu} />
      </Page>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  try {
    const menu = await DataService.getMenu();
    return {
      props: {
        menu,
      },
    };
  } catch (error: any) {
    return {
      props: {
        menu: [],
      },
    };
  }
}
