import {
  CharMainInfoParams,
  accessoryOrder,
  emptyAccessoryBackgroundMap,
  emptyEquipmentBackgroundMap,
  equipmentOrder,
  gradeClassMap,
} from "@/types/CharacterType";
import styles from "@/styles/character/Body.module.scss";
import EmptyProfile from "@/components/icons/EmptyProfile";
import { useState, useEffect } from "react";
import EquipmentSlot from "./slots/EquipmentSlot";
import AccessorySlot from "./slots/AccessorySlot";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import EquipmentTooltip from "./tooltips/EquipmentTooltip";
import AccessoryTooltip from "./tooltips/AccessoryTooltip";

const CharMainInfoBlock: React.FC<CharMainInfoParams> = ({ data, render }) => {
  const [equipment, setEquipment] = useState<Array<any>>();
  const [accessory, setAccessory] = useState<Array<any>>();
  const [equipmentTooltipContent, setEquipmentTooltipContent] = useState<any>();
  const [accessoryTooltipContent, setAccessoryTooltipContent] = useState<any>();
  useEffect(() => {
    const equipment_tmp = new Array(6);
    const accessory_tmp = new Array(7);
    if (data.ArmoryEquipment) {
      data.ArmoryEquipment.map((e: any) => ({
        ...e,
        Tooltip: JSON.parse(e.Tooltip),
      })).forEach((e: any) => {
        if (equipmentOrder.hasOwnProperty(e.Type))
          equipment_tmp[equipmentOrder[e.Type]] = e;
        if (accessoryOrder.hasOwnProperty(e.Type)) {
          if (!!accessory_tmp[accessoryOrder[e.Type]])
            accessory_tmp[accessoryOrder[e.Type] + 1] = e;
          else accessory_tmp[accessoryOrder[e.Type]] = e;
        }
      });
    }
    setEquipment(equipment_tmp);
    setAccessory(accessory_tmp);
    console.log(equipment_tmp);
    console.log(accessory_tmp);
    console.log(data);
  }, [data]);

  // useEffect(() => {
  //   console.log(equipmentTooltipContent);
  //   console.log(accessoryTooltipContent);
  // }, [equipmentTooltipContent, accessoryTooltipContent]);

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
                  ? [0, 1, 2, 3, 4, 5].map((e: number) =>
                      equipment[e] ? (
                        <EquipmentSlot
                          key={`equipSlot${e}`}
                          grade={gradeClassMap[equipment[e].Grade]}
                          honing={equipment[e].Name.split(" ")[0]}
                          iconUrl={equipment[e].Icon}
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
                            parseFloat(data.ArmoryProfile.ItemAvgLevel) >= 1415
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
      <Tooltip
        id="equipmentTooltip"
        className={`${styles.tooltip} ${styles.equipmentTooltip}`}
        place="right"
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
        className={`${styles.tooltip} ${styles.accessoryTooltip}`}
        place="right"
        clickable={true}
      >
        {accessoryTooltipContent ? (
          <AccessoryTooltip data={accessoryTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
    </div>
  );
};

export default CharMainInfoBlock;
