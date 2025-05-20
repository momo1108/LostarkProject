import { postMarketItems, postAuctionItems } from "@/service/LostarkService";
import { AuctionItem, AuctionItemSearchResult } from "@/types/LostarkApiType";
import { TripodReqType, TripodResType } from "@/types/TripodType";

/**
 * 현재 searchSetting 함수에서 찾아낸 resultObject 안의
 * 악세서리 데이터들을 조합해서 페널티 각인 없이 가능한 조합을
 * 찾아내는 함수.
 */
onmessage = async (e: {
  data: {
    reqData: {
      skill: string;
      skillIcon: string;
      tripod: string;
      tripodIcon: string;
      tier: number;
      data: TripodReqType;
    }[];
    apiKey: string;
  };
}) => {
  const { reqData, apiKey } = e.data;
  let result: {
    status: "SUCCESS" | "ERROR" | "INFORMATION";
    code: number;
    data: TripodResType[] | string | number;
  } = {
    status: "SUCCESS",
    code: 200,
    data: [],
  };

  let powderOfSage = 0;
  try {
    const res = await postMarketItems(
      {
        Sort: "CURRENT_MIN_PRICE",
        SortCondition: "ASC",
        CategoryCode: 50000,
        ItemName: "현자의 가루",
        PageNo: 0,
      },
      apiKey
    );

    powderOfSage = res.Items[0].CurrentMinPrice;
  } catch (err: any) {
    console.error(err);
    result.status = "ERROR";
    if (err.response) {
      result.code = err.response.status;
      if (result.code === 429) {
        result.data = `검색 에러 : API 요청 제한 초과. 1분간 대기`;
        postMessage(JSON.stringify(result));
        await new Promise((res) => {
          setTimeout(() => {
            res("done");
          }, 61000);
        });
      } else {
        result.data = `검색 에러 : 현자의 가루 가격 검색 중 에러가 발생했습니다.`;
        postMessage(JSON.stringify(result));
        return;
      }
    } else {
      result.code = 500;
      result.data = err.stack;
      postMessage(JSON.stringify(result));
      return;
    }
  }

  const tmpData: TripodResType[] = [];
  let i = 0;

  while (i < reqData.length) {
    try {
      const data = await postAuctionItems({
        SkillOptions: [reqData[i].data],
        Sort: "BUY_PRICE",
        CategoryCode: 170300,
        PageNo: 0,
        SortCondition: "ASC",
      });
      data.Items = data.TotalCount === 0 ? [] : data.Items;

      const index = tmpData.findIndex((data) => data.Name === reqData[i].skill);
      if (index < 0) {
        const tripods = new Array(3).fill(null);
        const [Possibility, Total] = calcPrice(
          powderOfSage,
          reqData[i].data.MinValue,
          data
        );
        tripods[reqData[i].tier] = {
          Name: reqData[i].tripod,
          Icon: reqData[i].tripodIcon,
          Tier: reqData[i].tier,
          Possibility,
          Price: {
            All: data.Items.filter(
              (item: AuctionItem) => item.AuctionInfo.BuyPrice
            ).map((item: AuctionItem) => item.AuctionInfo.BuyPrice),
            Total,
          },
        };

        tmpData.push({
          Name: reqData[i].skill,
          Icon: reqData[i].skillIcon,
          Tripods: tripods,
        });
      } else {
        const [Possibility, Total] = calcPrice(
          powderOfSage,
          reqData[i].data.MinValue,
          data
        );
        tmpData[index].Tripods[reqData[i].tier] = {
          Name: reqData[i].tripod,
          Icon: reqData[i].tripodIcon,
          Tier: reqData[i].tier,
          Possibility,
          Price: {
            All: data.Items.filter(
              (item: AuctionItem) => item.AuctionInfo.BuyPrice
            ).map((item: AuctionItem) => item.AuctionInfo.BuyPrice),
            Total,
          },
        };
      }
      postMessage(
        JSON.stringify({
          status: "INFORMATION",
          code: 102,
          data: ++i,
        })
      );
    } catch (err: any) {
      console.error(err);
      result.status = "ERROR";
      if (err.response) {
        result.code = err.response.status;
        if (result.code === 429) {
          result.data = `검색 에러 : API 요청 제한 초과. 1분간 대기`;
          postMessage(JSON.stringify(result));
          await new Promise((res) => {
            setTimeout(() => {
              res("done");
            }, 61000);
          });
        } else {
          result.data = `검색 에러 : ${reqData[i].skill} 스킬의 ${reqData[i].tripod} 트라이포드 검색 중 에러가 발생했습니다.`;
          postMessage(JSON.stringify(result));
          break;
        }
      } else {
        result.code = 500;
        result.data = err.stack;
        postMessage(JSON.stringify(result));
        return;
      }
    }
  }
  result.status = "SUCCESS";
  result.code = 200;
  result.data = tmpData;
  postMessage(JSON.stringify(result));
};

