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
 


const axios = require('axios');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { uploadImage } = require('../lib/uploadImage');

async function getQuotedOrOwnImageUrl(sock, message) {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage) {
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        return await uploadImage(buffer);
    }
    if (message.message?.imageMessage) {
        const stream = await downloadContentFromMessage(message.message.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        return await uploadImage(buffer);
    }
    let targetJid;
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    if (ctx?.mentionedJid?.length > 0) {
        targetJid = ctx.mentionedJid[0];
    } else if (ctx?.participant) {
        targetJid = ctx.participant;
    } else {
        targetJid = message.key.participant || message.key.remoteJid;
    }

    try {
        const url = await sock.profilePictureUrl(targetJid, 'image');
        return url;
    } catch {
        return 'https://i.imgur.com/2wzGhpF.png';
    }
}

async function handleHeart(sock, chatId, message) {
    try {
        const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
        const url = `https://api.some-random-api.com/canvas/misc/heart?avatar=${encodeURIComponent(avatarUrl)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
    } catch (error) {
        console.error('Error in misc heart:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to create heart image. Try again later.' }, { quoted: message });
    }
}

module.exports = {
    command: 'canvas',
    aliases: ['canvas', 'overlay'],
    category: 'menu',
    description: 'Generate various fun images using avatar',
    usage: '.canvas <type> [args]',

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const sub = (args[0] || '').toLowerCase();
        const rest = args.slice(1);

        async function simpleAvatarOnly(endpoint) {
            const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
            const url = `https://api.some-random-api.com/canvas/misc/${endpoint}?avatar=${encodeURIComponent(avatarUrl)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
        }

        try {
            switch (sub) {
                case 'heart':
                    await simpleAvatarOnly('heart');
                    break;
                
                case 'horny':
                    await simpleAvatarOnly('horny');
                    break;
                case 'circle':
                    await simpleAvatarOnly('circle');
                    break;
                case 'lgbt':
                    await simpleAvatarOnly('lgbt');
                    break;
                case 'lolice':
                    await simpleAvatarOnly('lolice');
                    break;
                case 'simpcard':
                    await simpleAvatarOnly('simpcard');
                    break;
                case 'tonikawa':
                    await simpleAvatarOnly('tonikawa');
                    break;

                case 'its-so-stupid': {
                    const dog = rest.join(' ').trim();
                    if (!dog) {
                        await sock.sendMessage(chatId, { text: '❌ *Usage:* `.canvas its-so-stupid <text>`' }, { quoted: message });
                        return;
                    }
                    const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                    const url = `https://api.some-random-api.com/canvas/misc/its-so-stupid?dog=${encodeURIComponent(dog)}&avatar=${encodeURIComponent(avatarUrl)}`;
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                    break;
                }

                case 'namecard': {
                    const joined = rest.join(' ');
                    const [username, birthday, description] = joined.split('|').map(s => (s || '').trim());
                    if (!username || !birthday) {
                        await sock.sendMessage(chatId, { text: '❌ *Usage:* `.canvas namecard username|birthday|description(optional)`' }, { quoted: message });
                        return;
                    }
                    const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                    const params = new URLSearchParams({ username, birthday, avatar: avatarUrl });
                    if (description) params.append('description', description);
                    const url = `https://api.some-random-api.com/canvas/misc/namecard?${params.toString()}`;
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                    break;
                }

                case 'tweet': {
                    const joined = rest.join(' ');
                    const [displayname, username, comment, theme] = joined.split('|').map(s => (s || '').trim());
                    if (!displayname || !username || !comment) {
                        await sock.sendMessage(chatId, { text: '❌ *Usage:* `.canvas tweet displayname|username|comment|theme(optional)`' }, { quoted: message });
                        return;
                    }
                    const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                    const params = new URLSearchParams({ displayname, username, comment, avatar: avatarUrl });
                    if (theme) params.append('theme', theme);
                    const url = `https://api.some-random-api.com/canvas/misc/tweet?${params.toString()}`;
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                    break;
                }

                case 'youtube-comment': {
                    const joined = rest.join(' ');
                    const [username, comment] = joined.split('|').map(s => (s || '').trim());
                    if (!username || !comment) {
                        await sock.sendMessage(chatId, { text: '❌ *Usage:* `.canvas youtube-comment username|comment`' }, { quoted: message });
                        return;
                    }
                    const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                    const params = new URLSearchParams({ username, comment, avatar: avatarUrl });
                    const url = `https://api.some-random-api.com/canvas/misc/youtube-comment?${params.toString()}`;
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                    break;
                }
                case 'comrade':
                case 'gay':
                case 'glass':
                case 'jail':
                case 'passed':
                case 'triggered': {
                    const avatarUrl = await getQuotedOrOwnImageUrl(sock, message);
                    const overlay = sub;
                    const url = `https://api.some-random-api.com/canvas/overlay/${overlay}?avatar=${encodeURIComponent(avatarUrl)}`;
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    await sock.sendMessage(chatId, { image: Buffer.from(response.data) }, { quoted: message });
                    break;
                }

                default:
                    await sock.sendMessage(chatId, { 
                        text: '*🎨 MISC COMMANDS*\n\n' +
                              '*Simple overlays:*\n' +
                              '• heart\n' +
                              '• horny\n' +
                              '• circle\n' +
                              '• lgbt\n' +
                              '• lolice\n' +
                              '• simpcard\n' +
                              '• tonikawa\n' +
                              '• comrade\n' +
                              '• gay\n' +
                              '• glass\n' +
                              '• jail\n' +
                              '• passed\n' +
                              '• triggered\n\n' +
                              '*With text:*\n\n' +
                              '• its-so-stupid <text>\n' +
                              '• namecard user|birthday|desc\n' +
                              '• tweet name|user|comment|theme\n' +
                              '• youtube-comment user|comment'
                    }, { quoted: message });
                    break;
            }
        } catch (error) {
            console.error('Error in misc command:', error);
            await sock.sendMessage(chatId, { text: '❌ *Failed to generate image*\n\nCheck your parameters and try again.' }, { quoted: message });
        }
    },

    handleHeart
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
 