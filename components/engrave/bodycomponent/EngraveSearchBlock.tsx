import styles from "@/styles/engrave/Body.module.scss";
import { engravingIconMap } from "@/types/GlobalType";
import { useContext } from "react";
import {
  AccessoryInfo,
  EngraveInfo,
  NEGATIVE_ENGRAVES,
  engraveLevelColorMap,
} from "@/types/EngraveType";
import MySelect from "@/components/custom/MySelect";
import {
  MenuIcons,
  Delete,
  Edit,
  Check,
  Close,
  Save,
  Load,
  Search,
  Target,
  Ring,
  Ring2,
  Necklace,
  Earring,
  Filter,
  Info,
} from "@/components/icons/Index";
import { Tooltip } from "react-tooltip";
import ApiKeyInput from "@/components/ApiKeyInput";
import EngraveSaveModal from "@/components/modal/EngraveSaveModal";
import EngraveContext from "@/contexts/EngraveContext";
import EngraveLoadModal from "@/components/modal/EngraveLoadModal";

const EngraveSearchBlock: React.FC = () => {
  const {
    negativeEngrave,
    setNegativeEngrave,
    targetList,
    setTargetList,
    equipList,
    setEquipList,
    abilityList,
    setAbilityList,
    usingWebWorker,
    accessoryList,
    statFilterValue,
    setStatFilterValue,
    otherFilterValue,
    setOtherFilterValue,
    saveModalIsOpen,
    setSaveModalIsOpen,
    loadModalIsOpen,
    setLoadModalIsOpen,
    dropdownMode,
    setDropdownMode,
    dropdownSelector,
    setDropdownSelector,
    searchValue,
    setSearchValue,
    preventBlur,
    setPreventBlur,
    engraveSearchList,
    targetEngraveRef,
    check,
    setTargetEngraveLevel,
    setEquipEngraveLevel,
    setAbilityEngravePoint,
    setAbilityInput,
    setNegativeAbilityInput,
    searchSetting,
    applyFilter,
    dropdownRef,
    apiShine,
  } = useContext(EngraveContext);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <EngraveSaveModal
          isOpen={saveModalIsOpen}
          closeFunc={() => {
            setSaveModalIsOpen(false);
          }}
          data={JSON.stringify({
            targetList,
            equipList,
            abilityList,
            negativeEngrave,
            accessoryList: accessoryList.getter,
          })}
        />
        <EngraveLoadModal
          isOpen={loadModalIsOpen}
          closeFunc={() => {
            setLoadModalIsOpen(false);
          }}
          data=""
        />
        <ApiKeyInput shine={apiShine} />
        <div className={styles.presetDiv}>
          <button
            className="myButtons"
            onClick={() => {
              setSaveModalIsOpen(true);
            }}
          >
            <Save color="#ccc" size={20} />
            <span>세팅저장</span>
          </button>
          <button
            className="myButtons"
            onClick={() => {
              setLoadModalIsOpen(true);
            }}
          >
            <Load color="#ccc" size={20} />
            <span>불러오기</span>
          </button>
        </div>
      </div>
      <div className={styles.searchBody}>
        <div className={styles.targetEngraveDiv}>
          <h4 className={styles.targetTitle}>
            <Target size={30} />
            목표 각인
            <Info
              dataTooltipId="targetInfo"
              className="cursor-help"
              size={20}
              fill="#eee"
            />
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
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
              onKeyDown={(event) => {
                const updown = Math.floor(
                  dropdownRef.current!.offsetWidth / 200
                );
                const keyValue: { [key: string]: number } = {
                  ArrowLeft: -1,
                  ArrowUp: -updown,
                  ArrowRight: 1,
                  ArrowDown: updown,
                };
                if (keyValue[event.key]) {
                  event.preventDefault();
                  // scrollTop, next, updown을 사용해 커버 가능한 영역을 계산해서 벗어나면 옮기기
                  setDropdownSelector((e: number) => {
                    const tmpDropdownSelector = e + keyValue[event.key];
                    let next: number;
                    if (tmpDropdownSelector < 0) {
                      next = 0;
                    } else if (
                      tmpDropdownSelector >= engraveSearchList.length
                    ) {
                      next = engraveSearchList.length - 1;
                    } else {
                      next = tmpDropdownSelector;
                    }
                    if (dropdownRef.current!.clientHeight >= 400) {
                      const line = Math.floor(next / updown);
                      const startLine = Math.ceil(
                        dropdownRef.current!.scrollTop / 50
                      );
                      const lastLine =
                        Math.floor(dropdownRef.current!.scrollTop / 50) + 7;
                      // console.log(line, startLine, lastLine);
                      if (line > lastLine || line < startLine) {
                        if (keyValue[event.key] < 0)
                          dropdownRef.current!.scrollTop = line * 50;
                        else dropdownRef.current!.scrollTop = (line - 7) * 50;
                      }
                    }
                    return next;
                  });
                } else if (event.key === "Enter") {
                  check(engraveSearchList[dropdownSelector], 0);
                } else if (event.key === "Escape") {
                  event.currentTarget.blur();
                }
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
                <ul
                  className={`${styles.dropdownList} hideScroll`}
                  ref={dropdownRef}
                >
                  {engraveSearchList.length ? (
                    engraveSearchList.map((e: string, i: number) => {
                      return (
                        <li
                          className={styles.dropdownListItem}
                          onClick={() => {
                            check(e, 0);
                            targetEngraveRef.current?.select();
                          }}
                          key={`all_engrave_${e}`}
                          data-selected={i === dropdownSelector}
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
                      <p>일치하는 각인이 없습니다.</p>
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
                      Lv. <span className={styles.levelSpan}>{e.level}</span>
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
                        className={styles.emptySlotImg}
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
        <div className={styles.equipEngraveDiv}>
          <h4 className={styles.equipTitle}>
            <img
              src="/images/engraveBook.png"
              className="inline mr-2"
              width={30}
              alt="전각이미지"
            />
            <p>장착 각인서</p>
            <Info
              dataTooltipId="engraveBookInfo"
              className="cursor-help"
              size={20}
              fill="#eee"
            />
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
                          {equipList[0]?.name === e.name &&
                          equipList[1]?.name === e.name
                            ? "1 | 2"
                            : equipList.findIndex(
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
          <ul className={styles.equipList}>
            {equipList.length ? (
              <>
                {equipList.map((e: EngraveInfo, i: number) => {
                  return (
                    <li
                      className={styles.equipListItem}
                      key={`selected_engrave_${e.name}_${i}`}
                    >
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
                      <p className={styles.equipListItemTitle}>{e.name}</p>
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
                          className={styles.deleteIcon}
                          size={22}
                          width={2}
                          color="#aaa"
                          onClick={() => {
                            const tmp = JSON.parse(JSON.stringify(equipList));
                            tmp.splice(i, 1);
                            setEquipList(tmp);
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
                {equipList.length === 1 ? (
                  <li className={styles.equipListItem}></li>
                ) : (
                  ""
                )}
              </>
            ) : (
              <li className={styles.emptyListItem}>
                <div>
                  <div className={styles.emptyListItemIconDiv}>
                    <MenuIcons
                      className={styles.emptyListItemIcon}
                      size={100}
                      width={1.3}
                      type={1}
                    />
                  </div>
                  <p>장착된 각인이 없습니다.</p>
                </div>
              </li>
            )}
          </ul>
          <h4 className={styles.equipTitle}>
            <img
              src="/images/abilityStone.png"
              className="inline mr-2"
              width={30}
              alt="전각이미지"
            />
            <p>어빌리티 스톤</p>
            <Info
              dataTooltipId="abilityStoneInfo"
              className="cursor-help"
              size={20}
              fill="#eee"
            />
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

          <ul className={styles.equipList}>
            {abilityList.length ? (
              <>
                {abilityList.map((e: EngraveInfo, i: number) => {
                  return (
                    <li
                      className={styles.equipListItem}
                      key={`selected_engrave_${e.name}`}
                    >
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
                      <p className={styles.equipListItemTitle}>{e.name}</p>
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
                            <p className={styles.equipAbilityP}>+{e.point}</p>
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
                    </li>
                  );
                })}
                <li className={styles.equipListItem}>
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
                  <div>
                    <MySelect
                      title={negativeEngrave.name}
                      data={NEGATIVE_ENGRAVES}
                      width={115}
                      height={30}
                      place="bottom"
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
                  </div>
                  <div>
                    <div
                      className={`${styles.equipListItemButtons} ${styles.negativeItemButtons}`}
                    >
                      {negativeEngrave.enableInput ? (
                        <div className={styles.equipAbilityInputDiv}>
                          <p className={styles.inputArea}>
                            +
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
                            +{negativeEngrave.point}
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
                            <div className={styles.updownButtonDiv}>
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
                  </div>
                </li>
              </>
            ) : (
              <li className={styles.emptyListItem}>
                <div>
                  <div className={styles.emptyListItemIconDiv}>
                    <MenuIcons
                      className={styles.emptyListItemIcon}
                      size={100}
                      width={1.3}
                      type={1}
                    />
                  </div>
                  <p>어빌리티 스톤 정보가 없습니다.</p>
                </div>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.targetAccessoryDiv}>
          <h4>
            <Ring size={30} />
            악세서리 설정
            <Info
              dataTooltipId="targetAccessoryInfo"
              className="cursor-help"
              size={20}
              fill="#eee"
            />
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
                              onFocus={(event) => {
                                event.target.select();
                              }}
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
                        <h5>특성</h5>
                        <MySelect
                          width={70}
                          height={30}
                          title={e.stat1.type}
                          place="bottom"
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
                    {/* <td className={styles.accessoryTableCol4}>
                      {e.type === 0 ? (
                        <div className={styles.colBlock}>
                          <h5>특성2</h5>
                          <MySelect
                            width={70}
                            height={30}
                            title={e.stat2.type}
                            place="bottom"
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
                    </td> */}
                    {/* <td className={styles.accessoryTableCol5}>
                      <div className={styles.colBlock}>
                        <h5>보유중</h5>
                        <p>미구현</p>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.searchFooter}>
        <div className={styles.filterWrapper}>
          <h4 className={styles.filterHeader}>
            <Filter color="#ccc" size={24} />
            <span>필터</span>
          </h4>
          <div className={styles.filterDescr}>
            <p>🔹 "검색" 사용 시 자동 적용됩니다.</p>
            <p>
              🔹 "검색 결과 필터링" 버튼을 통해, 검색 후 결과에 따로 적용
              가능합니다.
            </p>
          </div>
          <div className={styles.searchFilterSetting}>
            <div className={styles.statFilter}>
              {Object.keys(statFilterValue).map((e) => {
                return (
                  <div className={styles.filterDiv} key={`filter_${e}`}>
                    <label>
                      <input
                        type="number"
                        value={statFilterValue[e]}
                        max={1500}
                        min={0}
                        onFocus={(event) => {
                          event.target.select();
                        }}
                        onChange={(event) => {
                          let stat_tmp = parseInt(event.target.value);
                          stat_tmp = stat_tmp
                            ? stat_tmp > 1500
                              ? 1500
                              : stat_tmp < 0
                              ? 0
                              : stat_tmp
                            : 0;
                          setStatFilterValue({
                            ...statFilterValue,
                            [e]: stat_tmp,
                          });
                        }}
                      />
                      <div className={styles.borderDiv}>
                        <p className={styles.filterTitle}>{e}</p>{" "}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className={styles.otherFilter}>
              <div className={styles.filterDivInputNumber}>
                <label>
                  <input
                    type="number"
                    value={otherFilterValue["거래 가능 횟수"]}
                    max={2}
                    min={0}
                    onFocus={(event) => {
                      event.target.select();
                    }}
                    onChange={(event) => {
                      let count = parseInt(event.target.value);
                      count = count
                        ? count > 2
                          ? 2
                          : count < 0
                          ? 0
                          : count
                        : 0;
                      setOtherFilterValue({
                        ...otherFilterValue,
                        "거래 가능 횟수": count,
                      });
                    }}
                  />
                  <div className={styles.borderDiv}>
                    <p className={styles.filterTitle}>구매 후 거래 가능 횟수</p>
                    <p className={styles.filterSubtitle}>회 이상</p>
                  </div>
                </label>
              </div>
              <div className={styles.filterDivInputRadio}>
                <p>악세서리 등급</p>
                <div className={styles.radioWrapper}>
                  {["고대", "유물", "고대+유물"].map((e, i) => {
                    return (
                      <label
                        key={`accessory_grade_radio_${i}`}
                        className={styles.radioLabel}
                        data-checked={i === otherFilterValue["악세서리 등급"]}
                      >
                        <input
                          className="hidden"
                          type="radio"
                          value={i}
                          name="accessoryGradeRadio"
                          checked={i === otherFilterValue["악세서리 등급"]}
                          onChange={(event) => {
                            setOtherFilterValue({
                              ...otherFilterValue,
                              "악세서리 등급": parseInt(event.target.value),
                            });
                          }}
                        />
                        <span className={styles.radioLabelSpan}>{e}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div
                className={styles.filterDivInputNumber}
                data-disabled={otherFilterValue["악세서리 등급"] !== 2}
              >
                <label>
                  <input
                    type="number"
                    value={otherFilterValue["고대등급 악세서리 개수"]}
                    max={5}
                    min={0}
                    onFocus={(event) => {
                      event.target.select();
                    }}
                    onChange={(event) => {
                      let count = parseInt(event.target.value);
                      count = count
                        ? count > 5
                          ? 5
                          : count < 1
                          ? 1
                          : count
                        : 1;
                      setOtherFilterValue({
                        ...otherFilterValue,
                        "고대등급 악세서리 개수": count,
                      });
                    }}
                    disabled={otherFilterValue["악세서리 등급"] !== 2}
                  />
                  <div className={styles.borderDiv}>
                    <p className={styles.filterTitle}>고대등급 악세서리 개수</p>
                    <p className={styles.filterSubtitle}>개 이상</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.searchButtons}>
          <button
            className="myButtons"
            onClick={() => {
              searchSetting();
            }}
            disabled={usingWebWorker[0]}
          >
            <Search color="#ccc" size={20} />
            <span>검색</span>
          </button>

          <button
            className="myButtons"
            onClick={() => {
              applyFilter();
            }}
            disabled={usingWebWorker[0]}
          >
            <Filter color="#ccc" size={24} />
            <span>검색 결과 필터링</span>
          </button>
        </div>
      </div>
      <Tooltip
        id="apiKeySettingInfo"
        place="bottom"
        clickable={true}
        delayHide={10}
      >
        <p>🔹 API Key 발급 방법 안내페이지를 새 창으로 엽니다.</p>
      </Tooltip>
      <Tooltip id="targetInfo" place="bottom" clickable={true} delayHide={10}>
        <p>🔹 아래 "검색창"을 클릭하면 선택 가능한 각인 목록이 출력됩니다.</p>
        <p>🔹 "검색창"에 각인명을 입력하여 목록을 필터링 할 수 있습니다.</p>
        <p>🔹 사용하고 싶은 각인을 클릭하여 등록할 수 있습니다.</p>
        <p>🔹 4개 이상의 각인을 등록해야 합니다.</p>
      </Tooltip>
      <Tooltip
        id="engraveBookInfo"
        place="bottom"
        clickable={true}
        delayHide={10}
      >
        <p>🔹 본인의 캐릭터가 장착중인 각인서 정보를 똑같이 세팅합니다.</p>
        <p>🔹 아래 "각인 선택"을 클릭하여 목표 각인 중 2개를 등록합니다.</p>
        <p>🔹 "+" 버튼과 "-" 버튼을 통해 각인서 레벨을 설정 가능합니다.</p>
        <p className="flex gap-1">
          <span>🔹</span>
          <span>
            동일 각인이 장착 가능하기 때문에,
            <br />
            <span className="text-red-300">
              설계상 각인 선택 창에서는 각인 제거가 불가능합니다.
            </span>
          </span>
        </p>
      </Tooltip>
      <Tooltip
        id="abilityStoneInfo"
        place="bottom"
        clickable={true}
        delayHide={10}
      >
        <p>
          🔹 본인의 캐릭터가 장착중인 어빌리티 스톤 정보를 똑같이 세팅합니다.
        </p>
        <p>🔹 아래 "각인 선택"을 클릭하여 목표 각인 중 2개를 등록합니다.</p>
        <p>🔹 "+" 버튼과 "-" 버튼을 통해 각인 수치를 수정 가능합니다.</p>
        <p>🔹 "+", "-" 버튼의 왼쪽에 위치한 버튼으로 직접 입력도 가능합니다.</p>
      </Tooltip>
      <Tooltip
        id="targetAccessoryInfo"
        place="bottom"
        clickable={true}
        delayHide={10}
      >
        <p>🔹 각인 세팅에 사용하고 싶은 악세서리의 정보를 등록합니다.</p>
        <p>🔹 품질은 직접 0 ~ 100 의 값을 입력할 수 있습니다.</p>
        <p>🔹 특성(전투특성)의 종류는 클릭하여 선택이 가능합니다.</p>
        <p>
          🔹 목걸이의 경우 2개의 특성을 선택해야하고, 중복 특성은 불가능합니다.
        </p>
      </Tooltip>
    </div>
  );
};

export default EngraveSearchBlock;
