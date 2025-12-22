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
  command: 'element',
  aliases: ['atom', 'periodictable'],
  category: 'search',
  description: 'Get information about a chemical element',
  usage: '.element <name or symbol>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args?.join(' ')?.trim();

    if (!query) {
      return await sock.sendMessage(chatId, { text: '*Provide element name or symbol.*\nExample: .element H' }, { quoted: message });
    }

    try {
      const { data: json } = await axios.get(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(query)}`);

      if (!json?.name) {
        return await sock.sendMessage(chatId, { text: '❌ Element not found.' }, { quoted: message });
      }

      const text = 
        `🧪 *Element Info*\n` +
        `• Name: ${json.name}\n` +
        `• Symbol: ${json.symbol}\n` +
        `• Atomic #: ${json.atomic_number}\n` +
        `• Atomic Mass: ${json.atomic_mass}\n` +
        `• Period: ${json.period}\n` +
        `• Phase: ${json.phase}\n` +
        `• Discovered By: ${json.discovered_by || 'Unknown'}\n\n` +
        `📘 Summary:\n${json.summary}`;

      await sock.sendMessage(chatId, { image: { url: json.image }, caption: text }, { quoted: message });

    } catch (error) {
      console.error('Element plugin error:', error);
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch element info.' }, { quoted: message });
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
 
