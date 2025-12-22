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
 


module.exports = {
  command: 'clone',
  aliases: ['githubdl', 'gitclone'],
  category: 'owner',
  description: 'Download a GitHub repository as zip',
  usage: '.clone <url> OR <username> <repo>',

  async handler(sock, message, args) {
    const chatId = message.key.remoteJid;

    if (!args || args.length === 0) {
      return sock.sendMessage(chatId, {
        text: '*🌟 Please provide a GitHub URL or username and repository name.*\n\n*Example usage:*\n\n.clone https://github.com/GlobalTechInfo/MEGA-MD\n\n.clone GlobalTechInfo MEGA-MD'
      });
    }

    let url = '';
    let repoName = '';

    if (args[0].startsWith('http')) {
      const inputUrl = args[0].replace(/\.git$/, '');
      const parts = inputUrl.split('/');
      repoName = parts[parts.length - 1];
      url = inputUrl;
      if (!url.endsWith('/')) url += '/';
      url += 'archive/refs/heads/main.zip';
    } else if (args.length >= 2) {
      const username = args[0];
      const repo = args[1];
      repoName = repo;
      url = `https://github.com/${username}/${repo}/archive/refs/heads/main.zip`;
    } else {
      return sock.sendMessage(chatId, {
        text: '*Missing repository info.*\n\n*Example usage:*\n\n.clone https://github.com/GlobalTechInfo/MEGA-MD\n\n.clone GlobalTechInfo MEGA-MD'
      });
    }

    await sock.sendMessage(chatId, { text: '⏱️ Preparing repository zip...' });

    try {
      await sock.sendMessage(chatId, {
        document: { url },
        fileName: repoName + '.zip',
        mimetype: 'application/zip'
      });
    } catch (e) {
      console.error(e);
      await sock.sendMessage(chatId, {
        text: '❌ Failed to fetch the repository. Please make sure the repository exists and try again.'
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
 
