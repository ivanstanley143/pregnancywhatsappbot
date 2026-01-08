const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const path = require("path");
const qrcode = require("qrcode-terminal");

const logic = require("./logic");

// 🔴 FORCE FRESH LOGIN (new folder = new QR)
const AUTH_DIR = path.join(__dirname, "auth_info_baileys_V3");

let sock = null;

async function connectToWhatsApp() {
  if (sock) {
    console.log("♻️ Reusing existing WhatsApp socket");
    return sock;
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    browser: ["PregnancyBot", "Chrome", "1.0"]
  });

  // Save auth
  sock.ev.on("creds.update", saveCreds);

  // 🔥 CONNECTION + QR HANDLER (EXPLICIT)
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scan this QR code with WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ WhatsApp socket OPEN");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log("❌ WhatsApp connection closed:", code);

      sock = null;

      if (code !== DisconnectReason.loggedOut) {
        connectToWhatsApp();
      } else {
        console.log("⚠️ Logged out. QR required again.");
      }
    }
  });

  // 🔥 INCOMING MESSAGE HANDLER (FINAL & CORRECT)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    console.log("🔥 messages.upsert FIRED");

    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;

        const from = msg.key.remoteJid;

        // Skip groups & status
        if (from === "status@broadcast" || from.includes("@g.us")) continue;

        const rawText =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          "";

        if (!rawText) continue;

        const text = rawText.toLowerCase().trim();
        console.log("📨 FROM:", from, "TEXT:", text);

        const result = await logic(text);
        if (!result) continue;

        if (typeof result === "string") {
          await sock.sendMessage(from, { text: result });
        } else if (result.type === "image") {
          await sock.sendMessage(from, {
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


