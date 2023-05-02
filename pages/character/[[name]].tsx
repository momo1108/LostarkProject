import { useRouter } from "next/router";
import styles from "@/styles/CharPage.module.scss";
import DataService from "@/service/DataService";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";
import { GetStaticPaths } from "next";

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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

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
