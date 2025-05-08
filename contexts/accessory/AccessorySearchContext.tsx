import { useStateWithRef } from "@/hooks/useStateWithRef";
import {
  ACCESSORY_CATEGORY_CODES,
  AccessoryCategory,
  AccessoryGrade,
  AccessorySearchOption,
  AccessoryTier,
  AccessoryTradeCount,
  AccessoryUpgradeLevel,
  GrindingEffectData,
} from "@/types/EngraveType";
import {
  AuctionItemSearchResult,
  Sort,
  SortCondition,
} from "@/types/LostarkApiType";
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
  accessorySearchResult: AuctionItemSearchResult[];
  progress: number;
  totalCases: number;
  currentCase: number;
  myTimer: number;
  accessorySearchOptionArray: AccessorySearchOption[];
};

// 상태 조작과 검색 기능에 관련된 함수를 담는 ActionContext
type AccessorySearchActionContextType = {
  setPageStatus: Dispatch<SetStateAction<number>>;
  setAccessorySearchResult: Dispatch<SetStateAction<AuctionItemSearchResult[]>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setTotalCases: Dispatch<SetStateAction<number>>;
  setCurrentCase: Dispatch<SetStateAction<number>>;
  setMyTimer: Dispatch<SetStateAction<number>>;
  setAccessorySearchOptionArray: (
    value:
      | AccessorySearchOption[]
      | ((prev: AccessorySearchOption[]) => AccessorySearchOption[])
  ) => void;
  searchAccessories: () => void;
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
  const [accessorySearchResult, setAccessorySearchResult] = useState<
    AuctionItemSearchResult[]
  >([]);
  const [progress, setProgress] = useState<number>(0);
  const [totalCases, setTotalCases] = useState<number>(1);
  const [currentCase, setCurrentCase] = useState<number>(0);
  const [myTimer, setMyTimer] = useState<number>(0);

  const INITIAL_ACCESSORY_SEARCH_OPTION_ARRAY = [
    {
      accessoryCategory: "목걸이" as AccessoryCategory,
      accessoryGrade: "고대" as AccessoryGrade,
      accessoryTier: 4 as AccessoryTier,
      accessoryUpgradeLevel: 3 as AccessoryUpgradeLevel,
      accessoryTradeCount: 0 as AccessoryTradeCount,
      accessoryGrindingEffectArray: [],
    },
    {
      accessoryCategory: "귀걸이" as AccessoryCategory,
      accessoryGrade: "고대" as AccessoryGrade,
      accessoryTier: 4 as AccessoryTier,
      accessoryUpgradeLevel: 3 as AccessoryUpgradeLevel,
      accessoryTradeCount: 0 as AccessoryTradeCount,
      accessoryGrindingEffectArray: [],
    },
    {
      accessoryCategory: "반지" as AccessoryCategory,
      accessoryGrade: "고대" as AccessoryGrade,
      accessoryTier: 4 as AccessoryTier,
      accessoryUpgradeLevel: 3 as AccessoryUpgradeLevel,
      accessoryTradeCount: 0 as AccessoryTradeCount,
      accessoryGrindingEffectArray: [],
    },
  ];

  const [
    accessorySearchOptionArray,
    setAccessorySearchOptionArray,
    accessorySearchOptionArrayRef,
  ] = useStateWithRef<AccessorySearchOption[]>(
    INITIAL_ACCESSORY_SEARCH_OPTION_ARRAY
  );

  useEffect(() => {
    const recentSearchOptionHistory = localStorage.getItem(
      "recentSearchOptionHistory"
    );
    if (recentSearchOptionHistory) {
      const parsedRecentSearchOptionHistory = JSON.parse(
        recentSearchOptionHistory
      );
      setAccessorySearchOptionArray(parsedRecentSearchOptionHistory);
    } else {
      console.log("recentSearchOptionHistory not found");
    }
  }, []);

  const loadSearchOptionPreset = (presetName: string) => {
    const searchOptionHistory = localStorage.getItem(
      `${presetName}_searchOptionHistory`
    );
    if (searchOptionHistory) {
      const parsedSearchOptionHistory = JSON.parse(searchOptionHistory);
      setAccessorySearchOptionArray(parsedSearchOptionHistory);
    }
  };

  // 선택된 조건 배열을 경매장 악세서리 검색 메서드(postMultipleAuctionItems)의 파라미터로 가공한 후 검색 메서드를 호출합니다.
  const searchAccessories = useCallback(async () => {
    try {
      const requests = accessorySearchOptionArrayRef.current.map((option) => {
        return {
          EtcOptions: option.accessoryGrindingEffectArray.map((effect) => {
            return {
              FirstOption: 7,
              SecondOption: effect.effectName.value,
              MinValue:
                effect.effectValue.valueArray[effect.effectValue.level].Value,
              MaxValue:
                effect.effectValue.valueArray[effect.effectValue.level].Value,
            };
          }),
          Sort: "BUY_PRICE" as Sort,
          ItemTier: option.accessoryTier,
          ItemGrade: option.accessoryGrade,
          ItemUpgradeLevel: option.accessoryUpgradeLevel,
          CategoryCode: ACCESSORY_CATEGORY_CODES[option.accessoryCategory],
          PageNo: 0,
          SortCondition: "ASC" as SortCondition,
        };
      });
      const res = await postMultipleAuctionItems(requests);
      setAccessorySearchResult(res);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // generate useeffect depend on accessorySearchOptionArray
  // useEffect(() => {
  //   console.log(accessorySearchOptionArray);
  // }, [accessorySearchOptionArray]);

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
      accessorySearchResult,
      progress,
      totalCases,
      currentCase,
      myTimer,
      accessorySearchOptionArray,
    }),
    [
      pageStatus,
      accessorySearchResult,
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
      setAccessorySearchResult,
      setProgress,
      setTotalCases,
      setCurrentCase,
      setMyTimer,
      setAccessorySearchOptionArray,
      loadSearchOptionPreset,
      searchAccessories,
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
