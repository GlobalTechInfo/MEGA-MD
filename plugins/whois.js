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

module.exports = {
  command: 'whois',
  aliases: ['domaininfo'],
  category: 'info',
  description: 'Get WHOIS information of a domain',
  usage: '.whois <domain>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    let domain = args?.[0]?.trim();

    if (!domain) {
      return await sock.sendMessage(chatId, { text: '*Provide a domain.*\nExample: .whois google.com' }, { quoted: message });
    }

    domain = domain.replace(/^https?:\/\//i, '');

    try {
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
        return await sock.sendMessage(chatId, { text: '❌ Invalid domain provided.' }, { quoted: message });
      }

      const apiUrl = `https://discardapi.dpdns.org/api/tools/whois?apikey=guru&domain=${encodeURIComponent(domain)}`;

      const { data } = await axios.get(apiUrl, { timeout: 10000 });

      if (!data?.status || !data.result?.domain) {
        return await sock.sendMessage(chatId, { text: '❌ Could not fetch WHOIS information.' }, { quoted: message });
      }

      const { domain: dom, registrar, registrant, technical } = data.result;

      const text =
        `🌐 *WHOIS Information*\n\n` +
        `• Domain: ${dom.domain}\n` +
        `• Name: ${dom.name}\n` +
        `• Extension: .${dom.extension}\n` +
        `• WHOIS Server: ${dom.whois_server}\n` +
        `• Status: ${dom.status.join(', ')}\n` +
        `• Name Servers: ${dom.name_servers.join(', ')}\n` +
        `• Created: ${dom.created_date_in_time}\n` +
        `• Updated: ${dom.updated_date_in_time}\n` +
        `• Expires: ${dom.expiration_date_in_time}\n\n` +
        `🏢 Registrar: ${registrar.name}\n` +
        `📞 Phone: ${registrar.phone}\n` +
        `📧 Email: ${registrar.email}\n` +
        `🔗 Website: ${registrar.referral_url}\n\n` +
        `👤 Registrant: ${registrant.organization || 'N/A'}\n` +
        `🌍 Country: ${registrant.country || 'N/A'}\n` +
        `📧 Email: ${registrant.email || 'N/A'}\n\n` +
        `⚙ Technical Email: ${technical.email || 'N/A'}`;

      await sock.sendMessage(chatId, { text }, { quoted: message });

    } catch (error) {
      console.error('WHOIS plugin error:', error);

      if (error.code === 'ECONNABORTED') {
        await sock.sendMessage(chatId, { text: '❌ Request timed out. The API may be slow or unreachable.' }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch WHOIS information.' }, { quoted: message });
      }
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
 
