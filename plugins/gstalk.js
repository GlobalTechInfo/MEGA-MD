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
  command: 'github',
  aliases: ['ghprofile', 'gh'],
  category: 'stalk',
  description: 'Lookup GitHub user profile',
  usage: '.github <username>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    if (!args.length) {
      return await sock.sendMessage(chatId, {
        text: '*Please provide a GitHub username.*\nExample: .github GlobalTechInfo'
      }, { quoted: message });
    }

    const username = args[0];

    try {
      const apiUrl = `https://discardapi.onrender.com/api/stalk/github?apikey=guru&url=${username}`;
      const { data } = await axios.get(apiUrl, { 
        timeout: 45000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!data?.result) {
        return await sock.sendMessage(chatId, { text: '❌ GitHub user not found.' }, { quoted: message });
      }

      const result = data.result;

      const caption = `🐙 *GitHub Profile Info*\n\n` +
                      `👤 Name: ${result.nickname || 'N/A'}\n` +
                      `🆔 Username: ${result.username || 'N/A'}\n` +
                      `🏢 Company: ${result.company || 'N/A'}\n` +
                      `📍 Location: ${result.location || 'N/A'}\n` +
                      `💬 Bio: ${result.bio || 'N/A'}\n` +
                      `📦 Public Repos: ${result.public_repo || 0}\n` +
                      `📜 Public Gists: ${result.public_gists || 0}\n` +
                      `👥 Followers: ${result.followers || 0}\n` +
                      `➡ Following: ${result.following || 0}\n` +
                      `🔗 Profile URL: ${result.url || 'N/A'}\n` +
                      `📅 Created At: ${new Date(result.created_at).toDateString()}\n` +
                      `🕒 Last Updated: ${new Date(result.updated_at).toDateString()}`;

      await sock.sendMessage(chatId, { image: { url: result.profile_pic }, caption: caption }, { quoted: message });

    } catch (err) {
      console.error('GitHub plugin error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch GitHub profile.' }, { quoted: message });
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
 
