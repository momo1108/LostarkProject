import LostarkService from "@/service/LostarkService";
import { AuctionItem } from "@/types/EngraveType";
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
      tripod: string;
      tier: number;
      data: TripodReqType;
    }[];
    apiKey: string;
    subClass: string;
  };
}) => {
  const { reqData, apiKey, subClass } = e.data;
  console.log(e.data);
  console.log(reqData, apiKey, subClass);
  let result: { status: "SUCCESS" | "ERROR"; data: TripodResType[] | Error } = {
    status: "SUCCESS",
    data: [],
  };

  const tmpData: TripodResType[] = [];
  let errorCount = 0;
  for (let i = 0; i < reqData.length; i++) {
    errorCount = 0;
    while (true) {
      try {
        const res = await LostarkService.getAuctionItems(
          {
            SkillOptions: [reqData[i].data],
            Sort: "BUY_PRICE",
            CategoryCode: 170300,
            CharacterClass: subClass,
            PageNo: 0,
            SortCondition: "ASC",
          },
          apiKey
        );

        const index = tmpData.findIndex(
          (data) => data.Name === reqData[i].skill
        );
        if (index < 0) {
          tmpData.push({
            Name: reqData[i].skill,
            Tripods: [
              {
                Name: reqData[i].tripod,
                Tier: reqData[i].tier,
                BuyPrice: res.data.Items.map(
                  (item: AuctionItem) => item.AuctionInfo.BuyPrice
                ),
              },
            ],
          });
        } else {
          tmpData[index].Tripods.push({
            Name: reqData[i].tripod,
            Tier: reqData[i].tier,
            BuyPrice: res.data.Items.map(
              (item: AuctionItem) => item.AuctionInfo.BuyPrice
            ),
          });
        }

        break;
      } catch (err) {
        console.error(err);
        if (++errorCount >= 3) break;
      }
    }
    if (errorCount >= 3) {
      result.status = "ERROR";
      result.data = new Error(
        `검색 에러 : ${reqData[i].skill} 스킬의 ${reqData[i].tripod} 트라이포드 검색 중 에러가 발생했습니다.`
      );
      break;
    }
  }
  if (result.status === "SUCCESS") {
    result.data = tmpData;
  }
  postMessage(JSON.stringify(result));
};
