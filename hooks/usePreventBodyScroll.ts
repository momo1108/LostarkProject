import React from "react";

const preventDefault = (ev: Event) => {
  if (ev.preventDefault) {
    ev.preventDefault();
  }
  ev.returnValue = false;
};

const enableBodyScroll = () => {
  document.documentElement.style.position = ""; /* [1] */
  document.documentElement.style.overflow = ""; /* [2] */
  document.body.style.position = ""; /* [1] */
  document.body.style.overflow = ""; /* [2] */
  document && document.removeEventListener("wheel", preventDefault, false);
};
const disableBodyScroll = () => {
  document.documentElement.style.position = "relative"; /* [1] */
  document.documentElement.style.overflow = "hidden"; /* [2] */
  document.body.style.position = "relative"; /* [1] */
  document.body.style.overflow = "hidden"; /* [2] */
  document &&
    document.addEventListener("wheel", preventDefault, {
      passive: false,
    });
};

function usePreventBodyScroll() {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    hidden ? disableBodyScroll() : enableBodyScroll();

    return enableBodyScroll;
  }, [hidden]);

  const disableScroll = React.useCallback(() => setHidden(true), []);
  const enableScroll = React.useCallback(() => setHidden(false), []);
  return { disableScroll, enableScroll };
}

export default usePreventBodyScroll;
