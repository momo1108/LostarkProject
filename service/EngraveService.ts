import {
  AuctionItemSearchReq,
  AuctionItemSearchResult,
  MarketItemSearchReq,
  MarketItemSearchResult,
} from "@/types/EngraveType";
import axios, { AxiosResponse } from "axios";

export default class EngraveService {
  private static _url: string = "https://developer-lostark.game.onstove.com/";

  /**
   * auction api를 이용해 검색합니다.
   */
  public static getAuctionItems = async (
    req: AuctionItemSearchReq
  ): Promise<AxiosResponse> => {
    return await axios.post(`${this.url}auctions/items`, req, {
      headers: {
        Authorization: `Bearer ${process.env.CLIENT_TOKEN}`,
        Accept: "application/json",
      },
    });
  };

  /**
   * market api를 이용해 검색합니다.
   */
  public static getMarketItems = async (
    req: MarketItemSearchReq
  ): Promise<MarketItemSearchResult> => {
    try {
      const res = await axios.post(`${this.url}markets/items`, req, {
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
