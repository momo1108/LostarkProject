import styles from "@/styles/character/Page.module.scss";
import DataService from "@/service/DataService";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";
import CharBody from "@/components/character/CharBody";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";

const Character: React.FC<MenuProps> = ({ menu }) => {
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <MenuHeader menu={menu} />
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
