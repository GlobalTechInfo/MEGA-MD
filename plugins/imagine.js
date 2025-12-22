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
  command: 'imagine',
  aliases: ['aiimage', 'draw', 'genimage'],
  category: 'ai',
  description: 'Generate an AI image based on your prompt',
  usage: '.imagine <prompt>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const imagePrompt = args.join(' ').trim();

    if (!imagePrompt) {
      await sock.sendMessage(chatId, {
        text: 'Please provide a prompt for the image generation.\nExample: .imagine a beautiful sunset over mountains'
      }, { quoted: message });
      return;
    }
    await sock.sendMessage(chatId, {
      text: '🎨 Generating your image... Please wait.'
    }, { quoted: message });

    try {
      const enhancedPrompt = enhancePrompt(imagePrompt);

      const response = await axios.get(`https://shizoapi.onrender.com/api/ai/imagine?apikey=shizo&query=${encodeURIComponent(enhancedPrompt)}`, {
        responseType: 'arraybuffer'
      });

      const imageBuffer = Buffer.from(response.data);

      await sock.sendMessage(chatId, {
        image: imageBuffer,
        caption: `🎨 Generated image for prompt: "${imagePrompt}"`
      }, { quoted: message });

    } catch (error) {
      console.error('Error in imagine command:', error);
      await sock.sendMessage(chatId, {
        text: '❌ Failed to generate image. Please try again later.'
      }, { quoted: message });
    }
  }
};

// Function to enhance the prompt
function enhancePrompt(prompt) {
  const qualityEnhancers = [
    'high quality',
    'detailed',
    'masterpiece',
    'best quality',
    'ultra realistic',
    '4k',
    'highly detailed',
    'professional photography',
    'cinematic lighting',
    'sharp focus'
  ];

  const numEnhancers = Math.floor(Math.random() * 2) + 3;
  const selectedEnhancers = qualityEnhancers
    .sort(() => Math.random() - 0.5)
    .slice(0, numEnhancers);

  return `${prompt}, ${selectedEnhancers.join(', ')}`;
}


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
 
