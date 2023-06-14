import styles from "@/styles/MainPage.module.scss";
import MainHeader from "@/components/MainHeader";
import MainBody from "@/components/MainBody";
import { MainProps } from "@/types/MainPageType";
import DataService from "@/service/DataService";
import { roboto } from "@/types/GlobalType";
import Page from "@/components/Page";

const Home: React.FC<MainProps> = ({ menu }) => {
  // console.log(process.env.CLIENT_TOKEN);

  return (
    <Page className={`${styles.container} ${roboto.className}`}>
      <MainHeader />
      <MainBody menu={menu} />
    </Page>
  );
};

export default Home;

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
