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
const fetch = require('node-fetch');

module.exports = {
  command: 'gpt',
  aliases: ['gemini', 'ai', 'chat'],
  category: 'ai',
  description: 'Ask a question to AI (GPT or Gemini)',
  usage: '.gpt <question> or .gemini <question>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const command = (args[0] || '').toLowerCase();
    const query = args.join(' ').trim();
    if (!query) {
      await sock.sendMessage(chatId, { 
        text: "Please provide a query after .gpt or .gemini\n\nExample: .gpt write a basic HTML code"
      }, { quoted: message });
      return;
    }
    try {
      await sock.sendMessage(chatId, {
        react: { text: '🤖', key: message.key }
      });

      if (command.startsWith('gpt')) {
        const response = await axios.get(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`);
        if (response.data && response.data.status && response.data.result) {
          const answer = response.data.result;
          await sock.sendMessage(chatId, { text: answer }, { quoted: message });
        } else {
          throw new Error('Invalid response from GPT API');
        }
      } else if (command.startsWith('gemini')) {
        const apis = [
          `https://vapis.my.id/api/gemini?q=${encodeURIComponent(query)}`,
          `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`,
          `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}`,
          `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`,
          `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(query)}`,
          `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(query)}`
        ];

        let answered = false;
        for (const api of apis) {
          try {
            const res = await fetch(api);
            const data = await res.json();
            const answer = data.message || data.data || data.answer || data.result;
            if (answer) {
              await sock.sendMessage(chatId, { text: answer }, { quoted: message });
              answered = true;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        if (!answered) {
          throw new Error('All Gemini APIs failed');
        }
      }
    } catch (error) {
      console.error('AI Command Error:', error);
      await sock.sendMessage(chatId, {
        text: "❌ Failed to get AI response. Please try again later."
      }, { quoted: message });
    }
  }
};

/*****************************************************************************
 *                                                                           *
 *                   Developed By Qasim Ali                                  *
 *                                                                           *
 *   🌐 GitHub   : https://github.com/GlobalTechInfo                         *
 *   ▶️  YouTube  : https://youtube.com/@GlobalTechInfo                      *
 *   💬  WhatsApp : https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07    *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the MEGA-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/

