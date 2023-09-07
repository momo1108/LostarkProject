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
          <a href="https://www.freepik.com/free-vector/luxury-dark-seamless-pattern_4585477.htm#query=dark%20pattern&position=43&from_view=search&track=ais">
            Background Image by kjpargeter on Freepik /
          </a>{" "}
          <br />
          <a href="https://pixabay.com/users/gdj-1086657/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7558594">
            by Gordon Johnson
          </a>{" "}
          <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7558594">
            from Pixabay /
          </a>
          <a href="https://www.freepik.com/free-photo/wide-angle-shot-ancient-construction-with-towers-jordan-clear-blue-sky_10399328.htm#page=3&query=parthenon%20temple&position=45&from_view=search&track=ais">
            by wirestock
          </a>{" "}
          on Freepik
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
