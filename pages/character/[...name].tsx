import styles from "@/styles/character/Page.module.scss";
import MenuBar from "@/components/MenuBar";
import { MenuProps } from "@/types/GlobalType";
import CharBody from "@/components/character/CharBody";
import DataService from "@/service/DataService";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import { NextSeo } from "next-seo";
import Footer from "@/components/Footer";

const CharDetail: React.FC<MenuProps> = ({ menu }) => {
  return (
    <>
      <NextSeo
        title="로아플 로스트아크 캐릭터 정보 상세조회 페이지"
        description="로아플에서 제공하는 로스트아크 캐릭터 검색의 상세조회 페이지입니다. 검색된 닉네임의 유저에 대한 상세 정보를 제공합니다."
      />
      <Page className={`${styles.container} ${nanumNeo.className}`}>
        <MenuBar menu={menu} />
        <CharBody />
        <Footer>
          <p>
            <a href="https://www.freepik.com/free-vector/black-paint-background_44156746.htm#page=12&query=dark%20background&position=17&from_view=search&track=ais">
              Image by juicy_fish
            </a>{" "}
            on Freepik.
            <a href="https://www.freepik.com/free-photo/black-brick-wall-textured-background_3475675.htm#query=dark%20brick&position=4&from_view=search&track=ais">
              Image by rawpixel.com
            </a>{" "}
            on Freepik
          </p>
        </Footer>
      </Page>
    </>
  );
};

export default CharDetail;

export async function getStaticProps() {
  try {
    const menu = await DataService.getMenu();
    // const data: any = await LostarkService.getCharacterSummary(
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
