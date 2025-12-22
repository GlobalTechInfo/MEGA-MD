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

const PMBLOCKER_PATH = './data/pmblocker.json';

function readState() {
    try {
        if (!fs.existsSync(PMBLOCKER_PATH)) {
            return { 
                enabled: false, 
                message: '⚠️ Direct messages are blocked!\nYou cannot DM this bot. Please contact the owner in group chats only.' 
            };
        }
        const raw = fs.readFileSync(PMBLOCKER_PATH, 'utf8');
        const data = JSON.parse(raw || '{}');
        return {
            enabled: !!data.enabled,
            message: typeof data.message === 'string' && data.message.trim() 
                ? data.message 
                : '⚠️ Direct messages are blocked!\nYou cannot DM this bot. Please contact the owner in group chats only.'
        };
    } catch {
        return { 
            enabled: false, 
            message: '⚠️ Direct messages are blocked!\nYou cannot DM this bot. Please contact the owner in group chats only.' 
        };
    }
}

function writeState(enabled, message) {
    try {
        if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data', { recursive: true });
        }
        const current = readState();
        const payload = {
            enabled: !!enabled,
            message: typeof message === 'string' && message.trim() ? message : current.message
        };
        fs.writeFileSync(PMBLOCKER_PATH, JSON.stringify(payload, null, 2));
    } catch (e) {
        console.error('Error writing PM blocker state:', e);
    }
}

module.exports = {
    command: 'pmblocker',
    aliases: ['pmblock', 'blockpm', 'antipm'],
    category: 'owner',
    description: 'Block private messages and auto-block users who DM the bot',
    usage: '.pmblocker <on|off|status|setmsg>',
    ownerOnly: true,

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const state = readState();
        
        const sub = args[0]?.toLowerCase();
        const rest = args.slice(1);

        if (!sub || !['on', 'off', 'status', 'setmsg'].includes(sub)) {
            await sock.sendMessage(chatId, {
                text: `📵 *PM BLOCKER*\n\n` +
                      `*Commands:*\n` +
                      `• \`.pmblocker on\` - Enable DM\n` +
                      `• \`.pmblocker off\` - Disable DM\n` +
                      `• \`.pmblocker status\` - Current status\n` +
                      `• \`.pmblocker setmsg <text>\` - Set warning message\n\n` +
                      `*Current Status:* ${state.enabled ? '✅ ENABLED' : '❌ DISABLED'}`
            }, { quoted: message });
            return;
        }

        if (sub === 'status') {
            await sock.sendMessage(chatId, {
                text: `📵 *PM BLOCKER STATUS*\n\n` +
                      `*Status:* ${state.enabled ? '✅ ENABLED' : '❌ DISABLED'}\n\n` +
                      `*Warning Message:*\n${state.message}`
            }, { quoted: message });
            return;
        }

        if (sub === 'setmsg') {
            const newMsg = rest.join(' ').trim();
            if (!newMsg) {
                await sock.sendMessage(chatId, {
                    text: '*Please provide a message*\n\nUsage: `.pmblocker setmsg <your message>`'
                }, { quoted: message });
                return;
            }
            writeState(state.enabled, newMsg);
            await sock.sendMessage(chatId, {
                text: `✅ *PM blocker message updated!*\n\n*New message:*\n${newMsg}`
            }, { quoted: message });
            return;
        }

        const enable = sub === 'on';
        writeState(enable);
        
        await sock.sendMessage(chatId, {
            text: `📵 *PM Blocker ${enable ? 'ENABLED' : 'DISABLED'}*\n\n` +
                  `${enable ? '✅ Users who DM the bot will be warned and blocked.' : '❌ Private messages are now allowed.'}`
        }, { quoted: message });
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
 