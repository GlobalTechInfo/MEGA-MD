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
 

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'dlstatus',
  aliases: ['swdl', 'statusdl'],
  category: 'download',
  description: 'Download quoted Status updates',
  usage: 'Reply to a status and type .dlstatus',
  ownerOnly: 'true',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    const m = message.message;
    const type = Object.keys(m)[0];
    const contextInfo = m[type]?.contextInfo;

    if (!contextInfo || contextInfo.remoteJid !== 'status@broadcast') {
      return await sock.sendMessage(chatId, { 
        text: "Please reply/quote a Status update to download it." 
      }, { quoted: message });
    }

    const quotedMsg = contextInfo.quotedMessage;
    if (!quotedMsg) return;

    try {
      const quotedType = Object.keys(quotedMsg)[0];
      const mediaData = quotedMsg[quotedType];

      if (quotedType === 'conversation' || quotedType === 'extendedTextMessage') {
        const text = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text;
        return await sock.sendMessage(chatId, { text: `📝 *Status Text:*\n\n${text}` }, { quoted: message });
      }

      const stream = await downloadContentFromMessage(
        mediaData, 
        quotedType.replace('Message', '')
      );

      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      if (quotedType === 'imageMessage') {
        await sock.sendMessage(chatId, { image: buffer, caption: mediaData.caption || '' }, { quoted: message });
      } else if (quotedType === 'videoMessage') {
        await sock.sendMessage(chatId, { video: buffer, caption: mediaData.caption || '' }, { quoted: message });
      }

    } catch (e) {
      console.error('SW Download Error:', e);
      await sock.sendMessage(chatId, { text: "❌ Failed to download status media." }, { quoted: message });
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
 
