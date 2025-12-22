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
    command: 'kick',
    aliases: ['remove', 'fire'],
    category: 'admin',
    description: 'Remove user(s) from the group',
    usage: '.kick @user or reply to message',
    groupOnly: true,
    adminOnly: true,

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const isBotAdmin = context.isBotAdmin;

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { 
                text: '❌ *Please make the bot an admin first*' 
            }, { quoted: message });
            return;
        }

        let usersToKick = [];
        const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (mentionedJids && mentionedJids.length > 0) {
            usersToKick = mentionedJids;
        }
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            usersToKick = [message.message.extendedTextMessage.contextInfo.participant];
        }
        
        if (usersToKick.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ *Please mention a user or reply to their message*\n\nUsage: `.kick @user` or reply with `.kick`'
            }, { quoted: message });
            return;
        }

        const botId = sock.user?.id || '';
        const botLid = sock.user?.lid || '';
        const botPhoneNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
        const botIdFormatted = botPhoneNumber + '@s.whatsapp.net';
        
        const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);
        const botLidWithoutSuffix = botLid.includes('@') ? botLid.split('@')[0] : botLid;

        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants || [];

        const isTryingToKickBot = usersToKick.some(userId => {
            const userPhoneNumber = userId.includes(':') ? userId.split(':')[0] : (userId.includes('@') ? userId.split('@')[0] : userId);
            const userLidNumeric = userId.includes('@lid') ? userId.split('@')[0].split(':')[0] : '';
            
            const directMatch = (
                userId === botId ||
                userId === botLid ||
                userId === botIdFormatted ||
                userPhoneNumber === botPhoneNumber ||
                (userLidNumeric && botLidNumeric && userLidNumeric === botLidNumeric)
            );
            
            if (directMatch) {
                return true;
            }
            
            const participantMatch = participants.some(p => {
                const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
                const pId = p.id ? p.id.split('@')[0] : '';
                const pLid = p.lid ? p.lid.split('@')[0] : '';
                const pFullId = p.id || '';
                const pFullLid = p.lid || '';
                
                const pLidNumeric = pLid.includes(':') ? pLid.split(':')[0] : pLid;
                
                const isThisParticipantBot = (
                    pFullId === botId ||
                    pFullLid === botLid ||
                    pLidNumeric === botLidNumeric ||
                    pPhoneNumber === botPhoneNumber ||
                    pId === botPhoneNumber ||
                    p.phoneNumber === botIdFormatted ||
                    (botLid && pLid && botLidWithoutSuffix === pLid)
                );
                
                if (isThisParticipantBot) {
                    return (
                        userId === pFullId ||
                        userId === pFullLid ||
                        userPhoneNumber === pPhoneNumber ||
                        userPhoneNumber === pId ||
                        userId === p.phoneNumber ||
                        (pLid && userLidNumeric && userLidNumeric === pLidNumeric) ||
                        (userLidNumeric && pLidNumeric && userLidNumeric === pLidNumeric)
                    );
                }
                return false;
            });
            
            return participantMatch;
        });

        if (isTryingToKickBot) {
            await sock.sendMessage(chatId, { 
                text: "❌ *I can't kick myself* 🤖"
            }, { quoted: message });
            return;
        }

        try {
            await sock.groupParticipantsUpdate(chatId, usersToKick, "remove");
            
            const usernames = await Promise.all(usersToKick.map(async jid => {
                return `@${jid.split('@')[0]}`;
            }));
            
            await sock.sendMessage(chatId, { 
                text: `🚫 *User${usersToKick.length > 1 ? 's' : ''} Removed*\n\n${usernames.join(', ')} has been kicked from the group!`,
                mentions: usersToKick
            }, { quoted: message });
        } catch (error) {
            console.error('Error in kick command:', error);
            await sock.sendMessage(chatId, { 
                text: '❌ *Failed to kick user(s)*\n\nMake sure the bot has sufficient permissions.'
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
 