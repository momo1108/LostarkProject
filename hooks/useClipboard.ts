import AlertContext from "@/contexts/AlertContext";
import { useCallback, useEffect, useState } from "react";
import useAlert from "./useAlert";

export default function useClipboard() {
  const alert = useAlert();
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    setLoaded(true);
    console.dir(window);
    console.dir(window.navigator);
  }, []);
  const copyToClipboard = useCallback(
    (
      text: string,
      successMsg: string = "복사가 완료됐습니다.",
      errorMsg: string = "복사를 실패했습니다."
    ) => {
      if (loaded) {
        try {
          window?.navigator?.clipboard
            .writeText(text)
            .then(() => {
              alert.success(successMsg);
            })
            .catch((err) => {
              alert.info(errorMsg);
              console.log(err);
            });
        } catch (error: any) {
          console.log(error);
        }
      } else {
        console.log("hook is not loaded");
      }
    },
    [loaded, alert]
  );

  return { copyToClipboard };
}
