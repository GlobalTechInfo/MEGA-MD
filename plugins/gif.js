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
const settings = require('../settings');

module.exports = {
  command: 'gif',
  aliases: ['giphy', 'searchgif'],
  category: 'stickers',
  description: 'Get a GIF based on a search term',
  usage: '.gif <search term>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args.join(' ');
    if (!query) {
      await sock.sendMessage(chatId, { text: 'Please provide a search term for the GIF.' }, { quoted: message });
      return;
    }
    try {
      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: settings.giphyApiKey,
          q: query,
          limit: 1,
          rating: 'g'
        }
      });
      const gifData = response.data.data[0];
      if (!gifData) {
        await sock.sendMessage(chatId, { text: 'No GIFs found for your search term.' }, { quoted: message });
        return;
      }
      const mp4Url = gifData.images.original_mp4?.mp4;
      if (mp4Url) {
        await sock.sendMessage(chatId, { video: { url: mp4Url }, caption: `Here is your GIF for "${query}"` }, { quoted: message });
      } else {
        const gifUrl = gifData.images.original?.url;
        await sock.sendMessage(chatId, { document: { url: gifUrl }, mimetype: 'image/gif', caption: `Here is your GIF for "${query}"` }, { quoted: message });
      }

    } catch (error) {
      console.error('Error in gif command:', error);
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch GIF. Please try again later.' }, { quoted: message });
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
 
