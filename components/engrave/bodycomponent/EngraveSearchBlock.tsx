import styles from "@/styles/engrave/Body.module.scss";
import { engravingIconMap } from "@/types/TEGCType";
import MenuIcons from "@/components/icons/MenuIcons";
import { useState, useRef, useEffect, useMemo, ChangeEvent } from "react";
import { engraveLevelColorMap } from "@/types/EngraveType";
import Delete from "@/components/icons/Delete";
import Edit from "@/components/icons/Edit";

type EngraveInfo = { name: string; level: number; enableInput?: boolean };
enum DropdownMode {
  TARGET,
  EQUIP,
  ABILITY_STONE,
  NONE,
}
const ENGRAVES = Object.keys(engravingIconMap)
  .filter((e: string) => !e.includes("감소"))
  .sort();

const EngraveSearchBlock: React.FC = () => {
  const [targetList, setTargetList] = useState<EngraveInfo[]>([]);
  const [equipList, setEquipList] = useState<EngraveInfo[]>([]);
  const [abilityList, setAbilityList] = useState<EngraveInfo[]>([]);
  const [dropdownMode, setDropdownMode] = useState<DropdownMode>(3);
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
            setDropdownMode(0);
          }}
          onBlur={() => {
            if (preventBlur) {
              setPreventBlur(false);
              return;
            }
            setDropdownMode(3);
          }}
          tabIndex={0}
        >
          <MenuIcons
            className={`${styles.engraveIcon} ${
              dropdownMode === 0 ? styles.activeIcon : ""
            }`}
            type={1}
            size={23}
            width={1}
          />
          <input
            className={`${styles.targetSearchInput} ${
              dropdownMode === 0 ? styles.focused : ""
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
              dropdownMode === 0 ? " flex" : " hidden"
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
                    setDropdownMode(3);
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
                      onClick={() => check(e, 0)}
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
                          targetList.find((e2: EngraveInfo) => e2.name === e)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        목표 각인{" "}
                        {targetList.findIndex(
                          (e2: EngraveInfo) => e2.name === e
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
            targetList.map((e: EngraveInfo, i: number) => {
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
                      width={58}
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
                            setTargetEngraveLevel(i, level);
                          }}
                        >
                          {level}
                        </li>
                      );
                    })}
                  </ol>
                  <Delete
                    size={22}
                    color="#aaa"
                    onClick={() => {
                      const tmp = JSON.parse(JSON.stringify(targetList));
                      tmp.splice(i, 1);
                      setTargetList(tmp);
                    }}
                  />
                </li>
              );
            })
          ) : (
            <li className={styles.emptyListItem}>
              <div className={styles.emptyListItemIconDiv}>
                <MenuIcons
                  className={styles.emptyListItemIcon}
                  size={100}
                  width={1.3}
                  type={1}
                />
              </div>
              <p>선택된 목표 각인이 없습니다.</p>
            </li>
          )}
        </ul>
      </div>
      <div className={styles.equipEngraveDiv}>
        <h4 className={styles.equipTitle}>
          <img
            src="/images/engraveBook.png"
            className="inline mr-2"
            width={30}
            alt="전각이미지"
          />
          장착 각인서
        </h4>
        <div
          className={styles.equipSearchDiv}
          onBlur={() => {
            if (preventBlur) {
              setPreventBlur(false);
              return;
            }
            setDropdownMode(3);
          }}
          tabIndex={0}
        >
          <p
            className={`${styles.dropdownSelect} ${
              dropdownMode === 1 ? styles.focused : ""
            }`}
            onClick={() => {
              if (!targetList.length) {
                alert("목표 각인을 먼저 설정해주세요.");
                return;
              }
              setDropdownMode(dropdownMode === 1 ? 3 : 1);
            }}
          >
            <MenuIcons
              className={`${dropdownMode === 1 ? styles.activeIcon : ""}`}
              type={1}
              size={23}
              width={1}
            />
            <span>각인 선택</span>
          </p>
          <div
            data-dropdown-order={1}
            className={`${styles.dropdownWrapper}${
              dropdownMode === 1 ? " flex" : " hidden"
            }`}
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
                    setDropdownMode(3);
                  }}
                >
                  <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6" />
                </svg>
              </h5>
              <ul className={`${styles.dropdownList} hideScroll`}>
                {targetList.map((e: EngraveInfo) => {
                  return (
                    <li
                      className={styles.dropdownListItem}
                      onClick={() => check(e.name, 1)}
                      key={`all_engrave_${e.name}`}
                    >
                      <img
                        width={30}
                        src={`/images/${engravingIconMap[e.name]}`}
                        alt=""
                      />
                      <p>{e.name}</p>
                      <div
                        className={`${styles.selectedItem} ${
                          equipList.find(
                            (e2: EngraveInfo) => e2.name === e.name
                          )
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        장착 각인{" "}
                        {equipList.findIndex(
                          (e2: EngraveInfo) => e2.name === e.name
                        ) + 1}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <table className={styles.equipList}>
          <tbody>
            {equipList.length ? (
              equipList.map((e: EngraveInfo, i: number) => {
                return (
                  <tr
                    className={styles.equipListItem}
                    key={`selected_engrave_${e.name}`}
                  >
                    <td>
                      <div className={styles.engraveImgSlot}>
                        <div className={styles.engraveImg}>
                          <img
                            width={"100%"}
                            src={`/images/${engravingIconMap[e.name]}`}
                            alt=""
                          />
                        </div>
                        <img
                          width={51}
                          src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_slot_engrave.png"
                          alt="emptyslot"
                        />
                      </div>
                    </td>
                    <td>
                      <p className={styles.equipListItemTitle}>{e.name}</p>
                    </td>
                    <td>
                      <div className={styles.equipListItemButtons}>
                        <p
                          className={`${styles.equipListItemValue} ${
                            engraveLevelColorMap[e.level]
                          }Color`}
                        >
                          +{e.level * 3 + 3}
                        </p>
                        <div className={styles.equipListItemButtonDiv}>
                          <button
                            onClick={() => setEquipEngraveLevel(i, e.level + 1)}
                          >
                            +
                          </button>
                          <button
                            onClick={() => setEquipEngraveLevel(i, e.level - 1)}
                          >
                            -
                          </button>
                        </div>
                        <Delete
                          size={22}
                          color="#aaa"
                          onClick={() => {
                            const tmp = JSON.parse(JSON.stringify(equipList));
                            tmp.splice(i, 1);
                            setEquipList(tmp);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className={styles.emptyListItem}>
                <td>
                  <div className={styles.emptyListItemIconDiv}>
                    <MenuIcons
                      className={styles.emptyListItemIcon}
                      size={100}
                      width={1.3}
                      type={1}
                    />
                  </div>
                  <p>장착된 각인이 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <h4 className={styles.equipTitle}>
          <img
            src="/images/abilityStone.png"
            className="inline mr-2"
            width={30}
            alt="전각이미지"
          />
          어빌리티 스톤
        </h4>
        <div
          className={styles.equipSearchDiv}
          onBlur={() => {
            if (preventBlur) {
              setPreventBlur(false);
              return;
            }
            setDropdownMode(3);
          }}
          tabIndex={0}
        >
          <p
            className={`${styles.dropdownSelect} ${
              dropdownMode === 2 ? styles.focused : ""
            }`}
            onClick={() => {
              if (!targetList.length) {
                alert("목표 각인을 먼저 설정해주세요.");
                return;
              }
              setDropdownMode(dropdownMode === 2 ? 3 : 2);
            }}
          >
            <MenuIcons
              className={`${dropdownMode === 2 ? styles.activeIcon : ""}`}
              type={1}
              size={23}
              width={1}
            />
            <span>각인 선택</span>
          </p>
          <div
            data-dropdown-order={1}
            className={`${styles.dropdownWrapper}${
              dropdownMode === 2 ? " flex" : " hidden"
            }`}
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
                    setDropdownMode(3);
                  }}
                >
                  <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6" />
                </svg>
              </h5>
              <ul className={`${styles.dropdownList} hideScroll`}>
                {targetList.map((e: EngraveInfo) => {
                  return (
                    <li
                      className={styles.dropdownListItem}
                      onClick={() => check(e.name, 2)}
                      key={`all_engrave_${e.name}`}
                    >
                      <img
                        width={30}
                        src={`/images/${engravingIconMap[e.name]}`}
                        alt=""
                      />
                      <p>{e.name}</p>
                      <div
                        className={`${styles.selectedItem} ${
                          abilityList.find(
                            (e2: EngraveInfo) => e2.name === e.name
                          )
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        장착 각인{" "}
                        {abilityList.findIndex(
                          (e2: EngraveInfo) => e2.name === e.name
                        ) + 1}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <table className={styles.equipList}>
          <tbody>
            {abilityList.length ? (
              abilityList.map((e: EngraveInfo, i: number) => {
                return (
                  <tr
                    className={styles.equipListItem}
                    key={`selected_engrave_${e.name}`}
                  >
                    <td>
                      <div className={styles.engraveImgSlot}>
                        <div className={styles.engraveImg}>
                          <img
                            width={"100%"}
                            src={`/images/${engravingIconMap[e.name]}`}
                            alt=""
                          />
                        </div>
                        <img
                          width={51}
                          src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_slot_engrave.png"
                          alt="emptyslot"
                        />
                      </div>
                    </td>
                    <td>
                      <p className={styles.equipListItemTitle}>{e.name}</p>
                    </td>
                    <td>
                      <div className={styles.equipListItemButtons}>
                        {abilityList[i].enableInput ? (
                          <input
                            type="text"
                            className={styles.equipAbilityInput}
                            value={abilityList[i].level}
                            onChange={(event) => {
                              setAbilityEngraveLevel(i, event);
                            }}
                          />
                        ) : (
                          <p className={styles.equipAbilityP}>
                            {abilityList[i].level}
                          </p>
                        )}
                        <div className={styles.equipAbilityButtons}>
                          <button>
                            <Edit size={20} />
                          </button>
                          <div>
                            <button>+</button>
                            <button>-</button>
                          </div>
                        </div>
                        <Delete
                          size={22}
                          color="#aaa"
                          onClick={() => {
                            const tmp = JSON.parse(JSON.stringify(abilityList));
                            tmp.splice(i, 1);
                            setAbilityList(tmp);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className={styles.emptyListItem}>
                <td>
                  <div className={styles.emptyListItemIconDiv}>
                    <MenuIcons
                      className={styles.emptyListItemIcon}
                      size={100}
                      width={1.3}
                      type={1}
                    />
                  </div>
                  <p>장착된 각인이 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  function check(name: string, mode: number) {
    if (mode === 0) {
      const index = targetList.findIndex((e: EngraveInfo) => e.name === name);
      if (index > -1)
        setTargetList(targetList.filter((e: EngraveInfo) => e.name !== name));
      else setTargetList([...targetList, { name, level: 3 }]);
    } else if (mode === 1) {
      const index = equipList.findIndex((e: EngraveInfo) => e.name === name);
      if (index > -1)
        setEquipList(equipList.filter((e: EngraveInfo) => e.name !== name));
      else if (equipList.length >= 2) {
        setPreventBlur(true);
        alert("장착 각인은 최대 2개까지입니다.");
        return;
      } else setEquipList([...equipList, { name, level: 3 }]);
    } else if (mode === 2) {
      const index = abilityList.findIndex((e: EngraveInfo) => e.name === name);
      if (index > -1)
        setAbilityList(abilityList.filter((e: EngraveInfo) => e.name !== name));
      else if (abilityList.length >= 2) {
        setPreventBlur(true);
        alert("장착 각인은 최대 2개까지입니다.");
        return;
      } else
        setAbilityList([
          ...abilityList,
          { name, level: 7, enableInput: false },
        ]);
    }
  }

  function setTargetEngraveLevel(i: number, level: number) {
    const tmp = JSON.parse(JSON.stringify(targetList));
    tmp.splice(i, 1, { ...targetList[i], level: level });
    setTargetList(tmp);
  }

  function setEquipEngraveLevel(i: number, level: number) {
    if (level > 3 || level < 0) return;
    const tmp = JSON.parse(JSON.stringify(equipList));
    tmp.splice(i, 1, { ...equipList[i], level: level });
    setEquipList(tmp);
  }

  function setAbilityEngraveLevel(
    i: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const tmp_value: number = parseInt(event.target.value);
    console.dir(event.target);
    console.dir(tmp_value, isNaN(tmp_value));
    if (isNaN(tmp_value)) {
      alert("숫자만 입력해주세요.");
      return;
    } else if (tmp_value > 10 || tmp_value < 0) {
      alert("잘못된 값이 입력됐습니다.\n0~10 사이의 값을 입력해주세요.");
      return;
    }
    const tmp = JSON.parse(JSON.stringify(abilityList));
    tmp.splice(i, 1, { ...abilityList[i], level: event.target.value });
    setAbilityList(tmp);
  }
};

export default EngraveSearchBlock;
