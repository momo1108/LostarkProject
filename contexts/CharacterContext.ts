import { CharacterPageStatus } from "@/types/CharacterType";
import { SearchedData } from "@/types/ReducerType";
import { Dispatch, SetStateAction, createContext } from "react";

type CharacterContextType = {
  pageStatus: CharacterPageStatus;
  setPageStatus: Dispatch<SetStateAction<CharacterPageStatus>>;
  characterProfile: any;
  setCharacterProfile: Dispatch<SetStateAction<any>>;
  searchedDataList: SearchedData[];
  setSearchedDataList: Dispatch<SetStateAction<SearchedData[]>>;
};
const CharacterContext = createContext<CharacterContextType>({
  pageStatus: "INIT",
  setPageStatus: () => {},
  characterProfile: {},
  setCharacterProfile: () => {},
  searchedDataList: [],
  setSearchedDataList: () => {},
});

export default CharacterContext;
