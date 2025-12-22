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
  command: 'news',
  aliases: ['headlines', 'latestnews'],
  category: 'info',
  description: 'Get the latest top 5 news headlines from the US',
  usage: '.news',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    try {
      const apiKey = 'dcd720a6f1914e2d9dba9790c188c08c';
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
      if (!response.data || !response.data.articles) throw 'Invalid API response';
      const articles = response.data.articles.slice(0, 5);
      if (articles.length === 0) {
        await sock.sendMessage(chatId, {
          text: '❌ No news found at the moment. Please try again later.',
          quoted: message
        });
        return;
      }
      let newsMessage = '📰 *Latest News*:\n\n';
      articles.forEach((article, index) => {
        newsMessage += `${index + 1}. *${article.title}*\n${article.description || 'No description'}\n\n`;
      });
      await sock.sendMessage(chatId, {
        text: newsMessage.trim(),
        quoted: message
      });
    } catch (error) {
      console.error('News Command Error:', error);
      await sock.sendMessage(chatId, {
        text: '❌ Sorry, I could not fetch news right now. Please try again later.',
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
 