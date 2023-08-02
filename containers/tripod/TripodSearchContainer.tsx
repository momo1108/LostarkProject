import TripodSearchBlock from "@/components/tripod/bodycomponent/TripodSearchBlock";
import TripodSearchContext from "@/contexts/TripodSearchContext";
import { classDetailMap } from "@/types/GlobalType";
import { FilteredSkillType, ParsedFilteredSkillType } from "@/types/TripodType";
import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";

const TripodSearchContainer: React.FC = () => {
  const rootClassList = Object.keys(classDetailMap);
  const [rootClass, setRootClass] = useState<string>("전사(남)");
  const [subClass, setSubClass] = useState<string>("버서커");
  const [tripodData, setTripodData] = useState<ParsedFilteredSkillType[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<boolean[]>([]);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number>(0);
  const [loadingSkillset, setLoadingSkillset] = useState<boolean>(true);
  const [selectingSkill, setSelectingSkill] = useState<boolean>(true);
  const [selectingTripod, setSelectingTripod] = useState<boolean>(false);

  useEffect(() => {
    setLoadingSkillset(true);
    setSelectedSkillIndex(0);
    const url =
      process.env.NEXT_PUBLIC_TRIPOD_API ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/tripod"
        : "/loaple/tripod");
    // console.log(url);
    // console.log(process.env.NEXT_PUBLIC_TRIPOD_API);
    // console.log(process.env.NODE_ENV);
    axios
      .get(url, {
        params: {
          class: subClass,
        },
        timeout: 10000,
      })
      .then((res) => {
        // console.log(res.data);
        setTripodData(
          res.data.tripod.map((skill: FilteredSkillType) => {
            return {
              ...skill,
              Tooltip: JSON.parse(skill.Tooltip),
              Tripods: skill.Tripods.map((tripod) => ({
                ...tripod,
                IsSelected: false,
                Level: 5,
              })),
            };
          })
        );
      })
      .catch((err) => {
        alert(err.response.data);
        setTripodData([]);
      });
  }, [subClass]);

  useEffect(() => {
    // console.log(tripodData);
    if (selectingTripod) {
      setTimeout(() => {
        setSelectingTripod(false);
      }, 500);
    } else {
      setSelectedSkills(Array(tripodData.length).fill(false));
      setTimeout(() => {
        setLoadingSkillset(false);
      }, 500);
    }
  }, [tripodData]);

  useEffect(() => {
    setTimeout(() => {
      setSelectingSkill(false);
    }, 500);
  }, [selectedSkills]);

  const selectedData = useMemo(() => {
    // console.log(tripodData.filter((e, i) => selectedSkills[i]));
    return tripodData.filter((e, i) => selectedSkills[i]);
  }, [selectedSkills, tripodData]);

  const selectSkill = useCallback(
    (i: number) => {
      if (selectingSkill) {
        alert("선택 작업을 진행중입니다.");
        return;
      }
      setSelectingSkill(true);
      if (selectedSkills[i]) {
        const delIndex = selectedData.findIndex(
          (skill) => skill.Name === tripodData[i].Name
        );

        if (selectedSkillIndex > 0) {
          if (
            delIndex < selectedSkillIndex ||
            (delIndex === selectedSkillIndex &&
              selectedSkillIndex === selectedData.length - 1)
          )
            setSelectedSkillIndex((e) => e - 1);
        }

        setSelectedSkills((data) => [
          ...data.slice(0, i),
          false,
          ...data.slice(i + 1),
        ]);
      } else {
        if (selectedData.length && selectedSkillIndex > 0) {
          const curIndex = tripodData.findIndex(
            (skill) => skill.Name === selectedData[selectedSkillIndex].Name
          );
          if (i < curIndex) setSelectedSkillIndex((e) => e + 1);
        }

        setSelectedSkills((data) => [
          ...data.slice(0, i),
          true,
          ...data.slice(i + 1),
        ]);
      }
    },
    [selectedSkills, selectingSkill, selectedSkillIndex]
  );

  const selectTripod = useCallback(
    (tier: number, name: string, level: number) => {
      setSelectingTripod(true);
      const targetSkillIndex = tripodData.findIndex(
        (e) => e.Name === selectedData[selectedSkillIndex].Name
      );
      const result = {
        ...tripodData[targetSkillIndex],
        Tripods: tripodData[targetSkillIndex].Tripods.map((e) =>
          e.Tier === tier
            ? e.Name === name
              ? { ...e, IsSelected: true, Level: level >= 4 ? level : e.Level }
              : { ...e, IsSelected: false }
            : e
        ),
      };

      const tmp_tripodData = JSON.parse(JSON.stringify(tripodData));
      tmp_tripodData.splice(targetSkillIndex, 1, result);
      setTripodData(tmp_tripodData);
    },
    [tripodData, selectedData, selectedSkillIndex]
  );

  const resetSelectedSkills = useCallback(() => {
    setSelectingSkill(true);
    setSelectedSkillIndex(0);
    setSelectedSkills(Array(tripodData.length).fill(false));
  }, [tripodData]);

  const resetAllTripods = useCallback(() => {
    setSelectingTripod(true);
    setTripodData((e) =>
      e.map((skill: FilteredSkillType) => {
        return {
          ...skill,
          Tripods: skill.Tripods.map((tripod) => ({
            ...tripod,
            IsSelected: false,
            Level: 5,
          })),
        };
      })
    );
  }, [tripodData]);

  const resetSelectedTripod = useCallback(() => {
    setSelectingTripod(true);
    const skillName = selectedData[selectedSkillIndex].Name;
    setTripodData((e) =>
      e.map((skill: FilteredSkillType) =>
        skill.Name === skillName
          ? {
              ...skill,
              Tripods: skill.Tripods.map((tripod) => ({
                ...tripod,
                IsSelected: false,
                Level: 5,
              })),
            }
          : skill
      )
    );
  }, [tripodData, selectedData, selectedSkillIndex]);

  return (
    <TripodSearchContext.Provider
      value={{
        rootClassList,
        rootClass,
        setRootClass,
        subClass,
        setSubClass,
        tripodData,
        selectedSkills,
        selectedSkillIndex,
        setSelectedSkillIndex,
        selectedData,
        loadingSkillset,
        selectingSkill,
        selectingTripod,
        selectSkill,
        selectTripod,
        resetSelectedSkills,
        resetAllTripods,
        resetSelectedTripod,
      }}
    >
      <TripodSearchBlock />
    </TripodSearchContext.Provider>
  );
};

export default TripodSearchContainer;
