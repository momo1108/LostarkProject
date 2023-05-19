import { CharMainInfoProps } from "@/types/CharacterType";
import { accessoryOrder, avatarOrder, equipmentOrder } from "@/types/EAAType";
import styles from "@/styles/character/Body.module.scss";
import EmptyProfile from "@/components/icons/EmptyProfile";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import EquipmentTooltip from "./tooltips/EquipmentTooltip";
import AccessoryTooltip from "./tooltips/AccessoryTooltip";
import ArmoryProfile from "./innercontaineritems/ArmoryProfile";
import AvatarTooltip from "./tooltips/AvatarTooltip";
import ArmoryEGC from "./innercontaineritems/ArmoryEGC";

const CharMainInfoBlock: React.FC<CharMainInfoProps> = ({
  loading,
  data,
  render,
}) => {
  const [equipment, setEquipment] = useState<Array<any>>();
  const [accessory, setAccessory] = useState<Array<any>>();
  const [avatar, setAvatar] = useState<Array<any>>();
  const [equipmentTooltipContent, setEquipmentTooltipContent] = useState<any>();
  const [accessoryTooltipContent, setAccessoryTooltipContent] = useState<any>();
  const [avatarTooltipContent, setAvatarTooltipContent] = useState<any>();
  useEffect(() => {
    const equipment_tmp = new Array(6);
    const accessory_tmp = new Array(7);
    const avatar_tmp = new Array(12);
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
    // console.log(equipment_tmp);
    // console.log(accessory_tmp);
    if (data.ArmoryAvatars) {
      data.ArmoryAvatars.map((e: any) => ({
        ...e,
        Tooltip: JSON.parse(e.Tooltip),
      })).forEach((e: any) => {
        const index = avatarOrder[e.Type];
        // e.Type을 avatarOrder에 매칭시켜 부위별 아바타의
        // 정보를 아바타 배열 고정위치에 삽입
        // 이동효과는 ""로 들어옴 ㅡ,.ㅡ
        if (!e.Type) avatar_tmp[avatarOrder["이동 효과 아바타"]] = e;
        else {
          // e.Type이 제대로 들어오는 나머지
          if (avatar_tmp[index]) {
            // openApi는 전설부터 정렬해서 보내주는데
            // 혹시 몰라서 예비용 조건문 추가.
            if (e.IsInner) {
              avatar_tmp[index + 1] = avatar_tmp[index];
              avatar_tmp[index] = e;
            } else {
              avatar_tmp[index + 1] = e;
            }
          } else avatar_tmp[index] = e;
        }
      });
    }
    setAvatar(avatar_tmp);

    // console.log("========================");
    // avatar_tmp.forEach((element: any) => {
    //   console.log(element.Type, element.Grade, element.Tooltip);
    // });
    // console.log("========================");
    // console.log(avatar_tmp);
    console.log(data);
  }, [data]);

  // useEffect(() => {
  //   console.log(equipmentTooltipContent);
  //   console.log(accessoryTooltipContent);
  // }, [equipmentTooltipContent, accessoryTooltipContent]);

  return loading ? (
    <div className={styles.loadingContainer}>
      <p className={styles.loadingMessage}>검색을 진행중입니다.</p>
      <svg
        id="triangle"
        width="180"
        height="180"
        viewBox="-3 -4 39 39"
        data-testid="triangle-svg"
        className={styles.loadingSvg}
      >
        <polygon
          fill="transparent"
          stroke="#55f4"
          strokeWidth="2"
          points="16,0 32,32 0,32"
        ></polygon>
      </svg>
    </div>
  ) : render ? (
    <div className={styles.infoContainer}>
      <ArmoryProfile
        data={data}
        equipment={equipment}
        accessory={accessory}
        avatar={avatar}
        setEquipmentTooltipContent={setEquipmentTooltipContent}
        setAccessoryTooltipContent={setAccessoryTooltipContent}
        setAvatarTooltipContent={setAvatarTooltipContent}
      />
      <ArmoryEGC data={data} />
      <div className={styles.infoContainerItemDiv}>hello</div>

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
      <Tooltip
        id="avatarTooltip"
        className={`${styles.tooltip} ${styles.avatarTooltip}`}
        place="right"
        clickable={true}
        offset={16}
      >
        {avatarTooltipContent ? (
          <AvatarTooltip data={avatarTooltipContent} />
        ) : (
          "Loading..."
        )}
      </Tooltip>
    </div>
  ) : (
    <div className={styles.emptyContainer}>
      <p className={styles.emptyMessage}>
        <span className={styles.charName}>
          {data.ArmoryProfile?.CharacterName}
        </span>{" "}
        캐릭터 정보가 없습니다.
        <br />
        캐릭터명을 확인해주세요.
      </p>
      <div className={styles.emptyBody}>
        <EmptyProfile />
      </div>
    </div>
  );
};

export default CharMainInfoBlock;
