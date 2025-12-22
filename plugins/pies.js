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

const BASE = 'https://shizoapi.onrender.com/api/pies';
const VALID_COUNTRIES = ['china', 'indonesia', 'japan', 'korea', 'hijab'];

async function fetchPiesImageBuffer(country) {
  const url = `${BASE}/${country}?apikey=shizo`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('image')) throw new Error('API did not return an image');
  return res.buffer();
}

module.exports = {
  command: 'pies',
  aliases: ['pie'],
  category: 'images',
  description: 'Get a pies image from a specific country',
  usage: `.pies <country>\nAvailable countries: ${VALID_COUNTRIES.join(', ')}`,
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const sub = (args[0] || '').toLowerCase();

    if (!sub) {
      await sock.sendMessage(chatId, {
        text: `Usage: .pies <country>\nCountries: ${VALID_COUNTRIES.join(', ')}`
      }, { quoted: message });
      return;
    }
    if (!VALID_COUNTRIES.includes(sub)) {
      await sock.sendMessage(chatId, {
        text: `Unsupported country: ${sub}. Try one of: ${VALID_COUNTRIES.join(', ')}`
      }, { quoted: message });
      return;
    }
    try {
      const imageBuffer = await fetchPiesImageBuffer(sub);
      await sock.sendMessage(chatId, {
        image: imageBuffer,
        caption: `🍰 pies: ${sub}`
      }, { quoted: message });
    } catch (err) {
      console.error('Pies Command Error:', err);
      await sock.sendMessage(chatId, {
        text: '❌ Failed to fetch image. Please try again.'
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
 