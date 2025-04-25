import styles from "@/styles/character/Page.module.scss";
import { MenuProps, nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import MenuBar from "@/components/MenuBar";
import useSkillParser from "@/hooks/useSkillParser";
import { useRef } from "react";
import useAlert from "@/hooks/useAlert";
import menu from "@/data/menu.json";

const Rhksflwk: React.FC<MenuProps> = ({ menu }) => {
  const sp = useSkillParser();
  const classNameInput = useRef<HTMLInputElement>(null);
  const alert = useAlert();
  // 전체 클래스 갱신, 싱글 클래스 갱신, 클래스 검색용 닉네임 유효성검사
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      <MenuBar menu={menu} />
      관리자
      <input type="text" ref={classNameInput} placeholder="클래스명" />
      <button
        onClick={async () => {
          if (classNameInput.current!.value) {
            await sp.singleClassParser(classNameInput.current!.value);
          } else {
            alert.error("제대로된 클래스명 입력");
          }
        }}
      >
        한 클래스 스킬데이터 갱신(미입력시 버서커로 진행)(미완성)
      </button>
      <button
        onClick={async () => {
          await sp.getAuctionValueCode();
        }}
      >
        검색옵션갱신(필요없는기능)
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
        1. 모든 클래스 스킬데이터 불러오기
      </button>
      <button
        onClick={() => {
          sp.updateAllClassServerData();
        }}
      >
        2. 서버에 데이터 전송
      </button>
    </Page>
  );
};

export default Rhksflwk;

export function getStaticProps() {
  try {
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
