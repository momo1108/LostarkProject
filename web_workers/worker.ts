import { AuctionItem, AuctionOption } from "@/types/EngraveType";

let sum = 0,
  min = 9999999999;
let filter: {
  stat: { [key: string]: number };
  others: { [key: string]: number };
} = { stat: {}, others: {} };
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
    data: {
      infoObject: { [key: number]: AuctionItem[] };
      positiveCounter: { [key: string]: number };
      negativeCounter: { [key: string]: number };
    };
    filter: {
      stat: { [key: string]: number };
      others: { [key: string]: number };
    };
  };
}) => {
  /* 
      가지치기
      1. 남은 부위 수 * 9 보다 많이 남으면 skip
      2. penalty 각인이 생기면 skip
      */
  const { infoObject, positiveCounter, negativeCounter } = e.data.data;
  filter = e.data.filter;

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
      if (filtering(0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
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
        if (filtering(0, [], _ear1.AuctionInfo.TradeAllowCount)) continue;
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
          if (filtering(0, [], _ear2.AuctionInfo.TradeAllowCount)) continue;
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
            if (filtering(0, [], _ring1.AuctionInfo.TradeAllowCount)) continue;
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
                filtering(0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
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
      if (filtering(0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
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
        if (filtering(0, [], _ear1.AuctionInfo.TradeAllowCount)) continue;
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
          if (filtering(0, [], _ear2.AuctionInfo.TradeAllowCount)) continue;
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
            if (filtering(0, [], _ring1.AuctionInfo.TradeAllowCount)) continue;
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
                filtering(0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
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
      if (filtering(0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
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
        if (filtering(0, [], _ear1.AuctionInfo.TradeAllowCount)) continue;
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
          if (filtering(0, [], _ear2.AuctionInfo.TradeAllowCount)) continue;
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
            if (filtering(0, [], _ring1.AuctionInfo.TradeAllowCount)) continue;
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
                filtering(0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
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
    console.log("diff diff");
    for (let neckIndex = 0; neckIndex < infoObject[0].length; neckIndex++) {
      _neck = infoObject[0][neckIndex];
      if (filtering(0, [], _neck.AuctionInfo.TradeAllowCount)) continue;
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
        if (filtering(0, [], _ear1.AuctionInfo.TradeAllowCount)) continue;
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
          if (filtering(0, [], _ear2.AuctionInfo.TradeAllowCount)) continue;
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
            if (filtering(0, [], _ring1.AuctionInfo.TradeAllowCount)) continue;
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
                filtering(0, [], _ring2.AuctionInfo.TradeAllowCount) ||
                filtering(1, [_neck, _ear1, _ear2, _ring1, _ring2], 0)
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
};

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
 * @param type 0 : 거래 회수 체크, 1 : 특성합 체크
 * @param acc 악세서리 부위별 정보: [목, 귀1, 귀2, 반1, 반2]
 * @param count 남은 구매 후 거래 가능 횟수
 * @return false : 사용 가능, true : 사용 불가능
 */
function filtering(type: number, acc: AuctionItem[], count: number): boolean {
  if (type === 0) {
    return count < filter.others["거래 가능 횟수"];
  } else {
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
