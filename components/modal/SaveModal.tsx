import { EngravePreset, ModalData, ModalProps } from "@/types/GlobalType";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import MenuIcons from "../icons/MenuIcons";
import usePreventBodyScroll from "@/hooks/usePreventBodyScroll";
import { AccessoryInfo, EngraveInfo } from "@/types/EngraveType";

const SaveModal: React.FC<ModalProps> = ({
  children,
  className,
  closeTimer = 0,
  isOpen,
  data,
  closeFunc,
}): JSX.Element | null => {
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const [ready, setReady] = useState<boolean>(false);
  const [currentPresetList, setCurrentPresetList] = useState<EngravePreset[]>(
    []
  );
  const [currentStatInfo, setCurrentStatInfo] = useState<string>("");
  const [parsedData, setParsedData] = useState<ModalData>();
  const [presetName, setPresetName] = useState<string>("");
  const validName: boolean = useMemo(() => {
    return (
      presetName.trim().length > 0 &&
      !currentPresetList.find((preset) => preset.name === presetName.trim())
    );
  }, [presetName]);
  useEffect(() => {
    // https://velog.io/@hyeonq/Next.js-Hydration-failed-error
    // https://velog.io/@sssssssssy/React-createPortal
    setParsedData(JSON.parse(data));
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
      setPresetName(`세팅 ${currentPresetList.length + 1}`);
      disableScroll();
      setReady(true);
    } else {
      enableScroll();
      setReady(false);
    }
  }, [isOpen]);
  useEffect(() => {
    const tmpParsedData: ModalData = JSON.parse(data);
    const tmpStatData = {
      치명: 0,
      특화: 0,
      신속: 0,
      제압: 0,
      인내: 0,
      숙련: 0,
    };
    tmpParsedData.accessoryList.forEach((acc) => {
      if (acc.type === 0) {
        tmpStatData[acc.stat1.type] += 500;
        tmpStatData[acc.stat2.type] += 500;
      } else if (acc.type === 1) {
        tmpStatData[acc.stat1.type] += 300;
      } else {
        tmpStatData[acc.stat1.type] += 200;
      }
    });
    // 악세서리 정보 -> 특성합 순으로 문자열생성(ex. 특치, 특신)
    setCurrentStatInfo(
      Object.entries(tmpStatData)
        .filter(([, value]) => value > 0)
        .sort(([, value1], [, value2]) => value2 - value1)
        .reduce((prev, [key]) => `${prev}${key.charAt(0)}`, "")
    );
    setParsedData(tmpParsedData);
  }, [data]);

  return isOpen && ready ? (
    createPortal(
      <div className={`modalRoot ${className || ""}`} onClick={closeFunc}>
        <div
          className="modalContent"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button className="modalCloseBtn" onClick={closeFunc}>
            <MenuIcons type={3} size={30} />
          </button>
          <div className="saveModalContentDiv">
            <div className="saveModalSavedDiv">
              <h2 className="modalTitle">저장된 세팅 목록</h2>
              <ul className="savedPresetList">
                {currentPresetList.length ? (
                  currentPresetList.map((preset: EngravePreset) => {
                    return (
                      <li
                        className="savedPresetListItem"
                        key={`preset_${preset.name}`}
                      >
                        <h3 className="modalSubtitle w-full">
                          🔹{preset.name}
                        </h3>
                        <p>- {preset.descr.engrave}</p>
                        <p>- {preset.descr.stat}</p>
                        {/* <div className="savedPresetListItemEngraveDiv">
                            <h3 className="font-bold">각인</h3>
                          </div>
                          <div className="savedPresetListItemStatDiv">
                            <h3 className="font-bold">전투 특성</h3>
                          </div> */}
                      </li>
                    );
                  })
                ) : (
                  <li className="modalEmptyListItem">
                    <p>저장된 각인 세팅이 없습니다.</p>
                    <p>새로운 각인 세팅을 저장해주세요.</p>
                  </li>
                )}
              </ul>
            </div>
            <hr />
            <div className="saveModalCurrentDiv">
              <h2 className="modalTitle">현재 세팅 정보</h2>
              <h3 className="modalSubtitle">🔹목표 각인</h3>
              <ul className="modalList">
                {parsedData?.targetList.length ? (
                  parsedData?.targetList.map((targetEngrave) => {
                    return (
                      <li
                        key={`currentPreset_${targetEngrave.name}`}
                        className="modalListItem"
                      >
                        {targetEngrave.name}{" "}
                        <span className="font-bold">{targetEngrave.level}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="modalEmptyListItem">
                    설정된 목표 각인이 없습니다.
                  </li>
                )}
              </ul>
              <h3 className="modalSubtitle">🔹장착 각인서</h3>
              <ul className="modalList">
                {parsedData?.equipList.length ? (
                  parsedData?.equipList.map((equipEngrave) => {
                    return (
                      <li
                        key={`currentPreset_${equipEngrave.name}`}
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
                  <li className="modalEmptyListItem">
                    설정된 장착 각인이 없습니다.
                  </li>
                )}
              </ul>
              <h3 className="modalSubtitle">🔹어빌리티 스톤</h3>
              <ul className="modalList">
                {parsedData?.abilityList.length ? (
                  <>
                    {parsedData?.abilityList.map((abilityEngrave) => {
                      return (
                        <li
                          key={`currentPreset_${abilityEngrave.name}`}
                          className="modalListItem"
                        >
                          {abilityEngrave.name}{" "}
                          <span className="font-bold">
                            +{abilityEngrave.point}
                          </span>
                        </li>
                      );
                    })}
                    {parsedData?.negativeEngrave.name === "감소 효과 선택" ? (
                      <li className="modalListItem text-[#d44] border-[#d44]">
                        감소효과 미설정
                      </li>
                    ) : (
                      <li className="modalListItem text-[#d44] border-[#d44]">
                        {parsedData.negativeEngrave.name}{" "}
                        <span className="font-bold">
                          +{parsedData.negativeEngrave.point}
                        </span>
                      </li>
                    )}
                  </>
                ) : (
                  <li className="modalEmptyListItem">
                    설정된 어빌리티스톤 정보가 없습니다.
                  </li>
                )}
              </ul>
              <h3 className="modalSubtitle">
                🔹전투 특성 설정 -{" "}
                {currentStatInfo ? (
                  <span className="text-[#76b1ff]">{currentStatInfo}</span>
                ) : (
                  "확인중..."
                )}
              </h3>
            </div>
            <hr />
            <div className="saveModalSavingDiv">
              <label data-valid={validName}>
                <h2 className="modalTitle">저장하기</h2>
                <input
                  type="text"
                  value={presetName}
                  onChange={(event) => {
                    setPresetName(event.target.value);
                  }}
                />
              </label>
              <button
                className="myButtons justify-center"
                disabled={!validName}
                onClick={() => {
                  savePreset();
                }}
              >
                저장하기
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>,
      document.body
    )
  ) : (
    <></>
  );

  function savePreset() {
    const tmpList = [
      ...currentPresetList,
      {
        name: presetName,
        descr: {
          engrave:
            parsedData?.targetList
              .reduce(
                (prev, cur) => {
                  return [
                    `${prev[0]}${cur.name.charAt(0)}`,
                    `${prev[1]}${cur.level}`,
                  ];
                },
                ["", ""]
              )
              .join(" ") || "목표 각인 없음",
          stat: currentStatInfo,
        },
        data: data,
      },
    ];
    localStorage.setItem("engraveSettingInfo", JSON.stringify(tmpList));
    closeFunc!();
    alert("저장 완료!");
  }
};

export default SaveModal;
