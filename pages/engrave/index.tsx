import styles from "@/styles/engrave/Page.module.scss";
import DataService from "@/service/DataService";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import CharBody from "@/components/character/CharBody";
import { nanumNeo } from "@/types/GlobalType";
import EngraveBody from "@/components/engrave/EngraveBody";
import Page from "@/components/Page";
import EngraveFooter from "@/components/engrave/EngraveFooter";
import { NextSeo } from "next-seo";

const Engrave: React.FC<MenuProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 각인세팅, 악세세팅, 악세서리세팅"
        description="로아플에서 제공하는 각인과 악세서리 세팅 비용을 찾아주는 페이지입니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className}`}>
        <MenuBar menu={menu} />
        <EngraveBody />
        <EngraveFooter />
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
