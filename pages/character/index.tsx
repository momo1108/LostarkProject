import styles from "@/styles/character/Page.module.scss";
import DataService from "@/service/DataService";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import CharBody from "@/components/character/CharBody";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";

const Character: React.FC<MenuProps> = ({ menu }) => {
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <MenuBar menu={menu} />
      <CharBody />
    </Page>
  );
};

export default Character;

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
