import CharRecentBlock from "@/components/character/body/CharRecentBlock";
import { RootState } from "@/types/ReducerType";
import { useSelector } from "react-redux";

export default function CharRecentContainer() {
  const names = useSelector<RootState, string[]>(
    (state) => state.character.names
  );

  return <CharRecentBlock names={names} />;
}
