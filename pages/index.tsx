import styles from '@/styles/Home.module.scss'
import MainHeader from "@/components/MainHeader";
import MainBody from "@/components/MainBody";
import DataService from '@/service/DataService';
import { MainProps, Menu } from '@/types/MainPageType';
import { readFileSync } from 'fs';
import axios from 'axios';

const Home:React.FC<MainProps> = ({menu}) => {
  // console.log(process.env.CLIENT_TOKEN);

  return (
    <div>
      <MainHeader />
      <MainBody menu={menu} />
    </div>
  )
}

export default Home;


export async function getStaticProps(){
  try{
    const res = await axios.get("http://localhost:3000/api/menu");
    console.log(res.data);
    return {
        props: {
            menu: res.data
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