import { useCallback } from "react";

function useCssHook() {
  const bgClassMaker = useCallback((quality: number): string => {
    const bgClass: string =
      quality < 30
        ? "lowQ"
        : quality < 70
        ? "mediumLowQ"
        : quality < 90
        ? "mediumQ"
        : quality < 100
        ? "highQ"
        : "maxQ";

    return bgClass;
  }, []);

  return { bgClassMaker };
}

export default useCssHook;
