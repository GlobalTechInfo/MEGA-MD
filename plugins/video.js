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
const yts = require('yt-search');

const izumi = {
  baseURL: 'https://izumiiiiiiii.dpdns.org'
};

const AXIOS_DEFAULTS = {
  timeout: 60000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*'
  }
};

async function tryRequest(getter, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await getter();
    } catch (err) {
      lastError = err;
      if (attempt < attempts) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }
  throw lastError;
}

async function getIzumiVideoByUrl(youtubeUrl) {
  const apiUrl = `${izumi.baseURL}/downloader/youtube?url=${encodeURIComponent(
    youtubeUrl
  )}&format=720`;

  const res = await tryRequest(() =>
    axios.get(apiUrl, AXIOS_DEFAULTS)
  );

  if (res?.data?.result?.download) return res.data.result;
  throw new Error('Izumi API returned no download');
}

async function getOkatsuVideoByUrl(youtubeUrl) {
  const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(
    youtubeUrl
  )}`;

  const res = await tryRequest(() =>
    axios.get(apiUrl, AXIOS_DEFAULTS)
  );

  if (res?.data?.result?.mp4) {
    return {
      download: res.data.result.mp4,
      title: res.data.result.title
    };
  }
  throw new Error('API returned no mp4');
}

module.exports = {
  command: 'video',
  aliases: ['ytmp4', 'ytvideo', 'ytdl'],
  category: 'download',
  description: 'Download YouTube videos by link or search',
  usage: '.video <youtube link | search query>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    try {
      const query = args.join(' ').trim();

      if (!query) {
        return await sock.sendMessage(
          chatId,
          { text: '🎥 *What video do you want to download?*\nExample:\n.video Alan Walker Faded' },
          { quoted: message }
        );
      }

      let videoUrl = '';
      let videoTitle = '';
      let videoThumbnail = '';

      if (query.startsWith('http://') || query.startsWith('https://')) {
        videoUrl = query;
      } else {
        const { videos } = await yts(query);

        if (!videos || videos.length === 0) {
          return await sock.sendMessage(
            chatId,
            { text: '❌ No videos found!' },
            { quoted: message }
          );
        }

        const vid = videos[0];
        videoUrl = vid.url;
        videoTitle = vid.title;
        videoThumbnail = vid.thumbnail;
      }

      try {
        const ytId =
          (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
        const thumb =
          videoThumbnail ||
          (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : null);

        if (thumb) {
          await sock.sendMessage(
            chatId,
            {
              image: { url: thumb },
              caption: `🎬 *${videoTitle || query}*\n⬇️ Downloading...`
            },
            { quoted: message }
          );
        }
      } catch (e) {
        console.error('[VIDEO] Thumbnail error:', e?.message || e);
      }

      const validYT = videoUrl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/
      );
      if (!validYT) {
        return await sock.sendMessage(chatId, { text: '❌ This is not a valid YouTube link!' }, { quoted: message });
      }

      let videoData;
      try {
        videoData = await getIzumiVideoByUrl(videoUrl);
      } catch {
        videoData = await getOkatsuVideoByUrl(videoUrl);
      }

      await sock.sendMessage(
        chatId,
        {
          video: { url: videoData.download },
          mimetype: 'video/mp4',
          fileName: `${videoData.title || videoTitle || 'video'}.mp4`,
          caption:
            `🎬 *${videoData.title || videoTitle || 'Video'}*\n\n` +
            `> *_Downloaded by MEGA-AI_*`
        },
        { quoted: message }
      );

    } catch (error) {
      console.error('[VIDEO] Command Error:', error);
      await sock.sendMessage(
        chatId,
        { text: `❌ Download failed!\nReason: ${error?.message || 'Unknown error'}` },
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
 
