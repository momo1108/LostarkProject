import useApiTagParser from "@/hooks/useApiTagParser";
import styles from "@/styles/character/Body.module.scss";
import {
  ArmoryEGCProps,
  LOAWA_ENG_ICON_URL,
  engravingIconMap,
  engravingLevelColorMap,
} from "@/types/EGCType";
import { useEffect, useState } from "react";

const ArmoryEGC: React.FC<ArmoryEGCProps> = ({ data }) => {
  // console.log("ArmoryEGC");
  const { parseEngravingPoint } = useApiTagParser();
  const [engEquip, setEngEquip] = useState<any>();
  useEffect(() => {
    if (data.ArmoryEngraving?.Engraving)
      setEngEquip(
        data.ArmoryEngraving.Engravings.map((e: any) => ({
          ...e,
          Tooltip: JSON.parse(e.Tooltip),
        }))
      );
    else setEngEquip(new Array(2));
    console.log(engEquip);
  }, [data]);

  return (
    <div className={styles.infoContainerItemDiv}>
      <div className={styles.engravingHeader}>
        <p className={styles.engravingHeaderP}>장착 각인</p>
        {engEquip ? (
          [0, 1].map((e: number) => {
            return engEquip[e] ? (
              <div
                key={`equipEngraving${e}`}
                className={styles.engravingEquipDiv}
              >
                <div className={styles.engravingEquipIconDiv}>
                  <img
                    className={styles.engravingEquipIconSlot}
                    src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_slot_engrave.png"
                    alt="emptyslot"
                  />
                  <img
                    className={styles.engravingEquipIconImage}
                    width={41}
                    src={engEquip[e].Icon}
                    alt=""
                  />
                </div>
                <p className={styles.engravingEquipNameP}>{engEquip[e].Name}</p>
                <p>
                  {parseEngravingPoint(
                    engEquip[e].Tooltip.Element_001.value.leftText
                  )}
                </p>
              </div>
            ) : (
              <div
                key={`equipEngraving${e}`}
                className={styles.engravingEquipDiv}
              >
                <div className={styles.engravingEquipIconDiv}>
                  <img
                    className={styles.engravingEquipIconSlot}
                    src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_slot_engrave.png"
                    alt="emptyslot"
                  />
                  <img
                    className={styles.engravingEquipIconImage}
                    width={56}
                    src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_slot_engrave_over.png"
                    alt=""
                  />
                </div>
                <p className={styles.engravingEquipNameP}>없음</p>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <div className={styles.engravingBody}>
        {data.ArmoryEngraving && data.ArmoryEngraving.Effects ? (
          data.ArmoryEngraving.Effects.map((e: any, i: number) => {
            const name: string[] = e.Name.split(" Lv. ");
            const isNegativeEffect: boolean = name[0].includes("감소");
            return (
              <div
                key={`engEffects${i}`}
                className={styles.engravingEffectsDiv}
              >
                <img
                  className={styles.engravingEquipIconImage}
                  width={35}
                  src={`${LOAWA_ENG_ICON_URL}${engravingIconMap[name[0]]}`}
                  alt=""
                />
                <span className={isNegativeEffect ? "text-red-500" : ""}>
                  {name[0]}
                </span>
                <span style={{ color: engravingLevelColorMap[name[1]] }}>
                  {name[1]}
                </span>
              </div>
            );
          })
        ) : (
          <p>활성화된 각인 효과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ArmoryEGC;
/*
ArmoryGem{
  Gems	[Gem{
    Slot	integer($int32)
    Name	string
    Icon	string
    Level	integer($int32)
    Grade	string
    Tooltip	string
  }]
  Effects	[GemEffect{
    GemSlot	integer($int32)
    Name	string
    Description	string
    Icon	string
    Tooltip	string
  }]
}

ArmoryEngraving{
  Engravings	[Engraving{
    Slot	integer($int32)
    Name	string
    Icon	string
    Tooltip	string
  }]
  Effects	[Effect{
    Name	string
    Description	string
  }]
}

ArmorySkill{
  Name	string
  Icon	string
  Level	integer($int32)
  Type	string
  IsAwakening	boolean
  Tripods	[SkillTripod{
    Tier	integer($int32)
    Slot	integer($int32)
    Name	string
    Icon	string
    Level	integer($int32)
    IsSelected	boolean
    Tooltip	string
  }]
  Rune	SkillRune{
    Name	string
    Icon	string
    Grade	string
    Tooltip	string
  }
  Tooltip	string
}
*/
