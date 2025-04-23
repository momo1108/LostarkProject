const { readFileSync } = require("fs");

const getGrindingEffect = async () => {
  const result = JSON.parse(readFileSync("data/auctionOptions.json"));
  const grindingEffectOptions = result.EtcOptions.find(
    (option) => option.Value === 7
  );
  console.log(
    grindingEffectOptions.EtcSubs.map((option) => [
      option.Text,
      option.EtcValues.length,
    ])
  );
};

getGrindingEffect();
