import styles from "@/styles/engrave/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";

export default function EngraveBody() {
  return (
    <div className={`${styles.container} ${nanumNeo.className}`}>
      Hello world
    </div>
  );
}
