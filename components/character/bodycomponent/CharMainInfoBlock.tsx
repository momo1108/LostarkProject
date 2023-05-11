import {
  CharMainInfoParams,
  accessoryOrder,
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
import parse from "html-react-parser";

const CharMainInfoBlock: React.FC<CharMainInfoParams> = ({ data, render }) => {
  const equipKeys = Object.keys(equipmentOrder);
  const accKeys = Object.keys(accessoryOrder);
  const [equipment, setEquipment] = useState<Array<Object>>();
  const [equipmentTooltipContent, setEquipmentTooltipContent] = useState<any>();
  const [accessoryTooltipContent, setAccessoryTooltipContent] = useState<any>();
  useEffect(() => {
    if (data.ArmoryEquipment) {
      setEquipment(
        data.ArmoryEquipment.map((e: any) => ({
          ...e,
          Tooltip: JSON.parse(e.Tooltip),
        }))
      );
      // console.log(equipment);
    }
  }, [data]);

  useEffect(() => {
    console.log(equipmentTooltipContent);
  }, [equipmentTooltipContent]);

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
                          contentSetter={() => {
                            setEquipmentTooltipContent(e);
                          }}
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
                          key={`accessorySlot${i}`}
                          grade={gradeClassMap[e.Grade]}
                          iconUrl={e.Icon}
                          qualityValue={
                            e.Tooltip.Element_001.value.qualityValue
                          }
                          showQuality={
                            !(e.Type == "팔찌" || e.Type == "어빌리티 스톤")
                          }
                          option={e.Tooltip.Element_005.value.Element_001}
                          contentSetter={() => {
                            setAccessoryTooltipContent(e);
                          }}
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
      <Tooltip
        id="equipmentTooltip"
        className={`${styles.tooltip} ${styles.equipmentTooltip}`}
        place="right"
        clickable={true}
      >
        {equipmentTooltipContent ? (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  equipmentTooltipContent.Tooltip.Element_000.value.toUpperCase(),
              }}
            />
            <hr />
            <div className={styles.tooltipGradeDiv}>
              <img
                className={gradeClassMap[equipmentTooltipContent.Grade]}
                src={equipmentTooltipContent.Icon}
                alt=""
              />
              <div className={styles.tooltipGradeInfo}>
                <p>
                  {parse(
                    equipmentTooltipContent.Tooltip.Element_001.value.leftStr0.toUpperCase()
                  )}
                </p>
                <p>
                  {parse(
                    equipmentTooltipContent.Tooltip.Element_001.value.leftStr1.toUpperCase()
                  )}
                </p>
                <p>
                  {parse(
                    equipmentTooltipContent.Tooltip.Element_001.value.leftStr2.toUpperCase()
                  )}
                </p>
              </div>
            </div>
            <div className={styles.tooltipOptionDiv}>
              <p>
                {parse(
                  equipmentTooltipContent.Tooltip.Element_009.value.Element_000.topStr.toUpperCase()
                )}
              </p>
              <p>
                {parse(
                  equipmentTooltipContent.Tooltip.Element_005?.value?.Element_000?.toUpperCase()
                )}
              </p>
              <p>
                {parse(
                  equipmentTooltipContent.Tooltip.Element_006?.value?.Element_001?.toUpperCase()
                )}
              </p>
              <p>
                {parse(
                  equipmentTooltipContent.Tooltip.Element_006?.value?.Element_000?.toUpperCase()
                )}
              </p>
              <p>
                {parse(
                  equipmentTooltipContent.Tooltip.Element_005?.value?.Element_001?.toUpperCase()
                )}
              </p>
            </div>
          </>
        ) : (
          "loading..."
        )}
      </Tooltip>
      <Tooltip
        id="accessoryTooltip"
        className={`${styles.tooltip} ${styles.accessoryTooltip}`}
        style={{ zIndex: 30 }}
        place="right"
        clickable={true}
      >
        <span>Hello</span>
      </Tooltip>
    </div>
  );

  function parseApiDataToHtmlString(html: string): string {
    html = html.replaceAll(/FONT/g, "span");
    html = html.replaceAll(/P/g, "p");
    html = html.replaceAll(/ALIGN=/g, `style={{textAlign:`);
    html = html.replaceAll(/COLOR=/g, "style={{color:");
    html = html.replaceAll(/SIZE=["']/g, "style={{fontSize:");

    return html;
  }
};

export default CharMainInfoBlock;
