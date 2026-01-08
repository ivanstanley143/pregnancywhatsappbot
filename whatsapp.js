const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const axios = require('axios');

let sock = null;
let isConnected = false;

// Helper to format phone number to JID
const formatJID = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return `${cleaned}@s.whatsapp.net`;
};

// Helper to download image from URL
const downloadImage = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error downloading image:', error.message);
    return null;
  }
};

const connectToWhatsApp = async () => {
  try {
    // ✅ IMPORTANT: reuse socket if exists
    if (sock) {
      console.log('♻️ Reusing existing WhatsApp socket');
      return sock;
    }

    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      auth: state,
      browser: ['Pregnancy Bot', 'Chrome', '1.0.0'],
      getMessage: async () => ({ conversation: 'Message not found' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n📱 Scan this QR code with WhatsApp:');
        require('qrcode-terminal').generate(qr, { small: true });
      }

      if (connection === 'open') {
        console.log('✅ Connected to WhatsApp!');
        isConnected = true;
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        console.log('⚠️ Connection closed:', code);

        isConnected = false;
        sock = null; // ✅ CRITICAL FIX

        if (code !== DisconnectReason.loggedOut) {
          connectToWhatsApp();
        } else {
          console.log('❌ Logged out. Scan QR again.');
        }
      }
    });

    return sock;
  } catch (error) {
    console.error('Error connecting to WhatsApp:', error);
    throw error;
  }
};

const sendTextMessage = async (phoneNumber, text) => {
  if (!sock || !isConnected) {
    throw new Error('WhatsApp not connected');
  }
  const jid = formatJID(phoneNumber);
  await sock.sendMessage(jid, { text });
};

const sendImageMessage = async (phoneNumber, imageUrl, caption) => {
  if (!sock || !isConnected) {
    throw new Error('WhatsApp not connected');
  }

  const imageBuffer = await downloadImage(imageUrl);
  if (!imageBuffer) {
    throw new Error('Failed to download image');
  }

  const jid = formatJID(phoneNumber);
  await sock.sendMessage(jid, {
    image: imageBuffer,
    caption: caption || ''
  });
};

const getSocket = () => sock;
const getConnectionStatus = () => isConnected;

module.exports = {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage,
  getSocket,
  getConnectionStatus,
  formatJID
};
