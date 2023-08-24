export type ModalProps = {
  children?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  data: string;
  closeFunc?: () => void;
};

export type ModalState = "INIT" | "LOADING" | "DONE" | "ERROR" | "COPYING";
