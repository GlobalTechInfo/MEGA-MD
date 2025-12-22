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
  command: 'seo',
  aliases: ['seoanalyse', 'seotools'],
  category: 'tools',
  description: 'Get full SEO analysis of a website (split into multiple messages for WhatsApp)',
  usage: '.seo <url>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    let url = args?.[0]?.trim();

    if (!url) {
      return await sock.sendMessage(chatId, { text: '*Provide a website URL.*\nExample: .seo https://discardapi.dpdns.org' }, { quoted: message });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      return await sock.sendMessage(chatId, { text: '❌ Invalid URL provided.' }, { quoted: message });
    }

    try {
      const apiUrl = `https://discardapi.dpdns.org/api/tools/seo?apikey=guru&url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(apiUrl, { timeout: 10000 });

      if (!data?.status || !data.result) {
        return await sock.sendMessage(chatId, { text: '❌ Failed to fetch SEO data.' }, { quoted: message });
      }

      const r = data.result;
      const sendSection = async (title, contentArray) => {
        if (!contentArray?.length) return;
        let text = `🔹 *${title}*\n\n`;
        contentArray.forEach(line => {
          text += `• ${line}\n`;
        });
        
        const maxLength = 6000; // safe limit for WhatsApp
        for (let i = 0; i < text.length; i += maxLength) {
          await sock.sendMessage(chatId, { text: text.slice(i, i + maxLength) }, { quoted: message });
        }
      };

      await sendSection('Overview', [
        `Domain: ${r.overview.domain}`,
        `Rank: ${r.overview.rank}`,
        `Last Updated: ${r.overview.last_updated}`
      ]);
      await sendSection('Verification', r.verification.map(v => `${v.name}: ${v.value} (${v.description})`));

      await sendSection('Metrics', r.metrics.map(m => `${m.name}: ${m.score}`));

      await sendSection('Charset', r.charset?.map(c => `${c.name}: ${c.charset} (${c.details})`));

      if (r.meta_keywords) {
        await sendSection('Meta Keywords', [
          `Count: ${r.meta_keywords.count}`,
          `Keywords: ${r.meta_keywords.keywords.join(', ')}`
        ]);
      }

      if (r.google_preview) {
        await sendSection('Google Preview', [
          `Title: ${r.google_preview.title}`,
          `URL: ${r.google_preview.url}`,
          `Description: ${r.google_preview.description}`
        ]);
      }

      if (r.page_size) {
        await sendSection('Page Size', [
          `Document Size: ${r.page_size.document_size}`,
          `Code Size: ${r.page_size.code_size}`,
          `Text Size: ${r.page_size.text_size}`,
          `Code/Text Ratio: ${r.page_size.code_ratio}`
        ]);
      }

      if (r.cards?.length) {
        await sendSection('Traffic Stats', r.cards.map(c => `${c.title} (${c.subtitle}): ${c.value}`));
      }

      if (r.speed_tips?.length) {
        await sendSection('SEO Tips', r.speed_tips.map(t => `${t.name}: ${t.details}`));
      }

      if (r.broken_links?.length) {
        await sendSection('Broken Links', r.broken_links.map(l => `${l.text} (${l.url}) Status: ${l.status}`));
      }

      if (r.domain_available?.length) {
        await sendSection('Domain Availability', r.domain_available.map(d => `${d.domain}: ${d.status}`));
      }

      if (r.information_server?.header_text) {
        await sendSection('Server Info', [`Headers: ${r.information_server.header_text}`]);
      }

    } catch (error) {
      console.error('SEO plugin error:', error);

      if (error.code === 'ECONNABORTED') {
        await sock.sendMessage(chatId, { text: '❌ Request timed out. The API may be slow or unreachable.' }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch SEO information.' }, { quoted: message });
      }
    }
  }
};


/*
const axios = require('axios');

module.exports = {
  command: 'seo',
  aliases: ['seoanalyse', 'seotools'],
  category: 'tools',
  description: 'Get full SEO analysis of a website',
  usage: '.seo <url>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    let url = args?.[0]?.trim();

    if (!url) {
      return await sock.sendMessage(chatId, { text: '*Provide a website URL.*\nExample: .seo https://discardapi.dpdns.org' }, { quoted: message });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      return await sock.sendMessage(chatId, { text: '❌ Invalid URL provided.' }, { quoted: message });
    }

    try {
      const apiUrl = `https://discardapi.dpdns.org/api/tools/seo?apikey=guru&url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(apiUrl, { timeout: 10000 });

      if (!data?.status || !data.result) {
        return await sock.sendMessage(chatId, { text: '❌ Failed to fetch SEO data.' }, { quoted: message });
      }

      const r = data.result;

      let text = `🔍 *Full SEO Report*\n\n`;

      text += `🌐 *Overview*\n`;
      text += `• Domain: ${r.overview.domain}\n`;
      text += `• Rank: ${r.overview.rank}\n`;
      text += `• Last Updated: ${r.overview.last_updated}\n\n`;

      text += `✅ *Verification*\n`;
      r.verification.forEach(v => {
        text += `• ${v.name}: ${v.value} (${v.description})\n`;
      });
      text += `\n`;

      text += `📊 *Metrics*\n`;
      r.metrics.forEach(m => {
        text += `• ${m.name}: ${m.score}\n`;
      });
      text += `\n`;

      if (r.charset?.length) {
        text += `🔤 *Charset*\n`;
        r.charset.forEach(c => {
          text += `• ${c.name}: ${c.charset} (${c.details})\n`;
        });
        text += `\n`;
      }

      if (r.meta_keywords) {
        text += `🏷️ *Meta Keywords* (${r.meta_keywords.count})\n`;
        text += `• ${r.meta_keywords.keywords.join(', ')}\n\n`;
      }

      if (r.google_preview) {
        text += `🔎 *Google Preview*\n`;
        text += `• Title: ${r.google_preview.title}\n`;
        text += `• URL: ${r.google_preview.url}\n`;
        text += `• Description: ${r.google_preview.description}\n\n`;
      }

      if (r.page_size) {
        text += `📄 *Page Size*\n`;
        text += `• Document Size: ${r.page_size.document_size}\n`;
        text += `• Code Size: ${r.page_size.code_size}\n`;
        text += `• Text Size: ${r.page_size.text_size}\n`;
        text += `• Code/Text Ratio: ${r.page_size.code_ratio}\n\n`;
      }

      if (r.cards?.length) {
        text += `📈 *Traffic Stats*\n`;
        r.cards.forEach(c => {
          text += `• ${c.title} (${c.subtitle}): ${c.value}\n`;
        });
        text += `\n`;
      }

      if (r.speed_tips?.length) {
        text += `⚡ *SEO Tips*\n`;
        r.speed_tips.forEach(t => {
          text += `• ${t.name}: ${t.details}\n`;
        });
        text += `\n`;
      }

      if (r.broken_links?.length) {
        text += `🔗 *Broken Links*\n`;
        r.broken_links.forEach(l => {
          text += `• ${l.text} (${l.url}) Status: ${l.status}\n`;
        });
        text += `\n`;
      }

      if (r.domain_available?.length) {
        text += `🌐 *Domain Availability*\n`;
        r.domain_available.forEach(d => {
          text += `• ${d.domain}: ${d.status}\n`;
        });
        text += `\n`;
      }

      if (r.information_server?.header_text) {
        text += `🖥️ *Server Info*\n`;
        text += `• Headers: ${r.information_server.header_text}\n`;
      }

      await sock.sendMessage(chatId, { text }, { quoted: message });

    } catch (error) {
      console.error('SEO plugin error:', error);

      if (error.code === 'ECONNABORTED') {
        await sock.sendMessage(chatId, { text: '❌ Request timed out. The API may be slow or unreachable.' }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch SEO information.' }, { quoted: message });
      }
    }
  }
};
   */
   
   
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
 
