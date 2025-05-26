const { readFileSync, writeFileSync } = require("fs");

const getRefiningEffect = () => {
  const fileData = JSON.parse(readFileSync("data/auctionOptions.json"));
  const refiningEffectOptions = fileData.EtcOptions.find(
    (option) => option.Value === 7
  );
  console.log(
    refiningEffectOptions.EtcSubs.map((option) => [
      option.Text,
      option.EtcValues.length,
    ])
  );
};

const getRefiningEffectTextByCategory = () => {
  const fileData = JSON.parse(readFileSync("data/auctionOptions.json"));
  const CATEGORY_CODE_MAP = {
    200010: "목걸이",
    200020: "귀걸이",
    200030: "반지",
  };

  const RefiningOptions = fileData.EtcOptions.find(
    (obj) => obj.Value && obj.Value === 7
  );

  const OrganizedRefiningOptions = RefiningOptions.EtcSubs.reduce(
    (prev, cur) => {
      if (cur.Categorys) {
        prev[CATEGORY_CODE_MAP[cur.Categorys[0]]].push(cur.Text);
      } else {
        prev["목걸이"].push(cur.Text);
        prev["귀걸이"].push(cur.Text);
        prev["반지"].push(cur.Text);
      }
      return prev;
    },
    { 목걸이: [], 귀걸이: [], 반지: [] }
  );

  console.log(OrganizedRefiningOptions);
};

const refactorRefiningEffectOptions = () => {
  const fileData = JSON.parse(readFileSync("data/refiningEffectOptions.json"));
  const newData = {};

  for (const tier in fileData) {
    const tierDataMap = fileData[tier];
    for (const grade in tierDataMap) {
      const gradeDataMap = tierDataMap[grade];

      for (const refiningEffect in gradeDataMap) {
        if (!newData[refiningEffect]) newData[refiningEffect] = {};
        if (!newData[refiningEffect][tier]) newData[refiningEffect][tier] = {};
        newData[refiningEffect][tier][grade] = gradeDataMap[refiningEffect];
      }
    }
  }

  console.log(newData);
  writeFileSync("data/refiningEffectOptions2.json", JSON.stringify(newData));
};

const getRefiningEffectEtcValue = () => {
  const fileData = JSON.parse(readFileSync("data/auctionOptions.json"));

  const refiningOptions = fileData.EtcOptions.find(
    (obj) => obj.Value && obj.Value === 7
  );

  const refiningOptionsValueMap = refiningOptions.EtcSubs.reduce(
    (prev, cur) => ({ ...prev, [cur.Text]: cur.Value }),
    {}
  );

  console.log(refiningOptionsValueMap);
};

const getAuctionEngraveNames = () => {
  const fileData = JSON.parse(readFileSync("data/auctionOptions.json"));

  const engraveOptions = fileData.EtcOptions.find(
    (obj) => obj.Value && obj.Value === 3
  );

  const engraveTextNames = engraveOptions.EtcSubs.map((option) => option.Text);

  console.log(engraveTextNames);
};

getAuctionEngraveNames();
