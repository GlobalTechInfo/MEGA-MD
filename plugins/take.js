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
 

const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const webp = require('node-webpmux');
const crypto = require('crypto');

module.exports = {
  command: 'take',
  aliases: ['steal', 'wm'],
  category: 'stickers',
  description: 'Change sticker pack name',
  usage: '.take <packname> (reply to sticker)',
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    try {
      const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      if (!quotedMessage?.stickerMessage) {
        await sock.sendMessage(chatId, { 
          text: '❌ Reply to a sticker with .take <packname>',
          ...channelInfo
        }, { quoted: message });
        return;
      }
      
      const packname = args.join(' ') || 'MEGA AI';

      try {
        const stickerBuffer = await downloadMediaMessage(
          {
            key: message.message.extendedTextMessage.contextInfo.stanzaId,
            message: quotedMessage,
            messageType: 'stickerMessage'
          },
          'buffer',
          {},
          {
            logger: console,
            reuploadRequest: sock.updateMediaMessage
          }
        );

        if (!stickerBuffer) {
          await sock.sendMessage(chatId, { 
            text: '❌ Failed to download sticker',
            ...channelInfo
          }, { quoted: message });
          return;
        }
        
        const img = new webp.Image();
        await img.load(stickerBuffer);

        const json = {
          'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
          'sticker-pack-name': packname,
          'emojis': ['🤖']
        };

        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        const exif = Buffer.concat([exifAttr, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);

        img.exif = exif;

        const finalBuffer = await img.save(null);

        await sock.sendMessage(chatId, {
          sticker: finalBuffer,
          ...channelInfo
        }, {
          quoted: message
        });

      } catch (error) {
        console.error('Sticker processing error:', error);
        await sock.sendMessage(chatId, { 
          text: '❌ Error processing sticker',
          ...channelInfo
        }, { quoted: message });
      }

    } catch (error) {
      console.error('Error in take command:', error);
      await sock.sendMessage(chatId, { 
        text: '❌ Error processing command',
        ...channelInfo
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
 
