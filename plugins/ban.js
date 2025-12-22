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

module.exports = {
    command: 'ban',
    aliases: ['block', 'banuser'],
    category: 'group',
    description: 'Ban a user from using the bot',
    usage: '.ban @user or reply to message',

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const channelInfo = context.channelInfo || {};
        const isGroup = context.isGroup;

        let userToBan;
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToBan = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToBan = message.message.extendedTextMessage.contextInfo.participant;
        }
        
        if (!userToBan) {
            await sock.sendMessage(chatId, { 
                text: '❌ *Please mention a user or reply to their message*\n\nUsage: `.ban @user` or reply with `.ban`',
                ...channelInfo 
            }, { quoted: message });
            return;
        }

        try {
            const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            if (userToBan === botId || userToBan === botId.replace('@s.whatsapp.net', '@lid')) {
                await sock.sendMessage(chatId, { 
                    text: '❌ *Cannot ban the bot account*',
                    ...channelInfo 
                }, { quoted: message });
                return;
            }
        } catch (e) {}

        try {
            const bannedFilePath = './data/banned.json';
            let bannedUsers = [];
            
            if (fs.existsSync(bannedFilePath)) {
                bannedUsers = JSON.parse(fs.readFileSync(bannedFilePath));
            } else {
                if (!fs.existsSync('./data')) {
                    fs.mkdirSync('./data', { recursive: true });
                }
            }
            
            if (!bannedUsers.includes(userToBan)) {
                bannedUsers.push(userToBan);
                fs.writeFileSync(bannedFilePath, JSON.stringify(bannedUsers, null, 2));
                
                await sock.sendMessage(chatId, { 
                    text: `🚫 *User Banned Successfully!*\n\n@${userToBan.split('@')[0]} has been banned from using the bot.`,
                    mentions: [userToBan],
                    ...channelInfo 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { 
                    text: `⚠️ *Already Banned*\n\n@${userToBan.split('@')[0]} is already banned!`,
                    mentions: [userToBan],
                    ...channelInfo 
                }, { quoted: message });
            }
        } catch (error) {
            console.error('Error in ban command:', error);
            await sock.sendMessage(chatId, { 
                text: '❌ *Failed to ban user!*\n\nPlease try again.',
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
 