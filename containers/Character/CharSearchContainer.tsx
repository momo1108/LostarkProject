import CharSearchBar from "@/components/Character/CharSearchBar";
import { getChar } from "@/redux/modules/character";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export default function CharSearchContainer() {
  const dispatch = useDispatch();

  const search = useCallback(
    (name: string) => {
      dispatch(getChar(name));
    },
    [dispatch]
  );

  return <CharSearchBar search={search} />;
}
