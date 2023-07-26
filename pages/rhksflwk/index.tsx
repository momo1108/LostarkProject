import styles from "@/styles/character/Page.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";
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

export default Rhksflwk;
