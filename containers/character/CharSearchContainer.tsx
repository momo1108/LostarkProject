import CharSearchBar from "@/components/character/bodycomponent/CharSearchBar";
import { useRouter } from "next/router";
import { useCallback } from "react";

type CharSearchContainerProps = {
  like: (name: string) => void;
  remove: (name: string) => void;
};
const CharSearchContainer: React.FC<CharSearchContainerProps> = ({
  like,
  remove,
}) => {
  const router = useRouter();
  const shrink = "name" in router.query;

  const search = useCallback((name: string) => {
    router.push("/character/" + name);
  }, []);

  return <CharSearchBar {...{ search, shrink, like, remove }} />;
};

export default CharSearchContainer;
