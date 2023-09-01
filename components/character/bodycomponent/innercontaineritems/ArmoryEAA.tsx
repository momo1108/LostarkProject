import styles from "@/styles/character/Body.module.scss";
import {
  ArmoryEAAProps,
  EngravingsType,
  GemType,
  emptyAccessoryBackgroundMap,
  emptyAvatarBackgroundMap,
  emptyEquipmentBackgroundMap,
} from "@/types/EAAType";
import { engravingIconMap, gradeClassMap } from "@/types/GlobalType";
import EquipmentSlot from "../slots/EquipmentSlot";
import AccessorySlot from "../slots/AccessorySlot";
import AvatarSlot from "../slots/AvatarSlot";
import { useState, Fragment, useEffect } from "react";
import { classImageMap } from "@/types/GlobalType";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import EquipmentTooltip from "../tooltips/EquipmentTooltip";
import AccessoryTooltip from "../tooltips/AccessoryTooltip";
import AvatarTooltip from "../tooltips/AvatarTooltip";
import useApiTagParser from "@/hooks/useApiTagParser";
import {
  StatData,
  TendencyData,
  engravingLevelColorMap,
  tendencyImageMap,
} from "@/types/TEGCType";
import AlertOctagon from "@/components/icons/AlertOctagon";
import { engraveLevelColorMap } from "@/types/EngraveType";
import GemTooltip from "../tooltips/GemTooltip";

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
  } = useApiTagParser();
  const [menu, setMenu] = useState<number>(0);
  const [myStats, setMyStats] = useState<any>(new Object());
  const [equipmentTooltipContent, setEquipmentTooltipContent] = useState<any>();
  const [accessoryTooltipContent, setAccessoryTooltipContent] = useState<any>();
  const [avatarTooltipContent, setAvatarTooltipContent] = useState<any>();
  const [statsTooltipContent, setStatsTooltipContent] = useState<any>();
  const [engravingTooltipContent, setEngravingTooltipContent] = useState<any>();
  const [engEquip, setEngEquip] = useState<{ [key: string]: number }>({});
  const [gemTooltipContent, setGemTooltipContent] = useState<any>();
  const [gemEquip, setGemEquip] = useState<{
    멸화: GemType[];
    홍염: GemType[];
  }>({ 멸화: [], 홍염: [] });

  useEffect(() => {
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

      let tmp_GemEquip: {
        멸화: GemType[];
        홍염: GemType[];
      } = {
        멸화: [],
        홍염: [],
      };
      mergedGemInfo.forEach((gemInfo) => {
        tmp_GemEquip[gemInfo.Type === 0 ? "멸화" : "홍염"].push(gemInfo);
      });

      tmp_GemEquip["멸화"].sort((a: any, b: any) => {
        return a.Type === b.Type
          ? a.Level === b.Level
            ? a.Slot - b.Slot
            : b.Level - a.Level
          : a.Type - b.Type;
      });
      tmp_GemEquip["홍염"].sort((a: any, b: any) => {
        return a.Type === b.Type
          ? a.Level === b.Level
            ? a.Slot - b.Slot
            : b.Level - a.Level
          : a.Type - b.Type;
      });

      setGemEquip(tmp_GemEquip);
    }

    // 스탯
    const tmp_stats: { [key: string]: [string, Array<string>] } = {};
    data.ArmoryProfile?.Stats?.forEach((e: StatData) => {
      tmp_stats[e.Type] = [e.Value, e.Tooltip];
    });
    setMyStats({ ...tmp_stats });
  }, []);

  useEffect(() => {
    console.log(gemEquip);
  }, [gemEquip]);

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
          <p className={styles.profileHeaderLine}>
            <span className={styles.profileServerSpan}>
              @{data.ArmoryProfile.ServerName || "서버없음"}
            </span>
            <span className={styles.profileNameSpan}>
              [ <b>Lv.{data.ArmoryProfile.CharacterLevel}</b>{" "}
              <span>{data.ArmoryProfile.CharacterName}</span> ]
            </span>
            <img
              src={`/images/${
                classImageMap[data.ArmoryProfile.CharacterClassName]
              }`}
              alt=""
            />
            <span className={styles.profileClassSpan}>
              {data.ArmoryProfile.CharacterClassName}
            </span>
          </p>
          <p className={styles.profileHeaderLine}>
            <span className={styles.profileCategorySpan}>아이템 레벨</span>
            <span>{data.ArmoryProfile.ItemAvgLevel.replace(",", "")}</span>
            <span className={styles.profileCategorySpan}>원정대 레벨</span>
            <span>{data.ArmoryProfile.ExpeditionLevel}</span>
          </p>
          <p className={styles.profileHeaderLine}>
            <span className={styles.profileCategorySpan}>영지</span>
            <span>
              {data.ArmoryProfile.TownName}
              {data.ArmoryProfile.TownLevel
                ? " Lv." + data.ArmoryProfile.TownLevel
                : ""}
            </span>
            <span className={styles.profileCategorySpan}>칭호</span>
            <span>{data.ArmoryProfile.Title || "칭호없음"}</span>
          </p>
        </div>
        <div className={styles.profileMenu}>
          <p
            className={`${styles.profileMenuBtn} ${
              menu === 0 ? styles.active : ""
            }`}
            onClick={() => {
              setMenu(0);
            }}
          >
            장비
          </p>
          <p className={styles.profileMenuSep} />
          <p
            className={`${styles.profileMenuBtn} ${
              menu === 1 ? styles.active : ""
            }`}
            onClick={() => {
              setMenu(1);
            }}
          >
            아바타
          </p>
        </div>
        <div className={styles.profileBody}>
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
              <div className={styles.profileAvatarDiv}>
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

              <div className={styles.profileAvatarDiv}>
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
              <div className={styles.emptyTEGC}>
                <AlertOctagon size={110} color="#fff" width={2} />
                활성화된 각인 효과가 없습니다.
              </div>
            )}
          </div>
        </div>
        <div className={styles.gemDiv}>
          <div className={styles.infoHeader}>
            <p className={styles.infoHeaderP}>장착 보석</p>
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
                  <AlertOctagon size={110} color="#fff" width={2} /> 장착중인
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
                  <AlertOctagon size={110} color="#fff" width={2} /> 장착중인
                  홍염 보석이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default ArmoryEAA;
