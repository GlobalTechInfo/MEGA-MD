module.exports = async function base64Command(sock, chatId, message, query) {
    try {
        let txt = message.quoted?.text || query || message.text;
        if (!txt) return sock.sendMessage(chatId, { text: '*Please provide text to encode.*\nExample: .base64 Hello World' }, { quoted: message });

        const encoded = Buffer.from(txt, 'utf-8').toString('base64');

        const output = `${encoded}`;

        await sock.sendMessage(chatId, { text: output }, { quoted: message });

    } catch (err) {
        console.error('Base64 plugin error:', err);
        await sock.sendMessage(chatId, { text: '❌Failed to encode text.' }, { quoted: message });
    }
};
