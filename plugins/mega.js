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
 

const { File } = require('megajs');
const path = require('path');

module.exports = {
    command: 'mega',
    aliases: ['megadl'],
    category: 'download',
    description: 'Download from MEGA with real-time progress',
    usage: '.mega <mega-url>',

    async handler(sock, message, args, context = {}) {
        const { chatId } = context;
        const text = args.join(' ');

        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: `*Usage:* .mega https://mega.nz/file/xxxx#xxxx` 
            }, { quoted: message });
        }

        try {
            const file = File.fromURL(text);
            await file.loadAttributes();

            if (file.size >= 500 * 1024 * 1024) {
                return await sock.sendMessage(chatId, { text: '❌ *Error:* File too large (Limit: 500MB)' }, { quoted: message });
            }

            const { key } = await sock.sendMessage(chatId, { 
                text: `🌩️ *MEGA DOWNLOAD*\n\n▢ *File:* ${file.name}\n▢ *Size:* ${this.formatBytes(file.size)}\n\n*Progress:* 0% [░░░░░░░░░░]` 
            }, { quoted: message });

            const stream = file.download();
            let chunks = [];
            let lastUpdate = Date.now();

            stream.on('progress', async (info) => {
                const { bytesLoaded, bytesTotal } = info;
                const percentage = Math.floor((bytesLoaded / bytesTotal) * 100);

                if (Date.now() - lastUpdate > 3000 || percentage === 100) {
                    const bar = this.generateBar(percentage);
                    await sock.sendMessage(chatId, { 
                        text: `🌩️ *MEGA DOWNLOAD*\n\n▢ *File:* ${file.name}\n▢ *Size:* ${this.formatBytes(bytesTotal)}\n\n*Progress:* ${percentage}% [${bar}]`,
                        edit: key 
                    });
                    lastUpdate = Date.now();
                }
            });

            stream.on('data', (chunk) => chunks.push(chunk));

            stream.on('end', async () => {
                const buffer = Buffer.concat(chunks);
                const ext = path.extname(file.name).toLowerCase();
                
                const mimeTypes = {
                    '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.zip': 'application/zip',
                    '.apk': 'application/vnd.android.package-archive', '.png': 'image/png', '.jpg': 'image/jpeg'
                };

                await sock.sendMessage(chatId, {
                    document: buffer,
                    fileName: file.name,
                    mimetype: mimeTypes[ext] || 'application/octet-stream',
                    caption: `✅ *Download Complete*\n▢ *File:* ${file.name}\n▢ *Size:* ${this.formatBytes(file.size)}`
                }, { quoted: message });
            });

            stream.on('error', async (err) => {
                await sock.sendMessage(chatId, { text: `❌ *Download Error:* ${err.message}` });
            });

        } catch (error) {
            await sock.sendMessage(chatId, { text: `❌ *Error:* ${error.message}` });
        }
    },

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    generateBar(percentage) {
        const totalBars = 10;
        const filledBars = Math.floor((percentage / 100) * totalBars);
        return '█'.repeat(filledBars) + '░'.repeat(totalBars - filledBars);
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
 
          
