import TripodSearchBlock from "@/components/tripod/bodycomponent/TripodSearchBlock";
import TripodContext from "@/contexts/TripodContext";
import { classDetailMap } from "@/types/GlobalType";
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

const TripodSearchContainer: React.FC = () => {
  const rootClassList = Object.keys(classDetailMap);
  const [rootClass, setRootClass] = useState<string>("전사(남)");
  const [subClass, setSubClass] = useState<string>("버서커");

  useEffect(() => {});

  return (
    <TripodContext.Provider
      value={{ rootClassList, rootClass, setRootClass, subClass, setSubClass }}
    >
      <TripodSearchBlock />
    </TripodContext.Provider>
  );
};

export default TripodSearchContainer;
