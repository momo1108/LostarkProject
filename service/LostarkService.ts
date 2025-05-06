import { SiblingType } from "@/types/EAAType";
import {
  AuctionItemSearchReq,
  MarketItemSearchReq,
  MarketItemSearchResult,
  ArmoryProfileType,
  AuctionSearchOption,
} from "@/types/LostarkApiType";
import { CharData } from "@/types/ReducerType";
import { SkillType } from "@/types/TripodType";
import { parse } from "node-html-parser";
import axios from "axios";
import { lostarkApi } from "./axiosInstance";

/**
 * 공식 홈페이지의 전투정보실의 img 태그를 찾아서
 * src 속성을 반환합니다.
 * 못찾을 경우 undefined 를 반환합니다.
 */
export const getCharacterImageUrl = async (
  name: string
): Promise<string | undefined> => {
  const res = await axios.get(`/reqimg/${name}`);
  const dom = parse(res.data);
  const img = dom.querySelector(".profile-equipment__character img");
  return img?.attributes.src;
};

/**
 * GET /characters/{characterName}/siblings
 * Returns all character profiles for an account.
 */
export const getCharacterSiblings = async (
  name: string,
): Promise<SiblingType[]> => {
  const res = await lostarkApi.get(`characters/${name}/siblings`);
  return res.data;
};

/**
 * GET /armories/characters/{characterName}
 * Returns a summary of profile information by a character name.
 */
export const getCharacterSummary = async (
  name: string,
): Promise<CharData> => {
  const res = await lostarkApi.get(`armories/characters/${name}`);
  return res.data;
};

/**
 * GET /armories/characters/{characterName}/profiles
 * Returns a summary of basic stats by a character name.
 */
export const getCharacterProfile = async (
  name: string,
): Promise<ArmoryProfileType> => {
  const res = await lostarkApi.get(`armories/characters/${name}/profiles`);
  return res.data;
};

/**
 * GET /armories/characters/{characterName}/combat-skills
 * Returns a summary of combat skills by a character name.
 */
export const getCharacterSkills = async (
  name: string,
): Promise<SkillType[]> => {
  const res = await lostarkApi.get(`armories/characters/${name}/combat-skills`);
  return res.data;
};

/**
 * 경매장에서 하나의 상품을 검색합니다.
 */
export const postAuctionItems = async (
  req: AuctionItemSearchReq,
): Promise<any> => {
  const res = await lostarkApi.post("auctions/items", req);
  return res.data;
};

/**
 * 경매장에서 여러개의 상품을 동시에 검색합니다.
 * Promise.all 을 사용해 구현합니다.
 */
export const postMultipleAuctionItems = async (
  requests: Array<AuctionItemSearchReq>
): Promise<any[]> => {
  try {
    const promises = requests.map((req) => 
      lostarkApi.post("auctions/items", req)
    );

    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  } catch (error) {
    console.error("Error fetching multiple auction items:", error);
    throw error;
  }
};

/**
 * market api를 이용해 검색합니다.
 */
export const getMarketItems = async (
  req: MarketItemSearchReq,
): Promise<MarketItemSearchResult> => {
  const res = await lostarkApi.post("markets/items", req);
  return res.data;
};

/**
 * GET /auctions/options
 * Returns auction search options.
 */
export const getAuctionOptions = async (): Promise<AuctionSearchOption> => {
  const res = await lostarkApi.get("auctions/options");
  return res.data;
};
