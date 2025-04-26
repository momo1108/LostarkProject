import styles from "@/styles/accessory/Body.module.scss";
import { engravingIconMap } from "@/types/GlobalType";
import {
  ButtonHTMLAttributes,
  cloneElement,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  ACCESSORY_GRINDINGEFFECT_MAP,
  AccessoryCategory,
  AccessoryInfo,
  ACCESSORY_CATEGORY_CODES,
  EngraveInfo,
  GRINDING_EFFECT_VALUE_MAP,
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
  Copy,
} from "@/components/icons/Index";
import { Tooltip } from "react-tooltip";
import ApiKeyInput from "@/components/ApiKeyInput";
import EngraveSaveModal from "@/components/modal/EngraveSaveModal";
import EngraveLoadModal from "@/components/modal/EngraveLoadModal";
import EngraveCopyModal from "@/components/modal/EngraveCopyModal";
import useAlert from "@/hooks/useAlert";
import { ModalProps } from "@/types/ModalType";
import { IconProps } from "@/types/CustomType";
import {
  useAccessorySearchActionContext,
  useAccessorySearchSelectorContext,
  useAccessorySearchStaticContext,
} from "@/contexts/accessory/AccessorySearchContext";

const ModalWrapper: React.FC<{
  Modal: React.FC<ModalProps>;
  Button: React.ReactElement;
}> = ({ Modal, Button }) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        closeFunc={() => {
          setModalIsOpen(false);
        }}
      />
      {cloneElement(Button, { onClick: () => setModalIsOpen(true) })}
    </>
  );
};

const ApiKeyInputWrapper: React.FC = () => {
  const [isShining, setIsShining] = useState<boolean>(false);
  return <ApiKeyInput isShining={isShining} />;
};

