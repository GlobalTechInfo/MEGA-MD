const fetch = require('node-fetch');

module.exports = async function tinyurlCommand(sock, chatId, message, query) {
    if (!query || query.trim() === '') {
        return sock.sendMessage(chatId, { text: '*Please provide a URL to shorten.*\nExample: .tinyurl https://example.com' }, { quoted: message });
    }

    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(query)}`);
        const shortUrl = await response.text();

        if (!shortUrl) {
            return sock.sendMessage(chatId, { text: 'Error: Could not generate a short URL.' }, { quoted: message });
        }

        const output = `✨ *YOUR SHORT URL*\n\n` +
                       `🔗 *Original Link:*\n${query}\n\n` +
                       `✂️ *Shortened URL:*\n${shortUrl}`;

        await sock.sendMessage(chatId, { text: output }, { quoted: message });

    } catch (err) {
        console.error('TinyURL plugin error:', err);
        await sock.sendMessage(chatId, { text: 'Failed to shorten URL.' }, { quoted: message });
    }
};
