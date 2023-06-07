import AlertOctagon from "@/components/icons/AlertOctagon";
import useApiTagParser from "@/hooks/useApiTagParser";
import styles from "@/styles/character/Body.module.scss";
import { gradeClassMap, gradeTextColorMap } from "@/types/GlobalType";
import {
  ArmoryTEGCProps,
  StatData,
  TendencyData,
  engravingIconMap,
  engravingLevelColorMap,
  gradeCardBackgroundMap,
  tendencyImageMap,
} from "@/types/TEGCType";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import GemTooltip from "../tooltips/GemTooltip";

const ArmoryTEGC: React.FC<ArmoryTEGCProps> = ({ data, className }) => {
  // console.log("ArmoryTEGC");
  const {
    parseEngravingPoint,
    parseGemName,
    parseApiDataToHtmlString: parse,
  } = useApiTagParser();
  const [engEquip, setEngEquip] = useState<any>();
  const [gemEquip, setGemEquip] = useState<any>(new Array(11));
  const [selectedCards, setSelectedCards] = useState<any>([]);
  const [myStats, setMyStats] = useState<any>(new Object());
  const [engravingTooltipContent, setEngravingTooltipContent] = useState<any>();
  const [gemTooltipContent, setGemTooltipContent] = useState<any>();
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

    // console.log(data.ArmoryProfile.Stats);
    const tmp_stats: { [key: string]: string } = {};
    data.ArmoryProfile?.Stats?.forEach((e: StatData) => {
      tmp_stats[e.Type] = e.Value;
    });
    setMyStats({ ...tmp_stats });

    // console.log(engEquip);
  }, []);

  return (
    <div className={className}>
      <div className={styles.tegcDiv}>
        <div className={styles.statsDiv}>
          <div className={styles.tegcHeader}>
            <span className={styles.tegcHeaderSpan}>기본 특성</span>
          </div>
          <div className={styles.statsBody}>
            {["공격력", "최대 생명력"].map((e: string) => {
              return (
                <p className={styles.statsP} key={`stats_${e}`}>
                  <span className={styles.statsSpan}>{e}</span> {myStats[e]}
                </p>
              );
            })}
          </div>
          <div className={styles.tegcHeader}>
            <span className={styles.tegcHeaderSpan}>전투 특성</span>
          </div>
          <div className={styles.statsBody}>
            {["치명", "특화", "신속", "제압", "인내", "숙련"].map(
              (e: string) => {
                return (
                  <p className={styles.statsP} key={`stats_${e}`}>
                    <span className={styles.statsSpan}>{e}</span> {myStats[e]}
                  </p>
                );
              }
            )}
          </div>
        </div>
        <div className={styles.tendencyDiv}>
          <div className={styles.tegcHeader}>
            <span className={styles.tegcHeaderSpan}>성향</span>
          </div>
          <div className={styles.tendencyBody}>
            {data.ArmoryProfile.Tendencies?.map((e: TendencyData) => {
              return (
                <div
                  className={styles.tendencyInnerDiv}
                  key={`tendency_${e.Type}`}
                >
                  <img src={tendencyImageMap[e.Type]} alt="" />
                  <div className={styles.tendencyContentDiv}>
                    <p className={styles.tendencyP}>
                      <span>{e.Type}</span>
                      <span>{e.Point}</span>
                    </p>
                    <div className={styles.tendencyBar}>
                      <div
                        className={styles.tendencyValueBar}
                        style={{ width: `${e.Point / 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.engravingDiv}>
          <div className={styles.tegcHeader}>
            <span className={styles.tegcHeaderSpan}>장착 각인</span>
          </div>
          <div className={styles.engravingHeader}>
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
                        width={28}
                        src={engEquip[e].Icon}
                        alt=""
                      />
                    </div>
                    <p className={styles.engravingEquipNameP}>
                      {engEquip[e].Name}
                    </p>
                    <p className={styles.engravingEquipPointP}>
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
                        width={36}
                        src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_slot_engrave_over.png"
                        alt=""
                      />
                    </div>
                    <p className={styles.engravingEquipNameP}>없음</p>
                  </div>
                );
              })
            ) : (
              <span>각인 미장착</span>
            )}
          </div>
          <div className={styles.tegcHeader}>
            <span className={styles.tegcHeaderSpan}>활성 각인</span>
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
                      width={33}
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
              <div className={styles.emptyTEGC}>
                <AlertOctagon size={110} color="#fff" width={2} />
                활성화된 각인 효과가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
      <div className={styles.tegcDiv}>
        <div className={styles.tegcHeader}>
          <p className={styles.tegcHeaderP}>장착 보석</p>
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
            <div className={styles.emptyTEGC}>
              <AlertOctagon size={110} color="#fff" width={2} /> 장착중인 보석이
              없습니다.
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className={styles.tegcDiv}>
        <div className={styles.tegcHeader}>
          <p className={styles.tegcHeaderP}>장착 카드</p>
        </div>
        <div className={styles.cardBody}>
          {data.ArmoryCard?.Cards ? (
            <>
              <div className={styles.cardList}>
                {data.ArmoryCard.Cards.map((e: any) => {
                  return (
                    <div key={`cardSlot${e.Slot}`} className={styles.cardSlot}>
                      <div
                        className={`${styles.cardImageDiv} ${
                          selectedCards.includes(e.Slot)
                            ? styles.selectedCardImageDiv
                            : ""
                        }`}
                        data-grade={gradeCardBackgroundMap[e.Grade]}
                      >
                        <img src={e.Icon} className={styles.cardIcon} alt="" />
                        {e.AwakeTotal ? (
                          <div className={styles.awakeningDiv}>
                            {[1, 2, 3, 4, 5].map((a: number) => (
                              <img
                                key={`cardImage${a}`}
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
                {data.ArmoryCard.Effects.map((e: any, i: number) => {
                  if (!e.Items.length) return;
                  return (
                    <div key={`cardSet${i}`} className={styles.cardSetDiv}>
                      <p className={styles.cardSetP}>
                        <span>세트 발동 효과 {e.Index + 1}</span>
                        <button
                          className={styles.cardIndicator}
                          onMouseEnter={() => {
                            const selectedSlots: number[] = [];
                            e.CardSlots.map((e: number) =>
                              selectedSlots.push(e)
                            );
                            setSelectedCards(selectedSlots);
                          }}
                          onMouseLeave={() => setSelectedCards([])}
                        >
                          세트 카드 표시
                        </button>
                      </p>
                      {e.Items.map((e2: any, i2: number) => (
                        <div
                          key={`cardSetDescr${i}-${i2}`}
                          className={styles.cardSetDetailDiv}
                        >
                          <p className={styles.cardSetDetailTitle}>{e2.Name}</p>
                          <p className={styles.cardSetDetailDescr}>
                            {parse(e2.Description.replace("<BR><BR>", "<BR>"))}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.emptyTEGC}>
              <AlertOctagon size={110} color="#fff" width={2} /> 장착중인 카드가
              없습니다.
            </div>
          )}
        </div>
      </div>
      <Tooltip
        id="engravingTooltip"
        className={`${styles.tooltip} ${styles.engravingTooltip}`}
        place="left"
        clickable={true}
        offset={12}
        delayHide={1}
      >
        {engravingTooltipContent ? engravingTooltipContent : "Loading..."}
      </Tooltip>
      <Tooltip
        id="gemTooltip"
        className={`${styles.tooltip} ${styles.gemTooltip}`}
        place="top"
        clickable={true}
        offset={12}
        delayHide={1}
      >
        {gemTooltipContent ? (
          <GemTooltip data={gemTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
    </div>
  );
};

export default ArmoryTEGC;
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