// const EngraveInputWithDropdown: React.FC = () => {
//   const [isFocused, setIsFocused] = useState<boolean>(false);
//   const [preventBlur, setPreventBlur] = useState<boolean>(false);
//   return (
//     <div
//       className={styles.targetSearchDiv}
//       onFocus={() => {
//         setIsFocused(true);
//       }}
//       onBlur={() => {
//         if (preventBlur) {
//           setPreventBlur(false);
//           return;
//         }
//         setIsFocused(false);
//       }}
//       tabIndex={0}
//     >
//       <MenuIcons
//         className={`${styles.engraveIcon} ${
//           isFocused ? styles.activeIcon : ""
//         }`}
//         type={1}
//         size={23}
//         width={1}
//       />
//       <input
//         className={`${styles.targetSearchInput} ${
//           isFocused ? styles.focused : ""
//         }`}
//         type="text"
//         placeholder="각인 검색"
//         ref={targetEngraveRef}
//         value={searchValue}
//         onMouseDown={() => setPreventBlur(true)}
//         onMouseUp={() => setPreventBlur(false)}
//         onChange={(event) => {
//           setSearchValue(event.target.value);
//         }}
//         onKeyDown={(event) => {
//           const updown = Math.floor(dropdownRef.current!.offsetWidth / 200);
//           const keyValue: { [key: string]: number } = {
//             ArrowLeft: -1,
//             ArrowUp: -updown,
//             ArrowRight: 1,
//             ArrowDown: updown,
//           };
//           if (keyValue[event.key]) {
//             event.preventDefault();
//             // scrollTop, next, updown을 사용해 커버 가능한 영역을 계산해서 벗어나면 옮기기
//             setDropdownSelector((e: number) => {
//               const tmpDropdownSelector = e + keyValue[event.key];
//               let next: number;
//               if (tmpDropdownSelector < 0) {
//                 next = 0;
//               } else if (tmpDropdownSelector >= engraveSearchList.length) {
//                 next = engraveSearchList.length - 1;
//               } else {
//                 next = tmpDropdownSelector;
//               }
//               if (dropdownRef.current!.clientHeight >= 400) {
//                 const line = Math.floor(next / updown);
//                 const startLine = Math.ceil(
//                   dropdownRef.current!.scrollTop / 50
//                 );
//                 const lastLine =
//                   Math.floor(dropdownRef.current!.scrollTop / 50) + 7;
//                 // console.log(line, startLine, lastLine);
//                 if (line > lastLine || line < startLine) {
//                   if (keyValue[event.key] < 0)
//                     dropdownRef.current!.scrollTop = line * 50;
//                   else dropdownRef.current!.scrollTop = (line - 7) * 50;
//                 }
//               }
//               return next;
//             });
//           } else if (event.key === "Enter") {
//             check(engraveSearchList[dropdownSelector], 0);
//           } else if (event.key === "Escape") {
//             event.currentTarget.blur();
//           }
//         }}
//       />
//       <div
//         className={`${styles.dropdownWrapper}${
//           dropdownMode === 0 ? " flex" : " hidden"
//         }`}
//         onMouseDown={() => setPreventBlur(true)}
//         onMouseUp={() => setPreventBlur(false)}
//         data-dropdown-order={0}
//       >
//         <div className={styles.dropdown}>
//           <h5 className={styles.dropdownHeader}>
//             <span>각인 목록</span>
//             <Close
//               size={20}
//               width={3}
//               color="#ccc"
//               onClick={() => {
//                 setDropdownMode(3);
//               }}
//             />
//           </h5>
//           <ul className={`${styles.dropdownList} hideScroll`} ref={dropdownRef}>
//             {engraveSearchList.length ? (
//               engraveSearchList.map((e: string, i: number) => {
//                 return (
//                   <li
//                     className={styles.dropdownListItem}
//                     onClick={() => {
//                       check(e, 0);
//                       targetEngraveRef.current?.select();
//                     }}
//                     key={`all_engrave_${e}`}
//                     data-selected={i === dropdownSelector}
//                   >
//                     <img
//                       width={30}
//                       src={`/images/${engravingIconMap[e]}`}
//                       alt=""
//                     />
//                     <p>{e}</p>
//                     <div
//                       className={`${styles.selectedItem} ${
//                         targetList.find((e2: EngraveInfo) => e2.name === e)
//                           ? "opacity-100"
//                           : "opacity-0"
//                       }`}
//                     >
//                       목표 각인{" "}
//                       {targetList.findIndex(
//                         (e2: EngraveInfo) => e2.name === e
//                       ) + 1}
//                     </div>
//                   </li>
//                 );
//               })
//             ) : (
//               <li className={styles.emptyDropdownListItem}>
//                 <p>일치하는 각인이 없습니다.</p>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SelectedEngraveList: React.FC = () => {
//   return (
//     <ul className={styles.targetList}>
//       {targetList.length ? (
//         targetList.map((e: EngraveInfo, i: number) => {
//           return (
//             <li
//               className={styles.targetListItem}
//               key={`selected_engrave_${e.name}`}
//             >
//               <p className={styles.targetListItemTitle}>
//                 {e.name}
//                 <br />
//                 Lv. <span className={styles.levelSpan}>{e.level}</span>
//               </p>
//               <div className={styles.engraveImgSlot}>
//                 <div className={styles.engraveImg}>
//                   <img
//                     width={"100%"}
//                     src={`/images/${engravingIconMap[e.name]}`}
//                     alt=""
//                   />
//                 </div>
//                 <img
//                   className={styles.emptySlotImg}
//                   src="/images/engrave_slot.png"
//                   alt="emptyslot"
//                 />
//               </div>
//               <ol className={styles.engraveLevelList}>
//                 {[1, 2, 3].map((level) => {
//                   return (
//                     <li
//                       key={`engrave_${e.name}_level_${level}`}
//                       className={
//                         e.level === level
//                           ? `${engraveLevelColorMap[level]}BgColor ${engraveLevelColorMap[level]}BorderColor`
//                           : `${engraveLevelColorMap[level]}Color ${engraveLevelColorMap[level]}BorderColor`
//                       }
//                       onClick={() => {
//                         setTargetEngraveLevel(i, level);
//                       }}
//                     >
//                       {level}
//                     </li>
//                   );
//                 })}
//               </ol>
//               <Delete
//                 size={22}
//                 width={2}
//                 color="#aaa"
//                 onClick={() => {
//                   const tmp = JSON.parse(JSON.stringify(targetList));
//                   tmp.splice(i, 1);
//                   setTargetList(tmp);
//                 }}
//               />
//             </li>
//           );
//         })
//       ) : (
//         <li data-empty-type="1" className={styles.emptyListItem}>
//           <div className={styles.emptyListItemIconDiv}>
//             <MenuIcons
//               className={styles.emptyListItemIcon}
//               size={100}
//               width={1.3}
//               type={1}
//             />
//           </div>
//           <p>선택된 목표 각인이 없습니다.</p>
//         </li>
//       )}
//     </ul>
//   );
// };

// const TargetEngraveBox: React.FC = () => {
//   return (
//     <div className={styles.targetEngraveDiv}>
//       <h4 className={styles.targetTitle}>
//         <Target size={30} />
//         목표 각인
//         <Info
//           dataTooltipId="targetInfo"
//           className="cursor-help"
//           size={20}
//           fill="#eee"
//         />
//       </h4>
//     </div>
//   );
// };

const AccessoryCategorySettingDiv: React.FC<IndexProp> = ({ index }) => {
  const { accessorySearchOptionArrayRef } = useAccessorySearchStaticContext();
  const [selectedAccessoryCategory, setSelectedAccessoryCategory] =
    useState<AccessoryCategory>(
      accessorySearchOptionArrayRef.current[index].accessoryCategory
    );

  const options = ["목걸이", "귀걸이", "반지"].map((category) => ({
    label: category,
    value: ACCESSORY_CATEGORY_CODES[category as AccessoryCategory],
  }));
  const onSelect = (option: (typeof options)[0]) => {};
  const defaultOptionIndex = {
    목걸이: 0,
    귀걸이: 1,
    반지: 2,
  };

  return (
    <div className={styles.accessoryIcon}>
      {selectedAccessoryCategory === "목걸이" ? (
        <Necklace size={32} fill="#fff" />
      ) : selectedAccessoryCategory === "귀걸이" ? (
        <Earring size={32} />
      ) : (
        <Ring size={32} />
      )}
      <MySelect
        defaultSelectedIndex={defaultOptionIndex[selectedAccessoryCategory]}
        options={options}
        onSelect={onSelect}
      />
    </div>
  );
};

