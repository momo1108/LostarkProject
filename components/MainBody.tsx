import styles from "@/styles/MainBody.module.scss";
import { MainProps } from "@/types/MainPageType";

const MainBody:React.FC<MainProps> = ({menu}) => {
    console.log(menu);

    return <div className={styles.container}>
        {
            menu.map(m=>{
                return <div className={styles.menuDiv}>
                    {/* {m.title} */}
                    <svg viewBox="0 0 173.20508075688772 200" height="200" width="174" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z" fill="#1e2530"></path></svg>
                </div>
            })
        }
    </div>;
}

export default MainBody;