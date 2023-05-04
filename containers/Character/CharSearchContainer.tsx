import CharSearchBar from "@/components/character/body/CharSearchBar";
import { getChar } from "@/redux/modules/character";
import { CharState } from "@/types/ReducerType";
import { RootState } from "@/types/ReducerType";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function CharSearchContainer() {
  const dispatch = useDispatch();
  const { loading, names } = useSelector<RootState, CharState>(
    (state) => state.character
  );

  const search = useCallback(
    (name: string) => {
      dispatch(getChar(name));
    },
    [dispatch]
  );

  return <CharSearchBar search={search} loading={loading} names={names} />;
}
