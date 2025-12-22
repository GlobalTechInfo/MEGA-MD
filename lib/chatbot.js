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
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/autoAi.json');

let AUTO_AI_ENABLED = false;
let lastReplyTime = 0;

function loadState() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE));
            return data.enabled || false;
        }
    } catch {}
    return false;
}

function saveState(state) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({ enabled: state }, null, 2)
    );
}

AUTO_AI_ENABLED = loadState();

async function handleAutoAiCommand(sock, chatId, message, isOwner) {
    if (!isOwner) return;

    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';

    const arg = text.split(' ')[1];

    if (!['on', 'off'].includes(arg)) {
        await sock.sendMessage(chatId, {
            text: '*Usage:*\n.autochat on/off'
        }, { quoted: message });
        return;
    }

    AUTO_AI_ENABLED = arg === 'on';
    saveState(AUTO_AI_ENABLED);

    await sock.sendMessage(chatId, {
        text: AUTO_AI_ENABLED
            ? '*✅ Auto AI chat enabled*'
            : '*❌ Auto AI chat disabled*'
    }, { quoted: message });

    attachListener(sock);
}

function attachListener(sock) {
    if (sock.__autoAiAttached) return;

    sock.ev.on('messages.upsert', async ({ messages }) => {
        if (!AUTO_AI_ENABLED) return;

        for (const m of messages) {
            try {
                if (!m?.message) continue;
                if (m.key.fromMe) continue;

                if (
                    m.message.imageMessage ||
                    m.message.videoMessage ||
                    m.message.stickerMessage ||
                    m.message.reactionMessage
                ) continue;

                const text =
                    m.message.conversation ||
                    m.message.extendedTextMessage?.text ||
                    '';

                if (!text) continue;

                /* Ignore quoted replies */
                if (m.message.extendedTextMessage?.contextInfo?.quotedMessage)
                    continue;

                /* Ignore commands */
                if (/^[!./#]/.test(text)) continue;

                /* Anti-spam throttle */
                const now = Date.now();
                if (now - lastReplyTime < 3000) continue;

                const query = encodeURIComponent(text);

                const res = await axios.get(
                    `https://hercai.onrender.com/gemini/hercai?question=${query}`,
                    { timeout: 10000 }
                );

                const reply = res?.data?.reply;
                if (!reply) continue;

                const finalReply = reply
                    .replace(/google/gi, 'qasim')
                    .replace(/a large language model/gi, 'my bot');

                await sock.sendMessage(
                    m.key.remoteJid,
                    { text: finalReply },
                    { quoted: m }
                );

                lastReplyTime = now;
            } catch (err) {
                console.log('AUTO AI ERROR:', err.message);
            }
        }
    });

    sock.__autoAiAttached = true;
}

module.exports = handleAutoAiCommand

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
 
