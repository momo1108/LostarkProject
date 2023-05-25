import CharRecentBlock from "@/components/character/bodycomponent/CharRecentBlock";
import { RootState, SearchedData } from "@/types/ReducerType";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useRouter } from "next/router";

export default function CharRecentContainer() {
  const router = useRouter();
  const data = useSelector<RootState, SearchedData[]>(
    (state) => state.searched.data
  );
  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  return <CharRecentBlock data={data} search={search} />;
}
