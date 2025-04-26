import styles from "@/styles/Custom.module.scss";
import {
  EventHandler,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Triangle from "../icons/Triangle";

type MySelectProps<T> = {
  className?: string;
  width?: number;
  height?: number;
  itemClassName?: string;
  options: { label: string; value: T }[];
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
 * @prop {{ label: string; value: T }[]} options label 와 value 로 구성된 옵션 객체 배열
 * @prop {(option: { label: string; value: T }, index: number) => void} onSelect 옵션 선택 시 선택된 옵션 객체와 index 를 인자로 받아 실행될 함수
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
  const style = {
    color: "#C33838",
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
      console.log(defaultSelectedIndex, options[defaultSelectedIndex].label);
      setSelectedLabel(options[defaultSelectedIndex].label);
    }
  }, []);

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
            setSelectedLabel(options[hovered].label);
            onSelect(options[hovered], hovered);
            setIsOpen(false);
          }
        } else if (e.key === "Escape") {
          setIsOpen(false);
        }
      }
      e.preventDefault();
    },
    [hovered]
  );

  return (
    <button
      tabIndex={0}
      className={`${styles.mySelect} ${className}`}
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
      {selectedLabel ? selectedLabel : placeholder}
      <Triangle
        className={styles.indicator}
        color={style.color}
        fill={style.color}
        size={12}
      />
      <ul
        className={`${styles.optionList} ${styles[place]}${
          isOpen ? " block" : " hidden"
        }`}
        role="listbox"
        style={{
          [place]: -offset,
          width: width + 16,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
        }}
        onMouseLeave={() => {
          setHovered(-1);
        }}
      >
        {options?.map((option, i: number) => {
          return (
            <li
              className={`${styles.optionItem} ${
                itemClassName ? itemClassName : ""
              }`}
              key={`mySelect_option_${option.label}`}
              onMouseDown={() => {
                setSelectedLabel(options[hovered].label);
                onSelect(option, i);
                setIsOpen(false);
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
      </ul>
    </button>
  );
};

export default MySelect;
