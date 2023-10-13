import { createContext } from "react";

type AlertContextType = {
  info: (message: string) => void;
  error: (message: string) => void;
  success: (message: string) => void;
};
const AlertContext = createContext<AlertContextType>({
  info: (message: string) => {},
  error: (message: string) => {},
  success: (message: string) => {},
});

export default AlertContext;
