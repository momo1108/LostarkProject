import styles from "@/styles/engrave/Body.module.scss";
import { engravingIconMap } from "@/types/TEGCType";
import MenuIcons from "@/components/icons/MenuIcons";
import { useState, useMemo, useRef } from "react";
import {
  AbilityInputMode,
  AccessoryInfo,
  CheckMode,
  DropdownMode,
  ENGRAVES,
  EngraveInfo,
  NEGATIVE_ENGRAVES,
  NEGATIVE_ENGRAVES_POINT,
  engraveLevelColorMap,
} from "@/types/EngraveType";
import Delete from "@/components/icons/Delete";
import Edit from "@/components/icons/Edit";
import Check from "@/components/icons/Check";
import MySelect from "@/components/custom/MySelect";
import Close from "@/components/icons/Close";
import Modal from "@/components/modal/Modal";
import Save from "@/components/icons/Save";
import Load from "@/components/icons/Load";
import Search from "@/components/icons/Search";
import EngraveService from "@/service/EngraveService";
import Target from "@/components/icons/Target";
import Ring from "@/components/icons/Ring";

const EngraveSearchBlock: React.FC = () => {
  const [targetList, setTargetList] = useState<EngraveInfo[]>([]);
  const [equipList, setEquipList] = useState<EngraveInfo[]>([]);
  const [abilityList, setAbilityList] = useState<EngraveInfo[]>([]);
  const [negativeEngrave, setNegativeEngrave] = useState<EngraveInfo>({
    name: "감소 효과 선택",
    point: 0,
    enableInput: false,
    inputValue: "0",
  });
  const [accessoryList, setAccessoryList] = useState<AccessoryInfo[]>([]);

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
  const targetEngraveRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <button
          className="myButtons"
          onClick={() => {
            saveSetting();
          }}
        >
          <Save color="#ccc" size={20} />
          <span>세팅저장</span>
        </button>
        <button
          className="myButtons"
          onClick={() => {
            loadSetting();
          }}
        >
          <Load color="#ccc" size={20} />
          <span>불러오기</span>
        </button>
      </div>
      <div className={styles.searchBody}>
        <div className={`${styles.targetEngraveDiv} ${styles.bodyBoxShadow}`}>
          <h4 className={styles.targetTitle}>
            <Target size={30} />
            목표 각인
          </h4>
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
              ref={targetEngraveRef}
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
                  <Close
                    size={20}
                    width={3}
                    color="#ccc"
                    onClick={() => {
                      setDropdownMode(3);
                    }}
                  />
                </h5>
                <ul className={`${styles.dropdownList} hideScroll`}>
                  {engraveSearchList.length ? (
                    engraveSearchList.map((e: string) => {
                      return (
                        <li
                          className={styles.dropdownListItem}
                          onClick={() => {
                            check(e, 0);
                            targetEngraveRef.current?.focus();
                          }}
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
                              targetList.find(
                                (e2: EngraveInfo) => e2.name === e
                              )
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
                    })
                  ) : (
                    <li className={styles.emptyDropdownListItem}>
                      일치하는 각인이 없습니다.
                    </li>
                  )}
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
                        src="/images/engrave_slot.png"
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
                      width={2}
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
              <li data-empty-type="1" className={styles.emptyListItem}>
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
        <div className={`${styles.equipEngraveDiv} ${styles.bodyBoxShadow}`}>
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
                  <Close
                    size={20}
                    width={3}
                    color="#ccc"
                    onClick={() => {
                      setDropdownMode(3);
                    }}
                  />
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
                <>
                  {equipList.map((e: EngraveInfo, i: number) => {
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
                              src="/images/engrave_slot.png"
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
                                engraveLevelColorMap[e.level!]
                              }Color`}
                            >
                              +{e.level! * 3 + 3}
                            </p>
                            <div className={styles.equipListItemButtonDiv}>
                              <button
                                className={styles.plusMinusButtons}
                                onClick={() =>
                                  setEquipEngraveLevel(i, e.level! + 1)
                                }
                              >
                                +
                              </button>
                              <button
                                className={styles.plusMinusButtons}
                                onClick={() =>
                                  setEquipEngraveLevel(i, e.level! - 1)
                                }
                              >
                                -
                              </button>
                            </div>
                            <Delete
                              size={22}
                              width={2}
                              color="#aaa"
                              onClick={() => {
                                const tmp = JSON.parse(
                                  JSON.stringify(equipList)
                                );
                                tmp.splice(i, 1);
                                setEquipList(tmp);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {equipList.length === 1 ? (
                    <tr className={styles.equipListItem}></tr>
                  ) : (
                    ""
                  )}
                </>
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

                  <Close
                    size={20}
                    width={3}
                    color="#ccc"
                    onClick={() => {
                      setDropdownMode(3);
                    }}
                  />
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
                <>
                  {abilityList.map((e: EngraveInfo, i: number) => {
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
                              src="/images/engrave_slot.png"
                              alt="emptyslot"
                            />
                          </div>
                        </td>
                        <td>
                          <p className={styles.equipListItemTitle}>{e.name}</p>
                        </td>
                        <td>
                          <div className={styles.equipListItemButtons}>
                            {e.enableInput ? (
                              <div className={styles.equipAbilityInputDiv}>
                                <p className={styles.inputArea}>
                                  +
                                  <input
                                    type="text"
                                    className={styles.equipAbilityInput}
                                    value={e.inputValue}
                                    onKeyDown={(event) => {
                                      if (event.code === "Enter")
                                        setAbilityInput(i, 2);
                                    }}
                                    onChange={(event) => {
                                      const tmp = JSON.parse(
                                        JSON.stringify(abilityList)
                                      );
                                      tmp.splice(i, 1, {
                                        ...e,
                                        inputValue: event.target.value,
                                      });
                                      setAbilityList(tmp);
                                    }}
                                  />
                                </p>
                                <button
                                  onClick={() => {
                                    setAbilityInput(i, 2);
                                  }}
                                >
                                  <Check color="#0f0" size={25} />
                                </button>
                                <button
                                  onClick={() => {
                                    setAbilityInput(i, 1);
                                  }}
                                >
                                  <MenuIcons type={3} color="#f00" size={25} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className={styles.equipAbilityP}>
                                  +{e.point}
                                </p>
                                <div className={styles.equipAbilityButtons}>
                                  <button
                                    className={styles.editButton}
                                    onClick={() => {
                                      setAbilityInput(i, 0);
                                    }}
                                  >
                                    <Edit size={15} />
                                  </button>
                                  <div>
                                    <button
                                      className={styles.plusMinusButtons}
                                      onClick={() => {
                                        setAbilityEngravePoint(i, e.point! + 1);
                                      }}
                                    >
                                      +
                                    </button>
                                    <button
                                      className={styles.plusMinusButtons}
                                      onClick={() => {
                                        setAbilityEngravePoint(i, e.point! - 1);
                                      }}
                                    >
                                      -
                                    </button>
                                  </div>
                                </div>
                                <Delete
                                  size={22}
                                  width={2}
                                  color="#aaa"
                                  onClick={() => {
                                    const tmp = JSON.parse(
                                      JSON.stringify(abilityList)
                                    );
                                    tmp.splice(i, 1);
                                    setAbilityList(tmp);
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className={styles.equipListItem}>
                    <td>
                      <div className={styles.engraveImgSlot}>
                        <div
                          className={`${styles.engraveImg}${
                            negativeEngrave.name === "감소 효과 선택"
                              ? ` ${styles.emptyEngraveImg}`
                              : ""
                          }`}
                        >
                          <img
                            width={"100%"}
                            src={`/images/${
                              engravingIconMap[negativeEngrave.name]
                            }`}
                            alt=""
                          />
                        </div>
                        <img
                          width={51}
                          src="/images/engrave_slot.png"
                          alt="emptyslot"
                        />
                      </div>
                    </td>
                    <td>
                      <MySelect
                        title={negativeEngrave.name}
                        data={NEGATIVE_ENGRAVES}
                        mapFunction={(e, i) => {
                          return <span>{e.name}</span>;
                        }}
                        onClickFunction={(e, i) => {
                          setNegativeEngrave({
                            ...negativeEngrave,
                            name: e.name,
                          });
                        }}
                      />
                    </td>
                    <td>
                      <div
                        className={`${styles.equipListItemButtons} ${styles.negativeItemButtons}`}
                      >
                        {negativeEngrave.enableInput ? (
                          <div className={styles.equipAbilityInputDiv}>
                            <p className={styles.inputArea}>
                              -
                              <input
                                type="text"
                                className={styles.equipAbilityInput}
                                value={negativeEngrave.inputValue}
                                onKeyDown={(event) => {
                                  if (event.code === "Enter") {
                                    setNegativeAbilityInput(2);
                                  }
                                }}
                                onChange={(event) => {
                                  setNegativeEngrave({
                                    ...negativeEngrave,
                                    inputValue: event.target.value,
                                  });
                                }}
                              />
                            </p>
                            <button
                              onClick={() => {
                                console.log("check");
                                setNegativeAbilityInput(2);
                              }}
                            >
                              <Check color="#0f0" size={25} />
                            </button>
                            <button
                              onClick={() => {
                                setNegativeAbilityInput(1);
                              }}
                            >
                              <MenuIcons type={3} color="#f00" size={25} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className={styles.equipAbilityP}>
                              -{negativeEngrave.point}
                            </p>
                            <div className={styles.equipAbilityButtons}>
                              <button
                                className={styles.editButton}
                                onClick={() => {
                                  setNegativeAbilityInput(0);
                                }}
                              >
                                <Edit size={15} />
                              </button>
                              <div>
                                <button
                                  className={styles.plusMinusButtons}
                                  onClick={() => {
                                    if (negativeEngrave.point === 10) {
                                      alert(
                                        "0~10 사이의 값만 설정이 가능합니다."
                                      );
                                      return;
                                    }
                                    setNegativeEngrave({
                                      ...negativeEngrave,
                                      point: negativeEngrave.point! + 1,
                                    });
                                  }}
                                >
                                  +
                                </button>
                                <button
                                  className={styles.plusMinusButtons}
                                  onClick={() => {
                                    if (negativeEngrave.point === 0) {
                                      alert(
                                        "0~10 사이의 값만 설정이 가능합니다."
                                      );
                                      return;
                                    }
                                    setNegativeEngrave({
                                      ...negativeEngrave,
                                      point: negativeEngrave.point! - 1,
                                    });
                                  }}
                                >
                                  -
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                </>
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
                    <p>어빌리티 스톤 정보가 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={`${styles.targetAccessoryDiv} ${styles.bodyBoxShadow}`}>
          <h4>
            <Ring size={30} />
            악세서리 설정
          </h4>
        </div>
      </div>
      <div className={styles.searchFooter}>
        <button
          className="myButtons"
          onClick={() => {
            searchSetting();
          }}
        >
          <Search color="#ccc" size={20} />
          <span>검색</span>
        </button>
      </div>
    </div>
  );

  function check(name: string, mode: CheckMode) {
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
          { name, point: 7, enableInput: false, inputValue: "7" },
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

  function setAbilityEngravePoint(i: number, point: number) {
    if (point > 10 || point < 0) {
      alert("잘못된 값이 입력됐습니다.\n0~10 사이의 값을 입력해주세요.");
      return;
    }
    const tmp = JSON.parse(JSON.stringify(abilityList));
    tmp.splice(i, 1, { ...abilityList[i], point, inputValue: point });
    setAbilityList(tmp);
  }

  function setAbilityInput(i: number, mode: AbilityInputMode) {
    const tmp = JSON.parse(JSON.stringify(abilityList));
    if (mode === 0) {
      tmp.splice(i, 1, {
        ...abilityList[i],
        enableInput: true,
        inputValue: abilityList[i].point,
      });
      setAbilityList(tmp);
    } else if (mode === 1) {
      tmp.splice(i, 1, {
        ...abilityList[i],
        enableInput: false,
        inputValue: abilityList[i].point,
      });
      setAbilityList(tmp);
    } else {
      const tmpValue = parseInt(abilityList[i].inputValue!);
      if (isNaN(tmpValue)) {
        tmp.splice(i, 1, {
          ...abilityList[i],
          enableInput: false,
          inputValue: abilityList[i].point,
        });
        setAbilityList(tmp);
      } else {
        let tmpPoint;
        if (tmpValue > 10 || tmpValue < 0) {
          alert("잘못된 값이 입력됐습니다.\n0~10 사이의 값을 입력해주세요.");
          tmpPoint = abilityList[i].point;
        } else {
          tmpPoint = tmpValue;
        }
        tmp.splice(i, 1, {
          ...abilityList[i],
          enableInput: false,
          point: tmpPoint,
        });
        setAbilityList(tmp);
      }
    }
  }

  function setNegativeAbilityInput(mode: AbilityInputMode) {
    if (mode === 0) {
      setNegativeEngrave({
        ...negativeEngrave,
        enableInput: true,
        inputValue: negativeEngrave.point!.toString(),
      });
    } else if (mode === 1) {
      setNegativeEngrave({
        ...negativeEngrave,
        inputValue: negativeEngrave.point!.toString(),
        enableInput: false,
      });
    } else {
      const tmpValue = parseInt(negativeEngrave.inputValue!);
      if (isNaN(tmpValue)) {
        setNegativeEngrave({
          ...negativeEngrave,
          inputValue: negativeEngrave.point!.toString(),
          enableInput: false,
        });
      } else {
        let tmpPoint;
        if (tmpValue > 10 || tmpValue < 0) {
          alert("잘못된 값이 입력됐습니다.\n0~10 사이의 값을 입력해주세요.");
          tmpPoint = negativeEngrave.point;
        } else {
          tmpPoint = tmpValue;
        }
        setNegativeEngrave({
          ...negativeEngrave,
          point: tmpPoint,
          enableInput: false,
        });
      }
    }
  }

  function saveSetting() {
    localStorage.setItem(
      "engrave_setting_info",
      JSON.stringify({
        targetList,
        equipList,
        abilityList,
        negativeEngrave,
      })
    );
  }
  function loadSetting() {
    const tmp_info = localStorage.getItem("engrave_setting_info");
    if (!tmp_info) return;
    const info = JSON.parse(tmp_info);
    setTargetList(info.targetList);
    setEquipList(info.equipList);
    setAbilityList(info.abilityList);
    setNegativeEngrave(info.negativeEngrave);
  }
  async function searchSetting() {
    // const res = await EngraveService.getAuctionItems({
    //   CategoryCode: 200020,
    //   EtcOptions: [
    //     {
    //       FirstOption: 2,
    //       SecondOption: 15,
    //       MinValue: 0,
    //     },
    //   ],
    //   ItemGrade: "고대",
    //   ItemGradeQuality: 50,
    //   ItemTier: 3,
    //   PageNo: 1,
    //   Sort: 1,
    //   SortCondition: 0,
    // });
    // console.log(res);
    let count = 5;
    let option_list = [];
    const tmp_info: { name: string; point: number }[] = targetList.map(
      (e: EngraveInfo) => {
        return { name: e.name, point: e.level! * 5 };
      }
    );

    equipList.map((e: EngraveInfo) => {
      const index = tmp_info.findIndex((e2) => e2.name === e.name);
      if (index >= 0) {
        tmp_info[index].point -= e.level! * 3 + 3;
        if (tmp_info[index].point <= 0) tmp_info.splice(index, 1);
      }
    });
    abilityList.map((e: EngraveInfo) => {
      const index = tmp_info.findIndex((e2) => e2.name === e.name);
      if (index >= 0) {
        tmp_info[index].point -= e.point!;
        if (tmp_info[index].point <= 0) tmp_info.splice(index, 1);
      }
    });

    while (count-- > 0) {
      tmp_info.sort((a, b) => b.point - a.point);
      const tmp_element = { max: ["", 0], min: ["", 0] };
      if (tmp_info.length > 1) {
        if (tmp_info[0].point <= 6) {
          tmp_element.max = [tmp_info[0].name, tmp_info[0].point];
          tmp_info.splice(0, 1);
        } else {
          tmp_element.max = [tmp_info[0].name, 6];
          tmp_info[0].point -= 6;
        }

        tmp_element.min = [tmp_info[tmp_info.length - 1].name, 3];
        if (tmp_info[tmp_info.length - 1].point <= 3) {
          tmp_info.splice(tmp_info.length - 1, 1);
        } else {
          tmp_info[tmp_info.length - 1].point -= 3;
        }
      } else if (tmp_info.length > 0) {
        if (tmp_info[0].point <= 6) {
          tmp_element.max = [tmp_info[0].name, tmp_info[0].point];
          tmp_info.splice(0, 1);
        } else {
          tmp_element.max = [tmp_info[0].name, 6];
          tmp_info[0].point -= 6;
        }
      }
      option_list.push(tmp_element);
    }
    console.log(option_list);
  }
};

export default EngraveSearchBlock;
