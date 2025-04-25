import styles from "@/styles/tripod/Page.module.scss";
import MenuBar from "@/components/MenuBar";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";
import TripodBody from "@/components/tripod/TripodBody";
import Footer from "@/components/Footer";
import { TripodPageProps } from "@/types/TripodType";
import menu from "@/data/menu.json";

const Tripod: React.FC<TripodPageProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 로스트아크 트라이포드 세팅, 트포 세팅"
        description="로아플에서 제공하는 트라이포드 세팅 비용을 찾아주는 페이지입니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className}`}>
        <MenuBar menu={menu} />
        <TripodBody />
        <Footer>
          <a href="https://www.freepik.com/free-vector/geometric-astrological-symbols-tarot-card_3905450.htm#page=4&query=outline&position=46&from_view=search&track=sph">
            Image by rawpixel.com
          </a>{" "}
          on Freepik.
          <a href="https://www.freepik.com/free-vector/black-paint-background_44156746.htm#page=12&query=dark%20background&position=17&from_view=search&track=ais">
            Image by juicy_fish
          </a>{" "}
          on Freepik.
          <a href="https://www.freepik.com/free-vector/collection-patterns-vector-illustration_2922475.htm#query=patterned%20background&position=49&from_view=search&track=ais">
            Image by rawpixel.com
          </a>{" "}
          on Freepik
        </Footer>
      </Page>
    </>
  );
};

export default Tripod;

export function getStaticProps() {
  try {
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
