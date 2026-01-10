const data = require("../data");
const utils = require("../utils");

function handleFoodCommand(text) {
  const msg = text.toLowerCase();

  if (msg === "safe") return utils.format(data.SAFE_FOODS.join("\n"));
  if (msg === "avoid") return utils.format(data.AVOID_FOODS.join("\n"));
  if (msg === "limit") return utils.format(data.LIMIT_FOODS.join("\n"));

  for (const f in data.FOOD_DB) {
    if (msg.includes(f)) return utils.format(data.FOOD_DB[f]);
  }
  return null;
}

module.exports = { handleFoodCommand };
