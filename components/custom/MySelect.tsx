import styles from "@/styles/Custom.module.scss";
import {
  EventHandler,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Triangle from "../icons/Triangle";
import { createPortal } from "react-dom";

type Option<T> = { label: string; value: T };

type MySelectProps<T> = {
  className?: string;
  width?: number;
  height?: number;
  itemClassName?: string;
  options: Option<T>[];
  onSelect: (arg1: { label: string; value: T }, arg2?: number) => void;
  placeholder?: string;
  defaultSelectedIndex?: number;
  place?: string;
  offset?: number;
};

/**
 * MySelect
 * 커스텀 드롭다운 셀렉트 컴포넌트입니다.
 *
 *
 * @component
 * @example
 * ```tsx
 * <MySelect
 *   placeholder="옵션 선택"
 *   option={[{label: 'Apple', value: 1}, {label: 'Banana', value: 2}, {label: 'Cherry', value: 3}]}
 *   onSelect={(option, index) => console.log(option, index)}
 * />
 * ```
 *
 * @prop {string} [className] 외부에서 전달할 추가 클래스
 * @prop {number} [width=100] 셀렉트 박스 너비
 * @prop {number} [height=24] 셀렉트 박스 높이
 * @prop {string} [itemClassName] 옵션 항목의 클래스
 * @prop {{@link Option}[]} options label 와 value 로 구성된 옵션 객체 배열
 * @prop {(option: {@link Option}, index: number) => void} onSelect 옵션 선택 시 선택된 옵션 객체와 index 를 인자로 받아 실행될 함수
 * @prop {string} placeholder 셀렉트의 옵션을 선택하기 전 표기될 초기 텍스트
 * @prop {number | undefined} defaultSelectedIndex 셀렉트의 초기값으로 설정될 옵션의 인덱스값
 * @prop {"top" | "bottom"} [place="bottom"] 드롭다운 위치
 * @prop {number} [offset=0] 위치 조정을 위한 오프셋
 */
const MySelect = <T,>({
  className,
  width = 100,
  height = 24,
  itemClassName,
  options,
  onSelect,
  placeholder = "",
  defaultSelectedIndex,
  place = "bottom",
  offset = 0,
}: MySelectProps<T>) => {
  const selectRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const style = {
    color: "#FFFFFF",
    backgroundColor: "#020e1e",
    borderColor: "#092344",
    hoverBackgroundcolor: "#061831",
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<number>(-1);
  const [selectedLabel, setSelectedLabel] = useState<string>("");

  // 초기 선택된 옵션이 있는 경우 셀렉트에 표시될 label 도 업데이트
  useEffect(() => {
    if (typeof defaultSelectedIndex === "number") {
      setSelectedLabel(options[defaultSelectedIndex].label);
    }
  }, [options]);

  const handleSelect = useCallback(
    (options: Option<T>[], index: number) => {
      setSelectedLabel(options[index].label);
      onSelect(options[index], index);
      setIsOpen(false);
    },
    [onSelect, options]
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (
        !isOpen &&
        (e.key === "ArrowDown" ||
          e.key === "Enter" ||
          e.key === " ") /* Space */
      ) {
        setIsOpen(true);
        setHovered(0); // 첫 항목 선택
      } else if (isOpen) {
        if (e.key === "ArrowDown") {
          setHovered((prev) => Math.min(prev + 1, options.length - 1));
        } else if (e.key === "ArrowUp") {
          setHovered((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
          if (hovered >= 0 && hovered < options.length) {
            handleSelect(options, hovered);
          }
        } else if (e.key === "Escape") {
          setIsOpen(false);
        }
      }
      e.preventDefault();
    },
    [isOpen, hovered, options, handleSelect]
  );

  /**
   * 드롭다운의 위치 설정 관련된 코드입니다
   * dropdownStyle : 출력될 위치를 기억할 상태
   * useEffect : 스크롤과 리사이즈 이벤트 핸들러를 통해 dropdownStyle 상태를 현재 위치에 맞게 수정합니다.
   *             getBoundingClientRect 메서드를 사용해 selectRef 의 현재 위치 정보를 찾아냅니다.
   */
  const [dropdownStyle, setDropdownStyle] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useEffect(() => {
    if (selectRef === null || selectRef.current === null || !isOpen) return;

    const updatePosition = () => {
      const rect = selectRef.current!.getBoundingClientRect();
      if (rect) {
        const dropdownHeight = 320; // 예상 드롭다운 높이
        const shouldOpenUp = window.innerHeight - rect.bottom < dropdownHeight;
        const top = shouldOpenUp ? rect.top - dropdownHeight : rect.bottom;
        const left = rect.left + window.scrollX;
        setDropdownStyle({
          top,
          left,
        });
      }
    };

    updatePosition(); // 초기 위치
    window.addEventListener("scroll", updatePosition, true); // true는 캡처링 단계에서 감지
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, selectRef]);

  /**
   * React Portal 을 사용해 dropdown 을 body 의 자식 요소로 렌더링합니다.
   */
  const renderDropdown = () => {
    return createPortal(
      <ul
        ref={dropdownRef}
        className={`hideScroll max-h-[320px] border-[2px] rounded`}
        style={{
          top: dropdownStyle.top,
          left: dropdownStyle.left,
          position: "absolute",
          width: selectRef.current?.clientWidth,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
        }}
        role="listbox"
        onMouseLeave={() => {
          setHovered(-1);
        }}
      >
        {options?.map((option, i: number) => {
          return (
            <li
              className={`${styles.optionItem} ${
                itemClassName ? itemClassName : ""
              } p-2 truncate cursor-pointer`}
              key={`mySelect_option_${option.label}`}
              title={option.label}
              onMouseDown={() => {
                handleSelect(options, i);
              }}
              onMouseEnter={() => {
                setHovered(i);
              }}
              style={{
                borderColor: style.borderColor,
                backgroundColor:
                  hovered === i
                    ? style.hoverBackgroundcolor
                    : style.backgroundColor,
              }}
            >
              {option.label}
            </li>
          );
        })}
      </ul>,
      document.body
    );
  };

  return (
    <button
      ref={selectRef}
      tabIndex={0}
      className={`${styles.mySelect} ${className}`}
      title={selectedLabel}
      style={{
        width: width + 24,
        height,
        color: style.color,
      }}
      onBlur={() => {
        setIsOpen(false);
      }}
      onClick={() => {
        setIsOpen((e) => !e);
      }}
      onKeyDown={handleKeydown}
      data-show={isOpen}
    >
      <span className="truncate">
        {selectedLabel ? selectedLabel : placeholder}
      </span>
      <Triangle
        className={styles.indicator}
        color={style.color}
        fill={style.color}
        size={12}
      />
      {isOpen && renderDropdown()}
    </button>
  );
};

export default MySelect;
