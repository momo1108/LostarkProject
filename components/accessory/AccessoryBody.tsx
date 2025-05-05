import styles from "@/styles/accessory/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import AccessorySearchContainer from "./search/AccessorySearchContainer";
import AccessoryResultContainer from "./result/AccessoryResultContainer";
import { AccessoryContextProvider } from "@/contexts/accessory/Index";

const AccessoryBody: React.FC = () => {
  return (
    <AccessoryContextProvider>
      <div className={`${styles.body} ${nanumNeo.className}`}>
        <AccessorySearchContainer />
        <AccessoryResultContainer />
      </div>
    </AccessoryContextProvider>
  );
};

export default AccessoryBody;
