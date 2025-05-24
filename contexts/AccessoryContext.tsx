import { useStateWithRef } from "@/hooks/useStateWithRef";
import {
  ACCESSORY_CATEGORY_CODES,
  AccessoryCategory,
  AccessoryGrade,
  AccessorySearchOption,
  AccessoryTier,
  AccessoryUpgradeLevel,
  RefiningEffectData,
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
import REFINING_EFFECT_DATA from "@/data/refiningEffectOptions.json";
import { postMultipleAuctionItems } from "@/service/LostarkService";
import { AxiosError } from "axios";
import useAlert from "@/hooks/useAlert";
import { useApiKeyActionContext } from "./ApiKeyContext";
import { throttle } from "@/utils/functionUtils";

/** ---------------------- 타입 정의 ---------------------- **/

// 고정 데이터만 담는 StaticContext
type AccessorySearchStaticContextType = {
  REFINING_EFFECT_DATA: RefiningEffectData;
  accessorySearchOptionArrayRef: MutableRefObject<AccessorySearchOption[]>;
};

// 검색 관련 상태 데이터만 담는 SelectorContext
type AccessorySearchSelectorContextType = {
  isSearching: boolean;
  totalCases: number;
  currentCase: number;
  myTimer: number;
  accessorySearchOptionArray: AccessorySearchOption[];
};

// 검색 조건 상태 세터와 검색 기능을 담는 ActionContext
type AccessorySearchActionContextType = {
  setIsSearching: Dispatch<SetStateAction<boolean>>;
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

// 검색 결과 상태 데이터만 담는 SelectorContext
type AccessoryResultSelectorContextType = {
  accessorySearchResult: AuctionItemSearchResult[];
};

// 검색 결과 세터 함수를 담는 ActionContext
type AccessoryResultActionContextType = {
  setAccessorySearchResult: Dispatch<SetStateAction<AuctionItemSearchResult[]>>;
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
const AccessoryResultSelectorContext = createContext<
  AccessoryResultSelectorContextType | undefined
>(undefined);
const AccessoryResultActionContext = createContext<
  AccessoryResultActionContextType | undefined
>(undefined);

/** ---------------------- Provider ---------------------- **/

export const AccessoryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // 1. 검색 기능 관련 컨텍스트

  /**
   * 검색 조건 초기값
   * 로컬 스토리지에 저장된 최근 검색 조건이 없으면 기본값으로 초기화
   */
  const INITIAL_ACCESSORY_SEARCH_OPTION_ARRAY = [
    {
      accessoryCategory: "목걸이" as AccessoryCategory,
      accessoryGrade: "고대" as AccessoryGrade,
      accessoryTier: 4 as AccessoryTier,
      accessoryUpgradeLevel: 3 as AccessoryUpgradeLevel,
      accessoryQuality: 70,
      accessoryRefiningEffectArray: [],
    },
    {
      accessoryCategory: "귀걸이" as AccessoryCategory,
      accessoryGrade: "고대" as AccessoryGrade,
      accessoryTier: 4 as AccessoryTier,
      accessoryUpgradeLevel: 3 as AccessoryUpgradeLevel,
      accessoryQuality: 70,
      accessoryRefiningEffectArray: [],
    },
    {
      accessoryCategory: "반지" as AccessoryCategory,
      accessoryGrade: "고대" as AccessoryGrade,
      accessoryTier: 4 as AccessoryTier,
      accessoryUpgradeLevel: 3 as AccessoryUpgradeLevel,
      accessoryQuality: 70,
      accessoryRefiningEffectArray: [],
    },
  ];

  /**
   * 현재 설정된 검색 조건 상태.
   * 렌더링 최적화를 위해 useStateWithRef를 사용하여 ref를 함께 반환합니다.
   * 초기값은 아래와 같은 우선순위로 설정됩니다.
   * 1. 로컬 스토리지에 저장된 최근 검색 조건
   * 2. INITIAL_ACCESSORY_SEARCH_OPTION_ARRAY
   */
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

  /**
   * 검색 조건 프리셋을 불러오기 위한 메서드입니다.
   * Todo) 검색 조건 프리셋 CRUD 모달 구현
   * @param presetName 프리셋 이름 로컬 스토리지에 저장될 이름의 프리픽스로 활용됩니다.
   */
  const loadSearchOptionPreset = (presetName: string) => {
    const searchOptionHistory = localStorage.getItem(
      `${presetName}_searchOptionHistory`
    );
    if (searchOptionHistory) {
      const parsedSearchOptionHistory = JSON.parse(searchOptionHistory);
      setAccessorySearchOptionArray(parsedSearchOptionHistory);
    }
  };

  // 검색 메서드를 위해 필요한 훅들을 호출합니다.
  const alert = useAlert(); // 알림 훅
  const { setIsShining } = useApiKeyActionContext(); // API 입력란 강조 표시용 세터
  // 검색 여부를 관리하는 상태
  const [isSearching, setIsSearching, isSearchingRef] =
    useStateWithRef<boolean>(false);
  // 선택된 조건 배열을 경매장 악세서리 검색 메서드(postMultipleAuctionItems)의 파라미터로 가공한 후 검색 메서드를 호출합니다.
  const searchAccessories = useMemo(() => {
    // throttle을 사용하여 2초 이내의 중복 검색을 방지합니다. isSearching 이 변하는 경우 throttle이 초기화됩니다.
    if (isSearchingRef.current) return async () => {};
    return throttle(async () => {
      try {
        setIsSearching(true);
        const requests = accessorySearchOptionArrayRef.current.map((option) => {
          return {
            EtcOptions: option.accessoryRefiningEffectArray.map((effect) => {
              return {
                FirstOption: 7,
                SecondOption: effect.effectName.value,
                MinValue:
                  effect.effectValue.valueArray[effect.effectValue.level].Value,
                MaxValue: effect.effectValue.valueArray[2].Value,
              };
            }),
            Sort: "BUY_PRICE" as Sort,
            ItemTier: option.accessoryTier,
            ItemGrade: option.accessoryGrade,
            ItemUpgradeLevel: option.accessoryUpgradeLevel,
            ItemGradeQuality: option.accessoryQuality,
            CategoryCode: ACCESSORY_CATEGORY_CODES[option.accessoryCategory],
            PageNo: 0,
            SortCondition: "ASC" as SortCondition,
          };
        });
        const res = await postMultipleAuctionItems(requests);
        // console.log(res);
        setAccessorySearchResult(res);
        alert.success("검색이 완료되었습니다.");
        setIsSearching(false);
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) setIsShining(true);
          alert.error(error.message);
        }
        setIsSearching(false);
      }
      localStorage.setItem(
        "recentSearchOptionHistory",
        JSON.stringify(accessorySearchOptionArrayRef.current)
      );
    }, 1000);
  }, [isSearching]);

  // 2. 검색 결과 관련 컨텍스트
  const [accessorySearchResult, setAccessorySearchResult] = useState<
    AuctionItemSearchResult[]
  >([]);
  const [totalCases, setTotalCases] = useState<number>(1);
  const [currentCase, setCurrentCase] = useState<number>(0);
  const [myTimer, setMyTimer] = useState<number>(0);

  const searchStaticContextValue = useMemo(
    () => ({
      REFINING_EFFECT_DATA,
      accessorySearchOptionArrayRef,
    }),
    []
  );

  const searchSelectorContextValue = useMemo(
    () => ({
      isSearching,
      totalCases,
      currentCase,
      myTimer,
      accessorySearchOptionArray,
    }),
    [isSearching, totalCases, currentCase, myTimer, accessorySearchOptionArray]
  );

  const searchActionContextValue = useMemo(
    () => ({
      setIsSearching,
      setTotalCases,
      setCurrentCase,
      setMyTimer,
      setAccessorySearchOptionArray,
      loadSearchOptionPreset,
      searchAccessories,
    }),
    []
  );
  const resultSelectorContextValue = useMemo(
    () => ({
      accessorySearchResult,
    }),
    [accessorySearchResult]
  );

  const resultActionContextValue = useMemo(
    () => ({
      setAccessorySearchResult,
    }),
    []
  );

  return (
    <AccessorySearchStaticContext.Provider value={searchStaticContextValue}>
      <AccessorySearchSelectorContext.Provider
        value={searchSelectorContextValue}
      >
        <AccessoryResultSelectorContext.Provider
          value={resultSelectorContextValue}
        >
          <AccessoryResultActionContext.Provider
            value={resultActionContextValue}
          >
            <AccessorySearchActionContext.Provider
              value={searchActionContextValue}
            >
              {children}
            </AccessorySearchActionContext.Provider>
          </AccessoryResultActionContext.Provider>
        </AccessoryResultSelectorContext.Provider>
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

export const useAccessoryResultSelectorContext = () => {
  const context = useContext(AccessoryResultSelectorContext);
  if (!context)
    throw new Error(
      "useAccessoryResultSelectorContext must be used within a AccessoryResultSelectorContext"
    );
  return context;
};

export const useAccessoryResultActionContext = () => {
  const context = useContext(AccessoryResultActionContext);
  if (!context)
    throw new Error(
      "useAccessoryResultActionContext must be used within a AccessoryResultActionContext"
    );
  return context;
};
