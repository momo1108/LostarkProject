import styles from "@/styles/MainHeader.module.scss";
import { useEffect, useState } from "react";

export default function MainHeader(){
    const [load, setLoad] = useState(false);

    useEffect(()=>{
        setLoad(true);
    }, [])

    return <div className={`${styles.container} ${load?styles.showUs:""}`}>
        <h1 className={`${styles.mainTitle} ${load?styles.showUs:""}`}>Loaple</h1>
        <h2 className={`${styles.subTitle} ${load?styles.showUs:""}`}> - Lostark Playground - </h2>
        <p className={`${styles.description} ${load?styles.showUs:""}`}>로스트아크를 씹고 뜯고 맛보고 즐기기 위한 간단한 웹 사이트입니다.</p>
    </div>
}