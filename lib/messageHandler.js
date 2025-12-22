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
const settings = require('../settings');
const store = require('./lightweight_store');
const commandHandler = require('./commandHandler');
const { isBanned } = require('./isBanned');
const { isSudo } = require('./index');
const isOwnerOrSudo = require('./isOwner');
const isAdmin = require('./isAdmin');

const { handleAutoread } = require('../plugins/autoread');
const { handleAutotypingForMessage, showTypingAfterCommand } = require('../plugins/autotyping');
const { storeMessage, handleMessageRevocation } = require('../plugins/antidelete');
const { handleBadwordDetection } = require('./antibadword');
const { Antilink } = require('./antilink');
const { handleTagDetection } = require('../plugins/antitag');
const { handleMentionDetection } = require('../plugins/mention');
const { handleChatbotResponse } = require('../plugins/chatbot');
const { handleTicTacToeMove } = require('../plugins/tictactoe');
const { addCommandReaction } = require('./reactions');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363319098372999@newsletter',
            newsletterName: 'MEGA MD',
            serverMessageId: -1
        }
    }
};

/**
 * Main message handler - handles ALL incoming messages
 */
async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        await handleAutoread(sock, message);

        if (message.message) {
            storeMessage(sock, message);
        }

        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }
        
        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');

        const rawText = 
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption ||
            message.message?.buttonsResponseMessage?.selectedButtonId ||
            '';

        const messageText = rawText.trim();
        const userMessage = messageText.toLowerCase();

        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;

        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            
            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, { 
                    text: '*Join our Channel:*\nhttps://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07' 
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('../plugins/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, { 
                    text: `*Support*\n\nhttps://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07` 
                }, { quoted: message });
                return;
            }
        }

        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: 'You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        if (/^[1-9]$/.test(userMessage) || userMessage === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        if (!message.key.fromMe) {
            await store.incrementMessageCount(chatId, senderId)
        }

        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            await Antilink(message, sock);
        }

        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const { readState: readPmBlockerState } = require('../plugins/pmblocker');
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    await sock.sendMessage(chatId, { 
                        text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' 
                    });
                    await new Promise(r => setTimeout(r, 1500));
                    try { 
                        await sock.updateBlockStatus(chatId, 'block'); 
                    } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        const usedPrefix = settings.prefixes.find(p => userMessage.startsWith(p));

        if (!usedPrefix) {
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);
                
                const botMode = await store.getBotMode()
                const canUseChatbot = botMode === 'public' || 
                                     (botMode === 'groups' && isGroup) || 
                                     (botMode === 'inbox' && !isGroup) ||
                                     isOwnerOrSudoCheck
                
                if (canUseChatbot) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }

        const botMode = await store.getBotMode()
        const isAllowed = (() => {
            if (isOwnerOrSudoCheck) return true
            
            switch (botMode) {
                case 'public':
                    return true
                case 'private':
                case 'self':
                    return false
                case 'groups':
                    return isGroup
                case 'inbox':
                    return !isGroup
                default:
                    return true
            }
        })()

        if (!isAllowed) {
            return
        }

        const originalCommandText = messageText.slice(usedPrefix.length).trim();
        const args = originalCommandText.split(/\s+/).slice(1);
        
        const command = commandHandler.getCommand(userMessage, settings.prefixes);

        if (!command) {
            if (isGroup) {
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);
                
                // Check if chatbot is allowed (same logic as above)
                const canUseChatbot = botMode === 'public' || 
                                     (botMode === 'groups' && isGroup) || 
                                     (botMode === 'inbox' && !isGroup) ||
                                     isOwnerOrSudoCheck
                
                if (canUseChatbot) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }

        console.log(`[${isGroup ? 'GROUP' : 'PRIVATE'}] ${senderId}: ${messageText}`);

        if (command.strictOwnerOnly) {
            const { isOwnerOnly } = require('./isOwner');
            if (!message.key.fromMe && !isOwnerOnly(senderId)) {
                return await sock.sendMessage(chatId, { 
                    text: '❌ This command is only available for the bot owner!\n\n_Sudo users cannot manage other sudo users._',
                    ...channelInfo 
                }, { quoted: message });
            }
        }

        if (command.ownerOnly && !message.key.fromMe && !senderIsOwnerOrSudo) {
            return await sock.sendMessage(chatId, { 
                text: '❌ This command is only available for the owner or sudo users!',
                ...channelInfo 
            }, { quoted: message });
        }

        if (command.groupOnly && !isGroup) {
            return await sock.sendMessage(chatId, { 
                text: 'This command can only be used in groups!',
                ...channelInfo 
            }, { quoted: message });
        }
        
        let isSenderAdmin = false;
        let isBotAdmin = false;

        if (command.adminOnly && isGroup) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                return await sock.sendMessage(chatId, { 
                    text: '❌ Please make the bot an admin to use this command.',
                    ...channelInfo 
                }, { quoted: message });
            }

            if (!isSenderAdmin && !message.key.fromMe && !senderIsOwnerOrSudo) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Sorry, only group admins can use this command.',
                    ...channelInfo
                }, { quoted: message });
            }
        }

        const context = {
            chatId,
            senderId,
            isGroup,
            isSenderAdmin,
            isBotAdmin,
            senderIsOwnerOrSudo,
            isOwnerOrSudoCheck,
            channelInfo,
            rawText,
            userMessage,
            messageText
        };

        try {
            await command.handler(sock, message, args, context);

            await addCommandReaction(sock, message);
            await showTypingAfterCommand(sock, chatId);

        } catch (error) {
            console.error(`Command error [${command.command}]:`, error);
            await sock.sendMessage(chatId, {
                text: `❌ Error executing command: ${error.message}`,
                ...channelInfo
            }, { quoted: message });

            const errorLog = {
                command: command.command,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                user: senderId,
                chat: chatId
            };
            
            try {
                fs.appendFileSync('./error.log', JSON.stringify(errorLog) + '\n');
            } catch (e) {
                console.error('Failed to write error log:', e);
            }
        }

    } catch (error) {
        console.error('Error in message handler:', error.message);
        const chatId = messageUpdate.messages?.[0]?.key?.remoteJid;
        if (chatId) {
            try {
                await sock.sendMessage(chatId, {
                    text: '❌ Failed to process message!',
                    ...channelInfo
                });
            } catch (e) {
                console.error('Failed to send error message:', e);
            }
        }
    }
}

