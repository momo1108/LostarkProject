import { EngravePreset, ModalProps } from "@/types/GlobalType";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MenuIcons from "../icons/MenuIcons";

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  closeTimer = 0,
  isOpen,
  type,
  data,
  closeFunc,
}): JSX.Element | null => {
  const [ready, setReady] = useState<boolean>(false);
  const [currentPreset, setCurrentPreset] = useState<EngravePreset[]>([]);
  const [innerIsOpen, setInnerIsOpen] = useState<boolean>(isOpen);
  useEffect(() => {
    // https://velog.io/@hyeonq/Next.js-Hydration-failed-error
    // https://velog.io/@sssssssssy/React-createPortal
    setReady(true);
    if (closeTimer) {
      setTimeout(() => {
        setInnerIsOpen(false);
      }, closeTimer);
    }
  }, []);
  useEffect(() => {
    if (isOpen && type === 0) {
      const tmpPreset = localStorage.getItem("engraveSettingInfo");
      if (tmpPreset) setCurrentPreset(JSON.parse(tmpPreset));
    }
    setInnerIsOpen(isOpen);
  }, [isOpen]);
  return innerIsOpen && ready ? (
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
          {type === 0 ? (
            <div className="modalContentSave">
              <h2 className="save-title">저장된 각인 세팅</h2>
            </div>
          ) : (
            ""
          )}
          {children}
        </div>
      </div>,
      document.body
    )
  ) : (
    <></>
  );
};

export default Modal;
