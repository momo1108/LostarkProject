import styles from "@/styles/character/Body.module.scss";
import {
  ArmoryEAAProps,
  emptyAccessoryBackgroundMap,
  emptyAvatarBackgroundMap,
  emptyEquipmentBackgroundMap,
} from "@/types/EAAType";
import { gradeClassMap } from "@/types/GlobalType";
import EquipmentSlot from "../slots/EquipmentSlot";
import AccessorySlot from "../slots/AccessorySlot";
import AvatarSlot from "../slots/AvatarSlot";
import { useState, Fragment } from "react";
import { classImageMap } from "@/types/GlobalType";
import Image from "next/image";

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
  data,
  equipment,
  accessory,
  avatar,
  setEquipmentTooltipContent,
  setAccessoryTooltipContent,
  setAvatarTooltipContent,
}) => {
  const [menu, setMenu] = useState<number>(0);
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
  return (
    <>
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

        <Image
          className={styles.profileImage}
          src={data.ArmoryProfile.CharacterImage}
          quality={100}
          width={432.2}
          height={500}
          alt=""
        />
      </div>
    </>
  );
};

export default ArmoryEAA;
