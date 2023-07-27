import TripodSearchBlock from "@/components/tripod/bodycomponent/TripodSearchBlock";
import TripodContext from "@/contexts/TripodContext";
import { classDetailMap } from "@/types/GlobalType";
import { FilteredSkillType, ParsedFilteredSkillType } from "@/types/TripodType";
import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";

const TripodSearchContainer: React.FC = () => {
  const rootClassList = Object.keys(classDetailMap);
  const [rootClass, setRootClass] = useState<string>("전사(남)");
  const [subClass, setSubClass] = useState<string>("버서커");
  const [tripodData, setTripodData] = useState<ParsedFilteredSkillType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<boolean[]>([]);
  const [loadingTripod, setLoadingTripod] = useState<boolean>(true);
  const [selectingTripod, setSelectingTripod] = useState<boolean>(true);

  useEffect(() => {
    setLoadingTripod(true);
    const url =
      process.env.NEXT_PUBLIC_TRIPOD_API ||
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/tripod"
        : "http://loaple.site/api/tripod";
    // console.log(url);
    console.log(process.env.NEXT_PUBLIC_TRIPOD_API);
    console.log(process.env.NODE_ENV);
    axios
      .get(url, {
        params: {
          class: subClass,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setTripodData(
          res.data.tripod.map((skill: FilteredSkillType) => {
            return { ...skill, Tooltip: JSON.parse(skill.Tooltip) };
          })
        );
      })
      .catch((err) => {
        alert(err.response.data);
        setTripodData([]);
      });
  }, [subClass]);

  useEffect(() => {
    setSelectedIndex(Array(tripodData.length).fill(false));
    setTimeout(() => {
      setLoadingTripod(false);
    }, 500);
  }, [tripodData]);

  useEffect(() => {
    setTimeout(() => {
      setSelectingTripod(false);
    }, 200);
  }, [selectedIndex]);

  const selectSkill = useCallback(
    (i: number) => {
      if (selectingTripod) {
        alert("선택 작업을 진행중입니다.");
        return;
      }
      setSelectingTripod(true);
      if (selectedIndex[i])
        setSelectedIndex((data) => [
          ...data.slice(0, i),
          false,
          ...data.slice(i + 1),
        ]);
      else
        setSelectedIndex((data) => [
          ...data.slice(0, i),
          true,
          ...data.slice(i + 1),
        ]);
    },
    [selectedIndex, selectingTripod]
  );

  const selectedData = useMemo(() => {
    // console.log(tripodData.filter((e, i) => selectedIndex[i]));
    return tripodData.filter((e, i) => selectedIndex[i]);
  }, [selectedIndex, tripodData]);

  return (
    <TripodContext.Provider
      value={{
        rootClassList,
        rootClass,
        setRootClass,
        subClass,
        setSubClass,
        tripodData,
        selectedIndex,
        selectedData,
        loadingTripod,
        selectingTripod,
        selectSkill,
      }}
    >
      <TripodSearchBlock />
    </TripodContext.Provider>
  );
};

export default TripodSearchContainer;
