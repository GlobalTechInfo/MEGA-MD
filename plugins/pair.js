/*****************************************************************************
 *                                                                           *
 *                     Developed By Qasim Ali                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/GlobalTechInfo                         *
 *  ▶️  YouTube  : https://youtube.com/@GlobalTechInfo                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07     *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the MEGA-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
 


const axios = require('axios');

module.exports = {
  command: 'pair',
  aliases: ['paircode', 'session', 'getsession', 'sessionid'],
  category: 'general',
  description: 'Get session id for MEGA-MD',
  usage: '.pair 92305395XXXX',
  
  async handler(sock, message, args, context = {}) {
    const { chatId } = context;

    const forwardInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363319098372999@newsletter',
        newsletterName: 'MEGA MD',
        serverMessageId: -1
      }
    };

    let query = args.join('').trim();
    if (!query) {
      return await sock.sendMessage(chatId, {
        text: "❌ *Missing Number*\nExample: .pair 92305395XXXX",
        contextInfo: forwardInfo
      }, { quoted: message });
    }

    const number = query.replace(/[^0-9]/g, '');

    if (number.length < 10 || number.length > 15) {
      return await sock.sendMessage(chatId, {
        text: "❌ *Invalid Format*\nPlease provide the number with country code but without + or spaces.",
        contextInfo: forwardInfo
      }, { quoted: message });
    }

    await sock.sendMessage(chatId, {
      text: "⚡ *Requesting code from server...*",
      contextInfo: forwardInfo
    }, { quoted: message });

    try {
      const response = await axios.get(`https://mega-pairing.onrender.com/pair?number=${number}`, {
        timeout: 60000
      });

      if (response.data && response.data.code) {
        const pairingCode = response.data.code;

        if (pairingCode.includes("Unavailable") || pairingCode.includes("Error")) {
          throw new Error("Server is busy");
        }

        const successText = `✅ *MEGA-MD PAIRING CODE*\n\n` +
                            `Code: *${pairingCode}*\n\n` +
                            `*How to use:*\n` +
                            `1. Open WhatsApp Settings\n` +
                            `2. Tap 'Linked Devices'\n` +
                            `3. Tap 'Link a Device'\n` +
                            `4. Select 'Link with phone number instead'\n` +
                            `5. Enter the code above.`;

        await sock.sendMessage(chatId, {
          text: successText,
          contextInfo: forwardInfo
        }, { quoted: message });

      } else {
        throw new Error("Invalid response format");
      }

    } catch (error) {
      console.error('Pairing Plugin Error:', error.message);
      
      let errorMsg = "❌ *Pairing Failed*\nReason: ";
      if (error.code === 'ECONNABORTED') {
        errorMsg += "Server timeout. Please try again in 1 minute.";
      } else if (error.response?.status === 400) {
        errorMsg += "Invalid phone number format.";
      } else {
        errorMsg += "The server is currently offline or busy. Try again later.";
      }

      await sock.sendMessage(chatId, {
        text: errorMsg,
        contextInfo: forwardInfo
      }, { quoted: message });
    }
  }
};


/*****************************************************************************
 *                                                                           *
 *                     Developed By Qasim Ali                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/GlobalTechInfo                         *
 *  ▶️  YouTube  : https://youtube.com/@GlobalTechInfo                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07     *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the MEGA-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
 
