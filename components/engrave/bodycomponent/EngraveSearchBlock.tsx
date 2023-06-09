import styles from "@/styles/engrave/Body.module.scss";
import { engravingIconMap } from "@/types/TEGCType";
import MenuIcons from "@/components/icons/MenuIcons";
import { useState, useRef, useEffect, useMemo } from "react";
import { engraveLevelColorMap } from "@/types/EngraveType";

type engraveInfo = { name: string; level: number };
const ENGRAVES = Object.keys(engravingIconMap)
  .filter((e: string) => !e.includes("감소"))
  .sort();

const EngraveSearchBlock: React.FC = () => {
  const [targetList, setTargetList] = useState<engraveInfo[]>([]);
  const [dropdownVisibility, setDropdownVisibility] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  // 자꾸 자식요소(각인) 클릭 시 blur이벤트때문에 dropdown이 사라졌다가 다시나옴.
  // 방지하기 위해 사용
  const [preventBlur, setPreventBlur] = useState<boolean>(false);
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
          onFocus={() => {
            setDropdownVisibility(true);
          }}
          onBlur={() => {
            if (preventBlur) {
              setPreventBlur(false);
              return;
            }
            setDropdownVisibility(false);
          }}
          tabIndex={0}
        >
          <MenuIcons
            className={`${styles.engraveIcon} ${
              dropdownVisibility ? styles.activeIcon : ""
            }`}
            type={1}
            size={23}
            width={1}
          />
          <input
            className={`${styles.targetSearchInput} ${
              dropdownVisibility ? styles.focused : ""
            }`}
            type="text"
            placeholder="각인 검색"
            value={searchValue}
            onMouseDown={() => setPreventBlur(true)}
            onMouseUp={() => setPreventBlur(false)}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <div
            className={`${styles.dropdownWrapper}${
              dropdownVisibility ? " flex" : " hidden"
            }`}
            onMouseDown={() => setPreventBlur(true)}
            onMouseUp={() => setPreventBlur(false)}
          >
            <div className={styles.dropdown}>
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
                      className={styles.dropdownListItem}
                      onClick={() => check(e)}
                      key={`all_engrave_${e}`}
                    >
                      <img
                        width={30}
                        src={`/images/${engravingIconMap[e]}`}
                        alt=""
                      />
                      <p>{e}</p>
                      <div
                        className={`${styles.selectedItem} ${
                          targetList.find((e2: engraveInfo) => e2.name === e)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        목표 각인{" "}
                        {targetList.findIndex(
                          (e2: engraveInfo) => e2.name === e
                        ) + 1}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <ul className={styles.targetList}>
          {targetList.length ? (
            targetList.map((e: engraveInfo, i: number) => {
              return (
                <li
                  className={styles.targetListItem}
                  key={`selected_engrave_${e.name}`}
                >
                  <p className={styles.targetListItemTitle}>
                    {e.name}
                    <br />
                    Lv.{" "}
                    <span className="text-2xl font-extrabold">{e.level}</span>
                  </p>
                  <div className={styles.engraveImgSlot}>
                    <div className={styles.engraveImg}>
                      <img
                        width={"100%"}
                        src={`/images/${engravingIconMap[e.name]}`}
                        alt=""
                      />
                    </div>
                    <img
                      width={70}
                      src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_slot_engrave.png"
                      alt="emptyslot"
                    />
                  </div>
                  <ol className={styles.engraveLevelList}>
                    {[1, 2, 3].map((level) => {
                      return (
                        <li
                          key={`engrave_${e.name}_level_${level}`}
                          className={
                            e.level === level
                              ? `${engraveLevelColorMap[level]}BgColor ${engraveLevelColorMap[level]}BorderColor`
                              : `${engraveLevelColorMap[level]}Color ${engraveLevelColorMap[level]}BorderColor`
                          }
                          onClick={() => {
                            setEngraveLevel(i, level);
                          }}
                        >
                          {level}
                        </li>
                      );
                    })}
                  </ol>
                </li>
              );
            })
          ) : (
            <li className={styles.emptyTargetListItem}>
              <div className={styles.emptyTargetListItemIconDiv}>
                <MenuIcons
                  className={styles.emptyTargetListItemIcon}
                  size={100}
                  width={1.3}
                  type={1}
                />
              </div>
              <p>선택된 각인이 없습니다.</p>
            </li>
          )}
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

  function setEngraveLevel(i: number, level: number) {
    const tmp = JSON.parse(JSON.stringify(targetList));
    tmp.splice(i, 1, { ...targetList[i], level: level });
    setTargetList(tmp);
  }
};

export default EngraveSearchBlock;
