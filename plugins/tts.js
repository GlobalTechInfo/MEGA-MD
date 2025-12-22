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
 

const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'tts',
  aliases: ['texttospeech'],
  category: 'tools',
  description: 'Convert text to speech and send as an audio message.',
  usage: '.tts <text> or reply to a message with .tts',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const text = args.join(' ').trim();

    if (!text) {
      await sock.sendMessage(chatId, { text: '*Please provide the text for TTS conversion.*' }, { quoted: message });
      return;
    }

    const language = args[args.length - 1] && args[args.length - 1].match(/^[a-z]{2}$/) ? args.pop() : 'en';
    const fileName = `tts-${Date.now()}.mp3`;
    const filePath = path.join(__dirname, '..', 'assets', fileName);

    const gtts = new gTTS(text, language);
    gtts.save(filePath, async function (err) {
      if (err) {
        await sock.sendMessage(chatId, { text: '❌ Error generating TTS audio.' }, { quoted: message });
        return;
      }

      await sock.sendMessage(chatId, {
        audio: { url: filePath },
        mimetype: 'audio/mpeg'
      }, { quoted: message });

      fs.unlinkSync(filePath);
    });
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
 
