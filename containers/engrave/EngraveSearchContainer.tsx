import EngraveSearchBlock from "@/components/engrave/bodycomponent/EngraveSearchBlock";
import EngraveContext from "@/contexts/EngraveContext";
import EngraveService from "@/service/EngraveService";
import {
  AbilityInputMode,
  AccessoryInfo,
  AuctionItem,
  CASES_ANCIENT,
  CASES_RELIC,
  CheckMode,
  Combination,
  DropdownMode,
  ENGRAVES,
  EngraveInfo,
} from "@/types/EngraveType";
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

type EngraveSearchContainerProps = {
  pageStatus: number;
  combinationList: AuctionItem[][];
  setCombinationList: Dispatch<SetStateAction<AuctionItem[][]>>;
  setPageStatus: Dispatch<SetStateAction<number>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setTotalCases: Dispatch<SetStateAction<number>>;
  setCurrentCase: Dispatch<SetStateAction<number>>;
  setMyTimer: Dispatch<SetStateAction<number>>;
};
// state 로 사용했다가, 값의 변경에 있어 동기적인 동작이 필요해 변수로 설정.
let resultObject: {
  [key: number]: AuctionItem[];
} = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
};
const EngraveSearchContainer: React.FC<EngraveSearchContainerProps> = ({
  pageStatus,
  combinationList,
  setCombinationList,
  setPageStatus,
  setProgress,
  setTotalCases,
  setCurrentCase,
  setMyTimer,
}) => {
  const [negativeEngrave, setNegativeEngrave] = useState<EngraveInfo>({
    name: "감소 효과 선택",
    point: 0,
    enableInput: false,
    inputValue: "0",
  });
  const [targetList, setTargetList] = useState<EngraveInfo[]>([]);
  const [equipList, setEquipList] = useState<EngraveInfo[]>([]);
  const [abilityList, setAbilityList] = useState<EngraveInfo[]>([]);
  const [necklaceState, setNecklaceState] = useState<AccessoryInfo>({
    type: 0,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [earringState1, setEarringState1] = useState<AccessoryInfo>({
    type: 1,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [earringState2, setEarringState2] = useState<AccessoryInfo>({
    type: 1,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [ringState1, setRingState1] = useState<AccessoryInfo>({
    type: 2,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [ringState2, setRingState2] = useState<AccessoryInfo>({
    type: 2,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const answer: Combination[] = [];
  const tmp: number[][] = [];
  let tmp_info: { name: string; point: number }[] = [];
  const [myWorker, setMyWorker] = useState<Worker>();
  /*
  usingWebWorker -> web worker의 사용정보를 저장하는 state
  onmessage 함수 내부, postmessage 함수 이전 위치에서 수정되며
  첫번째요소는 web worker가 사용중으로 인지할 것인지에 사용되는 flag
  두번째요소는 어떤 과정에 사용되는지에 대한 flag 
  0~7은 onmessage type과 동일(어떤 상황으로 인해 사용할지/종료되었는지), 
  999는 검색이나 필터링이 진행중을 알림.
  */
  const [usingWebWorker, setUsingWebWorker] = useState<[boolean, number]>([
    false,
    0,
  ]);
  useEffect(() => {
    setMyWorker(
      new Worker(new URL("@/web_workers/worker.ts", import.meta.url))
    );

    return () => {
      myWorker?.terminate();
    };
  }, []);
  const accessoryList = {
    getter: [
      necklaceState,
      earringState1,
      earringState2,
      ringState1,
      ringState2,
    ],
    setter: [
      setNecklaceState,
      setEarringState1,
      setEarringState2,
      setRingState1,
      setRingState2,
    ],
  };

  const [statFilterValue, setStatFilterValue] = useState<{
    [key: string]: number;
  }>({
    치명: 0,
    특화: 0,
    신속: 0,
    제압: 0,
    인내: 0,
    숙련: 0,
  });
  const [otherFilterValue, setOtherFilterValue] = useState<{
    [key: string]: number;
  }>({
    "거래 가능 횟수": 0,
    "악세서리 등급": 0, // 0 : 고대, 1 : 유물, 2 : 고대 + 유물
    "고대등급 악세서리 개수": 1, // 악세서리 등급 : 2 인 경우 활성화
  });
  const [saveModalIsOpen, setSaveModalIsOpen] = useState<boolean>(false);
  const [loadModalIsOpen, setLoadModalIsOpen] = useState<boolean>(false);
  const [dropdownMode, setDropdownMode] = useState<DropdownMode>(3);
  const [dropdownSelector, setDropdownSelector] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  // 자꾸 자식요소(각인) 클릭 시 blur이벤트때문에 dropdown이 사라졌다가 다시나옴.
  // 방지하기 위해 사용
  const [preventBlur, setPreventBlur] = useState<boolean>(false);
  const engraveSearchList = useMemo(() => {
    setDropdownSelector(0);
    return ENGRAVES.filter((name: string) => {
      return name.includes(searchValue);
    });
  }, [searchValue]);
  const targetEngraveRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (myWorker) {
      myWorker.onmessage = (e) => {
        // console.log("search컴포넌트단", e);
        if (e.data.type === 0) setProgress(e.data.data);
        else if (e.data.type === 1) {
          setUsingWebWorker([false, 1]);
          const { availableArray, infoObject } = e.data.data;
          setCombinationList(
            availableArray.map((e: number[][]) => {
              return e
                .slice(0, 5)
                .map((e2: number[]) => infoObject[e2[1]][e2[0]]);
            })
          );
          setTimeout(() => {
            setPageStatus(1);
          }, 1000);
        } else if (e.data.type === 2) {
          setCurrentCase((e) => e + 1);
        } else if (e.data.type === 3) {
          console.error("검색 횟수를 초과하여 1분간 기다립니다.");
          setMyTimer(62);
          const timer = setInterval(() => {
            setMyTimer((e) => e - 1);
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
          }, 62000);
        } else if (e.data.type === 4) {
          setUsingWebWorker([false, 4]);
          setPageStatus(1);
          alert(
            "로스트아크 서버의 검색 서비스가 일시적으로 비활성화 됐습니다.\n서버 점검 시간이 아니라면, 잠시 후에 다시 검색해주세요."
          );
        } else if (e.data.type === 5) {
          setUsingWebWorker([false, 5]);
          setPageStatus(1);
          alert("잘못된 API key 값이 입력됐습니다. 수정 후 다시 검색해주세요.");
        } else if (e.data.type === 6) {
          setUsingWebWorker([false, 6]);
          setPageStatus(1);
          console.dir(e.data.errorArray);
          alert("로스트아크 서버 상태가 좋지 않아 검색이 취소됩니다.");
        } else if (e.data.type === 7) {
          /* 
          resultObject에서 중복을 제거해줘야 한다.
          최소값 이상의 악세서리를 검색하는 방식이므로,
          3/5 검색과 3/6 검색에서 겹치는 결과가 있을 수 있다.
          다른 수치들도 마찬가지이다.
          api에서 악세서리 경매 id값을 주면 참 좋을텐데.... 
          그런게 없기때문에, 임시방편으로라도 걸러주자.
          Set 자료구조를 활용해 unique 악세정보를 넣고,
          원본 데이터에서 filter와 Set.delete(element) 를 
          사용해 체크해준다.
          */
          const uniqueAccessoryInfo: { [key: number]: Set<string> } = {
            0: new Set(),
            1: new Set(),
            2: new Set(),
            3: new Set(),
            4: new Set(),
          };

          [0, 1, 2, 3, 4].map((i) => {
            e.data.tmp_resultObject[i] = e.data.tmp_resultObject[i]
              .filter(
                (accessory: AuctionItem) => accessory.AuctionInfo.BuyPrice
              )
              .sort(
                (a: AuctionItem, b: AuctionItem) =>
                  a.AuctionInfo.BuyPrice - b.AuctionInfo.BuyPrice
              );
            e.data.tmp_resultObject[i].map((accessory: AuctionItem) =>
              uniqueAccessoryInfo[i].add(
                `${accessory.Name}_${accessory.GradeQuality}_${accessory.AuctionInfo.EndDate}`
              )
            );
          });

          [0, 1, 2, 3, 4].map((i) => {
            e.data.tmp_resultObject[i] = e.data.tmp_resultObject[i].filter(
              (accessory: AuctionItem) =>
                uniqueAccessoryInfo[i].delete(
                  `${accessory.Name}_${accessory.GradeQuality}_${accessory.AuctionInfo.EndDate}`
                )
            );
          });

          resultObject = JSON.parse(JSON.stringify(e.data.tmp_resultObject));
          setUsingWebWorker([true, 7]);

          /*
          현 위치(onmessage)에서 state값을 활용한 webworker의 postmessage를 사용하는 경우,
          나중에 onmessage가 트리거되는 시점에서의 state 값이 아닌, 
          postmessage의 내용이 등록되는 시점에서의 내용으로 적용되는 것을 확인하였다. 
          이는 web worker에 데이터를 전달할 때 수행하는 객체의 deep copy 에 사용한 
          JSON.parse(JSON.stringify(객체)) 뿐 아니라, onmessage를 등록하는 과정에 있어서,
          미리 등록되는 시점에서의 값으로 listener 함수가 저장이 되버리기 때문에 그런것으로 추측된다.

          따라서, 이 위치에서 직접 실행하는 코드를 작성하는게 아닌, 실행을 담당하는 함수를 따로 작성한다.

          위 방법도 같은 문제가 발생 ㅡ,.ㅡ
          이번에는 의존성에 filter 내용을 추가해서 직접 실행하도록 다시 수정하자.
          */
        }
      };
      // console.log(myWorker);
    }
  }, [myWorker]);
  useEffect(() => {
    if (usingWebWorker[0] && usingWebWorker[1] === 7) {
      applyFilter();
    }
  }, [usingWebWorker]);
  function check(name: string, mode: CheckMode) {
    if (mode === 0) {
      const index = targetList.findIndex((e: EngraveInfo) => e.name === name);
      if (index > -1)
        setTargetList(targetList.filter((e: EngraveInfo) => e.name !== name));
      else setTargetList([...targetList, { name, level: 3 }]);
    } else if (mode === 1) {
      if (equipList.length >= 2) {
        setPreventBlur(true);
        alert("장착 각인은 최대 2개까지입니다.");
        return;
      } else setEquipList([...equipList, { name, level: 3 }]);
    } else if (mode === 2) {
      const index = abilityList.findIndex((e: EngraveInfo) => e.name === name);
      if (index > -1)
        setAbilityList(abilityList.filter((e: EngraveInfo) => e.name !== name));
      else if (abilityList.length >= 2) {
        setPreventBlur(true);
        alert("장착 각인은 최대 2개까지입니다.");
        return;
      } else
        setAbilityList([
          ...abilityList,
          { name, point: 7, enableInput: false, inputValue: "7" },
        ]);
    }
  }

  function setTargetEngraveLevel(i: number, level: number) {
    const tmp = JSON.parse(JSON.stringify(targetList));
    tmp.splice(i, 1, { ...targetList[i], level: level });
    setTargetList(tmp);
  }

  function setEquipEngraveLevel(i: number, level: number) {
    if (level > 3 || level < 0) return;
    const tmp = JSON.parse(JSON.stringify(equipList));
    tmp.splice(i, 1, { ...equipList[i], level: level });
    setEquipList(tmp);
  }

  function setAbilityEngravePoint(i: number, point: number) {
    if (point > 10 || point < 0) {
      alert("잘못된 값이 입력됐습니다.\n0~10 사이의 값을 입력해주세요.");
      return;
    }
    const tmp = JSON.parse(JSON.stringify(abilityList));
    tmp.splice(i, 1, { ...abilityList[i], point, inputValue: point });
    setAbilityList(tmp);
  }

  function setAbilityInput(i: number, mode: AbilityInputMode) {
    const tmp = JSON.parse(JSON.stringify(abilityList));
    if (mode === 0) {
      tmp.splice(i, 1, {
        ...abilityList[i],
        enableInput: true,
        inputValue: abilityList[i].point,
      });
      setAbilityList(tmp);
    } else if (mode === 1) {
      tmp.splice(i, 1, {
        ...abilityList[i],
        enableInput: false,
        inputValue: abilityList[i].point,
      });
      setAbilityList(tmp);
    } else {
      const tmpValue = parseInt(abilityList[i].inputValue!);
      if (isNaN(tmpValue)) {
        tmp.splice(i, 1, {
          ...abilityList[i],
          enableInput: false,
          inputValue: abilityList[i].point,
        });
        setAbilityList(tmp);
      } else {
        let tmpPoint;
        if (tmpValue > 10 || tmpValue < 0) {
          alert("잘못된 값이 입력됐습니다.\n0~10 사이의 값을 입력해주세요.");
          tmpPoint = abilityList[i].point;
        } else {
          tmpPoint = tmpValue;
        }
        tmp.splice(i, 1, {
          ...abilityList[i],
          enableInput: false,
          point: tmpPoint,
        });
        setAbilityList(tmp);
      }
    }
  }

  function setNegativeAbilityInput(mode: AbilityInputMode) {
    if (mode === 0) {
      setNegativeEngrave({
        ...negativeEngrave,
        enableInput: true,
        inputValue: negativeEngrave.point!.toString(),
      });
    } else if (mode === 1) {
      setNegativeEngrave({
        ...negativeEngrave,
        inputValue: negativeEngrave.point!.toString(),
        enableInput: false,
      });
    } else {
      const tmpValue = parseInt(negativeEngrave.inputValue!);
      if (isNaN(tmpValue)) {
        setNegativeEngrave({
          ...negativeEngrave,
          inputValue: negativeEngrave.point!.toString(),
          enableInput: false,
        });
      } else {
        let tmpPoint;
        if (tmpValue > 10 || tmpValue < 0) {
          alert("잘못된 값이 입력됐습니다.\n0~10 사이의 값을 입력해주세요.");
          tmpPoint = negativeEngrave.point;
        } else {
          tmpPoint = tmpValue;
        }
        setNegativeEngrave({
          ...negativeEngrave,
          point: tmpPoint,
          enableInput: false,
        });
      }
    }
  }

  function saveSetting() {
    localStorage.setItem(
      "engraveSettingInfo",
      JSON.stringify({
        targetList,
        equipList,
        abilityList,
        negativeEngrave,
        accessoryList: accessoryList.getter,
      })
    );
  }

  async function searchSetting() {
    if (pageStatus > 1) {
      alert("검색 서비스가 진행중입니다.\n완료 후 다시 시도해주세요.");
      return;
    }
    if (targetList.length < 4) {
      alert("각인을 4개 이상 설정해주세요.");
      return;
    } else if (equipList.length < 2) {
      alert("장착 각인서를 2개 이상 설정해주세요.");
      return;
    } else if (abilityList.length < 2) {
      alert("어빌리티 스톤의 각인을 2개 이상 설정해주세요.");
      return;
    } else if (negativeEngrave.name === "감소 효과 선택") {
      alert("어빌리티 스톤의 감소 각인을 설정해주세요.");
      return;
    }
    const apiKey = localStorage.getItem("loapleEngraveApiKey");
    if (!apiKey) {
      alert(
        "API Key 를 발급받아서 등록해주세요.\n등록 방법은 상단의 등록방법을 참조해주세요."
      );
      return;
    }

    if (
      combinationList.length &&
      !confirm(
        '이전 검색 결과가 존재합니다.\n이전 검색 결과를 지우고 새로 검색하시겠습니까?\n(이전 검색 결과를 사용해 필터링 하고 싶은 경우, 취소 버튼을 누른 후 오른쪽의 "검색 결과 필터링" 기능을 사용하세요.)'
      )
    )
      return;

    setProgress(0);
    setCurrentCase(0);
    setPageStatus(2);

    tmp_info = targetList.map((e: EngraveInfo) => {
      return { name: e.name, point: e.level! * 5 };
    });
    equipList.map((e: EngraveInfo) => {
      const index = tmp_info.findIndex((e2) => e2.name === e.name);
      if (index >= 0) {
        tmp_info[index].point -= e.level! * 3 + 3;
        if (tmp_info[index].point <= 0) tmp_info.splice(index, 1);
      }
    });
    abilityList.map((e: EngraveInfo) => {
      const index = tmp_info.findIndex((e2) => e2.name === e.name);
      if (index >= 0) {
        tmp_info[index].point -= e.point!;
        if (tmp_info[index].point <= 0) tmp_info.splice(index, 1);
      }
    });

    const total_point = tmp_info.reduce(
      (acc: number, cur: { name: string; point: number }) => acc + cur.point,
      0
    );

    pickTwo(tmp_info, 0, total_point, tmp_info.length);

    const ear_diff: boolean =
      accessoryList.getter[1].stat1.type !== accessoryList.getter[2].stat1.type;
    const ring_diff: boolean =
      accessoryList.getter[3].stat1.type !== accessoryList.getter[4].stat1.type;

    // console.log(tmp_info);
    // console.log(accessoryList);
    // console.log(answer);

    // 가능한 각인 조합의 중복을 제거할 Set
    const mySet = new Set<string>();
    answer.forEach((e) => {
      e.data.forEach((e2) => {
        mySet.add(e2.join(""));
      });
    });

    // 유니크한 각인값정보를 배열에 저장한다.
    const uniqueEngrave: [string, number, string, number][] = [];
    let tmpSplit: number[];
    mySet.forEach((e) => {
      tmpSplit = e.split("").map((e2) => parseInt(e2));
      uniqueEngrave.push([
        tmpSplit[0] === 9 ? "ANY" : tmp_info[tmpSplit[0]].name,
        tmpSplit[1],
        tmpSplit[2] === 9 ? "ANY" : tmp_info[tmpSplit[2]].name,
        tmpSplit[3],
      ]);
    });
    // console.log(uniqueEngrave);
    if (!uniqueEngrave.length) {
      setPageStatus(1);
      alert("불가능한 목표 각인입니다.");
      return;
    }

    /* 
    유니크 각인 정보들을 악세서리 각 부위에 적용해 검색한다.
    따라서 총 api request는 각인 정보 수 * 악세서리부위 만큼이다.
    단, 여기서 귀걸이와 반지는 2개씩 검색하지만, 
    귀걸이 쌍 혹은 반지 쌍의 전투 특성이 같은 경우 하나로 취급해 검색한다.
    따라서 귀걸이 쌍의 특성이 같으면 부위수는 4
    반지 쌍의 특성이 같으면 부위수는 4
    귀걸이와 반지 쌍의 특성이 같으면 부위수는 3으로 취급한다.
    */
    // 각인 조합 반복문

    setTotalCases(uniqueEngrave.length * (ear_diff ? (ring_diff ? 5 : 4) : 3));
    // let tmp_resultObject: { [key: number]: AuctionItem[] } = testResult;

    // console.log("postmessage", {
    //   type: 0,
    //   data: JSON.parse(
    //     JSON.stringify({
    //       uniqueEngrave,
    //       ear_diff,
    //       ring_diff,
    //       accessoryList,
    //       apiKey,
    //     })
    //   ),
    // });

    setUsingWebWorker([true, 999]);
    myWorker?.postMessage({
      type: 0,
      data: JSON.parse(
        JSON.stringify({
          uniqueEngrave,
          ear_diff,
          ring_diff,
          accessoryList,
          apiKey,
        })
      ),
      filter: JSON.parse(
        JSON.stringify({
          stat: statFilterValue,
          others: otherFilterValue,
        })
      ),
    });
  }

  function pickTwo(
    input: { name: string; point: number }[],
    count: number,
    point_sum: number,
    need_count: number
  ) {
    // 완성된 경우
    if (need_count <= 0) {
      if (count === 5) {
        // 5꽉
        const data = JSON.parse(JSON.stringify(tmp));
        const [sum, max, useless_count]: number[] = data.reduce(
          (cur: number[], el: number[]) => [
            cur[0] + el[1] + el[3],
            Math.max(cur[1], el[1], el[3]),
            cur[2] + (el[0] === 9 ? 1 : 0) + (el[2] === 9 ? 1 : 0),
          ],
          [0, 0, 0]
        );
        answer.push({
          data,
          sum,
          max,
          useless_count,
        });
        return;
      } else {
        const tmp_copy = JSON.parse(JSON.stringify(tmp));
        const data = [
          ...tmp_copy,
          ...Array(5 - tmp_copy.length).fill([9, 3, 9, 3]),
        ];
        const [sum, max, useless_count]: number[] = data.reduce(
          (cur: number[], el: number[]) => [
            cur[0] + el[1] + el[3],
            Math.max(cur[1], el[1], el[3]),
            cur[2] + (el[0] === 9 ? 1 : 0) + (el[2] === 9 ? 1 : 0),
          ],
          [0, 0, 0]
        );
        answer.push({
          data,
          sum,
          max,
          useless_count,
        });
        return;
      }
    }

    /*
    가지치기
    1. 각 case에 대해서 차감 전 남아있는 포인트가 case의 포인트보다 작으면 안된다.
       (단, case의 포인트가 3인 경우는 제외)
    2. 각 case에 대해서 포인트 차감 후 남은 포인트가 count * 9 보다 크면 안된다.
    3. i나 j 위치에 0 이하의 point 값인 경우에 대해, point 필요 각인이 많으면 skip한다.
      - point_i가 0 이하 
        - point_j가 0 이하 & 필요각인 1개 이상 -> continue j
        - point_j가 1 이상 & 필요각인 2개 이상 -> continue i
      - point_i가 1 이상
        - point_j가 0 이하 & 필요각인 2개 이상 -> continue j
      - 단, 5개 이전에 이미 만족된 경우도 고려해야한다.
    4. 악세서리의 각인 중 포인트가 큰 쪽의 경우 해당 목표 각인의 포인트가 3보다 크고,
     포인트 차감 시 남은 포인트가 3보다 작아지면 중복검색에 해당되므로 제외한다.
      - 고대악세의 경우 7~8 포인트의 경우 적용 각인이 큰쪽(ex. 6,3의 6)인 경우, 남은 포인트가 3 이상이 아닌 경우를 제외한다.
        - 7 포인트 : 3, 4 만 사용
        - 8 포인트 : 3, 4, 5 만 사용
      - 유물악세의 경우 6~7 포인트의 경우 적용 각인이 큰쪽(ex. 5,3의 5)인 경우, 남은 포인트가 3 이상이 아닌 경우를 제외한다.
        - 6 포인트 : 3 만 사용
        - 7 포인트 : 3, 4 만 사용
    */

    // 2번 가지치기
    if (point_sum > (5 - count) * 9) return;

    let uselessI = false,
      uselessJ = false;

    // i - 목표 각인 정보 중 첫번째 각인 index, j - 목표 각인 정보 중 두번째 각인 index
    for (let i = 0; i < input.length; i++) {
      // 3번 가지치기 - 1
      if (input[i].point <= 0 && need_count >= 2) continue;

      // 필요없는 각인의 경우 표기
      if (input[i].point <= 0) uselessI = true;

      for (let j = 0; j < input.length; j++) {
        if (j === i) continue;
        // 3번 가지치기 - 2
        if (input[j].point <= 0) {
          if (need_count >= 2) continue;
          else if (need_count >= 1 && input[i].point <= 0) continue;
          uselessJ = true;
        }

        for (const [case0, case1] of otherFilterValue["악세서리 등급"] === 1
          ? CASES_RELIC
          : CASES_ANCIENT) {
          // 1번 가지치기
          if (case0 > input[i].point && case0 > 3) continue;
          // 4번 가지치기
          if (input[i].point === 7 && case0 > 4) continue;
          if (input[i].point === 8 && case0 > 5) continue;
          const minI = Math.min(input[i].point, case0);
          const minJ = Math.min(input[j].point, case1);
          input[i].point -= minI;
          input[j].point -= minJ;
          tmp.push([uselessI ? 9 : i, case0, uselessJ ? 9 : j, case1]);
          pickTwo(
            input,
            count + 1,
            point_sum - minI - minJ,
            input.reduce(
              (count, engrave) => (engrave.point > 0 ? count + 1 : count),
              0
            )
          );
          tmp.pop();
          input[i].point += minI;
          input[j].point += minJ;
        }

        uselessJ = false;
      }
      uselessI = false;
    }
  }

  function applyFilter() {
    /*
    0. 검색 시작도 안한 상태에서 필터링(문제없음)
    0->함수

    1. 이미 검색한 결과에서 필터링(문제없음)
    1->함수

    2. 검색진행 직후에 필터링(문제발생)
    2->함수
    검색이 진행된 후에 실행되는 것인지 진행중에 실행되는 것인지.

    3. 필터링 중에 다시 필터링실행(web worker에서 어떻게 동작할까? 단순히 밀려서 진행되는 거라면? flag를 사용해 진행중일 때는 return시킬까?)
    3->함수

    위 0~3 상태 내에서 처리하는게 best. 그 외에는 presentational layer 까지 영향을 미친다.
     */
    if (pageStatus === 2 && usingWebWorker[0] && usingWebWorker[1] === 999) {
      alert("검색 서비스가 진행중입니다.\n완료 후 다시 시도해주세요.");
      return;
    } else if (
      pageStatus === 3 &&
      usingWebWorker[0] &&
      usingWebWorker[1] === 999
    ) {
      alert("필터링 서비스가 이미 진행중입니다.\n완료 후 다시 시도해주세요.");
      return;
    } else if (pageStatus === 0) {
      alert("필터링 전 검색을 먼저 진행해주세요.");
      return;
    }
    /*
    1. 처음 검색한 뒤에 필터링이 진행되기 때문에 combinationList가 비어있는 경우
    2. 검색을 완료하고 나서 해당 결과가 없기 때문에 combinationList가 비어있는 경우
    2번의 경우는 return 정상적으로 처리되지만, 1번의 경우 return 되면 안된다.
    1번의 경우는 검색 -> 필터링이 연달아 진행되므로 검색 후에는 
    usingWebWorker[0]를 true로 유지하고 필터링 후에만 false로 변환해서 차이점을 flag로 사용하자.
    (onmessage의 type === 7 이 검색, type === 1 이 필터링)
    */
    if (
      !resultObject[0].length ||
      !resultObject[1].length ||
      !resultObject[3].length ||
      (accessoryList.getter[1].stat1.type !==
        accessoryList.getter[2].stat1.type &&
        !resultObject[2].length) ||
      (accessoryList.getter[3].stat1.type !==
        accessoryList.getter[4].stat1.type &&
        !resultObject[4].length &&
        !usingWebWorker[0])
    ) {
      alert("필터링할 내용이 없습니다.");
      return;
    }
    setProgress(0);
    setPageStatus(3);
    setCurrentCase(999);

    // filtering에 사용할 각인 정보를 설정합니다.
    const tmp_info: { name: string; point: number }[] = targetList.map(
      (e: EngraveInfo) => {
        return { name: e.name, point: e.level! * 5 };
      }
    );
    equipList.map((e: EngraveInfo) => {
      const index = tmp_info.findIndex((e2) => e2.name === e.name);
      if (index >= 0) {
        tmp_info[index].point -= e.level! * 3 + 3;
        if (tmp_info[index].point <= 0) tmp_info.splice(index, 1);
      }
    });
    abilityList.map((e: EngraveInfo) => {
      const index = tmp_info.findIndex((e2) => e2.name === e.name);
      if (index >= 0) {
        tmp_info[index].point -= e.point!;
        if (tmp_info[index].point <= 0) tmp_info.splice(index, 1);
      }
    });

    const positiveCounter: { [key: string]: number } = tmp_info.reduce(
      (prev, cur) => ({ ...prev, [cur.name]: cur.point }),
      {}
    );

    const negativeCounter: { [key: string]: number } = {
      "공격력 감소": 0,
      "공격속도 감소": 0,
      "방어력 감소": 0,
      "이동속도 감소": 0,
    };
    negativeCounter[negativeEngrave.name] += negativeEngrave.point || 0;

    setUsingWebWorker([true, 999]);
    myWorker?.postMessage({
      type: 1,
      data: JSON.parse(
        JSON.stringify({
          infoObject: resultObject,
          negativeCounter,
          positiveCounter,
        })
      ),
      filter: JSON.parse(
        JSON.stringify({
          stat: statFilterValue,
          others: otherFilterValue,
        })
      ),
    });
  }
  return (
    <EngraveContext.Provider
      value={{
        negativeEngrave,
        setNegativeEngrave,
        targetList,
        setTargetList,
        equipList,
        setEquipList,
        abilityList,
        setAbilityList,
        necklaceState,
        setNecklaceState,
        earringState1,
        setEarringState1,
        earringState2,
        setEarringState2,
        ringState1,
        setRingState1,
        ringState2,
        setRingState2,
        answer,
        tmp,
        tmp_info,
        myWorker,
        setMyWorker,
        usingWebWorker,
        setUsingWebWorker,
        accessoryList,
        resultObject,
        statFilterValue,
        setStatFilterValue,
        otherFilterValue,
        setOtherFilterValue,
        saveModalIsOpen,
        setSaveModalIsOpen,
        loadModalIsOpen,
        setLoadModalIsOpen,
        dropdownMode,
        setDropdownMode,
        dropdownSelector,
        setDropdownSelector,
        searchValue,
        setSearchValue,
        preventBlur,
        setPreventBlur,
        engraveSearchList,
        targetEngraveRef,
        check,
        setTargetEngraveLevel,
        setEquipEngraveLevel,
        setAbilityEngravePoint,
        setAbilityInput,
        setNegativeAbilityInput,
        saveSetting,
        searchSetting,
        pickTwo,
        applyFilter,
        dropdownRef,
      }}
    >
      <EngraveSearchBlock />
    </EngraveContext.Provider>
  );
};

export default EngraveSearchContainer;
