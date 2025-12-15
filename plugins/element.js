const axios = require('axios');

module.exports = async function elementCommand(sock, chatId, message, query) {
    if (!query) return sock.sendMessage(chatId, { text: 'Provide element name or symbol.\nExample: .element H' }, { quoted: message });
    try {
        const { data: json } = await axios.get(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(query)}`);
        if (!json?.name) return sock.sendMessage(chatId, { text: '❌ Element not found.' }, { quoted: message });
        const text = `🧪 *Element Info*\n• Name: ${json.name}\n• Symbol: ${json.symbol}\n• Atomic #: ${json.atomic_number}\n• Atomic Mass: ${json.atomic_mass}\n• Period: ${json.period}\n• Phase: ${json.phase}\n• Discovered By: ${json.discovered_by || 'Unknown'}\n\n📘 Summary:\n${json.summary}`;
        await sock.sendMessage(chatId, { image: { url: json.image }, caption: text }, { quoted: message });
    } catch (e) {
        console.error(e);
        await sock.sendMessage(chatId, { text: 'Failed to fetch element info.' }, { quoted: message });
    }
};
