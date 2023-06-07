import {
  AuctionItemSearchReq,
  AuctionItemSearchResult,
} from "@/types/EngraveType";
import axios from "axios";

export default class EngraveService {
  private static _url: string = "https://developer-lostark.game.onstove.com/";

  /**
   * auction api를 이용해 검색합니다.
   */
  public static getAuctionItems = async (
    req: AuctionItemSearchReq
  ): Promise<AuctionItemSearchResult> => {
    try {
      const res = await axios.post(`${this.url}auctions/items`, req, {
        headers: {
          Authorization: `Bearer ${process.env.CLIENT_TOKEN}`,
          Accept: "application/json",
        },
      });
      return res.data;
    } catch (error) {
      throw new Error("검색 실패!");
    }
  };

  static get url(): string {
    return this._url;
  }
}
