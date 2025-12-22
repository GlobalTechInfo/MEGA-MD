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
  command: 'hmod',
  aliases: ['hmods', 'happymod'],
  category: 'apks',
  description: 'Search APKs from HappyMod',
  usage: '.hmod <query>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    if (!args.length) {
      return await sock.sendMessage(chatId, {
        text: '*Please provide a search query.*\nExample: .happymod telegram'
      }, { quoted: message });
    }
    const query = args.join(' ');
    try {
      const { data } = await axios.get(`https://discardapi.dpdns.org/api/apk/search/happymod`, {
        params: {
          apikey: 'guru',
          query: query
        }
      });
      if (!data?.result?.length) {
        return await sock.sendMessage(chatId, { text: '❌ No results found.' }, { quoted: message });
      }
      let menuText = '';
      data.result.forEach((item, i) => {
        menuText += `*${i + 1}.* ${item.title}\n⭐ Rating: ${item.rating}\n🔗 Link: ${item.link}\n\n`;
      });
      const firstThumb = data.result[0].thumb || null;

      if (firstThumb) {
        await sock.sendMessage(chatId, {
          image: { url: firstThumb },
          caption: menuText
        }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
      }

    } catch (err) {
      console.error('HappyMod plugin error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch APKs.' }, { quoted: message });
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
 
