require("dotenv").config();
const express = require("express");
const {
  connectToWhatsApp,
  getSocket,
  sendTextMessage,
  sendImageMessage
} = require("./whatsapp");

const logic = require("./logic");
const scheduler = require("./scheduler");

const app = express();
app.use(express.json());

// 🌐 Health check for Koyeb
app.get("/", (req, res) => {
  res.json({ status: "ok", bot: "pregnancywhatsappbot" });
});

// 🚀 START BOT
connectToWhatsApp()
  .then(() => {
    console.log("🤖 Pregnancy WhatsApp Bot starting...");

    const sock = getSocket();

    if (!sock) {
      console.error("❌ SOCKET IS NULL IN app.js");
      return;
    }

    console.log("✅ SOCKET RECEIVED IN app.js");

    // 🔥 INCOMING MESSAGE HANDLER
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      console.log("🔥 messages.upsert TRIGGERED");

      if (type !== "notify") return;

      for (const msg of messages) {
        try {
          if (!msg.message || msg.key.fromMe) continue;

          const from = msg.key.remoteJid;

          // Skip groups & status
          if (
            from === "status@broadcast" ||
            from.includes("@g.us")
          ) {
            continue;
          }

          const rawText =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

          if (!rawText) continue;

          const text = rawText.toLowerCase().trim();

          console.log(`📨 Message from ${from}:`, rawText, "→", text);

          const result = await logic(text);
          if (!result) continue;

          const phone = from.split("@")[0];

          if (typeof result === "string") {
            await sendTextMessage(phone, result);
          } else if (result.type === "image") {
            await sendImageMessage(
              phone,
              result.image,
              result.caption || ""
            );
          }
        } catch (err) {
          console.error("❌ Message error:", err.message);
        }
      }
    });

    // ⏰ Start scheduler
    scheduler();
  })
  .catch((err) => {
    console.error("❌ Bot failed to start:", err);
    process.exit(1);
  });

// 🌐 HTTP server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});
