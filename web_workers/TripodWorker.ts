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
      skillIcon: string;
      tripod: string;
      tripodIcon: string;
      tier: number;
      data: TripodReqType;
    }[];
    apiKey: string;
    subClass: string;
  };
}) => {
  const { reqData, apiKey, subClass } = e.data;
  // console.log(e.data);
  // console.log(reqData, apiKey, subClass);
  let result: {
    status: "SUCCESS" | "ERROR";
    code: number;
    data: TripodResType[] | string;
  } = {
    status: "SUCCESS",
    code: 200,
    data: [],
  };

  const tmpData: TripodResType[] = [];
  // let errorCount = 0;
  for (let i = 0; i < reqData.length; i++) {
    // errorCount = 0;
    // while (true) {
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

      const index = tmpData.findIndex((data) => data.Name === reqData[i].skill);
      if (index < 0) {
        const tripods = new Array(3).fill(null);
        tripods[reqData[i].tier] = {
          Name: reqData[i].tripod,
          Icon: reqData[i].tripodIcon,
          Tier: reqData[i].tier,
          BuyPrice: res.data.Items.map(
            (item: AuctionItem) => item.AuctionInfo.BuyPrice
          ),
        };

        tmpData.push({
          Name: reqData[i].skill,
          Icon: reqData[i].skillIcon,
          Tripods: tripods,
        });
      } else {
        tmpData[index].Tripods[reqData[i].tier] = {
          Name: reqData[i].tripod,
          Icon: reqData[i].tripodIcon,
          Tier: reqData[i].tier,
          BuyPrice: res.data.Items.map(
            (item: AuctionItem) => item.AuctionInfo.BuyPrice
          ),
        };
      }
    } catch (err: any) {
      console.error(err);
      result.status = "ERROR";
      result.code = err.response.status;
      result.data = `검색 에러 : ${reqData[i].skill} 스킬의 ${reqData[i].tripod} 트라이포드 검색 중 에러가 발생했습니다.`;
      break;
      // if (++errorCount >= 3) break;
    }
    // }
    // if (errorCount >= 3) {
    //   result.status = "ERROR";
    //   result.code = 400;
    //   result.data = new Error(
    //     `검색 에러 : ${reqData[i].skill} 스킬의 ${reqData[i].tripod} 트라이포드 검색 중 에러가 발생했습니다.`
    //   );
    //   break;
    // }
  }
  if (result.status === "SUCCESS") {
    result.data = tmpData;
  }
  postMessage(JSON.stringify(result));
};
