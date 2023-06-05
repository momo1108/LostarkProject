import styles from "@/styles/engrave/Page.module.scss";
import DataService from "@/service/DataService";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";
import CharBody from "@/components/character/CharBody";
import { nanumNeo } from "@/types/GlobalType";
import EngraveBody from "@/components/engrave/EngraveBody";

const Engrave: React.FC<MenuProps> = ({ menu }) => {
  return (
    <div className={`${styles.container} ${nanumNeo.className}`}>
      <MenuHeader menu={menu} />
      <EngraveBody />
    </div>
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
