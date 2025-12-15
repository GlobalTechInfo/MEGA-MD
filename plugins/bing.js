const axios = require('axios');

module.exports = async function bingCommand(sock, chatId, message, query) {
    try {
        if (!query || query.trim() === '') {
            await sock.sendMessage(
                chatId,
                { text: 'Please provide something to search.\nExample: .bing Pakistan' },
                { quoted: message }
            );
            return;
        }

        const url = `https://discardapi.dpdns.org/api/search/bing?apikey=qasim&query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        const data = response.data;

        if (
            !data?.status ||
            !data?.result?.status ||
            !Array.isArray(data.result.results.results) ||
            data.result.results.results.length === 0
        ) {
            await sock.sendMessage(
                chatId,
                { text: 'No search results found.' },
                { quoted: message }
            );
            return;
        }

        const results = data.result.results.results.slice(0, 5);

        const text =
            `🔍 *Bing Search Results*\n\n` +
            results
                .map(
                    (r, i) =>
                        `「 ${i + 1} 」 *${r.title}*\n${r.description}\n🔗 ${r.url}`
                )
                .join('\n\n');

        await sock.sendMessage(
            chatId,
            { text },
            { quoted: message }
        );
    } catch (error) {
        console.error('Bing plugin error:', error);
        await sock.sendMessage(
            chatId,
            { text: 'Failed to fetch Bing search results.' },
            { quoted: message }
        );
    }
};
