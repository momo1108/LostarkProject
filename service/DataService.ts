import { InfoPage, Menu } from "@/types/GlobalType";
import { tripodDataType } from "@/types/TripodType";
import { readFileSync } from "fs";
import path from "path";

export default class DataService {
  /**
   * @/data/menu.json 에서 메뉴 데이터를 불러옵니다.
   */
  public static getMenu = async (): Promise<Menu[]> => {
    const dataDirectory = path.join(process.cwd(), "data");
    const menuStr: string = await readFileSync(
      `${dataDirectory}/menu.json`
    ).toString();

    return JSON.parse(menuStr);
  };

  /**
   * @/data/infoPage.json 에서 page 데이터를 불러옵니다.
   */
  public static getInfoPageList = async (): Promise<InfoPage[]> => {
    const dataDirectory = path.join(process.cwd(), "data");
    const infoPageStr: string = await readFileSync(
      `${dataDirectory}/info.json`
    ).toString();

    return JSON.parse(infoPageStr);
  };

  /**
   * @/data/classSkillsetData.json 에서 트라이포드 데이터를 불러옵니다.
   */
  public static getTripodInfo = async (): Promise<tripodDataType> => {
    const dataDirectory = path.join(process.cwd(), "data");
    const infoPageStr: string = await readFileSync(
      `${dataDirectory}/classSkillsetData.json`
    ).toString();

    return JSON.parse(infoPageStr);
  };

  /**
   * @/data/infoPage.json 에서 page 데이터를 불러옵니다.
   */
  public static getGrindingEffectData = async (): Promise<tripodDataType> => {
    const dataDirectory = path.join(process.cwd(), "data");
    const infoPageStr: string = await readFileSync(
      `${dataDirectory}/grindingEffectOptions.json`
    ).toString();

    return JSON.parse(infoPageStr);
  };
}
