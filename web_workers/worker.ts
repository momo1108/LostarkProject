import EngraveService from "@/service/EngraveService";
import { AccessoryInfo, AuctionItem, AuctionOption } from "@/types/EngraveType";
import { Dispatch, SetStateAction } from "react";

// GlobalType import 시 내부의 font 설정 함수가 문제를 발생시켜서, 직접 사용 조치.
const CATEGORY_CODE: { [key: string | number]: number } = {
  목걸이: 200010,
  0: 200010,
  귀걸이: 200020,
  1: 200020,
  반지: 200030,
  2: 200030,
  팔찌: 200040,
  "어빌리티 스톤": 30000,
  아뮬렛: 170300,
  보석: 210000,
  각인서: 40000,
};

const ETC_OPTION_CODE: { [key: string]: number | null } = {
  ANY: null,
  // 전투 특성
  "전투 특성": 2,
  치명: 15,
  특화: 16,
  제압: 17,
  신속: 18,
  인내: 19,
  숙련: 20,
  // 각인 효과
  "각인 효과": 3,
  원한: 118,
  "굳은 의지": 123,
  "실드 관통": 237,
  강령술: 243,
  "저주받은 인형": 247,
  각성: 255,
  "안정된 상태": 111,
  "위기 모면": 140,
  "달인의 저력": 238,
  "중갑 착용": 240,
  "강화 방패": 242,
  "부러진 뼈": 245,
  승부사: 248,
  "기습의 대가": 249,
  "마나의 흐름": 251,
  돌격대장: 254,
  "약자 무시": 107,
  "정기 흡수": 109,
  "에테르 포식자": 110,
  "슈퍼 차지": 121,
  구슬동자: 134,
  "예리한 둔기": 141,
  불굴: 235,
  "여신의 가호": 239,
  선수필승: 244,
  "급소 타격": 142,
  "분쇄의 주먹": 236,
  "폭발물 전문가": 241,
  "번개의 분노": 246,
  바리케이드: 253,
  "마나 효율 증가": 168,
  "최대 마나 증가": 167,
  "탈출의 명수": 202,
  "결투의 대가": 288,
  "질량 증가": 295,
  추진력: 296,
  "타격의 대가": 297,
  "시선 집중": 298,
  아드레날린: 299,
  속전속결: 300,
  전문의: 301,
  긴급구조: 302,
  "정밀 단도": 303,
  광기: 125,
  "오의 강화": 127,
  "강화 무기": 129,
  "화력 강화": 130,
  "광전사의 비기": 188,
  초심: 189,
  "극의: 체술": 190,
  "충격 단련": 191,
  핸드거너: 192,
  "포격 강화": 193,
  "진실된 용맹": 194,
  "절실한 구원": 195,
  점화: 293,
  환류: 294,
  "분노의 망치": 196,
  "중력 수련": 197,
  "상급 소환사": 198,
  "넘치는 교감": 199,
  "황후의 은총": 200,
  "황제의 칙령": 201,
  "전투 태세": 224,
  "고독한 기사": 225,
  세맥타통: 256,
  역천지체: 257,
  "두 번째 동료": 258,
  "죽음의 습격": 259,
  절정: 276,
  절제: 277,
  "잔재된 기운": 278,
  버스트: 279,
  "완벽한 억제": 280,
  "멈출 수 없는 충동": 281,
  심판자: 282,
  "축복의 오라": 283,
  "아르데타인의 기술": 284,
  "진화의 유산": 285,
  갈증: 286,
  "달의 소리": 287,
  피스메이커: 289,
  "사냥의 시간": 290,
  일격필살: 291,
  오의난무: 292,
  회귀: 305,
  만개: 306,
  질풍노도: 307,
  이슬비: 308,
  포식자: 309,
  처단자: 310,
  // 감소 효과
  "공격력 감소": 800,
  "공격속도 감소": 802,
  "방어력 감소": 801,
  "이동속도 감소": 803,
  // 팔찌 기본 효과
  "팔찌 기본 효과": 1,
  힘: 3,
  민첩: 4,
  지능: 5,
  체력: 6,
  // 팔찌 특수 효과
  "팔찌 특수 효과": 5,
  강타: 39,
  "긴급 수혈": 33,
  돌진: 38,
  마나회수: 36,
  "마법 방어력": 2,
  멸시: 29,
  무시: 30,
  "물리 방어력": 1,
  반격: 28,
  반전: 31,
  속공: 26,
  앵콜: 35,
  오뚝이: 37,
  "응급 처치": 34,
  "전투 중 생명력 회복량": 6,
  "최대 마나": 4,
  "최대 생명력": 3,
  타격: 40,
  투자: 27,
  회생: 32,
  // 팔지 옵션 수량
  "팔지 옵션 수량": 4,
  "고정 효과 수량": 1,
  "부여 효과 수량": 2,
};

