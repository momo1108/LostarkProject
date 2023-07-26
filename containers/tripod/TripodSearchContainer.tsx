import TripodSearchBlock from "@/components/tripod/bodycomponent/TripodSearchBlock";
import TripodContext from "@/contexts/TripodContext";
import { classDetailMap } from "@/types/GlobalType";
import { FilteredSkillType } from "@/types/TripodType";
import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

const TripodSearchContainer: React.FC = () => {
  const rootClassList = Object.keys(classDetailMap);
  const [rootClass, setRootClass] = useState<string>("전사(남)");
  const [subClass, setSubClass] = useState<string>("버서커");
  const [tripodData, setTripodData] = useState<FilteredSkillType[]>([]);
  const [loadingTripod, setLoadingTripod] = useState<boolean>(true);

  useEffect(() => {
    setLoadingTripod(true);
    const url =
      process.env.NEXT_PUBLIC_TRIPOD_API ||
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/tripod"
        : "http://loaple.site/api/tripod";
    // console.log(url);
    // console.log(process.env.NEXT_PUBLIC_TRIPOD_API);
    axios
      .get(url, {
        params: {
          class: subClass,
        },
      })
      .then((res) => {
        console.log(res.data);
        setTripodData(res.data.tripod);
      })
      .catch((err) => {
        alert(err.response.data);
        setTripodData([]);
      });
  }, [subClass]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTripod(false);
    }, 500);
  }, [tripodData]);

  return (
    <TripodContext.Provider
      value={{
        rootClassList,
        rootClass,
        setRootClass,
        subClass,
        setSubClass,
        tripodData,
        loadingTripod,
      }}
    >
      <TripodSearchBlock />
    </TripodContext.Provider>
  );
};

export default TripodSearchContainer;
