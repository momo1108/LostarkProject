import styles from "@/styles/accessory/Page.module.scss";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";
import Footer from "@/components/Footer";
import AccessoryBody from "@/components/accessory/AccessoryBody";
import menu from "@/data/menu.json";

const Accessory: React.FC<MenuProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 로스트아크 악세세팅, 악세서리세팅"
        description="로아플에서 제공하는 악세서리 세팅 비용을 찾아주는 페이지입니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className}`}>
        <MenuBar menu={menu} />
        <AccessoryBody />
        <Footer>
          <a href="https://www.freepik.com/free-vector/dark-background-with-geometric-design_853799.htm#query=background%20pattern&position=28&from_view=search&track=ais">
            Image by kjpargeter on Freepik
          </a>
          <a href="https://www.freepik.com/free-vector/geometric-astrological-symbols-tarot-card_3905450.htm#page=4&query=outline&position=46&from_view=search&track=sph">
            Image by rawpixel.com
          </a>{" "}
          on Freepik
          <a href="https://www.freepik.com/free-vector/black-paint-background_44156746.htm#page=12&query=dark%20background&position=17&from_view=search&track=ais">
            Image by juicy_fish
          </a>{" "}
          on Freepik
        </Footer>
      </Page>
    </>
  );
};

export default Accessory;

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
