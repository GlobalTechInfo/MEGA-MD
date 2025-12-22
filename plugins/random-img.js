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
 

const fetch = require('node-fetch');

const imageUrls = {
    chinese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/china.json',
    hijab: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/hijab.json',
    malaysia: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/malaysia.json',
    japanese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/japan.json',
    korean: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/korea.json',
    malay: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/malaysia.json',
    random: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/random.json',
    random2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/random2.json',
    thai: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/thailand.json',
    vietnamese: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/vietnam.json',
    indo: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/tiktokpics/indonesia.json',
    boneka: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/boneka.json',
    blackpink3: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/blackpink.json',
    bike: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/bike.json',
    antiwork: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/antiwork.json',
    aesthetic: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/aesthetic.json',
    justina: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/justina.json',
    doggo: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/doggo.json',
    cosplay2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cosplay.json',
    cat: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/cat.json',
    car: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/car.json',
    profile2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/profile.json',
    ppcouple2: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ppcouple.json',
    notnot: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/notnot.json',
    kpop: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/kpop.json',
    kayes: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/kayes.json',
    ulzzanggirl: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ulzzanggirl.json',
    ulzzangboy: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ulzzangboy.json',
    ryujin: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/ryujin.json',
    rose: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/rose.json',
    pubg: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/pubg.json',
    wallml: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/wallml.json',
    wallhp: 'https://raw.githubusercontent.com/GlobalTechInfo/GLOBAL-XMD/master/src/media/randompics/wallhp.json',
};

function pickRandom(arr, count = 1) {
    const result = [];
    const copy = [...arr];
    for (let i = 0; i < count; i++) {
        if (copy.length === 0) break;
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index, 1)[0]);
    }
    return result;
}

module.exports = {
    command: 'images',
    aliases: ['wallpics', 'pics'],
    category: 'menu',
    description: 'Send 3 random images for a given category',
    usage: '.images <category>',
    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const category = (args[0] || '').toLowerCase();
        if (!category || !imageUrls[category]) {
            const categoriesList = Object.keys(imageUrls)
                .map((c, i) => `┃ ${i + 1}. ${c}`)
                .join('\n');

            const menuText = `
╭──── *『 IMAGES 』* ──◆
┃ Available Categories:
${categoriesList}
┃
┃ *Usage example:*
┃   .images cat
╰━━━━━━━━━━━━━━────⊷
            `.trim();
            return await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
        }
        try {
            const res = await fetch(imageUrls[category]);
            if (!res.ok) throw new Error('Failed to fetch image dataset');

            const images = await res.json();

            if (!Array.isArray(images) || images.length === 0) {
                throw new Error('No images found in the dataset');
            }
            const selectedImages = pickRandom(images, 3);

            for (const img of selectedImages) {
                await sock.sendMessage(chatId, {
                    image: { url: img.url },
                    caption: `📷 Random ${category} image`
                }, { quoted: message });
            }

        } catch (err) {
            console.error('Images Command Error:', err);
            await sock.sendMessage(chatId, {
                text: '❌ An error occurred while processing your request. Please try again later.'
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
 