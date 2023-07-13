import {
  EngravePreset,
  EngravePresetWithParsedData,
  ModalProps,
} from "@/types/GlobalType";
import { useEffect, useMemo, useState, Fragment, useContext } from "react";
import { createPortal } from "react-dom";
import MenuIcons from "../icons/MenuIcons";
import usePreventBodyScroll from "@/hooks/usePreventBodyScroll";
import { Necklace, Earring, Ring2, Check, Empty } from "../icons/Index";
import EngraveContext from "@/contexts/EngraveContext";

const LoadModal: React.FC<ModalProps> = ({
  children,
  className,
  closeTimer = 0,
  isOpen,
  closeFunc,
}): JSX.Element | null => {
  const {
    setTargetList,
    setEquipList,
    setAbilityList,
    setNegativeEngrave,
    setNecklaceState,
    setEarringState1,
    setEarringState2,
    setRingState1,
    setRingState2,
  } = useContext(EngraveContext);
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const [ready, setReady] = useState<boolean>(false);
  const [currentPresetList, setCurrentPresetList] = useState<EngravePreset[]>(
    []
  );
  const [viewMode, setViewMode] = useState<number>(0);
  useEffect(() => {
    // https://velog.io/@hyeonq/Next.js-Hydration-failed-error
    // https://velog.io/@sssssssssy/React-createPortal
    if (closeTimer) {
      setTimeout(() => {
        closeFunc!();
      }, closeTimer);
    }
  }, []);
  useEffect(() => {
    if (isOpen) {
      const tmpPreset = localStorage.getItem("engraveSettingInfo");
      if (tmpPreset) {
        setCurrentPresetList(JSON.parse(tmpPreset));
      }
      disableScroll();
      setReady(true);
    } else {
      enableScroll();
      setReady(false);
    }
  }, [isOpen]);
  const parsedPresetList = useMemo(() => {
    if (currentPresetList.length) {
      return currentPresetList.map((tpp: EngravePreset) => ({
        ...tpp,
        data: JSON.parse(tpp.data),
      }));
    } else return JSON.parse(JSON.stringify(currentPresetList));
  }, [currentPresetList]);

  return isOpen && ready ? (
    createPortal(
      <div
        className={`modalRoot hideScroll ${className || ""}`}
        onClick={closeFunc}
      >
        <div
          className="modalContent"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button className="modalCloseBtn" onClick={closeFunc}>
            <MenuIcons type={3} size={30} />
          </button>
          <div className="loadModalContentDiv">
            <div className="loadModalContentDivHeader">
              <button
                className="loadModalContentViewBtn"
                onClick={() => setViewMode(0)}
                data-selected={viewMode === 0}
              >
                <Check size={24} color="#eee" />
                <span>간단히 보기</span>
              </button>
              <button
                className="loadModalContentViewBtn"
                onClick={() => setViewMode(1)}
                data-selected={viewMode === 1}
              >
                <Check size={24} color="#eee" />
                <span>자세히 보기</span>
              </button>
            </div>
            {currentPresetList.length ? (
              viewMode === 0 ? (
                <div className="loadModalSimpleDiv">
                  <ul className="modalVerticalList loadModalSimpleList">
                    {parsedPresetList.map(
                      (e: EngravePresetWithParsedData, i: number) => {
                        return (
                          <li
                            key={`loadedPreset_${e.name}`}
                            className="loadModalSimpleListItem"
                          >
                            <h3 className="modalTitle presetName">{e.name}</h3>
                            <hr />
                            <div className="descrDiv">
                              <h4 className="modalSubtitle">🔹각인</h4>
                              <p className="descrP">
                                {e.descr.engrave.trim() || "각인 없음"}
                              </p>
                            </div>
                            <div className="descrDiv">
                              <h4 className="modalSubtitle">🔹특성</h4>
                              <p className="descrP">- {e.descr.stat}</p>
                            </div>
                            <div className="simpleListItemButtonDiv">
                              <button
                                className="myButtons"
                                onClick={() => {
                                  loadSetting(i);
                                }}
                              >
                                불러오기
                              </button>
                              <button
                                className="myButtons"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `${e.name} 세팅을 삭제하시겠습니까?`
                                    )
                                  )
                                    deleteSetting(i);
                                }}
                              >
                                삭제하기
                              </button>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              ) : (
                <div className="loadModalDetailDiv">
                  <ul className="modalVerticalList loadModalDetailList hideScroll">
                    {parsedPresetList.map(
                      (e: EngravePresetWithParsedData, presetIndex: number) => {
                        return (
                          <Fragment key={`loadedPreset_${e.name}`}>
                            <li className="loadModalDetailListItem">
                              <h3 className="modalTitle presetName">
                                {e.name}
                              </h3>
                              <h3 className="modalSubtitle">🔹목표 각인</h3>
                              <ul className="modalList">
                                {e.data.targetList.length ? (
                                  e.data.targetList.map((targetEngrave) => {
                                    return (
                                      <li
                                        key={`loadedPresetEngrave_${targetEngrave.name}`}
                                        className="modalListItem"
                                      >
                                        {targetEngrave.name}{" "}
                                        <span className="font-bold">
                                          {targetEngrave.level}
                                        </span>
                                      </li>
                                    );
                                  })
                                ) : (
                                  <li className="modalListItem">
                                    목표 각인 없음
                                  </li>
                                )}
                              </ul>
                              <h3 className="modalSubtitle">🔹장착 각인서</h3>
                              <ul className="modalList">
                                {e.data.equipList.length ? (
                                  e.data.equipList.map((equipEngrave) => {
                                    return (
                                      <li
                                        key={`loadedPresetEquip_${equipEngrave.name}`}
                                        className="modalListItem"
                                      >
                                        {equipEngrave.name}{" "}
                                        <span className="font-bold">
                                          +{3 + equipEngrave.level! * 3}
                                        </span>
                                      </li>
                                    );
                                  })
                                ) : (
                                  <li className="modalListItem">
                                    장착 각인서 없음
                                  </li>
                                )}
                              </ul>
                              <h3 className="modalSubtitle">🔹어빌리티 스톤</h3>
                              <ul className="modalList">
                                {
                                  <>
                                    {e.data.abilityList.length ? (
                                      e.data.abilityList.map(
                                        (abilityEngrave) => {
                                          return (
                                            <li
                                              key={`loadedPresetAbility_${abilityEngrave.name}`}
                                              className="modalListItem"
                                            >
                                              {abilityEngrave.name}{" "}
                                              <span className="font-bold">
                                                +{abilityEngrave.point}
                                              </span>
                                            </li>
                                          );
                                        }
                                      )
                                    ) : (
                                      <li className="modalListItem">
                                        어빌리티 스톤 각인 없음
                                      </li>
                                    )}
                                    {e.data.negativeEngrave.name ===
                                    "감소 효과 선택" ? (
                                      <li className="modalListItem text-[#d44] border-[#d44]">
                                        감소효과 미설정
                                      </li>
                                    ) : (
                                      <li className="modalListItem text-[#d44] border-[#d44]">
                                        {e.data.negativeEngrave.name}{" "}
                                        <span className="font-bold">
                                          +{e.data.negativeEngrave.point}
                                        </span>
                                      </li>
                                    )}
                                  </>
                                }
                              </ul>
                              <h3 className="modalSubtitle">
                                🔹전투 특성 설정 - {e.descr.stat}
                              </h3>
                              <ul className="modalList accessoryList">
                                {e.data.accessoryList.map((acc, i) => {
                                  return (
                                    <li
                                      key={`loadedPresetAccessory_${i}`}
                                      className="modalListItem accessoryListItem"
                                    >
                                      {acc.type === 0 ? (
                                        <>
                                          <h4 className="accessoryTitle">
                                            <Necklace fill="#eee" size={20} />{" "}
                                            목걸이
                                          </h4>
                                          <p>
                                            <span>▪️ {acc.stat1.type}</span>
                                            <span> ▪️ {acc.stat2.type}</span>
                                          </p>
                                        </>
                                      ) : acc.type === 1 ? (
                                        <>
                                          <h4 className="accessoryTitle">
                                            <Earring
                                              size={20}
                                              fill="#eee"
                                              fill2="#eee"
                                            />
                                            귀걸이
                                          </h4>
                                          <p>▪️ {acc.stat1.type}</p>
                                        </>
                                      ) : (
                                        <>
                                          <h4 className="accessoryTitle">
                                            <Ring2
                                              size={20}
                                              fill="#eee"
                                              fill2="#eee"
                                            />
                                            반지
                                          </h4>
                                          <p>▪️ {acc.stat1.type}</p>
                                        </>
                                      )}
                                      <p>
                                        품질 : <b>{acc.quality}</b>
                                      </p>
                                    </li>
                                  );
                                })}
                              </ul>
                              <div className="detailListItemButtonDiv">
                                <button
                                  className="myButtons"
                                  onClick={() => {
                                    loadSetting(presetIndex);
                                  }}
                                >
                                  불러오기
                                </button>
                                <button
                                  className="myButtons"
                                  onClick={() => {
                                    deleteSetting(presetIndex);
                                  }}
                                >
                                  삭제하기
                                </button>
                              </div>
                            </li>
                            <hr />
                          </Fragment>
                        );
                      }
                    )}
                  </ul>
                </div>
              )
            ) : (
              <div className="loadModalEmptyDiv">
                <Empty size={150} color="#666" />
                <p>저장된 프리셋 정보가 없습니다.</p>
                <p>새로운 각인 세팅 정보를 저장 후 사용해주세요.</p>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>,
      document.body
    )
  ) : (
    <></>
  );

  function loadSetting(index: number) {
    // 주의) parse된 데이터를 사용해야 하므로 parsedPresetList 사용
    const tmpPresetData = JSON.parse(
      JSON.stringify(parsedPresetList[index].data)
    );
    setTargetList(tmpPresetData.targetList);
    setEquipList(tmpPresetData.equipList);
    setAbilityList(tmpPresetData.abilityList);
    setNegativeEngrave(tmpPresetData.negativeEngrave);
    setNecklaceState(tmpPresetData.accessoryList[0]);
    setEarringState1(tmpPresetData.accessoryList[1]);
    setEarringState2(tmpPresetData.accessoryList[2]);
    setRingState1(tmpPresetData.accessoryList[3]);
    setRingState2(tmpPresetData.accessoryList[4]);
    closeFunc!();
  }
  function deleteSetting(index: number) {
    // 주의) localStorage에 저장된 상태의 데이터를 사용해야 하므로 currentPresetList 사용 (data가 string인 상태)
    const tmpDeletedPresetData = currentPresetList.filter(
      (preset: EngravePreset, i: number) => index !== i
    );
    localStorage.setItem(
      "engraveSettingInfo",
      JSON.stringify(tmpDeletedPresetData)
    );
    setCurrentPresetList(tmpDeletedPresetData);
    alert("삭제 완료!");
  }
};

export default LoadModal;
