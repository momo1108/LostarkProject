import React from "react";

function overflowSetter(position: string, overflow: string): void {
  document.documentElement.style.position = position;
  document.documentElement.style.overflow = overflow;
  document.body.style.position = position;
  document.body.style.overflow = overflow;
}

function usePreventBodyScroll() {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    hidden ? overflowSetter("relative", "hidden") : overflowSetter("", "");

    return () => overflowSetter("", "");
  }, [hidden]);

  const disableScroll = React.useCallback(() => setHidden(true), []);
  const enableScroll = React.useCallback(() => setHidden(false), []);
  return { disableScroll, enableScroll };
}

export default usePreventBodyScroll;
