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

module.exports = {
  command: 'unban',
  aliases: ['pardon'],
  category: 'admin',
  description: 'Unban a user from using the bot',
  usage: '.unban [@user] or reply to message',
  ownerOnly: false,
  
  async handler(sock, message, args, context) {
    const { chatId, senderId, isGroup, channelInfo, senderIsOwnerOrSudo, isSenderAdmin, isBotAdmin } = context;
    
    if (isGroup) {
      if (!isBotAdmin) {
        await sock.sendMessage(chatId, { 
          text: 'Please make the bot an admin to use .unban', 
          ...channelInfo 
        }, { quoted: message });
        return;
      }
      if (!isSenderAdmin && !message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, { 
          text: 'Only group admins can use .unban', 
          ...channelInfo 
        }, { quoted: message });
        return;
      }
    } else {
      if (!message.key.fromMe && !senderIsOwnerOrSudo) {
        await sock.sendMessage(chatId, { 
          text: 'Only owner/sudo can use .unban in private chat', 
          ...channelInfo 
        }, { quoted: message });
        return;
      }
    }
    
    let userToUnban;
    
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
      userToUnban = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
      userToUnban = message.message.extendedTextMessage.contextInfo.participant;
    }
    
    if (!userToUnban) {
      await sock.sendMessage(chatId, { 
        text: 'Please mention the user or reply to their message to unban!', 
        ...channelInfo 
      }, { quoted: message });
      return;
    }

    try {
      const bannedUsers = JSON.parse(fs.readFileSync('./data/banned.json'));
      const index = bannedUsers.indexOf(userToUnban);
      
      if (index > -1) {
        bannedUsers.splice(index, 1);
        fs.writeFileSync('./data/banned.json', JSON.stringify(bannedUsers, null, 2));
        
        await sock.sendMessage(chatId, { 
          text: `✅ Successfully unbanned @${userToUnban.split('@')[0]}!`,
          mentions: [userToUnban],
          ...channelInfo 
        }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { 
          text: `@${userToUnban.split('@')[0]} is not banned!`,
          mentions: [userToUnban],
          ...channelInfo 
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Error in unban command:', error);
      await sock.sendMessage(chatId, { 
        text: 'Failed to unban user!', 
        ...channelInfo 
      }, { quoted: message });
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
 
