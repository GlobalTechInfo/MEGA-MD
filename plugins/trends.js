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
 

const Qasim = require('api-qasim');

module.exports = {
  command: 'trends',
  aliases: ['trend', 'trending'],
  category: 'info',
  description: 'Get trending topics from a country.',
  usage: '.trends <country-name>',
  
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    try {
      const country = args.join(' ').trim();

      if (!country) {
        await sock.sendMessage(chatId, {
          text: '*Please provide a country name.*\nExample: .trends Pakistan or .trends South-Africa'
        }, { quoted: message });
        return;
      }

      const result = await Qasim.trendtwit(country);

      if (!result) {
        throw new Error('No data received');
      }

      let output = `*Trending topics in ${country}:*\n\n`;

      if (typeof result === 'string') {
        output += result;
      } else if (result.result && Array.isArray(result.result) && result.result.length) {
        result.result.forEach((trend, i) => {
          if (trend.hastag && trend.tweet) {
            output += `${i + 1}. ${trend.hastag} - ${trend.tweet}\n`;
          }
        });
      } else {
        throw new Error('No trending data found');
      }

      await sock.sendMessage(chatId, {
        text: output
      }, { quoted: message });

    } catch (error) {
      console.error('Error in trendsCommand:', error);
      await sock.sendMessage(chatId, {
        text: '❌ Failed to fetch trending topics. Please try again later.'
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
 
