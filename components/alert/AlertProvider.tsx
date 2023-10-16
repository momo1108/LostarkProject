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
              display: "flex",
              flexDirection: "column",
              gap: 14,
              top: "5%",
              right: 100,
              zIndex: 100,
              width: 0,
              height: 0,
            }}
          >
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
            <p style={{ width: 100, background: "#fff5" }}>test</p>
          </div>,
          document.body
        )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
