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
import styles from "@/styles/tripod/Body.module.scss";
import MyInput from "../custom/MyInput";
import LostarkService from "@/service/LostarkService";
import { ArmoryProfileType } from "@/types/LostarkApiType";
import { Copy } from "../icons/Index";
import TripodSearchContext from "@/contexts/TripodSearchContext";

const TripodCopyModal: React.FC<ModalProps> = ({
  children,
  className,
  isOpen,
  data,
  closeFunc,
}): JSX.Element | null => {
  const { subClass, setSubClass, tripodData } = useContext(TripodSearchContext);
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const [modalState, setModalState] = useState<ModalState>("INIT");
  const [ready, setReady] = useState<boolean>(false);
  const [profile, setProfile] = useState<ArmoryProfileType>();
  const nameRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async () => {
    setModalState("LOADING");
    if (nameRef.current) {
      nameRef.current.value = nameRef.current.value.trim();
      if (nameRef.current.value) {
        try {
          const { data } = await LostarkService.getCharacterProfile(
            nameRef.current.value
          );
          setProfile(data);
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

  useEffect(() => {
    //     flow
    // - 캐릭터 이름 profile 검색
    // - 응답 데이터의 직업으로 스킬셋 불러오기
    // - 응답 데이터의 트포세팅 그대로 적용하기
    setReady(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      disableScroll();
      setReady(true);
    } else {
      enableScroll();
      setReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log(profile);
    if (profile) setModalState("DONE");
  }, [profile]);

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
            <MenuIcons type={3} size={20} width={2} color="#957b5c" />
          </button>
          <div className={styles.tripodModalDiv}>
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
                  <div className={styles.messageDiv}>검색을 진행 중입니다.</div>
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
                        onClick={() => {}}
                      >
                        <Copy size={20} fill="#eee" />
                        <span>세팅 복사</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.errorDiv}>에러</div>
                )}
              </div>
            </div>
            <div>
              <h4 className="modalSubtitle">최근 검색 목록</h4>
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

export default TripodCopyModal;
