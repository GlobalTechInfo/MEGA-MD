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
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'application/json, text/plain, */*'
  }
};

module.exports = {
  command: 'facebook',
  aliases: ['fb', 'fbdl'],
  category: 'download',
  description: 'Download Facebook videos',
  usage: '.fb <facebook video link>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const url =
      args.join(' ') ||
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text;

    try {
      if (!url) {
        return await sock.sendMessage(chatId, { text: '📘 *Facebook Downloader*\n\nUsage:\n.fb <facebook video link>' }, { quoted: message });
      }

      if (!/facebook\.com|fb\.watch/i.test(url)) {
        return await sock.sendMessage(
          chatId,
          { text: '❌ Invalid Facebook link.\nPlease send a valid Facebook video URL.' },
          { quoted: message }
        );
      }

      await sock.sendMessage(chatId, {
        react: { text: '🔄', key: message.key }
      });

      const apiUrl = `https://gtech-api-xtp1.onrender.com/api/download/fb?url=${encodeURIComponent(
        url
      )}&apikey=APIKEY`;

      const res = await axios.get(apiUrl, AXIOS_DEFAULTS);

      const videos = res?.data?.data?.data;
      if (!res?.data?.status || !Array.isArray(videos) || !videos.length) {
        throw new Error('No downloadable video found');
      }

      const sorted = videos.sort((a, b) => {
        const qa = parseInt(a.resolution) || 0;
        const qb = parseInt(b.resolution) || 0;
        return qb - qa;
      });

      const selected = sorted[0];
      const videoUrl = selected.url.startsWith('http')
        ? selected.url
        : `https://gtech-api-xtp1.onrender.com${selected.url}`;

      const caption = `📘 *Facebook Downloader*
🎞 Quality: *${selected.resolution || 'Unknown'}*

> *_Downloaded by MEGA-MD_*`;

      await sock.sendMessage(chatId, { video: { url: videoUrl }, mimetype: 'video/mp4', caption }, { quoted: message });

    } catch (err) {
      console.error('Facebook downloader error:', err);
      await sock.sendMessage(
        chatId,
        { text: '❌ Failed to download Facebook video. Please try again later.' },
        { quoted: message });
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
 
