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
 


const { igdl } = require('ruhend-scraper');

const processedMessages = new Set();

function extractUniqueMedia(mediaData = []) {
  const seen = new Set();
  return mediaData.filter(m => {
    if (!m?.url || seen.has(m.url)) return false;
    seen.add(m.url);
    return true;
  });
}

module.exports = {
  command: 'instagram',
  aliases: ['ig', 'igdl', 'insta'],
  category: 'download',
  description: 'Download Instagram posts, reels & videos',
  usage: '.ig <instagram link>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const text =
      args.join(' ') ||
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text;

    try {
      if (processedMessages.has(message.key.id)) return;
      processedMessages.add(message.key.id);
      setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

      if (!text) {
        return await sock.sendMessage(
          chatId,
          { text: '📸 *Instagram Downloader*\n\nUsage:\n.ig <post | reel | video link>' },
          { quoted: message }
        );
      }
        
      const igRegex =
        /https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\//i;

      if (!igRegex.test(text)) {
        return await sock.sendMessage(
          chatId,
          { text: '❌ Invalid Instagram link.\nPlease send a valid post, reel, or video URL.' },
          { quoted: message }
        );
      }
      await sock.sendMessage(chatId, {
        react: { text: '🔄', key: message.key }
      });

      const res = await igdl(text);

      if (!res?.data?.length) {
        return await sock.sendMessage(
          chatId,
          { text: '❌ No media found.\nThe post may be private or unavailable.' },
          { quoted: message }
        );
      }

      const mediaList = extractUniqueMedia(res.data).slice(0, 20);

      if (!mediaList.length) {
        return await sock.sendMessage(
          chatId,
          { text: '❌ No downloadable media found.' },
          { quoted: message }
        );
      }

      for (let i = 0; i < mediaList.length; i++) {
        const media = mediaList[i];
        const url = media.url;

        const isVideo =
          media.type === 'video' ||
          /\.(mp4|mov|webm|mkv)$/i.test(url) ||
          text.includes('/reel/') ||
          text.includes('/tv/');

        if (isVideo) {
          await sock.sendMessage(
            chatId,
            {
              video: { url },
              mimetype: 'video/mp4',
              caption: '📥 *Downloaded by MEGA-MD*'
            },
            { quoted: message }
          );
        } else {
          await sock.sendMessage(
            chatId,
            {
              image: { url },
              caption: '📥 *Downloaded by MEGA-MD*'
            },
            { quoted: message }
          );
        }

        if (i < mediaList.length - 1) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

    } catch (err) {
      console.error('Instagram plugin error:', err);
      await sock.sendMessage(
        chatId,
        { text: '❌ Failed to download Instagram media. Please try again later.' },
        { quoted: message }
      );
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
 