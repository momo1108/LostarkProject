import styles from "@/styles/character/Body.module.scss";
import {
  ArmoryEAAProps,
  EAAPageStatus,
  EngravingsType,
  GemType,
  SiblingType,
  emptyAccessoryBackgroundMap,
  emptyAvatarBackgroundMap,
  emptyEquipmentBackgroundMap,
} from "@/types/EAAType";
import {
  engravingIconMap,
  gradeClassMap,
  gradeTextColorMap,
} from "@/types/GlobalType";
import EquipmentSlot from "../slots/EquipmentSlot";
import AccessorySlot from "../slots/AccessorySlot";
import AvatarSlot from "../slots/AvatarSlot";
import { useState, Fragment, useEffect, useCallback } from "react";
import { classImageMap } from "@/types/GlobalType";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import EquipmentTooltip from "../tooltips/EquipmentTooltip";
import AccessoryTooltip from "../tooltips/AccessoryTooltip";
import AvatarTooltip from "../tooltips/AvatarTooltip";
import useApiTagParser from "@/hooks/useApiTagParser";
import {
  GemData,
  StatData,
  TendencyData,
  engravingLevelColorMap,
  gradeCardBackgroundMap,
  tendencyImageMap,
} from "@/types/TEGCType";
import AlertOctagon from "@/components/icons/AlertOctagon";
import { engraveLevelColorMap } from "@/types/EngraveType";
import GemTooltip from "../tooltips/GemTooltip";
import { SkillData, tripodTierToColorMap } from "@/types/STType";
import { TripodType } from "@/types/TripodType";
import SkillTooltip from "../tooltips/SkillTooltip";
import RuneTooltip from "../tooltips/RuneTooltip";
import { Copy, Gem, Tripod } from "@/components/icons/Index";
import LostarkService from "@/service/LostarkService";
import Link from "next/link";

