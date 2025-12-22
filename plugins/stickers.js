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
  command: 'stickers',
  aliases: ['stickersearch', 'ssticker'],
  category: 'stickers',
  description: 'Search for stickers using Tenor',
  usage: '.stickers <search term>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const text = args?.join(' ')?.trim();

    if (!text) {
      return await sock.sendMessage(chatId, { text: '*Provide a search term.*\nExample: .stickers funny' }, { quoted: message });
    }

    try {
      await sock.sendMessage(chatId, { text: 'Searching for stickers...' }, { quoted: message });

      const { data } = await axios.get(`https://g.tenor.com/v1/search?q=${encodeURIComponent(text)}&key=LIVDSRZULELA&limit=8`);
      if (!data?.results?.length) {
        return await sock.sendMessage(chatId, { text: '❌ No stickers found.' }, { quoted: message });
      }
      const limit = Math.min(data.results.length, 5);
      for (let i = 0; i < limit; i++) {
        const media = data.results[i].media?.[0]?.mp4?.url;
        if (!media) continue;
        await sock.sendMessage(chatId, { video: { url: media }, caption: `Sticker ${i + 1}`, mimetype: 'video/mp4' }, { quoted: message });
      }
    } catch (error) {
      console.error('StickerSearch plugin error:', error);
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch stickers.' }, { quoted: message });
    }}
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
 
