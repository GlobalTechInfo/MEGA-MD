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

module.exports = {
  command: 'apkmirror',
  aliases: ['apkmi', 'mirrorapk'],
  category: 'apks',
  description: 'Search APKs from APKMirror and download by reply',
  usage: '.apkmirror <apk_name>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args.join(' ').trim();

    try {
      if (!query) return await sock.sendMessage(chatId, { text: '*Please provide an app name.*\nExample: .apkmirror Telegram' }, { quoted: message });

      await sock.sendMessage(chatId, { text: '🔎 Searching APKMirror...' }, { quoted: message });

      const searchUrl = `https://discardapi.dpdns.org/api/apk/search/apkmirror?apikey=guru&query=${encodeURIComponent(query)}`;
      const searchRes = await axios.get(searchUrl);

      const results = searchRes.data?.result;
      if (!Array.isArray(results) || results.length === 0)
        return await sock.sendMessage(chatId, { text: '❌ No results found.' }, { quoted: message });

      let caption = `📦 *APKMirror Results for:* *${query}*\n\n↩️ *Reply with a number to download*\n\n`;
      results.forEach((v, i) => {
        caption += `*${i + 1}.* ${v.title}\n👨‍💻 ${v.developer}\n📦 ${v.size}\n🕒 ${v.updated}\n🔗 ${v.url}\n\n`;
      });

      const sentMsg = await sock.sendMessage(chatId, { text: caption }, { quoted: message });

      const timeout = setTimeout(async () => {
        sock.ev.off('messages.upsert', listener);
        await sock.sendMessage(chatId, { text: '⌛ Selection expired. Please search again.' }, { quoted: sentMsg });
      }, 3 * 60 * 1000);

      const listener = async ({ messages }) => {
        const m = messages[0];
        if (!m?.message || m.key.remoteJid !== chatId) return;

        const ctx = m.message?.extendedTextMessage?.contextInfo;
        if (!ctx?.stanzaId || ctx.stanzaId !== sentMsg.key.id) return;

        const replyText = m.message.conversation || m.message.extendedTextMessage?.text || '';
        const choice = parseInt(replyText.trim());
        if (isNaN(choice) || choice < 1 || choice > results.length)
          return await sock.sendMessage(chatId, { text: `❌ Invalid choice. Pick 1-${results.length}.` }, { quoted: m });

        clearTimeout(timeout);
        sock.ev.off('messages.upsert', listener);

        const selected = results[choice - 1];
        await sock.sendMessage(chatId, { text: `⬇️ Downloading *${selected.title}*...\n⏳ Please wait...` }, { quoted: m });

        const dlUrl = `https://discardapi.dpdns.org/api/apk/dl/apkmirror?apikey=guru&url=${encodeURIComponent(selected.url)}`;
        const dlRes = await axios.get(dlUrl);

        const apk = dlRes.data?.result;
        if (!apk) return await sock.sendMessage(chatId, { text: '❌ Failed to fetch APK details.' }, { quoted: m });

        const info =
          `📦 *APK Download Info*\n\n` +
          `📛 Name: ${apk.name}\n` +
          `📦 Size: ${apk.size}\n` +
          `📥 Downloads: ${apk.downloads}\n` +
          `📦 Package: ${apk.package}\n` +
          `📅 Uploaded: ${apk.uploaded}\n` +
          `🔢 Version: ${apk.version}`;

        await sock.sendMessage(chatId, { image: { url: apk.icon }, caption: info }, { quoted: m });
      };

      sock.ev.on('messages.upsert', listener);

    } catch (err) {
      console.error('❌ APKMirror Plugin Error:', err);
      await sock.sendMessage(chatId, { text: '❌ Failed to process request.' }, { quoted: message });
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
   
