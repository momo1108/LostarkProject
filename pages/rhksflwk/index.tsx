import styles from "@/styles/character/Page.module.scss";
import { MenuProps, nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import MenuBar from "@/components/MenuBar";
import DataService from "@/service/DataService";
import useSkillParser from "@/hooks/useSkillParser";
import { useRef } from "react";
import useAlert from "@/hooks/useAlert";

const Rhksflwk: React.FC<MenuProps> = ({ menu }) => {
  const sp = useSkillParser();
  const classNameInput = useRef<HTMLInputElement>(null);
  const alert = useAlert();
  // 전체 클래스 갱신, 싱글 클래스 갱신, 클래스 검색용 닉네임 유효성검사
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <MenuBar menu={menu} />
      관리자
      <button
        onClick={async () => {
          await sp.singleClassParser("버서커");
        }}
      >
        한 클래스 스킬데이터 갱신
      </button>
      <button
        onClick={async () => {
          await sp.getAuctionValueCode();
        }}
      >
        검색옵션갱신
      </button>
      <button
        onClick={async () => {
          try {
            await sp.allClassSave();
          } catch (error: any) {
            console.log(error);
            alert.error(error.message);
          }
        }}
      >
        모든 클래스 스킬데이터 불러오기
      </button>
      <input type="text" ref={classNameInput} />
      <button
        onClick={() => {
          sp.updateAllClassServerData();
        }}
      >
        서버에 데이터 전송
      </button>
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
