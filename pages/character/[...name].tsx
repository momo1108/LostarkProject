import styles from "@/styles/character/Page.module.scss";
import MenuHeader from "@/components/MenuHeader";
import { MenuProps } from "@/types/MenuType";
import CharBody from "@/components/character/CharBody";
import DataService from "@/service/DataService";
import CharFooter from "@/components/character/CharFooter";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";

const CharDetail: React.FC<MenuProps> = ({ menu }) => {
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <MenuHeader menu={menu} />
      <CharBody />
      <CharFooter />
    </Page>
  );
};

export default CharDetail;

export async function getStaticProps() {
  try {
    const menu = await DataService.getMenu();
    // const data: any = await CharacterService.getCharacterSummary(
    //   params.name[0]
    // );
    // console.log(data);
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
