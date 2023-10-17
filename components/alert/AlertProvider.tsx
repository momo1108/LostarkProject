import AlertContext from "@/contexts/AlertContext";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertOctagon, Check, Info, MenuIcons } from "../icons/Index";

type AlertDataType = { id: number; type: number; message: string };
type AlertStatetype = { id: number; data: AlertDataType[] };

const AlertProvider: React.FC<{
  children: React.ReactNode;
  alertWrapperClassName: string;
  alertClassName: string; // 알러트창의 css설정을 위한 className
}> = ({ children, alertWrapperClassName, alertClassName }) => {
  const [ready, setReady] = useState<boolean>(false);
  const [alertId, setAlertId] = useState<number>(0); // 알러트창 자동종료를 위해 알러트창별로 id설정
  const [alerts, setAlerts] = useState<{
    id: number;
    data: AlertDataType[];
  }>({ id: 0, data: [] });

  useEffect(() => {
    setReady(true);
  }, []);

  const remove = useCallback(
    (id: number) => {
      setAlerts((alertStateForDelete: AlertStatetype) => ({
        ...alertStateForDelete,
        data: alertStateForDelete.data.filter((a) => a.id !== id),
      }));
    },
    [setAlerts]
  );

  const setAlertState = useCallback(
    (message: string, type: number) => {
      setAlerts((alertState: AlertStatetype) => {
        // 알러트 창 추가시 새로운 알러트창 추가 전에 미리 삭제 예약을 한다.(id값을 미리 예약해놓고 +1로 갱신해야 순서가 맞기때문.)
        setTimeout(() => {
          remove(alertState.id);
        }, 5000);

        new Audio(
          `/sounds/${
            type === 0 ? "info" : type === 1 ? "error" : "success"
          }Beep.mp3`
        ).play();
        // 새로운 알러트를 추가하고 id를 갱신한 state를 return
        return {
          id: alertState.id + 1,
          data: [...alertState.data, { id: alertState.id, type, message }],
        };
      });
    },
    [alerts, alertId, remove, setAlerts]
  );

  const info = useCallback(
    (message: string) => {
      setAlertState(message, 0);
    },
    [setAlertState]
  );

  const error = useCallback(
    (message: string) => {
      setAlertState(message, 1);
    },
    [setAlertState]
  );

  const success = useCallback(
    (message: string) => {
      setAlertState(message, 2);
    },
    [setAlertState]
  );

  // confirm을 위한 div도 createPortal에서 같이 추가해줘야하나?
  return (
    <AlertContext.Provider value={{ info, error, success }}>
      {children}
      {ready &&
        createPortal(
          <div
            className={alertWrapperClassName}
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              width: 0,
              height: 0,
            }}
          >
            {alerts.data.map((a) => {
              const color =
                a.type === 0 ? "#2E9AFE" : a.type === 1 ? "#f00" : "#0f0";
              return (
                <div
                  className={alertClassName}
                  style={{
                    borderRadius: 5,
                  }}
                  key={`alert_id_${a.id}`}
                >
                  {a.type === 0 ? (
                    <AlertOctagon color={color} />
                  ) : a.type === 1 ? (
                    <AlertOctagon color={color} />
                  ) : (
                    <Check color={color} />
                  )}
                  <p>{a.message}</p>
                  <button
                    onClick={() => {
                      remove(a.id);
                    }}
                  >
                    <MenuIcons type={3} width={3} color="#999" />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
