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
  command: 'pingweb',
  aliases: ['pweb'],
  category: 'general',
  description: 'Check bot response time and ping a website',
  usage: '.pingweb [website URL]',
  
  async handler(sock, message, args, context) {
    const { chatId, channelInfo, rawText } = context;
    
    const prefix = rawText.match(/^[.!#]/)?.[0] || '.';
    const commandPart = rawText.slice(prefix.length).trim();
    const parts = commandPart.split(/\s+/);
    const url = parts.slice(1).join(' ').trim();
    
    const startBot = Date.now();
    const sent = await sock.sendMessage(chatId, { 
      text: '🏓 Pinging...',
      ...channelInfo
    }, { quoted: message });
    const endBot = Date.now();
    const botLatency = endBot - startBot;
    
    let responseText = `🏓 *Pong!*\n\n📶 *Bot Latency:* ${botLatency}ms`;
    
    if (url) {
      try {
        let testUrl = url;
        if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
          testUrl = 'https://' + testUrl;
        }
        
        const urlObj = new URL(testUrl);
        
        const startWeb = Date.now();
        const response = await axios.get(testUrl, {
          timeout: 10000,
          validateStatus: () => true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const endWeb = Date.now();
        const webLatency = endWeb - startWeb;
        
        responseText += `\n\n🌐 *Website:* ${urlObj.hostname}`;
        responseText += `\n⚡ *Response Time:* ${webLatency}ms`;
        responseText += `\n📡 *Status:* ${response.status} ${response.statusText}`;
        responseText += `\n✅ *Reachable:* Yes`;
        
      } catch (error) {
        if (error.code === 'ENOTFOUND') {
          responseText += `\n\n🌐 *Website:* ${url}`;
          responseText += `\n❌ *Error:* Domain not found`;
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          responseText += `\n\n🌐 *Website:* ${url}`;
          responseText += `\n❌ *Error:* Connection timeout`;
        } else if (error.message.includes('Invalid URL')) {
          responseText += `\n\n❌ *Invalid URL format*`;
          responseText += `\n💡 Example: .ping google.com`;
        } else {
          responseText += `\n\n🌐 *Website:* ${url}`;
          responseText += `\n❌ *Error:* ${error.message}`;
        }
      }
    } else {
      responseText += `\n\n💡 *Tip:* Use \`.ping <url>\` to test website response time`;
      responseText += `\n📝 *Example:* .ping google.com`;
    }
    
    await sock.sendMessage(chatId, {
      text: responseText,
      edit: sent.key,
      ...channelInfo
    });
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
 
