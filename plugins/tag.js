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
 

const isAdmin = require('../lib/isAdmin');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

async function downloadMediaMessage(message, mediaType) {
  const stream = await downloadContentFromMessage(message, mediaType);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  const filePath = path.join(__dirname, '../temp/', `${Date.now()}.${mediaType}`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

module.exports = {
  command: 'tag',
  aliases: ['tagall', 'hidetag'],
  category: 'admin',
  description: 'Tag all group members',
  usage: '.tag [message] or reply to a message',
  groupOnly: true,
  adminOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, senderId, channelInfo, messageText } = context;
    
    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants;
    const mentionedJidList = participants.map(p => p.id);

    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const tagText = args.join(' ');

    if (replyMessage) {
      let messageContent = {};

      if (replyMessage.imageMessage) {
        const filePath = await downloadMediaMessage(replyMessage.imageMessage, 'image');
        messageContent = {
          image: { url: filePath },
          caption: tagText || replyMessage.imageMessage.caption || '',
          mentions: mentionedJidList,
          ...channelInfo
        };
      }
      else if (replyMessage.videoMessage) {
        const filePath = await downloadMediaMessage(replyMessage.videoMessage, 'video');
        messageContent = {
          video: { url: filePath },
          caption: tagText || replyMessage.videoMessage.caption || '',
          mentions: mentionedJidList,
          ...channelInfo
        };
      }
      else if (replyMessage.conversation || replyMessage.extendedTextMessage) {
        messageContent = {
          text: replyMessage.conversation || replyMessage.extendedTextMessage.text,
          mentions: mentionedJidList,
          ...channelInfo
        };
      }
      else if (replyMessage.documentMessage) {
        const filePath = await downloadMediaMessage(replyMessage.documentMessage, 'document');
        messageContent = {
          document: { url: filePath },
          fileName: replyMessage.documentMessage.fileName,
          caption: tagText || '',
          mentions: mentionedJidList,
          ...channelInfo
        };
      }

      if (Object.keys(messageContent).length > 0) {
        await sock.sendMessage(chatId, messageContent);
      }
    } else {
      await sock.sendMessage(chatId, {
        text: tagText || "Tagged message",
        mentions: mentionedJidList,
        ...channelInfo
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
 
