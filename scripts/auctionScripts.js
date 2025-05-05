const { readFileSync, writeFileSync } = require("fs");

const getGrindingEffect = () => {
  const fileData = JSON.parse(readFileSync("data/auctionOptions.json"));
  const grindingEffectOptions = fileData.EtcOptions.find(
    (option) => option.Value === 7
  );
  console.log(
    grindingEffectOptions.EtcSubs.map((option) => [
      option.Text,
      option.EtcValues.length,
    ])
  );
};

const getGrindingEffectTextByCategory = () => {
  const fileData = JSON.parse(readFileSync("data/auctionOptions.json"));
  const CATEGORY_CODE_MAP = {
    200010: "목걸이",
    200020: "귀걸이",
    200030: "반지",
  };

  const GrindingOptions = fileData.EtcOptions.find(
    (obj) => obj.Value && obj.Value === 7
  );

  const OrganizedGrindingOptions = GrindingOptions.EtcSubs.reduce(
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

  console.log(OrganizedGrindingOptions);
};

const refactorGrindingEffectOptions = () => {
  const fileData = JSON.parse(readFileSync("data/grindingEffectOptions.json"));
  const newData = {};

  for (const tier in fileData) {
    const tierDataMap = fileData[tier];
    for (const grade in tierDataMap) {
      const gradeDataMap = tierDataMap[grade];

      for (const grindingEffect in gradeDataMap) {
        if (!newData[grindingEffect]) newData[grindingEffect] = {};
        if (!newData[grindingEffect][tier]) newData[grindingEffect][tier] = {};
        newData[grindingEffect][tier][grade] = gradeDataMap[grindingEffect];
      }
    }
  }

  console.log(newData);
  writeFileSync("data/grindingEffectOptions2.json", JSON.stringify(newData));
};

const getGrindingEffectEtcValue = () => {
  const fileData = JSON.parse(readFileSync("data/auctionOptions.json"));

  const grindingOptions = fileData.EtcOptions.find(
    (obj) => obj.Value && obj.Value === 7
  );

  const grindingOptionsValueMap = grindingOptions.EtcSubs.reduce(
    (prev, cur) => ({ ...prev, [cur.Text]: cur.Value }),
    {}
  );

  console.log(grindingOptionsValueMap);
};

getGrindingEffectEtcValue();
