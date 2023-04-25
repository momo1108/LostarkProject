import axios from "axios";
import {parse} from "node-html-parser";

class CharacterService {
    private _url:string = "https://lostark.game.onstove.com/Profile/Character/";

    
    /**
     * 공식 홈페이지의 전투정보실의 img 태그를 찾아서
     * src 속성을 반환합니다. 
     * 못찾을 경우 undefined 를 반환합니다.
     */
    getCharacterImageUrl = async (name:string):Promise<string|undefined> =>{
        const res = await axios.get(`${this._url}${name}`);
        const dom = parse(res.data);
        const img = dom.querySelector(".profile-equipment__character img");

        return img?.attributes.src;
    }
}