const TierSettingList: React.FC<React.HTMLAttributes<HTMLOListElement>> = ({
  className,
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(3);
  const handleClick = useCallback((tier: number) => {
    setSelectedTier(tier);
  }, []);

  return (
    <ol className={styles.tierList}>
      {[3, 4].map((tier) => (
        <li key={`tier_${tier}`} onClick={() => {}}>
          <button
            className={tier === selectedTier ? "bg-white text-[#333]" : ""}
            onClick={() => handleClick(tier)}
          >
            {tier}
          </button>
        </li>
      ))}
    </ol>
  );
};

const GradeSettingList: React.FC<React.HTMLAttributes<HTMLOListElement>> = ({
  className,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("유물");
  const handleClick = useCallback((grade: string) => {
    setSelectedGrade(grade);
  }, []);

  return (
    <ol className={styles.gradeList}>
      {["유물", "고대"].map((grade) => (
        <li key={`tier_${grade}`} onClick={() => {}}>
          <button
            className={grade === selectedGrade ? "bg-white text-[#333]" : ""}
            onClick={() => handleClick(grade)}
          >
            {grade}
          </button>
        </li>
      ))}
    </ol>
  );
};

type IndexProp = {
  index: number;
};

const GrindingSettingDiv: React.FC<IndexProp> = ({ index }) => {
  const { accessorySearchOptionArrayRef } = useAccessorySearchStaticContext();
  const grindingEffects = ACCESSORY_GRINDINGEFFECT_MAP["목걸이"];
  const optionsArray = grindingEffects.map((grindingEffect) => ({
    label: grindingEffect,
    value: GRINDING_EFFECT_VALUE_MAP[grindingEffect],
  }));
  const [selectedGrindingValue, setSelectedGrindingValue] = useState<number>(
    optionsArray[0].value
  );
  const handleSelect = useCallback(
    (option: { label: string; value: number }) => {
      accessorySearchOptionArrayRef.current[index].grindingEffectOptionValue =
        option.value;
    },
    []
  );

  return (
    <div className={styles.grindingDiv}>
      <MySelect
        className={styles.grindingOptionSelect}
        height={40}
        placeholder={`${accessorySearchOptionArrayRef.current[index].accessoryCategory} 연마 옵션`}
        options={optionsArray}
        onSelect={handleSelect}
      />
      {/* handleSelect 로 전체 악세서리 검색 세팅 정보를 업데이트 하도록 하고,
       여기에는 MySelect 로 선택된 연마정보에 따른 Value 들을 선택할 수 있게 구현  */}
    </div>
  );
};

const AccessorySearchOptionList: React.FC = () => {
  const { accessorySearchOptionArray } = useAccessorySearchSelectorContext();

  return (
    <ul>
      {accessorySearchOptionArray.map((option, optionIndex) => {
        return (
          // 초기 로딩시에 skeleton 출력하도록 수정하자.(초기에 컨텍스트가 초기화되기까지 MySelect 의 텍스트가 비어있음음)
          <li
            className={styles.singleAccessoryDiv}
            key={`${option.accessoryCategory}_${optionIndex}`}
          >
            <AccessoryCategorySettingDiv index={optionIndex} />
            <div className={styles.settingDiv}>
              <div className={styles.tierGradeDiv}>
                <TierSettingList />
                <GradeSettingList />
              </div>
              <GrindingSettingDiv index={optionIndex} />
              {/* <ol className={styles.engraveLevelList}>
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
              </ol> */}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const AccessorySearchContainer: React.FC = () => {
  const alert = useAlert();

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <ApiKeyInputWrapper />
        <div className={styles.presetDiv}>
          {/* <ModalWrapper
            Modal={EngraveLoadModal}
            Button={
              <button>
                <Save size={20} fill="#eee" />
                <span>캐릭터 세팅 복사</span>
              </button>
            }
          />
          <ModalWrapper
            Modal={EngraveSaveModal}
            Button={
              <button>
                <Load size={20} color="#ccc" />
                <span>불러오기</span>
              </button>
            }
          />
          <ModalWrapper
            Modal={EngraveSaveModal}
            Button={
              <button>
                <Copy size={20} fill="#eee" />
                <span>캐릭터 세팅 복사</span>
              </button>
            }
          /> */}
        </div>
      </div>
      <div className={styles.searchBody}>
        <div className={styles.accessoryOptionDiv}>
          <h4>
            <Filter color="#ccc" size={24} />
            <span>옵션 설정</span>
          </h4>
          <AccessorySearchOptionList />
        </div>
      </div>
      {/* <div className={styles.searchFooter}>
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
      </div> */}
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

export default AccessorySearchContainer;
