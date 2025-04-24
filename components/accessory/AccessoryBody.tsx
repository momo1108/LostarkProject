import styles from "@/styles/accessory/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import AccessorySearchContainer from "./bodycomponent/AccessorySearchContainer";
import AccessoryResultContainer from "./bodycomponent/AccessoryResultContainer";
import { AccessoryContextProvider } from "@/contexts/accessory/Index";

type AccessoryBodyProps = {
  grindingEffect: Object;
};
const AccessoryBody: React.FC<AccessoryBodyProps> = ({ grindingEffect }) => {
  console.log(grindingEffect);
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
