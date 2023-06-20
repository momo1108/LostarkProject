import styles from "@/styles/engrave/Body.module.scss";
import { engravingIconMap } from "@/types/TEGCType";
import MenuIcons from "@/components/icons/MenuIcons";
import { useState, useMemo, useRef } from "react";
import {
  AbilityInputMode,
  AccessoryInfo,
  AuctionItem,
  AuctionItemSearchResult,
  CASES,
  CheckMode,
  Combination,
  DropdownMode,
  ENGRAVES,
  EngraveInfo,
  EtcOption,
  NEGATIVE_ENGRAVES,
  accessoryOrderMap,
  engraveLevelColorMap,
} from "@/types/EngraveType";
import Delete from "@/components/icons/Delete";
import Edit from "@/components/icons/Edit";
import Check from "@/components/icons/Check";
import MySelect from "@/components/custom/MySelect";
import Close from "@/components/icons/Close";
import Save from "@/components/icons/Save";
import Load from "@/components/icons/Load";
import Search from "@/components/icons/Search";
import EngraveService from "@/service/EngraveService";
import Target from "@/components/icons/Target";
import Ring from "@/components/icons/Ring";
import Ring2 from "@/components/icons/Ring2";
import Necklace from "@/components/icons/Necklace";
import Earring from "@/components/icons/Earring";
import {
  CATEGORY_CODE,
  ETC_OPTION_CODE,
  apiEngravePriority,
  engravePriority,
} from "@/types/GlobalType";

