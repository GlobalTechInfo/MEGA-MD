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
    command: 'stoprent',
    aliases: ['stopclone', 'delrent'],
    category: 'owner',
    description: 'Stop a specific sub-bot or all sub-bots',
    usage: '.stoprent [number/all]',
    ownerOnly: 'true',

    async handler(sock, message, args, context = {}) {
        const { chatId } = context;

        if (!global.conns || global.conns.length === 0) {
            return await sock.sendMessage(chatId, { text: "❌ No sub-bots are currently running." }, { quoted: message });
        }

        if (!args[0]) {
            return await sock.sendMessage(chatId, { 
                text: `❌ Please provide a number from the list or type 'all'.\nExample: \`.stoprent 1\`` 
            }, { quoted: message });
        }

        if (args[0].toLowerCase() === 'all') {
            for (let conn of global.conns) {
                conn.logout();
                conn.end();
            }
            global.conns = [];
            return await sock.sendMessage(chatId, { text: "✅ All sub-bots have been stopped." }, { quoted: message });
        }

        const index = parseInt(args[0]) - 1;
        if (isNaN(index) || !global.conns[index]) {
            return await sock.sendMessage(chatId, { text: "❌ Invalid index number. Check `.listbebot` first." }, { quoted: message });
        }

        try {
            const target = global.conns[index];
            const targetJid = target.user.id;
            
            await target.logout();
            global.conns.splice(index, 1);
            
            await sock.sendMessage(chatId, { text: `✅ Stopped sub-bot: @${targetJid.split(':')[0]}`, mentions: [targetJid] }, { quoted: message });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(chatId, { text: "❌ Error while stopping the sub-bot." }, { quoted: message });
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
 
