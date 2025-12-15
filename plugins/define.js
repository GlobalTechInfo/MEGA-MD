const axios = require('axios');

module.exports = async function urbanCommand(sock, chatId, message, query) {
    if (!query || query.trim() === '') {
        return sock.sendMessage(chatId, { text: 'Please provide a word to search for.' }, { quoted: message });
    }
    try {
        const url = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`;
        const { data: json } = await axios.get(url);

        if (!json?.list || json.list.length === 0) {
            return sock.sendMessage(chatId, { text: 'Word not found in the dictionary.' }, { quoted: message });
        }
        const firstEntry = json.list[0];
        const definition = firstEntry.definition || 'No definition available';
        const example = firstEntry.example ? `*Example:* ${firstEntry.example}` : '';

        const text = `*Word:* ${query}\n*Definition:* ${definition}\n${example}`;
        await sock.sendMessage(chatId, { text }, { quoted: message });

    } catch (error) {
        console.error('Urban plugin error:', error);
        await sock.sendMessage(chatId, { text: 'Failed to fetch definition.' }, { quoted: message });
    }
};
