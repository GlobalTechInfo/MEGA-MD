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
const { channelInfo } = require('../lib/messageConfig');

module.exports = {
  command: 'wiki',
  aliases: ['wikipedia'],
  category: 'search',
  description: 'Search Wikipedia for a topic!',
  usage: '.wiki <query>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args.join(' ').trim();

    if (!query) {
      return await sock.sendMessage(chatId, {
        text: "*Enter what you want to search for on Wikipedia.*\nExample: .wiki Pakistan",
        ...channelInfo
      }, { quoted: message });
    }

    const formattedQuery = query.replace(/ /g, "_");

    try {
      const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedQuery)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MEGA-BOT/1.0',
          'Accept-Language': 'en'
        }
      });

      const data = res.data;

      if (data.extract) {
        await sock.sendMessage(chatId, {
          text: `▢ *Wikipedia*\n\n‣ Search: ${data.title}\n\n${data.extract}\n\nRead more: ${data.content_urls.desktop.page}`,
          ...channelInfo
        }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, {
          text: "⚠️ No results found.",
          ...channelInfo
        }, { quoted: message });
      }
    } catch (e) {
      console.error('Wikipedia plugin error:', e.message || e);
      await sock.sendMessage(chatId, {
        text: "⚠️ No results found or Wikipedia blocked the request.",
        ...channelInfo
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
 

