import { Menu } from "@/types/MainPageType";
import path from "path";

const { readFileSync } = require("fs");

export default class DataService {    
    /**
     * @/data/menu.json 에서 메뉴 데이터를 불러옵니다.
     */
    static getMenu = async ():Promise<Menu> =>{
        const dataDirectory = path.join(process.cwd(), 'data');
        const menuStr:string = await readFileSync(`${dataDirectory}/menu.json`).toString();


        return JSON.parse(menuStr);
    }
}