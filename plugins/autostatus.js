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

const configPath = path.join(__dirname, '../data/autoStatus.json');

if (!fs.existsSync(configPath)) {
    if (!fs.existsSync(path.dirname(configPath))) {
        fs.mkdirSync(path.dirname(configPath), { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify({ 
        enabled: false, 
        reactOn: false 
    }, null, 2));
}

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

function readConfig() {
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return {
            enabled: !!config.enabled,
            reactOn: !!config.reactOn
        };
    } catch (error) {
        console.error('Error reading auto status config:', error);
        return { enabled: false, reactOn: false };
    }
}

function writeConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Error writing auto status config:', error);
    }
}

function isAutoStatusEnabled() {
    const config = readConfig();
    return config.enabled;
}

function isStatusReactionEnabled() {
    const config = readConfig();
    return config.reactOn;
}

async function reactToStatus(sock, statusKey) {
    try {
        if (!isStatusReactionEnabled()) {
            return;
        }

        await sock.relayMessage(
            'status@broadcast',
            {
                reactionMessage: {
                    key: {
                        remoteJid: 'status@broadcast',
                        id: statusKey.id,
                        participant: statusKey.participant || statusKey.remoteJid,
                        fromMe: false
                    },
                    text: '💚'
                }
            },
            {
                messageId: statusKey.id,
                statusJidList: [statusKey.remoteJid, statusKey.participant || statusKey.remoteJid]
            }
        );
        
        console.log('✅ Reacted to status');
    } catch (error) {
        console.error('❌ Error reacting to status:', error.message);
    }
}

async function handleStatusUpdate(sock, status) {
    try {
        if (!isAutoStatusEnabled()) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (status.messages && status.messages.length > 0) {
            const msg = status.messages[0];
            if (msg.key && msg.key.remoteJid === 'status@broadcast') {
                try {
                    await sock.readMessages([msg.key]);
                    console.log('✅ Viewed status from messages');
                    
                    await reactToStatus(sock, msg.key);
                } catch (err) {
                    if (err.message?.includes('rate-overlimit')) {
                        console.log('⚠️ Rate limit hit, waiting before retrying...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await sock.readMessages([msg.key]);
                    } else {
                        throw err;
                    }
                }
                return;
            }
        }

        if (status.key && status.key.remoteJid === 'status@broadcast') {
            try {
                await sock.readMessages([status.key]);
                console.log('✅ Viewed status from key');
                
                await reactToStatus(sock, status.key);
            } catch (err) {
                if (err.message?.includes('rate-overlimit')) {
                    console.log('⚠️ Rate limit hit, waiting before retrying...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await sock.readMessages([status.key]);
                } else {
                    throw err;
                }
            }
            return;
        }
        if (status.reaction && status.reaction.key.remoteJid === 'status@broadcast') {
            try {
                await sock.readMessages([status.reaction.key]);
                console.log('✅ Viewed status from reaction');
                
                await reactToStatus(sock, status.reaction.key);
            } catch (err) {
                if (err.message?.includes('rate-overlimit')) {
                    console.log('⚠️ Rate limit hit, waiting before retrying...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await sock.readMessages([status.reaction.key]);
                } else {
                    throw err;
                }
            }
            return;
        }

    } catch (error) {
        console.error('❌ Error in auto status view:', error.message);
    }
}

module.exports = {
    command: 'autostatus',
    aliases: ['autoview', 'statusview'],
    category: 'owner',
    description: 'Automatically view and react to WhatsApp statuses',
    usage: '.autostatus <on|off|react on|react off>',
    ownerOnly: true,
    
    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        
        try {
            let config = readConfig();
            if (!args || args.length === 0) {
                const viewStatus = config.enabled ? '✅ Enabled' : '❌ Disabled';
                const reactStatus = config.reactOn ? '✅ Enabled' : '❌ Disabled';
                
                await sock.sendMessage(chatId, { 
                    text: `🔄 *Auto Status Settings*\n\n` +
                          `📱 *Auto Status View:* ${viewStatus}\n` +
                          `💫 *Status Reactions:* ${reactStatus}\n\n` +
                          `*Commands:*\n` +
                          `• \`.autostatus on\` - Enable auto view\n` +
                          `• \`.autostatus off\` - Disable auto view\n` +
                          `• \`.autostatus react on\` - Enable reaction\n` +
                          `• \`.autostatus react off\` - Disable reaction`,
                    ...channelInfo
                }, { quoted: message });
                return;
            }

            const command = args[0].toLowerCase();
            
            if (command === 'on') {
                config.enabled = true;
                writeConfig(config);
                
                await sock.sendMessage(chatId, { 
                    text: '✅ *Auto status view enabled!*\n\n' +
                          'Bot will now automatically view all contact statuses.',
                    ...channelInfo
                }, { quoted: message });
                
            } else if (command === 'off') {
                config.enabled = false;
                writeConfig(config);
                
                await sock.sendMessage(chatId, { 
                    text: '*Auto status view disabled!*\n\n' +
                          'Bot will no longer automatically view statuses.',
                    ...channelInfo
                }, { quoted: message });
                
            } else if (command === 'react') {
                if (!args[1]) {
                    await sock.sendMessage(chatId, { 
                        text: '*Please specify on/off for reactions!*\n\n' +
                              'Usage: `.autostatus react on/off`',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                
                const reactCommand = args[1].toLowerCase();
                
                if (reactCommand === 'on') {
                    config.reactOn = true;
                    writeConfig(config);
                    
                    await sock.sendMessage(chatId, { 
                        text: '💫 *Status reactions enabled!*\n\n' +
                              'Bot will now react to status updates with 💚',
                        ...channelInfo
                    }, { quoted: message });
                    
                } else if (reactCommand === 'off') {
                    config.reactOn = false;
                    writeConfig(config);
                    
                    await sock.sendMessage(chatId, { 
                        text: '*Status reactions disabled!*\n\n' +
                              'Bot will no longer react to status updates.',
                        ...channelInfo
                    }, { quoted: message });
                    
                } else {
                    await sock.sendMessage(chatId, { 
                        text: '*Invalid reaction command!*\n\n' +
                              'Usage: `.autostatus react on/off`',
                        ...channelInfo
                    }, { quoted: message });
                }
                
            } else {
                await sock.sendMessage(chatId, { 
                    text: '*Invalid command!*\n\n' +
                          '*Usage:*\n' +
                          '• `.autostatus on/off` - Enable/disable auto view\n' +
                          '• `.autostatus react on/off` - Enable/disable reactions',
                    ...channelInfo
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error in autostatus command:', error);
            await sock.sendMessage(chatId, { 
                text: '❌ *Error occurred while managing auto status!*\n\n' +
                      `Error: ${error.message}`,
                ...channelInfo
            }, { quoted: message });
        }
    },

    handleStatusUpdate,
    isAutoStatusEnabled,
    isStatusReactionEnabled,
    reactToStatus,
    readConfig,
    writeConfig
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
 
