import useApiTagParser from "@/hooks/useApiTagParser";
import styles from "@/styles/character/Body.module.scss";
import { gradeClassMap } from "@/types/CharacterType";
import {
  ArmoryEGCProps,
  engravingIconMap,
  engravingLevelColorMap,
  gradeCardBackgroundMap,
  gradeTextColorMap,
} from "@/types/EGCType";
import { useEffect, useState } from "react";

const ArmoryEGC: React.FC<ArmoryEGCProps> = ({
  data,
  setEngravingTooltipContent,
  setGemTooltipContent,
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
          Description: [effect.Name, effect.Description],
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
      // console.log(mergedGemInfo);
    }

    // console.log(engEquip);
  }, [data]);

  return (
    <div className={styles.infoContainerItemDiv}>
      <div className={`${styles.egcHeader} ${styles.engravingHeader}`}>
        <p className={styles.egcHeaderP}>장착 각인</p>
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
                  width={43}
                  src={`/images/${engravingIconMap[name[0]]}`}
                  alt=""
                />
                <span className={isNegativeEffect ? "text-red-500" : ""}>
                  {name[0]}
                </span>
                <p
                  className={styles.engravingLevel}
                  style={{
                    backgroundColor: engravingLevelColorMap[`${name[1]}d`],
                  }}
                >
                  {name[1]}
                </p>
              </div>
            );
          })
        ) : (
          <p>활성화된 각인 효과가 없습니다.</p>
        )}
      </div>
      <div className={styles.egcHeader}>
        <p className={styles.egcHeaderP}>장착 보석</p>
      </div>
      <div className={styles.gemBody}>
        {gemEquip && gemEquip[0] ? (
          gemEquip.map((e: any, i: number) => {
            return (
              <div
                data-tooltip-id="gemTooltip"
                onMouseEnter={() => {
                  setGemTooltipContent(e);
                }}
                className={styles.gemSlot}
                key={`gemSlot${i}`}
              >
                <img
                  className={`${styles.gemImg} ${gradeClassMap[e.Grade]}`}
                  src={e.Icon}
                  alt=""
                />
                <p className={styles.gemOption}>{e.ShortenedName}</p>
              </div>
            );
          })
        ) : (
          <p>장착중인 보석이 없습니다.</p>
        )}
      </div>
      <div className={styles.egcHeader}>
        <p className={styles.egcHeaderP}>장착 카드</p>
      </div>
      <div className={styles.cardBody}>
        {data.ArmoryCard?.Cards ? (
          <>
            <div className={styles.cardList}>
              {data.ArmoryCard.Cards.map((e: any) => {
                return (
                  <div className={styles.cardSlot}>
                    <div
                      className={styles.cardImageDiv}
                      data-grade={gradeCardBackgroundMap[e.Grade]}
                    >
                      <img src={e.Icon} className={styles.cardIcon} alt="" />
                      {e.AwakeTotal ? (
                        <div className={styles.awakeningDiv}>
                          {[1, 2, 3, 4, 5].map((a: number) => (
                            <img
                              src={
                                a <= e.AwakeCount
                                  ? "/images/gem_awakened.png"
                                  : "/images/gem_not_awakened.png"
                              }
                              alt="AwakeningSlot"
                            />
                          ))}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <p
                      style={{ color: gradeTextColorMap[e.Grade] }}
                      className={styles.cardTitle}
                    >
                      {e.Name}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className={styles.cardEffectsDiv}>
              {data.ArmoryCard.Effects.map((e: any) => {
                return (
                  <>
                    <p>세트 발동 효과 {e.Index + 1}</p>
                    {e.Items.map((e2: any) => (
                      <div>
                        <p>{e2.Name}</p>
                        <p>{e2.Description}</p>
                      </div>
                    ))}
                  </>
                );
              })}
            </div>
          </>
        ) : (
          <p>장착중인 카드가 없습니다.</p>
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

ArmoryCard{
  Cards	[Card{
    Slot	integer($int32)
    Name	string
    Icon	string
    AwakeCount	integer($int32)
    AwakeTotal	integer($int32)
    Grade	string
    Tooltip	string
  }]
  Effects	[CardEffect{
    Index	integer($int32)
    CardSlots	[integer($int32)]
    Items	[Effect{
      Name	[...]
      Description	[...]
    }]
  }]
}
*/
