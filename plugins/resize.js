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
 

const { uploadImage } = require('../lib/uploadImage');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function downloadMedia(msg, type) {
  const stream = await downloadContentFromMessage(msg, type);
  let buffer = Buffer.alloc(0);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  return buffer;
}

module.exports = {
  command: 'length',
  aliases: ['filelength', 'resize'],
  category: 'tools',
  description: 'Send an image or video with a custom file length',
  usage: '.length <size> (reply to media)',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const text = args?.join(' ')?.trim();

    try {
      let mediaMsg, mediaType;
      const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (quoted) {
        if (quoted.imageMessage) {
          mediaMsg = quoted.imageMessage;
          mediaType = 'image';
        } else if (quoted.videoMessage) {
          mediaMsg = quoted.videoMessage;
          mediaType = 'video';
        }
      }

      if (!mediaMsg) {
        if (message.message?.imageMessage) {
          mediaMsg = message.message.imageMessage;
          mediaType = 'image';
        } else if (message.message?.videoMessage) {
          mediaMsg = message.message.videoMessage;
          mediaType = 'video';
        }
      }
      if (!mediaMsg) {
        return await sock.sendMessage(chatId, { text: '*⚠️ Reply to an image or video.*' }, { quoted: message });
      }
      if (!text || isNaN(text)) {
        return await sock.sendMessage(chatId, { text: '*🔢 Provide numeric file size.*\nExample: .length 999999' }, { quoted: message });
      }

      const buffer = await downloadMedia(mediaMsg, mediaType);
      const url = await uploadImage(buffer);

      await sock.sendMessage(
        chatId,
        mediaType === 'image'
          ? { image: { url }, caption: 'Here you go', fileLength: text }
          : { video: { url }, caption: 'Here you go', fileLength: text },
        { quoted: message }
      );

    } catch (err) {
      console.error('FileLength plugin error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to process media.' }, { quoted: message });
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
 