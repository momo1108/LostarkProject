import { useStateWithRef } from "@/hooks/useStateWithRef";
import {
  ACCESSORY_CATEGORY_CODES,
  AccessorySearchOption,
  GrindingEffectData,
} from "@/types/EngraveType";
import { AuctionItem, Sort, SortCondition } from "@/types/LostarkApiType";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import GRINDING_EFFECT_DATA from "@/data/grindingEffectOptions.json";
import { postMultipleAuctionItems } from "@/service/LostarkService";

/** ---------------------- 타입 정의 ---------------------- **/

// 고정 데이터만 담는 StaticContext
type AccessorySearchStaticContextType = {
  GRINDING_EFFECT_DATA: GrindingEffectData;
  accessorySearchOptionArrayRef: MutableRefObject<AccessorySearchOption[]>;
};

// 상태 데이터만 담는 SelectorContext
type AccessorySearchSelectorContextType = {
  pageStatus: number;
  combinationList: AuctionItem[][];
  progress: number;
  totalCases: number;
  currentCase: number;
  myTimer: number;
  accessorySearchOptionArray: AccessorySearchOption[];
};

// 상태 조작과 검색 기능에 관련된 함수를 담는 ActionContext
type AccessorySearchActionContextType = {
  setPageStatus: Dispatch<SetStateAction<number>>;
  setCombinationList: Dispatch<SetStateAction<AuctionItem[][]>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setTotalCases: Dispatch<SetStateAction<number>>;
  setCurrentCase: Dispatch<SetStateAction<number>>;
  setMyTimer: Dispatch<SetStateAction<number>>;
  setAccessorySearchOptionArray: (
    value:
      | AccessorySearchOption[]
      | ((prev: AccessorySearchOption[]) => AccessorySearchOption[])
  ) => void;
};

/** ---------------------- Context 생성 ---------------------- **/

const AccessorySearchStaticContext = createContext<
  AccessorySearchStaticContextType | undefined
>(undefined);
const AccessorySearchSelectorContext = createContext<
  AccessorySearchSelectorContextType | undefined
>(undefined);
const AccessorySearchActionContext = createContext<
  AccessorySearchActionContextType | undefined
>(undefined);

/** ---------------------- Provider ---------------------- **/

export const AccessorySearchContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pageStatus, setPageStatus] = useState<number>(0);
  const [combinationList, setCombinationList] = useState<AuctionItem[][]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [totalCases, setTotalCases] = useState<number>(1);
  const [currentCase, setCurrentCase] = useState<number>(0);
  const [myTimer, setMyTimer] = useState<number>(0);

  const [
    accessorySearchOptionArray,
    setAccessorySearchOptionArray,
    accessorySearchOptionArrayRef,
  ] = useStateWithRef<AccessorySearchOption[]>([]);

  useEffect(() => {
    const recentSearchOptionHistory = localStorage.getItem("recentSearchOptionHistory");
    if (recentSearchOptionHistory) {
      const parsedRecentSearchOptionHistory = JSON.parse(recentSearchOptionHistory);
      setAccessorySearchOptionArray(parsedRecentSearchOptionHistory);
    } else {
      setAccessorySearchOptionArray([
        {
          accessoryCategory: "목걸이",
          accessoryGrade: "고대",
          accessoryTier: 4,
          accessoryUpgradeLevel: 3,
          accessoryGrindingEffectArray: [],
        },
        {
          accessoryCategory: "귀걸이",
          accessoryGrade: "고대",
          accessoryTier: 4,
          accessoryUpgradeLevel: 3,
          accessoryGrindingEffectArray: [],
        },
        {
          accessoryCategory: "반지",
          accessoryGrade: "고대",
          accessoryTier: 4,
          accessoryUpgradeLevel: 3,
          accessoryGrindingEffectArray: [],
        },
      ]);
    }
  }, []);

  const loadSearchOptionPreset = (presetName:string) => {
    const searchOptionHistory = localStorage.getItem(`${presetName}_searchOptionHistory`);
    if (searchOptionHistory) {
      const parsedSearchOptionHistory = JSON.parse(searchOptionHistory);
      setAccessorySearchOptionArray(parsedSearchOptionHistory);
    }
  };
  
  // 선택된 조건 배열을 경매장 악세서리 검색 메서드(postMultipleAuctionItems)의 파라미터로 가공한 후 검색 메서드를 호출합니다.
  const postSearchOptionArray = useCallback(async () => {
    try {
    const requests = accessorySearchOptionArray.map((option) => {
      return ({
        "EtcOptions": option.accessoryGrindingEffectArray.map((effect) => {
          return {
            "FirstOption": 7,
            "SecondOption": effect.effectName.value,
            "MinValue": effect.effectValue.valueArray[effect.effectValue.level].Value,
            "MaxValue": effect.effectValue.valueArray[effect.effectValue.level].Value
          }
        }),
        "Sort": "BUY_PRICE" as Sort,
        "ItemTier": option.accessoryTier,
        "ItemGrade": option.accessoryGrade,
        "CategoryCode": ACCESSORY_CATEGORY_CODES[option.accessoryCategory],
        "PageNo": 0,
        "SortCondition": "ASC" as SortCondition
      })
    })
    const res = await postMultipleAuctionItems(requests);
    console.log(res);
    } catch (error) {
      console.error(error);
    }
  }, [accessorySearchOptionArray]);

  const staticContextValue = useMemo(
    () => ({
      GRINDING_EFFECT_DATA,
      accessorySearchOptionArrayRef,
    }),
    []
  );

  const selectorContextValue = useMemo(
    () => ({
      pageStatus,
      combinationList,
      progress,
      totalCases,
      currentCase,
      myTimer,
      accessorySearchOptionArray,
    }),
    [
      pageStatus,
      combinationList,
      progress,
      totalCases,
      currentCase,
      myTimer,
      accessorySearchOptionArray,
    ]
  );

  const actionContextValue = useMemo(
    () => ({
      setPageStatus,
      setCombinationList,
      setProgress,
      setTotalCases,
      setCurrentCase,
      setMyTimer,
      setAccessorySearchOptionArray,
      loadSearchOptionPreset,
      postSearchOptionArray
    }),
    []
  );

  return (
    <AccessorySearchStaticContext.Provider value={staticContextValue}>
      <AccessorySearchSelectorContext.Provider value={selectorContextValue}>
        <AccessorySearchActionContext.Provider value={actionContextValue}>
          {children}
        </AccessorySearchActionContext.Provider>
      </AccessorySearchSelectorContext.Provider>
    </AccessorySearchStaticContext.Provider>
  );
};

/** ---------------------- 커스텀 훅 ---------------------- **/

export const useAccessorySearchStaticContext = () => {
  const context = useContext(AccessorySearchStaticContext);
  if (!context)
    throw new Error(
      "useAccessorySearchStaticContext must be used within a AccessorySearchStaticContext"
    );
  return context;
};
export const useAccessorySearchSelectorContext = () => {
  const context = useContext(AccessorySearchSelectorContext);
  if (!context)
    throw new Error(
      "useAccessorySearchSelectorContext must be used within a AccessorySearchSelectorContext"
    );
  return context;
};
export const useAccessorySearchActionContext = () => {
  const context = useContext(AccessorySearchActionContext);
  if (!context)
    throw new Error(
      "useAccessorySearchActionContext must be used within a AccessorySearchActionContext"
    );
  return context;
};
