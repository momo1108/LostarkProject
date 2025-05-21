import CharMainInfoBlock from "@/components/character/bodycomponent/CharMainInfoBlock";
import CharacterContext from "@/contexts/CharacterContext";
import {
  getCharacterImageUrl,
  getCharacterSummary,
} from "@/service/LostarkService";
import { SearchedData } from "@/types/ReducerType";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";

type CharMainInfoContainerProps = {
  push: (name: SearchedData) => void;
};
const CharMainInfoContainer: React.FC<CharMainInfoContainerProps> = ({
  push,
}) => {
  const { pageStatus, setPageStatus, characterProfile, setCharacterProfile } =
    useContext(CharacterContext);
  const router = useRouter();

  const getCharacterProfile = useCallback(async () => {
    try {
      const data = await getCharacterSummary(router.query.name![0]);
      console.log(data);

      if (!data || !data.ArmoryProfile) {
        // 유효 데이터인지 먼저 체크
        setPageStatus("NODATA");
      } else if (!data.ArmoryProfile.CharacterImage) {
        // 유효 데이터인 경우, 이미지 링크가 있는지 체크
        const url: string | undefined = await getCharacterImageUrl(
          router.query.name![0]
        );
        if (!url) {
          setPageStatus("NODATA");
        } else {
          data.ArmoryProfile.CharacterImage = url ? url : null;
          setCharacterProfile(data);
          push(data);
        }
      } else {
        // 유효 데이터에, 이미지 링크도 있으면 데이터 세팅
        setCharacterProfile(data);
        push(data);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 429) {
        setPageStatus("TOOMANYREQUESTS");
      } else {
        setPageStatus("ERROR");
      }
    }
  }, [router, push]);

  useEffect(() => {
    setPageStatus("SEARCHING");
  }, [router]);

  useEffect(() => {
    if (pageStatus === "SEARCHING") {
      getCharacterProfile();
    }
  }, [pageStatus]);
  useEffect(() => {
    if (pageStatus === "SEARCHING") {
      setPageStatus("DONE");
    }
  }, [characterProfile]);

  return <CharMainInfoBlock />;
};

export default CharMainInfoContainer;
