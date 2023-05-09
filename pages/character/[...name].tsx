import styles from "@/styles/character/Page.module.scss";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";
import CharBody from "@/components/character/CharBody";
import DataService from "@/service/DataService";

const CharDetail: React.FC<MenuProps> = ({ menu }) => {
  return (
    <div className={styles.container}>
      <MenuHeader menu={menu} />
      <CharBody />
    </div>
  );
};

export default CharDetail;

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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
