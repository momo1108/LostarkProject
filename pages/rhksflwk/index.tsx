import styles from "@/styles/character/Page.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import DataService from "@/service/DataService";
import { tripodDataType } from "@/types/TripodType";

type adminPageProps = { info: tripodDataType };
const Rhksflwk: React.FC<adminPageProps> = ({ info }) => {
  console.log(info);

  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      어드민페이지 ㅎㅇ
    </Page>
  );
};

export async function getStaticProps() {
  try {
    /*
     3.22MB 라서 너무 부담이 크다. 구글 드라이브에 책임을 넘겨버릴까?
     이 경우, 수정에 대한 프로세스를 구글 드라이브 api로 가능한지 확인해야함.
     */
    const info = await DataService.getTripodInfo();
    return {
      props: {
        info,
      },
    };
  } catch (error: any) {
    return {
      props: {
        info: {},
      },
    };
  }
}

export default Rhksflwk;
