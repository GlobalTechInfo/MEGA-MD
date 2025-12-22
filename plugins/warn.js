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

const databaseDir = path.join(process.cwd(), 'data');
const warningsPath = path.join(databaseDir, 'warnings.json');

function initializeWarningsFile() {
  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }
  
  if (!fs.existsSync(warningsPath)) {
    fs.writeFileSync(warningsPath, JSON.stringify({}), 'utf8');
  }
}

module.exports = {
  command: 'warn',
  aliases: ['warning'],
  category: 'admin',
  description: 'Warn a user (auto-kick after 3 warnings)',
  usage: '.warn [@user] or reply to message',
  groupOnly: true,
  adminOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, senderId, channelInfo } = context;
    
    try {
      initializeWarningsFile();

      let userToWarn;
      const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      
      if (mentionedJids && mentionedJids.length > 0) {
        userToWarn = mentionedJids[0];
      }
      else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToWarn = message.message.extendedTextMessage.contextInfo.participant;
      }
      
      if (!userToWarn) {
        await sock.sendMessage(chatId, { 
          text: '❌ Error: Please mention the user or reply to their message to warn!',
          ...channelInfo
        }, { quoted: message });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        let warnings = {};
        try {
          warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
        } catch (error) {
          warnings = {};
        }
        
        if (!warnings[chatId]) warnings[chatId] = {};
        if (!warnings[chatId][userToWarn]) warnings[chatId][userToWarn] = 0;
        
        warnings[chatId][userToWarn]++;
        fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

        const warningMessage = `*『 WARNING ALERT 』*\n\n` +
          `👤 *Warned User:* @${userToWarn.split('@')[0]}\n` +
          `⚠️ *Warning Count:* ${warnings[chatId][userToWarn]}/3\n` +
          `👑 *Warned By:* @${senderId.split('@')[0]}\n\n` +
          `📅 *Date:* ${new Date().toLocaleString()}`;

        await sock.sendMessage(chatId, { 
          text: warningMessage,
          mentions: [userToWarn, senderId],
          ...channelInfo
        });

        if (warnings[chatId][userToWarn] >= 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));

          await sock.groupParticipantsUpdate(chatId, [userToWarn], "remove");
          delete warnings[chatId][userToWarn];
          fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));
          
          const kickMessage = `*『 AUTO-KICK 』*\n\n` +
            `@${userToWarn.split('@')[0]} has been removed from the group after receiving 3 warnings! ⚠️`;

          await sock.sendMessage(chatId, { 
            text: kickMessage,
            mentions: [userToWarn],
            ...channelInfo
          });
        }
      } catch (error) {
        console.error('Error in warn command:', error);
        await sock.sendMessage(chatId, { 
          text: '❌ Failed to warn user!',
          ...channelInfo
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Error in warn command:', error);
      if (error.data === 429) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          await sock.sendMessage(chatId, { 
            text: '❌ Rate limit reached. Please try again in a few seconds.',
            ...channelInfo
          }, { quoted: message });
        } catch (retryError) {
          console.error('Error sending retry message:', retryError);
        }
      } else {
        try {
          await sock.sendMessage(chatId, { 
            text: '❌ Failed to warn user. Make sure the bot is admin and has sufficient permissions.',
            ...channelInfo
          }, { quoted: message });
        } catch (sendError) {
          console.error('Error sending error message:', sendError);
        }
      }
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
 