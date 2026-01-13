require("dotenv").config();
const express = require("express");
const logic = require("./logic");
const data = require("./data");
const { sendTemplate } = require("./whatsappCloud");

const app = express();
app.use(express.json());

// Webhook verify
app.get("/webhook",(req,res)=>{
  if(req.query["hub.verify_token"]===process.env.VERIFY_TOKEN){
    return res.send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// Receive messages
app.post("/webhook", async (req,res)=>{
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if(!msg?.text) return res.sendStatus(200);

  const reply = await logic(msg.text.body);
  if(reply){
    await sendTemplate(msg.from,"pregnancy_text",[reply]);
  }
  res.sendStatus(200);
});

// ⏰ Timed reminders
setInterval(()=>{
  const now = new Date().toLocaleTimeString("en-GB",{timeZone:data.TIMEZONE,hour:"2-digit",minute:"2-digit"});

  if(data.WATER_TIMES.includes(now)){
    sendTemplate(data.USER,"pregnancy_water_reminder");
  }

  if(data.MEALS[now]){
    sendTemplate(data.USER,"pregnancy_meal_reminder",data.MEALS[now]);
  }

},60000);

app.listen(3000,()=>console.log("Bot running"));
