import CharMainInfoBox from "@/components/character/bodycomponent/CharMainInfoBlock";
import { getChar } from "@/redux/modules/character";
import { CharState, SearchedData } from "@/types/ReducerType";
import { RootState } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

type CharMainInfoContainerProps = {
  push: (name: SearchedData) => void;
};
const CharMainInfoContainer: React.FC<CharMainInfoContainerProps> = ({
  push,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, data } = useSelector<RootState, CharState>(
    (state) => state.character
  );
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getChar(router.query.name![0]));
  }, [dispatch, router]);

  useEffect(() => {
    if (!loading && data.ArmoryProfile && data.ArmoryProfile.CharacterImage) {
      push(data);
      setRender(true);
    } else setRender(false);
  }, [loading, data]);

  return <CharMainInfoBox {...{ loading, data, render }} />;
};

export default CharMainInfoContainer;
