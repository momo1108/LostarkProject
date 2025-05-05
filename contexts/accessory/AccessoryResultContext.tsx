import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

type AccessoryResultSelectorContextType = {
  resultPage: number;
  pageSize: number;
};
const AccessoryResultSelectorContext = createContext<
  AccessoryResultSelectorContextType | undefined
>(undefined);
export const useAccessoryResultSelectorContext = () => {
  const context = useContext(AccessoryResultSelectorContext);
  if (!context)
    throw new Error(
      "useAccessorySearchSelectorContext must be used within a AccessoryResultSelectorContext"
    );
  return context;
};

type AccessoryResultActionContextType = {
  setResultPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
};
const AccessoryResultActionContext = createContext<
  AccessoryResultActionContextType | undefined
>(undefined);
export const useAccessoryResultActionContext = () => {
  const context = useContext(AccessoryResultActionContext);
  if (!context)
    throw new Error(
      "useAccessoryResultActionContext must be used within a AccessoryResultActionContext"
    );
  return context;
};

export const AccessoryResultContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [resultPage, setResultPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  const selectorContextValue = useMemo(
    () => ({
      resultPage,
      pageSize,
    }),
    [resultPage, pageSize]
  );

  const actionContextValue = useMemo(
    () => ({
      setResultPage,
      setPageSize,
    }),
    []
  );

  return (
    <AccessoryResultSelectorContext.Provider value={selectorContextValue}>
      <AccessoryResultActionContext.Provider value={actionContextValue}>
        {children}
      </AccessoryResultActionContext.Provider>
    </AccessoryResultSelectorContext.Provider>
  );
};
