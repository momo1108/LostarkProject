import { CharMainInfoParams } from "@/types/CharacterType";
import styles from "@/styles/character/Body.module.scss";
import EmptyProfile from "@/components/icons/EmptyProfile";
import { useState, useEffect } from "react";
import EquipmentSlot from "./slots/EquipmentSlot";
import AccessorySlot from "./slots/AccessorySlot";

const equipmentOrder: { [key: string]: number } = {
  투구: 0,
  어깨: 1,
  상의: 2,
  하의: 3,
  장갑: 4,
  무기: 5,
};
const accessoryOrder: { [key: string]: number } = {
  목걸이: 0,
  귀걸이: 1,
  반지: 2,
  팔찌: 3,
  "어빌리티 스톤": 4,
};

const gradeClassMap: { [key: string]: string } = {
  전설: "legendaryBackground",
  유물: "relicsBackground",
  고대: "ancientBackground",
  에스더: "estherBackground",
};
const CharMainInfoBlock: React.FC<CharMainInfoParams> = ({ data, render }) => {
  const equipKeys = Object.keys(equipmentOrder);
  const accKeys = Object.keys(accessoryOrder);
  const [equipment, setEquipment] = useState<Array<Object>>();
  useEffect(() => {
    if (data.ArmoryEquipment) {
      setEquipment(
        data.ArmoryEquipment.map((e: any) => ({
          ...e,
          Tooltip: JSON.parse(e.Tooltip),
        }))
      );
      console.log(equipment);
    }
  }, [data]);

  return (
    <div className={styles.infoContainer}>
      {render ? (
        <>
          <div className={styles.infoContainerItemDiv}>
            <div className={styles.profileHeader}>
              <p className={styles.profileHeaderLine}>
                <span className={styles.profileServerSpan}>
                  @{data.ArmoryProfile.ServerName}
                </span>
                <span className={styles.profileNameSpan}>
                  [ <b>Lv.{data.ArmoryProfile.CharacterLevel}</b>{" "}
                  <span>{data.ArmoryProfile.CharacterName}</span> ]
                </span>
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
                  {data.ArmoryProfile.TownName} Lv.
                  {data.ArmoryProfile.TownLevel}
                </span>
                <span className={styles.profileCategorySpan}>칭호</span>
                <span>{data.ArmoryProfile.Title}</span>
              </p>
            </div>
            <div className={styles.profileBody}>
              <div className={styles.profileEquipmentDiv}>
                {equipment
                  ? equipment
                      .filter((e: any) => equipKeys.includes(e.Type))
                      .sort(
                        (a: any, b: any) =>
                          equipmentOrder[a.Type] - equipmentOrder[b.Type]
                      )
                      .map((e: any, i: number) => (
                        <EquipmentSlot
                          key={`equipSlot${i}`}
                          grade={gradeClassMap[e.Grade]}
                          honing={e.Name.split(" ")[0]}
                          iconUrl={e.Icon}
                          qualityValue={
                            e.Tooltip.Element_001.value.qualityValue
                          }
                        />
                      ))
                  : ""}
              </div>
              <div className={styles.profileAccessoryDiv}>
                {equipment
                  ? equipment
                      .filter((e: any) => accKeys.includes(e.Type))
                      .sort(
                        (a: any, b: any) =>
                          accessoryOrder[a.Type] - accessoryOrder[b.Type]
                      )
                      .map((e: any, i: number) => (
                        <AccessorySlot
                          key={`equipSlot${i}`}
                          grade={gradeClassMap[e.Grade]}
                          iconUrl={e.Icon}
                          qualityValue={
                            e.Tooltip.Element_001.value.qualityValue
                          }
                          showQuality={
                            !(e.Type == "팔찌" || e.Type == "어빌리티 스톤")
                          }
                        />
                      ))
                  : ""}
              </div>

              {data.ArmoryProfile.CharacterImage ? (
                <img
                  className={styles.profileImage}
                  src={data.ArmoryProfile.CharacterImage}
                  alt=""
                />
              ) : (
                <EmptyProfile />
              )}
            </div>
          </div>
          <div className={styles.infoContainerItemDiv}>hello</div>
          <div className={styles.infoContainerItemDiv}>hello</div>
        </>
      ) : (
        <p>로딩중...</p>
      )}
    </div>
  );
};

export default CharMainInfoBlock;
