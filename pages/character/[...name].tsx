import styles from "@/styles/character/Page.module.scss";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import CharBody from "@/components/character/CharBody";
import DataService from "@/service/DataService";
import CharFooter from "@/components/character/CharFooter";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";

const CharDetail: React.FC<MenuProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 캐릭터 정보 상세조회 페이지"
        description="로아플에서 제공하는 캐릭터 검색의 상세조회 페이지입니다. 검색된 닉네임의 유저에 대한 상세 정보를 제공합니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className}`}>
        <MenuBar menu={menu} />
        <CharBody />
        <CharFooter />
      </Page>
    </>
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
