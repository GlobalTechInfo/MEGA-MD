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
 


const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const filePath = path.join(__dirname, '../temp/', `${Date.now()}.${mediaType}`);
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

module.exports = {
    command: 'hidetag',
    aliases: ['ht', 'htag'],
    category: 'admin',
    description: 'Tag all non-admin members without showing their names',
    usage: '.hidetag <message> or reply to message',
    groupOnly: true,
    adminOnly: true,

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const isBotAdmin = context.isBotAdmin;
        const rawText = context.rawText || '';
        const messageText = rawText.slice(8).trim();

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { 
                text: '❌ *Please make the bot an admin first*' 
            }, { quoted: message });
            return;
        }

        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants || [];
        const nonAdmins = participants.filter(p => !p.admin).map(p => p.id);

        const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (replyMessage) {
            let content = {};
            
            if (replyMessage.imageMessage) {
                const filePath = await downloadMediaMessage(replyMessage.imageMessage, 'image');
                content = { 
                    image: { url: filePath }, 
                    caption: messageText || replyMessage.imageMessage.caption || '', 
                    mentions: nonAdmins 
                };
            } else if (replyMessage.videoMessage) {
                const filePath = await downloadMediaMessage(replyMessage.videoMessage, 'video');
                content = { 
                    video: { url: filePath }, 
                    caption: messageText || replyMessage.videoMessage.caption || '', 
                    mentions: nonAdmins 
                };
            } else if (replyMessage.conversation || replyMessage.extendedTextMessage) {
                content = { 
                    text: replyMessage.conversation || replyMessage.extendedTextMessage.text, 
                    mentions: nonAdmins 
                };
            } else if (replyMessage.documentMessage) {
                const filePath = await downloadMediaMessage(replyMessage.documentMessage, 'document');
                content = { 
                    document: { url: filePath }, 
                    fileName: replyMessage.documentMessage.fileName, 
                    caption: messageText || '', 
                    mentions: nonAdmins 
                };
            }

            if (Object.keys(content).length > 0) {
                await sock.sendMessage(chatId, content);
            }
        } else {
            await sock.sendMessage(chatId, { 
                text: messageText || '📢 *Announcement for all members*', 
                mentions: nonAdmins 
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
 
