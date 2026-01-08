const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const axios = require('axios');

let sock = null;
let isConnected = false;

// Helper to format phone number to JID
const formatJID = (phoneNumber) => {
  // Remove any non-digit characters
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
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      auth: state,
      browser: ['Pregnancy Bot', 'Chrome', '1.0.0'],
      getMessage: async (key) => {
        return {
          conversation: 'Message not found'
        };
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n📱 Scan this QR code with WhatsApp:');
        require('qrcode-terminal').generate(qr, { small: true });
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect) {
          console.log('🔄 Connection closed. Reconnecting...');
          connectToWhatsApp();
        } else {
          console.log('❌ Connection closed. Please scan QR code again.');
          isConnected = false;
        }
      } else if (connection === 'open') {
        console.log('✅ Connected to WhatsApp!');
        isConnected = true;
      }
    });

    return sock;
  } catch (error) {
    console.error('Error connecting to WhatsApp:', error);
    throw error;
  }
};

const sendTextMessage = async (phoneNumber, text) => {
  try {
    if (!sock || !isConnected) {
      throw new Error('WhatsApp not connected');
    }

    const jid = formatJID(phoneNumber);
    await sock.sendMessage(jid, { text });
    return true;
  } catch (error) {
    console.error('Error sending text message:', error.message);
    return false;
  }
};

const sendImageMessage = async (phoneNumber, imageUrl, caption) => {
  try {
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
    return true;
  } catch (error) {
    console.error('Error sending image message:', error.message);
    return false;
  }
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
