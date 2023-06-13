import { CustomComponentProps } from "@/types/CustomType";
import styles from "@/styles/Custom.module.scss";
import { useState, useMemo } from "react";
import Triangle from "../icons/Triangle";

const MySelect: React.FC<CustomComponentProps> = ({
  className,
  itemClassName,
  title,
  data,
  mapFunction,
  onClickFunction,
  place = "bottom",
  offset = 0,
}) => {
  const [optionVisibility, setOptionVisibility] = useState<boolean>(false);

  return (
    <div
      tabIndex={0}
      className={`${styles.mySelect} ${className}`}
      onBlur={() => {
        setOptionVisibility(false);
      }}
      data-show={optionVisibility}
    >
      <button
        onClick={() => {
          setOptionVisibility(!optionVisibility);
        }}
      >
        {title}
      </button>
      <Triangle className={styles.indicator} size={12} />
      <ul
        className={`${styles.optionList} ${styles[place]}${
          optionVisibility ? " flex" : " hidden"
        }`}
        style={{ [place]: -offset }}
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
            >
              <button>{res}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default MySelect;
