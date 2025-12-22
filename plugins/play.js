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
 


const yts = require('yt-search');
const axios = require('axios');

module.exports = {
  command: 'play',
  aliases: ['song', 'mp3'],
  category: 'music',
  description: 'Search and download a song as MP3 from YouTube',
  usage: '.play <song name>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const searchQuery = args.join(' ').trim();

    try {
      if (!searchQuery) {
        return await sock.sendMessage(chatId, {
          text: "*Wich song do you want to play?*\nUsage: .play <song name>"
        }, { quoted: message });
      }
      const { videos } = await yts(searchQuery);
      if (!videos || videos.length === 0) {
        return await sock.sendMessage(chatId, {
          text: "*No songs found!*"
        }, { quoted: message });
      }

      await sock.sendMessage(chatId, {
        text: "_Please wait, your download is in progress..._"
      }, { quoted: message });

      const video = videos[0];
      const urlYt = video.url;

      const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
      const data = response.data;

      if (!data?.status || !data?.result?.downloadUrl) {
        return await sock.sendMessage(chatId, {
          text: "❌ Failed to fetch audio from the API. Please try again later."
        }, { quoted: message });
      }

      const audioUrl = data.result.downloadUrl;
      const title = data.result.title;

      await sock.sendMessage(chatId, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`
      }, { quoted: message });

    } catch (error) {
      console.error('Play Command Error:', error);
      await sock.sendMessage(chatId, {
        text: "❌ Download failed. Please try again later."
      }, { quoted: message });
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
 
