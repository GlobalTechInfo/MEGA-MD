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
  command: 'gitclone2',
  aliases: ['githubdl2', 'clone2'],
  category: 'download',
  description: 'Download a GitHub repository as a ZIP file',
  usage: '.gitclone2 <github-link>',

  async handler(sock, message, args, context = {}) {
    const { chatId } = context;
    const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

    try {
      const link = args[0];

      if (!link) {
        return await sock.sendMessage(chatId, { 
          text: `❌ *Missing Link!*\n\nExample: .gitclone2 https://github.com/GlobalTechInfo/MEGA-MD` 
        }, { quoted: message });
      }

      if (!regex.test(link)) {
        return await sock.sendMessage(chatId, { text: '⚠️ *Invalid GitHub link!*' }, { quoted: message });
      }

      let [_, user, repo] = link.match(regex) || [];
      repo = repo.replace(/.git$/, '');
      
      const url = `https://api.github.com/repos/${user}/${repo}/zipball`;

      const response = require('axios').head;
      const headRes = await axios.head(url);
      const contentDisposition = headRes.headers['content-disposition'];
      
      let filename = `${repo}.zip`;
      if (contentDisposition) {
        const match = contentDisposition.match(/attachment; filename=(.*)/);
        if (match) filename = match[1];
      }

      await sock.sendMessage(chatId, { text: `✳️ *Wait, sending repository...*` }, { quoted: message });

      await sock.sendMessage(chatId, {
        document: { url: url },
        fileName: filename,
        mimetype: 'application/zip',
        caption: `📦 *Repository:* ${user}/${repo}\n✨ *Cloned by MEGA-MD*`
      }, { quoted: message });

    } catch (err) {
      console.error('Gitclone Error:', err);
      await sock.sendMessage(chatId, { text: '❌ *Failed to download the repository.* Make sure it is public.' }, { quoted: message });
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
 