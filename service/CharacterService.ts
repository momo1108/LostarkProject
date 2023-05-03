import { CharData } from "@/types/CharacterType";
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
    console.log(name, process.env.CLIENT_TOKEN);
    const res = await axios.get(`${this.url}armories/characters/${name}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLIENT_TOKEN}`,
        Accept: "application/json",
      },
    });
    return res.data;
  };

  static get url(): string {
    return this._url;
  }
}
