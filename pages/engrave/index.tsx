import styles from "@/styles/engrave/Page.module.scss";
import DataService from "@/service/DataService";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import CharBody from "@/components/character/CharBody";
import { nanumNeo } from "@/types/GlobalType";
import EngraveBody from "@/components/engrave/EngraveBody";
import Page from "@/components/Page";
import EngraveFooter from "@/components/engrave/EngraveFooter";

const Engrave: React.FC<MenuProps> = ({ menu }) => {
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <MenuBar menu={menu} />
      <EngraveBody />
      <EngraveFooter />
    </Page>
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
