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
  command: 'define',
  aliases: ['dict', 'urban'],
  category: 'search',
  description: 'Search a word on Dictionary',
  usage: '.define <word>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args?.join(' ')?.trim();

    if (!query) {
      return await sock.sendMessage(chatId, { text: '*Please provide a word to search for.*\nExample: .define hello' }, { quoted: message });
    }

    try {
      const url = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`;
      const { data: json } = await axios.get(url);

      if (!json?.list || json.list.length === 0) {
        return await sock.sendMessage(chatId, { text: '❌ Word not found in the dictionary.' }, { quoted: message });
      }

      const firstEntry = json.list[0];
      const definition = firstEntry.definition || 'No definition available';
      const example = firstEntry.example ? `*Example:* ${firstEntry.example}` : '';

      const text = `🔍 *Dictionary*\n\n*Word:* ${query}\n*Definition:* ${definition}\n${example}`;
      await sock.sendMessage(chatId, { text }, { quoted: message });

    } catch (error) {
      console.error('Urban plugin error:', error);
      await sock.sendMessage(chatId, { text: '❌ Failed to fetch definition.', }, { quoted: message });
    }}
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
 
