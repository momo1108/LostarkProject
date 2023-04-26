import styles from "@/styles/MainBody.module.scss";
import { MainProps } from "@/types/MainPageType";

const MainBody:React.FC<MainProps> = ({menu}) => {
    console.log(menu);

    return <div className={styles.container}>
        {

        }
    </div>;
}

export default MainBody;