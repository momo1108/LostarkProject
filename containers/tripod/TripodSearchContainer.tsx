import TripodSearchBlock from "@/components/tripod/bodycomponent/TripodSearchBlock";
import TripodContext from "@/contexts/TripodResultContext";
import TripodSearchContext from "@/contexts/TripodSearchContext";
import LostarkService from "@/service/LostarkService";
import { AuctionItem } from "@/types/EngraveType";
import { classDetailMap } from "@/types/GlobalType";
import {
  FilteredSkillType,
  ParsedFilteredSkillType,
  TripodReqType,
  TripodResType,
} from "@/types/TripodType";
import axios from "axios";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

type TripodSearchContainerProps = {
  setResponseData: Dispatch<SetStateAction<TripodResType[]>>;
};
const TripodSearchContainer: React.FC<TripodSearchContainerProps> = ({
  setResponseData,
}) => {
  const [apiShine, setApiShine] = useState<boolean>(false);
  const rootClassList = Object.keys(classDetailMap);
  const [rootClass, setRootClass] = useState<string>("전사(남)");
  const [subClass, setSubClass] = useState<string>("버서커");
  const [tripodData, setTripodData] = useState<ParsedFilteredSkillType[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<boolean[]>([]);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number>(0);
  const [loadingSkillset, setLoadingSkillset] = useState<boolean>(true);
  const [selectingSkill, setSelectingSkill] = useState<boolean>(true);
  const [selectingTripod, setSelectingTripod] = useState<boolean>(false);
  const [minimizeSelector, setMinimizeSelector] = useState<boolean>(false);
  const [myWorker, setMyWorker] = useState<Worker>();

  useEffect(() => {
    setMyWorker(
      new Worker(new URL("@/web_workers/TripodWorker.ts", import.meta.url))
    );

    return () => {
      myWorker?.terminate();
    };
  }, []);

  useEffect(() => {
    if (myWorker) {
      myWorker.onmessage = (e) => {
        const result = JSON.parse(e.data);
        if (result.status === "SUCCESS") {
          setResponseData(result.data);
        } else {
          console.error(result.data);
        }
      };
    }
  }, [myWorker]);

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

  const searchTripod = useCallback(async () => {
    const apiKey = localStorage.getItem("loapleEngraveApiKey");
    if (!apiKey) {
      alert(
        "API Key 를 발급받아서 등록해주세요.\n등록 방법은 상단의 등록방법을 참조해주세요."
      );
      window.scrollTo({ top: 0 });
      setApiShine(true);
      setTimeout(() => {
        setApiShine(false);
      }, 2000);
      return;
    }

    // console.log(selectedData);
    const reqData = selectedData.reduce(
      (
        prev: {
          skill: string;
          tripod: string;
          tier: number;
          data: TripodReqType;
        }[],
        cur
      ) => [
        ...prev,
        ...cur.Tripods.filter(
          (tripod) => tripod.IsSelected && tripod.Upgradable
        ).map((tripod) => ({
          skill: cur.Name,
          tripod: tripod.Name,
          tier: tripod.Tier,
          data: {
            FirstOption: cur.Value,
            SecondOption: tripod.Value,
            MinValue: tripod.Level,
            MaxValue: 5,
          },
        })),
      ],
      []
    );
    // console.log(reqData);

    myWorker?.postMessage(
      JSON.parse(
        JSON.stringify({
          reqData,
          apiKey,
          subClass,
        })
      )
    );
  }, [subClass, selectedData]);

  return (
    <TripodSearchContext.Provider
      value={{
        apiShine,
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
        minimizeSelector,
        setMinimizeSelector,
        searchTripod,
      }}
    >
      <TripodSearchBlock />
    </TripodSearchContext.Provider>
  );
};

export default TripodSearchContainer;
