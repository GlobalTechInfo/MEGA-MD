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
 

const { isAdmin } = require('../lib/isAdmin');

async function handlePromotionEvent(sock, groupId, participants, author) {
  try {
    if (!Array.isArray(participants) || participants.length === 0) {
      return;
    }
    
    const promotedUsernames = await Promise.all(participants.map(async jid => {
      const jidString = typeof jid === 'string' ? jid : (jid.id || jid.toString());
      return `@${jidString.split('@')[0]} `;
    }));

    let promotedBy;
    let mentionList = participants.map(jid => {
      return typeof jid === 'string' ? jid : (jid.id || jid.toString());
    });

    if (author && author.length > 0) {
      const authorJid = typeof author === 'string' ? author : (author.id || author.toString());
      promotedBy = `@${authorJid.split('@')[0]}`;
      mentionList.push(authorJid);
    } else {
      promotedBy = 'System';
    }

    const promotionMessage = `*『 GROUP PROMOTION 』*\n\n` +
      `👥 *Promoted User${participants.length > 1 ? 's' : ''}:*\n` +
      `${promotedUsernames.map(name => `• ${name}`).join('\n')}\n\n` +
      `👑 *Promoted By:* ${promotedBy}\n\n` +
      `📅 *Date:* ${new Date().toLocaleString()}`;
    
    await sock.sendMessage(groupId, {
      text: promotionMessage,
      mentions: mentionList
    });
  } catch (error) {
    console.error('Error handling promotion event:', error);
  }
}

module.exports = {
  command: 'promote',
  aliases: ['admin'],
  category: 'admin',
  description: 'Promote user(s) to admin',
  usage: '.promote [@user] or reply to message',
  groupOnly: true,
  adminOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    let userToPromote = [];
    const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    
    if (mentionedJids && mentionedJids.length > 0) {
      userToPromote = mentionedJids;
    }
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
      userToPromote = [message.message.extendedTextMessage.contextInfo.participant];
    }
    
    if (userToPromote.length === 0) {
      await sock.sendMessage(chatId, { 
        text: 'Please mention the user or reply to their message to promote!',
        ...channelInfo
      }, { quoted: message });
      return;
    }

    try {
      await sock.groupParticipantsUpdate(chatId, userToPromote, "promote");

      const usernames = await Promise.all(userToPromote.map(async jid => {
        return `@${jid.split('@')[0]}`;
      }));
      
      const promoterJid = sock.user.id;
      
      const promotionMessage = `*『 GROUP PROMOTION 』*\n\n` +
        `👥 *Promoted User${userToPromote.length > 1 ? 's' : ''}:*\n` +
        `${usernames.map(name => `• ${name}`).join('\n')}\n\n` +
        `👑 *Promoted By:* @${promoterJid.split('@')[0]}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`;
        
      await sock.sendMessage(chatId, { 
        text: promotionMessage,
        mentions: [...userToPromote, promoterJid],
        ...channelInfo
      });
    } catch (error) {
      console.error('Error in promote command:', error);
      await sock.sendMessage(chatId, { 
        text: 'Failed to promote user(s)!',
        ...channelInfo
      }, { quoted: message });
    }
  },
  
  handlePromotionEvent
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
 