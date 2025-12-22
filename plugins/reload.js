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
  command: 'reload',
  aliases: ['refresh', 'reloadplugins'],
  category: 'owner',
  description: 'Reload all plugins',
  usage: '.reload',
  ownerOnly: true,
  
  async handler(sock, message, args) {
    const chatId = message.key.remoteJid;
    const commandHandler = require('../lib/commandHandler');
    
    try {
      const start = Date.now();
      commandHandler.reloadCommands();
      const end = Date.now();
      
      await sock.sendMessage(chatId, {
        text: `✅ Reloaded ${commandHandler.commands.size} commands in ${end - start}ms`
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
 
