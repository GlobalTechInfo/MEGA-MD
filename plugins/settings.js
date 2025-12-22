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
const isOwnerOrSudo = require('../lib/isOwner');
const store = require('../lib/lightweight_store');

function readJsonSafe(path, fallback) {
    try {
        const txt = fs.readFileSync(path, 'utf8');
        return JSON.parse(txt);
    } catch (_) {
        return fallback;
    }
}

module.exports = {
    command: 'settings',
    aliases: ['config', 'setting'],
    category: 'owner',
    description: 'Show bot settings and per-group configurations',
    usage: '.settings',
    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;

        try {
            const senderId = message.key.participant || message.key.remoteJid;
            const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

            if (!message.key.fromMe && !isOwner) {
                await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!' }, { quoted: message });
                return;
            }
            
            const isGroup = chatId.endsWith('@g.us');
            const dataDir = './data';

            const isPublic = await store.getPublicMode();
            
            const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, { enabled: false });
            const autoread = readJsonSafe(`${dataDir}/autoread.json`, { enabled: false });
            const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, { enabled: false });
            const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, { enabled: false });
            const anticall = readJsonSafe(`${dataDir}/anticall.json`, { enabled: false });
            const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
                antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
            });
            const autoReaction = Boolean(userGroupData.autoReaction);

            const groupId = isGroup ? chatId : null;
            const antilinkOn = groupId ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId]) : false;
            const antibadwordOn = groupId ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId]) : false;
            const welcomeOn = groupId ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId]) : false;
            const goodbyeOn = groupId ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId]) : false;
            const chatbotOn = groupId ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId]) : false;
            const antitagCfg = groupId ? (userGroupData.antitag && userGroupData.antitag[groupId]) : null;

            const lines = [];
            lines.push('*BOT SETTINGS*\n');
            lines.push(`• Mode: ${isPublic ? 'Public' : 'Private'}`);
            lines.push(`• Auto Status: ${autoStatus.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Autoread: ${autoread.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Autotyping: ${autotyping.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• PM Blocker: ${pmblocker.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Anticall: ${anticall.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Auto Reaction: ${autoReaction ? 'ON' : 'OFF'}`);

            if (groupId) {
                lines.push(`\nGroup: ${groupId}`);
                if (antilinkOn) {
                    const al = userGroupData.antilink[groupId];
                    lines.push(`• Antilink: ON (action: ${al.action || 'delete'})`);
                } else lines.push('• Antilink: OFF');

                if (antibadwordOn) {
                    const ab = userGroupData.antibadword[groupId];
                    lines.push(`• Antibadword: ON (action: ${ab.action || 'delete'})`);
                } else lines.push('• Antibadword: OFF');

                lines.push(`• Welcome: ${welcomeOn ? 'ON' : 'OFF'}`);
                lines.push(`• Goodbye: ${goodbyeOn ? 'ON' : 'OFF'}`);
                lines.push(`• Chatbot: ${chatbotOn ? 'ON' : 'OFF'}`);

                if (antitagCfg && antitagCfg.enabled) {
                    lines.push(`• Antitag: ON (action: ${antitagCfg.action || 'delete'})`);
                } else lines.push('• Antitag: OFF');
            } else {
                lines.push('\nNote: Per-group settings will be shown when used inside a group.');
            }

            await sock.sendMessage(chatId, { text: lines.join('\n') }, { quoted: message });

        } catch (error) {
            console.error('Settings Command Error:', error);
            await sock.sendMessage(chatId, { text: '❌ Failed to read settings.' }, { quoted: message });
        }
    }
};

/*
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');

function readJsonSafe(path, fallback) {
    try {
        const txt = fs.readFileSync(path, 'utf8');
        return JSON.parse(txt);
    } catch (_) {
        return fallback;
    }
}

module.exports = {
    command: 'settings',
    aliases: ['config', 'setting'],
    category: 'owner',
    description: 'Show bot settings and per-group configurations',
    usage: '.settings',
    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;

        try {
            const senderId = message.key.participant || message.key.remoteJid;
            const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

            if (!message.key.fromMe && !isOwner) {
                await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!' }, { quoted: message });
                return;
            }
            const isGroup = chatId.endsWith('@g.us');
            const dataDir = './data';

            const mode = readJsonSafe(`${dataDir}/messageCount.json`, { isPublic: true });
            const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, { enabled: false });
            const autoread = readJsonSafe(`${dataDir}/autoread.json`, { enabled: false });
            const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, { enabled: false });
            const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, { enabled: false });
            const anticall = readJsonSafe(`${dataDir}/anticall.json`, { enabled: false });
            const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
                antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
            });
            const autoReaction = Boolean(userGroupData.autoReaction);

            const groupId = isGroup ? chatId : null;
            const antilinkOn = groupId ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId]) : false;
            const antibadwordOn = groupId ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId]) : false;
            const welcomeOn = groupId ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId]) : false;
            const goodbyeOn = groupId ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId]) : false;
            const chatbotOn = groupId ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId]) : false;
            const antitagCfg = groupId ? (userGroupData.antitag && userGroupData.antitag[groupId]) : null;

            const lines = [];
            lines.push('*BOT SETTINGS*\n');
            lines.push(`• Mode: ${mode.isPublic ? 'Public' : 'Private'}`);
            lines.push(`• Auto Status: ${autoStatus.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Autoread: ${autoread.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Autotyping: ${autotyping.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• PM Blocker: ${pmblocker.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Anticall: ${anticall.enabled ? 'ON' : 'OFF'}`);
            lines.push(`• Auto Reaction: ${autoReaction ? 'ON' : 'OFF'}`);

            if (groupId) {
                lines.push(`\nGroup: ${groupId}`);
                if (antilinkOn) {
                    const al = userGroupData.antilink[groupId];
                    lines.push(`• Antilink: ON (action: ${al.action || 'delete'})`);
                } else lines.push('• Antilink: OFF');

                if (antibadwordOn) {
                    const ab = userGroupData.antibadword[groupId];
                    lines.push(`• Antibadword: ON (action: ${ab.action || 'delete'})`);
                } else lines.push('• Antibadword: OFF');

                lines.push(`• Welcome: ${welcomeOn ? 'ON' : 'OFF'}`);
                lines.push(`• Goodbye: ${goodbyeOn ? 'ON' : 'OFF'}`);
                lines.push(`• Chatbot: ${chatbotOn ? 'ON' : 'OFF'}`);

                if (antitagCfg && antitagCfg.enabled) {
                    lines.push(`• Antitag: ON (action: ${antitagCfg.action || 'delete'})`);
                } else lines.push('• Antitag: OFF');
            } else {
                lines.push('\nNote: Per-group settings will be shown when used inside a group.');
            }

            await sock.sendMessage(chatId, { text: lines.join('\n') }, { quoted: message });

        } catch (error) {
            console.error('Settings Command Error:', error);
            await sock.sendMessage(chatId, { text: '❌ Failed to read settings.' }, { quoted: message });
        }
    }
};
*/

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
 

