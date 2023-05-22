import useApiTagParser from "@/hooks/useApiTagParser";
import styles from "@/styles/character/Body.module.scss";
import {
  ArmoryEGCProps,
  engravingIconMap,
  engravingLevelColorMap,
} from "@/types/EGCType";
import { useEffect, useState } from "react";

const ArmoryEGC: React.FC<ArmoryEGCProps> = ({
  data,
  setEngravingTooltipContent,
}) => {
  // console.log("ArmoryEGC");
  const { parseEngravingPoint, parseGemName } = useApiTagParser();
  const [engEquip, setEngEquip] = useState<any>();
  const [gemEquip, setGemEquip] = useState<any>(new Array(11));
  useEffect(() => {
    if (data.ArmoryEngraving?.Engravings) {
      setEngEquip(
        data.ArmoryEngraving.Engravings.map((e: any) => ({
          ...e,
          Tooltip: JSON.parse(e.Tooltip),
        }))
      );
    } else setEngEquip(new Array(2));

    if (data.ArmoryGem?.Gems) {
      const mergedGemInfo: [] = data.ArmoryGem.Gems.map((gem: any) => {
        const effect = data.ArmoryGem.Effects.find(
          (ef: any) => ef.GemSlot === gem.Slot
        );
        const [ShortenedName, Type] = parseGemName(gem.Name);
        return {
          ...gem,
          SkillIcon: effect.Icon,
          Description: `${effect.Name} : ${effect.Description}`,
          ShortenedName,
          Type,
        };
      });
      mergedGemInfo.sort((a: any, b: any) => {
        return a.Type === b.Type
          ? a.Level === b.Level
            ? a.Slot - b.Slot
            : b.Level - a.Level
          : a.Type - b.Type;
      });
      setGemEquip(mergedGemInfo);
      console.log(mergedGemInfo);
    }

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
                data-tooltip-id="engravingTooltip"
                onMouseEnter={() => {
                  setEngravingTooltipContent(e.Description);
                }}
                className={styles.engravingEffectsDiv}
              >
                <img
                  className={styles.engravingEquipIconImage}
                  width={35}
                  src={`/images/${engravingIconMap[name[0]]}`}
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
      <div className={styles.gemHeader}>
        <p className={styles.gemHeaderP}>장착 보석</p>
      </div>
      <div className={styles.gemBody}>
        {gemEquip && gemEquip[0] ? (
          gemEquip.map((e: any, i: number) => {
            return (
              <div key={`gemSlot${i}`}>
                <img src={e.Icon} alt="" />
                <p>{e.ShortenedName}</p>
              </div>
            );
          })
        ) : (
          <p>장착중인 보석이 없습니다.</p>
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
