import styles from "@/styles/tripod/Page.module.scss";
import DataService from "@/service/DataService";
import MenuBar from "@/components/MenuBar";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";
import TripodBody from "@/components/tripod/TripodBody";
import Footer from "@/components/Footer";
import { TripodPageProps } from "@/types/TripodType";

const Tripod: React.FC<TripodPageProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 로스트아크 트라이포드 세팅, 트포 세팅"
        description="로아플에서 제공하는 트라이포드 세팅 비용을 찾아주는 페이지입니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className} hideScroll`}>
        <MenuBar menu={menu} />
        <TripodBody />
        <Footer>
          <a href="https://www.freepik.com/free-vector/geometric-astrological-symbols-tarot-card_3905450.htm#page=4&query=outline&position=46&from_view=search&track=sph">
            Image by rawpixel.com
          </a>{" "}
          on Freepik
        </Footer>
      </Page>
    </>
  );
};

export default Tripod;

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
