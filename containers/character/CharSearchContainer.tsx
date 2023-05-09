import CharSearchBar from "@/components/character/bodycomponent/CharSearchBar";
import { CharState } from "@/types/ReducerType";
import { RootState } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export default function CharSearchContainer() {
  const router = useRouter();
  const { loading } = useSelector<RootState, CharState>(
    (state) => state.character
  );
  const shrink = "name" in router.query;

  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  return <CharSearchBar search={search} loading={loading} shrink={shrink} />;
}
