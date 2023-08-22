import LostarkService from "@/service/LostarkService";
import { FilteredSkillType, SkillType, userList } from "@/types/TripodType";
import { useCallback, useState } from "react";

/**
 * 검색된 캐릭터의 스킬데이터 중 필요한 정보만 빼내는 hook
 * @returns
 * singleClassParser : 스킬, 트포 정보만 빼내기
 */
export default function useSkillParser() {
  const [classList, setClassList] = useState<{
    [key: string]: FilteredSkillType[];
  }>();

  const singleClassParser = useCallback(
    (skills: SkillType[]): FilteredSkillType[] => {
      // 한 클래스 스킬데이터 파서
      // 스킬, 트포 정보만 빼내기
      // 트포의 경우 Upgradable 기본값 true, Level 기본값 5 로 설정 후
      // admin 페이지에서 조정기능 구현
      return skills
        .filter((skill) => !skill.IsAwakening || skill.Tripods.length)
        .map((skill) => ({
          Name: skill.Name,
          Icon: skill.Icon,
          Value: -1,
          Tooltip: skill.Tooltip,
          Tripods: skill.Tripods.map((tripod) => ({
            Tier: tripod.Tier,
            Slot: tripod.Slot,
            Name: tripod.Name,
            Icon: tripod.Icon,
            Value: -1,
            IsSelected: tripod.IsSelected,
            Tooltip: tripod.Tooltip,
            Upgradable: true,
            Level: 5,
          })),
        }));
    },
    []
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
          singleSkillData = singleClassParser(skillData);
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
  }, []);

  return { singleClassParser, allClassSave, classList };
}
