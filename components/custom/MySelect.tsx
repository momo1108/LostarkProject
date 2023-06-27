import { CustomSelectProps } from "@/types/CustomType";
import styles from "@/styles/Custom.module.scss";
import { useState, useMemo } from "react";
import Triangle from "../icons/Triangle";

const MySelect: React.FC<CustomSelectProps> = ({
  className,
  width = 100,
  height = 24,
  color = "#C33838",
  backgroundColor = "#020e1e",
  borderColor = "#092344",
  hoverBackgroundcolor = "#061831",
  itemClassName,
  title,
  data,
  mapFunction,
  onClickFunction,
  place = "bottom",
  offset = 0,
}) => {
  const [optionVisibility, setOptionVisibility] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(-1);
  const [outline, setOutline] = useState<string>("transparent");

  return (
    <button
      tabIndex={0}
      className={`${styles.mySelect} ${className}`}
      style={{ width: width + 24, height, color, borderColor: outline }}
      onBlur={() => {
        setOptionVisibility((e) => {
          setOutline("transparent");
          return false;
        });
      }}
      onClick={() => {
        setOptionVisibility((e) => {
          e ? setOutline("transparent") : setOutline(color);
          return !e;
        });
      }}
      data-show={optionVisibility}
    >
      {title}
      <Triangle
        className={styles.indicator}
        color={color}
        fill={color}
        size={12}
      />
      <ul
        className={`${styles.optionList} ${styles[place]}${
          optionVisibility ? " block" : " hidden"
        }`}
        style={{
          [place]: -offset,
          width: width + 16,
          borderColor,
          backgroundColor,
        }}
        onMouseLeave={() => {
          setSelected(-1);
        }}
      >
        {data?.map((e: any, i: number) => {
          const res = mapFunction(e, i);
          return (
            <li
              className={`${styles.optionItem} ${
                itemClassName ? itemClassName : ""
              }`}
              key={`mySelect_${title}_option_${i}`}
              onMouseDown={() => {
                onClickFunction(e, i);
                setOptionVisibility(false);
              }}
              onMouseEnter={() => {
                setSelected(i);
              }}
              style={{
                borderColor,
                backgroundColor:
                  selected === i ? hoverBackgroundcolor : backgroundColor,
              }}
            >
              {res}
            </li>
          );
        })}
      </ul>
    </button>
  );
};
export default MySelect;
