import CharRecentBlock from "@/components/character/bodycomponent/CharRecentBlock";
import { RootState } from "@/types/ReducerType";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useRouter } from "next/router";

export default function CharRecentContainer() {
  const router = useRouter();
  const names = useSelector<RootState, string[]>(
    (state) => state.character.names
  );
  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  return <CharRecentBlock names={names} search={search} />;
}
