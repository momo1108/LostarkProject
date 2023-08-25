import styles from "@/styles/engrave/Page.module.scss";
import DataService from "@/service/DataService";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import { nanumNeo } from "@/types/GlobalType";
import EngraveBody from "@/components/engrave/EngraveBody";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";
import Footer from "@/components/Footer";

const Engrave: React.FC<MenuProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 로스트아크 각인세팅, 악세세팅, 악세서리세팅"
        description="로아플에서 제공하는 각인과 악세서리 세팅 비용을 찾아주는 페이지입니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className} hideScroll`}>
        <MenuBar menu={menu} />
        <EngraveBody />
        <Footer>
          <p>
            <a href="https://www.freepik.com/free-vector/dark-background-with-geometric-design_853799.htm#query=background%20pattern&position=28&from_view=search&track=ais">
              Image by kjpargeter on Freepik
            </a>
            <a href="https://www.freepik.com/free-vector/geometric-astrological-symbols-tarot-card_3905450.htm#page=4&query=outline&position=46&from_view=search&track=sph">
              Image by rawpixel.com
            </a>{" "}
            on Freepik
          </p>
        </Footer>
      </Page>
    </>
  );
};

export default Engrave;

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
