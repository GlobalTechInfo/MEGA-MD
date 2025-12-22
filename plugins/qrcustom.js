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

const AXIOS_DEFAULTS = {
  timeout: 60000,
  responseType: 'arraybuffer'
};

module.exports = {
  command: 'customqr',
  aliases: ['makeqr', 'qrgen'],
  category: 'tools',
  description: 'Generate a custom QR code from text with optional size and color',
  usage: '.customqr <text> | <size> | <color>',
  
  async handler(sock, message, args) {
    const chatId = message.key.remoteJid;
    const rawInput = args.join(' ').split('|').map(s => s.trim());
    
    const text = rawInput[0];
    const size = rawInput[1] || '300×300';
    const color = rawInput[2] || '255-0-0';

    if (!text) {
      return await sock.sendMessage(
        chatId,
        {
          text:
`🎨 *Custom QR Generator*

📌 Usage:
.customqr <text> | <size> | <color>

✨ Example:
.customqr Qasim | 400×400 | 0-0-255

🧩 Generates a colorful QR image`
        },
        { quoted: message }
      );
    }

    try {
      const apiUrl =
        `https://discardapi.dpdns.org/api/maker/customqr` +
        `?apikey=guru&text=${encodeURIComponent(text)}` +
        `&size=${encodeURIComponent(size)}` +
        `&color=${encodeURIComponent(color)}`;

      await sock.sendMessage(chatId, {
        react: { text: '🧩', key: message.key }
      });

      const res = await axios.get(apiUrl, AXIOS_DEFAULTS);

      await sock.sendMessage(
        chatId,
        {
          image: Buffer.from(res.data),
          caption:
`✅ *QR Code Generated*

📝 Text: ${text}
📐 Size: ${size}
🎨 Color: ${color}

𝗕𝗬 𝗠𝗘𝗚𝗔 𝗔𝗜`
        },
        { quoted: message }
      );

    } catch (err) {
      console.error('Custom QR Error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to generate QR code.' }, { quoted: message });
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
 