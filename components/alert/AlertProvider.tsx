import AlertContext from "@/contexts/AlertContext";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ready, setReady] = useState<boolean>(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setReady(true);
  }, []);

  const remove = useCallback(() => {}, []);

  const removeAll = useCallback(() => {}, [remove]);

  const info = useCallback((message: string) => {}, [remove]);

  const error = useCallback((message: string) => {}, [remove]);

  const success = useCallback((message: string) => {}, [remove]);

  return (
    <AlertContext.Provider value={{ info, error, success }}>
      {children}
      {ready &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            {/* <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p> */}
          </div>,
          document.body
        )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
