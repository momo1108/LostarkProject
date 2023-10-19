import styles from "@/styles/character/Page.module.scss";
import { MenuProps, nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import MenuBar from "@/components/MenuBar";
import DataService from "@/service/DataService";
import useSkillParser from "@/hooks/useSkillParser";

const Rhksflwk: React.FC<MenuProps> = ({ menu }) => {
  const sp = useSkillParser();
  // 전체 클래스 갱신, 싱글 클래스 갱신, 클래스 검색용 닉네임 유효성검사
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <MenuBar menu={menu} />
      관리자
      <button
        onClick={async () => {
          console.log(await sp.singleClassParser("버서커"));
        }}
      >
        스킬데이터내놔
      </button>
      <button
        onClick={async () => {
          console.log(await sp.getAuctionValueCode());
        }}
      >
        검색옵션데이터내놔
      </button>
      <div>{JSON.stringify(sp.classList)}</div>
      <div>{JSON.stringify(sp.auctionSearchOptions)}</div>
    </Page>
  );
};

export default Rhksflwk;

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
