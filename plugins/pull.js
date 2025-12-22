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
 

const simpleGit = require('simple-git');

module.exports = {
  command: 'gitpull',
  aliases: ['refresh', 'pull'],
  category: 'owner',
  description: 'Reload all plugins (Pull changes from git if available)',
  usage: '.gitpull',
  ownerOnly: true,

  async handler(sock, message) {
    const chatId = message.key.remoteJid;
    const commandHandler = require('../lib/commandHandler');
    const git = simpleGit();

    const start = Date.now();
    let gitStatus = 'Local reload only';

    try {
      const isRepo = await git.checkIsRepo();

      if (isRepo) {
        const remotes = await git.getRemotes(true);

        if (remotes.some(r => r.name === 'origin')) {
          await git.pull();
          gitStatus = 'Pulled from git remote';
        }
      }
    } catch (err) {
      gitStatus = 'Git unavailable, used local files';
    }

    try {
      commandHandler.reloadCommands();

      const end = Date.now();

      await sock.sendMessage(chatId, {
        text:
          `✅ Reload complete\n` +
          `🔄 Mode: ${gitStatus}\n` +
          `📦 Plugins: ${commandHandler.commands.size}\n` +
          `⏱ Time: ${end - start}ms`
      });
    } catch (error) {
      await sock.sendMessage(chatId, {
        text: `❌ Reload failed: ${error.message}`
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
 