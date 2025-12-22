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

module.exports = {
  command: 'qmaker',
  aliases: ['qmkr', 'quozio'],
  category: 'tools',
  description: 'Create a quote image from text or replied message',
  usage: '.qmaker <text> or reply to a message',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    let text = args?.join(' ')?.trim();

    try {
      if (!text) {
        const quotedText = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
        if (!quotedText) {
          return await sock.sendMessage(chatId, { text: '*Provide text or reply to a message to create a quote.*' }, { quoted: message });
        }
        text = quotedText;
      }

      const author = message.pushName || message?.key?.participant || 'Anonymous';

      const createRes = await fetch('https://quozio.com/api/v1/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author,
          quote: text
        })
      });

      const quoteData = await createRes.json();
      if (!quoteData?.quoteId) throw new Error('Quote creation failed');

      const quoteId = quoteData.quoteId;

      const templatesRes = await fetch('https://quozio.com/api/v1/templates');
      const templatesData = await templatesRes.json();
      const templates = templatesData.data;

      if (!templates?.length) throw new Error('No templates found');

      const template = templates[Math.floor(Math.random() * templates.length)];

      const imageRes = await fetch(
        `https://quozio.com/api/v1/quotes/${quoteId}/imageUrls?templateId=${template.templateId}`
      );
      const imageData = await imageRes.json();

      if (!imageData?.medium) throw new Error('Image generation failed');

      await sock.sendMessage(chatId, { image: { url: imageData.medium }, caption: `📝 Quote Created\n\nAuthor: ${author}\n\n${text}` }, { quoted: message });

    } catch (error) {
      console.error('Quote plugin error:', error);
      await sock.sendMessage(chatId, { text: '❌ Failed to create quote. Try again later.' }, { quoted: message });
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
 

