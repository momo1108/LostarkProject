import { CharData } from "@/types/ReducerType";
import axios from "axios";
import { parse } from "node-html-parser";

export default class CharacterService {
  private static _url: string = "https://developer-lostark.game.onstove.com/";

  /**
   * 공식 홈페이지의 전투정보실의 img 태그를 찾아서
   * src 속성을 반환합니다.
   * 못찾을 경우 undefined 를 반환합니다.
   */
  public static getCharacterImageUrl = async (
    name: string
  ): Promise<string | undefined> => {
    const res = await axios.get(`/reqimg/${name}`);
    const dom = parse(res.data);
    const img = dom.querySelector(".profile-equipment__character img");

    return img?.attributes.src;
  };

  /**
   * GET
   * /armories/characters/{characterName}
   * Returns a summary of profile information by a character name.
   */
  public static getCharacterSummary = async (
    name: string
  ): Promise<CharData> => {
    const res = await axios.get(`${this.url}armories/characters/${name}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLIENT_TOKEN}`,
        Accept: "application/json",
      },
    });
    if (res.data) return res.data;
    else {
      throw new Error("존재하지 않는 닉네임 입니다!");
    }
  };

  static get url(): string {
    return this._url;
  }
}
