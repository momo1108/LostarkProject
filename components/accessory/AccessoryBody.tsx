import styles from "@/styles/accessory/Body.module.scss";
import { nanumNeo } from "@/types/GlobalType";
import AccessorySearchContainer from "./bodycomponent/AccessorySearchContainer";
import AccessoryResultContainer from "./bodycomponent/AccessoryResultContainer";
import { AccessoryContextProvider } from "@/contexts/accessory/Index";
import { GrindingEffectData } from "@/types/EngraveType";

type AccessoryBodyProps = {
  grindingEffectData: GrindingEffectData;
};
const AccessoryBody: React.FC<AccessoryBodyProps> = ({
  grindingEffectData,
}) => {
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
