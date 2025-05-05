import { AccessoryResultContextProvider } from "./AccessoryResultContext";
import { AccessorySearchContextProvider } from "./AccessorySearchContext";

export const AccessoryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AccessorySearchContextProvider>
      <AccessoryResultContextProvider>
        {children}
      </AccessoryResultContextProvider>
    </AccessorySearchContextProvider>
  );
};
