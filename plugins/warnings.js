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

const warningsFilePath = path.join(__dirname, '../data/warnings.json');

function loadWarnings() {
  if (!fs.existsSync(warningsFilePath)) {
    fs.writeFileSync(warningsFilePath, JSON.stringify({}), 'utf8');
  }
  const data = fs.readFileSync(warningsFilePath, 'utf8');
  return JSON.parse(data);
}

module.exports = {
  command: 'warnings',
  aliases: ['checkwarn', 'warncount'],
  category: 'group',
  description: 'Check warning count of a user',
  usage: '.warnings [@user]',
  groupOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    const mentionedJidList = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentionedJidList.length === 0) {
      await sock.sendMessage(chatId, { 
        text: 'Please mention a user to check warnings.',
        ...channelInfo
      }, { quoted: message });
      return;
    }

    const userToCheck = mentionedJidList[0];
    const warnings = loadWarnings();
    const warningCount = (warnings[chatId] && warnings[chatId][userToCheck]) || 0;

    await sock.sendMessage(chatId, { 
      text: `@${userToCheck.split('@')[0]} has ${warningCount} warning(s).`,
      mentions: [userToCheck],
      ...channelInfo
    }, { quoted: message });
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
 
