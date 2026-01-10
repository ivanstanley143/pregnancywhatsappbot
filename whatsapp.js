const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const readline = require("readline");

let sock;
let pairingInProgress = false;

function askPhoneNumber() {
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
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    // 🔐 START PAIRING ONLY WHEN SOCKET IS READY
    if (connection === "open" && !state.creds.registered && !pairingInProgress) {
      pairingInProgress = true;

      const number = await askPhoneNumber();
      const code = await sock.requestPairingCode(number);

      console.log("\n🔐 PAIRING CODE:", code);
      console.log("👉 WhatsApp → Linked Devices → Link a device → Enter code\n");
    }

    if (connection === "open" && state.creds.registered) {
      console.log("✅ WhatsApp connected");
    }

    if (connection === "close") {
      const status = lastDisconnect?.error?.output?.statusCode;

      if (status !== DisconnectReason.loggedOut) {
        console.log("⚠️ WhatsApp disconnected, reconnecting in 30s...");
        setTimeout(connectToWhatsApp, 30000);
      } else {
        console.log("❌ Logged out. Delete auth_info_baileys and re-pair");
      }
    }
  });

  return sock;
}

// 📩 SEND TEXT
async function sendTextMessage(number, text) {
  if (!sock) throw new Error("WhatsApp not connected");
  await sock.sendMessage(`${number}@s.whatsapp.net`, { text });
}

// 🖼️ SEND IMAGE
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
