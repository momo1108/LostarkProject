import { InfoPage, Menu } from "@/types/GlobalType";
import { tripodDataType } from "@/types/TripodType";
import { readFileSync } from "fs";
import path from "path";

export default class DataService {
  /**
   * @/data/menu.json 에서 메뉴 데이터를 불러옵니다.
   */
  public static getMenu = (): Menu[] => {
    const dataDirectory = path.join(process.cwd(), "data");
    const menuStr: string = readFileSync(
      `${dataDirectory}/menu.json`
    ).toString();

    return JSON.parse(menuStr);
  };

  /**
   * @/data/infoPage.json 에서 page 데이터를 불러옵니다.
   */
  public static getInfoPageList = (): InfoPage[] => {
    const dataDirectory = path.join(process.cwd(), "data");
    const infoPageStr: string = readFileSync(
      `${dataDirectory}/info.json`
    ).toString();

    return JSON.parse(infoPageStr);
  };

  /**
   * @/data/classSkillsetData.json 에서 트라이포드 데이터를 불러옵니다.
   */
  public static getTripodInfo = (): tripodDataType => {
    const dataDirectory = path.join(process.cwd(), "data");
    const infoPageStr: string = readFileSync(
      `${dataDirectory}/classSkillsetData.json`
    ).toString();

    return JSON.parse(infoPageStr);
  };

  /**
   * @/data/infoPage.json 에서 page 데이터를 불러옵니다.
   */
  public static getGrindingEffectData = (): Object => {
    const dataDirectory = path.join(process.cwd(), "data");
    const infoPageStr: string = readFileSync(
      `${dataDirectory}/grindingEffectOptions.json`
    ).toString();

    return JSON.parse(infoPageStr);
  };
}
