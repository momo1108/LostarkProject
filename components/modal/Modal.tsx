import { ModalProps } from "@/types/GlobalType";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MenuIcons from "../icons/MenuIcons";

const Modal: React.FC<ModalProps> = ({
  children,
  className,
}): JSX.Element | null => {
  const [ready, setReady] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  useEffect(() => {
    // https://velog.io/@hyeonq/Next.js-Hydration-failed-error
    // https://velog.io/@sssssssssy/React-createPortal
    setReady(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  }, []);
  return isOpen && ready ? (
    createPortal(
      <div className={`modal-root ${className || ""}`}>
        <MenuIcons type={2} />
        {children}
      </div>,
      document.body
    )
  ) : (
    <></>
  );
};

export default Modal;
