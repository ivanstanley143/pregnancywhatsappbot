const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const path = require("path");

const logic = require("./logic");

let sock = null;
let isConnected = false;

const AUTH_DIR = path.join(__dirname, "auth_info_baileys");

// 🔹 format phone → jid
const formatJID = (phone) => `${phone.replace(/\D/g, "")}@s.whatsapp.net`;

async function connectToWhatsApp() {
  if (sock) {
    console.log("♻️ Reusing existing socket");
    return sock;
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    browser: ["PregnancyBot", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp socket OPEN");
      isConnected = true;
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log("⚠️ Connection closed:", code);

      isConnected = false;
      sock = null;

      if (code !== DisconnectReason.loggedOut) {
        connectToWhatsApp();
      } else {
        console.log("❌ Logged out. Scan QR again.");
      }
    }
  });

  // 🔥 INCOMING MESSAGE HANDLER (FINAL FIX)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    console.log("🔥 messages.upsert FIRED");

    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;

        const from = msg.key.remoteJid;

        // ignore status & groups
        if (from === "status@broadcast" || from.includes("@g.us")) continue;

        const rawText =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          "";

        if (!rawText) continue;

        const text = rawText.toLowerCase().trim();

        console.log("📨 FROM:", from, "TEXT:", text);

        const result = await logic(text);
        if (!result) return;

        const phone = from.split("@")[0];

        if (typeof result === "string") {
          await sock.sendMessage(formatJID(phone), { text: result });
        } else if (result.type === "image") {
          await sock.sendMessage(formatJID(phone), {
            image: { url: result.image },
            caption: result.caption || ""
          });
        }
      } catch (err) {
        console.error("❌ Incoming message error:", err.message);
      }
    }
  });

  return sock;
}

module.exports = {
  connectToWhatsApp
};