/**
 * Handle group participant updates (join, leave, promote, demote)
 */
async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        if (!id.endsWith('@g.us')) return;

        const botMode = await store.getBotMode()
        const isPublicMode = botMode === 'public' || botMode === 'groups'

        switch (action) {
            case 'promote':
                if (!isPublicMode) return;
                const { handlePromotionEvent } = require('../plugins/promote');
                await handlePromotionEvent(sock, id, participants, author);
                break;

            case 'demote':
                if (!isPublicMode) return;
                const { handleDemotionEvent } = require('../plugins/demote');
                await handleDemotionEvent(sock, id, participants, author);
                break;

            case 'add':
                const { handleJoinEvent } = require('../plugins/welcome');
                await handleJoinEvent(sock, id, participants);
                break;

            case 'remove':
                const { handleLeaveEvent } = require('../plugins/goodbye');
                await handleLeaveEvent(sock, id, participants);
                break;

            default:
                console.log(`Unhandled group action: ${action}`);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

/**
 * Handle status updates (WhatsApp status/stories)
 */
async function handleStatus(sock, status) {
    try {
        const { handleStatusUpdate } = require('../plugins/autostatus');
        await handleStatusUpdate(sock, status);
    } catch (error) {
        console.error('Error in handleStatus:', error);
    }
}

/**
 * Handle incoming calls (anticall feature)
 */
async function handleCall(sock, calls) {
    try {
        const anticallPlugin = require('../plugins/anticall');
        
        const state = anticallPlugin.readState ? anticallPlugin.readState() : { enabled: false };
        
        if (!state.enabled) return;

        const antiCallNotified = new Set();

        for (const call of calls) {
            const callerJid = call.from || call.peerJid || call.chatId;
            if (!callerJid) continue;

            try {
                try {
                    if (typeof sock.rejectCall === 'function' && call.id) {
                        await sock.rejectCall(call.id, callerJid);
                    } else if (typeof sock.sendCallOfferAck === 'function' && call.id) {
                        await sock.sendCallOfferAck(call.id, callerJid, 'reject');
                    }
                } catch (e) {
                    console.error('Error rejecting call:', e);
                }

                if (!antiCallNotified.has(callerJid)) {
                    antiCallNotified.add(callerJid);
                    setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                    
                    await sock.sendMessage(callerJid, { 
                        text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' 
                    });
                }

                setTimeout(async () => {
                    try { 
                        await sock.updateBlockStatus(callerJid, 'block'); 
                    } catch (e) {
                        console.error('Error blocking caller:', e);
                    }
                }, 800);

            } catch (error) {
                console.error('Error handling call from', callerJid, error);
            }
        }
    } catch (error) {
        console.error('Error in handleCall:', error);
    }
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus,
    handleCall
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
 