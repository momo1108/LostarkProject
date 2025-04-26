import { useStateWithRef } from "@/hooks/useStateWithRef";
import {
  ACCESSORY_GRINDINGEFFECT_MAP,
  AccessorySearchOption,
  GRINDING_EFFECT_VALUE_MAP,
  GrindingEffectData,
} from "@/types/EngraveType";
import { AuctionItem } from "@/types/LostarkApiType";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import GRINDING_EFFECT_DATA from "@/data/grindingEffectOptions.json";

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

  /**
   * 악세서리 검색을 수행할 post 메서드에 필요한 최소한의 파라미터들 입니다.
   *  {
        "EtcOptions": [
          {
            "FirstOption": 7,
            "SecondOption": 53,
            "MinValue": null,
            "MaxValue": null
          }
        ],
        "Sort": "BIDSTART_PRICE",
        "ItemTier": 4,
        "ItemGrade": "고대",
        "CategoryCode": 200020,
        "PageNo": 0,
        "SortCondition": "ASC"
      }
   */
  const grindingEffectOptionValue =
    GRINDING_EFFECT_VALUE_MAP[ACCESSORY_GRINDINGEFFECT_MAP["목걸이"][0]];
  const grindingEffectMinValue =
    GRINDING_EFFECT_DATA[ACCESSORY_GRINDINGEFFECT_MAP["목걸이"][0]][4][
      "고대"
    ][0]["Value"];
  const [
    accessorySearchOptionArray,
    setAccessorySearchOptionArray,
    accessorySearchOptionArrayRef,
  ] = useStateWithRef<AccessorySearchOption[]>([
    {
      accessoryCategory: "목걸이",
      accessoryGrade: "고대",
      accessoryTier: 4,
      grindingEffectOptionValue,
      grindingEffectMinValue,
    },
  ]);

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
