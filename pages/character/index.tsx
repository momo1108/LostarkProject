import styles from "@/styles/CharPage.module.scss";
import DataService from "@/service/DataService";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";
import { useEffect, useState } from "react";
import CharSearchContainer from "@/containers/Character/CharSearchContainer";

const Character: React.FC<MenuProps> = ({ menu }) => {
  const [name, setName] = useState<string>("");
  useEffect(() => {
    const defaultName = localStorage.getItem("name");
    setName(defaultName ? defaultName : "");

    return () => {
      localStorage.setItem("name", name);
    };
  }, []);

  return (
    <div className={styles.container}>
      <MenuHeader menu={menu} />
      {/* <CharBody info={info} /> */}
      <CharSearchContainer />
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