let sum = 0,
  min = 9999999999;
const currentStat: { [key: string]: number } = {
  치명: 0,
  특화: 0,
  신속: 0,
  제압: 0,
  인내: 0,
  숙련: 0,
};
let filteringResult = false;

/**
 * 현재 searchSetting 함수에서 찾아낸 resultObject 안의
 * 악세서리 데이터들을 조합해서 페널티 각인 없이 가능한 조합을
 * 찾아내는 함수.
 * @param infoObject 검색된 정보를 가진 array(resultObject)
 * @param singleArray 현재 조합정보를 저장할 배열
 * @param negativeCounter 페널티 각인 카운트를 저장할 객체
 */
onmessage = (e: {
  data: {
    type: number;
    data: {
      infoObject: { [key: number]: AuctionItem[] };
      positiveCounter: { [key: string]: number };
      negativeCounter: { [key: string]: number };
      uniqueEngrave: [string, number, string, number][];
      ear_diff: boolean;
      ring_diff: boolean;
      accessoryList: {
        getter: AccessoryInfo[];
        setter: Dispatch<SetStateAction<AccessoryInfo>>[];
      };
      apiKey: string;
    };
    filter: {
      stat: { [key: string]: number };
      others: { [key: string]: number };
    };
  };
}) => {
  if (e.data.type === 0) {
    apiSearching(e.data.data, e.data.filter);
  } else if (e.data.type === 1) {
    resultFiltering(e.data.data, e.data.filter);
  }
};

async function apiSearching(
  data: {
    uniqueEngrave: [string, number, string, number][];
    ear_diff: boolean;
    ring_diff: boolean;
    accessoryList: {
      getter: AccessoryInfo[];
      setter: Dispatch<SetStateAction<AccessoryInfo>>[];
    };
    apiKey: string;
  },
  filter: {
    stat: { [key: string]: number };
    others: { [key: string]: number };
  }
) {
  const { uniqueEngrave, ear_diff, ring_diff, accessoryList, apiKey } = data;
  const ItemGrade = ["고대", "유물", ""][filter.others["악세서리 등급"]];
  let single_res;
  let errorArray = [];
  let tmp_resultObject: { [key: number]: AuctionItem[] } = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  };

  // 고유 각인 반복
  for (let u = 0; u < uniqueEngrave.length; u++) {
    // 악세서리 부위(accessory part) 반복
    for (let ap = 0; ap < 5; ap++) {
      if ((ap === 2 && !ear_diff) || (ap === 4 && !ring_diff)) continue;
      while (true) {
        try {
          // console.log(u, ap);
          single_res = await EngraveService.getAuctionItems(
            {
              CategoryCode: CATEGORY_CODE[accessoryList.getter[ap].type],
              EtcOptions: [
                ...(accessoryList.getter[ap].type === 0
                  ? [
                      {
                        FirstOption: ETC_OPTION_CODE["전투 특성"],
                        SecondOption:
                          ETC_OPTION_CODE[accessoryList.getter[ap].stat1.type],
                      },
                      {
                        FirstOption: ETC_OPTION_CODE["전투 특성"],
                        SecondOption:
                          ETC_OPTION_CODE[accessoryList.getter[ap].stat2.type],
                      },
                    ]
                  : [
                      {
                        FirstOption: ETC_OPTION_CODE["전투 특성"],
                        SecondOption:
                          ETC_OPTION_CODE[accessoryList.getter[ap].stat1.type],
                      },
                    ]),
                {
                  FirstOption: ETC_OPTION_CODE["각인 효과"],
                  SecondOption: ETC_OPTION_CODE[uniqueEngrave[u][0]],
                  MinValue: uniqueEngrave[u][1],
                },
                {
                  FirstOption: ETC_OPTION_CODE["각인 효과"],
                  SecondOption: ETC_OPTION_CODE[uniqueEngrave[u][2]],
                  MinValue: uniqueEngrave[u][3],
                },
              ],
              ItemGrade,
              ItemGradeQuality: accessoryList.getter[ap].quality,
              ItemTier: 3,
              PageNo: 1,
              Sort: "BUY_PRICE",
              SortCondition: "ASC",
            },
            apiKey
          );
          // 해당 악세가 없으면 Items 가 null 로 반환됨
          if (single_res.data.Items)
            tmp_resultObject[ap].push(...single_res.data.Items);
          postMessage({ type: 2 });
          break;
        } catch (error: any) {
          console.dir(error);
          if (error.response?.status === 429) {
            postMessage({ type: 3 });
            await new Promise((res) => {
              setTimeout(() => {
                res("done");
              }, 62000);
            });
          } else if (error.response?.status === 503) {
            postMessage({ type: 4 });
            return;
          } else if (error.response?.status === 401) {
            postMessage({ type: 5 });
            return;
          } else {
            errorArray.push(error);
            if (errorArray.length >= 3) {
              postMessage({
                type: 6,
                errorArray: JSON.parse(JSON.stringify(errorArray)),
              });
              return;
            }
          }
        }
      }
    }
  }

  postMessage({
    type: 7,
    tmp_resultObject,
  });
}

