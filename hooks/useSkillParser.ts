import LostarkService from "@/service/LostarkService";
import { AuctionSkillOption } from "@/types/LostarkApiType";
import { FilteredSkillType, SkillType, userList } from "@/types/TripodType";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import useAlert from "./useAlert";

/**
 * 검색된 캐릭터의 스킬데이터 중 필요한 정보만 빼내는 hook
 * @returns
 * singleClassParser : 스킬, 트포 정보만 빼내기
 */
export default function useSkillParser() {
  const alert = useAlert();
  const [classList, setClassList] = useState<{
    [key: string]: FilteredSkillType[];
  }>({});
  const [auctionSearchOptions, setAuctionSearchOptions] = useState<
    AuctionSkillOption[]
  >([]);

  const getAuctionValueCode = useCallback(async () => {
    try {
      const { data } = await LostarkService.getAuctionOptions();
      setAuctionSearchOptions(data.SkillOptions);
      console.log(data.SkillOptions);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAuctionValueCode();
  }, []);

  useEffect(() => {
    console.log(classList);
  }, [classList]);

  const skillDataParser = useCallback(
    (className: string, skills: SkillType[]): FilteredSkillType[] => {
      /* 한 클래스 스킬데이터 파서 스킬, 트포 정보만 빼내기
      트포의 경우 Upgradable 기본값 false, Level 기본값 1 로 설정 후(GET /auctions/options 에서 강화가능만 return하기때문에, 겹치는것만 수정)
      admin 페이지에서 조정기능 구현 */
      return skills
        .filter((skill) => !skill.IsAwakening || skill.Tripods.length)
        .map((skill) => {
          const skillAuctionOption = auctionSearchOptions.find(
            (skillOption) =>
              skillOption.Class === className && skillOption.Text === skill.Name
          );
          return {
            Name: skill.Name,
            Icon: skill.Icon,
            Value: skillAuctionOption ? skillAuctionOption.Value : -1,
            Tooltip: skill.Tooltip,
            Tripods: skill.Tripods.map((tripod) => {
              const tripodAuctionOption = skillAuctionOption?.Tripods.find(
                (tripodOption) => tripodOption.Text === tripod.Name
              );
              return {
                Tier: tripod.Tier,
                Slot: tripod.Slot,
                Name: tripod.Name,
                Icon: tripod.Icon,
                Value: tripodAuctionOption ? tripodAuctionOption.Value : -1,
                IsSelected: false,
                Tooltip: tripod.Tooltip,
                Upgradable: tripodAuctionOption ? true : false,
                Level: tripodAuctionOption ? 5 : 1,
              };
            }),
          };
        });
    },
    [auctionSearchOptions]
  );

  const singleClassParser = useCallback(
    async (className: string) => {
      let singleSkillData: FilteredSkillType[] | null = null;
      for (let user = 0; user < userList[className].length; user++) {
        try {
          const { data: skillData } = await LostarkService.getCharacterSkills(
            userList[className][user]
          );
          singleSkillData = skillDataParser(className, skillData);
          console.log(singleSkillData);
          break;
        } catch (err) {
          console.error(err);
        }
      }
      return singleSkillData;
    },
    [skillDataParser]
  );

  const allClassSave = useCallback(async () => {
    /* nicknameForEachClass.json 활용
    key들로 반복 돌려서 skill api 요청
    응답 데이터를 singleClassParser로 처리 후 반환
    모든 데이터를 반환받은 후 합쳐서 저장.
    */
    const tmpClassList: { [key: string]: FilteredSkillType[] } = Object.keys(
      userList
    ).reduce((prev, cur) => ({ ...prev, [cur]: [] }), {});

    for (let cls in userList) {
      let singleSkillData: FilteredSkillType[] | null = null;
      for (let user = 0; user < userList[cls].length; user++) {
        try {
          const { data: skillData } = await LostarkService.getCharacterSkills(
            userList[cls][user]
          );
          singleSkillData = skillDataParser(cls, skillData);
          break;
        } catch (err) {
          console.error(err);
        }
      }
      if (singleSkillData) {
        tmpClassList[cls] = singleSkillData;
      } else {
        throw new Error(`No Data for class "${cls}"`);
      }
    }

    setClassList(JSON.parse(JSON.stringify(tmpClassList)));
  }, [skillDataParser]);

  const updateAllClassServerData = useCallback(() => {
    const url =
      process.env.NEXT_PUBLIC_TRIPOD_API ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/tripod"
        : "/loaple/tripod");

    for (let cls in classList) {
      axios
        .post(
          url,
          { data: [cls, classList![cls]] },
          {
            timeout: 10000,
          }
        )
        .then((res) => {
          console.log(typeof res.data, res.data);
          alert.success(`${cls} 클래스 성공`);
        })
        .catch((err) => {
          console.error(err);
          alert.error(`${cls} 클래스 실패 : ${err.message}`);
        });
    }
  }, [alert, classList]);

  return {
    skillDataParser,
    singleClassParser,
    allClassSave,
    getAuctionValueCode,
    classList,
    auctionSearchOptions,
    updateAllClassServerData,
  };
}
