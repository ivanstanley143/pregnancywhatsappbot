require("dotenv").config();
const express = require("express");
const { connectToWhatsApp, sendTextMessage, sendImageMessage, getSocket } = require("./whatsapp");
const logic = require("./logic");
const scheduler = require("./scheduler");

const app = express();
app.use(express.json());

// Health check endpoint for Koyeb
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "pregnancywhatsappbot" });
});

// Connect to WhatsApp
connectToWhatsApp().then(() => {
  console.log("🤖 Starting pregnancy WhatsApp bot...");
  
  const sock = getSocket();
  
  // Handle incoming messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      try {
        // Skip if message is from status or group
        if (msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid.includes('@g.us')) {
          continue;
        }

        // Only process text messages
        if (msg.message?.conversation || msg.message?.extendedTextMessage?.text) {
          const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
          const from = msg.key.remoteJid;

          console.log(`📨 Received message from ${from}: ${text}`);

          const result = await logic(text);
          
          if (result) {
            try {
              if (typeof result === "string") {
                // from is already a JID, extract phone number
                const phoneNumber = from.split('@')[0];
                await sendTextMessage(phoneNumber, result);
              } else if (result.type === "image") {
                const phoneNumber = from.split('@')[0];
                await sendImageMessage(phoneNumber, result.image, result.caption);
              }
            } catch (error) {
              console.error("Error sending reply:", error.message);
            }
          }
        }
      } catch (error) {
        console.error("Error processing message:", error.message);
      }
    }
  });

  // Start scheduler after connection is established
  scheduler();
}).catch((error) => {
  console.error("Failed to start bot:", error);
  process.exit(1);
});

// Start HTTP server for Koyeb health checks
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 HTTP server listening on port ${PORT}`);
});
