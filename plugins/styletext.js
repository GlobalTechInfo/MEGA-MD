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
 

const Qasim = require('api-qasim');

module.exports = {
  command: 'stext',
  aliases: ['fancytext', 'textstyle', 'styletext'],
  category: 'menu',
  description: 'Style text in different fancy formats',
  usage: '.stext <text>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const text = args.join(' ');
    try {
      if (!text || text.trim() === '') {
        await sock.sendMessage(chatId, { 
          text: "*Please provide a text to style.*\nExample: .stext Hello" 
        }, { quoted: message });
        return;
      }
      const styledResult = await Qasim.styletext(text);

      if (!Array.isArray(styledResult) || styledResult.length === 0) {
        throw new Error('No styled text found.');
      }
      let messageText = 'Reply with choosen number:\n\n';
      styledResult.forEach((item, index) => {
        const styledText = item.result || item;
        messageText += `*${index + 1}.* ${styledText}\n`;
      });

      const sentMsg = await sock.sendMessage(chatId, {
        text: messageText
      }, { quoted: message });

      sock.styletext = sock.styletext || {};
      sock.styletext[sentMsg.key.id] = styledResult;

      const listener = async ({ messages }) => {
        const m = messages[0];
        if (!m.message || !m.key || !m.key.remoteJid) return;
        if (m.key.remoteJid !== chatId) return;

        let isQuoted = false;
        if (m.message.extendedTextMessage &&
            m.message.extendedTextMessage.contextInfo &&
            m.message.extendedTextMessage.contextInfo.quotedMessage) {
          const quotedId = m.message.extendedTextMessage.contextInfo.stanzaId 
            || m.message.extendedTextMessage.contextInfo.quotedMessageKey?.id;
          if (quotedId === sentMsg.key.id) isQuoted = true;
        }

        let userReply = m.message.conversation || '';
        if (m.message.extendedTextMessage && m.message.extendedTextMessage.text) 
          userReply = m.message.extendedTextMessage.text;

        if (!userReply) return;
        if (!isQuoted && m.message.conversation !== sentMsg.key.id) return;

        const choice = parseInt(userReply.trim());
        if (!isNaN(choice) && choice >= 1 && choice <= styledResult.length) {
          const selectedText = styledResult[choice - 1].result || styledResult[choice - 1];
          await sock.sendMessage(m.key.remoteJid, { text: selectedText }, { quoted: m });
          delete sock.styletext[sentMsg.key.id];
          sock.ev.off('messages.upsert', listener);
        } else {
          await sock.sendMessage(m.key.remoteJid, { 
            text: `Invalid selection. Please choose a number between 1 and ${styledResult.length}.` 
          }, { quoted: m });
        }
      };

      sock.ev.on('messages.upsert', listener);

    } catch (error) {
      console.error('Error in styleTextCommand:', error);
      await sock.sendMessage(chatId, { 
        text: '❌ Failed to style the text. Please try again later.' 
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
 
