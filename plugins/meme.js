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
 

const fetch = require('node-fetch');

module.exports = {
  command: 'meme',
  aliases: ['cheems', 'memes'],
  category: 'fun',
  description: 'Get a random cheems meme with buttons for another meme or joke',
  usage: '.meme',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    try {
      const res = await fetch('https://shizoapi.onrender.com/api/memes/cheems?apikey=shizo');

      if (!res.ok) throw `API request failed with status ${res.status}`;

      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('image')) {
        const imageBuffer = await res.buffer();

        const buttons = [
          { buttonId: '.meme', buttonText: { displayText: '🎭 Another Meme' }, type: 1 },
          { buttonId: '.joke', buttonText: { displayText: '😄 Joke' }, type: 1 }
        ];

        await sock.sendMessage(chatId, {
          image: imageBuffer,
          caption: "🐕 > Here's your cheems meme!",
          buttons: buttons,
          headerType: 1
        }, { quoted: message });

      } else {
        await sock.sendMessage(chatId, {
          text: '❌ The API did not return a valid image.',
          quoted: message
        });
      }

    } catch (error) {
      console.error('Meme Command Error:', error);
      await sock.sendMessage(chatId, {
        text: '❌ Failed to fetch meme. Please try again later.',
        quoted: message
      });
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
 
