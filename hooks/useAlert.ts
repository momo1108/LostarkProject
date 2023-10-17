import AlertContext from "@/contexts/AlertContext";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
/*
App 컴포넌트 단에
AlertProvider로 감싸줌.

AlertProvider에서는 Context.Provider를 return, 여러 alert관련 메서드 정의및 공유
또한 createPortal을 통해 html에 append

useAlert 훅에서는 해당 Context의 상태를 return해서 내부의 메서드를 사용할 수 있게한다.
 */

export default function useAlert() {
  const alertContext = useContext(AlertContext);
  const alert = useMemo(() => {
    return alertContext;
  }, [alertContext]);
  return alert;
}
