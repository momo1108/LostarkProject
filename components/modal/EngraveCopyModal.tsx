import {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import MenuIcons from "../icons/MenuIcons";
import usePreventBodyScroll from "@/hooks/usePreventBodyScroll";
import { ModalProps, ModalState } from "@/types/ModalType";
import styles from "@/styles/engrave/Body.module.scss";
import MyInput from "../custom/MyInput";
import LostarkService from "@/service/LostarkService";
import {
  ArmoryEquipmentType,
  ArmoryProfileType,
  EngravingEffectType,
  EngravingType,
} from "@/types/LostarkApiType";
import { Copy, TriangleSpinner } from "../icons/Index";
import { SearchedData } from "@/types/ReducerType";
import EngraveContext from "@/contexts/EngraveContext";
import { EngraveInfo } from "@/types/EngraveType";

const EngraveCopyModal: React.FC<ModalProps> = ({
  children,
  className,
  isOpen,
  data,
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
  const [modalState, setModalState] = useState<ModalState>("INIT");
  const [ready, setReady] = useState<boolean>(false);
  const [profile, setProfile] = useState<ArmoryProfileType>();
  const [searchedDataList, setSearchedDataList] = useState<SearchedData[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async () => {
    setModalState("LOADING");
    if (nameRef.current) {
      nameRef.current.value = nameRef.current.value.trim();
      if (nameRef.current.value) {
        console.log(nameRef.current.value);
        try {
          const { data } = await LostarkService.getCharacterProfile(
            nameRef.current.value
          );
          if (data) setProfile(data);
          else throw new Error("검색 실패");
        } catch (err) {
          alert("검색 실패");
          console.error(err);
          setModalState("ERROR");
        }
      } else {
        alert("닉네임을 입력해주세요.");
        setModalState("ERROR");
        nameRef.current.focus();
      }
    } else return;
  }, [nameRef]);

  const copyEngraveSetting = useCallback(async (name: string) => {
    try {
      const result = await LostarkService.getCharacterSummary(name);
      console.log(result.data);
      const { ArmoryEngraving: ae, ArmoryEquipment: ae2 } = result.data;
      // 총 각인 정보, 각인서, 어빌리티스톤, 악세부위별 특성
      // ArmoryEngraving - Effects(총 각인 - 감소 키워드 포함 제외), Engravings(각인서) - Name(각인이름), Tooltip(각인수치), ArmoryEquipment - Type(부위-목걸이,귀걸이,반지,어빌리티 스톤), Tooltip(품질, 특성, 어빌리티 각인)
      // equipList, targetList, abilityList : EngraveInfo[], negativeEngrave : EngraveInfo
      // necklaceState, earringState1, earringState2, ringState1, ringState2 : AccessoryInfo
      if (ae && ae.Effects)
        setTargetList(
          ae.Effects.map(({ Name }: EngravingEffectType): EngraveInfo => {
            Name = Name.trim();
            const index = Name.indexOf("Lv.");

            return {
              name: Name.slice(0, index).trim(),
              level: parseInt(Name[Name.length - 1]),
              point: parseInt(Name[Name.length - 1]) * 5,
              enableInput: false,
              inputValue: (parseInt(Name[Name.length - 1]) * 5).toString(),
            };
          })
        );
      if (ae && ae.Engravings)
        setEquipList(
          ae.Engravings.map(({ Name, Tooltip }: EngravingType): EngraveInfo => {
            const text = /각인 활성 포인트 \+[0-9]{1,2}/g.exec(Tooltip);
            console.log(text);
            return {
              name: Name,
              level: parseInt(text![0].split("+")[1]) / 3 - 1,
              point: parseInt(text![0].split("+")[1]),
              enableInput: false,
              inputValue: parseInt(text![0].split("+")[1]).toString(),
            };
          })
        );
      if (ae2) {
        // 이벤트 어빌리티스톤(익스프레스) 처리해야함. keyword. "성장 지원 기능"
        const stone = ae2.find(
          (equipment: ArmoryEquipmentType) => equipment.Type === "어빌리티 스톤"
        );
        if (stone) {
          console.log(stone);
          const parsedAbilityInfo: string[][] = [
            ...stone.Tooltip.matchAll(
              /\[<FONT COLOR='#[0-9A-Fa-f]{1,6}'>[가-힣\s]+<\/FONT>\]\s+활성도\s+\+[0-9]{1,2}/g
            ),
          ].map((text: string) => {
            const engraveNameObject = />[가-힣\s]+</g.exec(text);
            let engraveName = engraveNameObject ? engraveNameObject[0] : "";
            engraveName = engraveName.slice(1, engraveName.length - 1).trim();
            const engravePointObject = /\+[0-9]{1,2}/g.exec(text);
            let engravePoint = engravePointObject
              ? engravePointObject[0].slice(1).trim()
              : "";
            return [engraveName, engravePoint];
          });
          setAbilityList(
            parsedAbilityInfo
              .filter((engrave) => !engrave[0].includes("감소"))
              .map((engrave) => {
                return {
                  name: engrave[0],
                  enableInput: false,
                  inputValue: engrave[1],
                  point: parseInt(engrave[1]),
                  level: 1,
                };
              })
          );
          let negativeEngrave = parsedAbilityInfo.find((engrave) =>
            engrave[0].includes("감소")
          );
          if (negativeEngrave)
            setNegativeEngrave({
              name: negativeEngrave[0],
              enableInput: false,
              inputValue: negativeEngrave[1],
              point: parseInt(negativeEngrave[1]),
              level: 1,
            });
        }

        const necklace = ae2.find(
          (equipment: ArmoryEquipmentType) => equipment.Type === "목걸이"
        );
        if (necklace) {
          // 이벤트 어빌리티스톤(익스프레스) 처리해야함. keyword. "성장 지원 기능" 이 경우 품질 70고정
        }
      }
      // setAbilityList(tmpPresetData.abilityList);
      // setNegativeEngrave(tmpPresetData.negativeEngrave);
      // setNecklaceState(tmpPresetData.accessoryList[0]);
      // setEarringState1(tmpPresetData.accessoryList[1]);
      // setEarringState2(tmpPresetData.accessoryList[2]);
      // setRingState1(tmpPresetData.accessoryList[3]);
      // setRingState2(tmpPresetData.accessoryList[4]);
      closeFunc!();
      result.data.ArmoryEngraving;
    } catch (error) {
      console.log(error);
      alert("에러가 발생했습니다.");
      closeFunc!();
    }
  }, []);

  useEffect(() => {
    const local_searchedDataList = JSON.parse(
      localStorage.getItem("recentSearch") || "[]"
    );
    setSearchedDataList(
      local_searchedDataList[0] ? local_searchedDataList : []
    );
    setReady(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      disableScroll();
      setModalState("INIT");
      setReady(true);
    } else {
      enableScroll();
      setReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // console.log(profile);
    if (profile) setModalState("DONE");
  }, [profile]);

  return isOpen && ready ? (
    createPortal(
      <div
        className={`modalRoot ${className || ""}`}
        onClick={modalState !== "COPYING" ? closeFunc : () => {}}
      >
        <div
          className="modalContent"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button className="modalCloseButton" onClick={closeFunc}>
            <MenuIcons type={3} size={20} width={2} color="#957b5c" />
          </button>
          <div className={styles.engraveCopyModalDiv}>
            <div className={styles.searchDiv}>
              <MyInput
                placeholder="캐릭터명"
                ref={nameRef}
                onKeyEnter={search}
              />
              <button className="myButtons" onClick={search}>
                검색
              </button>
            </div>
            <div className={styles.resultDiv}>
              <h4 className="modalSubtitle">검색 결과</h4>
              <div className={styles.resultContentDiv}>
                {modalState === "INIT" ? (
                  <div className={styles.messageDiv}>검색을 진행해 주세요.</div>
                ) : modalState === "LOADING" ? (
                  <div className={styles.messageDiv}>
                    <TriangleSpinner
                      width={4}
                      size={30}
                      className="triangleSpinner"
                    />
                    <span>검색을 진행 중입니다.</span>
                  </div>
                ) : modalState === "COPYING" ? (
                  <div className={styles.messageDiv}>
                    <TriangleSpinner
                      width={4}
                      size={30}
                      className="triangleSpinner"
                    />
                    <span>복사를 진행 중입니다.</span>
                  </div>
                ) : modalState === "DONE" ? (
                  <div className={styles.resultProfileDiv}>
                    <div className={styles.serverNameDiv}>
                      <span className={styles.serverSpan}>
                        {profile!.ServerName}
                      </span>
                      <span
                        className={styles.nameSpan}
                        title={profile!.CharacterName}
                      >
                        {profile!.CharacterName}
                      </span>
                    </div>
                    <div className={styles.classLevelDiv}>
                      <span className={styles.classSpan}>
                        {profile!.CharacterClassName}
                      </span>
                      <p className={styles.levelP}>
                        <span>Lv.</span>
                        <span className={styles.levelSpan}>
                          {profile!.ItemMaxLevel}
                        </span>
                      </p>
                    </div>
                    <div className={styles.buttonDiv}>
                      <button
                        className={`myButtons ${styles.copyButton}`}
                        onClick={() => {
                          setModalState("COPYING");
                          copyEngraveSetting(profile!.CharacterName);
                        }}
                      >
                        <Copy size={20} fill="#eee" />
                        <span className={styles.copyButtonSpan}>세팅 복사</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.errorDiv}>에러</div>
                )}
              </div>
            </div>
            <div className={styles.recentDiv}>
              <h4 className="modalSubtitle">최근 검색 목록</h4>
              <p className={styles.recentDescr}>
                "캐릭터 검색" 메뉴의 검색 기록입니다.
              </p>
              <div className={`${styles.recentContentDiv} hideScroll`}>
                {searchedDataList.length ? (
                  searchedDataList.map((searchedData) => (
                    <div
                      className={styles.recentProfileDiv}
                      key={`recentSearch_${searchedData.name}`}
                    >
                      <div className={styles.serverNameDiv}>
                        <span className={styles.serverSpan}>
                          {searchedData.server}
                        </span>
                        <span
                          className={styles.nameSpan}
                          title={searchedData.name}
                        >
                          {searchedData.name}
                        </span>
                      </div>
                      <div className={styles.classLevelDiv}>
                        <span className={styles.classSpan}>
                          {searchedData.class}
                        </span>
                        <p className={styles.levelP}>
                          <span>Lv.</span>
                          <span className={styles.levelSpan}>
                            {searchedData.level}
                          </span>
                        </p>
                      </div>
                      <div className={styles.buttonDiv}>
                        <button
                          className={`myButtons ${styles.copyButton}`}
                          onClick={() => {
                            setModalState("COPYING");
                            copyEngraveSetting(searchedData.name);
                          }}
                        >
                          <Copy size={20} fill="#eee" />
                          <span className={styles.copyButtonSpan}>
                            세팅 복사
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyProfileDiv}>
                    검색 기록이 없습니다.
                  </div>
                )}
              </div>
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
};

export default EngraveCopyModal;
