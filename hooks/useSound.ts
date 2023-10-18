import { useCallback, useContext, useEffect, useMemo, useState } from "react";

export default function useSound() {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const beepSound = useMemo(() => {
    // console.log(ready);
    return ready
      ? {
          infoBeep: new Audio("/sounds/infoBeep.mp3"),
          errorBeep: new Audio("/sounds/errorBeep.mp3"),
          successBeep: new Audio("/sounds/successBeep.mp3"),
        }
      : { infoBeep: null, errorBeep: null, successBeep: null };
  }, [ready]);

  // 트포 페이지에선 성공 알러트 사운드가 제대로 나옴.
  // 트포 페이지를 거치지 않고 바로 각인 페이지 접속 시 성공 사운드(인지 아니면 modal문제인지)가 null로 나옴

  return beepSound;
}
