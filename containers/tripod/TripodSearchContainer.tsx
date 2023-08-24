import TripodSearchBlock from "@/components/tripod/bodycomponent/TripodSearchBlock";
import TripodSearchContext from "@/contexts/TripodSearchContext";
import LostarkService from "@/service/LostarkService";
import { classDetailMap } from "@/types/GlobalType";
import {
  FilteredSkillType,
  ParsedFilteredSkillType,
  SkillType,
  TripodPageStatus,
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
  pageStatus: TripodPageStatus;
  setPageStatus: Dispatch<SetStateAction<TripodPageStatus>>;
  setCurrentCase: Dispatch<SetStateAction<number>>;
  setTotalCases: Dispatch<SetStateAction<number>>;
  setMyTimer: Dispatch<SetStateAction<number>>;
};
const TripodSearchContainer: React.FC<TripodSearchContainerProps> = ({
  setResponseData,
  pageStatus,
  setPageStatus,
  setCurrentCase,
  setTotalCases,
  setMyTimer,
}) => {
  const [apiShine, setApiShine] = useState<boolean>(false);
  const [copyModalIsOpen, setCopyModalIsOpen] = useState<boolean>(false);
  const rootClassList = Object.keys(classDetailMap);
  const [rootClass, setRootClass] = useState<string>("전사(남)");
  const [subClass, setSubClass] = useState<string>("버서커");
  const [tripodData, setTripodData] = useState<ParsedFilteredSkillType[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<boolean[]>([]);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number>(0);
  const [minimizeSelector, setMinimizeSelector] = useState<boolean>(false);
  const [myWorker, setMyWorker] = useState<Worker>();
  const [copyData, setCopyData] = useState<SkillType[]>([]);

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
          setTimeout(() => {
            setPageStatus("DONE");
            setCurrentCase(0);
          }, 1000);
        } else if (result.status === "ERROR") {
          if (result.code === 401) {
            alert(
              "잘못된 API key 값이 입력됐습니다. 수정 후 다시 검색해주세요."
            );
            window.scrollTo({ top: 0 });
            setApiShine(true);
            setTimeout(() => {
              setApiShine(false);
            }, 2000);
            setTimeout(() => {
              setPageStatus("DONE");
              setCurrentCase(0);
            }, 1000);
          } else if (result.code === 429) {
            setMyTimer(61);
          } else {
            setPageStatus("DONE");
          }
          console.error(result.data);
        } else if (result.status === "INFORMATION") {
          setCurrentCase(result.data);
        }
      };
    }
  }, [myWorker]);

  useEffect(() => {
    if (pageStatus !== "COPYING" && pageStatus !== "BEFORE_COPY")
      setPageStatus("LOADING_SKILL");
    // setLoadingSkillset(true);
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
    // console.log(pageStatus);
    if (pageStatus === "SELECTING_TRIPOD") {
      setTimeout(() => {
        setPageStatus("DONE");
        // setSelectingTripod(false);
      }, 500);
    } else if (pageStatus === "LOADING_SKILL") {
      setSelectedSkills(Array(tripodData.length).fill(false));
      setTimeout(() => {
        setPageStatus("DONE");
        // setLoadingSkillset(false);
      }, 500);
    } else if (pageStatus === "BEFORE_COPY") {
      setPageStatus("COPYING");
      copyTripod();
    } else if (pageStatus === "COPYING") {
      setCopyData([]);
      setTimeout(() => {
        setPageStatus("DONE");
        setCopyModalIsOpen(false);
      }, 500);
    }
  }, [tripodData]);

  useEffect(() => {
    if (pageStatus !== "COPYING") {
      setTimeout(() => {
        setPageStatus("DONE");
        // setSelectingSkill(false);
      }, 500);
    }
  }, [selectedSkills]);

  const selectedData = useMemo(() => {
    // console.log(tripodData.filter((e, i) => selectedSkills[i]));
    return tripodData.filter((e, i) => selectedSkills[i]);
  }, [selectedSkills, tripodData]);

  const selectSkill = useCallback(
    (i: number) => {
      if (pageStatus === "SELECTING_SKILL") {
        alert("선택 작업을 진행중입니다.");
        return;
      }
      setPageStatus("SELECTING_SKILL");
      // setSelectingSkill(true);
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
    [selectedSkills, pageStatus, selectedSkillIndex]
  );

  const selectTripod = useCallback(
    (tier: number, name: string, level: number) => {
      setPageStatus("SELECTING_TRIPOD");
      // setSelectingTripod(true);
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
    setPageStatus("SELECTING_SKILL");
    // setSelectingSkill(true);
    setSelectedSkillIndex(0);
    setSelectedSkills(Array(tripodData.length).fill(false));
  }, [tripodData]);

  const resetAllTripods = useCallback(() => {
    setPageStatus("SELECTING_TRIPOD");
    // setSelectingTripod(true);
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
    if (!selectedData.length) return;
    setPageStatus("SELECTING_TRIPOD");
    // setSelectingTripod(true);
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
    const apiKey = localStorage.getItem("loapleApiKey");
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
          skillIcon: string;
          tripod: string;
          tripodIcon: string;
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
          skillIcon: cur.Icon,
          tripod: tripod.Name,
          tripodIcon: tripod.Icon,
          tier: tripod.Tier,
          data: {
            FirstOption: cur.Value,
            SecondOption: tripod.Value,
            MinValue: tripod.Level,
            MaxValue: tripod.Level,
          },
        })),
      ],
      []
    );
    // console.log(reqData);
    setTotalCases(reqData.length);
    setPageStatus("SEARCHING");

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

  const copyClass = useCallback(
    async (charName: string, className: string) => {
      try {
        setPageStatus("BEFORE_COPY");
        const { data } = await LostarkService.getCharacterSkills(charName);
        setCopyData(data);
        setSelectedSkillIndex(0);
        if (subClass !== className) {
          setRootClass(
            rootClassList.find((e) => classDetailMap[e].includes(className))!
          );
          setSubClass(className);
        } else {
          setTripodData(
            tripodData.map((skill) => ({
              ...skill,
              Tripods: skill.Tripods.map((tripod) => ({
                ...tripod,
                IsSelected: false,
                Level: 5,
              })),
            }))
          );
        }
      } catch (err) {
        alert("복사 실패");
        console.error(err);
      }
    },
    [rootClassList, subClass, classDetailMap, tripodData]
  );

  const copyTripod = useCallback(() => {
    // copyData에서 tripodData로 적용하기.
    const tmp_SelectedSkills = Array(tripodData.length).fill(false);
    const tmp_TripodData: ParsedFilteredSkillType[] = JSON.parse(
      JSON.stringify(tripodData)
    );

    copyData
      .filter((skill) => !skill.IsAwakening && skill.Tripods.length)
      .forEach((skill) => {
        // console.log(`skill : ${skill.Name}`);
        const skillIndex = tmp_TripodData.findIndex(
          (parsedSkill) => parsedSkill.Name === skill.Name
        );
        skill.Tripods.forEach((tripod) => {
          // console.log(`tripod : ${tripod.Name}`);
          if (tripod.IsSelected) {
            tmp_SelectedSkills[skillIndex] = true;
            const tripodIndex = tmp_TripodData[skillIndex].Tripods.findIndex(
              (parsedTripod) => parsedTripod.Name === tripod.Name
            );
            const originalTripod =
              tmp_TripodData[skillIndex].Tripods[tripodIndex];
            // 원본 tripodData에만 Upgradable 설정해놓음.
            if (originalTripod.Upgradable && tripod.Level >= 4) {
              originalTripod.Level = tripod.Level;
              originalTripod.IsSelected = true;
            }
            if (!originalTripod.Upgradable) {
              originalTripod.IsSelected = true;
            }
          }
        });
      });

    // console.log(tmp_SelectedSkills);
    // console.log(tmp_TripodData);
    setSelectedSkills(tmp_SelectedSkills);
    setTripodData(tmp_TripodData);
  }, [tripodData, copyData]);

  return (
    <TripodSearchContext.Provider
      value={{
        apiShine,
        copyModalIsOpen,
        setCopyModalIsOpen,
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
        selectSkill,
        selectTripod,
        resetSelectedSkills,
        resetAllTripods,
        resetSelectedTripod,
        minimizeSelector,
        setMinimizeSelector,
        searchTripod,
        pageStatus,
        copyClass,
      }}
    >
      <TripodSearchBlock />
    </TripodSearchContext.Provider>
  );
};

export default TripodSearchContainer;
