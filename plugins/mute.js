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
  command: 'mute',
  aliases: ['silence'],
  category: 'admin',
  description: 'Mute the group for a specified duration',
  usage: '.mute [duration in minutes]',
  groupOnly: true,
  adminOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    const durationInMinutes = args[0] ? parseInt(args[0]) : undefined;

    try {
      await sock.groupSettingUpdate(chatId, 'announcement');
      
      if (durationInMinutes !== undefined && durationInMinutes > 0) {
        const durationInMilliseconds = durationInMinutes * 60 * 1000;
        await sock.sendMessage(chatId, { 
          text: `The group has been muted for ${durationInMinutes} minutes.`,
          ...channelInfo 
        }, { quoted: message });
        
        setTimeout(async () => {
          try {
            await sock.groupSettingUpdate(chatId, 'not_announcement');
            await sock.sendMessage(chatId, { 
              text: 'The group has been unmuted.',
              ...channelInfo 
            });
          } catch (unmuteError) {
            console.error('Error unmuting group:', unmuteError);
          }
        }, durationInMilliseconds);
      } else {
        await sock.sendMessage(chatId, { 
          text: 'The group has been muted.',
          ...channelInfo 
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Error muting/unmuting the group:', error);
      await sock.sendMessage(chatId, { 
        text: 'An error occurred while muting/unmuting the group. Please try again.',
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
 