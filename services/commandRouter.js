const { handleFoodCommand } = require("./foodEngine");
const { handleAppointmentCommand } = require("./appointmentCommands");

async function routeCommand(text) {
  return handleFoodCommand(text) || await handleAppointmentCommand(text);
}

module.exports = { routeCommand };