function calcPrice(
  powderOfSage: number,
  level: number,
  data: AuctionItemSearchResult
): [
  { Before: boolean; After: boolean },
  { Exclude: number; IncludeWithCost: number; IncludeWithoutCost: number }
] {
  const possibility = {
    Before: false,
    After: false,
  };
  const total = {
    Exclude: 0,
    IncludeWithCost: 0,
    IncludeWithoutCost: 0,
  };
  let maxCount = 0;
  if (level === 4) {
    maxCount = 4;
    if (data.Items.length >= 4) {
      possibility.Before = true;
      possibility.After = true;
      total.Exclude = data.Items.slice(0, maxCount).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
      total.IncludeWithCost =
        data.Items.slice(0, maxCount / 2).reduce(
          (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
          0
        ) +
        powderOfSage * (maxCount / 2);
      total.IncludeWithoutCost = data.Items.slice(0, maxCount / 2).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
    } else if (data.Items.length >= 2) {
      possibility.Before = false;
      possibility.After = true;
      total.Exclude = data.Items.slice(0, data.Items.length).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
      total.IncludeWithCost =
        data.Items.slice(0, maxCount / 2).reduce(
          (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
          0
        ) +
        powderOfSage * (maxCount / 2);
      total.IncludeWithoutCost = data.Items.slice(0, maxCount / 2).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
    } else {
      possibility.Before = false;
      possibility.After = false;
      total.Exclude = data.Items.slice(0, data.Items.length).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
      total.IncludeWithCost =
        data.Items.slice(0, data.Items.length).reduce(
          (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
          0
        ) +
        powderOfSage * data.Items.length;
      total.IncludeWithoutCost = data.Items.slice(0, data.Items.length).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
    }
  } else if (level === 5) {
    maxCount = 10;
    if (data.Items.length >= 10) {
      possibility.Before = true;
      possibility.After = true;
      total.Exclude = data.Items.slice(0, maxCount).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
      total.IncludeWithCost =
        data.Items.slice(0, maxCount / 2).reduce(
          (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
          0
        ) +
        powderOfSage * (maxCount / 2);
      total.IncludeWithoutCost = data.Items.slice(0, maxCount / 2).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
    } else if (data.Items.length >= 5) {
      possibility.Before = false;
      possibility.After = true;
      total.Exclude = data.Items.slice(0, data.Items.length).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
      total.IncludeWithCost =
        data.Items.slice(0, maxCount / 2).reduce(
          (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
          0
        ) +
        powderOfSage * (maxCount / 2);
      total.IncludeWithoutCost = data.Items.slice(0, maxCount / 2).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
    } else {
      possibility.Before = false;
      possibility.After = false;
      total.Exclude = data.Items.slice(0, data.Items.length).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
      total.IncludeWithCost =
        data.Items.slice(0, data.Items.length).reduce(
          (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
          0
        ) +
        powderOfSage * data.Items.length;
      total.IncludeWithoutCost = data.Items.slice(0, data.Items.length).reduce(
        (prev: number, cur) => prev + cur.AuctionInfo.BuyPrice,
        0
      );
    }
  }
  return [possibility, total];
}
