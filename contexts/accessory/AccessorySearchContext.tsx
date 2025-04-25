import { AccessorySearchOption } from "@/types/EngraveType";
import { AuctionItem } from "@/types/LostarkApiType";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type AccessorySearchSelectorContextType = {
  pageStatus: number;
  combinationList: AuctionItem[][];
  progress: number;
  totalCases: number;
  currentCase: number;
  myTimer: number;
};
const AccessorySearchSelectorContext = createContext<
  AccessorySearchSelectorContextType | undefined
>(undefined);
export const useAccessorySearchSelectorContext = () => {
  const context = useContext(AccessorySearchSelectorContext);
  if (!context)
    throw new Error(
      "useAccessorySearchSelectorContext must be used within a AccessorySearchSelectorContext"
    );
  return context;
};

type AccessorySearchActionContextType = {
  setPageStatus: Dispatch<SetStateAction<number>>;
  setCombinationList: Dispatch<SetStateAction<AuctionItem[][]>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setTotalCases: Dispatch<SetStateAction<number>>;
  setCurrentCase: Dispatch<SetStateAction<number>>;
  setMyTimer: Dispatch<SetStateAction<number>>;
  getAccessorySearchOptionRef: () => MutableRefObject<AccessorySearchOption[]>;
};
const AccessorySearchActionContext = createContext<
  AccessorySearchActionContextType | undefined
>(undefined);
export const useAccessorySearchActionContext = () => {
  const context = useContext(AccessorySearchActionContext);
  if (!context)
    throw new Error(
      "useAccessorySearchActionContext must be used within a AccessorySearchActionContext"
    );
  return context;
};

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
  const accessorySearchOptionRef = useRef<AccessorySearchOption[]>([]);
  const getAccessorySearchOptionRef = useCallback(
    () => accessorySearchOptionRef,
    [accessorySearchOptionRef]
  );

  const selectorContextValue = useMemo(
    () => ({
      pageStatus,
      combinationList,
      progress,
      totalCases,
      currentCase,
      myTimer,
    }),
    [pageStatus, combinationList, progress, totalCases, currentCase, myTimer]
  );

  const actionContextValue = useMemo(
    () => ({
      setPageStatus,
      setCombinationList,
      setProgress,
      setTotalCases,
      setCurrentCase,
      setMyTimer,
      getAccessorySearchOptionRef,
    }),
    []
  );

  return (
    <AccessorySearchSelectorContext.Provider value={selectorContextValue}>
      <AccessorySearchActionContext.Provider value={actionContextValue}>
        {children}
      </AccessorySearchActionContext.Provider>
    </AccessorySearchSelectorContext.Provider>
  );
};
