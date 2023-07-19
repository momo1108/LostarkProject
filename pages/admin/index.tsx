import styles from "@/styles/character/Page.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import Page from "@/components/Page";

const Character: React.FC = () => {
  return (
    <Page className={`${styles.container} ${nanumNeo.className}`}>
      어드민페이지 ㅎㅇ
    </Page>
  );
};

export default Character;
