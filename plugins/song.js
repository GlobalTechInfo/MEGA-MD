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

const AXIOS_DEFAULTS = {
  timeout: 60000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*'
  }
};

async function tryRequest(getter, attempts = 3) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await getter();
    } catch (err) {
      lastError = err;
      if (i < attempts) await new Promise(r => setTimeout(r, i * 1000));
    }
  }
  throw lastError;
}

async function getIzumiByUrl(url) {
  const api = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(url)}&format=mp3`;
  const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
  if (res?.data?.result?.download) return res.data.result;
  throw new Error('Izumi URL failed');
}

async function getIzumiByQuery(query) {
  const api = `https://izumiiiiiiii.dpdns.org/downloader/youtube-play?query=${encodeURIComponent(query)}`;
  const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
  if (res?.data?.result?.download) return res.data.result;
  throw new Error('Izumi search failed');
}

async function getOkatsuByUrl(url) {
  const api = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(url)}`;
  const res = await tryRequest(() => axios.get(api, AXIOS_DEFAULTS));
  if (res?.data?.dl) {
    return {
      download: res.data.dl,
      title: res.data.title,
      thumbnail: res.data.thumb
    };
  }
  throw new Error('Okatsu failed');
}

module.exports = {
  command: 'song',
  aliases: ['music', 'audio', 'mp3'],
  category: 'music',
  description: 'Download song from YouTube (MP3)',
  usage: '.song <song name | youtube link>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args.join(' ').trim();

    if (!query) {
      return await sock.sendMessage(chatId, { text: '🎵 *Song Downloader*\n\nUsage:\n.song <song name | YouTube link>' }, { quoted: message });
    }

    try {
      let video;

      if (query.includes('youtube.com') || query.includes('youtu.be')) {
        video = { url: query };
      } else {
        const search = await yts(query);
        if (!search?.videos?.length) {
          return await sock.sendMessage(chatId, { text: '❌ No results found.' }, { quoted: message });
        }
        video = search.videos[0];
      }

      if (video.thumbnail) {
        await sock.sendMessage(chatId, { image: { url: video.thumbnail }, caption: `🎶 *${video.title}*\n⏱ ${video.timestamp || 'Unknown'}\n\nDownloading...` }, { quoted: message });
      }
      let audio;
      try {
        audio = await getIzumiByUrl(video.url);
      } catch {
        try {
          audio = await getIzumiByQuery(video.title || query);
        } catch {
          audio = await getOkatsuByUrl(video.url);
        }
      }
      await sock.sendMessage(chatId, { audio: { url: audio.download }, mimetype: 'audio/mpeg', fileName: `${audio.title || video.title || 'song'}.mp3`, ptt: false }, { quoted: message });

    } catch (err) {
      console.error('Song plugin error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to download song. Please try again later.' }, { quoted: message });
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
 
		  