function resultFiltering(
  data: {
    infoObject: { [key: number]: AuctionItem[] };
    positiveCounter: { [key: string]: number };
    negativeCounter: { [key: string]: number };
  },
  filter: {
    stat: { [key: string]: number };
    others: { [key: string]: number };
  }
) {
  /* 
    가지치기
    1. 남은 부위 수 * 9 보다 많이 남으면 skip
    2. penalty 각인이 생기면 skip
  */
  const { infoObject, positiveCounter, negativeCounter } = data;
  console.log(infoObject);

  const availableArray: number[][][] = [];
  let _neck: AuctionItem,
    _ear1: AuctionItem,
    _ear2: AuctionItem,
    _ring1: AuctionItem,
    _ring2: AuctionItem,
    tmpPositive: number[];
  (sum = 0), (min = 9999999999);

  if (infoObject[2].length && infoObject[4].length) {
    for (let neckIndex = 0; neckIndex < infoObject[0].length; neckIndex++) {
      _neck = infoObject[0][neckIndex];
      if (filtering(filter, 0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, false);
      tmpPositive = Object.values(positiveCounter);
      // 목표각인 불가능한 경우
      if (
        checkNegative(negativeCounter) ||
        checkPositive(tmpPositive, 0) ||
        (availableArray.length === 100 && sum >= min)
      ) {
        applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
        continue;
      }
      for (let ear1Index = 0; ear1Index < infoObject[1].length; ear1Index++) {
        postMessage({
          type: 0,
          data:
            (infoObject[1].length * neckIndex + ear1Index) /
            (infoObject[0].length * infoObject[1].length),
        });
        _ear1 = infoObject[1][ear1Index];
        if (filtering(filter, 0, [], _ear1.AuctionInfo.TradeAllowCount))
          continue;
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, false);
        tmpPositive = Object.values(positiveCounter);
        // 목표각인 불가능한 경우
        if (
          checkNegative(negativeCounter) ||
          checkPositive(tmpPositive, 1) ||
          (availableArray.length === 100 && sum >= min)
        ) {
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
          continue;
        }
        for (let ear2Index = 0; ear2Index < infoObject[2].length; ear2Index++) {
          _ear2 = infoObject[2][ear2Index];
          if (filtering(filter, 0, [], _ear2.AuctionInfo.TradeAllowCount))
            continue;
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, false);
          tmpPositive = Object.values(positiveCounter);
          // 목표각인 불가능한 경우
          if (
            checkNegative(negativeCounter) ||
            checkPositive(tmpPositive, 2) ||
            (availableArray.length === 100 && sum >= min)
          ) {
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ear2,
              true
            );
            continue;
          }
          for (
            let ring1Index = 0;
            ring1Index < infoObject[3].length;
            ring1Index++
          ) {
            _ring1 = infoObject[3][ring1Index];
            if (filtering(filter, 0, [], _ring1.AuctionInfo.TradeAllowCount))
              continue;
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              false
            );
            tmpPositive = Object.values(positiveCounter);
            // 목표각인 불가능한 경우
            if (
              checkNegative(negativeCounter) ||
              checkPositive(tmpPositive, 3) ||
              (availableArray.length === 100 && sum >= min)
            ) {
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring1,
                true
              );
              continue;
            }
            for (
              let ring2Index = 0;
              ring2Index < infoObject[4].length;
              ring2Index++
            ) {
              _ring2 = infoObject[4][ring2Index];
              if (
                filtering(filter, 0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(filter, 1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
              )
                continue;
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                false
              );
              tmpPositive = Object.values(positiveCounter);
              // 목표각인 불가능한 경우
              if (
                checkNegative(negativeCounter) ||
                checkPositive(tmpPositive, 4) ||
                (availableArray.length === 100 && sum >= min)
              ) {
                applyAccessoryEngrave(
                  positiveCounter,
                  negativeCounter,
                  _ring2,
                  true
                );
                continue;
              }

              availableArray.push([
                [neckIndex, 0],
                [ear1Index, 1],
                [ear2Index, 2],
                [ring1Index, 3],
                [ring2Index, 4],
                [sum],
              ]);
              availableArray.sort((a, b) => a[5][0] - b[5][0]);
              if (availableArray.length > 100) {
                availableArray.pop();
                min = availableArray[99][5][0];
              }
              // console.log(availableArray);

              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                true
              );
            }
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              true
            );
          }
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, true);
        }
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
      }
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
    }
  } else if (infoObject[2].length) {
    for (let neckIndex = 0; neckIndex < infoObject[0].length; neckIndex++) {
      _neck = infoObject[0][neckIndex];
      if (filtering(filter, 0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, false);
      tmpPositive = Object.values(positiveCounter);
      // 목표각인 불가능한 경우
      if (
        checkNegative(negativeCounter) ||
        checkPositive(tmpPositive, 0) ||
        (availableArray.length === 100 && sum >= min)
      ) {
        applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
        continue;
      }
      for (let ear1Index = 0; ear1Index < infoObject[1].length; ear1Index++) {
        postMessage({
          type: 0,
          data:
            (infoObject[1].length * neckIndex + ear1Index) /
            (infoObject[0].length * infoObject[1].length),
        });
        _ear1 = infoObject[1][ear1Index];
        if (filtering(filter, 0, [], _ear1.AuctionInfo.TradeAllowCount))
          continue;
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, false);
        tmpPositive = Object.values(positiveCounter);
        // 목표각인 불가능한 경우
        if (
          checkNegative(negativeCounter) ||
          checkPositive(tmpPositive, 1) ||
          (availableArray.length === 100 && sum >= min)
        ) {
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
          continue;
        }
        for (let ear2Index = 0; ear2Index < infoObject[2].length; ear2Index++) {
          _ear2 = infoObject[2][ear2Index];
          if (filtering(filter, 0, [], _ear2.AuctionInfo.TradeAllowCount))
            continue;
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, false);
          tmpPositive = Object.values(positiveCounter);
          // 목표각인 불가능한 경우
          if (
            checkNegative(negativeCounter) ||
            checkPositive(tmpPositive, 2) ||
            (availableArray.length === 100 && sum >= min)
          ) {
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ear2,
              true
            );
            continue;
          }
          for (
            let ring1Index = 0;
            ring1Index < infoObject[3].length;
            ring1Index++
          ) {
            _ring1 = infoObject[3][ring1Index];
            if (filtering(filter, 0, [], _ring1.AuctionInfo.TradeAllowCount))
              continue;
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              false
            );
            tmpPositive = Object.values(positiveCounter);
            // 목표각인 불가능한 경우
            if (
              checkNegative(negativeCounter) ||
              checkPositive(tmpPositive, 3) ||
              (availableArray.length === 100 && sum >= min)
            ) {
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring1,
                true
              );
              continue;
            }
            for (
              let ring2Index = ring1Index + 1;
              ring2Index < infoObject[3].length;
              ring2Index++
            ) {
              _ring2 = infoObject[3][ring2Index];
              if (
                filtering(filter, 0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(filter, 1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
              )
                continue;
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                false
              );
              tmpPositive = Object.values(positiveCounter);
              // 목표각인 불가능한 경우
              if (
                checkNegative(negativeCounter) ||
                checkPositive(tmpPositive, 4) ||
                (availableArray.length === 100 && sum >= min)
              ) {
                applyAccessoryEngrave(
                  positiveCounter,
                  negativeCounter,
                  _ring2,
                  true
                );
                continue;
              }

              availableArray.push([
                [neckIndex, 0],
                [ear1Index, 1],
                [ear2Index, 2],
                [ring1Index, 3],
                [ring2Index, 3],
                [sum],
              ]);
              availableArray.sort((a, b) => a[5][0] - b[5][0]);
              if (availableArray.length > 100) {
                availableArray.pop();
                min = availableArray[99][5][0];
              }

              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                true
              );
            }
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              true
            );
          }
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, true);
        }
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
      }
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
    }
  } else if (infoObject[4].length) {
    for (let neckIndex = 0; neckIndex < infoObject[0].length; neckIndex++) {
      _neck = infoObject[0][neckIndex];
      if (filtering(filter, 0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, false);
      tmpPositive = Object.values(positiveCounter);
      // 목표각인 불가능한 경우
      if (
        checkNegative(negativeCounter) ||
        checkPositive(tmpPositive, 0) ||
        (availableArray.length === 100 && sum >= min)
      ) {
        applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
        continue;
      }
      for (let ear1Index = 0; ear1Index < infoObject[1].length; ear1Index++) {
        postMessage({
          type: 0,
          data:
            (infoObject[1].length * neckIndex + ear1Index) /
            (infoObject[0].length * infoObject[1].length),
        });
        _ear1 = infoObject[1][ear1Index];
        if (filtering(filter, 0, [], _ear1.AuctionInfo.TradeAllowCount))
          continue;
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, false);
        tmpPositive = Object.values(positiveCounter);
        // 목표각인 불가능한 경우
        if (
          checkNegative(negativeCounter) ||
          checkPositive(tmpPositive, 1) ||
          (availableArray.length === 100 && sum >= min)
        ) {
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
          continue;
        }
        for (
          let ear2Index = ear1Index + 1;
          ear2Index < infoObject[1].length;
          ear2Index++
        ) {
          _ear2 = infoObject[1][ear2Index];
          if (filtering(filter, 0, [], _ear2.AuctionInfo.TradeAllowCount))
            continue;
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, false);
          tmpPositive = Object.values(positiveCounter);
          // 목표각인 불가능한 경우
          if (
            checkNegative(negativeCounter) ||
            checkPositive(tmpPositive, 2) ||
            (availableArray.length === 100 && sum >= min)
          ) {
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ear2,
              true
            );
            continue;
          }
          for (
            let ring1Index = 0;
            ring1Index < infoObject[3].length;
            ring1Index++
          ) {
            _ring1 = infoObject[3][ring1Index];
            if (filtering(filter, 0, [], _ring1.AuctionInfo.TradeAllowCount))
              continue;
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              false
            );
            tmpPositive = Object.values(positiveCounter);
            // 목표각인 불가능한 경우
            if (
              checkNegative(negativeCounter) ||
              checkPositive(tmpPositive, 3) ||
              (availableArray.length === 100 && sum >= min)
            ) {
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring1,
                true
              );
              continue;
            }
            for (
              let ring2Index = 0;
              ring2Index < infoObject[4].length;
              ring2Index++
            ) {
              _ring2 = infoObject[4][ring2Index];
              if (
                filtering(filter, 0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(filter, 1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
              )
                continue;
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                false
              );
              tmpPositive = Object.values(positiveCounter);
              // 목표각인 불가능한 경우
              if (
                checkNegative(negativeCounter) ||
                checkPositive(tmpPositive, 4) ||
                (availableArray.length === 100 && sum >= min)
              ) {
                applyAccessoryEngrave(
                  positiveCounter,
                  negativeCounter,
                  _ring2,
                  true
                );
                continue;
              }

              availableArray.push([
                [neckIndex, 0],
                [ear1Index, 1],
                [ear2Index, 1],
                [ring1Index, 3],
                [ring2Index, 4],
                [sum],
              ]);
              availableArray.sort((a, b) => a[5][0] - b[5][0]);
              if (availableArray.length > 100) {
                availableArray.pop();
                min = availableArray[99][5][0];
              }

              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                true
              );
            }
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              true
            );
          }
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, true);
        }
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
      }
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
    }
  } else {
    // console.log("diff diff");
    for (let neckIndex = 0; neckIndex < infoObject[0].length; neckIndex++) {
      _neck = infoObject[0][neckIndex];
      if (filtering(filter, 0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, false);
      tmpPositive = Object.values(positiveCounter);
      // 목표각인 불가능한 경우
      if (
        checkNegative(negativeCounter) ||
        checkPositive(tmpPositive, 0) ||
        (availableArray.length === 100 && sum >= min)
      ) {
        applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
        continue;
      }
      for (let ear1Index = 0; ear1Index < infoObject[1].length; ear1Index++) {
        postMessage({
          type: 0,
          data:
            (infoObject[1].length * neckIndex + ear1Index) /
            (infoObject[0].length * infoObject[1].length),
        });
        _ear1 = infoObject[1][ear1Index];
        if (filtering(filter, 0, [], _ear1.AuctionInfo.TradeAllowCount))
          continue;
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, false);
        tmpPositive = Object.values(positiveCounter);
        // 목표각인 불가능한 경우
        if (
          checkNegative(negativeCounter) ||
          checkPositive(tmpPositive, 1) ||
          (availableArray.length === 100 && sum >= min)
        ) {
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
          continue;
        }
        for (
          let ear2Index = ear1Index + 1;
          ear2Index < infoObject[1].length;
          ear2Index++
        ) {
          _ear2 = infoObject[1][ear2Index];
          if (filtering(filter, 0, [], _ear2.AuctionInfo.TradeAllowCount))
            continue;
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, false);
          tmpPositive = Object.values(positiveCounter);
          // 목표각인 불가능한 경우
          if (
            checkNegative(negativeCounter) ||
            checkPositive(tmpPositive, 2) ||
            (availableArray.length === 100 && sum >= min)
          ) {
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ear2,
              true
            );
            continue;
          }
          for (
            let ring1Index = 0;
            ring1Index < infoObject[3].length;
            ring1Index++
          ) {
            _ring1 = infoObject[3][ring1Index];
            if (filtering(filter, 0, [], _ring1.AuctionInfo.TradeAllowCount))
              continue;
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              false
            );
            tmpPositive = Object.values(positiveCounter);
            // 목표각인 불가능한 경우
            if (
              checkNegative(negativeCounter) ||
              checkPositive(tmpPositive, 3) ||
              (availableArray.length === 100 && sum >= min)
            ) {
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring1,
                true
              );
              continue;
            }
            for (
              let ring2Index = ring1Index + 1;
              ring2Index < infoObject[3].length;
              ring2Index++
            ) {
              _ring2 = infoObject[3][ring2Index];
              if (
                filtering(filter, 0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(filter, 1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
              )
                continue;
              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                false
              );
              tmpPositive = Object.values(positiveCounter);
              // 목표각인 불가능한 경우
              if (
                checkNegative(negativeCounter) ||
                checkPositive(tmpPositive, 4) ||
                (availableArray.length === 100 && sum >= min)
              ) {
                applyAccessoryEngrave(
                  positiveCounter,
                  negativeCounter,
                  _ring2,
                  true
                );
                continue;
              }

              availableArray.push([
                [neckIndex, 0],
                [ear1Index, 1],
                [ear2Index, 1],
                [ring1Index, 3],
                [ring2Index, 3],
                [sum],
              ]);
              availableArray.sort((a, b) => a[5][0] - b[5][0]);
              if (availableArray.length > 100) {
                availableArray.pop();
                min = availableArray[99][5][0];
              }

              applyAccessoryEngrave(
                positiveCounter,
                negativeCounter,
                _ring2,
                true
              );
            }
            applyAccessoryEngrave(
              positiveCounter,
              negativeCounter,
              _ring1,
              true
            );
          }
          applyAccessoryEngrave(positiveCounter, negativeCounter, _ear2, true);
        }
        applyAccessoryEngrave(positiveCounter, negativeCounter, _ear1, true);
      }
      applyAccessoryEngrave(positiveCounter, negativeCounter, _neck, true);
    }
  }

  postMessage({ type: 0, data: 1 });
  postMessage({ type: 1, data: { infoObject, availableArray } });
}

