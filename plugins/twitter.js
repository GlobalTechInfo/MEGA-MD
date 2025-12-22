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
  command: 'twitter',
  aliases: ['xtweet', 'tweetdl', 'twitterdl'],
  category: 'download',
  description: 'Download media (video or image) from X/Twitter post',
  usage: '.twitter <Tweet URL>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const url = args?.[0];

    if (!url) {
      return await sock.sendMessage(chatId, { text: 'Please provide a Twitter/X URL.\nExample: .twitter https://x.com/i/status/2002054360428167305' }, { quoted: message });
    }

    try {
      const apiUrl = `https://discardapi.dpdns.org/api/dl/twitter?apikey=guru&url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(apiUrl, { timeout: 10000 });

      if (!data?.status || !data.result?.media?.length) {
        return await sock.sendMessage(chatId, { text: '❌ No media found for this Tweet.' }, { quoted: message });
      }

      const tweet = data.result;
      const caption = `
📝 @${tweet.authorUsername} (${tweet.authorName})
📅 ${tweet.date}
❤️ Likes: ${tweet.likes} | 🔁 Retweets: ${tweet.retweets} | 💬 Replies: ${tweet.replies}

💬 ${tweet.text}
      `.trim();

      for (let mediaItem of tweet.media) {
        if (mediaItem.type === 'video') {
          await sock.sendMessage(chatId, { video: { url: mediaItem.url }, caption: caption }, { quoted: message });
        } else if (mediaItem.type === 'image') {
          await sock.sendMessage(chatId, { image: { url: mediaItem.url }, caption: caption }, { quoted: message });
        }
      }

    } catch (error) {
      console.error('Twitter plugin error:', error);

      if (error.code === 'ECONNABORTED') {
        await sock.sendMessage(chatId, { text: '❌ Request timed out. The API may be slow or unreachable.' }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch Twitter/X media.' }, { quoted: message });
      }
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
 
