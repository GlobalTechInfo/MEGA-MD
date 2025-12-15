const Qasim = require('api-qasim');

module.exports = async function apkCommand(sock, chatId, message, query) {
    if (!query || query.trim() === '') {
        return sock.sendMessage(chatId, { text: '*Please provide an APK name to search for.*\nExample: .android Telegram' }, { quoted: message });
    }

    await sock.sendMessage(chatId, { text: 'Searching for APKs...' }, { quoted: message });

    try {
        const res = await Qasim.apksearch(query);
        if (!res?.data || !Array.isArray(res.data) || res.data.length === 0) {
            return sock.sendMessage(chatId, { text: 'No APKs found for your search term.' }, { quoted: message });
        }

        const infoText = res.data.map((item, i) => {
            const title = item.judul || 'Unknown';
            const developer = item.dev || 'Unknown';
            const version = item.rating || 'Unknown';
            const url = item.link || 'No URL';
            return `*${i + 1}.* ${title} - ${developer} (Version: ${version})\n🔗 ${url}`;
        }).join('\n\n');

        await sock.sendMessage(chatId, { text: `📱 Available APKs for *${query.trim()}*:\n\n${infoText}` }, { quoted: message });

    } catch (err) {
        console.error('APK plugin error:', err);
        await sock.sendMessage(chatId, { text: 'Failed to fetch APKs.' }, { quoted: message });
    }
};
