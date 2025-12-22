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

const ANTICALL_PATH = './data/anticall.json';
function readState() {
  try {
    if (!fs.existsSync(ANTICALL_PATH)) return { enabled: false };
    const raw = fs.readFileSync(ANTICALL_PATH, 'utf8');
    const data = JSON.parse(raw || '{}');
    return { enabled: !!data.enabled };
  } catch {
    return { enabled: false };
  }
}

function writeState(enabled) {
  try {
    if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync(ANTICALL_PATH, JSON.stringify({ enabled: !!enabled }, null, 2));
  } catch (e) {
    console.error('Error writing anticall state:', e);
  }
}

module.exports = {
  command: 'anticall',
  aliases: ['acall', 'callblock'],
  category: 'owner',
  description: 'Enable or disable auto-blocking of incoming calls',
  usage: '.anticall <on|off|status>',
  ownerOnly: true,
  
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const state = readState();
    const sub = args.join(' ').trim().toLowerCase();

    if (!sub || !['on', 'off', 'status'].includes(sub)) {
      return await sock.sendMessage(
        chatId,
        {
          text: '*ANTICALL SETTINGS*\n\n' +
                '📵 Auto-block incoming calls\n\n' +
                '*Usage:*\n' +
                '• `.anticall on` - Enable\n' +
                '• `.anticall off` - Disable\n' +
                '• `.anticall status` - Current status\n\n' +
                `*Current Status:* ${state.enabled ? '✅ ENABLED' : '❌ DISABLED'}`
        },
        { quoted: message }
      );
    }
    if (sub === 'status') {
      return await sock.sendMessage(
        chatId,
        { 
          text: `📵 *Anticall Status*\n\n` +
                `Current: ${state.enabled ? '✅ *ENABLED*' : '❌ *DISABLED*'}\n\n` +
                `${state.enabled ? 'All incoming calls will be rejected and blocked.' : 'Incoming calls are allowed.'}`
        },
        { quoted: message }
      );
    }

    const enable = sub === 'on';
    writeState(enable);

    await sock.sendMessage(
      chatId,
      { 
        text: `📵 *Anticall ${enable ? 'ENABLED' : 'DISABLED'}*\n\n` +
              `${enable ? '✅ Incoming calls will now be rejected and blocked automatically.' : '❌ Incoming calls are now allowed.'}`
      },
      { quoted: message }
    );
  },
  
  readState,
  writeState
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
 