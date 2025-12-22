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
  command: 'thrstalk',
  aliases: ['threadsprofile', 'threadsuser'],
  category: 'stalk',
  description: 'Lookup Threads user profile',
  usage: '.thrstalk <username>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    if (!args.length) {
      return await sock.sendMessage(chatId, {
        text: '*Please provide a Threads username.*\nExample: .thrstalk google'
      }, { quoted: message });
    }

    const username = args[0];

    try {
      const apiUrl = `https://discardapi.onrender.com/api/stalk/threads?apikey=guru&url=${username}`;
      const { data } = await axios.get(apiUrl, { 
        timeout: 45000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!data?.result) {
        return await sock.sendMessage(chatId, { text: '❌ Threads user not found.' }, { quoted: message });
      }

      const result = data.result;
      const profileImage = result.hd_profile_picture || result.profile_picture || null;
      const verifiedMark = result.is_verified ? '✅ Verified' : '';

      const caption = `🧵 *Threads Profile Info*\n\n` +
                      `👤 Name: ${result.name || 'N/A'} ${verifiedMark}\n` +
                      `🆔 Username: ${result.username || 'N/A'}\n` +
                      `📎 Links: ${result.links?.length ? result.links.join('\n') : 'N/A'}\n` +
                      `👥 Followers: ${result.followers || 0}\n` +
                      `📝 Bio: ${result.bio || 'N/A'}\n` +
                      `🔗 Profile URL: https://threads.net/@${result.username || username}`;

      if (profileImage) {
        await sock.sendMessage(chatId, { image: { url: profileImage }, caption: caption }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: caption }, { quoted: message });
      }

    } catch (err) {
      console.error('Threads plugin error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch Threads profile.' }, { quoted: message });
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
 
