import styles from '@/styles/MainPage.module.scss'
import MainHeader from "@/components/MainHeader";
import MainBody from "@/components/MainBody";
import DataService from '@/service/DataService';
import { MainProps, Menu } from '@/types/MainPageType';
import { readFileSync } from 'fs';
import axios from 'axios';

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
    const url:string = process.env.NODE_ENV === "production"? "http://loaple.site/api/menu" : "http://localhost:3000/api/menu"
    const res = await axios.get(url);
    return {
        props: {
            menu: res.data.menu
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