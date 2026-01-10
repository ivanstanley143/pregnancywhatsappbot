const data = require("../data");
const utils = require("../utils");

function handleFoodCommand(text) {
  const msg = text.toLowerCase().replace(/\s/g, "");

  // 🍎 SINGLE FOOD CHECK
  const food = data.FOOD_DB[msg];
  if (food) {
    const statusIcon =
      food.status === "SAFE"
        ? "🟢 SAFE"
        : food.status === "LIMIT"
        ? "🟡 LIMIT"
        : "🔴 AVOID";

    return utils.format(
      `${food.label}

${statusIcon}
${food.details}`,
      `${food.label}

${statusIcon}
ഗർഭകാലത്ത് ശ്രദ്ധിക്കുക`
    );
  }

  // 🟢 SAFE LIST
  if (msg === "safe") {
    return utils.format(
      "🥗 Pregnancy Safe Foods\n\n" +
        Object.values(data.FOOD_DB)
          .filter(f => f.status === "SAFE")
          .map(f => f.label)
          .join("\n")
    );
  }

  // 🔴 AVOID LIST
  if (msg === "avoid") {
    return utils.format(
      "🚫 Foods to Avoid During Pregnancy\n\n" +
        Object.values(data.FOOD_DB)
          .filter(f => f.status === "AVOID")
          .map(f => f.label)
          .join("\n")
    );
  }

  // 🟡 LIMIT LIST
  if (msg === "limit") {
    return utils.format(
      "⚠️ Foods to Limit During Pregnancy\n\n" +
        Object.values(data.FOOD_DB)
          .filter(f => f.status === "LIMIT")
          .map(f => f.label)
          .join("\n")
    );
  }

  return null;
}

module.exports = { handleFoodCommand };
