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
 

const fetch = require('node-fetch');
const { writeExifImg } = require('../lib/exif');
const delay = time => new Promise(res => setTimeout(res, time));
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const webp = require('node-webpmux');
const crypto = require('crypto');
const { exec } = require('child_process');
const settings = require('../settings');

module.exports = {
  command: 'tgstk',
  aliases: ['telegram', 'tgsticker'],
  category: 'stickers',
  description: 'Download stickers from Telegram',
  usage: '.tgstk <telegram sticker URL>',
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    try {
      if (!args[0]) {
        await sock.sendMessage(chatId, { 
          text: '⚠️ Please enter the Telegram sticker URL!\n\nExample: .tgstk https://t.me/addstickers/Porcientoreal',
          ...channelInfo
        }, { quoted: message });
        return;
      }
      
      if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) {
        await sock.sendMessage(chatId, { 
          text: '❌ Invalid URL! Make sure it\'s a Telegram sticker URL.',
          ...channelInfo
        }, { quoted: message });
        return;
      }
      
      const packName = args[0].replace("https://t.me/addstickers/", "");
      const botToken = '7801479976:AAGuPL0a7kXXBYz6XUSR_ll2SR5V_W6oHl4';
      
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/getStickerSet?name=${encodeURIComponent(packName)}`,
          { 
            method: "GET",
            headers: {
              "Accept": "application/json",
              "User-Agent": "Mozilla/5.0"
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const stickerSet = await response.json();
        
        if (!stickerSet.ok || !stickerSet.result) {
          throw new Error('Invalid sticker pack or API response');
        }
        
        await sock.sendMessage(chatId, { 
          text: `📦 Found ${stickerSet.result.stickers.length} stickers\n⏳ Starting download...`,
          ...channelInfo
        }, { quoted: message });
        
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        
        let successCount = 0;
        for (let i = 0; i < stickerSet.result.stickers.length; i++) {
          try {
            const sticker = stickerSet.result.stickers[i];
            const fileId = sticker.file_id;
            
            const fileInfo = await fetch(
              `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
            );
            
            if (!fileInfo.ok) continue;
            
            const fileData = await fileInfo.json();
            if (!fileData.ok || !fileData.result.file_path) continue;

            const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
            const imageResponse = await fetch(fileUrl);
            const imageBuffer = await imageResponse.buffer();
            const tempInput = path.join(tmpDir, `temp_${Date.now()}_${i}`);
            const tempOutput = path.join(tmpDir, `sticker_${Date.now()}_${i}.webp`);
            fs.writeFileSync(tempInput, imageBuffer);

            const isAnimated = sticker.is_animated || sticker.is_video;
            
            const ffmpegCommand = isAnimated
              ? `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`
              : `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`;

            await new Promise((resolve, reject) => {
              exec(ffmpegCommand, (error) => {
                if (error) {
                  console.error('FFmpeg error:', error);
                  reject(error);
                } else resolve();
              });
            });

            const webpBuffer = fs.readFileSync(tempOutput);

            const img = new webp.Image();
            await img.load(webpBuffer);

            const metadata = {
              'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
              'sticker-pack-name': settings.packname,
              'emojis': sticker.emoji ? [sticker.emoji] : ['🤖']
            };

            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuffer = Buffer.from(JSON.stringify(metadata), 'utf8');
            const exif = Buffer.concat([exifAttr, jsonBuffer]);
            exif.writeUIntLE(jsonBuffer.length, 14, 4);

            img.exif = exif;

            const finalBuffer = await img.save(null);

            await sock.sendMessage(chatId, { 
              sticker: finalBuffer,
              ...channelInfo
            });

            successCount++;
            await delay(1000);
            
            try {
              fs.unlinkSync(tempInput);
              fs.unlinkSync(tempOutput);
            } catch (err) {
              console.error('Error cleaning up temp files:', err);
            }

          } catch (err) {
            console.error(`Error processing sticker ${i}:`, err);
            continue;
          }
        }
        
        await sock.sendMessage(chatId, { 
          text: `✅ Successfully downloaded ${successCount}/${stickerSet.result.stickers.length} stickers!`,
          ...channelInfo
        }, { quoted: message });

      } catch (error) {
        throw new Error(`Failed to process sticker pack: ${error.message}`);
      }

    } catch (error) {
      console.error('Error in stickertelegram command:', error);
      await sock.sendMessage(chatId, { 
        text: '❌ Failed to process Telegram stickers!\nMake sure:\n1. The URL is correct\n2. The sticker pack exists\n3. The sticker pack is public',
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
 
