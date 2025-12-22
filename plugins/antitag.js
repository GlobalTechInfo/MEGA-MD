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
 


const { setAntitag, getAntitag, removeAntitag } = require('../lib/index');

async function handleTagDetection(sock, chatId, message, senderId) {
    try {
        const antitagSetting = await getAntitag(chatId, 'on');
        if (!antitagSetting || !antitagSetting.enabled) return;

        const mentionedJids = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        const messageText = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption ||
            ''
        );

        const textMentions = messageText.match(/@[\d+\s\-()~.]+/g) || [];
        const numericMentions = messageText.match(/@\d{10,}/g) || [];
        const allMentions = [...new Set([...mentionedJids, ...textMentions, ...numericMentions])];
        
        const uniqueNumericMentions = new Set();
        numericMentions.forEach(mention => {
            const numMatch = mention.match(/@(\d+)/);
            if (numMatch) uniqueNumericMentions.add(numMatch[1]);
        });
        
        const mentionedJidCount = mentionedJids.length;
        const numericMentionCount = uniqueNumericMentions.size;
        const totalMentions = Math.max(mentionedJidCount, numericMentionCount);

        if (totalMentions >= 3) {
            const groupMetadata = await sock.groupMetadata(chatId);
            const participants = groupMetadata.participants || [];
            const mentionThreshold = Math.ceil(participants.length * 0.5);
            
            const hasManyNumericMentions = numericMentionCount >= 10 || 
                                          (numericMentionCount >= 5 && numericMentionCount >= mentionThreshold);
            
            if (totalMentions >= mentionThreshold || hasManyNumericMentions) {
                const action = antitagSetting.action || 'delete';
                
                if (action === 'delete') {
                    await sock.sendMessage(chatId, {
                        delete: {
                            remoteJid: chatId,
                            fromMe: false,
                            id: message.key.id,
                            participant: senderId
                        }
                    });
                    
                    await sock.sendMessage(chatId, {
                        text: `⚠️ *Tagall Detected!*\n\n@${senderId.split('@')[0]}, tagging all members is not allowed.`,
                        mentions: [senderId]
                    });
                    
                } else if (action === 'kick') {
                    await sock.sendMessage(chatId, {
                        delete: {
                            remoteJid: chatId,
                            fromMe: false,
                            id: message.key.id,
                            participant: senderId
                        }
                    });

                    try {
                        await sock.groupParticipantsUpdate(chatId, [senderId], "remove");
                        await sock.sendMessage(chatId, {
                            text: `🚫 *Antitag Action!*\n\n@${senderId.split('@')[0]} has been removed for tagging all members.`,
                            mentions: [senderId]
                        });
                    } catch (error) {
                        await sock.sendMessage(chatId, {
                            text: `⚠️ Failed to remove user. Make sure the bot is an admin.`
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in tag detection:', error);
    }
}

module.exports = {
    command: 'antitag',
    aliases: ['at', 'tagblock'],
    category: 'admin',
    description: 'Prevent users from tagging all members',
    usage: '.antitag <on|off|set>',
    groupOnly: true,
    adminOnly: true,

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const action = args[0]?.toLowerCase();

        if (!action) {
            const config = await getAntitag(chatId, 'on');
            await sock.sendMessage(chatId, {
                text: `*🏷️ ANTITAG SETUP*\n\n` +
                      `*Current Status:* ${config?.enabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                      `*Current Action:* ${config?.action || 'Not set'}\n\n` +
                      `*Commands:*\n` +
                      `• \`.antitag on\` - Enable\n` +
                      `• \`.antitag off\` - Disable\n` +
                      `• \`.antitag set delete\` - Delete tagall messages\n` +
                      `• \`.antitag set kick\` - Kick users who tagall\n\n` +
                      `*Detection:*\n` +
                      `• Detects mentions of 50%+ members\n` +
                      `• Catches bot tagall patterns\n` +
                      `• Protects against spam tagging`
            }, { quoted: message });
            return;
        }

        switch (action) {
            case 'on':
                const existingConfig = await getAntitag(chatId, 'on');
                if (existingConfig?.enabled) {
                    await sock.sendMessage(chatId, {
                        text: '⚠️ *Antitag is already enabled*'
                    }, { quoted: message });
                    return;
                }
                const result = await setAntitag(chatId, 'on', 'delete');
                await sock.sendMessage(chatId, {
                    text: result 
                        ? '✅ *Antitag enabled successfully!*\n\nDefault action: Delete tagall messages' 
                        : '❌ *Failed to enable antitag*'
                }, { quoted: message });
                break;

            case 'off':
                await removeAntitag(chatId, 'on');
                await sock.sendMessage(chatId, {
                    text: '❌ *Antitag disabled*\n\nUsers can now tag all members.'
                }, { quoted: message });
                break;

            case 'set':
                if (args.length < 2) {
                    await sock.sendMessage(chatId, {
                        text: '❌ *Please specify an action*\n\nUsage: `.antitag set delete | kick`'
                    }, { quoted: message });
                    return;
                }
                const setAction = args[1].toLowerCase();
                if (!['delete', 'kick'].includes(setAction)) {
                    await sock.sendMessage(chatId, {
                        text: '❌ *Invalid action*\n\nChoose: delete or kick'
                    }, { quoted: message });
                    return;
                }
                const setResult = await setAntitag(chatId, 'on', setAction);
                
                const actionDescriptions = {
                    delete: 'Delete tagall messages and warn users',
                    kick: 'Delete messages and remove users from group'
                };
                
                await sock.sendMessage(chatId, {
                    text: setResult 
                        ? `✅ *Antitag action set to: ${setAction}*\n\n${actionDescriptions[setAction]}`
                        : '❌ *Failed to set antitag action*'
                }, { quoted: message });
                break;

            case 'status':
            case 'get':
                const status = await getAntitag(chatId, 'on');
                await sock.sendMessage(chatId, {
                    text: `*🏷️ ANTITAG STATUS*\n\n` +
                          `*Status:* ${status?.enabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                          `*Action:* ${status?.action || 'Not set'}\n\n` +
                          `*What happens when tagall is detected:*\n` +
                          `${status?.action === 'delete' ? '• Message is deleted\n• User gets warning' : ''}` +
                          `${status?.action === 'kick' ? '• Message is deleted\n• User is removed from group' : ''}\n\n` +
                          `*Detection threshold:* 50% of group members or 10+ mentions`
                }, { quoted: message });
                break;

            default:
                await sock.sendMessage(chatId, {
                    text: '❌ *Invalid command*\n\nUse `.antitag` to see available options.'
                }, { quoted: message });
        }
    },

    handleTagDetection
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
 