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
  command: 'itunes',
  aliases: ['song', 'music', 'track'],
  category: 'info',
  description: 'Get detailed information about a song from iTunes',
  usage: '.itunes <song name>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const text = args.join(' ').trim();

    if (!text) {
      await sock.sendMessage(chatId, {
        text: '*Please provide a song name.*\nExample: `.itunes Blinding Lights`',
        quoted: message
      });
      return;
    }
    try {
      const url = `https://api.popcat.xyz/itunes?q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) throw `API request failed with status ${res.status}`;
      const json = await res.json();
      const songInfo = `
🎵 *${json.name || 'N/A'}*
👤 *Artist:* ${json.artist || 'N/A'}
💿 *Album:* ${json.album || 'N/A'}
📅 *Release Date:* ${json.release_date || 'N/A'}
💰 *Price:* ${json.price || 'N/A'}
⏱️ *Length:* ${json.length || 'N/A'}
🎼 *Genre:* ${json.genre || 'N/A'}
🔗 *URL:* ${json.url || 'N/A'}
      `.trim();
      if (json.thumbnail) {
        await sock.sendMessage(chatId, {
          image: { url: json.thumbnail },
          caption: songInfo,
          quoted: message
        });
      } else {
        await sock.sendMessage(chatId, { text: songInfo, quoted: message });
      }
    } catch (error) {
      console.error('iTunes Command Error:', error);
      await sock.sendMessage(chatId, {
        text: '❌ An error occurred while fetching the song info. Please try again later.',
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
 