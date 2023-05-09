import CharMainInfoBox from "@/components/character/bodycomponent/CharMainInfoBlock";
import { getChar } from "@/redux/modules/character";
import { CharState } from "@/types/ReducerType";
import { RootState } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function CharMainInfoContainer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, data } = useSelector<RootState, CharState>(
    (state) => state.character
  );
  const [render, setRender] = useState<boolean>(false);
  useEffect(() => {
    setRender(!loading && "ArmoryProfile" in data);
  }, [loading, data]);

  useEffect(() => {
    dispatch(getChar(router.query.name![0]));
  }, [dispatch, router]);

  return <CharMainInfoBox data={data} render={render} />;
}
