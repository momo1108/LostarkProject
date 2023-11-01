import styles from "@/styles/main/MainHeader.module.scss";
import { useEffect, useState } from "react";

export default function MainHeader() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <div className={`${styles.container}`}>
      <h1 className={`${styles.mainTitle} ${load ? styles.showUs : ""}`}>
        LOAPLE
      </h1>
      <h1 className="hidden">로아플</h1>
      <h2 className={`${styles.subTitle} ${load ? styles.showUs : ""}`}>
        Lostark Web Tools
      </h2>
      <h2 className="hidden">- 로스트아크 놀이터 -</h2>
      <p className={`${styles.description} ${load ? styles.showUs : ""}`}>
        초간단 로스트아크 웹 도구 사이트
      </p>
    </div>
  );
}
