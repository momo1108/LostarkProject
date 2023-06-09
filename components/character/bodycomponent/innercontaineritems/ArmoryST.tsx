import {
  ArmorySTProps,
  SkillData,
  Tripod,
  tripodTierToColorMap,
} from "@/types/STType";
import { useState, useEffect, useCallback, Fragment } from "react";
import styles from "@/styles/character/Body.module.scss";
import useApiTagParser from "@/hooks/useApiTagParser";
import { gradeClassMap, gradeTextColorMap } from "@/types/GlobalType";
import { Tooltip } from "react-tooltip";
import RuneTooltip from "../tooltips/RuneTooltip";
import SkillTooltip from "../tooltips/SkillTooltip";
import { AlertOctagon } from "@/components/icons/Index";
import { GemData } from "@/types/TEGCType";

const ArmoryST: React.FC<ArmorySTProps> = ({ className, data }) => {
  const [skillDataList, setSkillDataList] = useState<SkillData[]>();
  const [skillTooltipContent, setSkillTooltipContent] = useState<string>();
  const [tripodTooltipContent, setTripodTooltipContent] = useState<string>();
  const [runeTooltipContent, setRuneTooltipContent] = useState<string>();
  const { parseSkillPoint, parseApiDataToHtmlString: parse } =
    useApiTagParser();

  const setTripodInfo = useCallback(
    (tripods: Tripod[], slot: Array<Tripod>) => {
      tripods.map((e: Tripod) => {
        if (e.IsSelected) slot[e.Tier] = e;
      });
      return slot;
    },
    []
  );

  useEffect(() => {
    const tmp: SkillData[] = [];

    data.ArmorySkills?.forEach((e: SkillData) => {
      // console.log(
      //   Object.keys(JSON.parse(e.Tooltip)).length,
      //   JSON.parse(e.Tooltip)
      // );
      if (e.Level > 1 || e.Rune) {
        const tmp_tripod = new Array(3);
        e.UsedTripods = setTripodInfo(e.Tripods, tmp_tripod);
        tmp.push(e);
      }
    });

    tmp.map((e: SkillData) => {
      e.Gems = [];
      data.ArmoryGem?.Effects.forEach((g: GemData) => {
        if (e.Name === g.Name) {
          e.Gems.push({
            ...data.ArmoryGem.Gems[g.GemSlot],
            Description: g.Description,
          });
        }
      });
      return e;
    });

    setSkillDataList(tmp);
    // console.log(tmp);
  }, []);

  return (
    <>
      <div className={`${className} ${styles.stContainer}`}>
        {skillDataList ? (
          skillDataList.length ? (
            skillDataList.map((e) => {
              return (
                <Fragment key={`skillSlot_${e.Name}`}>
                  <div className={styles.stDiv}>
                    <div
                      className={styles.skillIconSlot}
                      data-tooltip-id="skillTooltip"
                      onMouseEnter={() => {
                        setSkillTooltipContent(JSON.parse(e.Tooltip));
                      }}
                    >
                      <img src={e.Icon} className={styles.skillIcon} alt="" />
                    </div>
                    <div className={styles.skillDescr}>
                      <p className={styles.skillLevelP}>
                        Lv. {parseSkillPoint(e.Level)}
                      </p>
                      <p className={styles.skillNameP}>{e.Name}</p>
                    </div>
                    <div className={styles.skillTripods}>
                      {e.UsedTripods.map((t: Tripod) => {
                        if (t)
                          return (
                            <div
                              data-tooltip-id="tripodTooltip"
                              onMouseEnter={() => {
                                setTripodTooltipContent(t.Tooltip);
                              }}
                              className={styles.usedTripod}
                              key={`${e.Name}_${t.Tier}_${t.Level}`}
                            >
                              <img src={t.Icon} alt="" />
                              <p className={styles.tripodSlot}>{t.Slot}</p>
                              <div
                                className={styles.tripodDescrItem}
                                key={`${e.Name}_${t.Name}`}
                                style={{
                                  color: tripodTierToColorMap[t.Tier],
                                }}
                              >
                                <p className={styles.tripodNameP}>{t.Name}</p>
                                <p>Lv. {t.Level}</p>
                              </div>
                            </div>
                          );
                      })}
                    </div>

                    <div className={styles.skillGems}>
                      {e.Gems.map((g: GemData) => {
                        return (
                          <div key={`${e.Name}_${g.Slot}`}>
                            <img width={40} src={g.Icon} alt="" />
                            <p>{`${g.Level}${
                              g.Description.startsWith("피해") ? "멸" : "홍"
                            }`}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      data-tooltip-id={e.Rune ? "runeTooltip" : ""}
                      onMouseEnter={() => {
                        e.Rune
                          ? setRuneTooltipContent(JSON.parse(e.Rune.Tooltip))
                          : "";
                      }}
                      className={`${styles.skillRune} ${
                        gradeClassMap[e.Rune?.Grade]
                      }`}
                    >
                      {e.Rune ? (
                        <>
                          <img src={e.Rune.Icon} alt="" />
                          <p
                            className={`${styles.runeNameP} ${
                              gradeTextColorMap[e.Rune.Grade]
                            }`}
                          >
                            {e.Rune.Name}
                          </p>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <hr />
                </Fragment>
              );
            })
          ) : (
            <div className={styles.emptyST}>
              <AlertOctagon size={110} color="#fff" width={2} /> 사용중인 스킬이
              없습니다.
            </div>
          )
        ) : (
          "로딩중"
        )}
      </div>
      <Tooltip
        id="skillTooltip"
        className={`${styles.tooltip} ${styles.skillTooltip}`}
        place="right"
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
        className={`${styles.tooltip} ${styles.tripodTooltip}`}
        place="top"
        clickable={true}
        offset={6}
        delayHide={1}
      >
        {tripodTooltipContent ? parse(tripodTooltipContent) : "Loading..."}
      </Tooltip>
      <Tooltip
        id="runeTooltip"
        className={`${styles.tooltip} ${styles.runeTooltip}`}
        place="top"
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
    </>
  );
};

export default ArmoryST;
/*
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

Ex.
{
    "Name": "날카로운 창",
    "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/GL_Skill/GL_Skill_01_19.png",
    "Level": 1,
    "Type": "일반",
    "IsAwakening": false,
    "Tripods": [
        {
            "Tier": 0,
            "Slot": 1,
            "Name": "진격",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_1_40.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'><FONT COLOR='#ffff99'>3.0m</FONT> 가량 전진한 후 부채꼴 모양으로 공격한다.</font>"
        },
        {
            "Tier": 0,
            "Slot": 2,
            "Name": "관통",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_1_7.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'>찌르는 공격의 폭이 <FONT COLOR='#ff9999'>30.0%</FONT> 좁아지지만 <FONT COLOR='#99ff99'>40.0%</FONT> 더 멀리 찌른다.</font>"
        },
        {
            "Tier": 0,
            "Slot": 3,
            "Name": "대회전",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_1_39.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'>창을 머리 위로 크게 휘둘러 <FONT COLOR='#ffff99'>360</FONT>도 공격을 한다.</font>"
        },
        {
            "Tier": 1,
            "Slot": 1,
            "Name": "상처",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_2_45.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'>적중된 적을 <FONT COLOR='#ffff99'><FONT COLOR='#ffff99'>4.0</FONT></FONT>초 동안 출혈 상태로 만들어 매 초마다 <FONT COLOR='#ffbb00'>16250</FONT>의 피해를 준다.</font>"
        },
        {
            "Tier": 1,
            "Slot": 2,
            "Name": "무방비 표적",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_2_30.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'>기절 혹은 무력화 상태의 적에게 <FONT COLOR='#99ff99'>50.0%</FONT> 증가된 피해를 준다.</font>"
        },
        {
            "Tier": 1,
            "Slot": 3,
            "Name": "변칙 공격",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_2_27.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'>공격시 더 이상 적을 밀어내지 않고 오히려 끌어당긴다.</font>"
        },
        {
            "Tier": 2,
            "Slot": 1,
            "Name": "멈추지 않는 창격",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_3_38.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'>콤보 조작으로 변경되며 한 번 더 공격하여 <FONT COLOR='#99ff99'>100.0%</FONT>의 추가 피해를 입힌다.</font>"
        },
        {
            "Tier": 2,
            "Slot": 2,
            "Name": "창격 강화",
            "Icon": "https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Tripod_Tier/Tripod_Tier_3_0.png",
            "Level": 1,
            "IsSelected": false,
            "Tooltip": "<font color='#FFFDE7'>공격 길이가 <FONT COLOR='#99ff99'>30.0%</FONT> 증가하고 적에게 주는 피해가 <FONT COLOR='#99ff99'>50.0%</FONT> 증가된다.</font>"
        }
    ],
    "Rune": null,
    "Tooltip": "{\r\n  \"Element_000\": {\r\n    \"type\": \"NameTagBox\",\r\n    \"value\": \"날카로운 창\"\r\n  },\r\n  \"Element_001\": {\r\n    \"type\": \"CommonSkillTitle\",\r\n    \"value\": {\r\n      \"leftText\": \"<FONT SIZE='12'>재사용 대기시간 5초</FONT>\",\r\n      \"level\": \"<FONT SIZE='12'><FONT COLOR='#B7DEE8'><FONT COLOR='#F15F5F'>[랜스 스킬]</FONT></FONT></FONT>\",\r\n      \"middleText\": \"\",\r\n      \"name\": \"<FONT SIZE='12'><FONT SIZE='14' COLOR='#FFFFAC'>일반</FONT></FONT>\",\r\n      \"slotData\": {\r\n        \"iconGrade\": 0,\r\n        \"iconPath\": \"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/GL_Skill/GL_Skill_01_19.png\",\r\n        \"imagePath\": \"\"\r\n      }\r\n    }\r\n  },\r\n  \"Element_002\": {\r\n    \"type\": \"MultiTextBox\",\r\n    \"value\": \"|<FONT COLOR='#3C78FF'>PvE</FONT>\"\r\n  },\r\n  \"Element_003\": {\r\n    \"type\": \"SingleTextBox\",\r\n    \"value\": \"스킬 레벨 1\"\r\n  },\r\n  \"Element_004\": {\r\n    \"type\": \"MultiTextBox\",\r\n    \"value\": \"마나 41 소모|\"\r\n  },\r\n  \"Element_005\": {\r\n    \"type\": \"SingleTextBox\",\r\n    \"value\": \"<FONT COLOR='#efefdf'><FONT SIZE='11'>창을 힘차게 앞으로 내질러 <FONT COLOR='#ffbb00'>171008</FONT>의 피해를 준다.</FONT></FONT><BR><FONT SIZE='12'><FONT COLOR='#EEA839'>무력화 : 하</FONT></FONT><BR><FONT SIZE='12'><FONT COLOR='#EEA839'>공격 타입 : 헤드 어택</FONT></FONT>\"\r\n  },\r\n  \"Element_006\": {\r\n    \"type\": \"TripodSkillCustom\",\r\n    \"value\": {\r\n      \"Element_000\": {\r\n        \"desc\": \"<FONT COLOR='#AAAAAA'>티어 1 트라이포드 스킬 레벨 4에 개방</FONT>\",\r\n        \"lock\": true,\r\n        \"name\": \"\",\r\n        \"tier\": \"\"\r\n      },\r\n      \"Element_001\": {\r\n        \"desc\": \"<FONT COLOR='#AAAAAA'>티어 2 트라이포드 스킬 레벨 7에 개방</FONT>\",\r\n        \"lock\": true,\r\n        \"name\": \"\",\r\n        \"tier\": \"\"\r\n      },\r\n      \"Element_002\": {\r\n        \"desc\": \"<FONT COLOR='#AAAAAA'>티어 3 트라이포드 스킬 레벨 10에 개방</FONT>\",\r\n        \"lock\": true,\r\n        \"name\": \"\",\r\n        \"tier\": \"\"\r\n      }\r\n    }\r\n  },\r\n  \"Element_007\": {\r\n    \"type\": \"BlinkLineStart\",\r\n    \"value\": true\r\n  },\r\n  \"Element_008\": {\r\n    \"type\": \"SingleTextBox\",\r\n    \"value\": \"다음 스킬 레벨 2\"\r\n  },\r\n  \"Element_009\": {\r\n    \"type\": \"MultiTextBox\",\r\n    \"value\": \"|<FONT COLOR='#808080'>필요 레벨</FONT> 10\"\r\n  },\r\n  \"Element_010\": {\r\n    \"type\": \"MultiTextBox\",\r\n    \"value\": \"|<FONT COLOR='#808080'>필요 스킬 포인트 </FONT>1\"\r\n  },\r\n  \"Element_011\": {\r\n    \"type\": \"SingleTextBox\",\r\n    \"value\": \"마나 55 소모\"\r\n  },\r\n  \"Element_012\": {\r\n    \"type\": \"SingleTextBox\",\r\n    \"value\": \"<FONT COLOR='#efefdf'><FONT SIZE='11'>창을 힘차게 앞으로 내질러 <FONT COLOR='#ffbb00'>187873</FONT>의 피해를 준다.</FONT></FONT><BR><FONT SIZE='12'><FONT COLOR='#EEA839'>무력화 : 하</FONT></FONT><BR><FONT SIZE='12'><FONT COLOR='#EEA839'>공격 타입 : 헤드 어택</FONT></FONT>\"\r\n  },\r\n  \"Element_013\": {\r\n    \"type\": \"BlinkLineEnd\",\r\n    \"value\": true\r\n  }\r\n}"
}
*/
