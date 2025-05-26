import { SiblingType } from "@/types/EAAType";
import {
  AuctionItemSearchReq,
  MarketItemSearchReq,
  MarketItemSearchResult,
  ArmoryProfileType,
  AuctionSearchOption,
  AuctionItem,
  AuctionItemSearchResult,
} from "@/types/LostarkApiType";
import { CharData } from "@/types/ReducerType";
import { SkillType } from "@/types/TripodType";
import { parse } from "node-html-parser";
import axios, { AxiosResponse } from "axios";
import { lostarkApi } from "./axiosInstance";

/**
 * 공식 홈페이지의 전투정보실의 img 태그를 찾아서
 * src 속성을 반환합니다.
 * 못찾을 경우 undefined 를 반환합니다.
 */
export const getCharacterImageUrl = async (
  name: string
): Promise<string | undefined> => {
  const res = await axios.get(
    `/api/proxy?action=getcharacterimageurl&name=${name}`
  );
  const dom = parse(res.data);
  const img = dom.querySelector(".profile-equipment__character img");
  return img?.attributes.src;
};

/**
 * GET /characters/{characterName}/siblings
 * Returns all character profiles for an account.
 */
export const getCharacterSiblings = async (
  name: string
): Promise<SiblingType[]> => {
  const res = await lostarkApi.get(`characters/${name}/siblings`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOSTARK_API_KEY}`,
    },
  });
  return res.data;
};

/**
 * GET /armories/characters/{characterName}
 * Returns a summary of profile information by a character name.
 */
export const getCharacterSummary = async (name: string): Promise<CharData> => {
  const res = await lostarkApi.get(`armories/characters/${name}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOSTARK_API_KEY}`,
    },
  });
  return res.data;
};

/**
 * GET /armories/characters/{characterName}/profiles
 * Returns a summary of basic stats by a character name.
 */
export const getCharacterProfile = async (
  name: string
): Promise<ArmoryProfileType> => {
  const res = await lostarkApi.get(`armories/characters/${name}/profiles`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOSTARK_API_KEY}`,
    },
  });
  return res.data;
};

/**
 * GET /armories/characters/{characterName}/combat-skills
 * Returns a summary of combat skills by a character name.
 */
export const getCharacterSkills = async (
  name: string
): Promise<SkillType[]> => {
  const res = await lostarkApi.get(
    `armories/characters/${name}/combat-skills`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOSTARK_API_KEY}`,
      },
    }
  );
  return res.data;
};

/**
 * 경매장에서 하나의 상품을 검색합니다.
 * 만약 검색 결과가 10개 초과인 경우, 최대 50개까지 조회할 수 있도록 Promise.all 을 사용합니다.
 */
export const postAuctionItems = async (
  req: AuctionItemSearchReq
): Promise<AuctionItemSearchResult> => {
  // 먼저 1페이지의 결과를 조회합니다.
  const res = (await lostarkApi.post(
    "auctions/items",
    req
  )) as AxiosResponse<AuctionItemSearchResult>;
  let length = Math.ceil(res.data.TotalCount / 10);
  if (length > 5) length = 5;

  // 만약 검색 결과가 10개 이하라면, 1페이지의 결과를 반환합니다.
  if (length <= 1) {
    return {
      ...res.data,
      Items: res.data.Items ? res.data.Items : [],
    };
  } else {
    // 그렇지 않다면, 2페이지부터 최대 5페이지까지의 결과를 조회하고 1페이지의 결과와 합칩니다.
    length -= 1;
    const promises = Array.from({ length }, (_, index) => {
      return lostarkApi.post("auctions/items", { ...req, PageNo: index + 2 });
    });
    const responses = await Promise.all(promises);

    let Items = responses.reduce((acc: AuctionItem[], singleRes) => {
      return [...acc, ...singleRes.data.Items];
    }, []);
    Items = [...res.data.Items, ...Items];

    return {
      ...res.data,
      Items,
    };
  }
};

/**
 * 경매장에서 여러개의 상품을 동시에 검색합니다.
 * Promise.all 을 사용해 구현합니다.
 */
export const postMultipleAuctionItems = async (
  requests: Array<AuctionItemSearchReq>
): Promise<AuctionItemSearchResult[]> => {
  try {
    // 각각의 요청에 대해 postAuctionItems 사용
    const promises = requests.map((req) => postAuctionItems(req));

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error fetching multiple auction items:", error);
    throw error;
  }
};

/**
 * market api를 이용해 검색합니다.
 */
export const postMarketItems = async (
  req: MarketItemSearchReq,
  apiKey?: string
): Promise<MarketItemSearchResult> => {
  if (apiKey)
    lostarkApi.defaults.headers.common.Authorization = `Bearer ${apiKey}`;
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
