import { CharMainInfoBlockProps, InfoMenu } from "@/types/CharacterType";
import { accessoryOrder, avatarOrder, equipmentOrder } from "@/types/EAAType";
import styles from "@/styles/character/Body.module.scss";
import EmptyProfile from "@/components/icons/EmptyProfile";
import { useState, useEffect } from "react";
import ArmoryTEGC from "./innercontaineritems/ArmoryTEGC";
import ArmoryEAA from "./innercontaineritems/ArmoryEAA";
import ArmoryST from "./innercontaineritems/ArmoryST";

const CharMainInfoBlock: React.FC<CharMainInfoBlockProps> = ({
  loading,
  data,
  render,
}) => {
  const [equipment, setEquipment] = useState<Array<any>>();
  const [accessory, setAccessory] = useState<Array<any>>();
  const [avatar, setAvatar] = useState<Array<any>>();
  const [infoMenuList, setInfoMenuList] = useState<InfoMenu>({
    names: ["각인/보석/카드", "스킬/트라이포드"],
    activeMenu: 0,
  });
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

    setInfoMenuList({ ...infoMenuList, activeMenu: 0 });

    // console.log("========================");
    // avatar_tmp.forEach((element: any) => {
    //   console.log(element.Type, element.Grade, element.Tooltip);
    // });
    // console.log("========================");
    // console.log(avatar_tmp);
    // console.log(data);
  }, [data]);

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
      <div className={styles.infoContainerItemDiv}>
        <ArmoryEAA
          data={data}
          equipment={equipment}
          accessory={accessory}
          avatar={avatar}
        />
      </div>
      <div className={styles.infoContainerItemDiv}>
        <ul className={styles.infoMenuList}>
          {infoMenuList.names.map((e: string, i: number) => {
            return (
              <li
                key={`infoMenu${i}`}
                className={`${styles.infoMenuItem} ${
                  infoMenuList.activeMenu === i ? styles.active : ""
                }`}
                onClick={() => {
                  setInfoMenuList({
                    ...infoMenuList,
                    activeMenu: i,
                  });
                }}
              >
                {e}
              </li>
            );
          })}
        </ul>
        <ArmoryTEGC
          data={data}
          className={infoMenuList.activeMenu === 0 ? "" : "hidden"}
        />
        <ArmoryST
          data={data}
          className={infoMenuList.activeMenu === 1 ? "" : "hidden"}
        />
      </div>
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
