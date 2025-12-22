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
  command: 'walink',
  aliases: ['wa', 'waid'],
  category: 'tools',
  description: 'Generate a WhatsApp link from a phone number.',
  usage: '.walink <number> or reply to a user with .wa',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    try {
      let waNumber = '';
      if (args.length > 0) {
        waNumber = args.join('').replace(/[^0-9]/g, '');
      } else {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        
        if (ctx?.participant) {
          waNumber = ctx.participant.replace(/[^0-9]/g, '');
        } else if (ctx?.mentionedJid?.[0]) {
          waNumber = ctx.mentionedJid[0].replace(/[^0-9]/g, '');
        } else {
          return await sock.sendMessage(
            chatId,
            { text: 'Please provide a number, reply to a user, or mention a user.' },
            { quoted: message }
          );
        }
      }
      if (!waNumber) {
        return await sock.sendMessage(
          chatId,
          { text: '❌ Invalid WhatsApp number.' },
          { quoted: message }
        );
      }
      const waLink = `https://wa.me/${waNumber}`;
      await sock.sendMessage(
        chatId,
        { text: `*WhatsApp Link:*\n${waLink}` },
        { quoted: message }
      );
    } catch (error) {
      console.error('WA COMMAND ERROR:', error);
      await sock.sendMessage(
        chatId,
        { text: '❌ Failed to generate WhatsApp link.' },
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
 
