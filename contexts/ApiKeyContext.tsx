import { useStateWithRef } from "@/hooks/useStateWithRef";
import { lostarkApi } from "@/service/axiosInstance";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/** ---------------------- 타입 정의 ---------------------- **/

// 고정 데이터만 담는 StaticContext
type ApiKeySelectorContextType = {
  apiKey: string;
  isShining: boolean;
};
type ApiKeyActionContextType = {
  setApiKey: Dispatch<SetStateAction<string>>;
  setIsShining: Dispatch<SetStateAction<boolean>>;
};
type ApiKeyStaticContextType = {
  apiKeyRef: MutableRefObject<string>;
};

/** ---------------------- Context 생성 ---------------------- **/

const ApiKeySelectorContext = createContext<
  ApiKeySelectorContextType | undefined
>(undefined);
const ApiKeyActionContext = createContext<ApiKeyActionContextType | undefined>(
  undefined
);
const ApiKeyStaticContext = createContext<ApiKeyStaticContextType | undefined>(
  undefined
);

/** ---------------------- Provider ---------------------- **/

export const ApiKeyContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [apiKey, setApiKey, apiKeyRef] = useStateWithRef<string>("");
  const [isShining, setIsShining] = useState<boolean>(false);

  useEffect(() => {
    const key = localStorage.getItem("loapleApiKey");
    if (key === null) localStorage.setItem("loapleApiKey", "");
    else setApiKey(key);
  }, []);

  useEffect(() => {
    lostarkApi.defaults.headers.common["Authorization"] = `Bearer ${apiKey}`;
  }, [apiKey]);

  const apiKeySelectorContextValue = useMemo(
    () => ({ apiKey, isShining }),
    [apiKey, isShining]
  );
  const apiKeyActionContextValue = useMemo(
    () => ({ setApiKey, setIsShining }),
    []
  );
  const apiKeyStaticContextValue = useMemo(() => ({ apiKeyRef }), []);

  return (
    <ApiKeySelectorContext.Provider value={apiKeySelectorContextValue}>
      <ApiKeyActionContext.Provider value={apiKeyActionContextValue}>
        <ApiKeyStaticContext.Provider value={apiKeyStaticContextValue}>
          {children}
        </ApiKeyStaticContext.Provider>
      </ApiKeyActionContext.Provider>
    </ApiKeySelectorContext.Provider>
  );
};

/** ---------------------- 커스텀 훅 ---------------------- **/

export const useApiKeySelectorContext = () => {
  const context = useContext(ApiKeySelectorContext);
  if (!context)
    throw new Error(
      "useApiKeySelectorContext must be used within a ApiKeySelectorContextProvider"
    );
  return context;
};

export const useApiKeyActionContext = () => {
  const context = useContext(ApiKeyActionContext);
  if (!context)
    throw new Error(
      "useApiKeyActionContext must be used within a ApiKeyActionContextProvider"
    );
  return context;
};

export const useApiKeyStaticContext = () => {
  const context = useContext(ApiKeyStaticContext);
  if (!context)
    throw new Error(
      "useApiKeyStaticContext must be used within a ApiKeyStaticContextProvider"
    );
  return context;
};
