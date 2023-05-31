import styles from "@/styles/MenuHeader.module.scss";
import { MenuProps } from "@/types/MenuType";
import Link from "next/link";
import { useContext } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import useDrag from "@/hooks/useDrag.ts";
import usePreventBodyScroll from "@/hooks/usePreventBodyScroll.ts";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { useRouter } from "next/router";
import { nanumNeo, roboto } from "@/types/GlobalType";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const MenuHeader: React.FC<MenuProps> = ({ menu }) => {
  const router = useRouter();

  const { dragStart, dragStop, dragMove, dragging } = useDrag();
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const handleDrag =
    ({ scrollContainer }: scrollVisibilityApiType) =>
    (ev: React.MouseEvent) =>
      dragMove(ev, (posDiff) => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff;
        }
      });

  return (
    <div
      className={`${styles.headerContainer} ${nanumNeo.className}`}
      onMouseEnter={disableScroll}
      onMouseLeave={enableScroll}
    >
      <div className={styles.homeDiv}>
        <Link href={"/"} className={`${styles.homeLink} ${roboto.className}`}>
          LOAPLE
        </Link>
      </div>
      <div className={styles.menuDiv}>
        <ScrollMenu
          onMouseDown={() => dragStart}
          onMouseUp={() => dragStop}
          onMouseMove={handleDrag}
          onWheel={onWheel}
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
        >
          {menu.map((m) => {
            // dragging 속성을 이용해 드래그중일땐 onclick을 비활성화하자.
            return (
              <p
                key={m.id}
                onClick={dragging ? undefined : () => router.push(m.url)}
                className={`${styles.menuLink} ${
                  router.route.split("/")[1] === m.url.split("/")[1]
                    ? styles.activeMenuLink
                    : ""
                }`}
              >
                {m.title}
              </p>
            );
          })}
        </ScrollMenu>
      </div>
    </div>
  );
};

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
  return isFirstItemVisible ? (
    <span></span>
  ) : (
    <svg className="svgIcon menuArrow" viewBox="0 0 20 20">
      <path
        fill="none"
        d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"
      ></path>
    </svg>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
  return isLastItemVisible ? (
    <span></span>
  ) : (
    <svg className="svgIcon menuArrow" viewBox="0 0 20 20">
      <path
        fill="none"
        d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"
      ></path>
    </svg>
  );
}

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
  ev.stopPropagation();

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollPrev();
  } else if (ev.deltaY > 0) {
    apiObj.scrollNext();
  }
}

export default MenuHeader;
