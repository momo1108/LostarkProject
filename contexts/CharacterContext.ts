import { CharacterPageStatus } from "@/types/CharacterType";
import { Dispatch, SetStateAction, createContext } from "react";

type CharacterContextType = {
  pageStatus: CharacterPageStatus;
  setPageStatus: Dispatch<SetStateAction<CharacterPageStatus>>;
  characterProfile: any;
  setCharacterProfile: Dispatch<SetStateAction<any>>;
};
const CharacterContext = createContext<CharacterContextType>({
  pageStatus: "INIT",
  setPageStatus: () => {},
  characterProfile: {},
  setCharacterProfile: () => {},
});

export default CharacterContext;
