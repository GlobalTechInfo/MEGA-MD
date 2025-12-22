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
const { setCommandReactState } = require('../lib/reactions');

const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

function saveCommandReactState(state) {
  const data = fs.existsSync(USER_GROUP_DATA)
    ? JSON.parse(fs.readFileSync(USER_GROUP_DATA))
    : {};
  data.autoReaction = state;
  fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'creact',
  aliases: ['cmdreact'],
  category: 'owner',
  description: 'Toggle command reactions',
  usage: '.creact on/off',
  ownerOnly: true,
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo } = context;
    
    if (!args[0] || !['on', 'off'].includes(args[0])) {
      await sock.sendMessage(chatId, { 
        text: '*Usage:*\n.creact on/off',
        ...channelInfo
      }, { quoted: message });
      return;
    }

    if (args[0] === 'on') {
      setCommandReactState(true);
      saveCommandReactState(true);
      await sock.sendMessage(chatId, { 
        text: '*✅ Command reactions enabled*',
        ...channelInfo
      }, { quoted: message });
    } else if (args[0] === 'off') {
      setCommandReactState(false);
      saveCommandReactState(false);
      await sock.sendMessage(chatId, { 
        text: '*❌ Command reactions disabled*',
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
 
 