import styles from "@/styles/character/Page.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
import DataService from "@/service/DataService";
import { tripodDataType } from "@/types/TripodType";
import axios from "axios";
import { useEffect } from "react";

const Rhksflwk: React.FC = () => {
  useEffect(() => {
    const url =
      "/gd/file/d/1gLP6GSIATOuSksMaM9b586Izj6YX_pAP/view?usp=drive_link";
    let info;
    (async () => {
      const res = await axios.get(url);
      info = res.data;
      console.log(info);
    })();
  }, []);

  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      어드민페이지 ㅎㅇ
    </Page>
  );
};

// export async function getStaticProps() {
//   try {
//     /*
//      3.22MB 라서 너무 부담이 크다. 구글 드라이브에 책임을 넘겨버릴까?
//      이 경우, 수정에 대한 프로세스를 구글 드라이브 api로 가능한지 확인해야함.
//      */
//     const info = await DataService.getTripodInfo();

//     return {
//       props: {
//         info: {},
//       },
//     };
//   } catch (error: any) {
//     return {
//       props: {
//         info: {},
//       },
//     };
//   }
// }

export default Rhksflwk;