/**
 * 각인 적용 함수
 * @param positiveCounter 목표 각인 정보
 * @param negativeCounter 감소 각인 정보
 * @param _acc 현재 적용할 악세서리 정보
 * @param rollback true: 되돌리기 작업, false: 적용 작업
 */
function applyAccessoryEngrave(
  positiveCounter: { [key: string]: number },
  negativeCounter: { [key: string]: number },
  _acc: AuctionItem,
  rollback: boolean
) {
  if (rollback) {
    sum -= _acc.AuctionInfo.BuyPrice;
    _acc.Options.forEach((e) => {
      if (e.Type === "ABILITY_ENGRAVE") {
        if (e.IsPenalty) negativeCounter[e.OptionName] -= e.Value;
        else positiveCounter[e.OptionName] += e.Value;
      }
    });
  } else {
    sum += _acc.AuctionInfo.BuyPrice;
    _acc.Options.forEach((e) => {
      if (e.Type === "ABILITY_ENGRAVE") {
        if (e.IsPenalty) negativeCounter[e.OptionName] += e.Value;
        else positiveCounter[e.OptionName] -= e.Value;
      }
    });
  }
}

/**
 * 목표 각인 체크 함수
 * @param positiveValues 목표 각인 남은 포인트 배열
 * @param type 현재 적용된 악세서리
 * @returns true : 목표 미달성, false : 목표 달성
 */
