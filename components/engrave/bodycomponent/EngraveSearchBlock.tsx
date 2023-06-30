import styles from "@/styles/engrave/Body.module.scss";
import { engravingIconMap } from "@/types/TEGCType";
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import {
  AbilityInputMode,
  AccessoryInfo,
  AuctionItem,
  CASES,
  CheckMode,
  Combination,
  DropdownMode,
  ENGRAVES,
  EngraveInfo,
  EtcOption,
  NEGATIVE_ENGRAVES,
  engraveLevelColorMap,
} from "@/types/EngraveType";
import MySelect from "@/components/custom/MySelect";
import EngraveService from "@/service/EngraveService";
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
import {
  CATEGORY_CODE,
  ETC_OPTION_CODE,
  apiEngravePriority,
  testResult,
} from "@/types/GlobalType";
import { Tooltip } from "react-tooltip";

type EngraveSearchBlockProps = {
  setCombinationList: Dispatch<SetStateAction<AuctionItem[][]>>;
  setPageStatus: Dispatch<SetStateAction<number>>;
  setProgress: Dispatch<SetStateAction<number>>;
  setTotalCases: Dispatch<SetStateAction<number>>;
  setCurrentCase: Dispatch<SetStateAction<number>>;
  setMyTimer: Dispatch<SetStateAction<number>>;
};
const EngraveSearchBlock: React.FC<EngraveSearchBlockProps> = ({
  setCombinationList,
  setPageStatus,
  setProgress,
  setTotalCases,
  setCurrentCase,
  setMyTimer,
}) => {
  const answer: Combination[] = [];
  const tmp: number[][] = [];
  const [myWorker, setMyWorker] = useState<Worker>();
  useEffect(() => {
    setApiKey(localStorage.getItem("loapleEngraveApiKey") || "");
    const timer = setInterval(() => {
      setMyTimer((e) => e - 1);
    }, 1000);

    setMyWorker(
      new Worker(new URL("@/web_workers/worker.ts", import.meta.url))
    );

    return () => {
      myWorker?.terminate();
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (myWorker)
      myWorker.onmessage = (e) => {
        if (e.data.type === 0) setProgress(e.data.data);
        else {
          console.log(e.data);
          const { availableArray, infoObject } = e.data.data;

          setCombinationList(
            availableArray.map((e: number[][]) => {
              return e
                .slice(0, 5)
                .map((e2: number[]) => infoObject[e2[1]][e2[0]]);
            })
          );
          setTimeout(() => {
            setPageStatus(1);
          }, 1000);
        }
      };
  }, [myWorker]);
  const [apiKey, setApiKey] = useState<string>("");
  const [editApiKey, setEditApiKey] = useState<boolean>(false);
  const apiKeyRef = useRef<HTMLInputElement>(null);
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
  const [resultObject, setResultObject] = useState<{
    [key: number]: AuctionItem[];
  }>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  });

  const [statFilterValue, setStatFilterValue] = useState<{
    [key: string]: number;
  }>({
    치명: 0,
    특화: 0,
    신속: 0,
    제압: 0,
    인내: 0,
    숙련: 0,
  });
  const [otherFilterValue, setOtherFilterValue] = useState<{
    [key: string]: number;
  }>({
    "거래 가능 횟수": 0,
  });
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
        <div className={editApiKey ? styles.apiDiv : "hidden"}>
          <label>
            <input
              className={styles.apiKeyInput}
              type="text"
              spellCheck="false"
              ref={apiKeyRef}
              required
            />
            <div className={styles.placeholder}>API 키 입력</div>
          </label>
          <div className="flex gap-1 items-center">
            <button
              className="myButtons"
              onClick={() => {
                setApiKey(apiKeyRef!.current!.value);
                setEditApiKey(false);
                localStorage.setItem(
                  "loapleEngraveApiKey",
                  apiKeyRef!.current!.value
                );
              }}
            >
              <Check size={16} color="#fff" />
            </button>
            <button
              className="myButtons"
              onClick={() => {
                apiKeyRef!.current!.value = apiKey;
                setEditApiKey(false);
              }}
            >
              <MenuIcons type={3} color="#fff" size={16} />
            </button>
          </div>
        </div>
        <div className={editApiKey ? "hidden" : styles.apiDiv}>
          <div
            className={styles.apiKeyDiv}
            data-valid={apiKey ? "true" : "false"}
          >
            {apiKey ? apiKey : "API Key 가 없습니다."}
          </div>
          <div className="flex gap-1">
            <button
              className="myButtons"
              data-px="2"
              onClick={() => {
                apiKeyRef!.current!.value = apiKey;
                setEditApiKey(true);
              }}
            >
              <Edit size={16} />
              <span>{apiKey ? "재등록" : "등록"}</span>
            </button>
            <a
              data-tooltip-id="apiKeySettingInfo"
              className="myButtons"
              target="_blank"
              href={
                process.env.NODE_ENV === "development"
                  ? "http://localhost:3000/info/apikey"
                  : "http://loaple.com/info/apikey"
              }
              rel="noopener noreferrer"
            >
              <Info size={16} fill="#eee" />
              <span>등록방법</span>
            </a>
          </div>
          <p className={styles.apiDescr}>
            ★ 서비스 사용을 위해서 반드시 API Key를 등록해주세요.
          </p>
        </div>
        <div className={styles.presetDiv}>
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
      </div>
      <div className={styles.searchBody}>
        <div className={`${styles.targetEngraveDiv} ${styles.bodyBoxShadow}`}>
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
                            targetEngraveRef.current?.select();
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
              <div className={styles.filterDiv}>
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
            </div>
          </div>
        </div>
        <div className={styles.searchButtons}>
          <button
            className="myButtons"
            onClick={() => {
              searchSetting();
            }}
          >
            <Search color="#ccc" size={20} />
            <span>검색</span>
          </button>

          <button
            className="myButtons"
            onClick={() => {
              applyFilter();
            }}
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
        <p>🔹 API Key 발급 방법 안내페이지를 새 창에 엽니다.</p>
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
              각인 목록 창에서는 각인 제거가 불가능합니다.
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

  function check(name: string, mode: CheckMode) {
    if (mode === 0) {
      const index = targetList.findIndex((e: EngraveInfo) => e.name === name);
      if (index > -1)
        setTargetList(targetList.filter((e: EngraveInfo) => e.name !== name));
      else setTargetList([...targetList, { name, level: 3 }]);
    } else if (mode === 1) {
      if (equipList.length >= 2) {
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
    if (targetList.length < 4) {
      alert("각인을 4개 이상 설정해주세요.");
      return;
    } else if (equipList.length < 2) {
      alert("장착 각인서를 2개 이상 설정해주세요.");
      return;
    } else if (abilityList.length < 2) {
      alert("어빌리티 스톤의 각인을 2개 이상 설정해주세요.");
      return;
    } else if (negativeEngrave.name === "감소 효과 선택") {
      alert("어빌리티 스톤의 감소 각인을 설정해주세요.");
      return;
    }
    setProgress(0);
    setCurrentCase(0);
    setPageStatus(2);
    let tmp_resultObject: { [key: number]: AuctionItem[] } = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    };

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

    const ear_diff: boolean =
      accessoryList.getter[1].stat1.type !== accessoryList.getter[2].stat1.type;
    const ring_diff: boolean =
      accessoryList.getter[3].stat1.type !== accessoryList.getter[4].stat1.type;

    // console.log(tmp_info);
    // console.log(accessoryList);
    // console.log(answer);

    // 가능한 각인 조합의 중복을 제거할 Set
    const mySet = new Set<string>();
    answer.forEach((e) => {
      e.data.forEach((e2) => {
        mySet.add(e2.join(""));
      });
    });

    // 유니크한 각인값정보를 배열에 저장한다.
    const uniqueEngrave: [string, number, string, number][] = [];
    let tmpSplit: number[];
    mySet.forEach((e) => {
      tmpSplit = e.split("").map((e2) => parseInt(e2));
      uniqueEngrave.push([
        tmpSplit[0] === 9 ? "ANY" : tmp_info[tmpSplit[0]].name,
        tmpSplit[1],
        tmpSplit[2] === 9 ? "ANY" : tmp_info[tmpSplit[2]].name,
        tmpSplit[3],
      ]);
    });
    // console.log(uniqueEngrave);
    if (!uniqueEngrave.length) {
      setPageStatus(1);
      alert("불가능한 목표 각인입니다.");
      return;
    }

    /* 
    유니크 각인 정보들을 악세서리 각 부위에 적용해 검색한다.
    따라서 총 api request는 각인 정보 수 * 악세서리부위 만큼이다.
    단, 여기서 귀걸이와 반지는 2개씩 검색하지만, 
    귀걸이 쌍 혹은 반지 쌍의 전투 특성이 같은 경우 하나로 취급해 검색한다.
    따라서 귀걸이 쌍의 특성이 같으면 부위수는 4
    반지 쌍의 특성이 같으면 부위수는 4
    귀걸이와 반지 쌍의 특성이 같으면 부위수는 3으로 취급한다.
    */
    // 각인 조합 반복문
    let single_res;
    setTotalCases(uniqueEngrave.length * (ear_diff ? (ring_diff ? 5 : 4) : 3));

    // let tmp_resultObject: { [key: number]: AuctionItem[] } = testResult;

    let errorArray = [];

    // 고유 각인 반복
    for (let u = 0; u < uniqueEngrave.length; u++) {
      // 악세서리 부위(accessory part) 반복
      for (let ap = 0; ap < 5; ap++) {
        if ((ap === 2 && !ear_diff) || (ap === 4 && !ring_diff)) continue;
        while (true) {
          try {
            // console.log(u, ap);
            single_res = await EngraveService.getAuctionItems({
              CategoryCode: CATEGORY_CODE[accessoryList.getter[ap].type],
              EtcOptions: [
                ...(accessoryList.getter[ap].type === 0
                  ? [
                      {
                        FirstOption: ETC_OPTION_CODE["전투 특성"],
                        SecondOption:
                          ETC_OPTION_CODE[accessoryList.getter[ap].stat1.type],
                      },
                      {
                        FirstOption: ETC_OPTION_CODE["전투 특성"],
                        SecondOption:
                          ETC_OPTION_CODE[accessoryList.getter[ap].stat2.type],
                      },
                    ]
                  : [
                      {
                        FirstOption: ETC_OPTION_CODE["전투 특성"],
                        SecondOption:
                          ETC_OPTION_CODE[accessoryList.getter[ap].stat1.type],
                      },
                    ]),
                {
                  FirstOption: ETC_OPTION_CODE["각인 효과"],
                  SecondOption: ETC_OPTION_CODE[uniqueEngrave[u][0]],
                  MinValue: uniqueEngrave[u][1],
                },
                {
                  FirstOption: ETC_OPTION_CODE["각인 효과"],
                  SecondOption: ETC_OPTION_CODE[uniqueEngrave[u][2]],
                  MinValue: uniqueEngrave[u][3],
                },
              ],
              ItemGrade: "고대",
              ItemGradeQuality: accessoryList.getter[ap].quality,
              ItemTier: 3,
              PageNo: 1,
              Sort: "BUY_PRICE",
              SortCondition: "ASC",
            });
            // 해당 악세가 없으면 Items 가 null 로 반환됨
            if (single_res.data.Items)
              tmp_resultObject[ap].push(...single_res.data.Items);
            setCurrentCase((e) => e + 1);
            break;
          } catch (error: any) {
            console.dir(error);
            if (error.response?.status === 429) {
              console.error("검색 횟수를 초과하여 1분간 기다립니다.");
              setMyTimer(62);
              await new Promise((res) => {
                setTimeout(() => {
                  res("done");
                }, 62000);
              });
            } else if (error.response?.status === 503) {
              setPageStatus(1);
              alert(
                "로스트아크 서버의 검색 서비스가 일시적으로 비활성화 됐습니다.\n서버 점검 시간이 아니라면, 잠시 후에 다시 검색해주세요."
              );
              return;
            } else {
              errorArray.push(error);
              if (errorArray.length >= 3) {
                setPageStatus(1);
                console.dir(errorArray);
                alert("로스트아크 서버 상태가 좋지 않아 검색이 취소됩니다.");
                return;
              }
            }
          }
        }
      }
    }

    /* 
     resultObject에서 중복을 제가해줘야 한다.
     최소값 이상의 악세서리를 검색하는 방식이므로,
     3/5 검색과 3/6 검색에서 겹치는 결과가 있을 수 있다.
     다른 수치들도 마찬가지이다.
     api에서 악세서리 경매 id값을 주면 참 좋을텐데.... 
     그런게 없기때문에, 임시방편으로라도 걸러주자.
     Set 자료구조를 활용해 unique 악세정보를 넣고,
     원본 데이터에서 filter와 Set.delete(element) 를 
     사용해 체크해준다.
    */
    const uniqueAccessoryInfo: { [key: number]: Set<string> } = {
      0: new Set(),
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
    };

    [0, 1, 2, 3, 4].map((i) => {
      tmp_resultObject[i] = tmp_resultObject[i]
        .filter((accessory) => accessory.AuctionInfo.BuyPrice)
        .sort((a, b) => a.AuctionInfo.BuyPrice - b.AuctionInfo.BuyPrice);
      tmp_resultObject[i].map((accessory) =>
        uniqueAccessoryInfo[i].add(
          `${accessory.Name}_${accessory.GradeQuality}_${accessory.AuctionInfo.EndDate}`
        )
      );
    });

    [0, 1, 2, 3, 4].map((i) => {
      tmp_resultObject[i] = tmp_resultObject[i].filter((accessory) =>
        uniqueAccessoryInfo[i].delete(
          `${accessory.Name}_${accessory.GradeQuality}_${accessory.AuctionInfo.EndDate}`
        )
      );
    });

    const positiveCounter: { [key: string]: number } = tmp_info.reduce(
      (prev, cur) => ({ ...prev, [cur.name]: cur.point }),
      {}
    );
    const negativeCounter: { [key: string]: number } = {
      "공격력 감소": 0,
      "공격속도 감소": 0,
      "방어력 감소": 0,
      "이동속도 감소": 0,
    };
    negativeCounter[negativeEngrave.name] += negativeEngrave.point || 0;

    setPageStatus(3);
    setResultObject(JSON.parse(JSON.stringify(tmp_resultObject)));
    myWorker?.postMessage({
      data: JSON.parse(
        JSON.stringify({
          infoObject: tmp_resultObject,
          negativeCounter,
          positiveCounter,
        })
      ),
      filter: JSON.parse(
        JSON.stringify({
          stat: statFilterValue,
          others: otherFilterValue,
        })
      ),
    });
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
            cur[2] + (el[0] === 9 ? 1 : 0) + (el[2] === 9 ? 1 : 0),
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
          ...Array(5 - tmp_copy.length).fill([9, 3, 9, 3]),
        ];
        const [sum, max, useless_count]: number[] = data.reduce(
          (cur: number[], el: number[]) => [
            cur[0] + el[1] + el[3],
            Math.max(cur[1], el[1], el[3]),
            cur[2] + (el[0] === 9 ? 1 : 0) + (el[2] === 9 ? 1 : 0),
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
    4. 남은 각인 포인트가 3보다 크고 포인트 차감 시 남은 포인트가 3보다 작아지면 안된다.
    */

    // 2번 가지치기
    if (point_sum > (5 - count) * 9) return;

    let uselessI = false,
      uselessJ = false;

    for (let i = 0; i < input.length; i++) {
      // 3번 가지치기 - 1
      if (input[i].point <= 0 && need_count >= 2) continue;

      // 필요없는 각인의 경우 표기
      if (input[i].point <= 0) uselessI = true;

      for (let j = i + 1; j < input.length; j++) {
        // 3번 가지치기 - 2
        if (input[j].point <= 0) {
          if (need_count >= 2) continue;
          else if (need_count >= 1 && input[i].point <= 0) continue;
          uselessJ = true;
        }

        for (const [case0, case1] of CASES) {
          // 1번 가지치기
          if (case0 > input[i].point && case0 > 3) continue;
          if (case1 > input[j].point && case1 > 3) continue;
          // 4번 가지치기
          // if (3 > input[i].point - case0 && case0 > 3) continue;
          // if (3 > input[j].point - case1 && case1 > 3) continue;
          const minI = Math.min(input[i].point, case0);
          const minJ = Math.min(input[j].point, case1);
          input[i].point -= minI;
          input[j].point -= minJ;
          tmp.push([uselessI ? 9 : i, case0, uselessJ ? 9 : j, case1]);
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

  function applyFilter() {
    setProgress(0);
    setCurrentCase(999);
    setPageStatus(3);

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

    const ear_diff: boolean =
      accessoryList.getter[1].stat1.type !== accessoryList.getter[2].stat1.type;
    const ring_diff: boolean =
      accessoryList.getter[3].stat1.type !== accessoryList.getter[4].stat1.type;

    // 가능한 각인 조합의 중복을 제거할 Set
    const mySet = new Set<string>();
    answer.forEach((e) => {
      e.data.forEach((e2) => {
        mySet.add(e2.join(""));
      });
    });

    const positiveCounter: { [key: string]: number } = tmp_info.reduce(
      (prev, cur) => ({ ...prev, [cur.name]: cur.point }),
      {}
    );

    const negativeCounter: { [key: string]: number } = {
      "공격력 감소": 0,
      "공격속도 감소": 0,
      "방어력 감소": 0,
      "이동속도 감소": 0,
    };
    negativeCounter[negativeEngrave.name] += negativeEngrave.point || 0;

    myWorker?.postMessage({
      data: JSON.parse(
        JSON.stringify({
          infoObject: resultObject,
          negativeCounter,
          positiveCounter,
        })
      ),
      filter: JSON.parse(
        JSON.stringify({
          stat: statFilterValue,
          others: otherFilterValue,
        })
      ),
    });
  }
};

export default EngraveSearchBlock;
