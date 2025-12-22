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
 


const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

function clearDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return { success: false, message: `Directory not found: ${path.basename(dirPath)}` };
    }

    const files = fs.readdirSync(dirPath);
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.lstatSync(filePath);

      if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
      deletedCount++;
    }

    return {
      success: true,
      message: `Cleared ${deletedCount} items in ${path.basename(dirPath)}`,
      count: deletedCount
    };
  } catch (err) {
    console.error('clearDirectory error:', err);
    return {
      success: false,
      message: `Failed clearing ${path.basename(dirPath)}`
    };
  }
}

async function clearTmpDirectory() {
  const tmpDir = path.join(process.cwd(), 'tmp');
  const tempDir = path.join(process.cwd(), 'temp');

  const results = [
    clearDirectory(tmpDir),
    clearDirectory(tempDir)
  ];

  const success = results.every(r => r.success);
  const totalDeleted = results.reduce((a, b) => a + (b.count || 0), 0);
  const message = results.map(r => r.message).join(' | ');

  return { success, message, totalDeleted };
}

module.exports = {
  command: 'cleartmp',
  aliases: ['cleartemp', 'tmpclear'],
  category: 'owner',
  description: 'Clear tmp and temp directories',
  usage: '.cleartmp',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const senderId = message.key.participant || message.key.remoteJid;

    try {
      const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

      if (!message.key.fromMe && !isOwner) {
        await sock.sendMessage(chatId, {
          text: '*This command is only for the owner!*'
        }, { quoted: message });
        return;
      }

      const result = await clearTmpDirectory();

      const text = result.success
        ? `✅ *Temporary Files Cleared!*\n\n${result.message}`
        : `❌ *Clear Failed!*\n\n${result.message}`;

      await sock.sendMessage(chatId, {
        text
      }, { quoted: message });

    } catch (error) {
      console.error('Error in cleartmp command:', error);
      await sock.sendMessage(chatId, {
        text: '❌ Failed to clear temporary files!'
      }, { quoted: message });
    }
  }
};

function startAutoClear() {
  clearTmpDirectory();
  setInterval(clearTmpDirectory, 1 * 60 * 60 * 1000);
}

startAutoClear();


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
 
