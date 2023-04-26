const { readFileSync } = require("fs");

export default class DataService {    
    /**
     * 공식 홈페이지의 전투정보실의 img 태그를 찾아서
     * src 속성을 반환합니다. 
     * 못찾을 경우 undefined 를 반환합니다.
     */
    static getMenu = async ():Promise<string> =>{
        const menuStr:string = await readFileSync("../data/menu.json").toString();

        return menuStr;
    }
}