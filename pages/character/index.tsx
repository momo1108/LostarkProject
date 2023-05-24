import styles from "@/styles/character/Page.module.scss";
import DataService from "@/service/DataService";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";
import CharBody from "@/components/character/CharBody";
import { nanumNeo } from "@/types/GlobalType";

const Character: React.FC<MenuProps> = ({ menu }) => {
  return (
    <div className={`${styles.container} ${nanumNeo.className}`}>
      <MenuHeader menu={menu} />
      <CharBody />
    </div>
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