/*
아바타 왼쪽 : 무기, 무기
악기
이동 효과

오른쪽 : 머리, 머리
얼굴1
얼굴2
상의 상의
하의 하의

new Array(12)
최대 12개
*/
const ArmoryEAA: React.FC<ArmoryEAAProps> = ({
  className,
  data,
  equipment,
  accessory,
  avatar,
}) => {
  const {
    parseEngravingPointNumber,
    parseGemName,
    parseApiDataToHtmlString: parse,
    parseTextformat,
    parseSkillPoint,
  } = useApiTagParser();
  const [menu, setMenu] = useState<number>(0);
  const [siblingsInfo, setSiblingsInfo] = useState<{
    [key: string]: SiblingType[];
  }>({});
  const [pageStatus, setPageStatus] = useState<EAAPageStatus>("INIT");
  const [myStats, setMyStats] = useState<any>(new Object());
  const [equipmentTooltipContent, setEquipmentTooltipContent] = useState<any>();
  const [accessoryTooltipContent, setAccessoryTooltipContent] = useState<any>();
  const [avatarTooltipContent, setAvatarTooltipContent] = useState<any>();
  const [statsTooltipContent, setStatsTooltipContent] = useState<any>();
  const [engravingTooltipContent, setEngravingTooltipContent] = useState<any>();
  const [engEquip, setEngEquip] = useState<{ [key: string]: number }>({});
  const [gemTooltipContent, setGemTooltipContent] = useState<any>();
  const [skillDataList, setSkillDataList] = useState<SkillData[]>();
  const [skillTooltipContent, setSkillTooltipContent] = useState<string>();
  const [tripodTooltipContent, setTripodTooltipContent] = useState<string>();
  const [runeTooltipContent, setRuneTooltipContent] = useState<string>();
  const [gemEquip, setGemEquip] = useState<{
    멸화: GemType[];
    홍염: GemType[];
  }>({ 멸화: [], 홍염: [] });
  const [selectedCards, setSelectedCards] = useState<any>([]);
  type CardEffectType = {
    CardSlots: number[];
    Index: number;
    Name: string;
    Description: string[][];
  };
  const [cardEffects, setCardEffects] = useState<CardEffectType[]>([]);

  const setTripodInfo = useCallback(
    (tripods: TripodType[], slot: Array<TripodType>) => {
      tripods.map((e: TripodType) => {
        if (e.IsSelected) slot[e.Tier] = e;
      });
      return slot;
    },
    []
  );

  useEffect(() => {
    console.log(data);

    // 원정대
    setPageStatus("LOADING_SIBLINGS");
    LostarkService.getCharacterSiblings(data.ArmoryProfile.CharacterName)
      .then((res) => {
        console.log(res);
        const tmp_siblingsInfo: { [key: string]: SiblingType[] } = {};
        res.data.forEach((sibling) => {
          if (tmp_siblingsInfo.hasOwnProperty(sibling.ServerName)) {
            tmp_siblingsInfo[sibling.ServerName] = [
              ...tmp_siblingsInfo[sibling.ServerName],
              sibling,
            ];
          } else {
            tmp_siblingsInfo[sibling.ServerName] = [sibling];
          }
        });
        Object.keys(tmp_siblingsInfo).forEach((server) => {
          tmp_siblingsInfo[server].sort(
            (a, b) =>
              parseFloat(b.ItemMaxLevel.replace(",", "")) -
              parseFloat(a.ItemMaxLevel.replace(",", ""))
          );
        });
        setSiblingsInfo(tmp_siblingsInfo);
        // console.log(tmp_siblingsInfo);
      })
      .catch((error) => {
        setPageStatus("ERROR");
      });

    // 각인
    if (data.ArmoryEngraving?.Engravings) {
      console.log(data.ArmoryEngraving.Engravings);
      setEngEquip(
        data.ArmoryEngraving.Engravings.map((engraving: EngravingsType) => ({
          ...engraving,
          Tooltip: JSON.parse(engraving.Tooltip),
        })).reduce((prev: { [key: string]: number }, cur: EngravingsType) => {
          const currentPoint = parseEngravingPointNumber(
            cur.Tooltip.Element_001.value.leftText
          );
          if (prev.hasOwnProperty(cur.Name)) {
            return { ...prev, [cur.Name]: prev[cur.Name] + currentPoint };
          } else {
            return { ...prev, [cur.Name]: currentPoint };
          }
        }, {})
      );
    }

    // 보석
    if (data.ArmoryGem?.Gems) {
      const mergedGemInfo: GemType[] = data.ArmoryGem.Gems.map((gem: any) => {
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

      let tmpGemEquip: {
        멸화: GemType[];
        홍염: GemType[];
      } = {
        멸화: [],
        홍염: [],
      };
      mergedGemInfo.forEach((gemInfo) => {
        tmpGemEquip[gemInfo.Type === 0 ? "멸화" : "홍염"].push(gemInfo);
      });

      tmpGemEquip["멸화"].sort((a: any, b: any) => {
        return a.Type === b.Type
          ? a.Level === b.Level
            ? a.Slot - b.Slot
            : b.Level - a.Level
          : a.Type - b.Type;
      });
      tmpGemEquip["홍염"].sort((a: any, b: any) => {
        return a.Type === b.Type
          ? a.Level === b.Level
            ? a.Slot - b.Slot
            : b.Level - a.Level
          : a.Type - b.Type;
      });

      setGemEquip(tmpGemEquip);
    }

    // 스탯
    const tmpStats: { [key: string]: [string, Array<string>] } = {};
    data.ArmoryProfile?.Stats?.forEach((e: StatData) => {
      tmpStats[e.Type] = [e.Value, e.Tooltip];
    });
    setMyStats({ ...tmpStats });

    // 스킬
    const tmpSkill: SkillData[] = [];

    data.ArmorySkills?.forEach((e: SkillData) => {
      // console.log(
      //   Object.keys(JSON.parse(e.Tooltip)).length,
      //   JSON.parse(e.Tooltip)
      // );
      if (e.Level > 1 || e.Rune) {
        const tmp_tripod = new Array(3);
        e.UsedTripods = setTripodInfo(e.Tripods, tmp_tripod);
        tmpSkill.push(e);
      }
    });

    tmpSkill.map((e: SkillData) => {
      e.Gems = [];
      data.ArmoryGem?.Effects?.forEach((g: GemData) => {
        if (e.Name === g.Name) {
          e.Gems.push({
            ...data.ArmoryGem.Gems[g.GemSlot],
            Description: g.Description,
          });
        }
      });
      return e;
    });

    console.log(tmpSkill);
    setSkillDataList(tmpSkill);

    // 카드
    const tmpCard: CardEffectType[] = [];
    data.ArmoryCard?.Effects?.forEach(
      (effect: {
        CardSlots: number[];
        Index: number;
        Items: { Name: string; Description: string }[];
      }) => {
        if (effect.Items.length) {
          const pattern = /[0-9]{1,2}세트|각성합계/g;
          const splitName = effect.Items[0].Name.split(" ");

          const endPoint = pattern.exec(splitName[splitName.length - 1])
            ? pattern.exec(splitName[splitName.length - 2])
              ? splitName.length - 2
              : splitName.length - 1
            : splitName.length;

          const Name = splitName.slice(0, endPoint).join(" ");
          const Description = effect.Items.map((item) => [
            item.Name.slice(Name.length + 1),
            item.Description,
          ]);

          tmpCard.push({
            CardSlots: effect.CardSlots,
            Index: effect.Index,
            Name,
            Description,
          });
        }
      }
    );

    setCardEffects(tmpCard);
  }, []);

  useEffect(() => {
    if (Object.keys(siblingsInfo).length) setPageStatus("DONE");
  }, [siblingsInfo]);

  function emptyAvatarChecker(e: number): React.ReactElement {
    if (avatar[e]) {
      return (
        <AvatarSlot
          key={`avatarSlot${e}`}
          contentSetter={() => {
            setAvatarTooltipContent(avatar[e]);
          }}
          grade={gradeClassMap[avatar[e].Grade]}
          iconUrl={avatar[e].Icon}
        />
      );
    } else {
      if ([1, 5, 9, 11].includes(e)) {
        if (avatar[e - 1] && avatar[e - 1].IsInner)
          return (
            <div
              key={`avatarSlot${e}`}
              className={`${styles.profileAvatarSlot} ${
                styles.profileEmptySlot
              } ${styles[emptyAvatarBackgroundMap[e]]}`}
            />
          );
        else return <Fragment key={`avatarSlot${e}`} />;
      } else
        return (
          <div
            key={`avatarSlot${e}`}
            className={`${styles.profileAvatarSlot} ${
              styles.profileEmptySlot
            } ${styles[emptyAvatarBackgroundMap[e]]}`}
          />
        );
    }
  }
  // console.log("ArmoryProfile");
  // 서버 길드이름
  // 닉네임 칭호
  // 원정대레벨 영지레벨
  // 직업 템레벨
  return (
    <div className={className}>
      <div className={styles.profileDiv}>
        <div className={styles.infoHeader}>
          <span className={styles.infoHeaderSpan}>프로필</span>
        </div>
        <div className={styles.profileHeader}>
          <div className={styles.profileUserDiv}>
            <div
              className={styles.siblingsDiv}
              data-tooltip-id="siblingsTooltip"
            >
              <Copy size={15} fill="#eee" />
              <p>원정대 캐릭터 보기</p>
            </div>
            <div className={styles.scDiv}>
              <span className={styles.profileCategorySpan}>
                @{data.ArmoryProfile.ServerName || "서버없음"}
              </span>
              <p className={styles.profileClassP}>
                <img
                  className={styles.classImg}
                  src={`/images/${
                    classImageMap[data.ArmoryProfile.CharacterClassName]
                  }`}
                  alt=""
                />
                <span className={styles.profileClassSpan}>
                  {data.ArmoryProfile.CharacterClassName}
                </span>
              </p>
            </div>
            <div className={styles.nicknameDiv}>
              <span className={styles.nameSpan}>
                {data.ArmoryProfile.CharacterName}
              </span>
              {data.ArmoryProfile.Title ? (
                <span className={styles.titleSpan}>
                  {data.ArmoryProfile.Title}
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className={styles.profileLevelDiv}>
            <div className={styles.innerLevelDiv}>
              <span className={styles.profileCategorySpan}>원정대</span>
              <div className={styles.levelDiv}>
                Lv.{" "}
                <span className={styles.levelSpan}>
                  {data.ArmoryProfile.ExpeditionLevel}
                </span>
              </div>
            </div>
            <div className={styles.innerLevelDiv}>
              <span className={styles.profileCategorySpan}>아이템</span>
              <div className={styles.levelDiv}>
                Lv.{" "}
                <span className={styles.levelSpan}>
                  {data.ArmoryProfile.ItemAvgLevel.replace(",", "")}
                </span>
              </div>
            </div>
            <div className={styles.innerLevelDiv}>
              <span className={styles.profileCategorySpan}>전투</span>
              <div className={styles.levelDiv}>
                Lv.{" "}
                <span className={styles.levelSpan}>
                  {data.ArmoryProfile.CharacterLevel}
                </span>
              </div>
            </div>
          </div>
          {/* <p className={styles.profileHeaderLine}>
            <span className={styles.profileCategorySpan}>영지</span>
            <span>
              {data.ArmoryProfile.TownName}
              {data.ArmoryProfile.TownLevel
                ? " Lv." + data.ArmoryProfile.TownLevel
                : ""}
            </span>
          </p> */}
        </div>
        <div className={styles.profileBody}>
          <div className={styles.profileMenu}>
            <p
              className={`${styles.profileMenuButton} ${
                menu === 0 ? styles.active : ""
              }`}
              onClick={() => {
                setMenu(0);
              }}
            >
              장비
            </p>
            <p
              className={`${styles.profileMenuButton} ${
                menu === 1 ? styles.active : ""
              }`}
              onClick={() => {
                setMenu(1);
              }}
            >
              아바타
            </p>
          </div>
          {menu === 0 ? (
            <>
              <div className={styles.profileEquipmentDiv}>
                {equipment
                  ? [0, 1, 2, 3, 4, 5].map((e: number) =>
                      equipment[e] ? (
                        <EquipmentSlot
                          key={`equipSlot${e}`}
                          grade={gradeClassMap[equipment[e].Grade]}
                          honing={equipment[e].Name.split(" ")[0]}
                          iconUrl={equipment[e].Icon}
                          showQuality={
                            ["유물", "고대", "에스더"].includes(
                              equipment[e].Grade
                            ) &&
                            parseFloat(
                              data.ArmoryProfile.ItemAvgLevel.replace(",", "")
                            ) >= 1415
                          }
                          qualityValue={
                            equipment[e].Tooltip.Element_001.value.qualityValue
                          }
                          contentSetter={() => {
                            setEquipmentTooltipContent(equipment[e]);
                          }}
                        />
                      ) : (
                        <div
                          key={`emptyEquipmentSlot${e}`}
                          className={`${styles.profileEquipmentSlot} ${
                            styles.profileEmptySlot
                          } ${styles[emptyEquipmentBackgroundMap[e]]}`}
                        ></div>
                      )
                    )
                  : ""}
              </div>
              <div className={styles.profileAccessoryDiv}>
                {accessory
                  ? [0, 1, 2, 3, 4, 5, 6].map((e: number) =>
                      accessory[e] ? (
                        <AccessorySlot
                          key={`accessorySlot${e}`}
                          grade={gradeClassMap[accessory[e].Grade]}
                          iconUrl={accessory[e].Icon}
                          qualityValue={
                            accessory[e].Tooltip.Element_001.value.qualityValue
                          }
                          showQuality={
                            !(
                              accessory[e].Type == "팔찌" ||
                              accessory[e].Type == "어빌리티 스톤"
                            ) &&
                            parseFloat(
                              data.ArmoryProfile.ItemAvgLevel.replace(",", "")
                            ) >= 1415
                          }
                          option={
                            accessory[e].Tooltip.Element_005.value.Element_001
                          }
                          contentSetter={() => {
                            setAccessoryTooltipContent(accessory[e]);
                          }}
                        />
                      ) : (
                        <div
                          key={`emptyAccessorySlot${e}`}
                          className={`${styles.profileAccessorySlot} ${
                            styles.profileEmptySlot
                          } ${styles[emptyAccessoryBackgroundMap[e]]}`}
                        ></div>
                      )
                    )
                  : ""}
              </div>
            </>
          ) : (
            <>
              <div className={styles.profileAvatarDiv} data-direction="left">
                <div className={styles.profileAvatarSubAscDiv}>
                  {[0, 1].map((e: number) => {
                    return emptyAvatarChecker(e);
                  })}
                </div>
                {emptyAvatarChecker(2)}
                <div className={styles.blankAvatarSlot} />

                {emptyAvatarChecker(3)}
                <div className={styles.blankAvatarSlot} />
                <div className={styles.blankAvatarSlot} />
              </div>

              <div className={styles.profileAvatarDiv} data-direction="right">
                <div className={styles.profileAvatarSubDescDiv}>
                  {[4, 5].map((e: number) => {
                    return emptyAvatarChecker(e);
                  })}
                </div>
                {emptyAvatarChecker(6)}
                {emptyAvatarChecker(7)}
                <div className={styles.blankAvatarSlot} />
                <div className={styles.profileAvatarSubDescDiv}>
                  {[8, 9].map((e: number) => {
                    return emptyAvatarChecker(e);
                  })}
                </div>
                <div className={styles.profileAvatarSubDescDiv}>
                  {[10, 11].map((e: number) => {
                    return emptyAvatarChecker(e);
                  })}
                </div>
              </div>
            </>
          )}

          <img
            loading="lazy"
            className={styles.profileImage}
            src={data.ArmoryProfile.CharacterImage}
            alt=""
          />
        </div>
      </div>
      <div className={styles.stDiv}>
        <div className={styles.statsDiv}>
          <div className={styles.infoHeader}>
            <span className={styles.infoHeaderSpan}>기본 특성</span>
          </div>
          <div className={styles.statsBody}>
            {["공격력", "최대 생명력"].map((e: string) => {
              return (
                <p
                  data-tooltip-id="statsTooltip"
                  onMouseEnter={() => {
                    if (myStats[e]) setStatsTooltipContent(myStats[e][1]);
                  }}
                  className={styles.statsP}
                  key={`stats_${e}`}
                >
                  <span className={styles.statsSpan}>{e}</span>{" "}
                  {myStats[e] ? myStats[e][0] : "0"}
                </p>
              );
            })}
          </div>
          <div className={styles.infoHeader}>
            <span className={styles.infoHeaderSpan}>전투 특성</span>
          </div>
          <div className={styles.statsBody}>
            {["치명", "특화", "신속", "제압", "인내", "숙련"].map(
              (e: string) => {
                return (
                  <p
                    data-tooltip-id="statsTooltip"
                    onMouseEnter={() => {
                      if (myStats[e]) setStatsTooltipContent(myStats[e][1]);
                    }}
                    className={styles.statsP}
                    key={`stats_${e}`}
                  >
                    <span className={styles.statsSpan}>{e}</span>{" "}
                    {myStats[e] ? myStats[e][0] : "0"}
                  </p>
                );
              }
            )}
          </div>
        </div>
        <div className={styles.tendencyDiv}>
          <div className={styles.infoHeader}>
            <span className={styles.infoHeaderSpan}>성향</span>
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
      </div>
      <div className={styles.egDiv}>
        <div className={styles.engravingDiv}>
          <div className={styles.infoHeader}>
            <span className={styles.infoHeaderSpan}>활성 각인</span>
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
                    <p
                      className={`${styles.engravingNameP}${
                        isNegativeEffect ? " text-red-500" : ""
                      }`}
                    >
                      {name[0]}
                      <span
                        className={`${
                          engraveLevelColorMap[
                            Math.min(3, engEquip[name[0]] / 3 - 1)
                          ]
                        }Color`}
                      >
                        {engEquip[name[0]] ? ` (+${engEquip[name[0]]})` : ""}
                      </span>
                    </p>
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
              <div className={styles.emptyInfo}>
                <AlertOctagon size={140} color="#fff" width={2} />
                활성화된 각인 효과가 없습니다.
              </div>
            )}
          </div>
        </div>
        <div className={styles.gemDiv}>
          <div className={styles.infoHeader}>
            <span className={styles.infoHeaderSpan}>장착 보석</span>
          </div>
          <div className={styles.gemBody}>
            <div className={styles.nemesisJewelDiv}>
              <div className={styles.jewelHeader}>
                {gemEquip["멸화"].length} 멸화 - Lv.{" "}
                {gemEquip["멸화"].length
                  ? Math.round(
                      (gemEquip["멸화"].reduce(
                        (prev: number, cur) => prev + cur.Level,
                        0
                      ) /
                        gemEquip["멸화"].length) *
                        10
                    ) / 10
                  : 0}
              </div>
              {gemEquip["멸화"][0] ? (
                gemEquip["멸화"].map((e: any, i: number) => {
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
                <div className={styles.emptyInfo}>
                  <AlertOctagon size={55} color="#fff" width={2} /> 장착중인
                  멸화 보석이 없습니다.
                </div>
              )}
            </div>
            <div className={styles.frostfireJewelDiv}>
              <div className={styles.jewelHeader}>
                {gemEquip["홍염"].length} 홍염 - Lv.{" "}
                {gemEquip["홍염"].length
                  ? Math.round(
                      (gemEquip["홍염"].reduce(
                        (prev: number, cur) => prev + cur.Level,
                        0
                      ) /
                        gemEquip["홍염"].length) *
                        10
                    ) / 10
                  : 0}
              </div>
              {gemEquip["홍염"][0] ? (
                gemEquip["홍염"].map((e: any, i: number) => {
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
                <div className={styles.emptyInfo}>
                  <AlertOctagon size={55} color="#fff" width={2} /> 장착중인
                  홍염 보석이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardDiv}>
        <div className={styles.infoHeader}>
          <span className={styles.infoHeaderSpan}>장착 카드</span>
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
                {cardEffects.map((e, i: number) => {
                  return (
                    <div key={`cardSet${i}`} className={styles.cardSetDiv}>
                      <p className={styles.cardSetP}>
                        <span className={styles.cardSetTitleSpan}>
                          {e.Name}
                        </span>
                        <button
                          className={styles.cardIndicator}
                          onMouseEnter={() => {
                            setSelectedCards(e.CardSlots);
                          }}
                          onMouseLeave={() => setSelectedCards([])}
                        >
                          세트 카드 표시
                        </button>
                      </p>
                      {e.Description.map((descr, descrIndex) => (
                        <div
                          key={`cardSet${i}_${descrIndex}`}
                          className={styles.cardEffectDescrDiv}
                        >
                          <p className={styles.nameP}>{descr[0]}</p>
                          <p className={styles.descrP}>{descr[1]}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.emptyInfo}>
              <AlertOctagon size={110} color="#fff" width={2} /> 장착중인 카드가
              없습니다.
            </div>
          )}
        </div>
      </div>
      <div className={styles.skillDiv}>
        <div className={styles.infoHeader}>
          <span className={styles.infoHeaderSpan}>장착 스킬</span>
        </div>
        <div className={`hideScroll ${styles.skillBody}`}>
          {skillDataList ? (
            skillDataList.length ? (
              skillDataList.map((sd) => {
                return (
                  <Fragment key={`skillSlot_${sd.Name}`}>
                    <div className={styles.singleSkillDiv}>
                      <div className={styles.skillId}>
                        <div
                          className={styles.skillIconSlot}
                          data-tooltip-id="skillTooltip"
                          onMouseEnter={() => {
                            setSkillTooltipContent(JSON.parse(sd.Tooltip));
                          }}
                        >
                          <img
                            src={sd.Icon}
                            className={styles.skillIcon}
                            alt=""
                          />
                        </div>
                        <div className={styles.skillDescr}>
                          <p className={styles.skillLevelP}>
                            Lv. {parseSkillPoint(sd.Level)}
                          </p>
                          <p className={styles.skillNameP}>{sd.Name}</p>
                        </div>
                      </div>
                      <div className={styles.skillTripods}>
                        {[0, 1, 2].map((tripodIndex: number) => {
                          return (
                            <Fragment key={`${sd.Name}_tripod${tripodIndex}`}>
                              {sd.UsedTripods[tripodIndex] ? (
                                <div
                                  data-tooltip-id="tripodTooltip"
                                  onMouseEnter={() => {
                                    setTripodTooltipContent(
                                      sd.UsedTripods[tripodIndex].Tooltip
                                    );
                                  }}
                                  className={styles.usedTripod}
                                >
                                  <img
                                    src={sd.UsedTripods[tripodIndex].Icon}
                                    alt=""
                                  />
                                  <p className={styles.tripodSlot}>
                                    {sd.UsedTripods[tripodIndex].Slot}
                                  </p>
                                  <div
                                    className={`${styles.tripodDescrItem} ${
                                      tripodTierToColorMap[
                                        sd.UsedTripods[tripodIndex].Tier
                                      ]
                                    }`}
                                    key={`${sd.Name}_${sd.UsedTripods[tripodIndex].Name}`}
                                  >
                                    <p className={styles.tripodNameP}>
                                      {sd.UsedTripods[tripodIndex].Name}
                                    </p>
                                    <p>
                                      Lv. {sd.UsedTripods[tripodIndex].Level}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.emptyTripod}>
                                  <div className={styles.emptyIconWrapper}>
                                    <Tripod size={30} />
                                  </div>
                                </div>
                              )}
                            </Fragment>
                          );
                        })}
                      </div>
                      <div className={styles.skillGr}>
                        <div className={styles.skillGems}>
                          {[0, 1].map((gemIndex: number) => {
                            return (
                              <div
                                className={styles.gemSlot}
                                key={`${sd.Name}_gemSlot${gemIndex}`}
                              >
                                {sd.Gems[gemIndex] ? (
                                  <div
                                    className={`${styles.gemWrapper} ${
                                      gradeClassMap[sd.Gems[gemIndex].Grade]
                                    }`}
                                  >
                                    <img
                                      className={styles.gemImg}
                                      src={sd.Gems[gemIndex].Icon}
                                      alt=""
                                    />
                                    <p className={styles.gemOption}>{`${
                                      sd.Gems[gemIndex].Level
                                    }${
                                      sd.Gems[gemIndex].Description.startsWith(
                                        "피해"
                                      )
                                        ? "멸"
                                        : "홍"
                                    }`}</p>
                                  </div>
                                ) : (
                                  <div className={styles.emptyIconWrapper}>
                                    <Gem size={25} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div
                          data-tooltip-id={sd.Rune ? "runeTooltip" : ""}
                          onMouseEnter={() => {
                            sd.Rune
                              ? setRuneTooltipContent(
                                  JSON.parse(sd.Rune.Tooltip)
                                )
                              : "";
                          }}
                          className={`${styles.skillRune} ${
                            gradeClassMap[sd.Rune?.Grade]
                          }`}
                        >
                          {sd.Rune ? (
                            <>
                              <img src={sd.Rune.Icon} alt="" />
                              <p
                                className={`${styles.runeNameP} ${
                                  gradeTextColorMap[sd.Rune.Grade]
                                }`}
                              >
                                {sd.Rune.Name}
                              </p>
                            </>
                          ) : (
                            <img
                              className={styles.emptyRune}
                              src={"/images/runeStone.png"}
                              alt=""
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <hr />
                  </Fragment>
                );
              })
            ) : (
              <div className={styles.emptyInfo}>
                <AlertOctagon size={110} color="#fff" width={2} /> 사용중인
                스킬이 없습니다.
              </div>
            )
          ) : (
            "로딩중"
          )}
        </div>
      </div>
      <Tooltip
        id="siblingsTooltip"
        className="tooltip siblingsTooltip"
        place="bottom"
        clickable={true}
        offset={6}
        openOnClick={true}
      >
        {pageStatus === "DONE" ? (
          <div className="siblingsTooltip">
            {Object.keys(siblingsInfo)
              .sort((a, b) => {
                return siblingsInfo[b].length === siblingsInfo[a].length
                  ? a < b
                    ? -1
                    : 1
                  : siblingsInfo[b].length - siblingsInfo[a].length;
              })
              .map((server) => {
                return (
                  <div className="serverDiv" key={`siblings_server_${server}`}>
                    <p className="serverNameP">{server}</p>
                    {siblingsInfo[server].map((character) => (
                      <Link
                        href={`/character/${character.CharacterName}`}
                        className="characterDiv"
                        key={`siblings_server_${server}_character_${character.CharacterName}`}
                      >
                        <p
                          className="characterNameP"
                          title={character.CharacterName}
                        >
                          {character.CharacterName}
                        </p>
                        <p className="characterLevelClassP">
                          <span>Lv. {character.ItemMaxLevel}</span>
                          <span>{character.CharacterClassName}</span>
                        </p>
                      </Link>
                    ))}
                  </div>
                );
              })}
          </div>
        ) : pageStatus === "LOADING_SIBLINGS" ? (
          <div>Loading...</div>
        ) : (
          <div>에러발생</div>
        )}
      </Tooltip>
      <Tooltip
        id="equipmentTooltip"
        className="tooltip equipmentTooltip"
        place="bottom"
        clickable={true}
      >
        {equipmentTooltipContent ? (
          <EquipmentTooltip data={equipmentTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
      <Tooltip
        id="accessoryTooltip"
        className="tooltip accessoryTooltip"
        place="bottom"
        clickable={true}
        delayHide={10}
      >
        {accessoryTooltipContent ? (
          <AccessoryTooltip data={accessoryTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
      <Tooltip
        id="avatarTooltip"
        className="tooltip avatarTooltip"
        place="bottom"
        clickable={true}
        offset={16}
        delayHide={1}
      >
        {avatarTooltipContent ? (
          <AvatarTooltip data={avatarTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
      <Tooltip
        id="statsTooltip"
        className="tooltip statsTooltip"
        place="bottom"
        clickable={true}
        delayHide={1}
      >
        <ul>
          {statsTooltipContent ? (
            statsTooltipContent.map((e: string, i: number) => {
              const tmp: string = parseTextformat(e);
              return <li key={`stats_tooltip_line_${i}`}> {parse(tmp)}</li>;
            })
          ) : (
            <li>"Loading..."</li>
          )}
        </ul>
      </Tooltip>
      <Tooltip
        id="engravingTooltip"
        className="tooltip engravingTooltip"
        place="bottom"
        clickable={true}
        offset={12}
        delayHide={1}
      >
        {engravingTooltipContent ? engravingTooltipContent : "Loading..."}
      </Tooltip>
      <Tooltip
        id="gemTooltip"
        className="tooltip gemTooltip"
        place="bottom"
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
      <Tooltip
        id="skillTooltip"
        className="tooltip skillTooltip"
        place="bottom"
        clickable={true}
        offset={6}
        delayHide={1}
      >
        {skillTooltipContent ? (
          <SkillTooltip data={skillTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
      <Tooltip
        id="tripodTooltip"
        className="tooltip tripodTooltip"
        place="bottom"
        clickable={true}
        offset={6}
        delayHide={1}
      >
        {tripodTooltipContent ? parse(tripodTooltipContent) : "Loading..."}
      </Tooltip>
      <Tooltip
        id="runeTooltip"
        className="tooltip runeTooltip"
        place="bottom"
        clickable={true}
        offset={6}
        delayHide={1}
      >
        {runeTooltipContent ? (
          <RuneTooltip data={runeTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
    </div>
  );
};

export default ArmoryEAA;
