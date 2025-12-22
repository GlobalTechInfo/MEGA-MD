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
  command: 'hack',
  aliases: ['fakehack', 'prankhack'],
  category: 'fun',
  description: 'Simulate a hack sequence (fun prank)',
  usage: '.hack <target>',

  /**
   * @param {object} sock - Baileys sock
   * @param {object} message - the original message object
   * @param {Array} args - command arguments
   * @param {object} context - additional context
   */
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const target = args?.[0] || 'target';

    try {
      await sock.sendMessage(chatId, { text: '*💻 Initializing hack sequence...*' }, { quoted: message });
      await delay(1500);

      await sock.sendMessage(chatId, { text: '*🔌 Establishing secure connection to the server...*' }, { quoted: message });
      await delay(1500);

      await sock.sendMessage(chatId, { text: '*🛡 Bypassing firewalls and security protocols...*' }, { quoted: message });
      await displayProgressBar(sock, message, 'Bypassing firewalls', 4, chatId);

      await sock.sendMessage(chatId, { text: '*🔐 Gaining access to encrypted database...*' }, { quoted: message });
      await delay(2000);

      await sock.sendMessage(chatId, { text: '*🔑 Cracking encryption keys...*' }, { quoted: message });
      await displayProgressBar(sock, message, 'Cracking encryption', 6, chatId);

      await sock.sendMessage(chatId, { text: '*📥 Downloading sensitive data from server...*' }, { quoted: message });
      await displayProgressBar(sock, message, 'Downloading files', 5, chatId);

      await sock.sendMessage(chatId, { text: '*🔒 Planting a backdoor for future access...*' }, { quoted: message });
      await delay(2500);

      await sock.sendMessage(chatId, { text: `*💥 Hack complete! 🎯 Target "${target}" successfully compromised.*` }, { quoted: message });
      await delay(1000);

      await sock.sendMessage(chatId, { text: '*🤖 Mission accomplished. Logging off...*' }, { quoted: message });

    } catch (error) {
      console.error('Error in hack sequence:', error);
      await sock.sendMessage(chatId, { text: '*⚠️ An error occurred during the hack sequence. Please try again later.*' }, { quoted: message });
    }
  }
};

/**
 * Helper function: delay for a number of milliseconds
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Display progress bar in chat
 */
async function displayProgressBar(sock, message, taskName, steps, chatId) {
  const progressBarLength = 20;

  for (let i = 1; i <= steps; i++) {
    const progress = Math.round((i / steps) * progressBarLength);
    const bar = '█'.repeat(progress) + '░'.repeat(progressBarLength - progress);
    await sock.sendMessage(chatId, { text: `*${taskName}:* [${bar}]` }, { quoted: message });
    await delay(1000);
  }
}


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
 