function checkPositive(positiveValues: number[], type: number) {
  for (let i = 0; i < 4 - type; i++) {
    positiveValues = positiveValues.filter((e) => e > 0).sort((a, b) => b - a);
    if (positiveValues.length > 1) {
      positiveValues[0] -= 6;
      positiveValues[positiveValues.length - 1] -= 3;
    } else if (positiveValues.length > 0) positiveValues[0] -= 6;
    else break;
  }
  return !!positiveValues.find((e) => e > 0);
}

/**
 * 감소 각인 체크 함수
 * @param negativeCounter 감소정보
 * @param options 악세서리 옵션정보
 * @returns true : 감소 효과 발동, false : 감소 효과 미발동
 */
function checkNegative(negativeCounter: { [key: string]: number }): boolean {
  for (const negative in negativeCounter) {
    if (negativeCounter[negative] > 4) return true;
  }
  return false;
}

/**
 * 필터링 조건을 적용해서 불가능한 조합인지 체크해주는 함수
 * @param type 0 : 거래 회수 체크, 1 : 특성합 체크, 고대악세개수 체크
 * @param acc 악세서리 부위별 정보: [목, 귀1, 귀2, 반1, 반2]
 * @param count 남은 구매 후 거래 가능 횟수
 * @return false : 사용 가능, true : 사용 불가능
 */
function filtering(
  filter: {
    stat: { [key: string]: number };
    others: { [key: string]: number };
  },
  type: number,
  acc: AuctionItem[],
  count: number
): boolean {
  if (type === 0) {
    return count < filter.others["거래 가능 횟수"];
  } else {
    // 고대+유물 조합에 고대유물 개수가 충족되지 않는 경우.
    if (
      filter.others["악세서리 등급"] === 2 &&
      filter.others["고대등급 악세서리 개수"] >
        acc.reduce(
          (prev: number, cur: AuctionItem) =>
            cur.Grade === "고대" ? prev + 1 : prev,
          0
        )
    ) {
      return true;
    }
    filteringResult = false;
    Object.keys(currentStat).forEach((e: string) => (currentStat[e] = 0));
    acc.forEach((e) => {
      e.Options.forEach((option: AuctionOption) => {
        if (option.Type === "STAT")
          currentStat[option.OptionName] += option.Value;
      });
    });
    Object.keys(currentStat).forEach((e: string) => {
      if (currentStat[e] < filter.stat[e]) filteringResult = true;
    });

    return filteringResult;
  }
}
