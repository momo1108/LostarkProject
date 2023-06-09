import { Menu } from "@/types/MenuType";
import path from "path";

const { readFileSync } = require("fs");

export default class DataService {
  /**
   * @/data/menu.json 에서 메뉴 데이터를 불러옵니다.
   */
  public static getMenu = async (): Promise<Menu> => {
    const dataDirectory = path.join(process.cwd(), "data");
    const menuStr: string = await readFileSync(
      `${dataDirectory}/menudummy.json`
    ).toString();

    return JSON.parse(menuStr);
  };
}
