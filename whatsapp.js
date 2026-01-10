const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const readline = require("readline");

let sock;
let isConnecting = false;
let pairingDone = false; // ⭐ IMPORTANT

async function askPhoneNumber() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      "📱 Enter WhatsApp number with country code (eg 9190xxxxxxx): ",
      (number) => {
        rl.close();
        resolve(number.trim());
      }
    );
  });
}

async function connectToWhatsApp() {
  if (isConnecting) return sock;
  isConnecting = true;

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log("⚠️ WhatsApp disconnected, reconnecting...");
        setTimeout(() => {
          isConnecting = false;
          connectToWhatsApp();
        }, 30000);
      } else {
        console.log("❌ Logged out. Delete auth_info_baileys and re-pair");
      }
    }
  });

  // 🔐 ASK PAIRING CODE ONCE ONLY
  if (!state.creds.registered && !pairingDone) {
    pairingDone = true;

    const number = await askPhoneNumber();
    const code = await sock.requestPairingCode(number);

    console.log("\n🔐 PAIRING CODE:", code);
    console.log("👉 WhatsApp → Linked Devices → Link a device → Enter code\n");
  }

  isConnecting = false;
  return sock;
}

// ✅ SEND TEXT
async function sendTextMessage(number, text) {
  if (!sock) throw new Error("WhatsApp not connected");
  await sock.sendMessage(`${number}@s.whatsapp.net`, { text });
}

// ✅ SEND IMAGE
async function sendImageMessage(number, imageUrl, caption) {
  if (!sock) throw new Error("WhatsApp not connected");
  await sock.sendMessage(`${number}@s.whatsapp.net`, {
    image: { url: imageUrl },
    caption
  });
}

module.exports = {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage
};
