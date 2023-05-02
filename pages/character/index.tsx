import { useRouter } from "next/router";
import styles from "@/styles/CharPage.module.scss";
import DataService from "@/service/DataService";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";

const Character: React.FC<MenuProps> = ({ menu }) => {
  const router = useRouter();
  const query = router.query;
  console.log(query);

  return (
    <div className={styles.container}>
      <MenuHeader menu={menu} />
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