const EngraveSearchBlock: React.FC = () => {
  const answer: Combination[] = [];
  const tmp: number[][] = [];
  const [totalCases, setTotalCases] = useState<number>(0);
  const [apiCallCount, setApiCallCount] = useState<number>(0);
  const [targetList, setTargetList] = useState<EngraveInfo[]>([]);
  const [equipList, setEquipList] = useState<EngraveInfo[]>([]);
  const [abilityList, setAbilityList] = useState<EngraveInfo[]>([]);
  const [negativeEngrave, setNegativeEngrave] = useState<EngraveInfo>({
    name: "감소 효과 선택",
    point: 0,
    enableInput: false,
    inputValue: "0",
  });
  const [necklaceState, setNecklaceState] = useState<AccessoryInfo>({
    type: 0,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [earringState1, setEarringState1] = useState<AccessoryInfo>({
    type: 1,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [earringState2, setEarringState2] = useState<AccessoryInfo>({
    type: 1,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [ringState1, setRingState1] = useState<AccessoryInfo>({
    type: 2,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const [ringState2, setRingState2] = useState<AccessoryInfo>({
    type: 2,
    quality: 50,
    stat1: { type: "치명", value: 0 },
    stat2: { type: "특화", value: 0 },
    isOwned: false,
    engraveInfo: {
      engrave1: { name: "" },
      engrave2: { name: "" },
      negativeEngrave: { name: "" },
    },
  });
  const accessoryList = {
    getter: [
      necklaceState,
      earringState1,
      earringState2,
      ringState1,
      ringState2,
    ],
    setter: [
      setNecklaceState,
      setEarringState1,
      setEarringState2,
      setRingState1,
      setRingState2,
    ],
  };

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
                        width={115}
                        height={30}
                        offset={3}
                        mapFunction={(e, i) => {
                          return e.name;
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
          <table>
            <tbody>
              {accessoryList.getter.map((e: AccessoryInfo, i: number) => {
                return (
                  <tr key={`accessory_table_row_${i}`}>
                    <td className={styles.accessoryTableCol1}>
                      <div>
                        {i === 0 ? (
                          <>
                            <h5>목걸이</h5>
                            <Necklace size={30} fill="#fff" />
                          </>
                        ) : i === 1 ? (
                          <>
                            <h5>귀걸이1</h5>
                            <Earring size={30} fill="#fff" fill2="#555" />
                          </>
                        ) : i === 2 ? (
                          <>
                            <h5>귀걸이2</h5>
                            <Earring size={30} fill="#555" fill2="#fff" />
                          </>
                        ) : i === 3 ? (
                          <>
                            <h5>반지1</h5>
                            <Ring2 size={30} fill="#fff" fill2="#555" />
                          </>
                        ) : (
                          <>
                            <h5>반지2</h5>
                            <Ring2
                              size={30}
                              first={false}
                              fill="#555"
                              fill2="#fff"
                            />
                          </>
                        )}
                      </div>
                    </td>
                    <td className={styles.accessoryTableCol2}>
                      <div className={styles.colBlock}>
                        <label>
                          <h5>품질</h5>
                          <div>
                            <input
                              className={styles.accessoryQuailityInput}
                              type="number"
                              max={100}
                              min={0}
                              value={e.quality}
                              onChange={(event) => {
                                let quality_tmp = parseInt(event.target.value);
                                quality_tmp = quality_tmp
                                  ? quality_tmp > 100
                                    ? 100
                                    : quality_tmp < 0
                                    ? 0
                                    : quality_tmp
                                  : 0;
                                accessoryList.setter[i]({
                                  ...e,
                                  quality: quality_tmp ? quality_tmp : 0,
                                });
                              }}
                            />
                          </div>
                        </label>
                      </div>
                    </td>
                    <td className={styles.accessoryTableCol3}>
                      <div className={styles.colBlock}>
                        <h5>특성1</h5>
                        <MySelect
                          width={70}
                          height={30}
                          title={e.stat1.type}
                          place="right"
                          offset={3}
                          color="#ccc"
                          data={[
                            "치명",
                            "특화",
                            "신속",
                            "제압",
                            "인내",
                            "숙련",
                          ]}
                          mapFunction={(el) => {
                            return <span>{el}</span>;
                          }}
                          onClickFunction={(el) => {
                            console.log(e.stat1, el);
                            if (e.type === 0 && el === e.stat2.type) {
                              alert("이미 선택된 특성입니다.");
                              return;
                            }
                            accessoryList.setter[i]({
                              ...e,
                              stat1: { ...e.stat1, type: el },
                            });
                          }}
                        />
                      </div>
                    </td>
                    <td className={styles.accessoryTableCol4}>
                      {e.type === 0 ? (
                        <div className={styles.colBlock}>
                          <h5>특성2</h5>
                          <MySelect
                            width={70}
                            height={30}
                            title={e.stat2.type}
                            place="right"
                            offset={3}
                            color="#ccc"
                            data={[
                              "치명",
                              "특화",
                              "신속",
                              "제압",
                              "인내",
                              "숙련",
                            ]}
                            mapFunction={(el) => {
                              return <span>{el}</span>;
                            }}
                            onClickFunction={(el) => {
                              console.log(e.stat1, el);
                              if (e.type === 0 && el === e.stat1.type) {
                                alert("이미 선택된 특성입니다.");
                                return;
                              }
                              accessoryList.setter[i]({
                                ...e,
                                stat2: { ...e.stat2, type: el },
                              });
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className={styles.accessoryTableCol5}>
                      <div className={styles.colBlock}>
                        <h5>보유중</h5>
                        <p>미구현</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
        <p>
          {apiCallCount} / {totalCases}
        </p>
        <button
          onClick={async () => {
            const ttt = await apiEngravePriority();
            console.log(ttt);
          }}
        >
          test
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
        accessoryList: accessoryList.getter,
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
    accessoryList.setter.forEach((set, i) => {
      set(info.accessoryList[i]);
    });
  }

  async function searchSetting() {
    setApiCallCount(1);
    let inFunctionApiCallCount = 1; // 함수 while문 안에서 state 체크가 제대로 안되네?
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

    const total_point = tmp_info.reduce(
      (acc: number, cur: { name: string; point: number }) => acc + cur.point,
      0
    );

    pickTwo(tmp_info, 0, total_point, tmp_info.length);

    answer.sort((a, b) =>
      a.useless_count === b.useless_count
        ? a.sum === b.sum
          ? a.max - b.max
          : a.sum - b.sum
        : b.useless_count - a.useless_count
    );
    for (let i = 0; i < answer.length; i++) {
      answer[i].data.sort((a, b) => {
        // [각인1, 수치1, 각인2, 수치2]
        const a1Priority =
          a[0] === -1 ? 0 : engravePriority[tmp_info[a[0]].name] * (a[1] - 2);
        const a2Priority =
          a[2] === -1 ? 0 : engravePriority[tmp_info[a[2]].name] * (a[3] - 2);
        const b1Priority =
          b[0] === -1 ? 0 : engravePriority[tmp_info[b[0]].name] * (b[1] - 2);
        const b2Priority =
          b[2] === -1 ? 0 : engravePriority[tmp_info[b[2]].name] * (b[3] - 2);
        return a1Priority + a2Priority - (b1Priority + b2Priority);
      });
    }

    // const accessory_order_list = findAccessoryOrderList(true, true);
    const ear_diff: boolean =
      accessoryList.getter[1].stat1.type !== accessoryList.getter[2].stat1.type;
    const ring_diff: boolean =
      accessoryList.getter[3].stat1.type !== accessoryList.getter[4].stat1.type;
    const index = (ear_diff ? 2 : 0) + (ring_diff ? 1 : 0);
    const accessory_order_list = accessoryOrderMap[index];

    console.log(tmp_info);
    // console.log(accessoryList);
    console.log(answer);
    // console.log(accessory_order_list);

    /* 찾아낸 각인 조합을 모든 악세서리의 조합과 합친다.
    1. 한 악세서리 세트에 적용된 조합을 찾기 위해서는
       5번의 api request가 필요하다.
    2. 
      2-1. 1번 과정을 모든 악세서리 조합에 맞게 반복한다.
           (120, 60, 60, 30)
      2-2. 1번 과정이 완료될 때 마다? 가능 조합을 계산
    3. 쓸모없는 각인이 있는 경우 경우의 수 줄이는 처리해야할듯
    4. 이전의 가격을 참조해 검색도중 생략하는 것도 좋을듯.
    */
    // 각인 조합 반복문
    let single_res;
    setTotalCases(answer.length * accessory_order_list.length * 5);
    // const inFunctionTotalCases =
    //   answer.length * accessory_order_list.length * 5;
    const inFunctionTotalCases = 5;
    let resultArray = [];
    let current_case = 0;
    let error_count = 0;
    while (current_case < inFunctionTotalCases) {
      if (inFunctionApiCallCount > 0 && inFunctionApiCallCount % 100 === 0) {
        await new Promise((res) => {
          setTimeout(() => {
            res("next call");
          }, 65000);
        });
      }

      // 현재 각인 조합이 몇번째인가?
      const engrave_combination_index = Math.floor(
        current_case / (accessory_order_list.length * 5)
      );
      answer[engrave_combination_index].data; // 현재 각인 조합
      // 현재 case는 총 악세서리 조합안의 몇번째 악세서리인가?
      const tmp_index = current_case % (accessory_order_list.length * 5);
      const [accessory_combination_index, accessory_element_index] = [
        Math.floor(tmp_index / 5),
        tmp_index % 5,
      ];

      try {
        single_res = await apiAuctionSearch(
          CATEGORY_CODE[accessoryList.getter[current_case % 5].type],
          [
            ...(accessoryList.getter[current_case % 5].type === 0
              ? [
                  {
                    FirstOption: ETC_OPTION_CODE["전투 특성"],
                    SecondOption:
                      ETC_OPTION_CODE[
                        accessoryList.getter[current_case % 5].stat1.type
                      ],
                  },
                  {
                    FirstOption: ETC_OPTION_CODE["전투 특성"],
                    SecondOption:
                      ETC_OPTION_CODE[
                        accessoryList.getter[current_case % 5].stat2.type
                      ],
                  },
                ]
              : [
                  {
                    FirstOption: ETC_OPTION_CODE["전투 특성"],
                    SecondOption:
                      ETC_OPTION_CODE[
                        accessoryList.getter[current_case % 5].stat1.type
                      ],
                  },
                ]),
            {
              FirstOption: ETC_OPTION_CODE["각인 효과"],
              SecondOption:
                ETC_OPTION_CODE[
                  tmp_info[
                    answer[engrave_combination_index].data[
                      accessory_order_list[accessory_combination_index][
                        accessory_element_index
                      ]
                    ][0]
                  ]?.name || "ANY"
                ],
              MinValue:
                answer[engrave_combination_index].data[
                  accessory_order_list[accessory_combination_index][
                    accessory_element_index
                  ]
                ][1],
            },
            {
              FirstOption: ETC_OPTION_CODE["각인 효과"],
              SecondOption:
                ETC_OPTION_CODE[
                  tmp_info[
                    answer[engrave_combination_index].data[
                      accessory_order_list[accessory_combination_index][
                        accessory_element_index
                      ]
                    ][2]
                  ]?.name || "ANY"
                ],
              MinValue:
                answer[engrave_combination_index].data[
                  accessory_order_list[accessory_combination_index][
                    accessory_element_index
                  ]
                ][3],
            },
          ],
          accessoryList.getter[current_case % 5].quality
        );
        resultArray.push(single_res);
        current_case++;
        error_count = 0;
      } catch (error) {
        console.log(error);
        // 같은 구간 3번 이상 오류 발생하면 다음 악세조합으로 넘어간다.
        if (++error_count >= 3) {
          error_count = 0;
          current_case = (Math.floor(current_case / 5) + 1) * 5;
        }
      } finally {
        inFunctionApiCallCount++;
        setApiCallCount((state) => {
          return state + 1;
        });
      }
    }
    console.log(resultArray);

    const negativeCounter: { [key: string]: number } = {
      "공격력 감소": 0,
      "공격속도 감소": 0,
      "방어력 감소": 0,
      "이동속도 감소": 0,
    };
    negativeCounter[negativeEngrave.name] += negativeEngrave.point || 0;
    let availableArray: AuctionItem[][] = [];
    findAvailableAccessoryCombination(
      0,
      resultArray,
      [],
      availableArray,
      negativeCounter
    );

    availableArray.sort((a, b) => {
      return (
        a.reduce((prev, cur) => prev + cur.AuctionInfo.BuyPrice, 0) -
        b.reduce((prev, cur) => prev + cur.AuctionInfo.BuyPrice, 0)
      );
    });

    console.log(availableArray);

    /*
    현재 결과를 보니, 가격대를 최소화 하기 위한 알고리즘이 필요하다.
    answer에 모든 각인 조합이 저장이 되어있지만, 이걸 정렬한 후에
    앞쪽만 짤라서 사용해야 할 것 같다.
    전체 각인 조합을 저장한 answer의 정렬 기준은 그대로 두고,
    각 각인 조합의 정렬의 기준은 자유각인 개수를 기준으로 내림차순, 
    각인의 포인트와 각인의 희소도(전각 가격으로 책정)를 기준으로 오름차순 정렬을 하자.
    그리고 첫번째 각인은 목걸이에 고정해놓고, 
    나머지를 이전과 같이 악세 조합을 찾는 방식으로 진행한다.
    이러면 아이스펭보다 검색 속도 자체는 훨씬 빠를 것이다.

    수정 결과 각인의 우선순위를 정하는게 생각보다 많이 복잡하다. 
    answer 를 정렬한 상태에서, 상위 3개 조합에 대해서(총 15개 각인)
    가능한 가장 싼 조합을 찾는 방법을 써야할 듯 하다.
    이게 악세서리 순서조합까지 미리 짜놓고 
    api를 사용하기에는 req limit이 너무 모자라다.
    악세서리 조합을 짜기보다 각각의 각인 조합에 대해서만
    각 각인에 5개 악세서리를 검색해보고 결과를 조합하는게 낫겠다.
    이 경우 1개 각인 조합에 대해 req가 25개 발생한다.
    (각인 5개 * 악세 부위 5개)
    상위 4개 각인 조합에 대해서 검색하면 될 것 같다.

    위의 수정도 이전과 크게 다를 게 없을 것 같다.
    장착한 각인을 제외하고 남은 각인 중 검색할 각인 조합을
    찾아내는 함수를 만들어야 할 것 같다.
    3, 3 각인 부터 시작해서(가능한 경우) 재귀형식으로 타고
    들어가 가능한 각인 조합을 찾아낸다. 이 때, 남은 악세 부위로
    가능한 각인 수치를 넘어서면 return한다.
    이런식으로 재귀가 끝나면 가능한 모든 조합이 나오고, 이를 사용한다.

    icepeng의 경우, 전체 목표 각인을 위해 필요한 각인 조합들을 모두 생성해놓고, 
    이를 각 악세서리 부위에 대해서 모두 검색을 진행한다.
    각인의 수(N) * 악세서리 부위 수(5)
    모든 각인의 조합을 어떻게 만드는건지는 모르겠다..
     */
  }

  /**
   * 현재 searchSetting 함수에서 찾아낸 resultArray 안의
   * 악세서리 데이터들을 조합해서 페널티 각인 없이 가능한 조합을
   * 찾아내는 함수.
   * 목표 각인들의 조합은 부위별로 이미 완성되어 있으므로,
   * 페널티 각인들만 확인해주는 함수이다.
   * @param order 현재 악세서리 부위(0 : 목, 1~2: 귀, 3~4: 반)
   * @param infoArray 검색된 정보를 가진 array(resultArray)
   * @param singleArray 현재 조합정보를 저장할 배열
   * @param resultArray 완성된 모든 조합정보를 저장할 배열
   * @param negativeCounter 페널티 각인 카운트를 저장할 객체
   */
  function findAvailableAccessoryCombination(
    order: number,
    infoArray: AuctionItemSearchResult[],
    singleArray: AuctionItem[],
    availableArray: AuctionItem[][],
    negativeCounter: { [key: string]: number }
  ) {
    if (order >= 5) {
      availableArray.push(JSON.parse(JSON.stringify(singleArray)));
      return;
    }
    const accessoryArray = infoArray[order].Items;
    for (let i = 0; i < accessoryArray.length; i++) {
      // 악세서리 옵션 중 Type: "ABILITY_ENGRAVE",
      // IsPenalty: true 만 골라서 체크
      let currentOption;
      for (let j = 0; j < accessoryArray[i].Options.length; j++) {
        currentOption = accessoryArray[i].Options[j];
        if (
          currentOption.Type === "ABILITY_ENGRAVE" &&
          currentOption.IsPenalty === true
        ) {
          negativeCounter[currentOption.OptionName] += currentOption.Value;
          if (negativeCounter[currentOption.OptionName] < 5) {
            singleArray.push(accessoryArray[i]);
            findAvailableAccessoryCombination(
              order + 1,
              infoArray,
              singleArray,
              availableArray,
              negativeCounter
            );
            singleArray.pop();
          }
          negativeCounter[currentOption.OptionName] -= currentOption.Value;
        }
      }
    }
  }

  function pickTwo(
    input: { name: string; point: number }[],
    count: number,
    point_sum: number,
    need_count: number
  ) {
    // 완성된 경우
    if (need_count <= 0) {
      if (count === 5) {
        // 5꽉
        const data = JSON.parse(JSON.stringify(tmp));
        const [sum, max, useless_count]: number[] = data.reduce(
          (cur: number[], el: number[]) => [
            cur[0] + el[1] + el[3],
            Math.max(cur[1], el[1], el[3]),
            cur[2] + (el[0] === -1 ? 1 : 0) + (el[2] === -1 ? 1 : 0),
          ],
          [0, 0, 0]
        );
        answer.push({
          data,
          sum,
          max,
          useless_count,
        });
        return;
      } else {
        const tmp_copy = JSON.parse(JSON.stringify(tmp));
        const data = [
          ...tmp_copy,
          ...Array(5 - tmp_copy.length).fill([-1, 3, -1, 3]),
        ];
        const [sum, max, useless_count]: number[] = data.reduce(
          (cur: number[], el: number[]) => [
            cur[0] + el[1] + el[3],
            Math.max(cur[1], el[1], el[3]),
            cur[2] + (el[0] === -1 ? 1 : 0) + (el[2] === -1 ? 1 : 0),
          ],
          [0, 0, 0]
        );
        answer.push({
          data,
          sum,
          max,
          useless_count,
        });
        return;
      }
    }

    /*
    가지치기
    1. 각 case에 대해서 차감 전 남아있는 포인트가 case의 포인트보다 작으면 안된다.
       (단, case의 포인트가 3인 경우는 제외)
    2. 각 case에 대해서 포인트 차감 후 남은 포인트가 count * 9 보다 크면 안된다.
    3. i나 j 위치에 0 이하의 point 값인 경우에 대해, point 필요 각인이 많으면 skip한다.
      - point_i가 0 이하 
        - point_j가 0 이하 & 필요각인 1개 이상 -> continue j
        - point_j가 1 이상 & 필요각인 2개 이상 -> continue i
      - point_i가 1 이상
        - point_j가 0 이하 & 필요각인 2개 이상 -> continue j
      - 단, 5개 이전에 이미 만족된 경우도 고려해야한다.
    */

    // 2번 가지치기
    if (point_sum > (5 - count) * 9) return;

    let uselessI = false,
      uselessJ = false;

    for (let i = 0; i < input.length; i++) {
      // 3번 가지치기 -1
      if (input[i].point <= 0 && need_count >= 2) continue;

      // 필요없는 각인의 경우 표기
      if (input[i].point <= 0) uselessI = true;

      for (let j = i + 1; j < input.length; j++) {
        // 3번 가지치기 -2
        if (input[j].point <= 0) {
          if (need_count >= 2) continue;
          else if (need_count >= 1 && input[i].point <= 0) continue;
          uselessJ = true;
        }

        for (const [case0, case1] of CASES) {
          // 1번 가지치기
          if (case0 > input[i].point && case0 > 3) continue;
          if (case1 > input[j].point && case1 > 3) continue;
          const minI = Math.min(input[i].point, case0);
          const minJ = Math.min(input[j].point, case1);
          input[i].point -= minI;
          input[j].point -= minJ;
          tmp.push([uselessI ? -1 : i, case0, uselessJ ? -1 : j, case1]);
          pickTwo(
            input,
            count + 1,
            point_sum - minI - minJ,
            input.reduce(
              (count, engrave) => (engrave.point > 0 ? count + 1 : count),
              0
            )
          );
          tmp.pop();
          input[i].point += minI;
          input[j].point += minJ;
        }

        uselessJ = false;
      }
      uselessI = false;
    }
  }

  function oldSearchSetting() {
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

  /**
   * 완성된 각인 조합으로 모든 검색 조합 찾기
   * - 경우의 수
   * 1. 각 귀걸이 쌍과 반지 쌍의 특성이 다른경우
   *   5! = 120
   * 2. 귀걸이 쌍만 특성이 다른 경우
   *   5 * 12(=4P2) * 1(=2C2) = 60
   * 3. 반지 쌍만 특성이 다른 경우
   *   5 * 6(=4C2) * 2(=2P2) = 60
   * 3. 귀걸이 쌍과 반지 쌍의 특성이 같은 경우
   *   5 * 6(=4C2) * 1(=2C2) = 30
   */
  function findAccessoryOrderList(
    ear_diff: boolean,
    ring_diff: boolean
  ): number[][] {
    const order_list: number[][] = [];
    const order: number[] = [0, 0, 0, 0, 0];

    for (let necklace = 0; necklace < 5; necklace++) {
      order[necklace] = 1;
      if (ear_diff) {
        for (let ear1 = 0; ear1 < 5; ear1++) {
          if (order[ear1]) continue;
          order[ear1] = 2;
          for (let ear2 = 0; ear2 < 5; ear2++) {
            if (order[ear2]) continue;
            order[ear2] = 3;

            if (ring_diff) {
              for (let ring1 = 0; ring1 < 5; ring1++) {
                if (order[ring1]) continue;
                order[ring1] = 4;
                for (let ring2 = 0; ring2 < 5; ring2++) {
                  if (order[ring2]) continue;
                  order[ring2] = 5;
                  order_list.push([...order]);
                  order[ring2] = 0;
                }
                order[ring1] = 0;
              }
            } else {
              for (let ring1 = 0; ring1 < 5; ring1++) {
                if (order[ring1]) continue;
                order[ring1] = 4;
                for (let ring2 = ring1 + 1; ring2 < 5; ring2++) {
                  if (order[ring2]) continue;
                  order[ring2] = 5;
                  order_list.push([...order]);
                  order[ring2] = 0;
                }
                order[ring1] = 0;
              }
            }

            order[ear2] = 0;
          }
          order[ear1] = 0;
        }
      } else {
        for (let ear1 = 0; ear1 < 5; ear1++) {
          if (order[ear1]) continue;
          order[ear1] = 2;
          for (let ear2 = ear1 + 1; ear2 < 5; ear2++) {
            if (order[ear2]) continue;
            order[ear2] = 3;

            if (ring_diff) {
              for (let ring1 = 0; ring1 < 5; ring1++) {
                if (order[ring1]) continue;
                order[ring1] = 4;
                for (let ring2 = 0; ring2 < 5; ring2++) {
                  if (order[ring2]) continue;
                  order[ring2] = 5;
                  order_list.push([...order]);
                  order[ring2] = 0;
                }
                order[ring1] = 0;
              }
            } else {
              for (let ring1 = 0; ring1 < 5; ring1++) {
                if (order[ring1]) continue;
                order[ring1] = 4;
                for (let ring2 = ring1 + 1; ring2 < 5; ring2++) {
                  if (order[ring2]) continue;
                  order[ring2] = 5;
                  order_list.push([...order]);
                  order[ring2] = 0;
                }
                order[ring1] = 0;
              }
            }

            order[ear2] = 0;
          }
          order[ear1] = 0;
        }
      }
      order[necklace] = 0;
    }

    return order_list;
  }

  /**
   *
   * @param CategoryCode 검색 물품의 코드(apirequset_auction.json파일 참조)
   * @param EtcOptions 검색 물품의 세부옵션(각인, 특성과 그 수치)
   * @param ItemGradeQuality 검색 물품의 품질
   * @returns
   */
  async function apiAuctionSearch(
    CategoryCode: number,
    EtcOptions: EtcOption[],
    ItemGradeQuality: number
  ) {
    const res = await EngraveService.getAuctionItems({
      CategoryCode,
      EtcOptions,
      ItemGrade: "고대",
      ItemGradeQuality,
      ItemTier: 3,
      PageNo: 1,
      Sort: "BUY_PRICE",
      SortCondition: "ASC",
    });
    return res;
  }
};

export default EngraveSearchBlock;
