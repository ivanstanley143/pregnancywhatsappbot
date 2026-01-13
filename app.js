require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const logic = require("./logic");
const { sendTemplate } = require("./whatsappCloud");
const data = require("./data");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const reply = await logic(msg.text.body);
  if (!reply) return res.sendStatus(200);

  await sendTemplate(
    msg.from,
    "pregnancy_dua",
    [data.NAME, reply],
    data.TRIMESTER_IMAGES[1]
  );

  res.sendStatus(200);
});

(async()=>{
  await connectDB();
  app.listen(3000, ()=> console.log("Running"));
})();
