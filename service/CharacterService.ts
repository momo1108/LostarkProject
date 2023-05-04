import { CharData } from "@/types/ReducerType";
import axios from "axios";

export default class CharacterService {
  private static _url: string = "https://developer-lostark.game.onstove.com/";

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
      alert("존재하지 않는 닉네임 입니다!");
      throw new Error("존재하지 않는 닉네임 입니다!");
    }
  };

  static get url(): string {
    return this._url;
  }
}
