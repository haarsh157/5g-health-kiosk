const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs').promises;

// Explicitly import the crypto module
let crypto;
try {
  crypto = require('crypto');
  console.log('Crypto module loaded successfully');
} catch (err) {
  console.error('Failed to load crypto module:', err);
  console.error('The crypto module is required for WhatsApp authentication. Please ensure you are using a supported Node.js version.');
  process.exit(1);
}

// Log Node.js version for debugging
console.log('Node.js version:', process.version);

// Helper function to ensure crypto is available
function ensureCryptoAvailable() {
  if (!crypto) {
    console.error('Crypto module is not available. Cannot proceed with WhatsApp authentication.');
    process.exit(1);
  }
  if (!global.crypto) {
    global.crypto = crypto;
    console.log('Crypto module injected into global scope as a workaround');
  }
}

async function connectToWhatsApp() {
  // Ensure crypto is available
  ensureCryptoAvailable();

  const authDir = './auth_info';
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  let isConnected = false;
  let isIntentionallyClosed = false;

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('Scan the QR code below with WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('Connected to WhatsApp');
      isConnected = true;
    }

    if (connection === 'close') {
      isConnected = false;
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log(`Disconnected: ${DisconnectReason[reason] || reason}`);

      if (isIntentionallyClosed) {
        console.log('Connection closed intentionally. Not reconnecting.');
        return;
      }

      if (reason === DisconnectReason.loggedOut) {
        await fs.rm(authDir, { recursive: true, force: true }).catch(() => {});
        console.log('Session cleared, restarting...');
        connectToWhatsApp();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log('Restart required. Restarting connection...');
        connectToWhatsApp();
      } else {
        console.log('Connection closed unexpectedly. Reconnecting...');
        connectToWhatsApp();
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('error', (err) => {
    console.error('Socket error:', err);
    if (!isIntentionallyClosed) {
      console.log('Reconnecting due to socket error...');
      setTimeout(connectToWhatsApp, 5000);
    }
  });

  // Wait for the connection to be established
  while (!isConnected) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Add a method to mark the connection as intentionally closed
  sock.markAsIntentionallyClosed = () => {
    isIntentionallyClosed = true;
  };

  return sock;
}

module.exports = { connectToWhatsApp };

// const qrcode = require('qrcode-terminal');
// const fs = require('fs').promises;
// const path = require('path');
// const { generateHealthReport } = require('./create_pdf.js');

// async function connectToWhatsApp() {
//   const authDir = './auth_info';
//   const { state, saveCreds } = await useMultiFileAuthState(authDir);

//   const sock = makeWASocket({
//     auth: state,
//     printQRInTerminal: false
//   });

//   sock.ev.on('connection.update', async (update) => {
//     const { connection, lastDisconnect, qr } = update;

//     if (qr) {
//       console.log('Scan the QR code below with WhatsApp:');
//       qrcode.generate(qr, { small: true });
//     }

//     if (connection === 'open') {
//       console.log('Connected to WhatsApp');

//       const number = '917083505744';
//       const jid = `${number}@s.whatsapp.net`;

//       // Send a test text message
//       await sock.sendMessage(jid, { text: 'Hello from Baileys!' })
//         .then(() => console.log('Test message sent'))
//         .catch((err) => console.error('Error sending message:', err));

//       // Generate and send the health report PDF
//       const checkupData = {
//         weight: 70,
//         height: 175,
//         oximeter: 98,
//         bloodPressureSys: 120,
//         bloodPressureDia: 80,
//         temperature: 36.6,
//         doctorName: 'John Smith',
//         notes: 'Patient should follow a low-sodium diet and schedule a follow-up in 2 weeks.'
//       };

//       const pdfPath = path.join(__dirname, 'health_checkup_report.pdf');
//       try {
//         await generateHealthReport(checkupData, pdfPath);
        
//         const pdfBuffer = await fs.readFile(pdfPath);
        
//         await sock.sendMessage(jid, {
//           document: pdfBuffer,
//           mimetype: 'application/pdf',
//           fileName: 'Health_Checkup_Report.pdf'
//         })
//           .then(() => console.log('Health report PDF sent successfully'))
//           .catch((err) => console.error('Error sending health report PDF:', err));

//         await fs.unlink(pdfPath).catch((err) => console.error('Error deleting PDF:', err));
//       } catch (err) {
//         console.error('Error generating or sending health report PDF:', err);
//       }

//       // Send the existing PDF (payadvancedcn.pdf)
//       const existingPdfPath = path.join(__dirname, 'payadvancedcn.pdf');
//       try {
//         await fs.access(existingPdfPath);
//         const pdfBuffer = await fs.readFile(existingPdfPath);
        
//         await sock.sendMessage(jid, {
//           document: pdfBuffer,
//           mimetype: 'application/pdf',
//           fileName: 'sample.pdf'
//         })
//           .then(() => console.log('Existing PDF sent successfully'))
//           .catch((err) => console.error('Error sending existing PDF:', err));
//       } catch (err) {
//         console.error('Existing PDF file not found or inaccessible:', err);
//       }
//     }

//     if (connection === 'close') {
//       const reason = lastDisconnect?.error?.output?.statusCode;
//       console.log(`Disconnected: ${DisconnectReason[reason] || reason}`);

//       if (reason === DisconnectReason.loggedOut) {
//         await fs.rm(authDir, { recursive: true, force: true }).catch(() => {});
//         console.log('Session cleared, restarting...');
//         connectToWhatsApp();
//       } else {
//         console.log('Reconnecting...');
//         connectToWhatsApp();
//       }
//     }
//   });

//   sock.ev.on('creds.update', saveCreds);

//   sock.ev.on('messages.upsert', async ({ messages }) => {
//     const msg = messages[0];
//     if (!msg.message) return;

//     const sender = msg.key.remoteJid;
//     const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
//     console.log(`New message from ${sender}: ${text}`);

//     if (text.toLowerCase() === 'hi') {
//       await sock.sendMessage(sender, { text: 'Hello! How can I help you?' })
//         .then(() => console.log('Auto-reply sent'))
//         .catch((err) => console.error('Error sending auto-reply:', err));
//     }
//   });

//   sock.ev.on('error', (err) => {
//     console.error('Socket error:', err);
//     setTimeout(connectToWhatsApp, 5000);
//   });
// }

// connectToWhatsApp().catch((err) => console.error('Startup error:', err));
// const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
// const qrcode = require('qrcode-terminal');
// const fs = require('fs').promises;
// const path = require('path');

// async function connectToWhatsApp() {
//   // Set up authentication state
//   const authDir = './auth_info';
//   const { state, saveCreds } = await useMultiFileAuthState(authDir);

//   // Create WhatsApp socket
//   const sock = makeWASocket({
//     auth: state,
//     printQRInTerminal: false // We'll handle QR manually
//   });

//   // Handle connection updates
//   sock.ev.on('connection.update', async (update) => {
//     const { connection, lastDisconnect, qr } = update;

//     if (qr) {
//       console.log('Scan the QR code below with WhatsApp:');
//       qrcode.generate(qr, { small: true });
//     }

//     if (connection === 'open') {
//       console.log('Connected to WhatsApp');

//       // Recipient details
//       const number = '917083505744'; // Recipient's number
//       const jid = `${number}@s.whatsapp.net`;

//       // Send a test text message
//       await sock.sendMessage(jid, { text: 'Hello from Baileys!' })
//         .then(() => console.log('Test message sent'))
//         .catch((err) => console.error('Error sending message:', err));

//       // Send a PDF file
//       const pdfPath = path.join(__dirname, 'payadvancedcn.pdf'); // Path to your PDF
//       try {
//         // Check if PDF exists
//         await fs.access(pdfPath);
//         const pdfBuffer = await fs.readFile(pdfPath);
        
//         await sock.sendMessage(jid, {
//           document: pdfBuffer,
//           mimetype: 'application/pdf',
//           fileName: 'sample.pdf' // Name displayed to recipient
//         })
//           .then(() => console.log('PDF sent successfully'))
//           .catch((err) => console.error('Error sending PDF:', err));
//       } catch (err) {
//         console.error('PDF file not found or inaccessible:', err);
//       }
//     }

//     if (connection === 'close') {
//       const reason = lastDisconnect?.error?.output?.statusCode;
//       console.log(`Disconnected: ${DisconnectReason[reason] || reason}`);

//       if (reason === DisconnectReason.loggedOut) {
//         // Clear auth folder if logged out
//         await fs.rm(authDir, { recursive: true, force: true }).catch(() => {});
//         console.log('Session cleared, restarting...');
//         connectToWhatsApp();
//       } else {
//         // Reconnect on other disconnects
//         console.log('Reconnecting...');
//         connectToWhatsApp();
//       }
//     }
//   });

//   // Save credentials when updated
//   sock.ev.on('creds.update', saveCreds);

//   // Handle incoming messages
//   sock.ev.on('messages.upsert', async ({ messages }) => {
//     const msg = messages[0];
//     if (!msg.message) return; // Ignore non-message events

//     const sender = msg.key.remoteJid;
//     const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
//     console.log(`New message from ${sender}: ${text}`);

//     // Auto-reply for 'hi'
//     if (text.toLowerCase() === 'hi') {
//       await sock.sendMessage(sender, { text: 'Hello! How can I help you?' })
//         .then(() => console.log('Auto-reply sent'))
//         .catch((err) => console.error('Error sending auto-reply:', err));
//     }
//   });

//   // Handle socket errors
//   sock.ev.on('error', (err) => {
//     console.error('Socket error:', err);
//     // Retry after delay
//     setTimeout(connectToWhatsApp, 5000);
//   });
// }

// // Run the connection
// connectToWhatsApp().catch((err) => console.error('Startup error:', err));
// const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
// const qrcode = require('qrcode-terminal');
// const fs = require('fs').promises;
// const path = require('path');

// async function connectToWhatsApp() {
//   // Set up authentication state
//   const authDir = './auth_info';
//   const { state, saveCreds } = await useMultiFileAuthState(authDir);

//   // Create WhatsApp socket
//   const sock = makeWASocket({
//     auth: state,
//     printQRInTerminal: false // We'll handle QR manually
//   });

//   // Handle QR code
//   sock.ev.on('connection.update', async (update) => {
//     const { connection, lastDisconnect, qr } = update;

//     if (qr) {
//       console.log('Scan the QR code below with WhatsApp:');
//       qrcode.generate(qr, { small: true });
//     }

//     if (connection === 'open') {
//       console.log('Connected to WhatsApp');

//       // Send a test message
//       const number = '918956052157'; // Replace with recipient's number (e.g., +12345678901)
//       const jid = `${number}@s.whatsapp.net`;
//       await sock.sendMessage(jid, { text: 'Hello from Baileys!' })
//         .then(() => console.log('Test message sent'))
//         .catch((err) => console.error('Error sending message:', err));
//     }

//     if (connection === 'close') {
//       const reason = lastDisconnect?.error?.output?.statusCode;
//       console.log(`Disconnected: ${DisconnectReason[reason] || reason}`);

//       if (reason === DisconnectReason.loggedOut) {
//         // Clear auth folder if logged out
//         await fs.rm(authDir, { recursive: true, force: true }).catch(() => {});
//         console.log('Session cleared, restarting...');
//         connectToWhatsApp();
//       } else {
//         // Reconnect on other disconnects
//         console.log('Reconnecting...');
//         connectToWhatsApp();
//       }
//     }
//   });

//   // Save credentials when updated
//   sock.ev.on('creds.update', saveCreds);

//   // Handle incoming messages
//   sock.ev.on('messages.upsert', async ({ messages }) => {
//     const msg = messages[0];
//     if (!msg.message) return; // Ignore non-message events

//     const sender = msg.key.remoteJid;
//     const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
//     console.log(`New message from ${sender}: ${text}`);

//     // Example: Auto-reply
//     if (text.toLowerCase() === 'hi') {
//       await sock.sendMessage(sender, { text: 'Hello! How can I help you?' })
//         .then(() => console.log('Auto-reply sent'))
//         .catch((err) => console.error('Error sending auto-reply:', err));
//     }
//   });

//   // Handle errors
//   sock.ev.on('error', (err) => {
//     console.error('Socket error:', err);
//     // Retry after delay
//     setTimeout(connectToWhatsApp, 5000);
//   });
// }

// // Run the connection
// connectToWhatsApp().catch((err) => console.error('Startup error:', err));