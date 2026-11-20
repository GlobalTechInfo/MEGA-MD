import 'dotenv/config';
const prefixes = process.env.PREFIXES ? process.env.PREFIXES.split(',') : ['.'];
const config = {
    // Bot Identity
    botName: process.env.BOT_NAME || 'WESLEY-AI',
    botOwner: process.env.BOT_OWNER || 'Wesley',
    ownerNumber: process.env.OWNER_NUMBER || '254738550932',
    author: process.env.AUTHOR || 'Wesley',
    packName: process.env.PACK_NAME || 'WESLEY-AI',
    description: process.env.DESCRIPTION || 'High performance multi-device WhatsApp bot',
    version: '6.0.0',
    // Bot Config
    prefixes: prefixes,
    prefix: prefixes[0],
    commandMode: process.env.COMMAND_MODE || 'public',
    timeZone: process.env.TIMEZONE || 'Africa/Nairobi',
   // links
    updateZipUrl: process.env.UPDATE_URL || 'https://github.com/GlobalTechInfo/MEGA-MD/archive/refs/heads/main.zip',
    ytChannel: process.env.YT_CHANNEL || 'Wesley',
    // Session
    sessionId: process.env.SESSION_ID || '',
    pairingNumber: process.env.PAIRING_NUMBER || '',
    // Performance
    port: Number(process.env.PORT) || 5000,
    maxStoreMessages: Number(process.env.MAX_STORE_MESSAGES) || 20,
    tempCleanupInterval: Number(process.env.CLEANUP_INTERVAL) || 1 * 60 * 60 * 1000,
    storeWriteInterval: Number(process.env.STORE_WRITE_INTERVAL) || 10000,
    // API Keys
    giphyApiKey: process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
    removeBgKey: process.env.REMOVEBG_KEY || '',
    // Warn system
    warnCount: 3,
    // External APIs
    APIs: {
        xteam: 'https://api.xteam.xyz',
        dzx: 'https://api.dhamzxploit.my.id',
        lol: 'https://api.lolhuman.xyz',
        violetics: 'https://violetics.pw',
        neoxr: 'https://api.neoxr.my.id',
        zenzapis: 'https://zenzapis.xyz',
        akuari: 'https://api.akuari.my.id',
        akuari2: 'https://apimu.my.id',
        nrtm: 'https://fg-nrtm.ddns.net',
        fgmods: 'https://api-fgmods.ddns.net'
    },
    APIKeys: {
        'https://api.xteam.xyz': 'd90a9e986e18778b',
        'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
        'https://api.neoxr.my.id': process.env.NEOXR_KEY || 'yourkey',
        'https://violetics.pw': 'beta',
        'https://zenzapis.xyz': process.env.ZENZAPIS_KEY || 'yourkey',
        'https://api-fgmods.ddns.net': 'fg-dylux'
    }
};
export default config;
