import { CharMainInfoBlockProps, InfoMenu } from "@/types/CharacterType";
import { accessoryOrder, avatarOrder, equipmentOrder } from "@/types/EAAType";
import styles from "@/styles/character/Body.module.scss";
import EmptyProfile from "@/components/icons/EmptyProfile";
import { useState, useEffect, useContext } from "react";
import ArmoryEAA from "./innercontaineritems/ArmoryEAA";
import { TriangleSpinner } from "@/components/icons/Index";
import CharacterContext from "@/contexts/CharacterContext";

const CharMainInfoBlock: React.FC = () => {
  const { characterProfile: data, pageStatus } = useContext(CharacterContext);
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
    console.log(accessory_tmp);
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

  return pageStatus === "SEARCHING" ? (
    <div className={styles.loadingContainer}>
      <p className={styles.loadingMessage}>검색을 진행중입니다.</p>
      <TriangleSpinner className={`triangleSpinner ${styles.loadingSvg}`} />
    </div>
  ) : pageStatus === "DONE" ? (
    <div className={styles.infoContainer}>
      <ArmoryEAA
        className={styles.upperContainer}
        data={data}
        equipment={equipment}
        accessory={accessory}
        avatar={avatar}
      />
    </div>
  ) : pageStatus === "NODATA" ? (
    <div className={styles.emptyContainer}>
      <p className={styles.emptyMessage}>
        캐릭터 정보가 없습니다.
        <br />
        캐릭터명을 확인해주세요.
      </p>
      <div className={styles.emptyBody}>
        <EmptyProfile />
      </div>
    </div>
  ) : pageStatus === "TOOMANYREQUESTS" ? (
    <div>
      <p>이용자가 몰려서 잠시 서비스를 이용할 수 없습니다.</p>
    </div>
  ) : pageStatus === "ERROR" ? (
    <div>
      <p>로스트아크 서버에 문제가 발생했습니다.</p>
    </div>
  ) : (
    <div>
      <p>검색을 진행해주세요.</p>
    </div>
  );
};

export default CharMainInfoBlock;
