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
 


module.exports = {
  command: 'base64',
  aliases: ['b64', 'encode'],
  category: 'tools',
  description: 'Encode text to Base64',
  usage: '.base64 <text>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    try {
      const txt = message.quoted?.text || args?.join(' ') || message.text;
      if (!txt) {
        return await sock.sendMessage(chatId, { text: '*Please provide text to encode.*\nExample: .base64 Hello World' }, { quoted: message });
      }

      const encoded = Buffer.from(txt, 'utf-8').toString('base64');
      await sock.sendMessage(chatId, { text: encoded }, { quoted: message });

    } catch (err) {
      console.error('Base64 plugin error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to encode text.' }, { quoted: message });
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
 

