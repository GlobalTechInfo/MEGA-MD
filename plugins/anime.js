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
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const webp = require('node-webpmux');
const crypto = require('crypto');

const ANIMU_BASE = 'https://api.some-random-api.com/animu';

function normalizeType(input) {
  const lower = (input || '').toLowerCase();
  if (lower === 'facepalm' || lower === 'face_palm') return 'face-palm';
  if (lower === 'quote' || lower === 'animu-quote' || lower === 'animuquote') return 'quote';
  return lower;
}

async function convertMediaToSticker(mediaBuffer, isAnimated) {
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const inputExt = isAnimated ? 'gif' : 'jpg';
  const input = path.join(tmpDir, `animu_${Date.now()}.${inputExt}`);
  const output = path.join(tmpDir, `animu_${Date.now()}.webp`);
  fs.writeFileSync(input, mediaBuffer);

  const ffmpegCmd = isAnimated
    ? `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=15" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 60 -compression_level 6 "${output}"`
    : `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${output}"`;

  await new Promise((resolve, reject) => {
    exec(ffmpegCmd, (err) => (err ? reject(err) : resolve()));
  });

  let webpBuffer = fs.readFileSync(output);
  const img = new webp.Image();
  await img.load(webpBuffer);

  const json = {
    'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
    'sticker-pack-name': 'Anime Stickers',
    'emojis': ['🎌']
  };
  const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00]);
  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  const exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  img.exif = exif;

  const finalBuffer = await img.save(null);

  try { fs.unlinkSync(input); } catch {}
  try { fs.unlinkSync(output); } catch {}
  return finalBuffer;
}

async function sendAnimu(sock, chatId, message, type) {
  try {
    const res = await axios.get(`${ANIMU_BASE}/${type}`);
    const data = res.data || {};

    if (data.link) {
      const link = data.link;
      const lower = link.toLowerCase();
      const isGif = lower.endsWith('.gif');
      const isImage = lower.match(/\.(jpg|jpeg|png|webp)$/);

      if (isGif || isImage) {
        const resp = await axios.get(link, { responseType: 'arraybuffer', timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } });
        const stickerBuf = await convertMediaToSticker(Buffer.from(resp.data), isGif);
        return await sock.sendMessage(chatId, { sticker: stickerBuf }, { quoted: message });
      }

      return await sock.sendMessage(chatId, { image: { url: link }, caption: `anime: ${type}` }, { quoted: message });
    }

    if (data.quote) {
      return await sock.sendMessage(chatId, { text: data.quote }, { quoted: message });
    }

    return await sock.sendMessage(chatId, { text: '❌ Failed to fetch animu.' }, { quoted: message });

  } catch (err) {
    console.error('Error sending animu:', err);
    await sock.sendMessage(chatId, { text: '❌ An error occurred while fetching animu.' }, { quoted: message });
  }
}

module.exports = {
  command: 'animu',
  aliases: ['anime'],
  category: 'menu',
  description: 'Send anime stickers or quotes',
  usage: '.animu <type>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const subArg = args && args[0] ? args[0] : '';
    const type = normalizeType(subArg);

    const supported = ['nom', 'poke', 'cry', 'kiss', 'pat', 'hug', 'wink', 'face-palm', 'quote'];

    try {
      if (!type) {
        try {
          const res = await axios.get(ANIMU_BASE);
          const apiTypes = res.data?.types?.map(s => s.replace('/animu/', '')) || supported;
          return await sock.sendMessage(chatId, { text: `Usage: .animu <type>\nTypes: ${apiTypes.join(', ')}` }, { quoted: message });
        } catch {
          return await sock.sendMessage(chatId, { text: `Usage: .animu <type>\nTypes: ${supported.join(', ')}` }, { quoted: message });
        }
      }

      if (!supported.includes(type)) {
        return await sock.sendMessage(chatId, { text: `❌ Unsupported type: ${type}. Try one of: ${supported.join(', ')}` }, { quoted: message });
      }

      await sendAnimu(sock, chatId, message, type);

    } catch (err) {
      console.error('Error in animu handler:', err);
      await sock.sendMessage(chatId, { text: '❌ An error occurred while fetching animu.' }, { quoted: message });
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
 
