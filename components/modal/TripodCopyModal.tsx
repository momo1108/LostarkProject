import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import MenuIcons from "../icons/MenuIcons";
import usePreventBodyScroll from "@/hooks/usePreventBodyScroll";
import { ModalProps, ModalState } from "@/types/ModalType";
import styles from "@/styles/tripod/Body.module.scss";
import MyInput from "../custom/MyInput";

const TripodCopyModal: React.FC<ModalProps> = ({
  children,
  className,
  isOpen,
  data,
  closeFunc,
}): JSX.Element | null => {
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const [modalState, setModalState] = useState<ModalState>("INIT");
  const [ready, setReady] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement>(null);

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
          <div className={styles.tripodModalDiv}>
            <div className={styles.searchDiv}>
              <MyInput placeholder="캐릭터명" ref={nameRef} />
              <button className="myButtons">검색</button>
            </div>
            <div className={styles.resultDiv}>
              <h4 className="modalTitle">검색 결과</h4>
              <div className={styles.resultContentDiv}>
                {modalState === "INIT" ? (
                  <p>검색을 진행해주세요</p>
                ) : modalState === "LOADING" ? (
                  <p>검색을 진행중입니다.</p>
                ) : (
                  <>
                    <p>닉네임</p>
                    <p>직업</p>
                    <p>레벨</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <h4 className="modalTitle">최근 검색 목록</h4>
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
