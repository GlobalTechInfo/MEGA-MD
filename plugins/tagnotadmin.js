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
  command: 'tagnotadmin',
  aliases: ['tagmembers', 'tagnon'],
  category: 'admin',
  description: 'Tag all non-admin members in the group',
  usage: '.tagnotadmin',
  groupOnly: true,
  adminOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    try {
      const groupMetadata = await sock.groupMetadata(chatId);
      const participants = groupMetadata.participants || [];

      const nonAdmins = participants.filter(p => !p.admin).map(p => p.id);
      
      if (nonAdmins.length === 0) {
        await sock.sendMessage(chatId, { 
          text: 'No non-admin members to tag.',
          ...channelInfo
        }, { quoted: message });
        return;
      }

      let text = '🔊 *Hello Everyone:*\n\n';
      nonAdmins.forEach(jid => {
        text += `@${jid.split('@')[0]}\n`;
      });

      await sock.sendMessage(chatId, { 
        text, 
        mentions: nonAdmins,
        ...channelInfo
      }, { quoted: message });
      
    } catch (error) {
      console.error('Error in tagnotadmin command:', error);
      await sock.sendMessage(chatId, { 
        text: 'Failed to tag non-admin members.',
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
 
