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
  command: 'imdb',
  aliases: ['movie', 'film'],
  category: 'info',
  description: 'Get detailed information about a movie or series from IMDB',
  usage: '.imdb <movie/series title>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const text = args.join(' ').trim();

    if (!text) {
      await sock.sendMessage(chatId, { 
        text: '*Please provide a movie or series title.*\nExample: `.imdb Inception`', 
        quoted: message 
      });
      return;
    }
    try {
      const res = await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(text)}`);
      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
      const json = await res.json();
      const ratings = (json.ratings || [])
        .map(r => `⭐ *${r.source}:* ${r.value}`)
        .join('\n') || 'No ratings available';

      const movieInfo = `
🎬 *${json.title || 'N/A'}* (${json.year || 'N/A'})
🎭 *Genres:* ${json.genres || 'N/A'}
📺 *Type:* ${json.type || 'N/A'}
📝 *Plot:* ${json.plot || 'N/A'}
⭐ *IMDB Rating:* ${json.rating || 'N/A'} (${json.votes || 'N/A'} votes)
🏆 *Awards:* ${json.awards || 'N/A'}
🎬 *Director:* ${json.director || 'N/A'}
✍️ *Writer:* ${json.writer || 'N/A'}
👨‍👩‍👧‍👦 *Actors:* ${json.actors || 'N/A'}
⏱️ *Runtime:* ${json.runtime || 'N/A'}
📅 *Released:* ${json.released || 'N/A'}
🌐 *Country:* ${json.country || 'N/A'}
🗣️ *Languages:* ${json.languages || 'N/A'}
💰 *Box Office:* ${json.boxoffice || 'N/A'}
💽 *DVD Release:* ${json.dvd || 'N/A'}
🏢 *Production:* ${json.production || 'N/A'}
🔗 *Website:* ${json.website || 'N/A'}

*Ratings:*
${ratings}
      `.trim();
      if (json.poster) {
        await sock.sendMessage(chatId, { 
          image: { url: json.poster }, 
          caption: movieInfo, 
          quoted: message 
        });
      } else {
        await sock.sendMessage(chatId, { text: movieInfo, quoted: message });
      }
    } catch (error) {
      console.error('IMDB Command Error:', error);
      await sock.sendMessage(chatId, { 
        text: '❌ Failed to fetch movie information. Please try again later.', 
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
 

