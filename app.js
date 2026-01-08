require("dotenv").config();
const express = require("express");
const {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage,
  getSocket
} = require("./whatsapp");
const logic = require("./logic");
const scheduler = require("./scheduler");

const app = express();
app.use(express.json());

// Health check endpoint for Koyeb
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "pregnancywhatsappbot" });
});

// Connect to WhatsApp
connectToWhatsApp()
  .then(() => {
    console.log("🤖 Starting pregnancy WhatsApp bot...");

    const sock = getSocket();

    // ✅ HANDLE INCOMING MESSAGES (FIXED)
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;

      for (const msg of messages) {
        try {
          if (!msg.message) continue;

          // Skip status & group messages
          const from = msg.key.remoteJid;
          if (
            from === "status@broadcast" ||
            from.includes("@g.us") ||
            msg.key.fromMe
          ) {
            continue;
          }

          // Extract text safely
          const rawText =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

          if (!rawText) continue;

          // ✅ NORMALIZE TEXT (THIS WAS MISSING)
          const text = rawText.toLowerCase().trim();

          console.log(`📨 Message from ${from}:`, rawText, "→", text);

          // Pass normalized text to logic
          const result = await logic(text);

          if (!result) continue;

          const phoneNumber = from.split("@")[0];

          // Send response
          if (typeof result === "string") {
            await sendTextMessage(phoneNumber, result);
          } else if (result.type === "image") {
            await sendImageMessage(
              phoneNumber,
              result.image,
              result.caption || ""
            );
          }
        } catch (error) {
          console.error("❌ Error processing message:", error.message);
        }
      }
    });

    // Start scheduler after WhatsApp connection
    scheduler();
  })
  .catch((error) => {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  });

// Start HTTP server for Koyeb
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});
