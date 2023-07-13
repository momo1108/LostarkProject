import styles from "@/styles/character/Page.module.scss";
import DataService from "@/service/DataService";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import CharBody from "@/components/character/CharBody";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";

const Character: React.FC<MenuProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 캐릭터검색, 이름검색, 닉네임검색"
        description="로아플에서 제공하는 캐릭터 이름(닉네임)을 활용한 검색기능입니다. 유저들의 장비, 각인 스킬 등 여러가지 정보를 조회할 수 있습니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className}`}>
        <MenuBar menu={menu} />
        <CharBody />
      </Page>
    </>
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
