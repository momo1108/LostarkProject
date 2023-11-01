import styles from "@/styles/main/MainPage.module.scss";
import MainHeader from "@/components/MainHeader";
import MainBody from "@/components/MainBody";
import { MainProps } from "@/types/GlobalType";
import DataService from "@/service/DataService";
import { roboto } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

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
        className={`${styles.container} ${roboto.className} hideScroll`}
        onKeyDown={(event) => {
          adminKey += event.key;
          if (adminKey === process.env.NEXT_PUBLIC_ADMIN_KEY)
            router.push("/rhksflwk");
        }}
      >
        <MainHeader />
        <MainBody menu={menu} />
        <Footer>
          <a href="https://www.freepik.com/free-vector/hand-drawn-2023-lunar-calendar-template_33459684.htm#page=4&query=tarot%20card%20background&position=16&from_view=search&track=ais">
            Image by pikisuperstar
          </a>{" "}
          on Freepik.
          <a href="https://www.freepik.com/free-photo/brown-texture_997227.htm#query=paper%20box%20surface&position=4&from_view=search&track=ais">
            Image by tirachard
          </a>{" "}
          on Freepik. Sound Effect from{" "}
          <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=14432">
            Pixabay.
          </a>
          <a href="https://www.freepik.com/free-vector/monoline-celestial-icons-frame-vector-square-frame-black_15841782.htm#page=4&query=tarot%20cards&position=0&from_view=search&track=ais#position=0&page=4&query=tarot%20cards">
            Image by rawpixel.com
          </a>{" "}
          on Freepik
        </Footer>
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
