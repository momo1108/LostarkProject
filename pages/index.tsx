import styles from '@/styles/MainPage.module.scss'
import MainHeader from "@/components/MainHeader";
import MainBody from "@/components/MainBody";
import { MainProps } from '@/types/MainPageType';
import DataService from '@/service/DataService';

const Home:React.FC<MainProps> = ({menu}) => {
  // console.log(process.env.CLIENT_TOKEN);

  return (
    <div className={styles.container}>
      <MainHeader />
      <MainBody menu={menu} />
    </div>
  )
}

export default Home;


export async function getStaticProps(){
  try{
    const menu = await DataService.getMenu();
    return {
      props: {
        menu
      }
    }
  } catch(error:any){
    return {
        props: {
            menu: []
        }
    }
  }

}