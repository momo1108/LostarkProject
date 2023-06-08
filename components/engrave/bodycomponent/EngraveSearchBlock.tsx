import styles from "@/styles/engrave/Body.module.scss";
import { engravingIconMap } from "@/types/TEGCType";
import { useState, useRef, useEffect, useMemo } from "react";

type engraveInfo = { name: string; level: number };
const ENGRAVES = Object.keys(engravingIconMap)
  .filter((e: string) => !e.includes("감소"))
  .sort();

const EngraveSearchBlock: React.FC = () => {
  const [targetList, setTargetList] = useState<engraveInfo[]>([]);
  const [dropdownVisibility, setDropdownVisibility] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const engraveSearchList = useMemo(() => {
    return ENGRAVES.filter((name: string) => {
      return name.includes(searchValue);
    });
  }, [searchValue]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.targetEngraveDiv}>
        <h4 className={styles.targetTitle}>목표 각인</h4>
        <div
          className={styles.targetSearchDiv}
          onFocus={() => setDropdownVisibility(true)}
          onBlur={() => setDropdownVisibility(false)}
          tabIndex={0}
        >
          <input
            className={styles.targetSearchInput}
            type="text"
            placeholder="각인 검색"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <div
            className={`${styles.dropdown}${
              dropdownVisibility ? " flex" : " hidden"
            }`}
          >
            <h5 className={styles.dropdownHeader}>
              <span>각인 목록</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => {
                  setDropdownVisibility(false);
                }}
              >
                <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6" />
              </svg>
            </h5>
            <ul className={`${styles.dropdownList} hideScroll`}>
              {engraveSearchList.map((e: string) => {
                return (
                  <li
                    className={`${styles.dropdownListItem} ${
                      targetList.find(
                        (target: engraveInfo) => target.name === e
                      )
                        ? styles.selectedItem
                        : ""
                    }`}
                    onClick={() => check(e)}
                  >
                    <img
                      width={30}
                      src={`/images/${engravingIconMap[e]}`}
                      alt=""
                    />
                    <span>{e}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <ul className={styles.targetList}>
          {targetList.map((e: engraveInfo) => {
            return <li>{e.name}</li>;
          })}
        </ul>
      </div>
      <div className={styles.equipEngraveDiv}>
        <h4 className={styles.equipTitle}>장착 각인</h4>
      </div>
    </div>
  );

  function check(name: string) {
    const index = targetList.findIndex((e: engraveInfo) => e.name === name);
    if (index > -1)
      setTargetList(targetList.filter((e: engraveInfo) => e.name !== name));
    else setTargetList([...targetList, { name, level: 3 }]);
  }
};

export default EngraveSearchBlock;
