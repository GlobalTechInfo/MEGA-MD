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
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'addplugin',
  aliases: ['installplugin', 'install'],
  category: 'owner',
  description: 'Install a plugin from a GitHub Gist URL (owner only)',
  usage: '.addplugin <Gist URL>',

  /**
   * @param {object} sock - Baileys sock
   * @param {object} message - the original message object
   * @param {Array} args - command arguments
   * @param {object} context - additional context
   */
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    const text = args?.[0];
    if (!text) {
      return await sock.sendMessage(chatId, { 
        text: 'Please provide a plugin URL.\nExample: .addplugin https://gist.github.com/username/gistid' 
      }, { quoted: message });
    }

    const gistMatch = text.match(/(?:\/|gist\.github\.com\/)([a-fA-F0-9]+)/);
    if (!gistMatch) {
      return await sock.sendMessage(chatId, { text: '❌ Invalid plugin URL.' }, { quoted: message });
    }

    const gistId = gistMatch[1];
    const gistURL = `https://api.github.com/gists/${gistId}`;

    try {
      const response = await axios.get(gistURL);
      const gistData = response.data;

      if (!gistData || !gistData.files) {
        return await sock.sendMessage(chatId, { text: '❌ No valid files found in the Gist.' }, { quoted: message });
      }

      const pluginDir = path.join(__dirname, '..', 'plugins');

      for (const file of Object.values(gistData.files)) {
        const pluginName = file.filename;
        const pluginPath = path.join(pluginDir, pluginName);

        await fs.promises.writeFile(pluginPath, file.content);
      }

      await sock.sendMessage(chatId, { text: '*✅ Successfully installed plugin from Gist.*' }, { quoted: message });
    } catch (error) {
      console.error('install plugin error:', error);
      await sock.sendMessage(chatId, { text: `❌ Error fetching or saving the plugin: ${error.message}` }, { quoted: message });
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
 

